<template>
  <article 
    class="featured-article-card group cursor-pointer"
    @click="$emit('click', article)"
  >
    <div class="bg-web3-slate/20 backdrop-blur-sm border border-web3-gray-700/50 rounded-3xl overflow-hidden hover:border-web3-primary/40 hover:bg-web3-slate/30 transition-all duration-500 hover:scale-[1.01]">
      <div class="grid lg:grid-cols-5 gap-0">
        <!-- Article Image Section -->
        <div class="lg:col-span-3 aspect-video lg:aspect-[4/3] bg-gradient-to-br from-web3-primary via-web3-secondary to-web3-accent relative overflow-hidden">
          <img 
            v-if="article.image" 
            :src="article.image" 
            :alt="article.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          <!-- Featured Badge -->
          <div class="absolute top-6 left-6">
            <div class="flex items-center space-x-2 bg-web3-amber/20 backdrop-blur-md border border-web3-amber/30 px-4 py-2 rounded-xl">
              <svg class="w-4 h-4 text-web3-amber" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span class="text-web3-amber font-semibold text-sm">精選文章</span>
            </div>
          </div>
          
          <!-- Category Badge -->
          <div class="absolute top-6 right-6">
            <span class="bg-web3-dark/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-medium text-white border border-white/20">
              {{ article.category }}
            </span>
          </div>
          
          <!-- Reading Stats -->
          <div class="absolute bottom-6 left-6 right-6">
            <div class="flex items-center justify-between">
              <!-- Author Quick Info -->
              <div class="flex items-center space-x-3">
                <div class="relative">
                  <img 
                    v-if="article.author.avatar" 
                    :src="article.author.avatar" 
                    :alt="article.author.name"
                    class="w-12 h-12 rounded-full object-cover ring-3 ring-white/20"
                  >
                  <div v-else class="w-12 h-12 bg-gradient-to-br from-web3-primary to-web3-secondary rounded-full flex items-center justify-center ring-3 ring-white/20">
                    <span class="text-white font-bold">{{ article.author.name.charAt(0) }}</span>
                  </div>
                  <!-- Online Status -->
                  <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-web3-success rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div class="flex items-center space-x-2">
                    <p class="text-white font-semibold">{{ article.author.name }}</p>
                    <svg v-if="article.author.verified" class="w-5 h-5 text-web3-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <p class="text-white/80 text-sm">{{ formatNumber(article.author.subscribers) }} 訂閱者</p>
                </div>
              </div>
              
              <!-- Reading Time & Date -->
              <div class="text-right">
                <div class="flex items-center space-x-2 text-white/90 mb-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="font-medium">{{ article.readTime }} 分鐘閱讀</span>
                </div>
                <p class="text-white/60 text-sm">{{ formatDate(article.publishedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Article Content Section -->
        <div class="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center">
          <!-- Title & Excerpt -->
          <div class="mb-8">
            <h1 class="text-3xl lg:text-4xl font-display font-bold text-white mb-6 leading-tight group-hover:text-gradient-web3 transition-all duration-500">
              {{ article.title }}
            </h1>
            <p class="text-web3-gray-300 text-lg leading-relaxed mb-6">
              {{ article.excerpt }}
            </p>
          </div>

          <!-- Engagement Stats -->
          <div class="grid grid-cols-2 gap-6 mb-8">
            <div class="text-center p-4 bg-web3-dark/30 rounded-xl border border-web3-gray-700/50">
              <div class="flex items-center justify-center space-x-2 mb-2">
                <svg class="w-5 h-5 text-web3-rose" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                </svg>
                <span class="text-2xl font-bold text-white">{{ formatNumber(article.likes) }}</span>
              </div>
              <p class="text-web3-gray-400 text-sm">喜愛</p>
            </div>
            
            <div class="text-center p-4 bg-web3-dark/30 rounded-xl border border-web3-gray-700/50">
              <div class="flex items-center justify-center space-x-2 mb-2">
                <svg class="w-5 h-5 text-web3-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                </svg>
                <span class="text-2xl font-bold text-white">{{ formatNumber(article.comments) }}</span>
              </div>
              <p class="text-web3-gray-400 text-sm">討論</p>
            </div>
            
            <div class="text-center p-4 bg-web3-dark/30 rounded-xl border border-web3-gray-700/50">
              <div class="flex items-center justify-center space-x-2 mb-2">
                <svg class="w-5 h-5 text-web3-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span class="text-2xl font-bold text-white">{{ formatNumber(article.views) }}</span>
              </div>
              <p class="text-web3-gray-400 text-sm">閱讀</p>
            </div>
            
            <div class="text-center p-4 bg-web3-amber/10 rounded-xl border border-web3-amber/30">
              <div class="flex items-center justify-center space-x-2 mb-2">
                <svg class="w-5 h-5 text-web3-amber" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
                <span class="text-2xl font-bold text-web3-amber">{{ article.earnings }}</span>
              </div>
              <p class="text-web3-amber text-sm font-medium">STX 收益</p>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="article.tags && article.tags.length > 0" class="mb-8">
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in article.tags.slice(0, 4)" 
                :key="tag"
                class="tag-style px-3 py-1.5 bg-web3-primary/10 text-web3-primary text-sm rounded-full font-medium border border-web3-primary/20 hover:bg-web3-primary/20 transition-colors duration-200 cursor-pointer"
              >
                #{{ tag }}
              </span>
              <span v-if="article.tags.length > 4" class="text-web3-gray-400 text-sm py-1.5 px-2">
                +{{ article.tags.length - 4 }} 更多
              </span>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="flex items-center space-x-4">
            <button class="flex-1 btn-web3 py-4 rounded-xl font-semibold text-base relative group overflow-hidden">
              <span class="relative z-10 flex items-center justify-center space-x-2">
                <span>立即閱讀</span>
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-web3-accent to-web3-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button class="p-4 bg-web3-slate/50 hover:bg-web3-slate/80 rounded-xl transition-colors duration-200 group">
              <svg class="w-5 h-5 text-web3-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
            </button>
            
            <button class="p-4 bg-web3-slate/50 hover:bg-web3-slate/80 rounded-xl transition-colors duration-200 group">
              <svg class="w-5 h-5 text-web3-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Hover Glow Effect -->
      <div class="absolute inset-0 bg-gradient-to-br from-web3-primary/5 to-web3-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'FeaturedArticleCard',
  props: {
    article: {
      type: Object,
      required: true
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
.featured-article-card {
  position: relative;
}

/* 懸停效果增強 */
.featured-article-card:hover .bg-web3-slate\/20 {
  background: rgba(26, 35, 50, 0.4);
  border-color: rgba(91, 79, 232, 0.5);
  box-shadow: 
    0 25px 50px rgba(91, 79, 232, 0.2),
    0 0 0 1px rgba(91, 79, 232, 0.1);
}

/* 圖片懸停效果 */
.featured-article-card:hover img {
  filter: brightness(1.1) saturate(1.1);
}

/* 作者頭像發光效果 */
.featured-article-card:hover .ring-3 {
  animation: pulse-ring-large 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-ring-large {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 8px rgba(255, 255, 255, 0);
  }
}

/* 統計卡片懸停效果 */
.featured-article-card:hover .bg-web3-dark\/30 {
  background: rgba(10, 13, 24, 0.5);
  transform: translateY(-2px);
}

/* 按鈕微互動 */
.btn-web3::after {
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

.btn-web3:active::after {
  width: 300px;
  height: 300px;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .featured-article-card .grid {
    grid-template-columns: 1fr;
  }
  
  .featured-article-card .lg\\:aspect-ratio-4-3 {
    aspect-ratio: 16 / 9;
  }
  
  .featured-article-card .text-3xl {
    font-size: 1.875rem;
  }
}

@media (max-width: 768px) {
  .featured-article-card .p-8 {
    padding: 1.5rem;
  }
  
  .featured-article-card .grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .featured-article-card .flex-1 {
    width: 100%;
  }
  
  .featured-article-card .space-x-4 {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .featured-article-card .space-x-4 > :not([hidden]) ~ :not([hidden]) {
    margin-left: 0;
  }
}

/* 無障礙設計 */
.featured-article-card:focus {
  outline: 2px solid #5B4FE8;
  outline-offset: 2px;
}

.featured-article-card button:focus {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/* 性能優化 */
.featured-article-card {
  will-change: transform;
}

.featured-article-card img {
  will-change: transform;
}

/* 文字漸層效果 */
.text-gradient-web3 {
  background: linear-gradient(135deg, #5B4FE8 0%, #3B82F6 50%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 標籤懸停效果 */
.featured-article-card .tag-style {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.featured-article-card:hover .tag-style:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 8px rgba(91, 79, 232, 0.2);
}

/* 高對比度模式 */
@media (prefers-contrast: high) {
  .featured-article-card .bg-web3-slate-20 {
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .featured-article-card .text-web3-gray-300,
  .featured-article-card .text-web3-gray-400 {
    color: rgba(255, 255, 255, 0.9);
  }
}

/* 減少動畫設定 */
@media (prefers-reduced-motion: reduce) {
  .featured-article-card,
  .featured-article-card *,
  .featured-article-card::before,
  .featured-article-card::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 深色模式優化 */
@media (prefers-color-scheme: dark) {
  .featured-article-card {
    color-scheme: dark;
  }
}
</style>