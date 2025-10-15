<template>
  <div class="article-detail min-h-screen text-white bg-gradient-to-br from-web3-dark via-web3-navy to-web3-darker">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-web3-purple/30 border-t-web3-purple rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-white/80">Load...</p>
      </div>
    </div>

    <!-- Article Content -->
    <div v-else-if="article" class="max-w-4xl mx-auto px-4 py-8">
      <!-- Back Button -->
      <button 
        @click="goBack"
        class="flex items-center space-x-2 text-white/80 hover:text-white mb-8 transition-colors duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        <span>back to explore</span>
      </button>

      <!-- Article Header -->
      <header class="mb-8">
        <!-- Category Badge -->
        <div class="mb-4">
          <span class="bg-gradient-to-r from-web3-purple to-web3-cyan text-white px-4 py-2 rounded-full text-sm font-medium">
            {{ article.category }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
          {{ article.title }}
        </h1>

        <!-- Author & Meta Info -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-4">
            <!-- Author Avatar -->
            <div class="w-12 h-12 bg-gradient-to-br from-web3-purple to-web3-cyan rounded-full flex items-center justify-center">
              <span class="text-white font-bold">{{ article.author.name.charAt(0) }}</span>
            </div>
            
            <!-- Author Info -->
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="text-white font-medium">{{ article.author.name }}</h3>
                <svg v-if="article.author.verified" class="w-5 h-5 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
              <p class="text-white/60 text-sm">{{ article.author.subscribers }} subscribers</p>
            </div>
          </div>

          <!-- Article Meta -->
          <div class="text-right text-sm text-white/60">
            <p>{{ formatDate(article.publishedAt) }}</p>
            <p>{{ article.readTime }} minute read</p>
          </div>
        </div>

        <!-- Article Image -->
        <div v-if="article.image" class="aspect-video bg-gradient-to-br from-web3-purple via-web3-cyan to-web3-pink rounded-2xl overflow-hidden mb-8">
          <img 
            :src="article.image" 
            :alt="article.title"
            class="w-full h-full object-cover"
          >
        </div>

        <!-- Article Stats -->
        <div class="flex items-center justify-between py-6 border-t border-b border-white/10">
          <div class="flex items-center space-x-6">
            <!-- Likes -->
            <button class="flex items-center space-x-2 text-white/80 hover:text-web3-pink transition-colors duration-200">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
              </svg>
              <span>{{ article.likes }}</span>
            </button>

            <!-- Comments -->
            <button class="flex items-center space-x-2 text-white/80 hover:text-web3-cyan transition-colors duration-200">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
              </svg>
              <span>{{ article.comments }}</span>
            </button>

            <!-- Share -->
            <button class="flex items-center space-x-2 text-white/80 hover:text-web3-gold transition-colors duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
              <span>Share</span>
            </button>
          </div>

          <!-- Earnings -->
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-web3-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
            <span class="text-web3-gold font-medium">{{ article.earnings }} STX</span>
          </div>
        </div>
      </header>

      <!-- Article Content -->
      <main class="prose prose-lg prose-invert max-w-none mb-12">
        <!-- Article Excerpt -->
        <div class="bg-glass-dark rounded-2xl p-8 mb-8 border border-white/10">
          <p class="text-xl text-white/90 leading-relaxed italic">
            {{ article.excerpt }}
          </p>
        </div>

        <!-- Main Content -->
        <div class="text-white/90 leading-relaxed space-y-6">
          <p>Here is the main content of the article. In practical applications, this will be the complete article content retrieved from the backend, supporting Markdown format or rich-text editor.。</p>
          
          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Web3 The Transformation of the Creator Economy</h2>
          <p>Traditional creator economy models are often dominated by centralized platforms, where creators can only earn a small portion of the revenue. The emergence of Web3 technology, however, brings entirely new possibilities for creators...</p>
          
          <h3 class="text-xl font-bold text-white mt-6 mb-3">Advantages of Blockchain Technology</h3>
          <ul class="list-disc list-inside space-y-2 text-white/80">
            <li>Decentralized content distribution</li>
            <li>Transparent revenue distribution mechanism</li>
            <li>Tokenized content assets (NFTs)</li>
            <li>Community-driven governance model</li>
          </ul>
          
          <p>Through smart contracts, creators can set automated revenue-sharing rules to ensure that every participant receives a fair return. This model not only improves efficiency but also enhances trust.</p>
        </div>
      </main>

      <!-- Article Tags -->
      <div v-if="article.tags && article.tags.length > 0" class="mb-8">
        <h3 class="text-white font-medium mb-4">Related Tags</h3>
        <div class="flex flex-wrap gap-3">
          <span 
            v-for="tag in article.tags" 
            :key="tag"
            class="px-4 py-2 bg-glass-purple/50 text-web3-cyan rounded-full text-sm font-medium border border-web3-purple/30 hover:bg-web3-purple/20 transition-colors duration-200 cursor-pointer"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- Support Creator Section -->
      <div class="bg-gradient-to-r from-web3-purple/20 to-web3-cyan/20 rounded-2xl p-8 mb-8 border border-web3-purple/30">
        <div class="text-center">
          <h3 class="text-2xl font-bold text-white mb-4">Support this creator</h3>
          <p class="text-white/80 mb-6">Purchase subscription badge NFT, become a supporter of this creator</p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button class="btn-web3 px-8 py-3 rounded-xl font-medium">
              Purchase subscription badge (2.5 STX)
            </button>
            <button class="btn-glass px-8 py-3 rounded-xl font-medium">
              View creator page
            </button>
          </div>
        </div>
      </div>

      <!-- Related Articles -->
      <section>
        <h3 class="text-2xl font-bold text-white mb-6">Related Articles</h3>
<div class="grid md:grid-cols-2 gap-6">
  <!-- Related article cards can be placed here -->
  <div class="bg-glass-dark rounded-xl p-6 border border-white/10">
    <h4 class="text-white font-bold mb-2">More related content coming soon</h4>
    <p class="text-white/70 text-sm">Explore more exciting content from quality creators</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Error State -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-16 h-16 bg-glass-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-web3-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">Article Not Found</h3>
<p class="text-white/70 mb-4">The article you are trying to view does not exist or has been removed</p>
        <button 
          @click="goBack"
          class="btn-web3 px-6 py-3 rounded-xl"
        >
          back explore
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'ArticleDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const isLoading = ref(true)
    const article = ref(null)
    
    // Mock data - 實際應用中會從 API 獲取
    const mockArticle = {
      id: 'featured-1',
      title: 'The Future of the Web3 Creator Economy: From Traditional Platforms to Decentralized Creation',
      excerpt: 'Explore how Web3 is redefining the creator economy, introducing new models from content creation to value distribution. Learn how blockchain technology empowers creators with true autonomy and fair revenue sharing.',
      content: 'The full article content will be displayed here...',
      category: 'Blockchain Trends',
      author: {
        id: 'author-1',
        name: 'Alice Chen',
        avatar: '',
        subscribers: 2840,
        verified: true
      },
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
      publishedAt: new Date('2024-01-15'),
      readTime: 8,
      likes: 342,
      comments: 67,
      earnings: 45.6,
      tags: ['Web3', 'Creator Economy', 'Blockchain', 'NFT']
    }
    
    const formatDate = (date) => {
      const now = new Date()
      const articleDate = new Date(date)
      const diffTime = Math.abs(now - articleDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
      return articleDate.toLocaleDateString('zh-TW')
    }
    
    const goBack = () => {
      router.go(-1) // 返回上一頁
    }
    
    const loadArticle = async () => {
      try {
        isLoading.value = true
        
        // 模擬 API 請求延遲
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 在實際應用中，這裡會根據 route.params.id 從 API 獲取文章
        const articleId = route.params.id
        
        if (articleId) {
          article.value = { ...mockArticle, id: articleId }
        }
      } catch (error) {
        console.error('Load article failed:', error)
        article.value = null
      } finally {
        isLoading.value = false
      }
    }
    
    onMounted(() => {
      loadArticle()
    })
    
    return {
      isLoading,
      article,
      formatDate,
      goBack
    }
  }
}
</script>

