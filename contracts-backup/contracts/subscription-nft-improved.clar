;; Satscribe 改進版訂閱章 NFT 合約
;; 整合自動分潤功能

;; 導入分潤合約
(use-trait revenue-splitter-trait .revenue-splitter)

;; 定义常量
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-already-exists (err u102))
(define-constant err-not-found (err u103))
(define-constant err-subscription-expired (err u104))

;; 分潤合約地址
(define-constant REVENUE_SPLITTER_CONTRACT .revenue-splitter)

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
    metadata-uri: (string-ascii 200),
    price-paid: uint
  }
)

;; 用户订阅记录
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
    tier: (string-ascii 20),
    revenue-split-enabled: bool  ;; 新增：是否啟用分潤
  }
)

;; 获取下一个 token ID
(define-private (get-next-token-id)
  (begin
    (var-set last-token-id (+ (var-get last-token-id) u1))
    (var-get last-token-id)
  )
)

;; 创建新季度（改進版）
(define-public (create-season 
  (season-id uint) 
  (price uint) 
  (max-supply uint) 
  (expiry-date uint) 
  (tier (string-ascii 20))
  (enable-revenue-split bool))
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
          tier: tier,
          revenue-split-enabled: enable-revenue-split
        }
      )
      (ok season-id)
    )
  )
)

;; 改進版 NFT 鑄造（整合分潤）
(define-public (mint-subscription (creator principal) (season-id uint) (metadata-uri (string-ascii 200)))
  (let
    (
      (subscriber tx-sender)
      (token-id (get-next-token-id))
      (season-info (unwrap! (map-get? creator-seasons { creator: creator, season-id: season-id }) err-not-found))
      (price (get price season-info))
    )
    (begin
      ;; 基本檢查
      (asserts! (is-none (map-get? user-subscriptions { subscriber: subscriber, creator: creator, season-id: season-id })) err-already-exists)
      (asserts! (get active season-info) err-not-authorized)
      (asserts! (< (get current-supply season-info) (get max-supply season-info)) err-not-authorized)
      
      ;; 關鍵改進：根據是否啟用分潤來處理支付
      (if (get revenue-split-enabled season-info)
        ;; 啟用分潤：將錢轉到本合約，然後觸發分潤
        (begin
          (try! (stx-transfer? price subscriber (as-contract tx-sender)))
          ;; 調用分潤合約
          (try! (contract-call? REVENUE_SPLITTER_CONTRACT distribute-nft-revenue creator price))
        )
        ;; 未啟用分潤：直接轉給創作者
        (try! (stx-transfer? price subscriber creator))
      )
      
      ;; 鑄造 NFT
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
          metadata-uri: metadata-uri,
          price-paid: price
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
      
      ;; 更新創作者統計（調用創作者註冊表）
      (try! (contract-call? .creator-registry update-stats creator price u0 1 1))
      
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

;; 緊急功能：暫停/恢復季度銷售
(define-public (toggle-season-status (season-id uint))
  (let
    ((creator tx-sender)
     (season-info (unwrap! (map-get? creator-seasons { creator: creator, season-id: season-id }) err-not-found)))
    (begin
      (map-set creator-seasons
        { creator: creator, season-id: season-id }
        (merge season-info { active: (not (get active season-info)) })
      )
      (ok (not (get active season-info)))
    )
  )
)