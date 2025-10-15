;; title: platform-treasury
;; version: 1.0.0
;; summary: Satscribe Platform Treasury Contract
;; description: Manages platform fee collection (1%) from NFT sales and provides withdrawal functionality

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u400))
(define-constant err-not-authorized (err u401))
(define-constant err-insufficient-balance (err u402))
(define-constant err-invalid-amount (err u403))
(define-constant err-withdrawal-failed (err u404))

;; Platform fee percentage (1% = 100 basis points out of 10000)
(define-constant PLATFORM-FEE-BPS u100) ;; 1% = 100 basis points
(define-constant BPS-DENOMINATOR u10000) ;; 100% = 10000 basis points

;; Data variables
(define-data-var total-fees-collected uint u0)
(define-data-var total-withdrawals uint u0)
(define-data-var last-withdrawal-id uint u0)

;; Platform fee records by creator
(define-map creator-fee-contributions
  { creator: principal }
  {
    total-contributed: uint,
    transaction-count: uint,
    last-contribution: uint
  }
)

;; Transaction fee records
(define-map transaction-fees
  { tx-id: uint }
  {
    creator: principal,
    buyer: principal,
    nft-price: uint,
    platform-fee: uint,
    timestamp: uint
  }
)

;; Withdrawal records
(define-map withdrawal-records
  { withdrawal-id: uint }
  {
    amount: uint,
    recipient: principal,
    timestamp: uint,
    block-height: uint
  }
)

;; Get next transaction ID
(define-data-var last-tx-id uint u0)
(define-private (get-next-tx-id)
  (begin
    (var-set last-tx-id (+ (var-get last-tx-id) u1))
    (var-get last-tx-id)
  )
)

;; Get next withdrawal ID
(define-private (get-next-withdrawal-id)
  (begin
    (var-set last-withdrawal-id (+ (var-get last-withdrawal-id) u1))
    (var-get last-withdrawal-id)
  )
)

;; Calculate platform fee (1% of total amount)
(define-read-only (calculate-platform-fee (total-amount uint))
  {
    platform-fee: (/ (* total-amount PLATFORM-FEE-BPS) BPS-DENOMINATOR),
    creator-amount: (- total-amount (/ (* total-amount PLATFORM-FEE-BPS) BPS-DENOMINATOR))
  }
)

;; Collect platform fee from NFT purchase
(define-public (collect-platform-fee 
  (creator principal) 
  (buyer principal) 
  (nft-price uint))
  (let
    (
      (tx-id (get-next-tx-id))
      (fee-calculation (calculate-platform-fee nft-price))
      (platform-fee (get platform-fee fee-calculation))
      (current-contribution (default-to 
        { total-contributed: u0, transaction-count: u0, last-contribution: u0 }
        (map-get? creator-fee-contributions { creator: creator })))
    )
    (begin
      ;; Validate amount
      (asserts! (> nft-price u0) err-invalid-amount)
      (asserts! (> platform-fee u0) err-invalid-amount)
      
      ;; Receive platform fee from buyer
      (try! (stx-transfer? platform-fee buyer (as-contract tx-sender)))
      
      ;; Update total fees collected
      (var-set total-fees-collected (+ (var-get total-fees-collected) platform-fee))
      
      ;; Record transaction
      (map-set transaction-fees
        { tx-id: tx-id }
        {
          creator: creator,
          buyer: buyer,
          nft-price: nft-price,
          platform-fee: platform-fee,
          timestamp: stacks-block-height
        }
      )
      
      ;; Update creator contribution record
      (map-set creator-fee-contributions
        { creator: creator }
        {
          total-contributed: (+ (get total-contributed current-contribution) platform-fee),
          transaction-count: (+ (get transaction-count current-contribution) u1),
          last-contribution: stacks-block-height
        }
      )
      
      (ok {
        tx-id: tx-id,
        platform-fee: platform-fee,
        creator-amount: (get creator-amount fee-calculation)
      })
    )
  )
)

;; Withdraw platform fees (owner only)
(define-public (withdraw-fees (amount uint) (recipient principal))
  (let
    (
      (withdrawal-id (get-next-withdrawal-id))
      (contract-balance (stx-get-balance (as-contract tx-sender)))
    )
    (begin
      ;; Check authorization
      (asserts! (is-eq tx-sender contract-owner) err-owner-only)
      
      ;; Validate amount
      (asserts! (> amount u0) err-invalid-amount)
      (asserts! (<= amount contract-balance) err-insufficient-balance)
      
      ;; Execute withdrawal
      (try! (as-contract (stx-transfer? amount tx-sender recipient)))
      
      ;; Update total withdrawals
      (var-set total-withdrawals (+ (var-get total-withdrawals) amount))
      
      ;; Record withdrawal
      (map-set withdrawal-records
        { withdrawal-id: withdrawal-id }
        {
          amount: amount,
          recipient: recipient,
          timestamp: stacks-block-height,
          block-height: stacks-block-height
        }
      )
      
      (ok withdrawal-id)
    )
  )
)

;; Emergency withdrawal (all funds)
(define-public (emergency-withdraw (recipient principal))
  (let
    ((contract-balance (stx-get-balance (as-contract tx-sender))))
    (begin
      (asserts! (is-eq tx-sender contract-owner) err-owner-only)
      (try! (withdraw-fees contract-balance recipient))
      (ok contract-balance)
    )
  )
)

;; Query functions
(define-read-only (get-platform-balance)
  (stx-get-balance (as-contract tx-sender))
)

(define-read-only (get-platform-stats)
  {
    total-fees-collected: (var-get total-fees-collected),
    total-withdrawals: (var-get total-withdrawals),
    current-balance: (stx-get-balance (as-contract tx-sender)),
    available-balance: (stx-get-balance (as-contract tx-sender)),
    platform-fee-percentage: PLATFORM-FEE-BPS,
    last-tx-id: (var-get last-tx-id)
  }
)

(define-read-only (get-creator-contributions (creator principal))
  (map-get? creator-fee-contributions { creator: creator })
)

(define-read-only (get-transaction-fee (tx-id uint))
  (map-get? transaction-fees { tx-id: tx-id })
)

(define-read-only (get-withdrawal-record (withdrawal-id uint))
  (map-get? withdrawal-records { withdrawal-id: withdrawal-id })
)

;; Preview fee calculation without executing transaction
(define-read-only (preview-fee-split (nft-price uint))
  (calculate-platform-fee nft-price)
)

;; Check if address is platform owner
(define-read-only (is-platform-owner (address principal))
  (is-eq address contract-owner)
)

;; Get platform fee rate in human readable format
(define-read-only (get-platform-fee-rate)
  {
    basis-points: PLATFORM-FEE-BPS,
    percentage: (/ (* PLATFORM-FEE-BPS u100) BPS-DENOMINATOR), ;; Returns 1 for 1%
    display: "1%" ;; For UI display
  }
)