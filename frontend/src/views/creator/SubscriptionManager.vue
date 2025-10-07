<template>
  <div class="subscription-manager min-h-screen p-6 max-w-7xl mx-auto">
    <!-- 頁面標題 -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold text-gradient-web3 mb-2">訂閱管理中心</h1>
        <p class="text-white/70 text-lg">管理您的訂閱季度 NFT，追蹤銷售和收益表現</p>
      </div>
      <button 
        @click="showCreateModal = true" 
        class="btn-web3 px-6 py-3 rounded-xl flex items-center space-x-2 shadow-web3"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
        </svg>
        <span>創建新季度</span>
      </button>
    </div>

    <!-- 統計儀表板 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <!-- 總季度數 -->
      <div class="card-web3 p-6 hover:scale-[1.02] transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white/70 text-sm mb-1">總季度數</p>
            <p class="text-3xl font-bold text-white">{{ subscriptions.length }}</p>
          </div>
          <div class="w-12 h-12 bg-web3-purple/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center text-sm">
          <span class="text-web3-green">+{{ subscriptions.filter(s => s.active).length }}</span>
          <span class="text-white/50 ml-1">活躍中</span>
        </div>
      </div>

      <!-- 總銷售量 -->
      <div class="card-web3 p-6 hover:scale-[1.02] transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white/70 text-sm mb-1">總銷售量</p>
            <p class="text-3xl font-bold text-white">{{ totalSold }}</p>
          </div>
          <div class="w-12 h-12 bg-web3-cyan/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM6 9a1 1 0 112 0 1 1 0 01-2 0zm6 0a1 1 0 112 0 1 1 0 01-2 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center text-sm">
          <span class="text-white/50">售出率 </span>
          <span class="text-web3-cyan ml-1">{{ salesRate }}%</span>
        </div>
      </div>

      <!-- 總收益 -->
      <div class="card-web3 p-6 hover:scale-[1.02] transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white/70 text-sm mb-1">總收益</p>
            <p class="text-3xl font-bold text-white">{{ totalRevenue }}</p>
            <p class="text-sm text-web3-accent">STX</p>
          </div>
          <div class="w-12 h-12 bg-web3-emerald/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-emerald" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center text-sm">
          <span class="text-web3-emerald">≈ ${{ (totalRevenue * 0.5).toFixed(2) }}</span>
          <span class="text-white/50 ml-1">USD</span>
        </div>
      </div>

      <!-- 活躍訂閱 -->
      <div class="card-web3 p-6 hover:scale-[1.02] transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white/70 text-sm mb-1">活躍訂閱</p>
            <p class="text-3xl font-bold text-white">{{ activeSubscriptions }}</p>
          </div>
          <div class="w-12 h-12 bg-web3-amber/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-amber" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center text-sm">
          <span class="text-white/50">平均存續</span>
          <span class="text-web3-amber ml-1">{{ avgDuration }}天</span>
        </div>
      </div>
    </div>

    <!-- 快速操作欄 -->
    <div class="flex flex-wrap gap-4 mb-8">
      <button 
        @click="filterStatus = 'all'"
        :class="[
          'px-4 py-2 rounded-xl font-medium transition-all',
          filterStatus === 'all' 
            ? 'bg-web3-purple text-white shadow-glow' 
            : 'bg-glass text-white/70 hover:text-white'
        ]"
      >
        全部季度
      </button>
      <button 
        @click="filterStatus = 'active'"
        :class="[
          'px-4 py-2 rounded-xl font-medium transition-all',
          filterStatus === 'active' 
            ? 'bg-web3-purple text-white shadow-glow' 
            : 'bg-glass text-white/70 hover:text-white'
        ]"
      >
        活躍中
      </button>
      <button 
        @click="filterStatus = 'ended'"
        :class="[
          'px-4 py-2 rounded-xl font-medium transition-all',
          filterStatus === 'ended' 
            ? 'bg-web3-purple text-white shadow-glow' 
            : 'bg-glass text-white/70 hover:text-white'
        ]"
      >
        已結束
      </button>
      <div class="ml-auto flex items-center space-x-3">
        <select 
          v-model="sortBy" 
          class="bg-glass border border-white/20 rounded-xl px-3 py-2 text-white focus:border-web3-purple focus:outline-none"
        >
          <option value="seasonId">按季度排序</option>
          <option value="price">按價格排序</option>
          <option value="currentSupply">按銷量排序</option>
          <option value="expiryDate">按到期日排序</option>
        </select>
      </div>
    </div>

    <!-- 季度卡片網格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <!-- 現有季度卡片 -->
      <div 
        v-for="subscription in filteredSubscriptions" 
        :key="subscription.seasonId"
        class="card-web3 p-6 hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden"
      >
        <!-- 漸層背景 -->
        <div 
          class="absolute top-0 left-0 w-full h-20 opacity-20 -z-10"
          :style="{ background: subscription.gradient }"
        ></div>

        <!-- 季度標題和狀態 -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-2xl font-bold text-white mb-1">第 {{ subscription.seasonId }} 季</h3>
            <p class="text-web3-cyan text-sm font-medium">{{ getTierName(subscription.tier) }}</p>
          </div>
          <div class="flex flex-col items-end space-y-2">
            <span 
              :class="[
                'px-3 py-1 rounded-full text-xs font-bold',
                subscription.active 
                  ? 'bg-web3-green/20 text-web3-green' 
                  : 'bg-web3-rose/20 text-web3-rose'
              ]"
            >
              {{ subscription.active ? '🟢 活躍中' : '🔴 已結束' }}
            </span>
          </div>
        </div>

        <!-- 價格和描述 -->
        <div class="mb-6">
          <div class="flex items-baseline space-x-2 mb-3">
            <span class="text-3xl font-bold text-gradient-web3">{{ subscription.price }}</span>
            <span class="text-web3-cyan font-medium">STX</span>
            <span class="text-white/50 text-sm">≈ ${{ (subscription.price * 0.5).toFixed(2) }}</span>
          </div>
          <p class="text-white/70 text-sm line-clamp-2">
            {{ subscription.description || '暫無描述' }}
          </p>
        </div>

        <!-- 銷售進度 -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-white/70 text-sm">銷售進度</span>
            <span class="text-white font-medium">{{ subscription.currentSupply }}/{{ subscription.maxSupply }}</span>
          </div>
          <div class="w-full bg-glass-dark rounded-full h-3 overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-web3-purple to-web3-cyan"
              :style="{ width: (subscription.currentSupply / subscription.maxSupply) * 100 + '%' }"
            ></div>
          </div>
          <div class="flex justify-between items-center mt-2 text-sm">
            <span class="text-web3-emerald">{{ Math.round((subscription.currentSupply / subscription.maxSupply) * 100) }}% 已售出</span>
            <span class="text-white/50">收益: {{ (subscription.currentSupply * subscription.price).toFixed(1) }} STX</span>
          </div>
        </div>

        <!-- 到期時間 -->
        <div class="mb-6">
          <div class="flex items-center text-sm text-white/70">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
            <span>到期: {{ formatDate(subscription.expiryDate) }}</span>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="flex space-x-3">
          <button 
            @click="editSubscription(subscription)"
            class="flex-1 btn-glass py-2 text-sm rounded-xl hover:bg-white/20 transition-all"
          >
            ✏️ 編輯
          </button>
          <button 
            @click="viewDetails(subscription)"
            class="flex-1 btn-glass py-2 text-sm rounded-xl hover:bg-white/20 transition-all"
          >
            📊 詳情
          </button>
          <button 
            @click="shareSubscription(subscription)"
            class="btn-glass px-3 py-2 text-sm rounded-xl hover:bg-white/20 transition-all"
          >
            🔗
          </button>
        </div>
      </div>

      <!-- 創建新季度卡片 -->
      <div 
        @click="showCreateModal = true"
        class="card-web3 p-8 hover:scale-[1.02] transition-all duration-300 cursor-pointer group border-2 border-dashed border-web3-purple/30 hover:border-web3-purple/60 bg-gradient-to-br from-web3-purple/5 to-web3-cyan/5 hover:from-web3-purple/10 hover:to-web3-cyan/10"
      >
        <div class="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div class="w-16 h-16 bg-web3-purple/20 rounded-3xl flex items-center justify-center group-hover:bg-web3-purple/30 transition-all group-hover:scale-110">
            <svg class="w-8 h-8 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white mb-2">創建新季度</h3>
            <p class="text-white/70 text-sm">發布新的訂閱 NFT 季度</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 創建/編輯季度模態框 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div class="card-web3 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <!-- 模態框標題 -->
        <div class="flex justify-between items-center p-6 border-b border-white/10">
          <h3 class="text-2xl font-bold text-gradient-web3">
            {{ editingSubscription ? '編輯季度' : '創建新季度' }}
          </h3>
          <button @click="closeModal" class="text-white/60 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>

        <!-- 表單內容 -->
        <form @submit.prevent="saveSubscription" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 季度編號 -->
            <div>
              <label class="block text-white font-medium mb-2">季度編號</label>
              <input 
                v-model.number="subscriptionForm.seasonId"
                type="number" 
                min="1"
                required
                :disabled="editingSubscription"
                class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-web3-purple focus:outline-none disabled:opacity-50"
                placeholder="例如: 3"
              >
            </div>

            <!-- 價格 -->
            <div>
              <label class="block text-white font-medium mb-2">價格 (STX)</label>
              <input 
                v-model.number="subscriptionForm.price"
                type="number" 
                step="0.1"
                min="0.1"
                required
                class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-web3-purple focus:outline-none"
                placeholder="例如: 2.5"
              >
            </div>

            <!-- 發行量 -->
            <div>
              <label class="block text-white font-medium mb-2">最大發行量</label>
              <input 
                v-model.number="subscriptionForm.maxSupply"
                type="number" 
                min="1"
                required
                class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-web3-purple focus:outline-none"
                placeholder="例如: 150"
              >
            </div>

            <!-- 會員等級 -->
            <div>
              <label class="block text-white font-medium mb-2">會員等級</label>
              <select 
                v-model="subscriptionForm.tier"
                class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white focus:border-web3-purple focus:outline-none"
              >
                <option value="basic">🥉 基礎會員</option>
                <option value="premium">🥈 高級會員</option>
                <option value="vip">🥇 VIP 會員</option>
              </select>
            </div>
          </div>

          <!-- 到期日期 -->
          <div>
            <label class="block text-white font-medium mb-2">到期日期</label>
            <input 
              v-model="subscriptionForm.expiryDate"
              type="date" 
              required
              class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white focus:border-web3-purple focus:outline-none"
            >
          </div>

          <!-- 描述 -->
          <div>
            <label class="block text-white font-medium mb-2">季度描述</label>
            <textarea 
              v-model="subscriptionForm.description"
              rows="4"
              class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-web3-purple focus:outline-none resize-none"
              placeholder="描述這一季的特色內容、專屬權益和獨特價值..."
            ></textarea>
          </div>

          <!-- 進階選項 -->
          <div class="bg-glass-dark rounded-xl p-4 border border-white/10">
            <h4 class="text-white font-medium mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106.886-.54 2.042-.061 2.287.947.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
              </svg>
              進階設定
            </h4>
            <div class="flex items-center space-x-3">
              <input
                v-model="subscriptionForm.enableRevenueSplit"
                type="checkbox"
                id="revenue-split-modal"
                class="w-4 h-4 text-web3-purple rounded focus:ring-web3-purple"
              />
              <label for="revenue-split-modal" class="text-white text-sm">
                啟用自動分潤（購買時自動分配收益給團隊成員）
              </label>
            </div>
          </div>

          <!-- 按鈕組 -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-white/10">
            <button 
              type="button"
              @click="closeModal"
              class="px-6 py-3 text-white/70 bg-glass hover:bg-white/20 rounded-xl transition-all"
            >
              取消
            </button>
            <button 
              type="submit"
              :disabled="contractsStore.isLoading"
              class="btn-web3 px-8 py-3 rounded-xl flex items-center space-x-2"
            >
              <svg v-if="contractsStore.isLoading" class="animate-spin w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
              </svg>
              <span>{{ contractsStore.isLoading ? '處理中...' : (editingSubscription ? '更新季度' : '創建季度') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useContractsStore } from '@/stores/contracts'
import { useWalletStore } from '@/stores/wallet'

export default {
  name: 'SubscriptionManager',
  setup() {
    const contractsStore = useContractsStore()
    const walletStore = useWalletStore()
    
    const subscriptions = ref([])
    const showCreateModal = ref(false)
    const editingSubscription = ref(null)
    const filterStatus = ref('all')
    const sortBy = ref('seasonId')
    
    const subscriptionForm = ref({
      seasonId: '',
      price: '',
      maxSupply: '',
      expiryDate: '',
      tier: 'premium',
      description: '',
      enableRevenueSplit: true
    })
    
    const totalSold = computed(() => {
      return subscriptions.value.reduce((sum, s) => sum + s.currentSupply, 0)
    })
    
    const totalRevenue = computed(() => {
      return subscriptions.value.reduce((sum, s) => sum + (s.currentSupply * s.price), 0).toFixed(1)
    })
    
    const activeSubscriptions = computed(() => {
      return subscriptions.value.filter(s => s.active).length
    })

    const salesRate = computed(() => {
      const totalMax = subscriptions.value.reduce((sum, s) => sum + s.maxSupply, 0)
      return totalMax > 0 ? Math.round((totalSold.value / totalMax) * 100) : 0
    })

    const avgDuration = computed(() => {
      const activeSubs = subscriptions.value.filter(s => s.active)
      if (activeSubs.length === 0) return 0
      const avgExpiry = activeSubs.reduce((sum, s) => sum + new Date(s.expiryDate).getTime(), 0) / activeSubs.length
      const daysDiff = Math.ceil((avgExpiry - Date.now()) / (1000 * 60 * 60 * 24))
      return Math.max(0, daysDiff)
    })

    const filteredSubscriptions = computed(() => {
      let filtered = [...subscriptions.value]
      
      if (filterStatus.value === 'active') {
        filtered = filtered.filter(s => s.active)
      } else if (filterStatus.value === 'ended') {
        filtered = filtered.filter(s => !s.active)
      }

      filtered.sort((a, b) => {
        if (sortBy.value === 'seasonId') return a.seasonId - b.seasonId
        if (sortBy.value === 'price') return b.price - a.price
        if (sortBy.value === 'currentSupply') return b.currentSupply - a.currentSupply
        if (sortBy.value === 'expiryDate') return new Date(b.expiryDate) - new Date(a.expiryDate)
        return 0
      })

      return filtered
    })
    
    const editSubscription = (subscription) => {
      editingSubscription.value = subscription
      subscriptionForm.value = {
        seasonId: subscription.seasonId,
        price: subscription.price,
        maxSupply: subscription.maxSupply,
        expiryDate: subscription.expiryDate.toISOString().split('T')[0],
        tier: subscription.tier,
        description: subscription.description || '',
        enableRevenueSplit: subscription.enableRevenueSplit || true
      }
      showCreateModal.value = true
    }
    
    const viewDetails = (subscription) => {
      // 可以跳轉到詳細頁面或顯示更多信息
      alert(`季度 ${subscription.seasonId} 詳情\n銷售量: ${subscription.currentSupply}/${subscription.maxSupply}\n收益: ${(subscription.currentSupply * subscription.price).toFixed(1)} STX`)
    }

    const shareSubscription = (subscription) => {
      const url = `${window.location.origin}/subscription/${subscription.seasonId}`
      navigator.clipboard.writeText(url).then(() => {
        alert('分享連結已複製到剪貼簿！')
      })
    }
    
    const saveSubscription = async () => {
      try {
        const subscriptionData = {
          seasonId: subscriptionForm.value.seasonId,
          price: subscriptionForm.value.price,
          maxSupply: subscriptionForm.value.maxSupply,
          expiryDate: Math.floor(new Date(subscriptionForm.value.expiryDate).getTime() / 1000),
          tier: subscriptionForm.value.tier,
          enableRevenueSplit: subscriptionForm.value.enableRevenueSplit || true
        }
        
        if (editingSubscription.value) {
          // 編輯現有季度 - 目前區塊鏈可能不支持編輯
          alert('⚠️ 季度編輯功能暫不可用，請創建新的季度')
        } else {
          // 創建新季度 - 調用智能合約
          console.log('創建新季度:', subscriptionData)
          await contractsStore.createSeason(subscriptionData)
          
          alert('✅ 新季度創建成功！正在重新載入數據...')
          
          // 延遲重新載入區塊鏈數據
          setTimeout(async () => {
            await loadSubscriptions()
          }, 3000)
        }
        
        closeModal()
      } catch (error) {
        console.error('保存季度失敗:', error)
        alert('❌ 操作失敗: ' + error.message)
      }
    }
    
    const closeModal = () => {
      showCreateModal.value = false
      editingSubscription.value = null
      subscriptionForm.value = {
        seasonId: '',
        price: '',
        maxSupply: '',
        expiryDate: '',
        tier: 'premium',
        description: '',
        enableRevenueSplit: true
      }
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getTierName = (tier) => {
      const names = {
        'basic': '🥉 基礎會員',
        'premium': '🥈 高級會員',
        'vip': '🥇 VIP 會員'
      }
      return names[tier] || tier
    }
    
    const generateGradient = () => {
      const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
      ]
      return gradients[Math.floor(Math.random() * gradients.length)]
    }
    
    const loadSubscriptions = async () => {
      if (!walletStore.isConnected || !walletStore.userAddress) {
        console.log('錢包未連接，無法載入季度數據')
        return
      }

      try {
        console.log('從區塊鏈載入創作者季度數據...', walletStore.userAddress)
        const realSubscriptions = []
        
        // 嘗試載入季度 1-10 的數據
        for (let seasonId = 1; seasonId <= 10; seasonId++) {
          try {
            const seasonData = await contractsStore.getSeasonInfo(walletStore.userAddress, seasonId, true)
            
            if (seasonData && seasonData.price !== undefined) {
              console.log(`找到季度 ${seasonId} 數據:`, seasonData)
              
              realSubscriptions.push({
                seasonId: seasonId,
                price: seasonData.price || 0,
                maxSupply: seasonData.max_supply || seasonData.maxSupply || 0,
                currentSupply: seasonData.current_supply || seasonData.currentSupply || 0,
                expiryDate: seasonData.expiry_date || seasonData.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                tier: seasonData.tier || 'premium',
                active: seasonData.active !== false,
                gradient: getTierGradient(seasonData.tier || 'premium'),
                description: seasonData.description || `季度 ${seasonId} NFT 訂閱`,
                enableRevenueSplit: seasonData.enable_revenue_split !== false
              })
            }
          } catch (seasonError) {
            // 如果季度不存在，繼續檢查下一個
            if (seasonId <= 3) {
              console.log(`季度 ${seasonId} 不存在或載入失敗:`, seasonError.message)
            }
          }
        }
        
        subscriptions.value = realSubscriptions
        console.log(`成功載入 ${realSubscriptions.length} 個季度`)
        
      } catch (error) {
        console.error('載入季度數據失敗:', error)
        subscriptions.value = []
      }
    }
    
    // 根據tier獲取對應的漸變色
    const getTierGradient = (tier) => {
      const gradients = {
        basic: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        premium: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        vip: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        legendary: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)'
      }
      return gradients[tier] || gradients.premium
    }
    
    onMounted(() => {
      loadSubscriptions()
    })
    
    return {
      contractsStore,
      subscriptions,
      showCreateModal,
      editingSubscription,
      subscriptionForm,
      filterStatus,
      sortBy,
      totalSold,
      totalRevenue,
      activeSubscriptions,
      salesRate,
      avgDuration,
      filteredSubscriptions,
      editSubscription,
      viewDetails,
      shareSubscription,
      saveSubscription,
      closeModal,
      formatDate,
      getTierName
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
</style>