;; title: subscription-nft  
;; version: 2.0.0
;; summary: Satscribe Quarterly Subscription NFT Contract (Soulbound Token)
;; description: Auto-quarterly non-transferable subscription tokens with commemorative value, integrated auto revenue split

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-already-exists (err u102))
(define-constant err-not-found (err u103))
(define-constant err-subscription-expired (err u104))
(define-constant err-invalid-season (err u105))

;; Quarterly constants
(define-constant BLOCKS-PER-DAY u144) ;; Approximate blocks per day in Stacks
(define-constant DAYS-PER-QUARTER u90)
(define-constant MAX-SUPPLY-PER-SEASON u9999)

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

;; Creator season settings (simplified)
(define-map creator-seasons
  { creator: principal, season-id: uint }
  {
    price: uint,
    current-supply: uint,
    active: bool,
    created-at: uint,
    image-uri: (string-ascii 200),
    description: (string-ascii 500),
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

;; Bitcoin timestamp based quarter calculation
(define-constant BITCOIN-GENESIS-TIME u1231006505) ;; 2009-01-03 UTC
(define-constant SECONDS-PER-BTC-BLOCK u600) ;; Bitcoin avg block time 10 minutes
(define-constant YEAR-2024-START u1704067200) ;; 2024-01-01 00:00:00 UTC
(define-constant SECONDS-PER-DAY u86400)

(define-read-only (get-current-quarter)
  (let
    ((current-timestamp (+ BITCOIN-GENESIS-TIME (* burn-block-height SECONDS-PER-BTC-BLOCK)))
     (seconds-since-2024-start (- current-timestamp YEAR-2024-START)))
    (if (< seconds-since-2024-start u0)
      u20241 ;; If before 2024, return 2024 Q1
      (let
        ((days-since-2024 (/ seconds-since-2024-start SECONDS-PER-DAY))
         (years-since-2024 (/ days-since-2024 u365))
         (days-in-current-year (mod days-since-2024 u365))
         (quarter-index (/ days-in-current-year DAYS-PER-QUARTER))
         (quarter (+ quarter-index u1))
         (current-year (+ u2024 years-since-2024)))
        ;; Ensure quarter is between 1-4 for current year
        (let ((final-quarter (if (<= quarter u4) quarter u4)))
          ;; Return year*10 + quarter format (e.g., 20241, 20242, 20243, 20244)
          (+ (* current-year u10) final-quarter)
        )
      )
    )
  )
)

;; Get current year (simplified)
(define-read-only (get-current-year)
  ;; Simplified calculation - in production this would be more sophisticated
  (+ u2024 (/ stacks-block-height (* BLOCKS-PER-DAY u365)))
)

;; Calculate quarter end block height (supports both old and new season-id format)
(define-read-only (get-quarter-end-date (season-id uint))
  (let
    ((year (get-season-year season-id))
     (quarter (get-season-quarter season-id))
     ;; Calculate year start timestamp
     (year-start-timestamp (+ YEAR-2024-START (* (- year u2024) u365 SECONDS-PER-DAY)))
     ;; Calculate quarter end timestamp
     (quarter-end-timestamp (+ year-start-timestamp (* quarter DAYS-PER-QUARTER SECONDS-PER-DAY)))
     (current-timestamp (+ BITCOIN-GENESIS-TIME (* burn-block-height SECONDS-PER-BTC-BLOCK)))
     (seconds-until-end (- quarter-end-timestamp current-timestamp))
     (blocks-until-end (/ seconds-until-end SECONDS-PER-BTC-BLOCK)))
    ;; Return estimated block height at quarter end
    (+ burn-block-height blocks-until-end)
  )
)

;; Generate metadata URI for NFT
(define-read-only (generate-metadata-uri (creator principal) (season-id uint) (image-uri (string-ascii 200)) (description (string-ascii 500)))
  ;; In production, this would point to a proper API endpoint
  ;; For now, we'll create a simple formatted string
  "https://api.satscribe.com/nft/metadata"
)

;; Create new season (simplified - auto-creates for current quarter)
(define-public (create-season-auto
  (price uint)
  (image-uri (string-ascii 200))
  (description (string-ascii 500))
  (enable-revenue-split bool))
  (let
    ((creator tx-sender)
     (current-quarter (get-current-quarter)))
    (begin
      ;; Check if season already exists for this creator and quarter
      (asserts! (is-none (map-get? creator-seasons { creator: creator, season-id: current-quarter })) err-already-exists)
      
      ;; Validate quarter format (year >= 2024 and quarter 1-4, or legacy 1-5)
      (let ((year (/ current-quarter u10))
            (quarter (mod current-quarter u10)))
        (asserts! 
          (or 
            ;; Legacy format: 1-5
            (and (>= current-quarter u1) (<= current-quarter u5))
            ;; New format: year >= 2024 and quarter 1-4
            (and (>= year u2024) (>= quarter u1) (<= quarter u4))
          ) 
          err-invalid-season
        )
      )
      
      ;; Create season with auto-calculated values
      (map-set creator-seasons
        { creator: creator, season-id: current-quarter }
        {
          price: price,
          current-supply: u0,
          active: true,
          created-at: stacks-block-height,
          image-uri: image-uri,
          description: description,
          revenue-split-enabled: enable-revenue-split
        }
      )
      (ok current-quarter)
    )
  )
)

;; Legacy create season function (kept for compatibility)
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
          current-supply: u0,
          active: true,
          created-at: stacks-block-height,
          image-uri: "",
          description: "",
          revenue-split-enabled: enable-revenue-split
        }
      )
      (ok season-id)
    )
  )
)

