<template>
  <div class="nft-preview-card max-w-sm mx-auto">
    <!-- NFT 卡片 -->
    <div class="card-web3 overflow-hidden hover:scale-105 transition-all duration-300">
      <!-- NFT 圖片 -->
      <div class="relative aspect-square bg-gradient-to-br from-web3-purple/20 to-web3-cyan/20">
        <img 
          v-if="nftData.image && nftData.image !== '/placeholder-nft.png'" 
          :src="nftData.image" 
          :alt="nftData.name"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
        <!-- 佔位符 -->
        <div v-else class="w-full h-full flex items-center justify-center text-white/50">
          <div class="text-center">
            <svg class="w-16 h-16 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v1.586l8.707 8.707a1 1 0 001.414 0L20.828 6.5a1 1 0 000-1.414L12.707.293a1 1 0 00-1.414 0L2.586 8.5A2 2 0 002 10v8a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4zm16 4.414L11.414 2 4.414 9H20v1.586zM18 12H6v6h12v-6z" clip-rule="evenodd"/>
            </svg>
            <p class="text-sm">請添加 NFT 圖片</p>
          </div>
        </div>
        
        <!-- 季度標誌 -->
        <div class="absolute top-3 left-3 bg-web3-purple/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span class="text-white text-sm font-bold">Q{{ nftData.quarter }}</span>
        </div>
        
        <!-- VIP 標誌 -->
        <div class="absolute top-3 right-3 bg-web3-gold/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span class="text-white text-xs font-bold">VIP</span>
        </div>
        
        <!-- 發行量標誌 -->
        <div class="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
          <span class="text-white text-xs">
            0/{{ nftData.supply }}
          </span>
        </div>
      </div>
      
      <!-- NFT 信息 -->
      <div class="p-5">
        <!-- 創作者信息 -->
        <div class="flex items-center space-x-3 mb-4">
          <img 
            :src="creatorInfo.avatar || '/default-avatar.png'" 
            :alt="creatorInfo.name"
            class="w-8 h-8 rounded-full border-2 border-web3-purple/50"
          />
          <div class="flex-1 min-w-0">
            <p class="text-white font-medium text-sm truncate">{{ creatorInfo.name }}</p>
            <p class="text-white/60 text-xs">創作者</p>
          </div>
          <svg v-if="creatorInfo.verified" class="w-4 h-4 text-web3-green" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
        </div>
        
        <!-- NFT 標題 -->
        <h3 class="text-lg font-bold text-white mb-2 line-clamp-2">
          {{ nftData.name }}
        </h3>
        
        <!-- NFT 描述 -->
        <p class="text-white/70 text-sm mb-4 line-clamp-3">
          {{ nftData.description }}
        </p>
        
        <!-- 價格和詳情 -->
        <div class="space-y-3">
          <!-- 價格 -->
          <div class="flex items-center justify-between">
            <span class="text-white/60 text-sm">價格</span>
            <div class="text-right">
              <div class="text-xl font-bold text-gradient-web3">
                {{ formatPrice(nftData.price) }} STX
              </div>
              <div class="text-white/50 text-xs">
                ≈ ${{ formatUSD(nftData.price) }}
              </div>
            </div>
          </div>
          
          <!-- 有效期 -->
          <div class="flex items-center justify-between">
            <span class="text-white/60 text-sm">有效期至</span>
            <span class="text-white text-sm">{{ nftData.endDate }}</span>
          </div>
          
          <!-- 會員等級 -->
          <div class="flex items-center justify-between">
            <span class="text-white/60 text-sm">會員等級</span>
            <span class="text-web3-gold font-bold text-sm">{{ nftData.tier }}</span>
          </div>
        </div>
        
        <!-- 預覽標記 -->
        <div class="mt-4 pt-4 border-t border-white/10">
          <div class="text-center">
            <span class="text-web3-purple font-medium text-sm">⚡ 即時預覽</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 額外信息卡片 -->
    <div class="mt-4 grid grid-cols-2 gap-3">
      <!-- 季度信息 -->
      <div class="bg-glass-dark rounded-xl p-3 border border-white/10">
        <div class="text-center">
          <div class="text-web3-cyan text-xs mb-1">當前季度</div>
          <div class="text-white font-bold">{{ quarterInfo.name }}</div>
          <div class="text-white/60 text-xs">{{ quarterInfo.timeRange }}</div>
        </div>
      </div>
      
      <!-- 發行信息 -->
      <div class="bg-glass-dark rounded-xl p-3 border border-white/10">
        <div class="text-center">
          <div class="text-web3-green text-xs mb-1">最大發行量</div>
          <div class="text-white font-bold">{{ nftData.supply }}</div>
          <div class="text-white/60 text-xs">限量發行</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NFTPreviewCard',
  props: {
    nftData: {
      type: Object,
      required: true,
      default: () => ({
        name: 'NFT 預覽',
        description: '請填寫 NFT 描述',
        image: '/placeholder-nft.png',
        price: 0,
        tier: 'VIP',
        quarter: 1,
        endDate: '2024/12/31',
        supply: '9999'
      })
    },
    creatorInfo: {
      type: Object,
      required: true,
      default: () => ({
        name: '創作者',
        avatar: '/default-avatar.png',
        verified: false
      })
    },
    quarterInfo: {
      type: Object,
      required: true,
      default: () => ({
        name: '第1季',
        timeRange: '2024年 1月 - 3月'
      })
    }
  },
  methods: {
    formatPrice(price) {
      if (!price || price === 0) return '0.00'
      return parseFloat(price).toFixed(2)
    },
    
    formatUSD(stxPrice) {
      const usdRate = 0.5 // 簡化的STX/USD匯率
      return (parseFloat(stxPrice || 0) * usdRate).toFixed(2)
    },
    
    handleImageError() {
      // 圖片載入失敗時的處理
      console.log('NFT 圖片載入失敗')
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.nft-preview-card {
  filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.15));
}

.card-web3:hover {
  filter: drop-shadow(0 0 30px rgba(102, 126, 234, 0.25));
}
</style>