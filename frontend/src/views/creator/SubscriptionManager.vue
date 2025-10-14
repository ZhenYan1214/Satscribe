<template>
  <div class="subscription-manager min-h-screen p-6 max-w-7xl mx-auto">
    <!-- 頁面標題和快速操作 -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold text-gradient-web3 mb-2">NFT 創作工作室</h1>
        <p class="text-white/70 text-lg">管理您的季度 NFT 收藏，追蹤表現並與粉絲互動</p>
      </div>
      <div class="flex items-center space-x-4">
        <!-- 排序篩選 -->
        <select 
          v-model="sortBy"
          class="bg-glass-dark border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:border-web3-purple focus:outline-none"
        >
          <option value="newest">最新創建</option>
          <option value="sales">銷售量</option>
          <option value="revenue">收益</option>
          <option value="quarter">季度</option>
        </select>
        
        <!-- 手動刷新按鈕 -->
        <button 
          @click="refreshNFTData" 
          :disabled="isLoading"
          class="bg-glass-dark border border-white/20 rounded-xl px-4 py-2 text-white text-sm hover:border-web3-cyan hover:text-web3-cyan transition-all flex items-center space-x-2 disabled:opacity-50"
          title="重新載入 NFT 數據"
        >
          <svg 
            class="w-4 h-4" 
            :class="{ 'animate-spin': isLoading }" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>刷新</span>
        </button>
        
        <!-- 調試按鈕 -->
        <button 
          @click="debugContractData" 
          class="bg-yellow-600/20 border border-yellow-500/30 rounded-xl px-4 py-2 text-yellow-400 text-sm hover:bg-yellow-600/30 transition-all flex items-center space-x-2"
          title="調試合約數據"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <span>調試</span>
        </button>
        
        <!-- 創建 NFT 按鈕 -->
        <button 
          @click="showCreateModal = true" 
          class="btn-web3 px-6 py-3 rounded-xl flex items-center space-x-2 shadow-web3 hover:scale-105 transition-all"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
          </svg>
          <span>創建 {{ currentQuarterInfo.name }} NFT</span>
        </button>
      </div>
    </div>

    <!-- 當前季度信息條 -->
    <div class="card-web3 p-4 mb-8 bg-gradient-to-r from-web3-purple/10 to-web3-cyan/10 border border-web3-purple/30">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-web3-purple/20 rounded-xl flex items-center justify-center">
            <span class="text-web3-purple font-bold text-lg">Q{{ currentQuarterInfo.quarter }}</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">{{ currentQuarterInfo.name }}</h3>
            <p class="text-web3-cyan text-sm">{{ currentQuarterInfo.timeRange }} • 到期: {{ currentQuarterInfo.endDate }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-6 text-sm">
          <div class="text-center">
            <div class="text-white/70">總季度</div>
            <div class="text-xl font-bold text-white">{{ subscriptions.length }}</div>
          </div>
          <div class="text-center">
            <div class="text-white/70">總銷售</div>
            <div class="text-xl font-bold text-web3-cyan">{{ totalSold }}</div>
          </div>
          <div class="text-center">
            <div class="text-white/70">總收益</div>
            <div class="text-xl font-bold text-web3-emerald">{{ totalRevenue }} STX</div>
          </div>
        </div>
      </div>
    </div>

    <!-- NFT 畫廊 -->
    <div class="nft-gallery">
      <!-- 空狀態 -->
      <div v-if="subscriptions.length === 0" class="text-center py-16">
        <div class="w-32 h-32 bg-glass-purple/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-16 h-16 text-web3-purple/70" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-white mb-3">開始您的 NFT 創作之旅</h3>
        <p class="text-white/70 mb-6 max-w-md mx-auto">
          創建您的第一個季度 NFT，與粉絲建立深度連結，開啟全新的創作者經濟模式
        </p>
        <button 
          @click="showCreateModal = true"
          class="btn-web3 px-8 py-3 rounded-xl text-lg"
        >
          創建首個 NFT
        </button>
      </div>

      <!-- NFT 卡片網格 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(nft, index) in sortedSubscriptions" 
          :key="nft.seasonId"
          class="nft-card group cursor-pointer"
          :style="`animation-delay: ${index * 100}ms`"
          @click="openNFTDetail(nft)"
        >
          <!-- NFT 主圖 -->
          <div class="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-web3-purple/20 to-web3-cyan/20">
            <!-- NFT 圖片 -->
            <img 
              v-if="getNFTImageUrl(nft)" 
              :src="getNFTImageUrl(nft)" 
              :alt="`${nft.quarterName || '第 ' + nft.seasonId + ' 季'} NFT`"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              @error="handleImageError(nft, $event)"
            />
            <!-- 改進的佔位符 -->
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-web3-purple/30 to-web3-cyan/30">
              <div class="text-center">
                <div class="w-20 h-20 bg-web3-purple/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-10 h-10 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v1.586l8.707 8.707a1 1 0 001.414 0L20.828 6.5a1 1 0 000-1.414L12.707.293a1 1 0 00-1.414 0L2.586 8.5A2 2 0 002 10v8a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <p class="text-sm text-white/80 font-medium">第 {{ nft.seasonId }} 季</p>
                <p class="text-xs text-white/60">VIP 會員章</p>
              </div>
            </div>
            
            <!-- 覆蓋層和標籤 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <!-- 季度標籤 -->
            <div class="absolute top-3 left-3 bg-web3-purple/90 backdrop-blur-sm rounded-full px-3 py-1">
              <span class="text-white text-sm font-bold">Q{{ nft.seasonId }}</span>
            </div>
            
            <!-- VIP 標籤 -->
            <div class="absolute top-3 right-3 bg-web3-gold/90 backdrop-blur-sm rounded-full px-3 py-1">
              <span class="text-white text-xs font-bold">{{ nft.tier }}</span>
            </div>
            
            <!-- 狀態標籤 -->
            <div 
              :class="[
                'absolute bottom-3 right-3 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold',
                nft.status === 'active' || nft.active 
                  ? 'bg-web3-green/90 text-white' 
                  : nft.status === 'upcoming'
                  ? 'bg-web3-yellow/90 text-white'
                  : 'bg-web3-rose/90 text-white'
              ]"
            >
              {{ nft.status === 'active' || nft.active ? '🟢 活躍中' : 
                 nft.status === 'upcoming' ? '🟡 即將開始' : '🔴 已結束' }}
            </div>
            
            <!-- Hover 快速操作 -->
            <div class="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                @click.stop="editNFT(nft)"
                class="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-white/30 transition-colors mr-2"
                title="編輯"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                </svg>
              </button>
              <button 
                @click.stop="toggleNFTStatus(nft)"
                class="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-white/30 transition-colors"
                :title="nft.active ? '暫停銷售' : '恢復銷售'"
              >
                <svg v-if="nft.active" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- NFT 信息 -->
          <div class="px-2">
            <!-- 標題和描述 -->
            <div class="mb-3">
              <h3 class="text-xl font-bold text-white mb-1 line-clamp-1">
                {{ getNFTDisplayName(nft) }}
              </h3>
              <p class="text-white/70 text-sm line-clamp-2">
                {{ nft.description || `第 ${nft.seasonId} 季 VIP 訂閱章 - 解鎖專屬內容和特殊權益` }}
              </p>
            </div>
            
            <!-- 關鍵數據 -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <!-- 價格 -->
              <div class="text-center p-3 bg-glass-dark rounded-xl">
                <div class="text-white/60 text-xs mb-1">價格</div>
                <div class="text-lg font-bold text-web3-gold">
                  {{ getFormattedPrice(nft) }}
                </div>
              </div>
              
              <!-- 銷售量 -->
              <div class="text-center p-3 bg-glass-dark rounded-xl">
                <div class="text-white/60 text-xs mb-1">銷售</div>
                <div class="text-lg font-bold text-web3-cyan">
                  {{ getSafeSupply(nft, 'current') }}/{{ getSafeSupply(nft, 'max') }}
                </div>
              </div>
            </div>
            
            <!-- 底部統計 -->
            <div class="flex justify-between items-center pt-3 border-t border-white/10">
              <div class="flex items-center space-x-4 text-sm">
                <div class="flex items-center text-white/60">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>{{ getSafeSupply(nft, 'current') }} 持有者</span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-web3-emerald font-bold text-sm">
                  {{ formatRevenue(getNFTRevenue(nft)) }} STX
                </div>
                <div class="text-white/50 text-xs">總收益</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 創建 NFT 模態框 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
        
        <div class="p-6">
          <div class="grid lg:grid-cols-2 gap-8">
            <!-- 左側：表單 -->
            <div class="space-y-6">
              <!-- NFT 基本信息 -->
              <div>
                <h4 class="text-lg font-bold text-white mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v1.586l8.707 8.707a1 1 0 001.414 0L20.828 6.5a1 1 0 000-1.414L12.707.293a1 1 0 00-1.414 0L2.586 8.5A2 2 0 002 10v8a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/>
                  </svg>
                  NFT 設計
                </h4>
                
                <!-- 價格設定 -->
                <div class="mb-4">
                  <label class="block text-white font-medium mb-2">
                    NFT 價格 (STX) <span class="text-red-400">*</span>
                  </label>
                  <input 
                    v-model="nftForm.price"
                    type="number"
                    step="0.1"
                    min="0.1"
                    class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-web3-purple focus:outline-none"
                    placeholder="2.0"
                    required
                  />
                  <p class="text-white/50 text-xs mt-1">設定粉絲購買此 NFT 的價格（建議 1-10 STX）</p>
                </div>

                <!-- 圖片上傳 -->
                <div>
                  <label class="block text-white font-medium mb-2">
                    NFT 圖片 <span class="text-red-400">*</span>
                  </label>
                  
                  <div class="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-web3-purple/50 transition-colors">
                    <!-- 圖片預覽 -->
                    <div v-if="nftForm.imagePreview" class="mb-4">
                      <img 
                        :src="nftForm.imagePreview" 
                        alt="NFT 預覽"
                        class="w-full max-w-sm mx-auto rounded-xl object-cover aspect-square"
                      />
                      <button 
                        @click="removeImage"
                        class="mt-2 text-red-400 hover:text-red-300 text-sm flex items-center justify-center mx-auto"
                      >
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                        移除圖片
                      </button>
                    </div>
                    
                    <!-- 上傳區域 -->
                    <div v-else>
                      <svg class="w-12 h-12 text-white/50 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v1.586l8.707 8.707a1 1 0 001.414 0L20.828 6.5a1 1 0 000-1.414L12.707.293a1 1 0 00-1.414 0L2.586 8.5A2 2 0 002 10v8a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/>
                      </svg>
                      <p class="text-white/70 mb-2">拖拽圖片到此處或點擊選擇</p>
                      <p class="text-white/50 text-sm mb-4">支援 JPG、PNG、GIF，最大 10MB</p>
                      <button 
                        @click="triggerFileUpload"
                        type="button"
                        class="btn-glass px-6 py-2 rounded-lg"
                      >
                        選擇圖片
                      </button>
                      
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
              </div>

              <!-- 分潤設定 -->
              <div>
                <h4 class="text-lg font-bold text-white mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-web3-emerald" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                  </svg>
                  收益分潤
                </h4>
                
                <div class="flex items-center space-x-3 p-4 bg-glass-dark rounded-xl">
                  <input
                    v-model="nftForm.enableRevenueSplit"
                    type="checkbox"
                    id="revenue-split"
                    class="w-5 h-5 text-web3-purple"
                  />
                  <label for="revenue-split" class="text-white flex-1">
                    啟用自動分潤（購買時自動分配給團隊成員）
                  </label>
                  <span v-if="nftForm.enableRevenueSplit" class="text-web3-green text-sm">✓ 已啟用</span>
                </div>
              </div>

              <!-- 操作按鈕 -->
              <div class="flex space-x-4 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="btn-glass flex-1 py-3 rounded-xl"
                >
                  取消
                </button>
                <button
                  @click="createNFT"
                  :disabled="!isFormValid || contractsStore.isLoading"
                  class="btn-web3 flex-1 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="contractsStore.isLoading">創建中...</span>
                  <span v-else>創建 NFT</span>
                </button>
              </div>
            </div>

            <!-- 右側：即時預覽 -->
            <div class="lg:sticky lg:top-6">
              <h4 class="text-lg font-bold text-white mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                </svg>
                即時預覽
              </h4>
              
              <!-- NFT 預覽卡片 -->
              <NFTPreviewCard 
                :nft-data="previewNFTData"
                :creator-info="creatorInfo"
                :quarter-info="currentQuarterInfo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 錯誤提示 -->
    <div v-if="contractsStore.error" class="fixed bottom-6 right-6 max-w-md">
      <div class="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <div>
            <h4 class="text-red-400 font-medium">操作失敗</h4>
            <p class="text-red-300 text-sm mt-1">{{ contractsStore.error }}</p>
          </div>
          <button 
            @click="contractsStore.error = null"
            class="text-red-400 hover:text-red-300"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import { useContractsStore } from '@/stores/contracts'
