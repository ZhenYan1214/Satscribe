<template>
  <div class="my-collections min-h-screen p-6 max-w-7xl mx-auto">
    <!-- 頁面標題 -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold text-gradient-web3 mb-2">我的數位收藏館</h1>
        <p class="text-white/70 text-lg">珍藏您的支持記錄，每一枚 NFT 都見證了您對創作者的支持</p>
      </div>
      <div class="flex items-center space-x-4">
        <!-- 視圖切換 -->
        <div class="flex items-center bg-glass-dark rounded-xl p-1">
          <button 
            @click="viewMode = 'gallery'"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              viewMode === 'gallery' 
                ? 'bg-web3-purple text-white' 
                : 'text-white/60 hover:text-white'
            ]"
          >
            <svg class="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v1.586l8.707 8.707a1 1 0 001.414 0L20.828 6.5a1 1 0 000-1.414L12.707.293a1 1 0 00-1.414 0L2.586 8.5A2 2 0 002 10v8a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/>
            </svg>
            畫廊模式
          </button>
          <button 
            @click="viewMode = 'timeline'"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              viewMode === 'timeline' 
                ? 'bg-web3-purple text-white' 
                : 'text-white/60 hover:text-white'
            ]"
          >
            <svg class="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
            時間軸
          </button>
        </div>
        
        <!-- 篩選排序 -->
        <select 
          v-model="sortBy"
          class="bg-glass-dark border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:border-web3-purple focus:outline-none"
        >
          <option value="newest">最新收藏</option>
          <option value="oldest">最早收藏</option>
          <option value="creator">創作者</option>
          <option value="value">價值</option>
        </select>
      </div>
    </div>

    <!-- 收藏統計儀表板 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <!-- 總收藏數 -->
      <div class="card-web3 p-6 hover:scale-105 transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white/70 text-sm mb-1">總收藏</p>
            <p class="text-3xl font-bold text-white">{{ collections.length }}</p>
          </div>
          <div class="w-12 h-12 bg-web3-purple/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center text-sm">
          <span class="text-web3-green">+{{ recentCollections }}</span>
          <span class="text-white/50 ml-1">本月新增</span>
        </div>
      </div>

      <!-- 支持的創作者 -->
      <div class="card-web3 p-6 hover:scale-105 transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white/70 text-sm mb-1">支持創作者</p>
            <p class="text-3xl font-bold text-white">{{ uniqueCreators }}</p>
          </div>
          <div class="w-12 h-12 bg-web3-cyan/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center text-sm">
          <span class="text-white/50">跨越 </span>
          <span class="text-web3-cyan ml-1">{{ uniqueQuarters }} 個季度</span>
        </div>
      </div>

      <!-- 總支出 -->
      <div class="card-web3 p-6 hover:scale-105 transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white/70 text-sm mb-1">總支出</p>
            <p class="text-3xl font-bold text-white">{{ totalSpent }}</p>
            <p class="text-sm text-web3-gold">STX</p>
          </div>
          <div class="w-12 h-12 bg-web3-emerald/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-emerald" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center text-sm">
          <span class="text-web3-emerald">≈ ${{ (totalSpent * 0.5).toFixed(2) }}</span>
          <span class="text-white/50 ml-1">USD</span>
        </div>
      </div>

      <!-- 收藏價值 -->
      <div class="card-web3 p-6 hover:scale-105 transition-transform">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white/70 text-sm mb-1">收藏成就</p>
            <p class="text-3xl font-bold text-white">{{ achievementScore }}</p>
          </div>
          <div class="w-12 h-12 bg-web3-gold/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center text-sm">
          <span class="text-web3-gold">{{ nextAchievement }}</span>
        </div>
      </div>
    </div>

    <!-- 收藏展示區 -->
    <div class="collections-display">
      <!-- 空狀態 -->
      <div v-if="collections.length === 0" class="text-center py-20">
        <div class="w-32 h-32 bg-glass-purple/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-16 h-16 text-web3-purple/70" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-white mb-3">開始您的收藏之旅</h3>
        <p class="text-white/70 mb-6 max-w-md mx-auto">
          購買您喜愛創作者的 NFT，建立珍貴的數位收藏，每一枚都是您支持的見證
        </p>
        <button 
          @click="$router.push('/explore')"
          class="btn-web3 px-8 py-3 rounded-xl text-lg"
        >
          探索創作者
        </button>
      </div>

      <!-- 畫廊模式 -->
      <div v-else-if="viewMode === 'gallery'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="(nft, index) in sortedCollections" 
          :key="`${nft.creator}-${nft.seasonId}`"
          class="collection-card group cursor-pointer"
          :style="`animation-delay: ${index * 100}ms`"
          @click="openNFTDetail(nft)"
        >
          <!-- NFT 圖片 -->
          <div class="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-web3-purple/20 to-web3-cyan/20">
            <img 
              v-if="nft.imageUri && nft.imageUri !== ''" 
              :src="nft.imageUri" 
              :alt="nft.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              @error="handleImageError"
            />
            <!-- 佔位符 -->
            <div v-else class="w-full h-full flex items-center justify-center text-white/50">
              <div class="text-center">
                <svg class="w-16 h-16 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v1.586l8.707 8.707a1 1 0 001.414 0L20.828 6.5a1 1 0 000-1.414L12.707.293a1 1 0 00-1.414 0L2.586 8.5A2 2 0 002 10v8a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/>
                </svg>
                <p class="text-sm">收藏品</p>
              </div>
            </div>
            
            <!-- 疊加層和標籤 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <!-- 季度標籤 -->
            <div class="absolute top-3 left-3 bg-web3-purple/90 backdrop-blur-sm rounded-full px-3 py-1">
              <span class="text-white text-sm font-bold">Q{{ nft.seasonId }}</span>
            </div>
            
            <!-- 稀有度標籤 -->
            <div v-if="nft.rarity" class="absolute top-3 right-3 bg-web3-gold/90 backdrop-blur-sm rounded-full px-3 py-1">
              <span class="text-white text-xs font-bold">{{ nft.rarity }}</span>
            </div>
            
            <!-- 支持時間 -->
            <div class="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="bg-black/60 backdrop-blur-sm rounded-lg p-2 text-center">
                <p class="text-white text-xs">支持於</p>
                <p class="text-web3-cyan text-sm font-bold">{{ formatDate(nft.purchaseDate) }}</p>
              </div>
            </div>
          </div>
          
          <!-- NFT 信息 -->
          <div>
            <!-- 創作者信息 -->
            <div class="flex items-center space-x-3 mb-3">
              <img 
                :src="nft.creatorAvatar || '/default-avatar.png'" 
                :alt="nft.creatorName"
                class="w-8 h-8 rounded-full border-2 border-web3-purple/50"
              />
              <div class="flex-1 min-w-0">
                <p class="text-white font-medium text-sm truncate">{{ nft.creatorName }}</p>
                <p class="text-white/60 text-xs">創作者</p>
              </div>
              <svg v-if="nft.creatorVerified" class="w-4 h-4 text-web3-green" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clip-rule="evenodd"/>
              </svg>
            </div>
            
            <!-- NFT 標題 -->
            <h3 class="text-lg font-bold text-white mb-2 line-clamp-1">
              {{ nft.name }}
            </h3>
            
            <!-- 支持信息 -->
            <div class="flex justify-between items-center pt-3 border-t border-white/10">
              <div>
                <div class="text-web3-gold font-bold text-sm">{{ nft.price }} STX</div>
                <div class="text-white/50 text-xs">支付金額</div>
              </div>
              <div class="text-right">
                <div class="text-web3-cyan text-sm font-medium">
                  {{ getDaysSupported(nft.purchaseDate) }} 天
                </div>
                <div class="text-white/50 text-xs">支持時長</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 時間軸模式 -->
      <div v-else-if="viewMode === 'timeline'" class="space-y-8">
        <div 
          v-for="(group, year) in groupedByYear" 
          :key="year"
          class="timeline-year"
        >
          <h3 class="text-2xl font-bold text-white mb-6 flex items-center">
            <div class="w-8 h-8 bg-web3-purple rounded-full flex items-center justify-center mr-3">
              <span class="text-white text-sm font-bold">{{ year }}</span>
            </div>
            {{ year }} 年的收藏
            <span class="text-white/50 text-base font-normal ml-2">({{ group.length }} 件)</span>
          </h3>
          
          <div class="relative">
            <!-- 時間線 -->
            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-web3-purple via-web3-cyan to-web3-purple opacity-30"></div>
            
            <div class="space-y-6">
              <div 
                v-for="(nft, index) in group" 
                :key="`${nft.creator}-${nft.seasonId}`"
                class="timeline-item flex items-start space-x-6 pl-10 relative"
              >
                <!-- 時間點 -->
                <div class="absolute left-0 w-8 h-8 bg-web3-purple rounded-full flex items-center justify-center">
                  <div class="w-3 h-3 bg-white rounded-full"></div>
                </div>
                
                <!-- NFT 卡片 -->
                <div class="flex-1 card-web3 p-6 hover:scale-[1.02] transition-transform cursor-pointer" @click="openNFTDetail(nft)">
                  <div class="flex items-start space-x-4">
                    <!-- NFT 縮圖 -->
                    <div class="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-web3-purple/20 to-web3-cyan/20 flex-shrink-0">
                      <img 
                        v-if="nft.imageUri" 
                        :src="nft.imageUri" 
                        :alt="nft.name"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v1.586l8.707 8.707a1 1 0 001.414 0L20.828 6.5a1 1 0 000-1.414L12.707.293a1 1 0 00-1.414 0L2.586 8.5A2 2 0 002 10v8a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    
                    <!-- NFT 信息 -->
                    <div class="flex-1">
                      <div class="flex items-start justify-between mb-2">
                        <div>
                          <h4 class="text-lg font-bold text-white">{{ nft.name }}</h4>
                          <p class="text-web3-cyan text-sm">by {{ nft.creatorName }}</p>
                        </div>
                        <div class="text-right">
                          <div class="text-web3-gold font-bold">{{ nft.price }} STX</div>
                          <div class="text-white/50 text-xs">{{ formatDate(nft.purchaseDate) }}</div>
                        </div>
                      </div>
                      
                      <!-- 支持描述 -->
                      <p class="text-white/70 text-sm mb-3">
                        您成為了 {{ nft.creatorName }} 的第 {{ nft.seasonId }} 季 VIP 會員，支持他們的創作事業
                      </p>
                      
                      <!-- 標籤 -->
                      <div class="flex items-center space-x-2">
                        <span class="bg-web3-purple/20 text-web3-purple px-2 py-1 rounded-full text-xs">Q{{ nft.seasonId }}</span>
                        <span class="bg-web3-gold/20 text-web3-gold px-2 py-1 rounded-full text-xs">VIP會員</span>
                        <span v-if="nft.rarity" class="bg-web3-cyan/20 text-web3-cyan px-2 py-1 rounded-full text-xs">{{ nft.rarity }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- NFT 詳情模態框 -->
    <div v-if="selectedNFT" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="card-web3 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <!-- 模態框標題 -->
        <div class="flex justify-between items-center p-6 border-b border-white/10">
          <div>
            <h3 class="text-2xl font-bold text-gradient-web3">{{ selectedNFT.name }}</h3>
            <p class="text-white/70 text-sm mt-1">by {{ selectedNFT.creatorName }} • 支持於 {{ formatDate(selectedNFT.purchaseDate) }}</p>
          </div>
          <button @click="selectedNFT = null" class="text-white/60 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <div class="grid lg:grid-cols-2 gap-8">
            <!-- 左側：NFT 圖片 -->
            <div>
              <div class="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-web3-purple/20 to-web3-cyan/20 mb-4">
                <img 
                  v-if="selectedNFT.imageUri" 
                  :src="selectedNFT.imageUri" 
                  :alt="selectedNFT.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-24 h-24 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v1.586l8.707 8.707a1 1 0 001.414 0L20.828 6.5a1 1 0 000-1.414L12.707.293a1 1 0 00-1.414 0L2.586 8.5A2 2 0 002 10v8a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              
              <!-- 社交分享 -->
              <div class="flex items-center space-x-3">
                <span class="text-white/70 text-sm">分享您的收藏：</span>
                <button class="btn-glass p-2 rounded-lg">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                  </svg>
                </button>
                <button class="btn-glass p-2 rounded-lg">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- 右側：詳細信息 -->
            <div class="space-y-6">
              <!-- 基本信息 -->
              <div>
                <h4 class="text-lg font-bold text-white mb-4">收藏詳情</h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-white/70">創作者</span>
                    <span class="text-white font-medium">{{ selectedNFT.creatorName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/70">季度</span>
                    <span class="text-web3-purple font-medium">第 {{ selectedNFT.seasonId }} 季</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/70">支付金額</span>
                    <span class="text-web3-gold font-bold">{{ selectedNFT.price }} STX</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/70">支持日期</span>
                    <span class="text-white">{{ formatDate(selectedNFT.purchaseDate) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/70">支持天數</span>
                    <span class="text-web3-cyan">{{ getDaysSupported(selectedNFT.purchaseDate) }} 天</span>
                  </div>
                </div>
              </div>
              
              <!-- 專屬權益 -->
              <div>
                <h4 class="text-lg font-bold text-white mb-4">會員權益</h4>
                <div class="space-y-2">
                  <div class="flex items-center text-web3-green text-sm">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    專屬內容存取權
                  </div>
                  <div class="flex items-center text-web3-green text-sm">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    優先留言和互動
                  </div>
                  <div class="flex items-center text-web3-green text-sm">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    VIP 會員專屬活動
                  </div>
                  <div class="flex items-center text-web3-green text-sm">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    永久收藏紀念價值
                  </div>
                </div>
              </div>
              
              <!-- 收藏意義 -->
              <div class="bg-gradient-to-r from-web3-purple/10 to-web3-cyan/10 rounded-2xl p-4 border border-web3-purple/30">
                <h4 class="text-lg font-bold text-white mb-2">收藏意義</h4>
                <p class="text-white/80 text-sm">
                  這枚 NFT 見證了您對 {{ selectedNFT.creatorName }} 的支持，代表您在第 {{ selectedNFT.seasonId }} 季成為了他們的 VIP 會員。
                  每一次支持都是創作者成長路上的重要動力，您的這份心意已永久記錄在區塊鏈上。
                </p>
              </div>
              
              <!-- 操作按鈕 -->
              <div class="flex space-x-4">
                <button 
                  @click="visitCreator(selectedNFT.creator)"
                  class="btn-web3 flex-1 py-3 rounded-xl"
                >
                  訪問創作者
                </button>
                <button class="btn-glass px-6 py-3 rounded-xl">
                  分享收藏
                </button>
              </div>
            </div>
          </div>
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
    
    // 響應式數據
    const collections = ref([])
    const viewMode = ref('gallery')
    const sortBy = ref('newest')
    const selectedNFT = ref(null)
    const isLoading = ref(false)
    
    // 計算屬性
    const uniqueCreators = computed(() => {
      const creators = new Set(collections.value.map(nft => nft.creator))
      return creators.size
    })
    
    const uniqueQuarters = computed(() => {
      const quarters = new Set(collections.value.map(nft => nft.seasonId))
      return quarters.size
    })
    
    const totalSpent = computed(() => {
      return collections.value.reduce((sum, nft) => sum + nft.price, 0).toFixed(2)
    })
    
    const recentCollections = computed(() => {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      return collections.value.filter(nft => 
        new Date(nft.purchaseDate) > oneMonthAgo
      ).length
    })
    
    const achievementScore = computed(() => {
      // 簡單的成就計分系統
      let score = collections.value.length * 10
      score += uniqueCreators.value * 25
      score += uniqueQuarters.value * 15
      return score
    })
    
    const nextAchievement = computed(() => {
      if (collections.value.length < 5) return '收藏達人'
      if (uniqueCreators.value < 3) return '多元支持者' 
      if (uniqueQuarters.value < 4) return '季度收集家'
      return '超級粉絲'
    })
    
    const sortedCollections = computed(() => {
      const sorted = [...collections.value]
      
      switch (sortBy.value) {
        case 'oldest':
          return sorted.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate))
        case 'creator':
          return sorted.sort((a, b) => a.creatorName.localeCompare(b.creatorName))
        case 'value':
          return sorted.sort((a, b) => b.price - a.price)
        case 'newest':
        default:
          return sorted.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
      }
    })
    
    const groupedByYear = computed(() => {
      const groups = {}
      sortedCollections.value.forEach(nft => {
        const year = new Date(nft.purchaseDate).getFullYear()
        if (!groups[year]) groups[year] = []
        groups[year].push(nft)
      })
      return groups
    })
    
    // 方法
    const loadCollections = async () => {
      if (!walletStore.isConnected || !walletStore.userAddress) {
        console.log('錢包未連接')
        return
      }

      try {
        isLoading.value = true
        console.log('載入收藏資料...')
        
        // 使用新的優化數據結構載入用戶 NFT 收藏
        const userCollections = await contractsStore.getUserNFTCollections(walletStore.userAddress, true)
        
        if (userCollections && Array.isArray(userCollections) && userCollections.length > 0) {
          // 轉換為舊格式以保持UI兼容性
          const flattenedCollections = []
          
          userCollections.forEach(yearGroup => {
            yearGroup.nfts.forEach(nft => {
              flattenedCollections.push({
                creator: nft.creatorAddress,
                creatorName: `創作者 ${nft.creatorAddress.slice(0, 8)}...`,
                creatorAvatar: '/default-avatar.png',
                creatorVerified: false,
                seasonId: nft.seasonId,
                name: `${nft.quarter.displayName} VIP 會員章`,
                description: nft.metadata.description || `${nft.quarter.displayName} 訂閱 NFT`,
                imageUri: nft.media.imageUri || `https://via.placeholder.com/400x400/667eea/ffffff?text=${nft.quarter.displayName}`,
                price: parseFloat(nft.pricing.priceSTX),
                purchaseDate: new Date(nft.timestamps.created || Date.now()).toISOString(),
                rarity: nft.status.isActive ? '活躍中' : nft.status.isExpired ? '已結束' : '即將開始',
                year: nft.quarter.year,
                quarter: nft.quarter.quarter,
                status: nft.status.displayStatus,
                hasImage: nft.media.hasImage,
                _optimized: nft // 保留完整的優化數據
              })
            })
          })
          
          collections.value = flattenedCollections
          console.log('載入的 NFT 收藏:', collections.value)
        } else {
          // 如果沒有真實數據，使用模擬數據進行展示
          console.log('無真實收藏數據，使用模擬數據')
          const mockCollections = [
            {
              creator: 'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ',
              creatorName: '數位藝術家 Alice',
              creatorAvatar: '/default-avatar.png',
              creatorVerified: true,
              seasonId: 4,
              name: '2024 Q4 VIP 會員章',
              description: 'AI 藝術創作專屬權益',
              imageUri: 'https://via.placeholder.com/400x400/667eea/ffffff?text=Q4+NFT',
              price: 2.5,
              purchaseDate: '2024-10-08T10:30:00Z',
              rarity: '限量版'
            },
            {
              creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
              creatorName: '音樂創作者 Bob',
              creatorAvatar: '/default-avatar.png',
              creatorVerified: false,
              seasonId: 3,
              name: '2024 Q3 VIP 會員章',
              description: '獨立音樂專屬內容',
              imageUri: 'https://via.placeholder.com/400x400/764ba2/ffffff?text=Q3+NFT',
              price: 1.8,
              purchaseDate: '2024-07-15T14:20:00Z',
              rarity: '早期支持者'
            }
          ]
          
          collections.value = mockCollections
          console.log('載入的模擬收藏:', collections.value)
        }
        
      } catch (error) {
        console.error('載入收藏失敗:', error)
      } finally {
        isLoading.value = false
      }
    }
    
    const openNFTDetail = (nft) => {
      selectedNFT.value = nft
    }
    
    const visitCreator = (creatorAddress) => {
      router.push(`/creator/${creatorAddress}`)
      selectedNFT.value = null
    }
    
    const handleImageError = (event) => {
      console.log('圖片載入失敗')
      event.target.style.display = 'none'
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
    
    const getDaysSupported = (purchaseDate) => {
      const now = new Date()
      const purchase = new Date(purchaseDate)
      const diffTime = Math.abs(now - purchase)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    }
    
    // 生命週期
    onMounted(async () => {
      await walletStore.initUserSession()
      await loadCollections()
    })
    
    return {
      // 響應式數據
      collections,
      viewMode,
      sortBy,
      selectedNFT,
      isLoading,
      
      // 計算屬性
      uniqueCreators,
      uniqueQuarters,
      totalSpent,
      recentCollections,
      achievementScore,
      nextAchievement,
      sortedCollections,
      groupedByYear,
      
      // 方法
      loadCollections,
      openNFTDetail,
      visitCreator,
      handleImageError,
      formatDate,
      getDaysSupported
    }
  }
}
</script>

<style scoped>
/* 收藏卡片動畫 */
.collection-card {
  animation: fadeInUp 0.6s ease-out both;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.collection-card:hover {
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

/* 時間軸動畫 */
.timeline-item {
  animation: slideInLeft 0.6s ease-out both;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 行限制 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 響應式優化 */
@media (max-width: 768px) {
  .collections-display .grid {
    grid-template-columns: 1fr;
  }
  
  .timeline-item {
    padding-left: 2.5rem;
  }
  
  .timeline-item .absolute {
    left: -0.5rem;
  }
}

@media (max-width: 1024px) {
  .collections-display .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>