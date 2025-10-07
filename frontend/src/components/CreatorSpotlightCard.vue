<template>
  <div 
    class="creator-spotlight-card group cursor-pointer"
    @click="$emit('click', creator)"
  >
    <div class="card-web3 p-6 h-full flex flex-col transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
      <!-- Background Decoration -->
      <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-web3-purple/20 to-transparent rounded-bl-full"></div>
      <div class="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-web3-cyan/10 to-transparent rounded-tr-full"></div>
      
      <!-- Creator Avatar & Status -->
      <div class="relative z-10 flex flex-col items-center mb-6">
        <!-- Avatar -->
        <div class="relative mb-4">
          <div class="w-20 h-20 bg-gradient-to-br from-web3-purple via-web3-cyan to-web3-pink rounded-full flex items-center justify-center relative overflow-hidden group-hover:shadow-glow transition-all duration-300">
            <img 
              v-if="creator.avatar" 
              :src="creator.avatar" 
              :alt="creator.name"
              class="w-full h-full object-cover rounded-full"
            >
            <span v-else class="text-white font-bold text-2xl">{{ creator.name.charAt(0) }}</span>
          </div>
          
          <!-- Verified Badge -->
          <div v-if="creator.verified" class="absolute -bottom-1 -right-1 w-6 h-6 bg-web3-cyan rounded-full flex items-center justify-center border-2 border-web3-dark">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
          
          <!-- Online Status -->
          <div class="absolute top-0 right-0 w-4 h-4">
            <div class="w-3 h-3 bg-web3-green rounded-full animate-pulse"></div>
            <div class="absolute inset-0 w-3 h-3 bg-web3-green rounded-full animate-ping"></div>
          </div>
        </div>
        
        <!-- Creator Name & Category -->
        <div class="text-center">
          <h3 class="text-white font-bold text-lg mb-1 group-hover:text-gradient-web3 transition-all duration-300">
            {{ creator.name }}
          </h3>
          <p class="text-web3-cyan text-sm font-medium mb-2">{{ creator.category }}</p>
          <p class="text-white/60 text-xs">最後活動: {{ creator.recentActivity }}</p>
        </div>
      </div>
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4 mb-6 flex-1">
        <!-- Subscribers -->
        <div class="text-center bg-glass-dark rounded-xl p-3 border border-white/10 group-hover:border-web3-purple/30 transition-all duration-300">
          <div class="flex items-center justify-center mb-2">
            <svg class="w-5 h-5 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
          </div>
          <p class="text-white font-bold text-lg">{{ formatNumber(creator.subscribers) }}</p>
          <p class="text-white/60 text-xs">訂閱者</p>
        </div>
        
        <!-- Articles -->
        <div class="text-center bg-glass-dark rounded-xl p-3 border border-white/10 group-hover:border-web3-cyan/30 transition-all duration-300">
          <div class="flex items-center justify-center mb-2">
            <svg class="w-5 h-5 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
              <path fill-rule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <p class="text-white font-bold text-lg">{{ creator.articles }}</p>
          <p class="text-white/60 text-xs">內容數</p>
        </div>
      </div>
      
      <!-- Earnings Display -->
      <div class="bg-gradient-to-r from-web3-gold/20 to-web3-pink/20 rounded-xl p-4 border border-web3-gold/30 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-web3-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
            <span class="text-white/80 text-sm">總收益</span>
          </div>
          <div class="text-right">
            <p class="text-web3-gold font-bold text-lg">{{ creator.totalEarnings }} STX</p>
            <p class="text-white/60 text-xs">累計收入</p>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="space-y-3">
        <!-- Subscribe Button -->
        <button class="w-full btn-web3 py-3 rounded-xl text-sm font-medium relative overflow-hidden group">
          <span class="relative z-10 flex items-center justify-center space-x-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
            </svg>
            <span>關注創作者</span>
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-web3-pink to-web3-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
        
        <!-- View Profile Button -->
        <button class="w-full btn-glass py-3 rounded-xl text-sm font-medium flex items-center justify-center space-x-2 group">
          <span>查看作品</span>
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      
      <!-- Hover Effect Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-web3-purple/5 to-web3-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreatorSpotlightCard',
  props: {
    creator: {
      type: Object,
      required: true
    },
    compact: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  methods: {
    formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
      }
      return num.toString()
    }
  }
}
</script>

