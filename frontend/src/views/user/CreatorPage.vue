<template>
  <div class="creator-page">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- 创作者头部信息 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex items-start space-x-6">
          <div class="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold mb-2">{{ creator.name || 'Loading...' }}</h1>
            <p class="text-gray-600 mb-4">{{ creator.bio || '暂无简介' }}</p>
            <div class="flex items-center space-x-6 text-sm text-gray-500">
              <span>{{ creator.subscribers || 0 }} subscribers</span>
              <span>{{ creator.category || '未分类' }}</span>
              <span v-if="creator.verified" class="text-blue-600">✓ validated</span>
            </div>
          </div>
          <div class="text-right">
            <button 
              @click="subscribeToCreator"
              class="btn-primary mb-2"
              :disabled="!walletConnected || isLoading || availableSeasons.length === 0 || hasValidSubscription"
            >
            <span v-if="isLoading">Purchasing...</span>
            <span v-else-if="hasValidSubscription">You already own this NFT</span>
            <span v-else-if="availableSeasons.length === 0">No items available for purchase</span>
            <span v-else>Purchase {{ creator.price || 1 }} STX</span>

            </button>
            <p class="text-sm text-gray-500">
              <span v-if="availableSeasons.length > 0">Season {{ currentSeason }} NFT</span>
              <span v-else>This creator has not released any NFTs yet</span>
            </p>
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- 主要内容 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">Latest Content</h2>
            
            <div v-if="contents.length > 0" class="space-y-6">
              <div 
                v-for="content in contents" 
                :key="content.id"
                class="border-b pb-6 last:border-b-0"
              >
                <h3 class="text-lg font-medium mb-2">{{ content.title }}</h3>
                <p class="text-gray-600 mb-3">{{ content.preview }}</p>
                
                <div v-if="content.isPremium && !hasValidSubscription" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-yellow-800 font-medium">Members-only Content</span>
                  </div>
                  <p class="text-yellow-700 text-sm mt-1">Full content available after purchasing a subscription badge</p>
                </div>
                
                <div class="flex items-center justify-between text-sm text-gray-500 mt-3">
                  <span>{{ content.publishDate }}</span>
                  <span v-if="content.isPremium" class="bg-gold-100 text-gold-800 px-2 py-1 rounded">Members-only</span>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-12">
              <p class="text-gray-500">This creator has not published any content yet</p>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="space-y-6">
          <!-- 可用 NFT 季度 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">Available for purchase NFT</h3>
            
            <div v-if="availableSeasons.length > 0" class="space-y-4">
              <div 
                v-for="season in availableSeasons" 
                :key="season.seasonId"
                :class="[
                  'border rounded-lg p-4 cursor-pointer transition-colors',
                  currentSeason === season.seasonId 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                ]"
                @click="currentSeason = season.seasonId; creator.price = season.price"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium">Season {{ season.seasonId }}</h4>
                    <p class="text-sm text-gray-500">Max supply: {{ season.maxSupply }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-bold text-blue-600">{{ season.price }} STX</p>
                    <p class="text-xs text-gray-400">Sold: {{ season.currentSupply }}</p>
                  </div>
                </div>
              </div>
              
              <button 
                @click="subscribeToCreator"
                class="btn-primary w-full"
                :disabled="!walletConnected || isLoading || hasValidSubscription"
              >
              <span v-if="isLoading">Purchasing...</span>
              <span v-else-if="hasValidSubscription">You already own this NFT</span>
              <span v-else>Buy Now</span>

              </button>
            </div>
            
            <div v-else class="text-center py-8">
              <div class="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <p class="text-gray-500">This creator has not published anything yet NFT</p>
            </div>
          </div>

          <!-- 统计信息 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">Statistics</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Subscribers</span>
                <span class="font-medium">{{ creator.subscribers || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Number of Contents</span>
                <span class="font-medium">{{ contents.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Join Date</span>
                <span class="font-medium">{{ formatDate(creator.registrationDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import { useContractsStore } from '@/stores/contracts'

export default {
  name: 'CreatorPage',
  props: {
    address: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const walletStore = useWalletStore()
    const contractsStore = useContractsStore()
    
    const creator = ref({})
    const contents = ref([])
    const currentSeason = ref(1)
    const hasValidSubscription = ref(false)
    const availableSeasons = ref([])
    const isLoading = ref(false)
    
    const walletConnected = computed(() => walletStore.isConnected)
    
    const subscribeToCreator = async () => {
      if (!walletConnected.value) {
        alert('Please connect your wallet first')
        return
      }
      
      isLoading.value = true
      try {
        console.log('Start Purchase NFT:', props.address, currentSeason.value)
        const result = await contractsStore.purchaseNFT(
          walletStore.userAddress,
          props.address,
          currentSeason.value
        )
        console.log('Purchase successful:', result)
        alert('Purchase successful! Revenue has been automatically distributed according to the sharing rules!')
        await loadCreatorData() // Reload data
      } catch (error) {
          console.error('Purchase failed:', error)
        alert('Purchase failed: ' + error.message)
      } finally {
        isLoading.value = false
      }
    }
    
    const loadCreatorData = async () => {
      try {
        console.log('Load creator data:', props.address)
        
        // 載入創作者基本資訊
        const creatorInfo = await contractsStore.getCreatorInfo(props.address, true)
        if (creatorInfo) {
          creator.value = {
            name: creatorInfo.name || 'Creator',
            bio: creatorInfo.description || 'Welcome to my creative space',
            category: creatorInfo.category || 'Create',
            subscribers: 0, // TODO: 計算實際訂閱者數量
            verified: true,
            registrationDate: new Date()
          }
        } else {
          creator.value = {
            name: 'Unregistered Creator',
            bio: 'This address has not been registered as a creator',
            category: 'Unknown',
            subscribers: 0,
            verified: false,
            registrationDate: null
          }
        }
        
        // 載入可用的季度 NFT
        availableSeasons.value = []
        for (let seasonId = 1; seasonId <= 10; seasonId++) {
          try {
            const seasonData = await contractsStore.getSeasonInfo(props.address, seasonId, true)
            if (seasonData && seasonData.price !== undefined) {
              availableSeasons.value.push({
                seasonId,
                price: seasonData.price,
                maxSupply: seasonData.max_supply || seasonData.maxSupply || 100,
                // TODO: 載入實際的 currentSupply
                currentSupply: 0
              })
            }
          } catch (seasonError) {
            console.log(`Seasons ${seasonId} not exist`)
          }
        }
        
        // 設定當前季度為第一個可用季度
        if (availableSeasons.value.length > 0) {
          currentSeason.value = availableSeasons.value[0].seasonId
          creator.value.price = availableSeasons.value[0].price
        }
        
        // 清空內容，因為我們專注於 NFT 訂閱
        contents.value = []
        
        console.log('Creator data loaded successfully:', creator.value)
        console.log('Available Seasons:', availableSeasons.value)
        
        // 檢查用戶是否已有有效訂閱
        if (walletConnected.value && availableSeasons.value.length > 0) {
          try {
            hasValidSubscription.value = await contractsStore.checkSubscriptionValid(
              walletStore.userAddress,
              props.address,
              currentSeason.value
            )
          } catch (error) {
            console.log('檢查訂閱狀態失敗:', error)
            hasValidSubscription.value = false
          }
        }
      } catch (error) {
        console.error('載入創作者數據失敗:', error)
      }
    }
    
    const formatDate = (date) => {
      if (!date) return '未知'
      return new Date(date).toLocaleDateString('zh-CN')
    }
    
    onMounted(() => {
      loadCreatorData()
    })
    
    return {
      creator,
      contents,
      currentSeason,
      hasValidSubscription,
      availableSeasons,
      isLoading,
      walletConnected,
      subscribeToCreator,
      formatDate
    }
  }
}
</script>