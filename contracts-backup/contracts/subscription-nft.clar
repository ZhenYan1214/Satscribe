;; Satscribe 订阅章 NFT 合约 (Soulbound Token)
;; 不可转让的订阅凭证，具有纪念价值

;; 定义常量
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-already-exists (err u102))
(define-constant err-not-found (err u103))
(define-constant err-subscription-expired (err u104))

;; 定义数据变量
(define-data-var last-token-id uint u0)

;; NFT 定义
(define-non-fungible-token subscription-nft uint)

;; 订阅章数据结构
(define-map subscription-data
  { token-id: uint }
  {
    creator: principal,
    subscriber: principal,
    season-id: uint,
    issue-date: uint,
    expiry-date: uint,
    tier: (string-ascii 20),
    metadata-uri: (string-ascii 200)
  }
)

;; 用户订阅记录 (每个创作者每期限购一次)
(define-map user-subscriptions
  { subscriber: principal, creator: principal, season-id: uint }
  { token-id: uint, active: bool }
)

;; 创作者季度设置
(define-map creator-seasons
  { creator: principal, season-id: uint }
  {
    price: uint,
    max-supply: uint,
    current-supply: uint,
    active: bool,
    expiry-date: uint,
    tier: (string-ascii 20)
  }
)

;; 获取下一个 token ID
(define-private (get-next-token-id)
  (begin
    (var-set last-token-id (+ (var-get last-token-id) u1))
    (var-get last-token-id)
  )
)

;; 创建新季度
(define-public (create-season (season-id uint) (price uint) (max-supply uint) (expiry-date uint) (tier (string-ascii 20)))
  (let
    ((creator tx-sender))
    (begin
      (asserts! (is-none (map-get? creator-seasons { creator: creator, season-id: season-id })) err-already-exists)
      (map-set creator-seasons
        { creator: creator, season-id: season-id }
        {
          price: price,
          max-supply: max-supply,
          current-supply: u0,
          active: true,
          expiry-date: expiry-date,
          tier: tier
        }
      )
      (ok season-id)
    )
  )
)

;; 铸造订阅章 NFT
(define-public (mint-subscription (creator principal) (season-id uint) (metadata-uri (string-ascii 200)))
  (let
    (
      (subscriber tx-sender)
      (token-id (get-next-token-id))
      (season-info (unwrap! (map-get? creator-seasons { creator: creator, season-id: season-id }) err-not-found))
    )
    (begin
      ;; 检查是否已经购买过该期
      (asserts! (is-none (map-get? user-subscriptions { subscriber: subscriber, creator: creator, season-id: season-id })) err-already-exists)
      
      ;; 检查季度是否活跃
      (asserts! (get active season-info) err-not-authorized)
      
      ;; 检查是否超过最大供应量
      (asserts! (< (get current-supply season-info) (get max-supply season-info)) err-not-authorized)
      
      ;; 支付 STX
      (try! (stx-transfer? (get price season-info) subscriber creator))
      
      ;; 铸造 NFT
      (try! (nft-mint? subscription-nft token-id subscriber))
      
      ;; 存储订阅数据
      (map-set subscription-data
        { token-id: token-id }
        {
          creator: creator,
          subscriber: subscriber,
          season-id: season-id,
          issue-date: block-height,
          expiry-date: (get expiry-date season-info),
          tier: (get tier season-info),
          metadata-uri: metadata-uri
        }
      )
      
      ;; 记录用户订阅
      (map-set user-subscriptions
        { subscriber: subscriber, creator: creator, season-id: season-id }
        { token-id: token-id, active: true }
      )
      
      ;; 更新供应量
      (map-set creator-seasons
        { creator: creator, season-id: season-id }
        (merge season-info { current-supply: (+ (get current-supply season-info) u1) })
      )
      
      (ok token-id)
    )
  )
)

;; 检查订阅是否有效
(define-read-only (is-subscription-valid (subscriber principal) (creator principal) (season-id uint))
  (match (map-get? user-subscriptions { subscriber: subscriber, creator: creator, season-id: season-id })
    subscription-record 
      (let
        ((token-data (unwrap! (map-get? subscription-data { token-id: (get token-id subscription-record) }) false)))
        (and 
          (get active subscription-record)
          (< block-height (get expiry-date token-data))
        )
      )
    false
  )
)

;; 获取用户的所有订阅章
(define-read-only (get-user-subscriptions (subscriber principal))
  (ok "查询功能需要链下索引支持")
)

;; 获取 NFT 所有者 (覆盖默认函数以禁止转让)
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? subscription-nft token-id))
)

;; 禁止转让 (Soulbound)
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  err-not-authorized
)

;; 获取订阅章信息
(define-read-only (get-subscription-info (token-id uint))
  (map-get? subscription-data { token-id: token-id })
)

;; 获取创作者季度信息
(define-read-only (get-season-info (creator principal) (season-id uint))
  (map-get? creator-seasons { creator: creator, season-id: season-id })
)