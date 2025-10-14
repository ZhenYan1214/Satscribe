<template>
  <div class="explore-hub min-h-screen text-white bg-gradient-to-br from-web3-dark via-web3-navy to-web3-slate">
    <!-- Professional Navigation Bar -->
    <nav class="sticky top-0 z-50 bg-web3-dark/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div class="flex items-center justify-between">
          <!-- Search & Filter Section -->
          <div class="flex-1 max-w-2xl">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-web3-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="搜尋文章、創作者或主題..."
                class="block w-full pl-12 pr-12 py-3.5 bg-web3-slate/30 border border-web3-gray-600/50 rounded-2xl text-white placeholder-web3-gray-400 focus:outline-none focus:ring-2 focus:ring-web3-primary/50 focus:border-web3-primary/60 focus:bg-web3-slate/50 hover:bg-web3-slate/40 transition-all duration-300 text-sm shadow-lg"
                @keyup.enter="performSearch"
              >
              <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button @click="clearSearch" class="text-web3-gray-400 hover:text-white transition-colors duration-200">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- View Controls -->
          <div class="flex items-center space-x-4 ml-6 flex-shrink-0">
            <!-- Filter Button -->
            <button 
              @click="showFilters = !showFilters"
              :class="[
                'flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg',
                showFilters 
                  ? 'bg-web3-primary text-white shadow-web3-primary/25' 
                  : 'bg-web3-slate/40 text-web3-gray-300 hover:bg-web3-slate/60 hover:text-white border border-web3-gray-600/30'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"/>
              </svg>
              <span>篩選</span>
            </button>

            <!-- Sort Dropdown -->
            <div class="relative">
              <select 
                v-model="sortBy"
                class="appearance-none bg-web3-slate/40 border border-web3-gray-600/30 rounded-xl px-5 py-3 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-web3-primary/50 focus:border-web3-primary/60 hover:bg-web3-slate/60 transition-all duration-300 shadow-lg cursor-pointer"
              >
                <option value="trending">熱門趨勢</option>
                <option value="latest">最新發布</option>
                <option value="popular">最多互動</option>
                <option value="revenue">收益最高</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg class="w-4 h-4 text-web3-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>

            <!-- View Toggle -->
            <div class="bg-web3-slate/40 border border-web3-gray-600/30 rounded-xl p-1.5 flex shadow-lg">
              <button 
                @click="viewMode = 'grid'"
                :class="[
                  'p-2.5 rounded-lg text-sm transition-all duration-300 flex items-center justify-center',
                  viewMode === 'grid' ? 'bg-web3-primary text-white shadow-md' : 'text-web3-gray-400 hover:text-white hover:bg-web3-slate/50'
                ]"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </button>
              <button 
                @click="viewMode = 'list'"
                :class="[
                  'p-2.5 rounded-lg text-sm transition-all duration-300 flex items-center justify-center',
                  viewMode === 'list' ? 'bg-web3-primary text-white shadow-md' : 'text-web3-gray-400 hover:text-white hover:bg-web3-slate/50'
                ]"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Advanced Filters -->
        <transition 
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-show="showFilters" class="mt-6 p-6 bg-web3-slate/30 border border-web3-gray-600/40 rounded-2xl shadow-xl backdrop-blur-sm">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Category Filter -->
              <div>
                <label class="block text-sm font-semibold text-white mb-3">分類</label>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="category in categories" 
                    :key="category.id"
                    @click="toggleCategory(category.id)"
                    :class="[
                      'px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 shadow-sm',
                      selectedCategories.includes(category.id) 
                        ? 'bg-web3-primary text-white shadow-web3-primary/25 scale-105' 
                        : 'bg-web3-gray-700/50 text-web3-gray-300 hover:bg-web3-gray-600/70 hover:text-white border border-web3-gray-600/30'
                    ]"
                  >
                    {{ category.label }}
                  </button>
                </div>
              </div>

              <!-- Time Range -->
              <div>
                <label class="block text-sm font-medium text-web3-gray-300 mb-2">時間範圍</label>
                <select 
                  v-model="timeRange"
                  class="w-full bg-web3-gray-700 border border-web3-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-web3-primary/50"
                >
                  <option value="all">全部時間</option>
                  <option value="today">今天</option>
                  <option value="week">本週</option>
                  <option value="month">本月</option>
                  <option value="year">今年</option>
                </select>
              </div>

              <!-- Reading Time -->
              <div>
                <label class="block text-sm font-medium text-web3-gray-300 mb-2">閱讀時長</label>
                <select 
                  v-model="readingTime"
                  class="w-full bg-web3-gray-700 border border-web3-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-web3-primary/50"
                >
                  <option value="all">任何長度</option>
                  <option value="short">短篇 (< 5分鐘)</option>
                  <option value="medium">中篇 (5-15分鐘)</option>
                  <option value="long">長篇 (> 15分鐘)</option>
                </select>
              </div>
            </div>

            <!-- Clear Filters -->
            <div class="mt-4 flex justify-end">
              <button 
                @click="clearFilters"
                class="text-sm text-web3-gray-400 hover:text-white transition-colors duration-200"
              >
                清除所有篩選
              </button>
            </div>
          </div>
        </transition>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Content Statistics -->
      <div class="mb-10">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="space-y-2">
            <h1 class="text-4xl font-bold bg-gradient-to-r from-white to-web3-gray-300 bg-clip-text text-transparent">探索內容</h1>
            <p class="text-web3-gray-400 text-lg">
              找到 <span class="text-web3-primary font-semibold">{{ filteredArticles.length }}</span> 篇文章
              <span v-if="searchQuery"> · 關於「<span class="text-white font-medium">{{ searchQuery }}</span>」</span>
            </p>
          </div>
          
          <!-- Quick Stats -->
          <div class="hidden sm:flex items-center space-x-8">
            <div class="text-center group">
              <div class="text-2xl font-bold text-web3-primary group-hover:scale-105 transition-transform duration-300">{{ stats.totalArticles }}</div>
              <div class="text-web3-gray-400 text-sm font-medium">總文章</div>
            </div>
            <div class="w-px h-10 bg-web3-gray-600/50"></div>
            <div class="text-center group">
              <div class="text-2xl font-bold text-web3-accent group-hover:scale-105 transition-transform duration-300">{{ stats.totalCreators }}</div>
              <div class="text-web3-gray-400 text-sm font-medium">創作者</div>
            </div>
            <div class="w-px h-10 bg-web3-gray-600/50"></div>
            <div class="text-center group">
              <div class="text-2xl font-bold text-web3-amber group-hover:scale-105 transition-transform duration-300">{{ stats.totalViews }}</div>
              <div class="text-web3-gray-400 text-sm font-medium">總閱讀</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Article Section -->
      <section v-if="featuredArticle && !searchQuery" class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">編輯精選</h2>
          <span class="px-3 py-1 bg-web3-amber/20 text-web3-amber text-sm font-medium rounded-full">
            精選推薦
          </span>
        </div>
        
        <featured-article-card 
          :article="featuredArticle"
          @click="openArticle(featuredArticle)"
          class="mb-8"
        />
      </section>

      <!-- Trending Topics -->
      <section v-if="!searchQuery" class="mb-12">
        <div class="bg-web3-slate/20 border border-web3-gray-600/30 rounded-2xl p-6 backdrop-blur-sm">
          <h3 class="text-2xl font-bold text-white mb-6 flex items-center">
            <svg class="w-6 h-6 mr-3 text-web3-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/>
            </svg>
            熱門話題
          </h3>
          <div class="flex flex-wrap gap-3">
            <button 
              v-for="topic in trendingTopics" 
              :key="topic"
              @click="searchTopic(topic)"
              class="px-5 py-3 bg-web3-slate/40 hover:bg-web3-primary/20 border border-web3-gray-600/40 hover:border-web3-primary/50 text-web3-gray-300 hover:text-web3-primary rounded-xl text-sm font-medium transition-all duration-300 group shadow-lg hover:shadow-web3-primary/10 hover:scale-105"
            >
              <span class="mr-2 text-web3-primary">#</span>{{ topic }}
              <span class="ml-2 text-xs opacity-60 group-hover:opacity-80 bg-web3-primary/10 px-2 py-1 rounded-full">{{ Math.floor(Math.random() * 50) + 10 }}k</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Articles Grid/List -->
      <section>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h3 class="text-2xl font-bold text-white mb-2">
              {{ searchQuery ? '搜尋結果' : '最新內容' }}
            </h3>
            <p class="text-web3-gray-400 text-sm">
              {{ viewMode === 'grid' ? '網格' : '列表' }}檢視 · {{ sortBy === 'trending' ? '熱門排序' : sortBy === 'latest' ? '最新排序' : sortBy === 'popular' ? '熱門排序' : '收益排序' }}
            </p>
          </div>
          
          <!-- Loading indicator -->
          <div v-if="isLoading" class="flex items-center space-x-3 text-web3-gray-400">
            <div class="w-5 h-5 border-2 border-web3-gray-600 border-t-web3-primary rounded-full animate-spin"></div>
            <span class="text-sm font-medium">載入中...</span>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="!isLoading && filteredArticles.length === 0" class="text-center py-20">
          <div class="w-32 h-32 mx-auto mb-8 bg-web3-slate/30 border border-web3-gray-600/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
            <svg class="w-16 h-16 text-web3-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <h4 class="text-2xl font-bold text-white mb-3">找不到相關內容</h4>
          <p class="text-web3-gray-400 text-lg mb-8 max-w-md mx-auto">試著調整您的搜尋條件或篩選器，或探索其他熱門內容</p>
          <button 
            @click="clearSearch"
            class="btn-web3 px-8 py-3 text-sm font-medium"
          >
            清除搜尋
          </button>
        </div>

        <!-- Articles -->
        <div v-else :class="[
          'transition-all duration-300',
          viewMode === 'grid' 
            ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' 
            : 'space-y-4'
        ]">
          <enhanced-article-card 
            v-for="(article, index) in paginatedArticles" 
            :key="article.id"
            :article="article"
            :view-mode="viewMode"
            :style="`animation-delay: ${index * 0.05}s`"
            class="animate-fade-in"
            @click="openArticle(article)"
            @nftPurchase="handleNFTPurchase"
          />
        </div>

        <!-- Load More -->
        <div v-if="hasMoreArticles" class="flex justify-center mt-16">
          <button 
            @click="loadMoreArticles"
            :disabled="isLoadingMore"
            :class="[
              'flex items-center space-x-3 px-10 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg group relative overflow-hidden',
              isLoadingMore 
                ? 'bg-web3-slate/40 text-web3-gray-400 cursor-not-allowed' 
                : 'bg-web3-slate/40 hover:bg-web3-primary/20 border border-web3-gray-600/40 hover:border-web3-primary/50 text-white hover:text-web3-primary hover:shadow-web3-primary/20'
            ]"
          >
            <span v-if="!isLoadingMore" class="relative z-10">載入更多內容</span>
            <span v-else class="relative z-10">載入中...</span>
            <svg v-if="!isLoadingMore" class="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
            <div v-else class="w-5 h-5 border-2 border-web3-gray-600 border-t-web3-primary rounded-full animate-spin relative z-10"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-web3-primary/10 to-web3-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </section>

      <!-- Trending Creators Sidebar -->
      <aside class="mt-20">
        <div class="bg-web3-slate/20 border border-web3-gray-600/30 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
          <div class="flex items-center mb-8">
            <svg class="w-7 h-7 mr-4 text-web3-accent" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 class="text-2xl font-bold text-white">本週熱門創作者</h3>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <creator-spotlight-card 
              v-for="(creator, index) in trendingCreators.slice(0, 4)" 
              :key="creator.id"
              :creator="creator"
              :compact="true"
              :style="`animation-delay: ${index * 0.1}s`"
              class="animate-slide-up"
              @click="goToCreator(creator)"
            />
          </div>
          <div class="text-center mt-6">
            <router-link 
              to="/creators" 
              class="text-web3-primary hover:text-web3-secondary font-medium text-sm transition-colors duration-200"
            >
              查看所有創作者 →
            </router-link>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useContractsStore } from '@/stores/contracts'