import NFTPreviewCard from '@/components/NFTPreviewCard.vue'

export default {
  name: 'SubscriptionManager',
  components: {
    NFTPreviewCard
  },
  setup() {
    const router = useRouter()
    const walletStore = useWalletStore()
    const contractsStore = useContractsStore()
    
    // 響應式數據
    const subscriptions = ref([])
    const showCreateModal = ref(false)
    const sortBy = ref('newest')
    const isLoading = ref(false)
    
    // NFT 表單數據
    const nftForm = ref({
      price: 2.0,
      imageUri: '',
      imagePreview: '',
      description: '',
      enableRevenueSplit: true
    })
    
    // 文件上傳相關
    const fileInput = ref(null)
    const uploadStatus = ref({
      loading: false,
      success: false,
      error: null
    })
    const uploadInfo = ref(null)
    
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
        name: '您',
        avatar: '/default-avatar.png',
        verified: true
      }
    })
    
    // 預覽用的 NFT 數據
    const previewNFTData = computed(() => {
      return {
        name: `${currentQuarterInfo.value.name} VIP 會員章`,
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
      return nftForm.value.price > 0 && 
             (nftForm.value.imageUri || nftForm.value.imagePreview)
    })
    
    // 統計數據
    const totalSold = computed(() => {
      return subscriptions.value.reduce((sum, nft) => sum + (nft.currentSupply || 0), 0)
    })
    
    const totalRevenue = computed(() => {
      return subscriptions.value.reduce((sum, nft) => 
        sum + ((nft.price || 0) * (nft.currentSupply || 0)), 0
      ).toFixed(2)
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
      
      // 可以在這裡添加篩選邏輯
      
      return filtered
    })
    
    const sortedSubscriptions = computed(() => {
      const sorted = [...filteredSubscriptions.value]
      
      switch (sortBy.value) {
        case 'sales':
          return sorted.sort((a, b) => (b.currentSupply || 0) - (a.currentSupply || 0))
        case 'revenue':
          return sorted.sort((a, b) => 
            ((b.price || 0) * (b.currentSupply || 0)) - ((a.price || 0) * (a.currentSupply || 0))
          )
        case 'quarter':
          return sorted.sort((a, b) => (b.seasonId || 0) - (a.seasonId || 0))
        case 'newest':
        default:
          return sorted.sort((a, b) => (b.seasonId || 0) - (a.seasonId || 0))
      }
    })
    
    // 方法
    const loadSubscriptions = async () => {
      if (!walletStore.isConnected || !walletStore.userAddress) {
        console.log('❌ 錢包未連接，無法載入NFT數據')
        return
      }

      try {
        isLoading.value = true
        console.log('🔄 開始載入創作者 NFT 季度資料...')
        console.log('📍 用戶地址:', walletStore.userAddress)
        
        // 使用新的優化數據結構載入創作者的所有 NFT 季度
        const creatorSeasons = await contractsStore.getCreatorNFTSeasons(walletStore.userAddress, true)
        console.log('📊 從合約獲取的季度數據:', creatorSeasons)
        
        if (creatorSeasons && Array.isArray(creatorSeasons) && creatorSeasons.length > 0) {
          console.log('✅ 找到', creatorSeasons.length, '個季度')
          
          // 轉換為舊格式以保持UI兼容性
          const convertedSubscriptions = creatorSeasons.map((season, index) => {
            console.log(`🔄 轉換季度 ${index + 1}:`, season)
            
            return {
              seasonId: season.seasonId,
              price: season.pricing?.price || 0,
              priceSTX: season.pricing?.priceSTX || '0 STX',
              maxSupply: season.pricing?.maxSupply || 9999,
              currentSupply: season.pricing?.currentSupply || 0,
              expiryDate: season.quarter?.endDate ? new Date(season.quarter.endDate) : new Date(),
              tier: season.metadata?.tier || 'VIP',
              active: season.status?.isActive || true,
              quarter: season.quarter?.quarter || 4,
              year: season.quarter?.year || 2025,
              quarterName: season.quarter?.displayName || `第 ${season.seasonId} 季`,
              image: season.media?.imageUri || '',
              description: season.metadata?.description || '',
              status: season.status?.displayStatus || 'active',
              hasImage: season.media?.hasImage || false,
              metadata: season.metadata,
              pricing: season.pricing,
              _optimized: season // 保留完整的優化數據
            }
          })
          
          subscriptions.value = convertedSubscriptions
          console.log('✅ NFT數據載入完成，共', convertedSubscriptions.length, '個NFT')
          console.log('📋 最終的訂閱數據:', subscriptions.value)
          
          // 顯示每個NFT的關鍵信息
          convertedSubscriptions.forEach((nft, index) => {
            console.log(`NFT ${index + 1}:`, {
              seasonId: nft.seasonId,
              price: nft.priceSTX,
              supply: `${nft.currentSupply}/${nft.maxSupply}`,
              status: nft.status,
              hasImage: nft.hasImage
            })
          })
          
        } else {
          console.log('⚠️ 未找到任何季度數據')
          subscriptions.value = []
        }
        
      } catch (error) {
        console.error('❌ 載入訂閱失敗:', error)
        subscriptions.value = []
      } finally {
        isLoading.value = false
        console.log('🏁 載入過程結束，最終狀態:', {
          載入中: isLoading.value,
          NFT數量: subscriptions.value.length,
          會顯示空狀態: subscriptions.value.length === 0
        })
      }
    }
    
    // 手動刷新 NFT 數據
    const refreshNFTData = async () => {
      console.log('🔄 手動刷新 NFT 數據...')
      console.log('💡 當前用戶地址:', walletStore.userAddress)
      
      if (!walletStore.isConnected || !walletStore.userAddress) {
        console.log('❌ 錢包未連接，無法刷新數據')
        return
      }
      
      try {
        // 直接測試季度20254是否存在
        console.log('🔍 直接測試季度20254是否存在...')
        try {
          const season20254 = await contractsStore.getSeasonInfo(walletStore.userAddress, 20254, true)
          console.log('✅ 季度20254查詢結果:', season20254)
        } catch (testError) {
          console.log('❌ 季度20254查詢失敗:', testError)
        }
        
        // 測試其他可能的季度ID
        const testSeasonIds = [1, 2, 3, 4, 5, 20241, 20242, 20243, 20244, 20251, 20252, 20253, 20254]
        console.log('🔍 測試所有可能的季度ID...')
        for (const seasonId of testSeasonIds) {
          try {
            const seasonInfo = await contractsStore.getSeasonInfo(walletStore.userAddress, seasonId, true)
            if (seasonInfo) {
              console.log(`✅ 找到季度 ${seasonId}:`, seasonInfo)
            }
          } catch (err) {
            // 靜默處理，只記錄找到的
          }
        }
        
        // 清除相關緩存
        console.log('🧹 清除緩存...')
        contractsStore.clearCache('season', walletStore.userAddress)
        contractsStore.clearCache('creator', walletStore.userAddress)
        
        // 重新載入數據
        console.log('📥 重新載入 NFT 數據...')
        await loadSubscriptions()
        
        console.log('✅ NFT 數據刷新完成')
      } catch (error) {
        console.error('❌ 刷新 NFT 數據失敗:', error)
      }
    }
    
    const triggerFileUpload = () => {
      fileInput.value?.click()
    }
    
    const handleFileSelect = async (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      // 檢查文件類型
      if (!file.type.startsWith('image/')) {
        uploadStatus.value.error = '請選擇圖片文件'
        return
      }
      
      // 檢查文件大小（10MB）
      if (file.size > 10 * 1024 * 1024) {
        uploadStatus.value.error = '圖片大小不能超過 10MB'
        return
      }
      
      uploadStatus.value = { loading: true, success: false, error: null }
      
      try {
        // 創建預覽
        const reader = new FileReader()
        reader.onload = (e) => {
          nftForm.value.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
        
        // 上傳到後端
        const formData = new FormData()
        formData.append('image', file)
        
        const response = await fetch('http://localhost:3001/api/upload/image', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('上傳失敗')
        }
        
        const result = await response.json()
        
        if (result.success && result.data) {
          nftForm.value.imageUri = result.data.imageUrl
          uploadInfo.value = {
            originalName: result.data.originalName,
            size: result.data.size,
            width: result.data.width,
            height: result.data.height,
            format: result.data.format
          }
        } else {
          throw new Error(result.message || '上傳失敗')
        }
        
        uploadStatus.value = { loading: false, success: true, error: null }
        
      } catch (error) {
        console.error('圖片上傳失敗:', error)
        let errorMessage = '上傳失敗，請重試'
        
        if (error.message.includes('Failed to fetch')) {
          errorMessage = '無法連接到後端服務，請確認後端已啟動 (localhost:3001)'
        } else if (error.message.includes('NetworkError')) {
          errorMessage = '網絡錯誤，請檢查連接'
        } else if (error.message !== '上傳失敗') {
          errorMessage = error.message
        }
        
        uploadStatus.value = { loading: false, success: false, error: errorMessage }
      }
    }
    
    const removeImage = () => {
      nftForm.value.imageUri = ''
      nftForm.value.imagePreview = ''
      uploadInfo.value = null
      uploadStatus.value = { loading: false, success: false, error: null }
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
    
    const createNFT = async () => {
      if (!isFormValid.value) {
        alert('請填寫所有必填項目')
        return
      }

      try {
        const nftData = {
          price: nftForm.value.price,
          imageUri: nftForm.value.imageUri || nftForm.value.imagePreview,
          description: nftForm.value.description,
          enableRevenueSplit: nftForm.value.enableRevenueSplit
        }

        console.log('創建 NFT 數據:', nftData)
        
        // 先檢查當前季度
        try {
          const currentQuarter = await contractsStore.getCurrentQuarter()
          console.log('當前季度查詢結果:', currentQuarter)
          
          // 檢查是否已經有這個季度的 season
          const existingSeasonResult = await contractsStore.getSeasonInfo(walletStore.userAddress, currentQuarter || 4)
          console.log('現有季度資料:', existingSeasonResult)
          
        } catch (quarterError) {
          console.log('季度查詢失敗:', quarterError)
        }
        
        // 嘗試使用 create-season-auto
        try {
          await contractsStore.createSeasonAuto({
            price: nftData.price * 1000000,
            imageUri: nftData.imageUri,
            description: nftData.description,
            enableRevenueSplit: nftData.enableRevenueSplit
          })
          console.log('create-season-auto 成功')
        } catch (autoError) {
          console.log('create-season-auto 失敗，嘗試舊版方法:', autoError)
          
          // 回退到舊版方法
          const seasonData = {
            seasonId: 5, // 使用Q1 2025 避免衝突
            price: nftData.price * 1000000,
            maxSupply: 9999,
            expiryDate: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60), // 90天後
            tier: 'VIP',
            enableRevenueSplit: nftData.enableRevenueSplit
          }
          await contractsStore.createSeason(seasonData)
        }
        
        // 成功後清除緩存並重新載入數據
        await refreshNFTData()
        closeModal()
        
      } catch (error) {
        console.error('創建 NFT 失敗:', error)
      }
    }
    
    const closeModal = () => {
      showCreateModal.value = false
      // 重置表單
      nftForm.value = {
        price: 2.0,
        imageUri: '',
        imagePreview: '',
        description: '',
        enableRevenueSplit: true
      }
      removeImage()
    }
    
    const openNFTDetail = (nft) => {
      console.log('開啟 NFT 詳情:', nft)
      
      // 創建詳細信息模態框
      const detailsHtml = `
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onclick="this.remove()">
          <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
            <div class="p-6">
              <!-- 標題 -->
              <div class="flex justify-between items-start mb-6">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-2">${getNFTDisplayName(nft)}</h2>
                  <p class="text-gray-400">季度 ID: ${nft.seasonId}</p>
                </div>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white transition-colors">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>

              <!-- NFT 圖片 -->
              <div class="aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                ${getNFTImageUrl(nft) ? 
                  `<img src="${getNFTImageUrl(nft)}" alt="NFT" class="w-full h-full object-cover">` :
                  `<div class="w-full h-full flex items-center justify-center">
                    <div class="text-center">
                      <div class="w-24 h-24 bg-purple-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg class="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v1.586l8.707 8.707a1 1 0 001.414 0L20.828 6.5a1 1 0 000-1.414L12.707.293a1 1 0 00-1.414 0L2.586 8.5A2 2 0 002 10v8a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <p class="text-white/80 font-medium">第 ${nft.seasonId} 季</p>
                      <p class="text-white/60">VIP 會員章</p>
                    </div>
                  </div>`
                }
              </div>

              <!-- 基本信息網格 -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-800 rounded-xl p-4">
                  <div class="text-gray-400 text-sm mb-1">價格</div>
                  <div class="text-2xl font-bold text-yellow-400">${getFormattedPrice(nft)}</div>
                </div>
                <div class="bg-gray-800 rounded-xl p-4">
                  <div class="text-gray-400 text-sm mb-1">銷售量</div>
                  <div class="text-2xl font-bold text-cyan-400">${getSafeSupply(nft, 'current')}/${getSafeSupply(nft, 'max')}</div>
                </div>
                <div class="bg-gray-800 rounded-xl p-4">
                  <div class="text-gray-400 text-sm mb-1">狀態</div>
                  <div class="text-lg font-bold ${nft.status === 'active' || nft.active ? 'text-green-400' : 'text-red-400'}">
                    ${nft.status === 'active' || nft.active ? '🟢 活躍中' : '🔴 已結束'}
                  </div>
                </div>
                <div class="bg-gray-800 rounded-xl p-4">
                  <div class="text-gray-400 text-sm mb-1">總收益</div>
                  <div class="text-lg font-bold text-green-400">${formatRevenue(getNFTRevenue(nft))} STX</div>
                </div>
              </div>

              <!-- 描述 -->
              <div class="bg-gray-800 rounded-xl p-4 mb-6">
                <div class="text-gray-400 text-sm mb-2">描述</div>
                <div class="text-white">${nft.description || nft.metadata?.description || `第 ${nft.seasonId} 季 VIP 訂閱章 - 解鎖專屬內容和特殊權益`}</div>
              </div>

              <!-- 技術信息 -->
              <div class="bg-gray-800 rounded-xl p-4">
                <div class="text-gray-400 text-sm mb-2">技術信息</div>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-400">合約地址:</span>
                    <span class="text-gray-300 font-mono">ST2FGW...301HQ</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">創建時間:</span>
                    <span class="text-gray-300">${nft.timestamps?.created ? new Date(nft.timestamps.created * 1000).toLocaleString() : '未知'}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">分潤啟用:</span>
                    <span class="text-gray-300">${nft.metadata?.enableRevenueSplit ? '✅ 是' : '❌ 否'}</span>
                  </div>
                </div>
              </div>

              <!-- 操作按鈕 -->
              <div class="flex gap-4 mt-6">
                <button onclick="alert('編輯功能開發中...')" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition-colors">
                  編輯 NFT
                </button>
                <button onclick="alert('管理功能開發中...')" class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-colors">
                  管理銷售
                </button>
              </div>
            </div>
          </div>
        </div>
      `
      
      // 添加到頁面
      document.body.insertAdjacentHTML('beforeend', detailsHtml)
    }
    
    const editNFT = (nft) => {
      // 編輯 NFT 功能
      console.log('編輯 NFT:', nft)
    }
    
    const toggleNFTStatus = async (nft) => {
      try {
        // 調用合約切換狀態
        console.log('切換 NFT 狀態:', nft)
        // await contractsStore.toggleSeasonStatus(nft.seasonId)
        await loadSubscriptions()
      } catch (error) {
        console.error('切換狀態失敗:', error)
      }
    }
    
    const handleImageError = (nft, event) => {
      console.log('圖片載入失敗:', nft.seasonId)
      event.target.style.display = 'none'
    }
    
    const getNFTDisplayName = (nft) => {
      if (nft.quarterName) {
        return `${nft.quarterName} VIP 會員章`
      }
      if (nft.description && nft.description.length > 0) {
        return `第 ${nft.seasonId} 季 - ${nft.description.slice(0, 20)}${nft.description.length > 20 ? '...' : ''}`
      }
      return `第 ${nft.seasonId} 季 VIP 會員章`
    }
    
    const getNFTImageUrl = (nft) => {
      // 嘗試多種可能的圖片字段
      const possibleImages = [
        nft.image,
        nft.imageUri,
        nft.media?.imageUri,
        nft._optimized?.media?.imageUri
      ]
      
      for (const img of possibleImages) {
        if (img && img !== '') {
          return img
        }
      }
      
      return null
    }
    
    const formatPrice = (price) => {
      return parseFloat(price || 0).toFixed(1)
    }
    
    const getFormattedPrice = (nft) => {
      // 嘗試多種可能的價格字段
      if (nft.priceSTX) {
        return `${nft.priceSTX} STX`
      }
      
      if (nft.pricing?.priceSTX) {
        return `${nft.pricing.priceSTX} STX`
      }
      
      // 直接從price字段計算
      const price = nft.price || nft.pricing?.price || 0
      if (price > 0) {
        return `${formatPrice(price / 1000000)} STX`
      }
      
      return '0 STX'
    }
    
    const getSafeSupply = (nft, type) => {
      if (type === 'current') {
        return nft.currentSupply || nft.pricing?.currentSupply || 0
      } else if (type === 'max') {
        return nft.maxSupply || nft.pricing?.maxSupply || 9999
      }
      return 0
    }
    
    const getNFTRevenue = (nft) => {
      const price = nft.price || nft.pricing?.price || 0
      const currentSupply = getSafeSupply(nft, 'current')
      return (price * currentSupply) / 1000000 // 轉換為 STX
    }
    
    const formatRevenue = (revenue) => {
      return parseFloat(revenue || 0).toFixed(1)
    }
    
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    // 調試合約數據
    const debugContractData = async () => {
      if (!walletStore.userAddress) {
        alert('請先連接錢包')
        return
      }
      
      console.log('🔧 開始調試合約數據...')
      console.log('📍 創作者地址:', walletStore.userAddress)
      
      try {
        // 直接測試季度20254
        console.log('1. 測試季度20254...')
        const result = await contractsStore.debugSeasonData(walletStore.userAddress, 20254)
        console.log('調試結果:', result)
        
        // 手動觸發數據刷新
        console.log('2. 手動刷新數據...')
        await refreshNFTData()
        
        // 顯示當前狀態
        console.log('3. 當前狀態總結:')
        console.log('   - NFT數量:', subscriptions.value.length)
        console.log('   - 會顯示空狀態嗎?', subscriptions.value.length === 0)
        console.log('   - 訂閱數據:', subscriptions.value)
        
        alert(`調試完成！
NFT數量: ${subscriptions.value.length}
會顯示空狀態: ${subscriptions.value.length === 0 ? '是' : '否'}
詳細信息請查看控制台`)
        
      } catch (error) {
        console.error('調試失敗:', error)
        alert('調試失敗: ' + error.message)
      }
    }
    
    // 監聽錢包連接狀態變化
    watch(
      () => walletStore.userAddress,
      async (newAddress, oldAddress) => {
        if (newAddress && newAddress !== oldAddress) {
          console.log('錢包地址變化，重新載入 NFT 數據:', newAddress)
          await loadSubscriptions()
        }
      },
      { immediate: false }
    )
    
    // 生命週期
    onMounted(async () => {
      console.log('🚀 SubscriptionManager 組件載入中...')
      await walletStore.initUserSession()
      
      if (walletStore.isConnected) {
        console.log('✅ 錢包已連接，用戶地址:', walletStore.userAddress)
        await loadSubscriptions()
      } else {
        console.log('⚠️ 錢包未連接')
      }
    })
    
    return {
      // 響應式數據
      subscriptions,
      showCreateModal,
      sortBy,
      isLoading,
      nftForm,
      fileInput,
      uploadStatus,
      uploadInfo,
      
      // 計算屬性
      currentQuarterInfo,
      creatorInfo,
      previewNFTData,
      isFormValid,
      totalSold,
      totalRevenue,
      avgDuration,
      sortedSubscriptions,
      
      // 方法
      loadSubscriptions,
      refreshNFTData,
      debugContractData,
      triggerFileUpload,
      handleFileSelect,
      removeImage,
      createNFT,
      closeModal,
      openNFTDetail,
      editNFT,
      toggleNFTStatus,
      handleImageError,
      getNFTDisplayName,
      getNFTImageUrl,
      formatPrice,
      getFormattedPrice,
      getSafeSupply,
      getNFTRevenue,
      formatRevenue,
      formatFileSize,
      
      // Store
      contractsStore,
      walletStore
    }
  }
}
</script>

<style scoped>
/* NFT 卡片動畫 */
.nft-card {
  animation: fadeInUp 0.6s ease-out both;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nft-card:hover {
  transform: translateY(-8px) scale(1.02);
  filter: drop-shadow(0 20px 40px rgba(102, 126, 234, 0.3));
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 行限制 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 滾動條樣式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.7);
}

/* 響應式網格優化 */
@media (max-width: 768px) {
  .nft-gallery .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .nft-gallery .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>