<style scoped>
/* 文章內容樣式 */
.prose {
  color: inherit;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: white;
  font-weight: bold;
}

.prose p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.75;
}

.prose ul,
.prose ol {
  color: rgba(255, 255, 255, 0.8);
}

.prose blockquote {
  border-left: 4px solid #6C5CE7;
  background: rgba(108, 92, 231, 0.1);
  padding: 1rem;
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.prose code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  color: #74B9FF;
  font-size: 0.875em;
}

.prose pre {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  overflow-x: auto;
}

.prose pre code {
  background: transparent;
  padding: 0;
  color: rgba(255, 255, 255, 0.9);
}

/* 連結樣式 */
.prose a {
  color: #74B9FF;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.prose a:hover {
  border-bottom-color: #74B9FF;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .article-detail {
    padding: 1rem;
  }
  
  .prose {
    font-size: 1rem;
  }
  
  .flex.items-center.justify-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

/* 載入動畫 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.article-detail > div {
  animation: fadeIn 0.6s ease-out;
}

/* 無障礙設計 */
.article-detail button:focus {
  outline: 2px solid #6C5CE7;
  outline-offset: 2px;
}

/* 高對比度模式 */
@media (prefers-contrast: high) {
  .prose {
    color: white;
  }
  
  .text-white\/60,
  .text-white\/70,
  .text-white\/80,
  .text-white\/90 {
    color: rgba(255, 255, 255, 0.9);
  }
}

/* 減少動畫設定 */
@media (prefers-reduced-motion: reduce) {
  .article-detail * {
    animation: none !important;
    transition: none !important;
  }
}
</style>