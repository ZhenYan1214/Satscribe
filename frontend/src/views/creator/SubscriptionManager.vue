<template>
  <div class="subscription-manager min-h-screen p-6 max-w-7xl mx-auto">
    <!-- 頁面標題 -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold text-gradient-web3 mb-2">NFT 訂閱管理中心</h1>
        <p class="text-white/70 text-lg">創建和管理您的季度訂閱 NFT，追蹤銷售表現</p>
      </div>
      <button 
        @click="showCreateModal = true" 
        class="btn-web3 px-6 py-3 rounded-xl flex items-center space-x-2 shadow-web3"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
        </svg>
        <span>創建當前季度 NFT</span>
      </button>
    </div>

    <!-- 當前季度信息卡片 -->
    <div class="card-web3 p-6 mb-8 bg-gradient-to-r from-web3-purple/20 to-web3-cyan/20">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-web3-purple/30 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-2xl font-bold text-white mb-1">{{ currentQuarterInfo.name }}</h3>
            <p class="text-web3-cyan">{{ currentQuarterInfo.timeRange }}</p>
            <p class="text-white/70 text-sm">到期日: {{ currentQuarterInfo.endDate }}</p>
          </div>
        </div>
        <div class="text-right">
          <div class="text-white/70 text-sm mb-1">固定發行量</div>
          <div class="text-3xl font-bold text-gradient-web3">9,999</div>
          <div class="text-web3-green text-sm">VIP 會員專屬</div>
        </div>
      </div>
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

    <!-- 創建 NFT 模態框 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div class="card-web3 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <!-- 模態框標題 -->
        <div class="flex justify-between items-center p-6 border-b border-white/10">
          <div>
            <h3 class="text-2xl font-bold text-gradient-web3">創建 {{ currentQuarterInfo.name }} NFT</h3>
            <p class="text-white/70 text-sm mt-1">時間範圍: {{ currentQuarterInfo.timeRange }} | 到期: {{ currentQuarterInfo.endDate }}</p>
          </div>
          <button @click="closeModal" class="text-white/60 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>

        <!-- 創建表單內容 - 左右分割布局 -->
        <div class="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
          <!-- 左側: 表單區域 -->
          <div class="lg:w-1/2 p-6 border-r border-white/10">
            <form @submit.prevent="saveSubscription" class="space-y-6 h-full flex flex-col">
              <div class="flex-1 space-y-6">
                <!-- 基本設定 -->
                <div class="space-y-4">
                  <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                    </svg>
                    NFT 基本設定
                  </h4>
                  
                  <!-- 價格 -->
                  <div>
                    <label class="block text-white font-medium mb-2">
                      NFT 價格 <span class="text-web3-cyan">(STX)</span>
                    </label>
                    <div class="relative">
                      <input 
                        v-model.number="nftForm.price"
                        type="number" 
                        step="0.1"
                        min="0.1"
                        required
                        class="w-full p-4 bg-glass-dark border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-web3-purple focus:outline-none text-lg"
                        placeholder="輸入 NFT 價格，例如: 2.5"
                      >
                      <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-web3-cyan font-medium">
                        STX
                      </div>
                    </div>
                    <p class="text-white/50 text-xs mt-1">建議價格範圍: 1-10 STX</p>
                  </div>

                  <!-- NFT 圖片上傳 -->
                  <div>
                    <label class="block text-white font-medium mb-2">
                      NFT 圖片 <span class="text-web3-accent">*</span>
                    </label>
                    
                    <!-- 圖片上傳區域 -->
                    <div 
                      @drop="handleDrop"
                      @dragover.prevent
                      @dragenter.prevent
                      class="relative border-2 border-dashed border-white/30 rounded-xl p-6 hover:border-web3-purple/60 transition-all duration-300"
                      :class="{
                        'border-web3-purple bg-web3-purple/5': isDragging,
                        'border-web3-green bg-web3-green/5': uploadStatus.success
                      }"
                    >
                      <!-- 上傳按鈕區域 -->
                      <div v-if="!nftForm.imagePreview" class="text-center">
                        <svg class="w-12 h-12 mx-auto mb-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p class="text-white mb-2">拖放圖片或點擊上傳</p>
                        <p class="text-white/50 text-sm mb-4">支持 JPG, PNG, GIF, WebP 格式，最大 10MB</p>
                        <button 
                          type="button"
                          @click="triggerFileInput"
                          class="btn-web3 px-6 py-2 rounded-xl text-sm"
                        >
                          選擇圖片
                        </button>
                      </div>
                      
                      <!-- 圖片預覽 -->
                      <div v-else class="relative">
                        <img 
                          :src="nftForm.imagePreview" 
                          alt="NFT 預覽"
                          class="w-full h-48 object-cover rounded-lg"
                        >
                        <div class="absolute top-2 right-2 flex space-x-2">
                          <button 
                            type="button"
                            @click="triggerFileInput"
                            class="bg-web3-purple/80 hover:bg-web3-purple text-white p-2 rounded-full transition-all"
                            title="更換圖片"
                          >
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                            </svg>
                          </button>
                          <button 
                            type="button"
                            @click="clearImage"
                            class="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full transition-all"
                            title="刪除圖片"
                          >
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <!-- 隐藏的文件輸入 -->
                      <input 
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        @change="handleFileSelect"
                        class="hidden"
                      >
                    </div>
                    
                    <!-- 上傳狀態 -->
                    <div class="mt-3">
                      <div v-if="uploadStatus.loading" class="flex items-center text-web3-cyan text-sm">
                        <div class="w-4 h-4 border-2 border-web3-cyan/30 border-t-web3-cyan rounded-full animate-spin mr-2"></div>
                        正在上傳圖片...
                      </div>
                      <div v-else-if="uploadStatus.error" class="text-red-400 text-sm">
                        ⚠️ {{ uploadStatus.error }}
                      </div>
                      <div v-else-if="uploadStatus.success" class="text-web3-green text-sm">
                        ✓ 圖片上傳成功！
                      </div>
                      <div v-if="uploadInfo" class="text-white/60 text-xs mt-1">
                        {{ uploadInfo.originalName }} - {{ formatFileSize(uploadInfo.size) }}
                      </div>
                    </div>
                  </div>

                  <!-- 季度描述 -->
                  <div>
                    <label class="block text-white font-medium mb-2">
                      季度描述 <span class="text-white/50">(可選)</span>
                    </label>
                    <textarea 
                      v-model="nftForm.description"
                      rows="4"
                      maxlength="200"
                      class="w-full p-4 bg-glass-dark border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-web3-purple focus:outline-none resize-none"
                      placeholder="描述本季度的特色內容和 VIP 會員專屬權益..."
                    ></textarea>
                    <div class="flex justify-between items-center mt-1">
                      <p class="text-white/50 text-xs">描述您的 VIP 會員可以獲得的專屬內容</p>
                      <span class="text-white/50 text-xs">{{ nftForm.description?.length || 0 }}/200</span>
                    </div>
                  </div>
                </div>

                <!-- 進階設定 -->
                <div class="bg-glass-dark rounded-xl p-4 border border-white/10">
                  <h4 class="text-white font-medium mb-3 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106.886-.54 2.042-.061 2.287.947.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
                    </svg>
                    收益分配
                  </h4>
                  <div class="flex items-center space-x-3">
                    <input
                      v-model="nftForm.enableRevenueSplit"
                      type="checkbox"
                      id="revenue-split-modal"
                      class="w-4 h-4 text-web3-purple rounded focus:ring-web3-purple"
                    />
                    <label for="revenue-split-modal" class="text-white text-sm">
                      啟用自動分潤（購買時自動分配收益給團隊成員）
                    </label>
                  </div>
                </div>
              </div>

              <!-- 按鈕組 -->
              <div class="flex space-x-4 pt-6 border-t border-white/10">
                <button 
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-6 py-3 text-white/70 bg-glass hover:bg-white/20 rounded-xl transition-all"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  :disabled="contractsStore.isLoading || !isFormValid"
                  class="flex-1 btn-web3 px-8 py-3 rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <svg v-if="contractsStore.isLoading" class="animate-spin w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ contractsStore.isLoading ? '創建中...' : '創建 NFT' }}</span>
                </button>
              </div>
            </form>
          </div>

          <!-- 右側: NFT 預覽區域 -->
          <div class="lg:w-1/2 p-6">
            <div class="h-full flex flex-col">
              <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                  <path fill-rule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                </svg>
                NFT 即時預覽
              </h4>
              
              <!-- NFT 卡片預覽 -->
              <div class="flex-1 flex items-center justify-center">
                <NFTPreviewCard 
                  :nft-data="previewData" 
                  :creator-info="creatorInfo"
                  :quarter-info="currentQuarterInfo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useContractsStore } from '@/stores/contracts'
