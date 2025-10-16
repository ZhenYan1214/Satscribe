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
                placeholder="Search articles, creators or topics..."
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
              <span>Filters</span>
            </button>

            <!-- Sort Dropdown -->
            <div class="relative">
              <select 
                v-model="sortBy"
                class="appearance-none bg-web3-slate/40 border border-web3-gray-600/30 rounded-xl px-5 py-3 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-web3-primary/50 focus:border-web3-primary/60 hover:bg-web3-slate/60 transition-all duration-300 shadow-lg cursor-pointer"
              >
                <option value="trending">Trending</option>
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="revenue">Highest Revenue</option>
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
                <label class="block text-sm font-semibold text-white mb-3">Category</label>
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
                <label class="block text-sm font-medium text-web3-gray-300 mb-2">Time Range</label>
                <select 
                  v-model="timeRange"
                  class="w-full bg-web3-gray-700 border border-web3-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-web3-primary/50"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              <!-- Reading Time -->
              <div>
                <label class="block text-sm font-medium text-web3-gray-300 mb-2">Reading Time</label>
                <select 
                  v-model="readingTime"
                  class="w-full bg-web3-gray-700 border border-web3-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-web3-primary/50"
                >
                  <option value="all">Any Length</option>
                  <option value="short">Short (< 5 min)</option>
                  <option value="medium">Medium (5-15 min)</option>
                  <option value="long">Long (> 15 min)</option>
                </select>
              </div>
            </div>

            <!-- Clear Filters -->
            <div class="mt-4 flex justify-end">
              <button 
                @click="clearFilters"
                class="text-sm text-web3-gray-400 hover:text-white transition-colors duration-200"
              >
                Clear All Filters
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
            <h1 class="text-4xl font-bold bg-gradient-to-r from-white to-web3-gray-300 bg-clip-text text-transparent">Explore Content</h1>
            <p class="text-web3-gray-400 text-lg">
              Found <span class="text-web3-primary font-semibold">{{ filteredArticles.length }}</span> articles
              <span v-if="searchQuery"> · About "<span class="text-white font-medium">{{ searchQuery }}</span>"</span>
            </p>
          </div>
          
          <!-- Quick Stats -->
          <div class="hidden sm:flex items-center space-x-8">
            <div class="text-center group">
              <div class="text-2xl font-bold text-web3-primary group-hover:scale-105 transition-transform duration-300">{{ stats.totalArticles }}</div>
              <div class="text-web3-gray-400 text-sm font-medium">Total Articles</div>
            </div>
            <div class="w-px h-10 bg-web3-gray-600/50"></div>
            <div class="text-center group">
              <div class="text-2xl font-bold text-web3-accent group-hover:scale-105 transition-transform duration-300">{{ stats.totalCreators }}</div>
              <div class="text-web3-gray-400 text-sm font-medium">Creators</div>
            </div>
            <div class="w-px h-10 bg-web3-gray-600/50"></div>
            <div class="text-center group">
              <div class="text-2xl font-bold text-web3-amber group-hover:scale-105 transition-transform duration-300">{{ stats.totalViews }}</div>
              <div class="text-web3-gray-400 text-sm font-medium">Total Views</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Article Section -->
      <section v-if="featuredArticle && !searchQuery" class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">Editor's Choice</h2>
          <span class="px-3 py-1 bg-web3-amber/20 text-web3-amber text-sm font-medium rounded-full">
            Featured
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
            Trending Topics
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
              {{ searchQuery ? 'Search Results' : 'Latest Content' }}
            </h3>
            <p class="text-web3-gray-400 text-sm">
              {{ viewMode === 'grid' ? 'Grid' : 'List' }} view · {{ sortBy === 'trending' ? 'Trending' : sortBy === 'latest' ? 'Latest' : sortBy === 'popular' ? 'Popular' : 'Revenue' }} sort
            </p>
          </div>
          
          <!-- Loading indicator -->
          <div v-if="isLoading" class="flex items-center space-x-3 text-web3-gray-400">
            <div class="w-5 h-5 border-2 border-web3-gray-600 border-t-web3-primary rounded-full animate-spin"></div>
            <span class="text-sm font-medium">Loading...</span>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="!isLoading && filteredArticles.length === 0" class="text-center py-20">
          <div class="w-32 h-32 mx-auto mb-8 bg-web3-slate/30 border border-web3-gray-600/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
            <svg class="w-16 h-16 text-web3-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <h4 class="text-2xl font-bold text-white mb-3">No Content Found</h4>
          <p class="text-web3-gray-400 text-lg mb-8 max-w-md mx-auto">Try adjusting your search criteria or filters, or explore other trending content</p>
          <button 
            @click="clearSearch"
            class="btn-web3 px-8 py-3 text-sm font-medium"
          >
            Clear Search
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
            <span v-if="!isLoadingMore" class="relative z-10">Load More Content</span>
            <span v-else class="relative z-10">Loading...</span>
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
            <h3 class="text-2xl font-bold text-white">Trending Creators This Week</h3>
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
              View All Creators →
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
    const sortBy = ref('latest')
    const currentPage = ref(1)
    const isLoading = ref(false)
    const isLoadingMore = ref(false)
    
    // Data
    const categories = ref([
      { id: 'all', label: 'All' },
      { id: 'blockchain', label: 'Blockchain' },
      { id: 'art', label: 'Digital Art' },
      { id: 'music', label: 'Music' },
      { id: 'tech', label: 'Technology' },
      { id: 'photography', label: 'Photography' },
      { id: 'writing', label: 'Writing' },
      { id: 'video', label: 'Video' },
      { id: 'design', label: 'Design' }
    ])

    const trendingTopics = ref([
      'Web3', 'NFT Art', 'DeFi', 'Metaverse', 'Smart Contracts', 
      'Digital Creation', 'Blockchain Development', 'Decentralization', 'Creator Economy', 'DAO Governance'
    ])
    
    const stats = ref({
      totalArticles: '2,847',
      totalCreators: '342',
      totalViews: '1.2M'
    })

    const featuredArticle = ref({
      id: 'featured-1',
      title: 'Revolutionary Changes in Web3 Creator Economy: From Traditional Platforms to Decentralized Future',
      excerpt: 'In-depth exploration of how Web3 technology completely transforms the creator economy ecosystem, analyzing how blockchain, NFTs, and DeFi bring unprecedented value creation opportunities for creators.',
      category: 'Blockchain Trends',
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
      tags: ['Web3', 'Creator Economy', 'Blockchain', 'NFT', 'DeFi']
    })
    
    // Enhanced mock articles with more realistic data  
    const allArticles = ref([])
    
    // 加載預設的 zhenyan 創作者 NFT 文章
    const loadRealNFTArticle = async () => {
      console.log('🎨 Loading default zhenyan creator NFT...')
      
      // 使用固定的預設數據，但保持可以購買的功能
      const realCreatorAddress = 'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ' // 真實的創作者地址
      const creatorName = 'zhenyan'
      const seasonId = 20254 // 第2025年第4季
      const nftPrice = 10 // 固定10STX價格
      const nftSupply = { current: 0, max: 9999 } // 預設供應量
      
      console.log('📝 Using default data:', {
        creatorAddress: realCreatorAddress,
        creatorName,
        seasonId,
        price: nftPrice,
        supply: nftSupply
      })
      
      // 創建 zhenyan 的 NFT 文章
      const nftArticle = {
        id: `nft-${realCreatorAddress}-${seasonId}`,
        title: `🎨 ${creatorName} - 2025 Q4 VIP Membership Badge`,
        excerpt: `Join ${creatorName}'s VIP membership to access exclusive content, behind-the-scenes footage, and early preview rights. Limited edition, quarterly membership benefits!`,
        category: 'Creator Economy',
        author: {
          id: realCreatorAddress,
          name: creatorName,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
          subscribers: 1250,
          verified: true
        },
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
        publishedAt: new Date(Date.now() - 15 * 1000), // 15秒前
        readTime: 3,
        likes: 47,
        comments: 12,
        views: 328,
        earnings: 0, // 剛發布，還沒收益
        tags: ['NFT', 'Q4', 'VIP Membership', 'Creator Economy'],
        // NFT 相關信息
        hasNFT: true,
        nftSeasonId: seasonId,
        nftPrice: nftPrice,
        nftSupply: nftSupply,
        isLatestNFT: true,
        creatorAddress: realCreatorAddress, // 用於購買時的真實地址
        chainData: null // 不依賴鏈上數據
      }
      
      // 將 NFT 文章添加到列表開頭
      allArticles.value.unshift(nftArticle)
      console.log('✅ zhenyan NFT article added to explore list')
    }
    
    // 初始化其他演示文章
    const initOtherArticles = () => {
      const otherArticles = [
        {
        id: 'article-1',
        title: 'Deep Analysis of NFT Art Market: 2024 Trends & Investment Opportunities',
        excerpt: 'Comprehensive analysis of current NFT art market developments, exploring how artists can create sustainable revenue models in the digital age.',
        category: 'Digital Art',
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
        tags: ['NFT', 'Art', 'Market Analysis', 'Investment']
      },
      {
        id: 'article-2',
        title: 'Innovative Applications of Music NFTs: Reshaping the Music Industry Value Chain',
        excerpt: 'Exploring how music creators can build direct fan economies through NFT technology, creating new revenue streams and interaction methods.',
        category: 'Music',
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
        tags: ['Music', 'NFT', 'Fan Economy', 'Innovation']
      },
      {
        id: 'article-3',
        title: 'Solidity Smart Contract Security Best Practices Guide',
        excerpt: 'Detailed introduction to security considerations in smart contract development, including common vulnerabilities, prevention measures, and code audit methods.',
        category: 'Technology',
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
        tags: ['Solidity', 'Smart Contracts', 'Security', 'Development']
      },
      {
        id: 'article-4',
        title: 'Web3 Photography: New Paradigm for Visual Creation in the Blockchain Era',
        excerpt: 'How photographers can protect copyright in a decentralized world, establishing traceable creative processes and revenue models.',
        category: 'Photography',
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
        tags: ['Photography', 'Web3', 'Copyright', 'Creation']
      }
      ]
      
      // 將其他文章添加到列表
      allArticles.value.push(...otherArticles)
      console.log('✅ Other demo articles added')
    }
    
    const trendingCreators = ref([
      {
        id: 'creator-1',
        name: 'Alice Chen',
        category: 'Blockchain Trends',
        subscribers: 12400,
        articles: 23,
        totalEarnings: 156.7,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
        verified: true,
        recentActivity: '2 hours ago',
        trend: '+12%'
      },
      {
        id: 'creator-2',
        name: 'David Kim',
        category: 'Digital Art',
        subscribers: 8900,
        articles: 31,
        totalEarnings: 234.8,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: true,
        recentActivity: '4 hours ago',
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
              'blockchain': 'Blockchain Trends',
              'art': 'Digital Art',
              'music': 'Music',
              'tech': 'Technology',
              'photography': 'Photography',
              'writing': 'Writing'
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
      console.log('Search:', searchQuery.value)
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
        console.error('Failed to load more articles:', error)
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
      console.log('🛒 處理 NFT 購買 (固定參數測試):', nftData)
      
      try {
        // 檢查錢包連接狀態
        if (!walletStore.isConnected) {
          alert('請先連接錢包以購買 NFT')
          return
        }
        
        // 🎯 固定參數設定
        const FIXED_CREATOR = 'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ'
        const FIXED_SEASON_ID = 20254
        const FIXED_METADATA_URI = 'https://api.satscribe.com/nft/metadata'
        
        console.log('🎯 使用固定測試參數:')
        console.log('📍 創作者地址:', FIXED_CREATOR)
        console.log('📍 季度ID:', FIXED_SEASON_ID) 
        console.log('📍 Metadata URI:', FIXED_METADATA_URI)
        
        // 🎯 跳過季度檢查，直接進行購買
        console.log('🚀 跳過季度驗證，直接發送 mint-subscription 交易...')
        
        // 🎯 移除所有檢查，任何錢包都可以購買
        
        // 創建吸引人的購買確認對話框
        const confirmModal = await new Promise((resolve) => {
          const modal = document.createElement('div')
          modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'
          
          modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-lg w-full p-6 border border-purple-500/30">
              <!-- 標題 -->
              <div class="text-center mb-6">
                <div class="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v1.586l8.707 8.707a1 1 0 001.414 0L20.828 6.5a1 1 0 000-1.414L12.707.293a1 1 0 00-1.414 0L2.586 8.5A2 2 0 002 10v8a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">🎉 Join VIP Membership</h3>
                <p class="text-gray-400">Exclusive content and benefits unlocking soon</p>
              </div>
              
              <!-- 權益列表 -->
              <div class="bg-gray-800/50 rounded-xl p-4 mb-6">
                <h4 class="text-white font-medium mb-3">You will receive:</h4>
                <div class="space-y-2">
                  <div class="flex items-center text-sm">
                    <svg class="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-gray-300">Unlimited access to exclusive content</span>
                  </div>
                  <div class="flex items-center text-sm">
                    <svg class="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-gray-300">Creator community interaction access</span>
                  </div>
                  <div class="flex items-center text-sm">
                    <svg class="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-gray-300">Exclusive NFT collectible badge</span>
                  </div>
                </div>
              </div>
              
              <!-- 價格信息 -->
              <div class="text-center mb-6">
                <div class="text-3xl font-bold text-purple-400">${nftData.price} STX</div>
                <div class="text-gray-400 text-sm">One-time purchase, lifetime benefits</div>
              </div>
              
              <!-- 按鈕組 -->
              <div class="flex gap-3">
                <button id="cancel-btn" class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-colors">
                  Cancel
                </button>
                <button id="confirm-btn" class="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
                  Confirm Purchase
                </button>
              </div>
            </div>
          `
          
          document.body.appendChild(modal)
          
          // 綁定事件
          modal.querySelector('#confirm-btn').onclick = () => {
            modal.remove()
            resolve(true)
          }
          modal.querySelector('#cancel-btn').onclick = () => {
            modal.remove()
            resolve(false)
          }
          modal.onclick = (e) => {
            if (e.target === modal) {
              modal.remove()
              resolve(false)
            }
          }
        })
        
        const confirmed = await confirmModal
        
        if (!confirmed) {
          return
        }
        
        console.log('📞 調用合約購買 NFT (固定參數)...')
        console.log('🎯 最終參數:', {
          creatorAddress: FIXED_CREATOR,
          seasonId: FIXED_SEASON_ID,
          metadataUri: FIXED_METADATA_URI
        })
        
        // 調用合約購買NFT (使用固定參數)
        const result = await contractsStore.purchaseNFT(
          FIXED_CREATOR,      // 固定創作者地址
          FIXED_SEASON_ID,    // 固定季度ID
          FIXED_METADATA_URI  // 固定 metadata URI
        )
        
        console.log('✅ NFT Purchase successful:', result)
        
        // 更具吸引力的成功提示
        const successModal = document.createElement('div')
        successModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'
        successModal.onclick = () => successModal.remove()
        
        successModal.innerHTML = `
          <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full p-6 border border-green-500/30" onclick="event.stopPropagation()">
            <!-- 成功圖標 -->
            <div class="text-center mb-6">
              <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">🎉 購買成功！</h3>
              <p class="text-green-400 font-medium">恭喜成為 VIP 會員</p>
            </div>
            
            <!-- 購買詳情 -->
            <div class="bg-gray-800/50 rounded-xl p-4 mb-6">
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-400">交易 ID:</span>
                  <span class="text-gray-300 font-mono text-xs">${result.txId.slice(0, 20)}...</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">NFT 類型:</span>
                  <span class="text-white">VIP 會員章</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">權益:</span>
                  <span class="text-green-400">解鎖專屬內容</span>
                </div>
              </div>
            </div>
            
            <!-- 下一步行動 -->
            <div class="text-center">
              <p class="text-gray-400 text-sm mb-4">💰 收益已自動分配給創作團隊</p>
              <button onclick="this.closest('.fixed').remove(); window.location.href = '/user/collections'" 
                      class="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
                查看我的收藏
              </button>
            </div>
          </div>
        `
        
        document.body.appendChild(successModal)
        
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
      console.log('Explore page loaded')
      
      // 初始化文章數據
      try {
        console.log('🚀 Initializing explore page article data')
        
        // 先加載其他演示文章
        initOtherArticles()
        
        // 加載 zhenyan 的 NFT 文章（使用預設數據）
        loadRealNFTArticle()
        
        console.log('✅ All article data loaded successfully')
      } catch (error) {
        console.error('Failed to initialize article data:', error)
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