<style scoped>
.creator-spotlight-card {
  position: relative;
}

/* 卡片懸停效果 */
.creator-spotlight-card:hover .card-web3 {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(108, 92, 231, 0.3);
  box-shadow: 
    0 20px 40px rgba(108, 92, 231, 0.2),
    0 0 0 1px rgba(108, 92, 231, 0.1);
}

/* 頭像發光效果 */
.creator-spotlight-card:hover .w-20.h-20 {
  box-shadow: 
    0 0 30px rgba(108, 92, 231, 0.4),
    0 0 60px rgba(116, 185, 255, 0.2);
}

/* 統計卡片動畫 */
.creator-spotlight-card:hover .bg-glass-dark {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
}

/* 按鈕互動效果 */
.btn-web3::after, .btn-glass::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-web3:active::after, .btn-glass:active::after {
  width: 300px;
  height: 300px;
}

/* 收益區塊特殊效果 */
.creator-spotlight-card:hover .bg-gradient-to-r {
  background: linear-gradient(
    90deg,
    rgba(253, 203, 110, 0.3) 0%,
    rgba(253, 121, 168, 0.3) 100%
  );
  border-color: rgba(253, 203, 110, 0.5);
}

/* 載入狀態 */
.creator-spotlight-card.loading {
  pointer-events: none;
  opacity: 0.7;
}

.creator-spotlight-card.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid transparent;
  border-top: 2px solid #6C5CE7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 100;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 微互動效果 */
.creator-spotlight-card .w-5.h-5 {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.creator-spotlight-card:hover .w-5.h-5 {
  transform: scale(1.1);
}

/* 在線狀態動畫 */
.creator-spotlight-card .animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.creator-spotlight-card .animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* 驗證徽章閃爍 */
.creator-spotlight-card:hover .bg-web3-cyan {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 10px rgba(116, 185, 255, 0.5);
  }
  to {
    box-shadow: 0 0 20px rgba(116, 185, 255, 0.8);
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .creator-spotlight-card .grid {
    gap: 0.75rem;
  }
  
  .creator-spotlight-card .p-6 {
    padding: 1rem;
  }
  
  .creator-spotlight-card .w-20.h-20 {
    width: 4rem;
    height: 4rem;
  }
}

/* 無障礙設計 */
.creator-spotlight-card:focus {
  outline: 2px solid #6C5CE7;
  outline-offset: 2px;
}

.creator-spotlight-card button:focus {
  outline: 2px solid #74B9FF;
  outline-offset: 2px;
}

/* 高對比度模式 */
@media (prefers-contrast: high) {
  .creator-spotlight-card .card-web3 {
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .creator-spotlight-card .text-white\/60 {
    color: rgba(255, 255, 255, 0.8);
  }
}

/* 減少動畫設定 */
@media (prefers-reduced-motion: reduce) {
  .creator-spotlight-card,
  .creator-spotlight-card *,
  .creator-spotlight-card::before,
  .creator-spotlight-card::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 深色模式優化 */
@media (prefers-color-scheme: dark) {
  .creator-spotlight-card {
    /* 已經是深色設計，無需額外調整 */
  }
}

/* 性能優化 */
.creator-spotlight-card {
  will-change: transform;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

.creator-spotlight-card .card-web3 {
  will-change: transform, box-shadow;
}

/* 自定義屬性用於主題切換 */
.creator-spotlight-card {
  --primary-color: #6C5CE7;
  --secondary-color: #74B9FF;
  --accent-color: #00CEC9;
  --success-color: #00B894;
  --warning-color: #FDCB6E;
  --error-color: #E17055;
}

/* 使用自定義屬性 */
.creator-spotlight-card .text-web3-purple {
  color: var(--primary-color);
}

.creator-spotlight-card .text-web3-cyan {
  color: var(--secondary-color);
}

.creator-spotlight-card .bg-web3-purple {
  background-color: var(--primary-color);
}
</style>