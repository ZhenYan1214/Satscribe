<template>
  <div id="app" class="min-h-screen bg-web3-dark">
    <!-- 背景裝飾 -->
    <div class="fixed inset-0 z-0">
      <div class="absolute inset-0 bg-hero-gradient"></div>
      <div class="absolute inset-0 bg-mesh-gradient opacity-10 animate-gradient-xy"></div>
      <!-- 浮動粒子效果 -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-web3-purple rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-web3-cyan rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style="animation-delay: 2s;"></div>
      <div class="absolute bottom-1/4 left-1/3 w-96 h-96 bg-web3-pink rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style="animation-delay: 4s;"></div>
    </div>

    <!-- 導航欄 -->
    <nav class="relative z-50 glass-dark">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <router-link to="/" class="flex items-center space-x-1.5 group">
              <!-- Site Logo Image -->
              <div class="relative w-12 h-12 rounded-2xl overflow-hidden shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                <img src="@/assets/LOGO.png" alt="Satscribe Logo" class="w-full h-full object-cover transform rotate-[10deg]" />
              </div>
              <div>
                <h1 class="text-2xl font-display font-bold text-gradient-web3">Satscribe</h1>

              </div>
            </router-link>
          </div>

          <!-- 中央導航 -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link to="/explore" class="text-white/80 hover:text-white font-medium transition-colors duration-200 relative group">
              Explore
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-web3-purple to-web3-cyan group-hover:w-full transition-all duration-300"></span>
            </router-link>
            <router-link to="/my-collections" class="text-white/80 hover:text-white font-medium transition-colors duration-200 relative group">
              My Collections
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-web3-purple to-web3-cyan group-hover:w-full transition-all duration-300"></span>
            </router-link>
          </div>

          <!-- 右側按鈕 -->
          <div class="flex items-center space-x-4">
            <!-- 角色切換按鈕 -->
            <button 
              @click="toggleUserMode" 
              class="btn-glass text-sm px-4 py-2 relative overflow-hidden group"
            >
              <span class="relative z-10">{{ isCreatorMode ? 'User Mode' : 'Creator Mode' }}</span>
              <div class="absolute inset-0 bg-gradient-to-r from-web3-purple/20 to-web3-cyan/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            
            <!-- 錢包連接 -->
            <button 
              @click="connectWallet" 
              class="btn-web3 relative overflow-hidden group"
              v-if="!walletConnected"
            >
              <span class="relative z-10 flex items-center space-x-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                <span>Connect Wallet</span>
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-web3-cyan to-web3-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <!-- 已連接錢包顯示 -->
            <div v-else class="glass-purple px-4 py-2 rounded-xl">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-white text-sm font-mono">{{ walletAddress }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要內容區域 -->
    <main class="relative z-10">
      <router-view :key="routeKey" />
    </main>

    <!-- 全域載入效果 -->
    <transition name="fade">
      <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-web3-dark/80 backdrop-blur-sm">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-web3-purple/30 border-t-web3-purple rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-white/80">載入中...</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWalletStore } from './stores/wallet'
import { useBlockchainSync } from './composables/useBlockchainSync'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const walletStore = useWalletStore()
    
    // 初始化區塊鏈數據同步
    const { syncFromBlockchain } = useBlockchainSync()

    const isCreatorMode = ref(false)
    const isLoading = ref(false)

    const routeKey = computed(() => {
      return route.fullPath + (isCreatorMode.value ? '-creator' : '-user')
    })

    const walletConnected = computed(() => walletStore.isConnected)
    const walletAddress = computed(() => {
      const address = walletStore.userAddress
      if (address) {
        return address.slice(0, 6) + '...' + address.slice(-4)
      }
      return ''
    })

    const toggleUserMode = () => {
      isCreatorMode.value = !isCreatorMode.value
      
      // 根據當前模式跳轉到對應頁面
      if (isCreatorMode.value) {
        router.push('/creator/dashboard')
      } else {
        router.push('/')
      }
    }

    const connectWallet = async () => {
      try {
        isLoading.value = true
        await walletStore.connectWallet()
        // 強制觸發響應式更新
        await walletStore.initUserSession()
        
        // 連接錢包後自動同步區塊鏈數據
        setTimeout(() => {
          syncFromBlockchain()
        }, 1000)
      } catch (error) {
        console.error('連接錢包失敗:', error)
      } finally {
        isLoading.value = false
      }
    }

    // 監聽路由變化，顯示載入效果
    router.beforeEach((to, from, next) => {
      if (to.path !== from.path) {
        isLoading.value = true
      }
      next()
    })

    router.afterEach(() => {
      setTimeout(() => {
        isLoading.value = false
      }, 300)
    })

    onMounted(() => {
      // 初始化錢包
      walletStore.initUserSession()
    })

    return {
      isCreatorMode,
      isLoading,
      routeKey,
      walletConnected,
      walletAddress,
      toggleUserMode,
      connectWallet,
      syncFromBlockchain
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 自定義滾動條 */
:deep(*::-webkit-scrollbar) {
  width: 8px;
}

:deep(*::-webkit-scrollbar-track) {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

:deep(*::-webkit-scrollbar-thumb) {
  background: linear-gradient(135deg, #6C5CE7, #74B9FF);
  border-radius: 4px;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background: linear-gradient(135deg, #5A4FCF, #5FAFF7);
}
</style>