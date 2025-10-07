<template>
  <div class="home-page min-h-screen text-white">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <!-- 背景網格 -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-mesh-pattern"></div>
      </div>
      
      <div class="max-w-7xl mx-auto text-center relative z-10">
        <!-- 主標題區域 -->
        <div class="mb-12 animate-fade-in">
          <div class="inline-flex items-center space-x-2 bg-glass-purple/50 backdrop-blur-sm px-4 py-2 rounded-full border border-web3-purple/30 mb-8">
            <div class="w-2 h-2 bg-web3-green rounded-full animate-pulse"></div>
            <span class="text-web3-silver text-sm font-medium">去中心化創作者經濟</span>
          </div>
          
          <h1 class="text-6xl md:text-8xl font-display font-bold mb-6 leading-tight">
            <span class="text-gradient-web3">讓每一份</span><br>
            <span class="text-white">支持都被</span>
            <span class="text-gradient-web3">記錄</span>
          </h1>
          
          <p class="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Satscribe 將創作者支持轉化為永久的數位資產<br>
            <span class="text-web3-cyan">透明分潤</span> • 
            <span class="text-web3-pink">可收藏證明</span> • 
            <span class="text-web3-gold">真正自主權</span>
          </p>
        </div>

        <!-- CTA 按鈕組 -->
        <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
          <button 
            @click="switchToCreator"
            class="btn-web3 text-lg px-8 py-4 rounded-2xl relative group overflow-hidden min-w-[200px]"
          >
            <span class="relative z-10 flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd"/>
              </svg>
              <span>成為創作者</span>
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-web3-purple to-web3-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button 
            @click="goToExplore"
            class="btn-glass text-lg px-8 py-4 rounded-2xl min-w-[200px] group"
          >
            <span class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
              </svg>
              <span>探索平台</span>
            </span>
          </button>
        </div>

        <!-- 統計數據 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div class="text-center animate-scale-in" style="animation-delay: 0.2s;">
            <div class="text-3xl md:text-4xl font-bold text-gradient-web3 mb-2">2.4K+</div>
            <div class="text-web3-silver">創作者</div>
          </div>
          <div class="text-center animate-scale-in" style="animation-delay: 0.4s;">
            <div class="text-3xl md:text-4xl font-bold text-gradient-web3 mb-2">15.6K</div>
            <div class="text-web3-silver">訂閱章 NFT</div>
          </div>
          <div class="text-center animate-scale-in" style="animation-delay: 0.6s;">
            <div class="text-3xl md:text-4xl font-bold text-gradient-web3 mb-2">892</div>
            <div class="text-web3-silver">STX 總收益</div>
          </div>
          <div class="text-center animate-scale-in" style="animation-delay: 0.8s;">
            <div class="text-3xl md:text-4xl font-bold text-gradient-web3 mb-2">99.2%</div>
            <div class="text-web3-silver">創作者滿意度</div>
          </div>
        </div>
      </div>

      <!-- 向下滾動指示器 -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </div>
    </section>

    <!-- 特色功能區 -->
    <section class="py-24 px-4 relative">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-6xl font-display font-bold mb-6">
            <span class="text-gradient-web3">重新定義</span><br>
            <span class="text-white">創作者經濟</span>
          </h2>
          <p class="text-xl text-white/80 max-w-3xl mx-auto">
            基於 Stacks 區塊鏈的創新 Creator-Fi 平台，讓支持變成可收藏的數位資產
          </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
          <!-- 特色卡片 1 -->
          <div class="card-web3 p-8 group hover:scale-105 transition-all duration-500">
            <div class="relative mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-web3-purple to-web3-pink rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">可收藏的支持證明</h3>
              <p class="text-white/70 leading-relaxed">
                每次訂閱都鑄造為獨一無二的 Soulbound Token，永久記錄您的支持歷程，讓每一份支持都成為珍貴的數位收藏。
              </p>
            </div>
            <div class="flex items-center text-web3-cyan text-sm font-medium">
              <span>了解更多</span>
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>

          <!-- 特色卡片 2 -->
          <div class="card-web3 p-8 group hover:scale-105 transition-all duration-500" style="animation-delay: 0.2s;">
            <div class="relative mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-web3-cyan to-web3-green rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">智慧分潤機制</h3>
              <p class="text-white/70 leading-relaxed">
                基於 Clarity 智慧合約的透明收益分配系統，讓工作室成員獲得公平報酬，所有分配規則公開透明且不可篡改。
              </p>
            </div>
            <div class="flex items-center text-web3-cyan text-sm font-medium">
              <span>了解更多</span>
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>

          <!-- 特色卡片 3 -->
          <div class="card-web3 p-8 group hover:scale-105 transition-all duration-500" style="animation-delay: 0.4s;">
            <div class="relative mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-web3-gold to-web3-pink rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">真正的去中心化</h3>
              <p class="text-white/70 leading-relaxed">
                建立在 Bitcoin L2 Stacks 上，創作者完全掌控自己的收益和數據，無需依賴中心化平台，真正實現創作自由。
              </p>
            </div>
            <div class="flex items-center text-web3-cyan text-sm font-medium">
              <span>了解更多</span>
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 熱門創作者區 -->
    <section class="py-24 px-4 relative">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-4xl md:text-5xl font-display font-bold text-gradient-web3 mb-4">精選創作者</h2>
            <p class="text-white/70 text-lg">探索平台上最優質的創作者和內容</p>
          </div>
          <button class="btn-glass px-6 py-3 rounded-xl group">
            <span class="flex items-center space-x-2">
              <span>查看全部</span>
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </span>
          </button>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6" v-if="featuredCreators.length > 0">
          <div 
            v-for="(creator, index) in featuredCreators" 
            :key="creator.address"
            class="card-web3 overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-500"
            :style="`animation-delay: ${index * 0.1}s`"
            @click="goToCreator(creator.address)"
          >
            <!-- 創作者頭像區域 -->
            <div class="aspect-square bg-gradient-to-br from-web3-purple via-web3-cyan to-web3-pink relative overflow-hidden">
              <div class="absolute inset-0 bg-black/20"></div>
              <div class="absolute bottom-4 left-4 right-4">
                <div class="glass backdrop-blur-md rounded-lg p-3">
                  <div class="flex items-center justify-between mb-1">
                    <h3 class="font-bold text-white text-lg">{{ creator.name }}</h3>
                    <span v-if="creator.isOwn" class="bg-web3-gold text-black text-xs px-2 py-1 rounded-full font-bold">
                      您的帳號
                    </span>
                  </div>
                  <p class="text-white/80 text-sm">{{ creator.category }}</p>
                </div>
              </div>
              <!-- Hover 效果 -->
              <div class="absolute inset-0 bg-gradient-to-t from-web3-purple/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <!-- 創作者信息 -->
            <div class="p-6">
              <div class="flex justify-between items-center mb-3">
                <span class="text-white/70 text-sm">{{ creator.subscribers }} 訂閱者</span>
                <span class="text-web3-gold font-bold">{{ creator.price }} STX</span>
              </div>
              <button class="btn-web3 w-full text-sm py-2 rounded-lg">
                查看詳情
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-16">
          <div class="w-24 h-24 bg-glass-purple rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-3">發現您的創作者帳號</h3>
          <p class="text-white/70 mb-6">
            <span v-if="!testCreatorAddress">請先註冊為創作者並建立 NFT，然後重新載入</span>
            <span v-else>發現您的創作者帳號！點擊下方測試收益分潤功能</span>
          </p>
          <div class="space-y-4">
            <button 
              @click="loadCreators"
              class="btn-glass px-8 py-3 rounded-xl mr-4"
              :disabled="isLoadingCreators"
            >
              <span v-if="isLoadingCreators">載入中...</span>
              <span v-else>重新載入</span>
            </button>
            <button 
              @click="testPurchaseFlow"
              class="btn-web3 px-8 py-3 rounded-xl"
              v-if="testCreatorAddress"
            >
              測試購買 NFT
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA 區域 -->
    <section class="py-24 px-4 relative">
      <div class="max-w-4xl mx-auto text-center">
        <div class="card-web3 p-12 relative overflow-hidden">
          <!-- 背景裝飾 -->
          <div class="absolute inset-0 bg-gradient-to-br from-web3-purple/20 to-web3-cyan/20"></div>
          
          <div class="relative z-10">
            <h2 class="text-4xl md:text-5xl font-display font-bold text-gradient-web3 mb-6">
              準備好加入革命了嗎？
            </h2>
            <p class="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              開始您的 Creator-Fi 之旅，讓每一份創作都獲得應有的價值與回報
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                @click="switchToCreator"
                class="btn-web3 text-lg px-8 py-4 rounded-2xl min-w-[200px]"
              >
                立即開始創作
              </button>
              <button 
                @click="goToExplore"
                class="btn-glass text-lg px-8 py-4 rounded-2xl min-w-[200px]"
              >
                探索內容
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 測試工作流程區 -->
    <section class="py-20 px-4 relative" v-if="testCreatorAddress">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-display font-bold text-gradient-web3 mb-4">
            收益分潤測試流程
          </h2>
          <p class="text-white/70 text-lg max-w-2xl mx-auto">
            使用不同錢包地址購買您的 NFT，測試收益分潤機制是否正常運作
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- 步驟 1 -->
          <div class="card-web3 p-6 text-center">
            <div class="w-12 h-12 bg-gradient-to-br from-web3-cyan to-web3-blue rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white font-bold text-xl">1</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">切換到測試錢包</h3>
            <p class="text-white/70 text-sm">
              使用 Leather 錢包切換到另一個測試地址，或創建新的測試錢包
            </p>
          </div>

          <!-- 步驟 2 -->
          <div class="card-web3 p-6 text-center">
            <div class="w-12 h-12 bg-gradient-to-br from-web3-purple to-web3-pink rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white font-bold text-xl">2</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">購買您的 NFT</h3>
            <p class="text-white/70 text-sm">
              點擊上方「測試購買 NFT」按鈕，使用測試錢包購買您自己的 NFT 季度
            </p>
          </div>

          <!-- 步驟 3 -->
          <div class="card-web3 p-6 text-center">
            <div class="w-12 h-12 bg-gradient-to-br from-web3-gold to-web3-orange rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white font-bold text-xl">3</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">驗證分潤結果</h3>
            <p class="text-white/70 text-sm">
              檢查您的創作者錢包和工作室成員錢包，確認收益已按設定的比例自動分配
            </p>
          </div>
        </div>

        <div class="text-center mt-12">
          <button 
            @click="testPurchaseFlow"
            class="btn-web3 text-lg px-10 py-4 rounded-2xl"
          >
            <svg class="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            開始測試收益分潤
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import { useContractsStore } from '@/stores/contracts'

