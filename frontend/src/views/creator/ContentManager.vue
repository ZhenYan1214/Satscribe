<template>
  <div class="content-manager min-h-screen p-6 max-w-7xl mx-auto">
    <!-- 頁面標題 -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold text-gradient-web3 mb-2">內容管理中心</h1>
        <p class="text-white/70 text-lg">創建、管理您的專屬內容，建立粉絲社群</p>
      </div>
      <button 
        @click="showCreateModal = true" 
        class="btn-web3 px-6 py-3 rounded-xl flex items-center space-x-2 shadow-web3"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
        </svg>
        <span>創建內容</span>
      </button>
    </div>

    <!-- 統計面板 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <!-- 總內容數 -->
      <div class="card-web3 p-6 hover:scale-[1.02] transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white/70 text-sm mb-1">總內容數</p>
            <p class="text-3xl font-bold text-white">{{ contents.length }}</p>
          </div>
          <div class="w-12 h-12 bg-web3-purple/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2v2h12V6H4zm0 4v4h4v-4H4zm6 0v4h6v-4h-6z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center text-sm">
          <span class="text-web3-green">+{{ contents.filter(c => c.status === 'published').length }}</span>
          <span class="text-white/50 ml-1">已發布</span>
        </div>
      </div>

      <!-- 公開內容 -->
      <div class="card-web3 p-6 hover:scale-[1.02] transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white/70 text-sm mb-1">公開內容</p>
            <p class="text-3xl font-bold text-white">{{ publicContents }}</p>
          </div>
          <div class="w-12 h-12 bg-web3-emerald/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-emerald" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center text-sm">
          <span class="text-white/50">開放率</span>
          <span class="text-web3-emerald ml-1">{{ publicRate }}%</span>
        </div>
      </div>

      <!-- 會員專屬 -->
      <div class="card-web3 p-6 hover:scale-[1.02] transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white/70 text-sm mb-1">會員專屬</p>
            <p class="text-3xl font-bold text-white">{{ premiumContents }}</p>
          </div>
          <div class="w-12 h-12 bg-web3-amber/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-amber" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center text-sm">
          <span class="text-web3-amber">🔒 </span>
          <span class="text-white/50 ml-1">專屬價值</span>
        </div>
      </div>

      <!-- 總瀏覽量 -->
      <div class="card-web3 p-6 hover:scale-[1.02] transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white/70 text-sm mb-1">總瀏覽量</p>
            <p class="text-3xl font-bold text-white">{{ formatNumber(totalViews) }}</p>
          </div>
          <div class="w-12 h-12 bg-web3-cyan/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center text-sm">
          <span class="text-web3-cyan">平均 {{ avgViews }}</span>
          <span class="text-white/50 ml-1">次/篇</span>
        </div>
      </div>
    </div>

    <!-- 內容篩選和搜尋 -->
    <div class="flex flex-wrap gap-4 mb-8">
      <div class="flex items-center space-x-4">
        <!-- 類型篩選 -->
        <button 
          @click="filterType = 'all'"
          :class="[
            'px-4 py-2 rounded-xl font-medium transition-all',
            filterType === 'all' 
              ? 'bg-web3-purple text-white shadow-glow' 
              : 'bg-glass text-white/70 hover:text-white'
          ]"
        >
          全部內容
        </button>
        <button 
          @click="filterType = 'public'"
          :class="[
            'px-4 py-2 rounded-xl font-medium transition-all',
            filterType === 'public' 
              ? 'bg-web3-purple text-white shadow-glow' 
              : 'bg-glass text-white/70 hover:text-white'
          ]"
        >
          公開內容
        </button>
        <button 
          @click="filterType = 'premium'"
          :class="[
            'px-4 py-2 rounded-xl font-medium transition-all',
            filterType === 'premium' 
              ? 'bg-web3-purple text-white shadow-glow' 
              : 'bg-glass text-white/70 hover:text-white'
          ]"
        >
          會員專屬
        </button>
        <button 
          @click="filterType = 'draft'"
          :class="[
            'px-4 py-2 rounded-xl font-medium transition-all',
            filterType === 'draft' 
              ? 'bg-web3-purple text-white shadow-glow' 
              : 'bg-glass text-white/70 hover:text-white'
          ]"
        >
          草稿
        </button>
      </div>

      <div class="ml-auto flex items-center space-x-4">
        <!-- 搜尋框 -->
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜尋內容..."
            class="bg-glass border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-web3-purple focus:outline-none w-64"
          >
        </div>

        <!-- 排序選項 -->
        <select 
          v-model="sortBy" 
          class="bg-glass border border-white/20 rounded-xl px-3 py-2 text-white focus:border-web3-purple focus:outline-none"
        >
          <option value="publishDate">按發布日期</option>
          <option value="views">按瀏覽量</option>
          <option value="title">按標題</option>
          <option value="type">按內容類型</option>
        </select>
      </div>
    </div>

    <!-- 內容網格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <!-- 內容卡片 -->
      <div 
        v-for="content in filteredContents" 
        :key="content.id"
        class="card-web3 hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden"
      >
        <!-- 內容類型標識 -->
        <div class="absolute top-4 right-4 z-10">
          <span 
            :class="[
              'px-3 py-1 rounded-full text-xs font-bold',
              content.isPremium 
                ? 'bg-web3-amber/20 text-web3-amber' 
                : 'bg-web3-emerald/20 text-web3-emerald'
            ]"
          >
            {{ content.isPremium ? '🔒 會員專屬' : '🌍 公開內容' }}
          </span>
        </div>

        <!-- 狀態標識 -->
        <div class="absolute top-4 left-4 z-10">
          <span 
            :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              content.status === 'published' 
                ? 'bg-web3-green/20 text-web3-green' 
                : 'bg-web3-rose/20 text-web3-rose'
            ]"
          >
            {{ content.status === 'published' ? '✅ 已發布' : '📝 草稿' }}
          </span>
        </div>

        <div class="p-6">
          <!-- 標題和預覽 -->
          <div class="mb-4">
            <h3 class="text-xl font-bold text-white mb-2 line-clamp-2">{{ content.title }}</h3>
            <p class="text-white/70 text-sm line-clamp-3">{{ content.preview || '暫無預覽' }}</p>
          </div>

          <!-- 標籤 -->
          <div class="mb-4">
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in (content.tags || []).slice(0, 3)" 
                :key="tag"
                class="px-2 py-1 bg-glass text-white/80 text-xs rounded-lg"
              >
                #{{ tag }}
              </span>
              <span 
                v-if="(content.tags || []).length > 3"
                class="px-2 py-1 bg-glass text-white/60 text-xs rounded-lg"
              >
                +{{ (content.tags || []).length - 3 }}
              </span>
            </div>
          </div>

          <!-- 統計信息 -->
          <div class="flex items-center justify-between mb-6 text-sm">
            <div class="flex items-center space-x-4">
              <div class="flex items-center text-white/60">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                </svg>
                <span>{{ formatNumber(content.views) }}</span>
              </div>
              <div class="flex items-center text-white/60">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                <span>{{ formatDate(content.publishDate) }}</span>
              </div>
            </div>
          </div>

          <!-- 操作按鈕 -->
          <div class="flex space-x-3">
            <button 
              @click="editContent(content)"
              class="flex-1 btn-glass py-2 text-sm rounded-xl hover:bg-white/20 transition-all flex items-center justify-center space-x-1"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
              </svg>
              <span>編輯</span>
            </button>
            <button 
              @click="viewContent(content)"
              class="flex-1 btn-glass py-2 text-sm rounded-xl hover:bg-white/20 transition-all flex items-center justify-center space-x-1"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
              </svg>
              <span>預覽</span>
            </button>
            <button 
              @click="deleteContent(content.id)"
              class="btn-glass px-3 py-2 text-sm rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 創建新內容卡片 -->
      <div 
        @click="showCreateModal = true"
        class="card-web3 p-8 hover:scale-[1.02] transition-all duration-300 cursor-pointer group border-2 border-dashed border-web3-purple/30 hover:border-web3-purple/60 bg-gradient-to-br from-web3-purple/5 to-web3-cyan/5 hover:from-web3-purple/10 hover:to-web3-cyan/10"
      >
        <div class="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div class="w-16 h-16 bg-web3-purple/20 rounded-3xl flex items-center justify-center group-hover:bg-web3-purple/30 transition-all group-hover:scale-110">
            <svg class="w-8 h-8 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white mb-2">創建新內容</h3>
            <p class="text-white/70 text-sm">分享您的創意和知識</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 創建/編輯內容模態框 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div class="card-web3 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <!-- 模態框標題 -->
        <div class="flex justify-between items-center p-6 border-b border-white/10">
          <h3 class="text-2xl font-bold text-gradient-web3">
            {{ editingContent ? '編輯內容' : '創建新內容' }}
          </h3>
          <button @click="closeModal" class="text-white/60 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>

        <!-- 表單內容 -->
        <form @submit.prevent="saveContent" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 標題 -->
            <div class="md:col-span-2">
              <label class="block text-white font-medium mb-2">內容標題</label>
              <input 
                v-model="contentForm.title"
                type="text" 
                required
                class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-web3-purple focus:outline-none"
                placeholder="輸入吸引人的標題..."
              >
            </div>

            <!-- 內容類型 -->
            <div>
              <label class="block text-white font-medium mb-2">內容類型</label>
              <select 
                v-model="contentForm.isPremium"
                class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white focus:border-web3-purple focus:outline-none"
              >
                <option :value="false">🌍 公開內容 - 所有人可見</option>
                <option :value="true">🔒 會員專屬 - 需要訂閱 NFT</option>
              </select>
            </div>

            <!-- 狀態 -->
            <div>
              <label class="block text-white font-medium mb-2">發布狀態</label>
              <select 
                v-model="contentForm.status"
                class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white focus:border-web3-purple focus:outline-none"
              >
                <option value="draft">📝 草稿 - 暫不發布</option>
                <option value="published">✅ 發布 - 立即上線</option>
              </select>
            </div>
          </div>

          <!-- 預覽描述 -->
          <div>
            <label class="block text-white font-medium mb-2">預覽描述</label>
            <input 
              v-model="contentForm.preview"
              type="text" 
              class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-web3-purple focus:outline-none"
              placeholder="用一句話描述這篇內容的精華..."
            >
          </div>

          <!-- 正文內容 -->
          <div>
            <label class="block text-white font-medium mb-2">正文內容</label>
            <textarea 
              v-model="contentForm.content"
              rows="10"
              required
              class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-web3-purple focus:outline-none resize-none"
              placeholder="在這裡分享您的創意和知識..."
            ></textarea>
            <div class="text-white/50 text-sm mt-2">
              建議內容長度: {{ contentForm.content.length }}/2000 字符
            </div>
          </div>

          <!-- 標籤 -->
          <div>
            <label class="block text-white font-medium mb-2">內容標籤</label>
            <input 
              v-model="contentForm.tags"
              type="text" 
              class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-web3-purple focus:outline-none"
              placeholder="用逗號分隔標籤，例如: 區塊鏈, 教程, NFT"
            >
            <div class="text-white/50 text-sm mt-2">
              💡 好的標籤有助於粉絲發現您的內容
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
              class="btn-web3 px-8 py-3 rounded-xl flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>{{ editingContent ? '更新內容' : (contentForm.status === 'published' ? '發布內容' : '保存草稿') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 內容預覽模態框 -->
    <div v-if="showPreviewModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div class="card-web3 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-6 border-b border-white/10">
          <h3 class="text-2xl font-bold text-white">{{ previewContent?.title }}</h3>
          <button @click="showPreviewModal = false" class="text-white/60 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <p class="text-white/70 text-lg">{{ previewContent?.preview }}</p>
          </div>
          <div class="prose prose-invert max-w-none">
            <div class="text-white whitespace-pre-wrap">{{ previewContent?.fullContent }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ContentManager',
  setup() {
    const contents = ref([])
    const showCreateModal = ref(false)
    const showPreviewModal = ref(false)
    const editingContent = ref(null)
    const previewContent = ref(null)
    const filterType = ref('all')
    const searchQuery = ref('')
    const sortBy = ref('publishDate')
    
    const contentForm = ref({
      title: '',
      preview: '',
      content: '',
      isPremium: false,
      status: 'published',
      tags: ''
    })
    
    const publicContents = computed(() => {
      return contents.value.filter(c => !c.isPremium && c.status === 'published').length
    })
    
    const premiumContents = computed(() => {
      return contents.value.filter(c => c.isPremium && c.status === 'published').length
    })
    
    const totalViews = computed(() => {
      return contents.value.reduce((sum, c) => sum + c.views, 0)
    })

    const publicRate = computed(() => {
      const published = contents.value.filter(c => c.status === 'published').length
      return published > 0 ? Math.round((publicContents.value / published) * 100) : 0
    })

    const avgViews = computed(() => {
      const published = contents.value.filter(c => c.status === 'published').length
      return published > 0 ? Math.round(totalViews.value / published) : 0
    })
    
    const filteredContents = computed(() => {
      let filtered = [...contents.value]
      
      // 類型篩選
      if (filterType.value === 'public') {
        filtered = filtered.filter(c => !c.isPremium)
      } else if (filterType.value === 'premium') {
        filtered = filtered.filter(c => c.isPremium)
      } else if (filterType.value === 'draft') {
        filtered = filtered.filter(c => c.status === 'draft')
      }
      
      // 搜索
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(c => 
          c.title.toLowerCase().includes(query) ||
          (c.preview && c.preview.toLowerCase().includes(query)) ||
          (c.tags && c.tags.some(tag => tag.toLowerCase().includes(query)))
        )
      }

      // 排序
      filtered.sort((a, b) => {
        if (sortBy.value === 'publishDate') {
          return new Date(b.publishDate) - new Date(a.publishDate)
        } else if (sortBy.value === 'views') {
          return b.views - a.views
        } else if (sortBy.value === 'title') {
          return a.title.localeCompare(b.title)
        } else if (sortBy.value === 'type') {
          return a.isPremium - b.isPremium
        }
        return 0
      })
      
      return filtered
    })
    
    const editContent = (content) => {
      editingContent.value = content
      contentForm.value = {
        title: content.title,
        preview: content.preview || '',
        content: content.fullContent || '',
        isPremium: content.isPremium,
        status: content.status || 'published',
        tags: content.tags ? content.tags.join(', ') : ''
      }
      showCreateModal.value = true
    }

    const viewContent = (content) => {
      previewContent.value = content
      showPreviewModal.value = true
    }
    
    const deleteContent = (contentId) => {
      if (confirm('確定要刪除這篇內容嗎？此操作無法復原。')) {
        contents.value = contents.value.filter(c => c.id !== contentId)
      }
    }
    
    const saveContent = () => {
      const contentData = {
        id: editingContent.value ? editingContent.value.id : Date.now(),
        title: contentForm.value.title,
        preview: contentForm.value.preview,
        fullContent: contentForm.value.content,
        isPremium: contentForm.value.isPremium,
        status: contentForm.value.status,
        tags: contentForm.value.tags ? contentForm.value.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        publishDate: editingContent.value ? editingContent.value.publishDate : new Date(),
        views: editingContent.value ? editingContent.value.views : 0
      }
      
      if (editingContent.value) {
        const index = contents.value.findIndex(c => c.id === editingContent.value.id)
        contents.value[index] = contentData
      } else {
        contents.value.unshift(contentData)
      }
      
      closeModal()
    }
    
    const closeModal = () => {
      showCreateModal.value = false
      editingContent.value = null
      contentForm.value = {
        title: '',
        preview: '',
        content: '',
        isPremium: false,
        status: 'published',
        tags: ''
      }
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('zh-TW', {
        month: 'short',
        day: 'numeric'
      })
    }

    const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
      return num.toString()
    }
    
    const loadContents = () => {
      // 示例數據
      contents.value = [
        {
          id: 1,
          title: '區塊鏈開發入門指南：從零開始學習 Stacks',
          preview: '完整介紹 Stacks 區塊鏈開發的基礎知識，包含環境設置、Clarity 語言基礎、智能合約部署等核心內容。',
          fullContent: '在這個快速發展的區塊鏈時代，Stacks 作為比特幣層 2 解決方案正在崛起...',
          isPremium: false,
          status: 'published',
          publishDate: new Date('2024-01-15'),
          views: 2847,
          tags: ['區塊鏈', 'Stacks', '教程', '開發']
        },
        {
          id: 2,
          title: 'Clarity 智能合約進階技巧與最佳實踐',
          preview: '深入探討 Clarity 智能合約的進階功能，包括狀態管理、錯誤處理、安全性考量等專業技術。',
          fullContent: 'Clarity 是一種獨特的智能合約語言，它的設計理念是可預測性和安全性...',
          isPremium: true,
          status: 'published',
          publishDate: new Date('2024-01-12'),
          views: 1653,
          tags: ['Clarity', '智能合約', '進階', '安全性']
        },
        {
          id: 3,
          title: 'NFT 市場分析：創作者經濟的新機遇',
          preview: '分析當前 NFT 市場趨勢，探討創作者如何利用 NFT 建立可持續的收益模式。',
          fullContent: 'NFT 不僅僅是數位藝術品，更是創作者經濟的重要組成部分...',
          isPremium: true,
          status: 'published',
          publishDate: new Date('2024-01-08'),
          views: 3241,
          tags: ['NFT', '創作者經濟', '市場分析', '趨勢']
        },
        {
          id: 4,
          title: '去中心化應用開發實戰',
          preview: '手把手教你開發第一個去中心化應用，從前端到智能合約的完整實踐。',
          fullContent: '本文將帶領您完整開發一個去中心化應用...',
          isPremium: false,
          status: 'draft',
          publishDate: new Date('2024-01-20'),
          views: 0,
          tags: ['DApp', '實戰', '前端', '全端開發']
        },
        {
          id: 5,
          title: 'Web3 設計原則與用戶體驗優化',
          preview: '探討 Web3 應用的設計原則，如何在去中心化的環境中提供良好的用戶體驗。',
          fullContent: 'Web3 應用面臨著獨特的用戶體驗挑戰...',
          isPremium: true,
          status: 'draft',
          publishDate: new Date('2024-01-18'),
          views: 0,
          tags: ['Web3', '設計', 'UX', '用戶體驗']
        }
      ]
    }
    
    onMounted(() => {
      loadContents()
    })
    
    return {
      contents,
      showCreateModal,
      showPreviewModal,
      editingContent,
      previewContent,
      filterType,
      searchQuery,
      sortBy,
      contentForm,
      publicContents,
      premiumContents,
      totalViews,
      publicRate,
      avgViews,
      filteredContents,
      editContent,
      viewContent,
      deleteContent,
      saveContent,
      closeModal,
      formatDate,
      formatNumber
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>