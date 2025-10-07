;; Satscribe 创作者注册表合约
;; 管理创作者资料和配置信息

;; 定义常量
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u300))
(define-constant err-not-authorized (err u301))
(define-constant err-already-registered (err u302))
(define-constant err-not-found (err u303))
(define-constant err-invalid-data (err u304))

;; 创作者资料
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

;; 创作者设置
(define-map creator-settings
  { creator: principal }
  {
    subscription-price: uint,
    lightning-enabled: bool,
    auto-payout: bool,
    content-tiers: (list 5 (string-ascii 20)),
    announcement: (string-ascii 300)
  }
)

;; 创作者统计数据
(define-map creator-stats
  { creator: principal }
  {
    total-nft-sales: uint,
    total-lightning-tips: uint,
    active-subscribers: uint,
    content-count: uint,
    last-activity: uint
  }
)

;; 注册为创作者
(define-public (register-creator 
  (name (string-ascii 100))
  (bio (string-ascii 500))
  (avatar-uri (string-ascii 200))
  (category (string-ascii 50)))
  (let
    ((creator tx-sender))
    (begin
      ;; 检查是否已注册
      (asserts! (is-none (map-get? creator-profiles { creator: creator })) err-already-registered)
      
      ;; 验证数据
      (asserts! (> (len name) u0) err-invalid-data)
      (asserts! (> (len category) u0) err-invalid-data)
      
      ;; 创建创作者资料
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
          registration-date: block-height,
          total-subscribers: u0,
          total-revenue: u0
        }
      )
      
      ;; 初始化创作者设置
      (map-set creator-settings
        { creator: creator }
        {
          subscription-price: u1000000, ;; 默认 1 STX (微 STX)
          lightning-enabled: false,
          auto-payout: true,
          content-tiers: (list "free" "premium"),
          announcement: ""
        }
      )
      
      ;; 初始化统计数据
      (map-set creator-stats
        { creator: creator }
        {
          total-nft-sales: u0,
          total-lightning-tips: u0,
          active-subscribers: u0,
          content-count: u0,
          last-activity: block-height
        }
      )
      
      (ok true)
    )
  )
)

;; 更新创作者资料
(define-public (update-profile
  (name (string-ascii 100))
  (bio (string-ascii 500))
  (avatar-uri (string-ascii 200))
  (cover-uri (string-ascii 200))
  (social-links (string-ascii 300)))
  (let
    ((creator tx-sender))
    (begin
      ;; 检查是否已注册
      (asserts! (is-some (map-get? creator-profiles { creator: creator })) err-not-found)
      
      ;; 获取现有资料
      (let
        ((current-profile (unwrap! (map-get? creator-profiles { creator: creator }) err-not-found)))
        (begin
          ;; 更新资料
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

;; 更新创作者设置
(define-public (update-settings
  (subscription-price uint)
  (lightning-enabled bool)
  (auto-payout bool)
  (announcement (string-ascii 300)))
  (let
    ((creator tx-sender))
    (begin
      ;; 检查是否已注册
      (asserts! (is-some (map-get? creator-profiles { creator: creator })) err-not-found)
      
      ;; 获取现有设置
      (let
        ((current-settings (unwrap! (map-get? creator-settings { creator: creator }) err-not-found)))
        (begin
          ;; 更新设置
          (map-set creator-settings
            { creator: creator }
            (merge current-settings {
              subscription-price: subscription-price,
              lightning-enabled: lightning-enabled,
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

;; 更新统计数据 (由其他合约调用)
(define-public (update-stats
  (creator principal)
  (nft-sale-amount uint)
  (lightning-tip-amount uint)
  (subscriber-change int)
  (content-change int))
  (let
    ((current-stats (default-to 
      {
        total-nft-sales: u0,
        total-lightning-tips: u0,
        active-subscribers: u0,
        content-count: u0,
        last-activity: u0
      }
      (map-get? creator-stats { creator: creator })))
     (current-profile (unwrap! (map-get? creator-profiles { creator: creator }) err-not-found)))
    (begin
      ;; 更新统计数据
      (map-set creator-stats
        { creator: creator }
        {
          total-nft-sales: (+ (get total-nft-sales current-stats) nft-sale-amount),
          total-lightning-tips: (+ (get total-lightning-tips current-stats) lightning-tip-amount),
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
          last-activity: block-height
        }
      )
      
      ;; 更新资料中的总收益
      (map-set creator-profiles
        { creator: creator }
        (merge current-profile {
          total-revenue: (+ (get total-revenue current-profile) nft-sale-amount lightning-tip-amount),
          total-subscribers: (get active-subscribers (unwrap! (map-get? creator-stats { creator: creator }) err-not-found))
        })
      )
      
      (ok true)
    )
  )
)

;; 验证创作者 (仅管理员)
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

;; 查询函数
(define-read-only (get-creator-profile (creator principal))
  (map-get? creator-profiles { creator: creator })
)

(define-read-only (get-creator-settings (creator principal))
  (map-get? creator-settings { creator: creator })
)

(define-read-only (get-creator-stats (creator principal))
  (map-get? creator-stats { creator: creator })
)

;; 检查是否为注册创作者
(define-read-only (is-registered-creator (creator principal))
  (is-some (map-get? creator-profiles { creator: creator }))
)

;; 获取创作者完整信息
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