export default {
  name: 'HomePage',
  setup() {
    const router = useRouter()
    const walletStore = useWalletStore()
    const contractsStore = useContractsStore()
    
    const featuredCreators = ref([])
    const isLoadingCreators = ref(false)
    
    // 添加一個測試用的創作者地址（用戶自己的地址）
    const testCreatorAddress = ref('')
    
    const switchToCreator = async () => {
      // 檢查錢包是否連接
      if (!walletStore.isConnected) {
        alert('請先連接錢包')
        return
      }
      
      // 導向創作者註冊頁面
      router.push('/creator/setup')
    }
    
    const goToCreator = (address) => {
      router.push(`/creator/${address}`)
    }
    
    const goToExplore = () => {
      router.push('/explore')
    }
    
    const loadCreators = async () => {
      try {
        console.log('載入真實創作者數據...')
        isLoadingCreators.value = true
        
        featuredCreators.value = []
        
        // 如果用戶錢包已連接，將用戶自己的地址設為測試創作者
        if (walletStore.isConnected && walletStore.userAddress) {
          testCreatorAddress.value = walletStore.userAddress
          
          // 檢查用戶是否已註冊為創作者
          try {
            const creatorInfo = await contractsStore.getCreatorInfo(walletStore.userAddress, true)
            if (creatorInfo) {
              console.log('找到用戶的創作者資料:', creatorInfo)
              
              // 檢查是否有可用的季度
              let hasAvailableSeasons = false
              let firstSeasonPrice = 1
              
              for (let seasonId = 1; seasonId <= 3; seasonId++) {
                try {
                  const seasonData = await contractsStore.getSeasonInfo(walletStore.userAddress, seasonId, true)
                  if (seasonData && seasonData.price !== undefined) {
                    hasAvailableSeasons = true
                    firstSeasonPrice = seasonData.price
                    break
                  }
                } catch (e) {
                  // 季度不存在，繼續
                }
              }
              
              if (hasAvailableSeasons) {
                featuredCreators.value.push({
                  address: walletStore.userAddress,
                  name: creatorInfo.name || '您的創作者帳號',
                  category: creatorInfo.category || '創作',
                  subscribers: 0, // TODO: 計算真實訂閱者
                  price: firstSeasonPrice,
                  isOwn: true // 標記為用戶自己的帳號
                })
              }
            }
          } catch (error) {
            console.log('用戶尚未註冊為創作者')
          }
        }
        
        console.log('載入的創作者:', featuredCreators.value.length, '位')
      } catch (error) {
        console.error('載入創作者失敗:', error)
      } finally {
        isLoadingCreators.value = false
      }
    }
    
    const testPurchaseFlow = () => {
      if (!walletStore.isConnected) {
        alert('請先連接錢包進行測試')
        return
      }
      
      // 導向用戶自己的創作者頁面進行測試
      if (testCreatorAddress.value) {
        router.push(`/creator/${testCreatorAddress.value}`)
      } else {
        alert('請先註冊為創作者，然後重新載入頁面')
      }
    }
    
    onMounted(async () => {
      // 初始化錢包
      await walletStore.initUserSession()
      // 延遲載入創作者，確保錢包已初始化
      setTimeout(() => {
        loadCreators()
      }, 1000)
    })
    
    return {
      featuredCreators,
      isLoadingCreators,
      testCreatorAddress,
      switchToCreator,
      goToCreator,
      goToExplore,
      loadCreators,
      testPurchaseFlow
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

/* 自定義動畫 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 1s ease-out;
}

/* 滾動觸發動畫 */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.animate-on-scroll.animate {
  opacity: 1;
  transform: translateY(0);
}

/* 鼠標懸停效果 */
.creator-card:hover {
  transform: translateY(-8px) scale(1.02);
}

/* 漸變文字閃爍效果 */
.text-gradient-web3 {
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>