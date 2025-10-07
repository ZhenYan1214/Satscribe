<template>
  <article 
    :class="[
      'enhanced-article-card group cursor-pointer transition-all duration-500 hover:-translate-y-1',
      viewMode === 'list' ? 'enhanced-article-card--list' : 'enhanced-article-card--grid'
    ]"
    @click="$emit('click', article)"
  >
    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="bg-web3-slate/20 backdrop-blur-sm border border-web3-gray-700/50 rounded-2xl overflow-hidden h-full hover:border-web3-primary/30 hover:bg-web3-slate/30 transition-all duration-300">
      <!-- Article Image -->
      <div class="aspect-[16/10] bg-gradient-to-br from-web3-primary via-web3-secondary to-web3-accent relative overflow-hidden">
        <img 
          v-if="article.image" 
          :src="article.image" 
          :alt="article.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <!-- Category Badge -->
        <div class="absolute top-4 left-4">
          <span class="bg-web3-dark/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-white border border-white/20">
            {{ article.category }}
          </span>
        </div>
        
        <!-- Reading Time -->
        <div class="absolute top-4 right-4">
          <div class="bg-web3-dark/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center space-x-1 text-xs text-white/90">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ article.readTime }}分鐘</span>
          </div>
        </div>
        
        <!-- Engagement Stats Overlay -->
        <div class="absolute bottom-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="bg-web3-dark/90 backdrop-blur-md rounded-lg px-3 py-1.5 flex items-center space-x-4">
            <div class="flex items-center space-x-1 text-xs">
              <svg class="w-3 h-3 text-web3-rose" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
              </svg>
              <span class="text-white font-medium">{{ formatNumber(article.likes) }}</span>
            </div>
            <div class="flex items-center space-x-1 text-xs">
              <svg class="w-3 h-3 text-web3-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
              </svg>
              <span class="text-white font-medium">{{ formatNumber(article.comments) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Article Content -->
      <div class="p-6 flex flex-col flex-1">
        <!-- Author Info -->
        <div class="flex items-center space-x-3 mb-4">
          <div class="relative">
            <img 
              v-if="article.author.avatar" 
              :src="article.author.avatar" 
              :alt="article.author.name"
              class="w-10 h-10 rounded-full object-cover ring-2 ring-web3-primary/20"
            >
            <div v-else class="w-10 h-10 bg-gradient-to-br from-web3-primary to-web3-secondary rounded-full flex items-center justify-center">
              <span class="text-white font-semibold text-sm">{{ article.author.name.charAt(0) }}</span>
            </div>
            <!-- Online indicator -->
            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-web3-success rounded-full border-2 border-web3-slate"></div>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <h4 class="text-white font-semibold text-sm truncate">{{ article.author.name }}</h4>
              <svg v-if="article.author.verified" class="w-4 h-4 text-web3-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <p class="text-web3-gray-400 text-xs">{{ formatNumber(article.author.subscribers) }} 訂閱者</p>
          </div>
          
          <!-- Published Date -->
          <div class="text-web3-gray-400 text-xs">
            {{ formatDate(article.publishedAt) }}
          </div>
        </div>
        
        <!-- Article Title & Excerpt -->
        <div class="flex-1 mb-6">
          <h3 class="text-white font-bold text-lg leading-tight mb-3 group-hover:text-gradient-web3 transition-all duration-300 line-clamp-2">
            {{ article.title }}
          </h3>
          <p class="text-web3-gray-300 text-sm leading-relaxed line-clamp-3">
            {{ article.excerpt }}
          </p>
        </div>
        
        <!-- Article Footer -->
        <div class="flex items-center justify-between pt-4 border-t border-web3-gray-700/50">
          <div class="flex items-center space-x-4">
            <!-- Views -->
            <div class="flex items-center space-x-1 text-xs text-web3-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <span>{{ formatNumber(article.views) }}</span>
            </div>
            
            <!-- Engagement Rate -->
            <div class="flex items-center space-x-1 text-xs text-web3-gray-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
              </svg>
              <span>{{ ((article.likes + article.comments) / article.views * 100).toFixed(1) }}%</span>
            </div>
          </div>
          
          <!-- Earnings -->
          <div class="flex items-center space-x-1 text-web3-amber font-semibold text-sm">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
            <span>{{ article.earnings }} STX</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- List View -->
    <div v-else class="bg-web3-slate/20 backdrop-blur-sm border border-web3-gray-700/50 rounded-2xl p-6 hover:border-web3-primary/30 hover:bg-web3-slate/30 transition-all duration-300">
      <div class="flex space-x-6">
        <!-- Article Image -->
        <div class="w-48 h-32 flex-shrink-0 bg-gradient-to-br from-web3-primary via-web3-secondary to-web3-accent rounded-xl overflow-hidden relative">
          <img 
            v-if="article.image" 
            :src="article.image" 
            :alt="article.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          
          <!-- Category Badge -->
          <div class="absolute top-2 left-2">
            <span class="bg-web3-dark/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium text-white">
              {{ article.category }}
            </span>
          </div>
          
          <!-- Reading Time -->
          <div class="absolute bottom-2 right-2">
            <div class="bg-web3-dark/80 backdrop-blur-md px-2 py-1 rounded-md flex items-center space-x-1 text-xs text-white/90">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ article.readTime }}分</span>
            </div>
          </div>
        </div>
        
        <!-- Article Content -->
        <div class="flex-1 min-w-0 flex flex-col">
          <!-- Author Info -->
          <div class="flex items-center space-x-3 mb-4">
            <div class="relative">
              <img 
                v-if="article.author.avatar" 
                :src="article.author.avatar" 
                :alt="article.author.name"
                class="w-8 h-8 rounded-full object-cover"
              >
              <div v-else class="w-8 h-8 bg-gradient-to-br from-web3-primary to-web3-secondary rounded-full flex items-center justify-center">
                <span class="text-white font-medium text-xs">{{ article.author.name.charAt(0) }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <h4 class="text-white font-medium text-sm">{{ article.author.name }}</h4>
              <svg v-if="article.author.verified" class="w-4 h-4 text-web3-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-web3-gray-400 text-xs">{{ formatNumber(article.author.subscribers) }} 訂閱</span>
            </div>
            
            <div class="ml-auto text-web3-gray-400 text-xs">
              {{ formatDate(article.publishedAt) }}
            </div>
          </div>
          
          <!-- Article Title & Excerpt -->
          <div class="flex-1 mb-4">
            <h3 class="text-white font-bold text-xl leading-tight mb-3 group-hover:text-gradient-web3 transition-all duration-300 line-clamp-2">
              {{ article.title }}
            </h3>
            <p class="text-web3-gray-300 leading-relaxed line-clamp-2">
              {{ article.excerpt }}
            </p>
          </div>
          
          <!-- Article Footer -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-6 text-sm">
              <div class="flex items-center space-x-1 text-web3-gray-400">
                <svg class="w-4 h-4 text-web3-rose" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                </svg>
                <span class="text-white">{{ formatNumber(article.likes) }}</span>
              </div>
              
              <div class="flex items-center space-x-1 text-web3-gray-400">
                <svg class="w-4 h-4 text-web3-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                </svg>
                <span class="text-white">{{ formatNumber(article.comments) }}</span>
              </div>
              
              <div class="flex items-center space-x-1 text-web3-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span class="text-white">{{ formatNumber(article.views) }}</span>
              </div>
            </div>
            
            <!-- Earnings -->
            <div class="flex items-center space-x-1 text-web3-amber font-semibold">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
              <span>{{ article.earnings }} STX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tags (Both Views) -->
    <div v-if="article.tags && article.tags.length > 0" 
         :class="[
           'flex flex-wrap gap-2 mt-4',
           viewMode === 'grid' ? 'px-6 pb-6' : 'px-6'
         ]">
      <span 
        v-for="tag in article.tags.slice(0, 3)" 
        :key="tag"
        class="px-3 py-1 bg-web3-primary/10 text-web3-primary text-xs rounded-full font-medium border border-web3-primary/20 hover:bg-web3-primary/20 transition-colors duration-200 cursor-pointer"
      >
        #{{ tag }}
      </span>
      <span v-if="article.tags.length > 3" class="text-web3-gray-400 text-xs py-1 px-2">
        +{{ article.tags.length - 3 }}
      </span>
    </div>
  </article>