import { useWalletStore } from '@/stores/wallet'
// Note: These components may need to be updated or replaced to handle real blockchain data
import EnhancedArticleCard from '@/components/EnhancedArticleCard.vue'
import FeaturedArticleCard from '@/components/FeaturedArticleCard.vue'
import CreatorSpotlightCard from '@/components/CreatorSpotlightCard.vue'

export default {
  name: 'ExploreHub',
  components: {
    EnhancedArticleCard,
    FeaturedArticleCard,
    CreatorSpotlightCard
  },
  setup() {
    const router = useRouter()
    const contractsStore = useContractsStore()
    const walletStore = useWalletStore()
    
    // State
    const searchQuery = ref('')
    const showFilters = ref(false)
    const selectedCategories = ref([])
    const timeRange = ref('all')
    const readingTime = ref('all')
    const viewMode = ref('grid')
    const sortBy = ref('trending')
    const currentPage = ref(1)
    const isLoading = ref(false)
    const isLoadingMore = ref(false)
    
    // Data
    const categories = ref([
      { id: 'all', label: '全部' },
      { id: 'blockchain', label: '區塊鏈' },
      { id: 'art', label: '數位藝術' },
      { id: 'music', label: '音樂' },
      { id: 'tech', label: '技術' },
      { id: 'photography', label: '攝影' },
      { id: 'writing', label: '寫作' },
      { id: 'video', label: '影片' },
      { id: 'design', label: '設計' }
    ])

    const trendingTopics = ref([
      'Web3', 'NFT藝術', 'DeFi', '元宇宙', '智慧合約', 
      '數位創作', '區塊鏈開發', '去中心化', '創作者經濟', 'DAO治理'
    ])
    
    const stats = ref({
      totalArticles: '2,847',
      totalCreators: '342',
      totalViews: '1.2M'
    })

    const featuredArticle = ref({
      id: 'featured-1',
      title: 'Web3 創作者經濟的革命性變化：從傳統平台走向去中心化未來',
      excerpt: '深入探討 Web3 技術如何徹底改變創作者經濟生態，分析區塊鏈、NFT 和 DeFi 如何為創作者帶來前所未有的價值創造機會。',
      category: '區塊鏈趨勢',
      author: {
        id: 'author-1',
        name: 'Alice Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
        subscribers: 12400,
        verified: true
      },
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
      publishedAt: new Date('2024-01-15'),
      readTime: 12,
      likes: 1247,
      comments: 89,
      views: 8420,
      earnings: 156.7,
      tags: ['Web3', '創作者經濟', '區塊鏈', 'NFT', 'DeFi']
    })
    
    // Enhanced mock articles with more realistic data  
    const allArticles = ref([])
    
    // 加載固定的第四季度 NFT 文章
    const loadRealNFTArticle = async () => {
      console.log('🔍 加載固定的第四季度 NFT 文章...')
      
      // 使用固定的創作者地址和季度數據
      const realCreatorAddress = 'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ'
      const realSeasonId = 20254
      const nftPrice = 10 // 固定顯示10 STX
      const nftSupply = { current: 0, max: 9999 }
      
      console.log('✅ 使用固定數據:', {
        creatorAddress: realCreatorAddress,
        seasonId: realSeasonId,
        price: nftPrice,
        supply: nftSupply
      })
      
      // 創建第四季度NFT文章
      const q4NFTArticle = {
        id: 'q4-2025-nft',
        title: '🎨 2025第四季 VIP 會員限量招募',
        excerpt: '加入我的第四季 VIP 會員，獲得獨家創作內容、幕後花絮和早期作品預覽權限。限量發售，季度會員權益！',
        category: '創作者經濟',
        author: {
          id: realCreatorAddress,
          name: 'zhenyan',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
          subscribers: 1250,
          verified: true
        },
        image: '/src/assets/test/demo-article.svg',
        publishedAt: new Date(Date.now() - 15 * 1000), // 15秒前
        readTime: 3,
        likes: 47,
        comments: 12,
        views: 328,
        earnings: 0, // 剛發布，還沒收益
        tags: ['NFT', '第四季', 'VIP會員', '創作者經濟'],
        // NFT 相關信息
        hasNFT: true,
        nftSeasonId: realSeasonId,
        nftPrice: nftPrice,
        nftSupply: nftSupply,
        isLatestNFT: true
      }
      
      // 將NFT文章添加到列表開頭
      allArticles.value.unshift(q4NFTArticle)
      console.log('✅ 第四季度NFT文章已添加到探索列表')
    }
    
    // 初始化其他演示文章
    const initOtherArticles = () => {
      const otherArticles = [
        {
        id: 'article-1',
        title: 'NFT 藝術市場深度分析：2024年趨勢與投資機會',
        excerpt: '全面解析當前 NFT 藝術市場的發展狀況，探討藝術家如何在數位時代創造可持續的收益模式。',
        category: '數位藝術',
        author: {
          id: 'author-2',
          name: 'David Kim',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          subscribers: 8900,
          verified: true
        },
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
        publishedAt: new Date('2024-01-14'),
        readTime: 8,
        likes: 892,
        comments: 156,
        views: 12340,
        earnings: 89.3,
        tags: ['NFT', '藝術', '市場分析', '投資']
      },
      {
        id: 'article-2',
        title: '音樂 NFT 的創新應用：重塑音樂產業價值鏈',
        excerpt: '探索音樂創作者如何透過 NFT 技術建立直接的粉絲經濟，創造新的收益來源和互動方式。',
        category: '音樂',
        author: {
          id: 'author-3',
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          subscribers: 15600,
          verified: true
        },
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
        publishedAt: new Date('2024-01-13'),
        readTime: 6,
        likes: 1156,
        comments: 203,
        views: 18920,
        earnings: 134.8,
        tags: ['音樂', 'NFT', '粉絲經濟', '創新']
      },
      {
        id: 'article-3',
        title: 'Solidity 智慧合約安全最佳實踐指南',
        excerpt: '詳細介紹智慧合約開發中的安全考量，包含常見漏洞、防範措施和程式碼審計方法。',
        category: '技術',
        author: {
          id: 'author-4',
          name: 'Michael Zhang',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          subscribers: 22100,
          verified: true
        },
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
        publishedAt: new Date('2024-01-12'),
        readTime: 15,
        likes: 2340,
        comments: 378,
        views: 28450,
        earnings: 245.6,
        tags: ['Solidity', '智慧合約', '安全', '開發']
      },
      {
        id: 'article-4',
        title: 'Web3 攝影：區塊鏈時代的視覺創作新典範',
        excerpt: '攝影師如何在去中心化的世界中保護作品版權，建立可追溯的創作歷程和收益模式。',
        category: '攝影',
        author: {
          id: 'author-5',
          name: 'Emma Wilson',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          subscribers: 11800,
          verified: true
        },
        image: 'https://images.unsplash.com/photo-1606140608399-45b1eb8bb78e?w=800&q=80',
        publishedAt: new Date('2024-01-11'),
        readTime: 7,
        likes: 756,
        comments: 92,
        views: 9680,
        earnings: 67.4,
        tags: ['攝影', 'Web3', '版權', '創作']
      }
      ]
      
      // 將其他文章添加到列表
      allArticles.value.push(...otherArticles)
      console.log('✅ 其他演示文章已添加')
    }
    
    const trendingCreators = ref([
      {
        id: 'creator-1',
        name: 'Alice Chen',
        category: '區塊鏈趨勢',
        subscribers: 12400,
        articles: 23,
        totalEarnings: 156.7,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
        verified: true,
        recentActivity: '2小時前',
        trend: '+12%'
      },
      {
        id: 'creator-2',
        name: 'David Kim',
        category: '數位藝術',
        subscribers: 8900,
        articles: 31,
        totalEarnings: 234.8,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: true,
        recentActivity: '4小時前',
        trend: '+8%'
      }
    ])
    
    // Computed
    const filteredArticles = computed(() => {
      let filtered = allArticles.value
      
      // Apply category filter
      if (selectedCategories.value.length > 0 && !selectedCategories.value.includes('all')) {
        filtered = filtered.filter(article => 
          selectedCategories.value.some(cat => {
            const categoryMap = {
              'blockchain': '區塊鏈趨勢',
              'art': '數位藝術',
              'music': '音樂',
              'tech': '技術',
              'photography': '攝影',
              'writing': '寫作'
            }
            return article.category === categoryMap[cat] || article.category === cat
          })
        )
      }
      
      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(article => 
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.author.name.toLowerCase().includes(query) ||
          article.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      // Apply time range filter
      if (timeRange.value !== 'all') {
        const now = new Date()
        filtered = filtered.filter(article => {
          const publishDate = new Date(article.publishedAt)
          const diffTime = now - publishDate
          const diffDays = diffTime / (1000 * 60 * 60 * 24)
          
          switch (timeRange.value) {
            case 'today': return diffDays <= 1
            case 'week': return diffDays <= 7
            case 'month': return diffDays <= 30
            case 'year': return diffDays <= 365
            default: return true
          }
        })
      }
      
      // Apply reading time filter
      if (readingTime.value !== 'all') {
        filtered = filtered.filter(article => {
          switch (readingTime.value) {
            case 'short': return article.readTime < 5
            case 'medium': return article.readTime >= 5 && article.readTime <= 15
            case 'long': return article.readTime > 15
            default: return true
          }
        })
      }
      
      // Apply sorting
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy.value) {
          case 'latest':
            return new Date(b.publishedAt) - new Date(a.publishedAt)
          case 'popular':
            return (b.likes + b.comments + b.views) - (a.likes + a.comments + a.views)
          case 'revenue':
            return b.earnings - a.earnings
          case 'trending':
          default:
            // Complex trending algorithm
            const scoreA = (a.likes + a.comments) * 0.3 + a.views * 0.2 + a.earnings * 10 - (Date.now() - new Date(a.publishedAt)) / (1000 * 60 * 60 * 24) * 0.1
            const scoreB = (b.likes + b.comments) * 0.3 + b.views * 0.2 + b.earnings * 10 - (Date.now() - new Date(b.publishedAt)) / (1000 * 60 * 60 * 24) * 0.1
            return scoreB - scoreA
        }
      })
      
      return filtered
    })
    
    const paginatedArticles = computed(() => {
      const articlesPerPage = viewMode.value === 'grid' ? 9 : 8
      const start = 0
      const end = currentPage.value * articlesPerPage
      return filteredArticles.value.slice(start, end)
    })
    
    const hasMoreArticles = computed(() => {
      const articlesPerPage = viewMode.value === 'grid' ? 9 : 8
      return paginatedArticles.value.length < filteredArticles.value.length
    })
    
    // Methods
    const performSearch = () => {
      currentPage.value = 1
      console.log('搜尋:', searchQuery.value)
    }
    
    const searchTopic = (topic) => {
      searchQuery.value = topic
      performSearch()
    }
    
    const toggleCategory = (categoryId) => {
      if (categoryId === 'all') {
        selectedCategories.value = []
      } else {
        const index = selectedCategories.value.indexOf(categoryId)
        if (index > -1) {
          selectedCategories.value.splice(index, 1)
        } else {
          selectedCategories.value.push(categoryId)
        }
      }
      currentPage.value = 1
    }
    
    const clearFilters = () => {
      selectedCategories.value = []
      timeRange.value = 'all'
      readingTime.value = 'all'
      searchQuery.value = ''
      currentPage.value = 1
    }
    
    const clearSearch = () => {
      searchQuery.value = ''
      performSearch()
    }
    
    const loadMoreArticles = async () => {
      isLoadingMore.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        currentPage.value += 1
      } catch (error) {
        console.error('載入更多文章失敗:', error)
      } finally {
        isLoadingMore.value = false
      }
    }
    
    const openArticle = (article) => {
      router.push(`/article/${article.id}`)
    }
    
    const goToCreator = (creator) => {
      router.push(`/creator/${creator.id}`)
    }
    
    // NFT 購買處理
    const handleNFTPurchase = async (nftData) => {
      console.log('🛒 處理 NFT 購買:', nftData)
      
      try {
        // 檢查錢包連接狀態
        if (!walletStore.isConnected) {
          alert('請先連接錢包以購買 NFT')
          return
        }
        
        // 使用文章中設定的創作者地址
        const creatorAddress = nftData.creatorAddress
        console.log('📍 使用創作者地址:', creatorAddress)
        
        // 檢查是否為創作者本人  
        if (walletStore.userAddress === creatorAddress) {
          alert('不能購買自己創建的 NFT')
          return
        }
        
        const confirmed = confirm(`確定要購買 ${nftData.article.title} 的 VIP NFT 嗎？\n\n價格: ${nftData.price} STX\n創作者: ${nftData.article.author.name}`)
        
        if (!confirmed) {
          return
        }
        
        console.log('📞 調用合約購買 NFT...')
        console.log('參數:', {
          creatorAddress: creatorAddress,
          seasonId: nftData.nftSeasonId,
          price: nftData.price
        })
        
        // 調用合約購買NFT
        const result = await contractsStore.purchaseNFT(
          creatorAddress, // 使用修正後的創作者地址
          nftData.nftSeasonId,    // 季度ID
          `nft-${nftData.nftSeasonId}-${Date.now()}` // metadata URI
        )
        
        console.log('✅ NFT 購買成功:', result)
        
        alert(`🎉 NFT 購買成功！\n\n交易 ID: ${result.txId}\n\n您已成為 ${nftData.article.author.name} 的 VIP 會員！`)
        
        // 更新文章數據（增加供應量）
        const article = allArticles.value.find(a => a.id === nftData.article.id)
        if (article) {
          article.nftSupply.current += 1
          article.earnings += nftData.price
        }
        
      } catch (error) {
        console.error('❌ NFT 購買失敗:', error)
        
        let errorMessage = '購買失敗，請重試'
        if (error.message.includes('not-authorized')) {
          errorMessage = '沒有權限購買此 NFT，請檢查是否已連接正確錢包'
        } else if (error.message.includes('insufficient-funds')) {
          errorMessage = 'STX 餘額不足，無法完成購買'
        } else if (error.message.includes('season-not-active')) {
          errorMessage = '此季度 NFT 已結束銷售'
        } else if (error.message.includes('max-supply-reached')) {
          errorMessage = 'NFT 已售完，無法購買'
        }
        
        alert(`❌ ${errorMessage}\n\n錯誤詳情: ${error.message}`)
      }
    }
    
    // Watchers
    watch([selectedCategories, sortBy, timeRange, readingTime], () => {
      currentPage.value = 1
    })
    
    // Lifecycle
    onMounted(async () => {
      console.log('探索頁面已載入')
      
      // 初始化文章數據
      try {
        // 先加載其他演示文章
        initOtherArticles()
        
        // 然後加載真實NFT文章（異步）
        await loadRealNFTArticle()
      } catch (error) {
        console.error('初始化文章數據失敗:', error)
        // 如果失敗，至少保證有其他文章
        initOtherArticles()
      }
    })
    
    return {
      // State
      searchQuery,
      showFilters,
      selectedCategories,
      timeRange,
      readingTime,
      viewMode,
      sortBy,
      isLoading,
      isLoadingMore,
      
      // Data
      categories,
      trendingTopics,
      stats,
      featuredArticle,
      allArticles,
      filteredArticles,
      paginatedArticles,
      hasMoreArticles,
      trendingCreators,
      
      // Methods
      performSearch,
      searchTopic,
      toggleCategory,
      clearFilters,
      clearSearch,
      loadMoreArticles,
      openArticle,
      goToCreator,
      handleNFTPurchase
    }
  }
}
</script>

