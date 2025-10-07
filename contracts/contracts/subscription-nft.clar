;; title: subscription-nft  
;; version: 1.0.0
;; summary: Satscribe Subscription NFT Contract (Soulbound Token)
;; description: Non-transferable subscription tokens with commemorative value, integrated auto revenue split

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-already-exists (err u102))
(define-constant err-not-found (err u103))
(define-constant err-subscription-expired (err u104))

;; Define data variables
(define-data-var last-token-id uint u0)

;; NFT definition
(define-non-fungible-token subscription-nft uint)

;; Subscription NFT data structure
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

;; User subscription records (one purchase per creator per season)
(define-map user-subscriptions
  { subscriber: principal, creator: principal, season-id: uint }
  { token-id: uint, active: bool }
)

;; Creator season settings
(define-map creator-seasons
  { creator: principal, season-id: uint }
  {
    price: uint,
    max-supply: uint,
    current-supply: uint,
    active: bool,
    expiry-date: uint,
    tier: (string-ascii 20),
    revenue-split-enabled: bool
  }
)

;; Get next token ID
(define-private (get-next-token-id)
  (begin
    (var-set last-token-id (+ (var-get last-token-id) u1))
    (var-get last-token-id)
  )
)

;; Create new season
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

;; Mint subscription NFT (integrated revenue split)
(define-public (mint-subscription (creator principal) (season-id uint) (metadata-uri (string-ascii 200)))
  (let
    (
      (subscriber tx-sender)
      (token-id (get-next-token-id))
      (season-info (unwrap! (map-get? creator-seasons { creator: creator, season-id: season-id }) err-not-found))
      (price (get price season-info))
    )
    (begin
      ;; Basic checks
      (asserts! (is-none (map-get? user-subscriptions { subscriber: subscriber, creator: creator, season-id: season-id })) err-already-exists)
      (asserts! (get active season-info) err-not-authorized)
      (asserts! (< (get current-supply season-info) (get max-supply season-info)) err-not-authorized)
      
      ;; Key improvement: handle payment based on revenue split setting
      (if (get revenue-split-enabled season-info)
        ;; Revenue split enabled: transfer to this contract, then trigger split
        (begin
          (try! (stx-transfer? price subscriber (as-contract tx-sender)))
          ;; Call revenue splitter contract
          (try! (contract-call? .revenue-splitter distribute-nft-revenue creator price))
          true
        )
        ;; Revenue split disabled: transfer directly to creator
        (begin
          (try! (stx-transfer? price subscriber creator))
          true
        )
      )
      
      ;; Mint NFT
      (try! (nft-mint? subscription-nft token-id subscriber))
      
      ;; Store subscription data
      (map-set subscription-data
        { token-id: token-id }
        {
          creator: creator,
          subscriber: subscriber,
          season-id: season-id,
          issue-date: stacks-block-height,
          expiry-date: (get expiry-date season-info),
          tier: (get tier season-info),
          metadata-uri: metadata-uri,
          price-paid: price
        }
      )
      
      ;; Record user subscription
      (map-set user-subscriptions
        { subscriber: subscriber, creator: creator, season-id: season-id }
        { token-id: token-id, active: true }
      )
      
      ;; Update supply
      (map-set creator-seasons
        { creator: creator, season-id: season-id }
        (merge season-info { current-supply: (+ (get current-supply season-info) u1) })
      )
      
      ;; Update creator statistics
      (try! (contract-call? .creator-registry update-stats creator price u0 1 0))
      
      (ok token-id)
    )
  )
)

;; Check if subscription is valid
(define-read-only (is-subscription-valid (subscriber principal) (creator principal) (season-id uint))
  (match (map-get? user-subscriptions { subscriber: subscriber, creator: creator, season-id: season-id })
    subscription-record 
      (let
        ((token-data (unwrap! (map-get? subscription-data { token-id: (get token-id subscription-record) }) false)))
        (and 
          (get active subscription-record)
          (< stacks-block-height (get expiry-date token-data))
        )
      )
    false
  )
)

;; Get user's all subscription NFTs
(define-read-only (get-user-subscriptions (subscriber principal))
  ;; This function requires off-chain indexing support, return hint for now
  (ok "Query function requires off-chain indexing support")
)

;; Get NFT owner (override default function to prevent transfer)
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? subscription-nft token-id))
)

;; Prevent transfer (Soulbound)
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  err-not-authorized
)

;; Get subscription NFT info
(define-read-only (get-subscription-info (token-id uint))
  (map-get? subscription-data { token-id: token-id })
)

;; Get creator season info
(define-read-only (get-season-info (creator principal) (season-id uint))
  (map-get? creator-seasons { creator: creator, season-id: season-id })
)

;; Emergency function: pause/resume season sales
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

;; Batch query user subscription status for multiple creators
(define-read-only (check-multiple-subscriptions 
  (subscriber principal) 
  (creators-seasons (list 10 { creator: principal, season-id: uint })))
  (map check-single-subscription creators-seasons)
)

;; Helper function: check single subscription
(define-private (check-single-subscription (item { creator: principal, season-id: uint }))
  {
    creator: (get creator item),
    season-id: (get season-id item),
    valid: (is-subscription-valid tx-sender (get creator item) (get season-id item))
  }
)