</template>

<script>
export default {
  name: 'EnhancedArticleCard',
  props: {
    article: {
      type: Object,
      required: true
    },
    viewMode: {
      type: String,
      default: 'grid',
      validator: (value) => ['grid', 'list'].includes(value)
    }
  },
  emits: ['click'],
  methods: {
    formatDate(date) {
      const now = new Date()
      const articleDate = new Date(date)
      const diffTime = Math.abs(now - articleDate)
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffHours < 24) {
        return `${diffHours}小時前`
      } else if (diffDays < 7) {
        return `${diffDays}天前`
      } else if (diffDays < 30) {
        return `${Math.ceil(diffDays / 7)}週前`
      } else {
        return articleDate.toLocaleDateString('zh-TW')
      }
    },
    
    formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
      }
      return num.toString()
    }
  }
}
</script>

<style scoped>
.enhanced-article-card {
  position: relative;
}

/* Grid 樣式 */
.enhanced-article-card--grid {
  @apply h-full;
}

.enhanced-article-card--grid > div {
  @apply flex flex-col h-full;
}

/* List 樣式優化 */
.enhanced-article-card--list > div {
  @apply hover:scale-[1.01];
}

/* 文字截斷 */
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

/* 懸停效果增強 */
.enhanced-article-card:hover .bg-web3-slate\/20 {
  background: rgba(26, 35, 50, 0.4);
  border-color: rgba(91, 79, 232, 0.4);
  box-shadow: 0 20px 40px rgba(91, 79, 232, 0.15);
}

