;; Satscribe 收益分润合约
;; 支持动态配置的工作室成员分润机制

;; 定义常量
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u200))
(define-constant err-not-authorized (err u201))
(define-constant err-invalid-percentage (err u202))
(define-constant err-creator-not-found (err u203))
(define-constant err-insufficient-balance (err u204))

;; 分润成员结构
(define-map revenue-splits
  { creator: principal }
  {
    members: (list 10 { wallet: principal, percentage: uint, role: (string-ascii 50) }),
    lightning-enabled: bool,
    nft-enabled: bool,
    last-updated: uint
  }
)

;; 待分发收益记录
(define-map pending-payouts
  { creator: principal, payout-id: uint }
  {
    total-amount: uint,
    payout-type: (string-ascii 20), ;; "nft" or "lightning"
    timestamp: uint,
    distributed: bool
  }
)

;; 创作者的最后分红ID
(define-data-var last-payout-id uint u0)

;; 获取下一个分红ID
(define-private (get-next-payout-id)
  (begin
    (var-set last-payout-id (+ (var-get last-payout-id) u1))
    (var-get last-payout-id)
  )
)

;; 设置创作者的分润配置
(define-public (set-revenue-split 
  (members (list 10 { wallet: principal, percentage: uint, role: (string-ascii 50) }))
  (lightning-enabled bool)
  (nft-enabled bool))
  (let
    ((creator tx-sender)
     (total-percentage (fold check-and-sum-percentage members u0)))
    (begin
      ;; 检查总百分比是否为100
      (asserts! (is-eq total-percentage u100) err-invalid-percentage)
      
      ;; 保存分润配置
      (map-set revenue-splits
        { creator: creator }
        {
          members: members,
          lightning-enabled: lightning-enabled,
          nft-enabled: nft-enabled,
          last-updated: block-height
        }
      )
      (ok true)
    )
  )
)

;; 辅助函数：检查并累加百分比
(define-private (check-and-sum-percentage 
  (member { wallet: principal, percentage: uint, role: (string-ascii 50) })
  (current-sum uint))
  (+ current-sum (get percentage member))
)

;; NFT 销售收益分润
(define-public (distribute-nft-revenue (creator principal) (total-amount uint))
  (let
    (
      (payout-id (get-next-payout-id))
      (split-config (unwrap! (map-get? revenue-splits { creator: creator }) err-creator-not-found))
    )
    (begin
      ;; 检查是否启用NFT分润
      (asserts! (get nft-enabled split-config) err-not-authorized)
      
      ;; 记录待分发收益
      (map-set pending-payouts
        { creator: creator, payout-id: payout-id }
        {
          total-amount: total-amount,
          payout-type: "nft",
          timestamp: block-height,
          distributed: false
        }
      )
      
      ;; 执行分润
      (try! (execute-payout creator payout-id total-amount (get members split-config)))
      
      ;; 标记为已分发
      (map-set pending-payouts
        { creator: creator, payout-id: payout-id }
        {
          total-amount: total-amount,
          payout-type: "nft",
          timestamp: block-height,
          distributed: true
        }
      )
      
      (ok payout-id)
    )
  )
)

;; Lightning 打赏收益分润
(define-public (distribute-lightning-revenue (creator principal) (total-amount uint))
  (let
    (
      (payout-id (get-next-payout-id))
      (split-config (unwrap! (map-get? revenue-splits { creator: creator }) err-creator-not-found))
    )
    (begin
      ;; 检查是否启用Lightning分润
      (asserts! (get lightning-enabled split-config) err-not-authorized)
      
      ;; 记录待分发收益
      (map-set pending-payouts
        { creator: creator, payout-id: payout-id }
        {
          total-amount: total-amount,
          payout-type: "lightning",
          timestamp: block-height,
          distributed: false
        }
      )
      
      ;; 执行分润
      (try! (execute-payout creator payout-id total-amount (get members split-config)))
      
      ;; 标记为已分发
      (map-set pending-payouts
        { creator: creator, payout-id: payout-id }
        {
          total-amount: total-amount,
          payout-type: "lightning",
          timestamp: block-height,
          distributed: true
        }
      )
      
      (ok payout-id)
    )
  )
)

;; 执行实际的分润支付
(define-private (execute-payout 
  (creator principal) 
  (payout-id uint) 
  (total-amount uint)
  (members (list 10 { wallet: principal, percentage: uint, role: (string-ascii 50) })))
  (begin
    (try! (fold process-member-payout members (ok { creator: creator, total: total-amount })))
    (ok true)
  )
)

;; 处理单个成员的分润
(define-private (process-member-payout
  (member { wallet: principal, percentage: uint, role: (string-ascii 50) })
  (result (response { creator: principal, total: uint } uint)))
  (match result
    success-data
      (let
        ((payout-amount (/ (* (get total success-data) (get percentage member)) u100)))
        (begin
          ;; 转账给成员
          (try! (as-contract (stx-transfer? payout-amount tx-sender (get wallet member))))
          (ok success-data)
        )
      )
    error-code (err error-code)
  )
)

;; 查询创作者的分润配置
(define-read-only (get-revenue-split (creator principal))
  (map-get? revenue-splits { creator: creator })
)

;; 查询分红记录
(define-read-only (get-payout-info (creator principal) (payout-id uint))
  (map-get? pending-payouts { creator: creator, payout-id: payout-id })
)

;; 预览分润计算
(define-read-only (preview-split (creator principal) (amount uint))
  (match (map-get? revenue-splits { creator: creator })
    split-config
      (let
        ((members (get members split-config)))
        (ok (map calculate-member-share members))
      )
    (err err-creator-not-found)
  )
)

;; 计算成员应得份额
(define-private (calculate-member-share 
  (member { wallet: principal, percentage: uint, role: (string-ascii 50) }))
  {
    wallet: (get wallet member),
    percentage: (get percentage member),
    role: (get role member)
  }
)