import { useWalletStore } from '@/stores/wallet'
import NFTPreviewCard from '@/components/NFTPreviewCard.vue'

export default {
  name: 'SubscriptionManager',
  components: {
    NFTPreviewCard
  },
  setup() {
    const contractsStore = useContractsStore()
    const walletStore = useWalletStore()
    
    const subscriptions = ref([])
    const showCreateModal = ref(false)
    const filterStatus = ref('all')
    const sortBy = ref('seasonId')
    
    // 新的 NFT 創建表單
    const nftForm = ref({
      price: '',
      imageUri: '',
      imageFile: null,
      imagePreview: null,
      description: '',
      enableRevenueSplit: true
    })
    
    // 圖片上傳狀態
    const uploadStatus = ref({
      loading: false,
      success: false,
      error: null
    })
    
    const uploadInfo = ref(null)
    const isDragging = ref(false)
    const fileInput = ref(null)
    
    // 當前季度信息
    const currentQuarterInfo = computed(() => {
      const now = new Date()
      const month = now.getMonth() + 1
      const year = now.getFullYear()
      
      let quarter, timeRange, endDate
      
      if (month >= 1 && month <= 3) {
        quarter = 1
        timeRange = `${year}年 1月 - 3月`
        endDate = `${year}/3/31`
      } else if (month >= 4 && month <= 6) {
        quarter = 2
        timeRange = `${year}年 4月 - 6月`
        endDate = `${year}/6/30`
      } else if (month >= 7 && month <= 9) {
        quarter = 3
        timeRange = `${year}年 7月 - 9月`
        endDate = `${year}/9/30`
      } else {
        quarter = 4
        timeRange = `${year}年 10月 - 12月`
        endDate = `${year}/12/31`
      }
      
      return {
        quarter,
        name: `第 ${quarter} 季`,
        timeRange,
        endDate
      }
    })
    
    // 創作者信息
    const creatorInfo = computed(() => {
      return {
        name: '您的名稱', // 從钯包或創作者註冊信息取得
        avatar: '/default-avatar.png',
        verified: true
      }
    })
    
    // NFT 預覽數據
    const previewData = computed(() => {
      return {
        name: `${creatorInfo.value.name} - ${currentQuarterInfo.value.name} VIP 訂閱章`,
        description: nftForm.value.description || '購買此 NFT 成為 VIP 會員，解鎖專屬內容和權益',
        image: nftForm.value.imagePreview || nftForm.value.imageUri || '/placeholder-nft.png',
        price: nftForm.value.price || 0,
        tier: 'VIP',
        quarter: currentQuarterInfo.value.quarter,
        endDate: currentQuarterInfo.value.endDate,
        supply: '9999'
      }
    })
    
    // 表單驗證
    const isFormValid = computed(() => {
      return nftForm.value.price && 
             nftForm.value.price > 0 && 
             (nftForm.value.imageUri || nftForm.value.imagePreview) && 
             !uploadStatus.value.loading
    })
    
    // 統計數據
    const totalSold = computed(() => {
      return subscriptions.value.reduce((sum, s) => sum + (s.currentSupply || 0), 0)
    })
    
    const totalRevenue = computed(() => {
      return subscriptions.value.reduce((sum, s) => sum + ((s.currentSupply || 0) * (s.price || 0)), 0).toFixed(1)
    })
    
    const activeSubscriptions = computed(() => {
      return subscriptions.value.filter(s => s.active).length
    })

    const salesRate = computed(() => {
      const totalMax = subscriptions.value.length * 9999 // 每季固定 9999
      return totalMax > 0 ? Math.round((totalSold.value / totalMax) * 100) : 0
    })

    const avgDuration = computed(() => {
      // 簡化計算 - 只返回當前季度剩餘天數
      const now = new Date()
      const quarterEnd = new Date(currentQuarterInfo.value.endDate)
      const daysDiff = Math.ceil((quarterEnd - now) / (1000 * 60 * 60 * 24))
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
    
    // 文件上傳相關函數
    const triggerFileInput = () => {
      fileInput.value?.click()
    }
    
    const handleFileSelect = (event) => {
      const file = event.target.files?.[0]
      if (file) {
        processFile(file)
      }
    }
    
    const handleDrop = (event) => {
      event.preventDefault()
      isDragging.value = false
      
      const files = event.dataTransfer?.files
      if (files && files.length > 0) {
        processFile(files[0])
      }
    }
    
    const processFile = async (file) => {
      // 檢查文件類型
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        uploadStatus.value = {
          loading: false,
          success: false,
          error: '不支持的文件類型！請上傳 JPG, PNG, GIF 或 WebP 格式的圖片。'
        }
        return
      }
      
      // 檢查文件大小 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        uploadStatus.value = {
          loading: false,
          success: false,
          error: '文件過大！請上傳小於 10MB 的圖片。'
        }
        return
      }
      
      // 創建預覽
      const reader = new FileReader()
      reader.onload = (e) => {
        nftForm.value.imagePreview = e.target?.result
      }
      reader.readAsDataURL(file)
      
      // 上傳到後端
      await uploadImageToServer(file)
    }
    
    const uploadImageToServer = async (file) => {
      uploadStatus.value = { loading: true, success: false, error: null }
      
      try {
        const formData = new FormData()
        formData.append('image', file)
        
        const response = await fetch('http://localhost:3001/api/upload/image', {
          method: 'POST',
          body: formData
        })
        
        const result = await response.json()
        
        if (result.success) {
          nftForm.value.imageUri = result.data.imageUrl
          nftForm.value.imageFile = file
          uploadInfo.value = result.data
          uploadStatus.value = { loading: false, success: true, error: null }
        } else {
          throw new Error(result.error || '上傳失敗')
        }
      } catch (error) {
        console.error('圖片上傳失敗:', error)
        uploadStatus.value = {
          loading: false,
          success: false,
          error: '上傳失敗: ' + error.message
        }
      }
    }
    
    const clearImage = () => {
      nftForm.value.imagePreview = null
      nftForm.value.imageUri = ''
      nftForm.value.imageFile = null
      uploadInfo.value = null
      uploadStatus.value = { loading: false, success: false, error: null }
      
      // 清除 file input
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
    
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
    
    // 保存 NFT 函數
    const saveSubscription = async () => {
      if (!isFormValid.value) {
        alert('請檢查所有必填欄位')
        return
      }
      
      try {
        const nftData = {
          price: nftForm.value.price,
          imageUri: nftForm.value.imageUri,
          description: nftForm.value.description || `${currentQuarterInfo.value.name} VIP 訂閱章`,
          enableRevenueSplit: nftForm.value.enableRevenueSplit
        }
        
        console.log('創建當前季度 NFT:', nftData)
        
        // 調用新的自動季度函數
        await contractsStore.createSeasonAuto(nftData)
        
        alert(`✅ ${currentQuarterInfo.value.name} NFT 創建成功！`)
        
        // 重新載入數據
        setTimeout(async () => {
          await loadSubscriptions()
        }, 2000)
        
        closeModal()
      } catch (error) {
        console.error('創建 NFT 失敗:', error)
        alert('❌ 創建失敗: ' + error.message)
      }
    }
    
    // 關閉模態框
    const closeModal = () => {
      showCreateModal.value = false
      nftForm.value = {
        price: '',
        imageUri: '',
        imageFile: null,
        imagePreview: null,
        description: '',
        enableRevenueSplit: true
      }
      uploadStatus.value = {
        loading: false,
        success: false,
        error: null
      }
      uploadInfo.value = null
      
      // 清除 file input
      if (fileInput.value) {
        fileInput.value.value = ''
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
    
    // 載入訂閱數據
    const loadSubscriptions = async () => {
      if (!walletStore.isConnected || !walletStore.userAddress) {
        console.log('錢包未連接，無法載入季度數據')
        return
      }

      try {
        console.log('載入創作者的 NFT 季度數據...', walletStore.userAddress)
        const realSubscriptions = []
        
        // 載入當前年度的 4 個季度
        for (let quarter = 1; quarter <= 4; quarter++) {
          try {
            const seasonData = await contractsStore.getSeasonInfo(walletStore.userAddress, quarter)
            
            if (seasonData && seasonData.price !== undefined) {
              console.log(`第 ${quarter} 季 NFT 數據:`, seasonData)
              
              realSubscriptions.push({
                seasonId: quarter,
                price: seasonData.price || 0,
                maxSupply: 9999, // 固定發行量
                currentSupply: seasonData.current_supply || 0,
                expiryDate: seasonData.quarter_end_date || new Date(),
                tier: 'VIP', // 固定 VIP
                active: seasonData.active !== false,
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                description: seasonData.description || `第 ${quarter} 季 VIP 訂閱章`,
                imageUri: seasonData.image_uri || '',
                enableRevenueSplit: seasonData.revenue_split_enabled !== false
              })
            }
          } catch (seasonError) {
            console.log(`第 ${quarter} 季不存在:`, seasonError.message)
          }
        }
        
        subscriptions.value = realSubscriptions
        console.log(`成功載入 ${realSubscriptions.length} 個季度 NFT`)
        
      } catch (error) {
        console.error('載入 NFT 數據失敗:', error)
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
    
    // 拖放事件處理
    const handleDragEnter = () => {
      isDragging.value = true
    }
    
    const handleDragLeave = () => {
      isDragging.value = false
    }
    
    return {
      contractsStore,
      subscriptions,
      showCreateModal,
      nftForm,
      uploadStatus,
      uploadInfo,
      isDragging,
      fileInput,
      currentQuarterInfo,
      creatorInfo,
      previewData,
      isFormValid,
      filterStatus,
      sortBy,
      totalSold,
      totalRevenue,
      activeSubscriptions,
      salesRate,
      avgDuration,
      filteredSubscriptions,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      handleDragEnter,
      handleDragLeave,
      clearImage,
      formatFileSize,
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