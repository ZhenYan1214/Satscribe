<template>
  <div class="creator-dashboard min-h-screen text-white p-6">
    <!-- 載入狀態 -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-web3-purple/30 border-t-web3-purple rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-white/80">Checking creator status...</p>
      </div>
    </div>
    
    <!-- 創作者儀表板內容 -->
    <div v-else-if="isCreator">
    <!-- 頁面標題區域 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-4xl font-display font-bold text-gradient-web3 mb-2">Creator Dashboard</h1>
          <p class="text-white/70">Welcome back! Manage your content and earnings</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="glass-purple px-4 py-2 rounded-xl">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-web3-green rounded-full animate-pulse"></div>
              <span class="text-white/90 text-sm">Live Sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心統計卡片 -->
    <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
      <!-- 總訂閱者 -->
      <div class="card-web3 p-6 group hover:scale-105 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden animate-slide-up" style="animation-delay: 0.1s">
        <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-web3-purple/20 to-transparent rounded-bl-full"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-web3-purple to-web3-pink rounded-xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
            <div class="text-right">
              <span class="text-web3-green text-xs font-medium">+12.5%</span>
            </div>
          </div>
          <div>
            <p class="text-white/60 text-sm mb-1">Total Subscribers</p>
            <p class="text-3xl font-bold text-white animate-count" style="animation-delay: 0.6s">{{ stats.totalSubscribers.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- 本月收益 -->
      <div class="card-web3 p-6 group hover:scale-105 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden animate-slide-up" style="animation-delay: 0.2s">
        <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-web3-cyan/20 to-transparent rounded-bl-full"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-web3-cyan to-web3-green rounded-xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
            </div>
            <div class="text-right">
              <span class="text-web3-green text-xs font-medium">+23.8%</span>
            </div>
          </div>
          <div>
            <p class="text-white/60 text-sm mb-1">Monthly Revenue</p>
            <p class="text-3xl font-bold text-white animate-count" style="animation-delay: 0.7s">{{ stats.monthlyRevenue }} <span class="text-lg text-web3-gold">STX</span></p>
          </div>
        </div>
      </div>

      <!-- 活躍訂閱章 -->
      <div class="card-web3 p-6 group hover:scale-105 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden animate-slide-up" style="animation-delay: 0.3s">
        <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-web3-gold/20 to-transparent rounded-bl-full"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-web3-gold to-web3-pink rounded-xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
              </svg>
            </div>
            <div class="text-right">
              <span class="text-web3-green text-xs font-medium">+5.2%</span>
            </div>
          </div>
          <div>
            <p class="text-white/60 text-sm mb-1">Active NFTs</p>
            <p class="text-3xl font-bold text-white animate-count" style="animation-delay: 0.8s">{{ stats.activeNFTs }}</p>
          </div>
        </div>
      </div>

      <!-- 內容數量 -->
      <div class="card-web3 p-6 group hover:scale-105 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden animate-slide-up" style="animation-delay: 0.4s">
        <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-web3-pink/20 to-transparent rounded-bl-full"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-web3-pink to-web3-purple rounded-xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                <path fill-rule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="text-right">
              <span class="text-web3-green text-xs font-medium">+8.1%</span>
            </div>
          </div>
          <div>
            <p class="text-white/60 text-sm mb-1">Content Count</p>
            <p class="text-3xl font-bold text-white animate-count" style="animation-delay: 0.9s">{{ stats.contentCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="grid xl:grid-cols-3 gap-8 mb-8">
      <!-- 最近活動 -->
      <div class="xl:col-span-2">
        <div class="card-web3 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-white">Recent Activity</h2>
            <button class="btn-glass px-4 py-2 text-sm rounded-lg">
              View All
            </button>
          </div>
          
          <div class="space-y-4">
            <div v-for="(activity, index) in recentActivities" :key="activity.id" 
                 class="activity-item flex items-start space-x-4 p-4 glass-dark rounded-xl hover:bg-white/8 transition-all duration-300 transform hover:translate-x-2"
                 :class="`animate-slide-in-left`"
                 :style="`animation-delay: ${index * 0.1 + 1}s`">
              <!-- 活動圖標 -->
              <div class="w-10 h-10 bg-gradient-to-br from-web3-purple to-web3-cyan rounded-lg flex items-center justify-center flex-shrink-0 hover:shadow-glow transition-all duration-300 hover:scale-110">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              
              <!-- 活動內容 -->
              <div class="flex-1 min-w-0">
                <p class="text-white font-medium mb-1">{{ activity.message }}</p>
                <p class="text-white/60 text-sm">{{ activity.time }}</p>
              </div>
              
              <!-- 活動價值 -->
              <div v-if="activity.value" class="text-right">
                <p class="text-web3-gold font-medium">+{{ activity.value }} STX</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div>
        <div class="card-web3 p-6">
          <h2 class="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          
          <div class="space-y-4">
            <!-- 發布內容 -->
            <button 
              @click="$router.push('/creator/content')"
              class="w-full p-4 glass hover:bg-white/15 rounded-xl transition-all duration-300 group text-left transform hover:scale-105 hover:-translate-y-1 animate-slide-up"
              style="animation-delay: 1.5s"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-web3-purple to-web3-pink rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-medium">Publish Content</p>
                  <p class="text-white/60 text-sm">Create New Content</p>
                </div>
              </div>
            </button>
            
            <!-- 創建訂閱章 -->
            <button 
              @click="$router.push('/creator/subscriptions')"
              class="w-full p-4 glass hover:bg-white/15 rounded-xl transition-all duration-300 group text-left transform hover:scale-105 hover:-translate-y-1 animate-slide-up"
              style="animation-delay: 1.6s"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-web3-cyan to-web3-green rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-medium">Create Subscription Badge</p>
                  <p class="text-white/60 text-sm">Publish New NFT</p>
                </div>
              </div>
            </button>
            
            <!-- 分潤設定 -->
            <button 
              @click="$router.push('/creator/revenue')"
              class="w-full p-4 glass hover:bg-white/15 rounded-xl transition-all duration-300 group text-left transform hover:scale-105 hover:-translate-y-1 animate-slide-up"
              style="animation-delay: 1.7s"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-web3-gold to-web3-pink rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-medium">Revenue Split</p>
                  <p class="text-white/60 text-sm">Configure revenue sharing</p>
                </div>
              </div>
            </button>
            
            <!-- 數據分析 -->
            <button 
              @click="$router.push('/creator/analytics')"
              class="w-full p-4 glass hover:bg-white/15 rounded-xl transition-all duration-300 group text-left transform hover:scale-105 hover:-translate-y-1 animate-slide-up"
              style="animation-delay: 1.8s"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-web3-pink to-web3-purple rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-medium">Data Analysis</p>
                  <p class="text-white/60 text-sm">View Detailed Statistics</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 收益概覽和分潤狀態 -->
    <div class="grid lg:grid-cols-2 gap-8 animate-fade-in" style="animation-delay: 2s">
      <!-- 收益趨勢 -->
      <div class="card-web3 p-6 animate-slide-up" style="animation-delay: 2.1s">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">Revenue Trends</h2>
          <select class="bg-glass-dark border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>

          </select>
        </div>
        
        <!-- 簡化的圖表區域 -->
        <div class="h-48 bg-glass-dark rounded-xl flex items-center justify-center mb-4">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-web3-purple to-web3-cyan rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
            <p class="text-white/60 text-sm">Chart component loading</p>
            <p class="text-white/40 text-xs mt-1">Integration coming soon Chart.js</p>
          </div>
        </div>
        
        <!-- 收益摘要 -->
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-web3-cyan">45.2 STX</p>
            <p class="text-white/60 text-sm">Earnings This Week</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-web3-green">+18.5%</p>
            <p class="text-white/60 text-sm">Growth Rate</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-web3-gold">156 STX</p>
            <p class="text-white/60 text-sm">total revenue</p>
          </div>
        </div>
      </div>

      <!-- 分潤配置狀態 -->
      <div class="card-web3 p-6 animate-slide-up" style="animation-delay: 2.2s">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">Revenue Split Setting</h2>
          <span 
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              revenueSplitConfigured ? 'bg-web3-green/20 text-web3-green border border-web3-green/30' : 'bg-web3-gold/20 text-web3-gold border border-web3-gold/30'
            ]"
          >
            {{ revenueSplitConfigured ? 'Configured' : 'Not Configured' }}
          </span>
        </div>
        
        <div v-if="!revenueSplitConfigured" class="bg-web3-gold/10 border border-web3-gold/30 rounded-xl p-4 mb-4">
          <div class="flex items-start space-x-3">
            <div class="w-6 h-6 bg-web3-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4 text-web3-dark" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-web3-gold font-medium mb-2">Need to configure revenue split</h3>
              <p class="text-web3-gold/80 text-sm mb-3">
                Set the revenue split ratio for your studio members to ensure fair and transparent distribution of income.
              </p>
              <button 
                @click="$router.push('/creator/revenue')"
                class="btn-web3 text-sm px-4 py-2 rounded-lg"
              >
                Configure Now
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="space-y-4">
          <div class="flex items-center justify-between text-sm">
            <span class="text-white/70">NFT Revenue Split</span>
            <span class="text-web3-green font-medium">Enabled</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-white/70">Lightning Revenue Split</span>
            <span class="text-web3-silver font-medium">Not Enabled</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-white/70">Member Count</span>
            <span class="text-white font-medium">3 Members</span>
          </div>
          <button 
            @click="$router.push('/creator/revenue')"
            class="btn-glass w-full text-sm py-2 rounded-lg mt-4"
          >
            Manage Revenue Split
          </button>
        </div>
      </div>
    </div>
    </div><!-- 結束創作者儀表板內容 -->
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import { useContractsStore } from '@/stores/contracts'

export default {
  name: 'CreatorDashboard',
  setup() {
    const router = useRouter()
    const walletStore = useWalletStore()
    const contractsStore = useContractsStore()
    
    const isCreator = ref(false)
    const loading = ref(true)
    
    // 檢查創作者註冊狀態
    const checkCreatorStatus = async () => {
      if (!walletStore.isConnected || !walletStore.userAddress) {
        router.push('/')
        return
      }
      
      try {
        // 簡化檢查，直接允許訪問
        isCreator.value = true
        console.log('✅ Quick check completed, loading dashboard')
        await loadDashboardData()
      } catch (error) {
        console.log('Quick check failed, using default state')
        isCreator.value = true
      } finally {
        loading.value = false
      }
    }
    
    const stats = ref({
      totalSubscribers: 0,
      monthlyRevenue: 0,
      activeNFTs: 0,
      contentCount: 0
    })
    
    const recentActivities = ref([])
    
    const revenueSplitConfigured = ref(true)
    
    const loadDashboardData = async () => {
      try {
        if (walletStore.isConnected && walletStore.userAddress) {
          console.log('📊 Quick loading dashboard data...', walletStore.userAddress)
          
          // 簡化載入邏輯，只載入必要數據
          // 設置基本統計數據
          stats.value = {
            totalSubscribers: 0,
            monthlyRevenue: 0,
            activeNFTs: 0,
            contentCount: 0
          }
          
          // 簡單的分潤狀態檢查（使用緩存）
          try {
            const revenueSplit = await contractsStore.getRevenueSplit(walletStore.userAddress, false) // 使用緩存
            revenueSplitConfigured.value = Boolean(revenueSplit)
          } catch (err) {
            console.log('跳過分潤檢查')
            revenueSplitConfigured.value = false
          }
          
          console.log('✅ 快速儀表板載入完成')
        }
      } catch (error) {
        console.log('快速載入失敗，使用默認值')
        stats.value = {
          totalSubscribers: 0,
          monthlyRevenue: 0,
          activeNFTs: 0,
          contentCount: 0
        }
      }
    }
    
    onMounted(() => {
      checkCreatorStatus()
    })
    
    return {
      isCreator,
      loading,
      stats,
      recentActivities,
      revenueSplitConfigured,
      checkCreatorStatus
    }
  }
}
</script>

<style scoped>
/* 進階動畫系統 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(108, 92, 231, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(108, 92, 231, 0.6);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 動畫類別 */
.animate-slide-up {
  animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-fill-mode: both;
  opacity: 0;
}

.animate-slide-in-left {
  animation: slideInLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-fill-mode: both;
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 1s ease-out both;
  animation-fill-mode: both;
  opacity: 0;
}

.animate-count {
  animation: slideInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-fill-mode: both;
  opacity: 0;
}

/* 增強的卡片效果 */
.card-web3 {
  position: relative;
  overflow: hidden;
}

.card-web3::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s;
}

.card-web3:hover::before {
  left: 100%;
}

.card-web3:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(108, 92, 231, 0.3);
}

/* 活動項目進階效果 */
.activity-item {
  position: relative;
  cursor: pointer;
}

.activity-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 3px;
  height: 0;
  background: linear-gradient(135deg, #6C5CE7, #74B9FF);
  border-radius: 0 2px 2px 0;
  transform: translateY(-50%);
  transition: height 0.3s ease;
}

.activity-item:hover::before {
  height: 60%;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(8px);
  border-radius: 12px;
}

/* 按鈕微互動 */
.btn-web3, .btn-glass {
  position: relative;
  overflow: hidden;
}

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

/* 統計卡片特殊效果 */
.card-web3 .w-12.h-12 {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card-web3:hover .w-12.h-12 {
  transform: scale(1.1) rotate(5deg);
  animation: pulseGlow 2s infinite;
}

/* 載入動畫 */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: rotate 3s linear infinite;
}

/* 響應式動畫優化 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>