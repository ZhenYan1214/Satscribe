;; title: revenue-splitter
;; version: 1.0.0
;; summary: Satscribe Revenue Splitter Contract
;; description: Support dynamic revenue split configuration for studio members

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u200))
(define-constant err-not-authorized (err u201))
(define-constant err-invalid-percentage (err u202))
(define-constant err-creator-not-found (err u203))
(define-constant err-insufficient-balance (err u204))

;; Revenue split member structure
(define-map revenue-splits
  { creator: principal }
  {
    members: (list 10 { wallet: principal, percentage: uint, role: (string-ascii 50) }),
    lightning-enabled: bool,
    nft-enabled: bool,
    last-updated: uint
  }
)

;; Pending payout records
(define-map pending-payouts
  { creator: principal, payout-id: uint }
  {
    total-amount: uint,
    payout-type: (string-ascii 20), ;; "nft" or "lightning"
    timestamp: uint,
    distributed: bool
  }
)

;; Last payout ID for creators
(define-data-var last-payout-id uint u0)

;; Get next payout ID
(define-private (get-next-payout-id)
  (begin
    (var-set last-payout-id (+ (var-get last-payout-id) u1))
    (var-get last-payout-id)
  )
)

;; Set creator revenue split configuration
(define-public (set-revenue-split 
  (members (list 10 { wallet: principal, percentage: uint, role: (string-ascii 50) }))
  (lightning-enabled bool)
  (nft-enabled bool))
  (let
    ((creator tx-sender)
     (total-percentage (fold check-and-sum-percentage members u0)))
    (begin
      ;; Check total percentage equals 100
      (asserts! (is-eq total-percentage u100) err-invalid-percentage)
      
      ;; Save revenue split configuration
      (map-set revenue-splits
        { creator: creator }
        {
          members: members,
          lightning-enabled: lightning-enabled,
          nft-enabled: nft-enabled,
          last-updated: stacks-block-height
        }
      )
      (ok true)
    )
  )
)

;; Helper function: check and sum percentage
(define-private (check-and-sum-percentage 
  (member { wallet: principal, percentage: uint, role: (string-ascii 50) })
  (current-sum uint))
  (+ current-sum (get percentage member))
)

;; NFT sales revenue distribution
(define-public (distribute-nft-revenue (creator principal) (total-amount uint))
  (let
    (
      (payout-id (get-next-payout-id))
      (split-config (unwrap! (map-get? revenue-splits { creator: creator }) err-creator-not-found))
    )
    (begin
      ;; Check if NFT split is enabled
      (asserts! (get nft-enabled split-config) err-not-authorized)
      
      ;; Record pending payout
      (map-set pending-payouts
        { creator: creator, payout-id: payout-id }
        {
          total-amount: total-amount,
          payout-type: "nft",
          timestamp: stacks-block-height,
          distributed: false
        }
      )
      
      ;; Execute payout
      (try! (execute-payout creator payout-id total-amount (get members split-config)))
      
      ;; Mark as distributed
      (map-set pending-payouts
        { creator: creator, payout-id: payout-id }
        {
          total-amount: total-amount,
          payout-type: "nft",
          timestamp: stacks-block-height,
          distributed: true
        }
      )
      
      (ok payout-id)
    )
  )
)

;; Lightning tip revenue distribution
(define-public (distribute-lightning-revenue (creator principal) (total-amount uint))
  (let
    (
      (payout-id (get-next-payout-id))
      (split-config (unwrap! (map-get? revenue-splits { creator: creator }) err-creator-not-found))
    )
    (begin
      ;; Check if Lightning split is enabled
      (asserts! (get lightning-enabled split-config) err-not-authorized)
      
      ;; Record pending payout
      (map-set pending-payouts
        { creator: creator, payout-id: payout-id }
        {
          total-amount: total-amount,
          payout-type: "lightning",
          timestamp: stacks-block-height,
          distributed: false
        }
      )
      
      ;; Execute payout
      (try! (execute-payout creator payout-id total-amount (get members split-config)))
      
      ;; Mark as distributed
      (map-set pending-payouts
        { creator: creator, payout-id: payout-id }
        {
          total-amount: total-amount,
          payout-type: "lightning",
          timestamp: stacks-block-height,
          distributed: true
        }
      )
      
      (ok payout-id)
    )
  )
)

;; Execute actual revenue split payments
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

;; Process individual member payout
(define-private (process-member-payout
  (member { wallet: principal, percentage: uint, role: (string-ascii 50) })
  (result (response { creator: principal, total: uint } uint)))
  (match result
    success-data
      (let
        ((payout-amount (/ (* (get total success-data) (get percentage member)) u100)))
        (begin
          ;; Transfer to member
          (try! (as-contract (stx-transfer? payout-amount tx-sender (get wallet member))))
          (ok success-data)
        )
      )
    error-code (err error-code)
  )
)

;; Query creator revenue split configuration
(define-read-only (get-revenue-split (creator principal))
  (map-get? revenue-splits { creator: creator })
)

;; Query payout record
(define-read-only (get-payout-info (creator principal) (payout-id uint))
  (map-get? pending-payouts { creator: creator, payout-id: payout-id })
)

;; Preview split calculation
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

;; Calculate member share (helper function)
(define-private (calculate-member-share 
  (member { wallet: principal, percentage: uint, role: (string-ascii 50) }))
  {
    wallet: (get wallet member),
    percentage: (get percentage member),
    role: (get role member)
  }
)