;; Mint subscription NFT (updated for new structure)
(define-public (mint-subscription (creator principal) (season-id uint) (metadata-uri (string-ascii 200)))
  (let
    (
      (subscriber tx-sender)
      (token-id (get-next-token-id))
      (season-info (unwrap! (map-get? creator-seasons { creator: creator, season-id: season-id }) err-not-found))
      (price (get price season-info))
      (quarter-end-date (get-quarter-end-date season-id))
    )
    (begin
      ;; Basic checks
      (asserts! (is-none (map-get? user-subscriptions { subscriber: subscriber, creator: creator, season-id: season-id })) err-already-exists)
      (asserts! (get active season-info) err-not-authorized)
      (asserts! (< (get current-supply season-info) MAX-SUPPLY-PER-SEASON) err-not-authorized)
      
      ;; Handle payment based on revenue split setting
      (if (get revenue-split-enabled season-info)
        ;; Revenue split enabled: transfer to this contract, then trigger split
        (begin
          (try! (stx-transfer? price subscriber (as-contract tx-sender)))
          ;; Call revenue splitter contract
          (try! (contract-call? .revenue-splitter-v6 distribute-nft-revenue creator price))
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
      
      ;; Store subscription data (updated structure)
      (map-set subscription-data
        { token-id: token-id }
        {
          creator: creator,
          subscriber: subscriber,
          season-id: season-id,
          issue-date: stacks-block-height,
          expiry-date: quarter-end-date,
          tier: "VIP",  ;; Fixed tier for all NFTs
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
      (try! (contract-call? .creator-registry-v6 update-stats creator price u0 1 0))
      
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

;; Get enhanced season info with auto-calculated fields
(define-read-only (get-enhanced-season-info (creator principal) (season-id uint))
  (match (map-get? creator-seasons { creator: creator, season-id: season-id })
    season-info 
      (some {
        price: (get price season-info),
        current-supply: (get current-supply season-info),
        max-supply: MAX-SUPPLY-PER-SEASON,
        active: (get active season-info),
        created-at: (get created-at season-info),
        image-uri: (get image-uri season-info),
        description: (get description season-info),
        revenue-split-enabled: (get revenue-split-enabled season-info),
        quarter-end-date: (get-quarter-end-date season-id),
        tier: "VIP"
      })
    none
  )
)

;; Get current quarter info
(define-read-only (get-current-quarter-info)
  {
    quarter: (get-current-quarter),
    year: (get-current-year),
    quarter-end-date: (get-quarter-end-date (get-current-quarter)),
    max-supply: MAX-SUPPLY-PER-SEASON
  }
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

;; Get user tokens (simplified version for now)
(define-read-only (get-user-tokens (user principal))
  ;; Return empty list for now - this function needs user-specific logic
  ;; In practice, this would require indexing or external tracking
  (list)
)

;; Check if user owns a specific token
(define-read-only (check-token-ownership (user principal) (token-id uint))
  (match (nft-get-owner? subscription-nft token-id)
    owner (is-eq owner user)
    false
  )
)


;; Get all seasons created by a creator (supports both old 1-4 format and new year-quarter format)
(define-read-only (get-creator-seasons (creator principal))
  (list
    ;; Legacy format (1-4)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u1 })) (some u1) none)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u2 })) (some u2) none)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u3 })) (some u3) none)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u4 })) (some u4) none)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u5 })) (some u5) none)
    
    ;; 2024 format (20241-20244)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u20241 })) (some u20241) none)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u20242 })) (some u20242) none)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u20243 })) (some u20243) none)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u20244 })) (some u20244) none)
    
    ;; 2025 format (20251-20254)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u20251 })) (some u20251) none)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u20252 })) (some u20252) none)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u20253 })) (some u20253) none)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u20254 })) (some u20254) none)
    
    ;; 2026 format (20261-20264)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u20261 })) (some u20261) none)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u20262 })) (some u20262) none)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u20263 })) (some u20263) none)
    (if (is-some (map-get? creator-seasons { creator: creator, season-id: u20264 })) (some u20264) none)
  )
)

