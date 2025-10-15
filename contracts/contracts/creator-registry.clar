;; title: creator-registry
;; version: 1.0.0
;; summary: Satscribe Creator Registry Contract
;; description: Manage creator profiles and configuration

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u300))
(define-constant err-not-authorized (err u301))
(define-constant err-already-registered (err u302))
(define-constant err-not-found (err u303))
(define-constant err-invalid-data (err u304))

;; Creator profiles data
(define-map creator-profiles
  { creator: principal }
  {
    name: (string-ascii 100),
    bio: (string-ascii 500),
    avatar-uri: (string-ascii 200),
    cover-uri: (string-ascii 200),
    social-links: (string-ascii 300),
    category: (string-ascii 50),
    verified: bool,
    registration-date: uint,
    total-subscribers: uint,
    total-revenue: uint
  }
)

;; Creator settings
(define-map creator-settings
  { creator: principal }
  {
    subscription-price: uint,
    auto-payout: bool,
    content-tiers: (list 5 (string-ascii 20)),
    announcement: (string-ascii 300)
  }
)

;; Creator statistics
(define-map creator-stats
  { creator: principal }
  {
    total-nft-sales: uint,
    active-subscribers: uint,
    content-count: uint,
    last-activity: uint
  }
)

;; Register as creator
(define-public (register-creator 
  (name (string-ascii 100))
  (bio (string-ascii 500))
  (avatar-uri (string-ascii 200))
  (category (string-ascii 50)))
  (let
    ((creator tx-sender))
    (begin
      ;; Check if already registered
      (asserts! (is-none (map-get? creator-profiles { creator: creator })) err-already-registered)
      
      ;; Validate data
      (asserts! (> (len name) u0) err-invalid-data)
      (asserts! (> (len category) u0) err-invalid-data)
      
      ;; Create creator profile
      (map-set creator-profiles
        { creator: creator }
        {
          name: name,
          bio: bio,
          avatar-uri: avatar-uri,
          cover-uri: "",
          social-links: "",
          category: category,
          verified: false,
          registration-date: stacks-block-height,
          total-subscribers: u0,
          total-revenue: u0
        }
      )
      
      ;; Initialize creator settings
      (map-set creator-settings
        { creator: creator }
        {
          subscription-price: u1000000, ;; Default 1 STX (micro STX)
          auto-payout: true,
          content-tiers: (list "free" "premium"),
          announcement: ""
        }
      )
      
      ;; Initialize statistics
      (map-set creator-stats
        { creator: creator }
        {
          total-nft-sales: u0,
          active-subscribers: u0,
          content-count: u0,
          last-activity: stacks-block-height
        }
      )
      
      (ok true)
    )
  )
)

;; Update creator profile
(define-public (update-profile
  (name (string-ascii 100))
  (bio (string-ascii 500))
  (avatar-uri (string-ascii 200))
  (cover-uri (string-ascii 200))
  (social-links (string-ascii 300)))
  (let
    ((creator tx-sender))
    (begin
      ;; Check if registered
      (asserts! (is-some (map-get? creator-profiles { creator: creator })) err-not-found)
      
      ;; Get existing profile
      (let
        ((current-profile (unwrap! (map-get? creator-profiles { creator: creator }) err-not-found)))
        (begin
          ;; Update profile
          (map-set creator-profiles
            { creator: creator }
            (merge current-profile {
              name: name,
              bio: bio,
              avatar-uri: avatar-uri,
              cover-uri: cover-uri,
              social-links: social-links
            })
          )
          (ok true)
        )
      )
    )
  )
)

;; Update creator settings
(define-public (update-settings
  (subscription-price uint)
  (auto-payout bool)
  (announcement (string-ascii 300)))
  (let
    ((creator tx-sender))
    (begin
      ;; Check if registered
      (asserts! (is-some (map-get? creator-profiles { creator: creator })) err-not-found)
      
      ;; Get existing settings
      (let
        ((current-settings (unwrap! (map-get? creator-settings { creator: creator }) err-not-found)))
        (begin
          ;; Update settings
          (map-set creator-settings
            { creator: creator }
            (merge current-settings {
              subscription-price: subscription-price,
              auto-payout: auto-payout,
              announcement: announcement
            })
          )
          (ok true)
        )
      )
    )
  )
)

;; Update statistics (called by other contracts)
(define-public (update-stats
  (creator principal)
  (nft-sale-amount uint)
  (subscriber-change int)
  (content-change int))
  (let
    ((current-stats (default-to 
      {
        total-nft-sales: u0,
        active-subscribers: u0,
        content-count: u0,
        last-activity: u0
      }
      (map-get? creator-stats { creator: creator })))
     (current-profile (unwrap! (map-get? creator-profiles { creator: creator }) err-not-found)))
    (begin
      ;; Update statistics
      (map-set creator-stats
        { creator: creator }
        {
          total-nft-sales: (+ (get total-nft-sales current-stats) nft-sale-amount),
          active-subscribers: (if (>= subscriber-change 0)
                                (+ (get active-subscribers current-stats) (to-uint subscriber-change))
                                (if (>= (get active-subscribers current-stats) (to-uint (* subscriber-change -1)))
                                  (- (get active-subscribers current-stats) (to-uint (* subscriber-change -1)))
                                  u0)),
          content-count: (if (>= content-change 0)
                          (+ (get content-count current-stats) (to-uint content-change))
                          (if (>= (get content-count current-stats) (to-uint (* content-change -1)))
                            (- (get content-count current-stats) (to-uint (* content-change -1)))
                            u0)),
          last-activity: stacks-block-height
        }
      )
      
      ;; Update total revenue in profile
      (map-set creator-profiles
        { creator: creator }
        (merge current-profile {
          total-revenue: (+ (get total-revenue current-profile) nft-sale-amount),
          total-subscribers: (get active-subscribers (unwrap! (map-get? creator-stats { creator: creator }) err-not-found))
        })
      )
      
      (ok true)
    )
  )
)

;; Verify creator (admin only)
(define-public (verify-creator (creator principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (let
      ((current-profile (unwrap! (map-get? creator-profiles { creator: creator }) err-not-found)))
      (begin
        (map-set creator-profiles
          { creator: creator }
          (merge current-profile { verified: true })
        )
        (ok true)
      )
    )
  )
)

;; Query functions
(define-read-only (get-creator-profile (creator principal))
  (map-get? creator-profiles { creator: creator })
)

(define-read-only (get-creator-settings (creator principal))
  (map-get? creator-settings { creator: creator })
)

(define-read-only (get-creator-stats (creator principal))
  (map-get? creator-stats { creator: creator })
)

;; Check if registered creator
(define-read-only (is-registered-creator (creator principal))
  (is-some (map-get? creator-profiles { creator: creator }))
)

;; Get complete creator info
(define-read-only (get-creator-info (creator principal))
  (let
    ((profile (map-get? creator-profiles { creator: creator }))
     (settings (map-get? creator-settings { creator: creator }))
     (stats (map-get? creator-stats { creator: creator })))
    {
      profile: profile,
      settings: settings,
      stats: stats
    }
  )
)