/* 圖片懸停效果 */
.enhanced-article-card:hover img {
  filter: brightness(1.1) saturate(1.1);
}

/* 標籤懸停效果 */
.enhanced-article-card:hover .px-3.py-1 {
  transform: translateY(-1px);
}

/* 作者頭像環形動畫 */
.enhanced-article-card:hover .ring-2 {
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-ring {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .enhanced-article-card--list .flex {
    flex-direction: column;
  }
  
  .enhanced-article-card--list .w-48 {
    width: 100%;
    height: 200px;
    margin-bottom: 1rem;
  }
  
  .enhanced-article-card--list .space-x-6 {
    gap: 0;
  }
}

/* 性能優化 */
.enhanced-article-card {
  will-change: transform;
}

.enhanced-article-card img {
  will-change: transform;
}

/* 無障礙設計 */
.enhanced-article-card:focus {
  outline: 2px solid #5B4FE8;
  outline-offset: 2px;
}

/* 加載狀態 */
.enhanced-article-card.loading {
  pointer-events: none;
  opacity: 0.7;
}

.enhanced-article-card.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid transparent;
  border-top: 2px solid #5B4FE8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 高對比度模式 */
@media (prefers-contrast: high) {
  .enhanced-article-card .bg-web3-slate\/20 {
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .enhanced-article-card .text-web3-gray-400 {
    color: rgba(255, 255, 255, 0.8);
  }
}

/* 減少動畫設定 */
@media (prefers-reduced-motion: reduce) {
  .enhanced-article-card,
  .enhanced-article-card img,
  .enhanced-article-card > div {
    transition: none !important;
    animation: none !important;
  }
}

/* 文字漸層效果 */
.text-gradient-web3 {
  background: linear-gradient(135deg, #5B4FE8 0%, #3B82F6 50%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 微妙的發光效果 */
.enhanced-article-card:hover .ring-2 {
  box-shadow: 0 0 0 4px rgba(91, 79, 232, 0.3);
}

/* 標籤動畫 */
.enhanced-article-card .px-3.py-1 {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.enhanced-article-card:hover .px-3.py-1:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 8px rgba(91, 79, 232, 0.2);
}
</style>