<style scoped>
/* Enhanced animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-fill-mode: both;
  opacity: 0;
}

.animate-slide-up {
  animation: slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-fill-mode: both;
  opacity: 0;
}

/* Custom scrollbar for the entire page */
:deep(*::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(*::-webkit-scrollbar-track) {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

:deep(*::-webkit-scrollbar-thumb) {
  background: linear-gradient(135deg, #5B4FE8, #3B82F6);
  border-radius: 4px;
  border: 2px solid rgba(255, 255, 255, 0.05);
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background: linear-gradient(135deg, #4C3FD4, #2563EB);
}

/* Improved focus states */
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #5B4FE8;
  outline-offset: 2px;
}

/* Enhanced transitions */
.transition-all {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Backdrop blur enhancement */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* Performance optimizations */
.explore-hub {
  will-change: scroll-position;
}

.explore-hub * {
  will-change: transform, opacity;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .explore-hub {
    padding-bottom: 2rem;
  }
  
  nav .max-w-7xl {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  main.max-w-7xl {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .grid.md\\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .flex.space-x-6 {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

/* Dark mode enhancements */
@media (prefers-color-scheme: dark) {
  .explore-hub {
    color-scheme: dark;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-slide-up,
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .text-web3-gray-400 {
    color: rgb(156, 163, 175);
  }
  
  .border-web3-gray-700 {
    border-color: rgb(75, 85, 99);
  }
}
</style>