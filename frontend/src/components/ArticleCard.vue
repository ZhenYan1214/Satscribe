<template>
  <article 
    :class="[
      'article-card group cursor-pointer transition-all duration-500 hover:-translate-y-2',
      viewMode === 'list' ? 'article-card--list' : 'article-card--grid'
    ]"
    @click="$emit('click', article)"
  >
    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="card-web3 overflow-hidden h-full">
      <!-- Article Image -->
      <div class="aspect-video bg-gradient-to-br from-web3-purple via-web3-cyan to-web3-pink relative overflow-hidden">
        <img 
          v-if="article.image" 
          :src="article.image" 
          :alt="article.title"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <!-- Category Badge -->
        <div class="absolute top-3 left-3">
          <span class="bg-glass-dark backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/20">
            {{ article.category }}
          </span>
        </div>
        
        <!-- Engagement Stats Overlay -->
        <div class="absolute bottom-3 right-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="bg-glass-dark backdrop-blur-md rounded-full p-2 flex items-center space-x-1">
            <svg class="w-4 h-4 text-web3-pink" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
            </svg>
            <span class="text-white text-xs">{{ article.likes }}</span>
          </div>
          <div class="bg-glass-dark backdrop-blur-md rounded-full p-2 flex items-center space-x-1">
            <svg class="w-4 h-4 text-web3-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
            <span class="text-white text-xs">{{ article.earnings }}</span>
          </div>
        </div>
      </div>
      
      <!-- Article Content -->
      <div class="p-6 flex flex-col flex-1">
        <!-- Author Info -->
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-8 h-8 bg-gradient-to-br from-web3-purple to-web3-cyan rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white font-medium text-sm">{{ article.author.name.charAt(0) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <p class="text-white/90 font-medium text-sm truncate">{{ article.author.name }}</p>
              <svg v-if="article.author.verified" class="w-4 h-4 text-web3-cyan flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <p class="text-white/60 text-xs">{{ article.author.subscribers }} 訂閱者</p>
          </div>
        </div>
        
        <!-- Article Title & Excerpt -->
        <div class="flex-1">
          <h3 class="text-white font-bold text-lg mb-3 leading-tight group-hover:text-gradient-web3 transition-all duration-300 line-clamp-2">
            {{ article.title }}
          </h3>
          <p class="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
            {{ article.excerpt }}
          </p>
        </div>
        
        <!-- Article Meta -->
        <div class="flex items-center justify-between text-xs text-white/60 pt-4 border-t border-white/10">
          <div class="flex items-center space-x-4">
            <span>{{ formatDate(article.publishedAt) }}</span>
            <span>{{ article.readTime }} 分鐘</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-1">
              <svg class="w-4 h-4 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
              </svg>
              <span>{{ article.comments }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- List View -->
    <div v-else class="card-web3 p-6">
      <div class="flex space-x-6">
        <!-- Article Image -->
        <div class="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 bg-gradient-to-br from-web3-purple via-web3-cyan to-web3-pink rounded-xl overflow-hidden relative">
          <img 
            v-if="article.image" 
            :src="article.image" 
            :alt="article.title"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          
          <!-- Category Badge -->
          <div class="absolute top-2 left-2">
            <span class="bg-glass-dark backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium text-white">
              {{ article.category }}
            </span>
          </div>
        </div>
        
        <!-- Article Content -->
        <div class="flex-1 min-w-0 flex flex-col">
          <!-- Author Info -->
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-8 h-8 bg-gradient-to-br from-web3-purple to-web3-cyan rounded-full flex items-center justify-center">
              <span class="text-white font-medium text-sm">{{ article.author.name.charAt(0) }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <p class="text-white/90 font-medium text-sm">{{ article.author.name }}</p>
              <svg v-if="article.author.verified" class="w-4 h-4 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-white/60 text-xs">{{ article.author.subscribers }} 訂閱者</span>
            </div>
          </div>
          
          <!-- Article Title & Excerpt -->
          <div class="flex-1">
            <h3 class="text-white font-bold text-xl mb-2 leading-tight group-hover:text-gradient-web3 transition-all duration-300 line-clamp-2">
              {{ article.title }}
            </h3>
            <p class="text-white/70 leading-relaxed mb-4 line-clamp-2 md:line-clamp-3">
              {{ article.excerpt }}
            </p>
          </div>
          
          <!-- Article Meta & Stats -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4 text-sm text-white/60">
              <span>{{ formatDate(article.publishedAt) }}</span>
              <span>{{ article.readTime }} 分鐘閱讀</span>
            </div>
            
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-1 text-sm">
                <svg class="w-4 h-4 text-web3-pink" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                </svg>
                <span class="text-white/80">{{ article.likes }}</span>
              </div>
              <div class="flex items-center space-x-1 text-sm">
                <svg class="w-4 h-4 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                </svg>
                <span class="text-white/80">{{ article.comments }}</span>
              </div>
              <div class="flex items-center space-x-1 text-sm">
                <svg class="w-4 h-4 text-web3-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
                <span class="text-web3-gold font-medium">{{ article.earnings }} STX</span>
              </div>
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
        class="px-2 py-1 bg-glass-purple/50 text-web3-cyan text-xs rounded-md font-medium border border-web3-purple/30 hover:bg-web3-purple/20 transition-colors duration-200"
      >
        #{{ tag }}
      </span>
      <span v-if="article.tags.length > 3" class="text-white/40 text-xs py-1">
        +{{ article.tags.length - 3 }} 更多
      </span>
    </div>
  </article>
</template>

<script>
export default {
  name: 'ArticleCard',
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
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return '昨天'
      if (diffDays < 7) return `${diffDays} 天前`
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} 週前`
      return articleDate.toLocaleDateString('zh-TW')
    }
  }
}
</script>

<style scoped>
.article-card {
  position: relative;
}

/* Grid 樣式 */
.article-card--grid {
  @apply h-full;
}

.article-card--grid .card-web3 {
  @apply flex flex-col h-full;
}

/* List 樣式優化 */
.article-card--list .card-web3 {
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
.article-card:hover .card-web3 {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(108, 92, 231, 0.3);
  box-shadow: 0 20px 40px rgba(108, 92, 231, 0.15);
}

/* 圖片懸停效果 */
.article-card:hover img {
  filter: brightness(1.1);
}

/* 標籤懸停效果 */
.article-card:hover .tag {
  transform: translateY(-1px);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .article-card--list .flex {
    flex-direction: column;
  }
  
  .article-card--list .w-32 {
    width: 100%;
    height: 200px;
    margin-bottom: 1rem;
  }
}

/* 性能優化 */
.article-card {
  will-change: transform;
}

.article-card img {
  will-change: transform;
}

/* 無障礙設計 */
.article-card:focus {
  outline: 2px solid #6C5CE7;
  outline-offset: 2px;
}

/* 加載狀態 */
.article-card.loading {
  pointer-events: none;
  opacity: 0.7;
}

.article-card.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid transparent;
  border-top: 2px solid #6C5CE7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 深色模式優化 */
@media (prefers-color-scheme: dark) {
  .article-card {
    /* 已經是深色設計，無需額外調整 */
  }
}

/* 高對比度模式 */
@media (prefers-contrast: high) {
  .article-card .card-web3 {
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .article-card .text-white\/60 {
    color: rgba(255, 255, 255, 0.8);
  }
}

/* 減少動畫設定 */
@media (prefers-reduced-motion: reduce) {
  .article-card,
  .article-card img,
  .article-card .card-web3 {
    transition: none !important;
    animation: none !important;
  }
}
</style>