;; Improved enhanced season info with more details
(define-read-only (get-detailed-season-info (creator principal) (season-id uint))
  (match (map-get? creator-seasons { creator: creator, season-id: season-id })
    season-info 
      (some {
        ;; Basic season info
        price: (get price season-info),
        current-supply: (get current-supply season-info),
        max-supply: MAX-SUPPLY-PER-SEASON,
        active: (get active season-info),
        created-at: (get created-at season-info),
        image-uri: (get image-uri season-info),
        description: (get description season-info),
        revenue-split-enabled: (get revenue-split-enabled season-info),
        tier: "VIP",
        
        ;; Calculated fields
        quarter: season-id,
        quarter-end-date: (get-quarter-end-date season-id),
        current-quarter: (get-current-quarter),
        current-year: (get-current-year),
        is-current-quarter: (is-eq season-id (get-current-quarter)),
        
        ;; Sales info
        total-revenue: (* (get price season-info) (get current-supply season-info)),
        supply-percentage: (/ (* (get current-supply season-info) u100) MAX-SUPPLY-PER-SEASON),
        
        ;; Status
        is-sold-out: (is-eq (get current-supply season-info) MAX-SUPPLY-PER-SEASON),
        blocks-until-expiry: (if (> (get-quarter-end-date season-id) stacks-block-height)
                               (- (get-quarter-end-date season-id) stacks-block-height)
                               u0)
      })
    none
  )
)

;; Batch query multiple creators' season info
(define-read-only (get-multiple-creators-info 
  (creators (list 10 principal)))
  (map get-creator-all-seasons creators)
)

;; Helper: get all seasons for one creator (supports both old and new format)
(define-private (get-creator-all-seasons (creator principal))
  {
    creator: creator,
    seasons: (list
      ;; Legacy format
      (map-get? creator-seasons { creator: creator, season-id: u1 })
      (map-get? creator-seasons { creator: creator, season-id: u2 })
      (map-get? creator-seasons { creator: creator, season-id: u3 })
      (map-get? creator-seasons { creator: creator, season-id: u4 })
      (map-get? creator-seasons { creator: creator, season-id: u5 })
      
      ;; 2024 format
      (map-get? creator-seasons { creator: creator, season-id: u20241 })
      (map-get? creator-seasons { creator: creator, season-id: u20242 })
      (map-get? creator-seasons { creator: creator, season-id: u20243 })
      (map-get? creator-seasons { creator: creator, season-id: u20244 })
      
      ;; 2025 format  
      (map-get? creator-seasons { creator: creator, season-id: u20251 })
      (map-get? creator-seasons { creator: creator, season-id: u20252 })
      (map-get? creator-seasons { creator: creator, season-id: u20253 })
      (map-get? creator-seasons { creator: creator, season-id: u20254 })
      
      ;; 2026 format
      (map-get? creator-seasons { creator: creator, season-id: u20261 })
      (map-get? creator-seasons { creator: creator, season-id: u20262 })
      (map-get? creator-seasons { creator: creator, season-id: u20263 })
      (map-get? creator-seasons { creator: creator, season-id: u20264 })
    )
  }
)

;; Get platform statistics
(define-read-only (get-platform-stats)
  {
    total-nfts-minted: (var-get last-token-id),
    current-quarter: (get-current-quarter),
    current-year: (get-current-year),
    max-supply-per-season: MAX-SUPPLY-PER-SEASON,
    days-per-quarter: DAYS-PER-QUARTER
  }
)

;; Quick subscription check for UI
(define-read-only (quick-subscription-check 
  (user principal) 
  (creator principal))
  {
    user: user,
    creator: creator,
    current-quarter-valid: (is-subscription-valid user creator (get-current-quarter)),
    all-quarters: {
      q1: (is-subscription-valid user creator u1),
      q2: (is-subscription-valid user creator u2), 
      q3: (is-subscription-valid user creator u3),
      q4: (is-subscription-valid user creator u4)
    }
  }
)

;; Helper function: extract year from season-id
(define-read-only (get-season-year (season-id uint))
  (if (<= season-id u5)
    u2024 ;; Legacy format, assume 2024
    (/ season-id u10) ;; New format: year = season-id / 10
  )
)

;; Helper function: extract quarter from season-id  
(define-read-only (get-season-quarter (season-id uint))
  (if (<= season-id u5)
    season-id ;; Legacy format: 1-5 maps to quarters
    (mod season-id u10) ;; New format: quarter = season-id mod 10
  )
)

;; Helper function: create season-id from year and quarter
(define-read-only (make-season-id (year uint) (quarter uint))
  (+ (* year u10) quarter)
)

;; Helper function: validate season-id format
(define-read-only (is-valid-season-id (season-id uint))
  (let ((year (get-season-year season-id))
        (quarter (get-season-quarter season-id)))
    (and 
      (>= year u2024)
      (>= quarter u1) 
      (<= quarter u4)
    )
  )
)