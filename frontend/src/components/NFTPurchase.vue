<template>
  <div class="nft-purchase">
    <!-- NFT 展示卡片 -->
    <div class="card-web3 p-6 mb-6">
      <div class="flex items-start space-x-6">
        <!-- NFT 預覽圖 -->
        <div class="w-48 h-48 bg-gradient-to-br from-web3-purple to-web3-cyan rounded-2xl flex items-center justify-center relative overflow-hidden">
          <img 
            v-if="seasonInfo?.metadata?.image" 
            :src="seasonInfo.metadata.image" 
            :alt="seasonInfo.metadata.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="text-center text-white">
            <svg class="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
              <path fill-rule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
            </svg>
            <p class="text-sm">訂閱章 NFT</p>
          </div>
          
          <!-- 收藏標誌 -->
          <div class="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            <span class="text-white text-xs font-medium">{{ seasonInfo?.tier || 'Premium' }}</span>
          </div>
          
          <!-- 限量標誌 -->
          <div class="absolute top-4 right-4 bg-web3-gold/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span class="text-white text-xs font-bold">
              {{ seasonInfo?.current_supply || 0 }}/{{ seasonInfo?.max_supply || 1000 }}
            </span>
          </div>
        </div>
        
        <!-- NFT 資訊 -->
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-4">
            <img 
              :src="creatorInfo?.avatar_uri || '/default-avatar.svg'" 
              :alt="creatorInfo?.name"
              class="w-12 h-12 rounded-full border-2 border-web3-purple"
            />
            <div>
              <h3 class="text-lg font-bold text-white">{{ creatorInfo?.name || '創作者' }}</h3>
              <p class="text-web3-silver text-sm">{{ creatorInfo?.category || '藝術創作' }}</p>
            </div>
            <div v-if="creatorInfo?.verified" class="text-web3-green">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
          
          <h2 class="text-2xl font-bold text-white mb-3">
            {{ seasonInfo?.metadata?.name || `第 ${seasonId} 期訂閱章` }}
          </h2>
          
          <p class="text-white/80 mb-4">
            {{ seasonInfo?.metadata?.description || '購買此訂閱章 NFT，解鎖創作者的會員專屬內容，同時獲得永久的收藏證明。' }}
          </p>
          
          <!-- 價格和購買 -->
          <div class="flex items-center justify-between">
            <div>
              <div class="text-3xl font-bold text-gradient-web3">
                {{ contractsStore.formatSTXAmount(seasonInfo?.price || 2000000) }} STX
              </div>
              <div class="text-web3-silver text-sm">
                ≈ ${{ (parseFloat(contractsStore.formatSTXAmount(seasonInfo?.price || 2000000)) * stxPrice).toFixed(2) }} USD
              </div>
            </div>
            
            <div class="text-right">
              <div class="text-white/60 text-sm mb-1">剩餘數量</div>
              <div class="text-xl font-bold text-white">
                {{ (seasonInfo?.max_supply || 1000) - (seasonInfo?.current_supply || 0) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 購買詳情 -->
    <div class="card-web3 p-6 mb-6">
      <h3 class="text-xl font-bold text-white mb-4">購買詳情</h3>
      
      <!-- 會員權益 -->
      <div class="space-y-3 mb-6">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-web3-green" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="text-white">解鎖會員專屬內容</span>
        </div>
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-web3-green" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="text-white">獲得不可轉讓的收藏證明</span>
        </div>
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-web3-green" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="text-white">支持創作者和團隊（自動分潤）</span>
        </div>
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-web3-green" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="text-white">有效期限：{{ formatExpiryDate(seasonInfo?.expiry_date) }}</span>
        </div>
      </div>
      
      <!-- 分潤說明 -->
      <div v-if="revenueSplitInfo && seasonInfo?.revenue_split_enabled" 
           class="bg-web3-purple/10 border border-web3-purple/30 rounded-xl p-4 mb-6">
        <h4 class="text-white font-medium mb-3">💰 收益分配透明化</h4>
        <div class="space-y-2">
          <div v-for="member in revenueSplitInfo.members" :key="member.wallet" 
               class="flex justify-between items-center">
            <span class="text-white/80">{{ member.role }}（{{ member.name || member.wallet.slice(0, 8) }}...）</span>
            <span class="text-web3-purple font-medium">{{ member.percentage }}%</span>
          </div>
        </div>
        <p class="text-white/60 text-sm mt-3">
          您的付款將按上述比例自動分配給創作團隊，確保每個貢獻者都能獲得應有的報酬。
        </p>
      </div>
    </div>
    
    <!-- 購買按鈕 -->
    <div class="text-center">
      <button
        v-if="!walletStore.isConnected"
        @click="walletStore.connectWallet"
        class="btn-web3 px-8 py-4 rounded-2xl text-lg"
      >
        連接錢包購買
      </button>
      
      <button
        v-else-if="alreadyPurchased"
        disabled
        class="btn-glass px-8 py-4 rounded-2xl text-lg opacity-50 cursor-not-allowed"
      >
        ✓ 您已擁有此訂閱章
      </button>
      
      <button
        v-else-if="!seasonInfo?.active"
        disabled
        class="btn-glass px-8 py-4 rounded-2xl text-lg opacity-50 cursor-not-allowed"
      >
        此季度暫停銷售
      </button>
      
      <button
        v-else-if="(seasonInfo?.current_supply || 0) >= (seasonInfo?.max_supply || 0)"
        disabled
        class="btn-glass px-8 py-4 rounded-2xl text-lg opacity-50 cursor-not-allowed"
      >
        已售完
      </button>
      
      <button
        v-else
        @click="purchaseNFT"
        :disabled="contractsStore.isLoading"
        class="btn-web3 px-8 py-4 rounded-2xl text-lg relative overflow-hidden group"
      >
        <span v-if="contractsStore.isLoading" class="flex items-center justify-center">
          <div class="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
          處理中...
        </span>
        <span v-else>立即購買 {{ contractsStore.formatSTXAmount(seasonInfo?.price || 2000000) }} STX</span>
      </button>
    </div>
    
    <!-- 成功提示 -->
    <div v-if="purchaseSuccess" class="mt-6 p-4 bg-web3-green/20 border border-web3-green/50 rounded-xl text-center">
      <div class="w-16 h-16 bg-web3-green rounded-full flex items-center justify-center mx-auto mb-3">
        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-white mb-2">購買成功！</h3>
      <p class="text-white/80 mb-4">您已成功獲得第 {{ seasonId }} 期訂閱章 NFT</p>
      <div class="flex justify-center space-x-4">
        <button
          @click="$router.push('/my-collections')"
          class="btn-web3 px-6 py-2 rounded-xl"
        >
          查看我的收藏
        </button>
        <button
          @click="$router.push(`/creator/${creatorAddress}`)"
          class="btn-glass px-6 py-2 rounded-xl"
        >
          瀏覽會員內容
        </button>
      </div>
    </div>
    
    <!-- 錯誤提示 -->
    <div v-if="contractsStore.error" class="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
      <p class="text-red-400">{{ contractsStore.error }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useContractsStore } from '@/stores/contracts'
import { useWalletStore } from '@/stores/wallet'

export default {
  name: 'NFTPurchase',
  props: {
    creatorAddress: {
      type: String,
      required: true
    },
    seasonId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const contractsStore = useContractsStore()
    const walletStore = useWalletStore()
    
    const seasonInfo = ref(null)
    const creatorInfo = ref(null)
    const revenueSplitInfo = ref(null)
    const purchaseSuccess = ref(false)
    const stxPrice = ref(0.5) // 假設的STX價格，實際應該從API獲取
    
    const alreadyPurchased = computed(() => {
      // 這裡應該檢查用戶是否已經購買過此NFT
      return false
    })
    
    const formatExpiryDate = (timestamp) => {
      if (!timestamp) return '永久有效'
      const date = new Date(timestamp * 1000)
      return date.toLocaleDateString('zh-TW')
    }
    
    const loadSeasonInfo = async () => {
      try {
        seasonInfo.value = await contractsStore.getSeasonInfo(props.creatorAddress, props.seasonId)
        creatorInfo.value = await contractsStore.getCreatorInfo(props.creatorAddress)
        revenueSplitInfo.value = await contractsStore.getRevenueSplit(props.creatorAddress)
      } catch (error) {
        console.error('載入季度資訊失敗:', error)
      }
    }
    
    const purchaseNFT = async () => {
      try {
        const metadataUri = `https://api.satscribe.com/nft/${props.creatorAddress}/${props.seasonId}`
        
        await contractsStore.purchaseNFT(
          props.creatorAddress,
          props.seasonId,
          metadataUri
        )
        
        purchaseSuccess.value = true
        
        // 重新載入季度信息以更新剩餘數量
        setTimeout(loadSeasonInfo, 2000)
        
      } catch (error) {
        console.error('購買失敗:', error)
      }
    }
    
    onMounted(() => {
      loadSeasonInfo()
    })
    
    return {
      contractsStore,
      walletStore,
      seasonInfo,
      creatorInfo,
      revenueSplitInfo,
      purchaseSuccess,
      alreadyPurchased,
      stxPrice,
      
      formatExpiryDate,
      purchaseNFT
    }
  }
}
</script>