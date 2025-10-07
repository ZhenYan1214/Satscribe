<template>
  <div class="my-collections">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">我的收藏</h1>
      
      <!-- 统计卡片 -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <div class="text-center">
            <p class="text-2xl font-bold text-blue-600">{{ collections.length }}</p>
            <p class="text-gray-600">订阅章总数</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <div class="text-center">
            <p class="text-2xl font-bold text-green-600">{{ uniqueCreators }}</p>
            <p class="text-gray-600">支持的创作者</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <div class="text-center">
            <p class="text-2xl font-bold text-purple-600">{{ totalSpent }} STX</p>
            <p class="text-gray-600">总支出</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <div class="text-center">
            <p class="text-2xl font-bold text-orange-600">{{ activeSubscriptions }}</p>
            <p class="text-gray-600">活跃订阅</p>
          </div>
        </div>
      </div>

      <!-- 筛选和排序 -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center space-x-4">
            <select v-model="filterStatus" class="border rounded-lg px-3 py-2">
              <option value="all">全部状态</option>
              <option value="active">活跃中</option>
              <option value="expired">已过期</option>
            </select>
            
            <select v-model="sortBy" class="border rounded-lg px-3 py-2">
              <option value="date">按日期排序</option>
              <option value="creator">按创作者排序</option>
              <option value="price">按价格排序</option>
            </select>
          </div>
          
          <div class="flex items-center space-x-2">
            <button 
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded-lg',
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
            <button 
              @click="viewMode = 'list'"
              :class="[
                'p-2 rounded-lg',
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 收藏展示 -->
      <div v-if="!walletConnected" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-.257-.257A6 6 0 1118 8zm-2 0a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">请连接钱包</h3>
        <p class="text-gray-600 mb-4">连接钱包后即可查看您的订阅章收藏</p>
        <button @click="connectWallet" class="btn-primary">
          连接钱包
        </button>
      </div>

      <div v-else-if="filteredCollections.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无收藏</h3>
        <p class="text-gray-600 mb-4">购买您第一个订阅章，开始支持喜爱的创作者</p>
        <button @click="$router.push('/')" class="btn-primary">
          发现创作者
        </button>
      </div>

      <!-- 网格视图 -->
      <div v-else-if="viewMode === 'grid'" class="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="collection in filteredCollections" 
          :key="collection.tokenId"
          class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          @click="goToCreator(collection.creator)"
        >
          <!-- NFT 图像 -->
          <div 
            class="aspect-square bg-gradient-to-br rounded-t-lg"
            :style="{ background: collection.gradient }"
          >
            <div class="h-full flex items-center justify-center text-white text-center p-4">
              <div>
                <h3 class="text-lg font-bold mb-1">第 {{ collection.seasonId }} 期</h3>
                <p class="text-sm opacity-90">{{ collection.creatorName }}</p>
              </div>
            </div>
          </div>
          
          <!-- NFT 信息 -->
          <div class="p-4">
            <h4 class="font-semibold mb-1">{{ collection.creatorName }}</h4>
            <p class="text-sm text-gray-600 mb-2">第 {{ collection.seasonId }} 期订阅章</p>
            
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">{{ formatDate(collection.purchaseDate) }}</span>
              <span 
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  collection.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ collection.isActive ? '活跃' : '已过期' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  订阅章
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创作者
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  价格
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  购买日期
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="collection in filteredCollections" 
                :key="collection.tokenId"
                class="hover:bg-gray-50 cursor-pointer"
                @click="goToCreator(collection.creator)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div 
                      class="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-3"
                      :style="{ background: collection.gradient }"
                    >
                      {{ collection.seasonId }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        第 {{ collection.seasonId }} 期订阅章
                      </div>
                      <div class="text-sm text-gray-500">
                        Token ID: {{ collection.tokenId }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ collection.creatorName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ collection.price }} STX
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(collection.purchaseDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="[
                      'inline-flex px-2 text-xs font-semibold rounded-full',
                      collection.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ collection.isActive ? '活跃' : '已过期' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import { useContractsStore } from '@/stores/contracts'

export default {
  name: 'MyCollections',
  setup() {
    const router = useRouter()
    const walletStore = useWalletStore()
    const contractsStore = useContractsStore()
    
    const collections = ref([])
    const filterStatus = ref('all')
    const sortBy = ref('date')
    const viewMode = ref('grid')
    
    const walletConnected = computed(() => walletStore.isConnected)
    
    const uniqueCreators = computed(() => {
      const creators = new Set(collections.value.map(c => c.creator))
      return creators.size
    })
    
    const totalSpent = computed(() => {
      return collections.value.reduce((sum, c) => sum + c.price, 0)
    })
    
    const activeSubscriptions = computed(() => {
      return collections.value.filter(c => c.isActive).length
    })
    
    const filteredCollections = computed(() => {
      let filtered = [...collections.value]
      
      // 状态筛选
      if (filterStatus.value === 'active') {
        filtered = filtered.filter(c => c.isActive)
      } else if (filterStatus.value === 'expired') {
        filtered = filtered.filter(c => !c.isActive)
      }
      
      // 排序
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'creator':
            return a.creatorName.localeCompare(b.creatorName)
          case 'price':
            return b.price - a.price
          case 'date':
          default:
            return new Date(b.purchaseDate) - new Date(a.purchaseDate)
        }
      })
      
      return filtered
    })
    
    const connectWallet = async () => {
      try {
        await walletStore.connectWallet()
        loadCollections()
      } catch (error) {
        console.error('连接钱包失败:', error)
      }
    }
    
    const loadCollections = async () => {
      if (!walletConnected.value) return
      
      try {
        console.log('開始載入用戶收藏...')
        const realCollections = []
        
        // TODO: 從智能合約載入用戶擁有的 NFT
        // 目前需要實現 getUserOwnedNFTs 函數
        // 暫時保持空陣列，等待實際的區塊鏈數據載入功能
        
        collections.value = realCollections
        console.log('用戶收藏載入完成:', realCollections.length, '個收藏')
      } catch (error) {
        console.error('载入收藏失败:', error)
      }
    }
    
    const goToCreator = (creatorAddress) => {
      router.push(`/creator/${creatorAddress}`)
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('zh-CN')
    }
    
    onMounted(() => {
      if (walletConnected.value) {
        loadCollections()
      }
    })
    
    return {
      collections,
      filterStatus,
      sortBy,
      viewMode,
      walletConnected,
      uniqueCreators,
      totalSpent,
      activeSubscriptions,
      filteredCollections,
      connectWallet,
      goToCreator,
      formatDate
    }
  }
}
</script>