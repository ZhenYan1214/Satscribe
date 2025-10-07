<template>
  <div class="analytics min-h-screen p-6 max-w-7xl mx-auto">
    <!-- 頁面標題 -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold text-gradient-web3 mb-2">數據分析中心</h1>
        <p class="text-white/70 text-lg">深入了解您的表現數據，優化創作策略</p>
      </div>
      <div class="flex items-center space-x-4">
        <select 
          v-model="timeRange" 
          class="bg-glass border border-white/20 rounded-xl px-4 py-2 text-white focus:border-web3-purple focus:outline-none"
        >
          <option value="7">近 7 天</option>
          <option value="30">近 30 天</option>
          <option value="90">近 90 天</option>
          <option value="365">近一年</option>
        </select>
        <button 
          @click="refreshData" 
          class="btn-web3 px-4 py-2 rounded-xl flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
          </svg>
          <span>刷新數據</span>
        </button>
      </div>
    </div>

    <!-- 核心指標儀表板 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <!-- 總收益 -->
      <div class="card-web3 p-6 hover:scale-[1.02] transition-transform">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-white/70 text-sm mb-1">總收益</p>
            <p class="text-3xl font-bold text-white mb-1">{{ metrics.totalRevenue }}</p>
            <p class="text-sm text-web3-accent">STX</p>
            <div class="flex items-center mt-2">
              <svg class="w-4 h-4 text-web3-green mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-web3-green text-sm">+{{ metrics.revenueGrowth }}%</span>
              <span class="text-white/50 text-sm ml-1">vs 上期</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-web3-emerald/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-emerald" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 新訂閱者 -->
      <div class="card-web3 p-6 hover:scale-[1.02] transition-transform">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-white/70 text-sm mb-1">新訂閱者</p>
            <p class="text-3xl font-bold text-white mb-1">{{ metrics.newSubscribers }}</p>
            <p class="text-sm text-web3-cyan">位粉絲</p>
            <div class="flex items-center mt-2">
              <svg class="w-4 h-4 text-web3-cyan mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-web3-cyan text-sm">+{{ metrics.subscriberGrowth }}%</span>
              <span class="text-white/50 text-sm ml-1">成長率</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-web3-cyan/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 內容瀏覽量 -->
      <div class="card-web3 p-6 hover:scale-[1.02] transition-transform">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-white/70 text-sm mb-1">內容瀏覽量</p>
            <p class="text-3xl font-bold text-white mb-1">{{ formatNumber(metrics.totalViews) }}</p>
            <p class="text-sm text-web3-purple">次觀看</p>
            <div class="flex items-center mt-2">
              <svg class="w-4 h-4 text-web3-purple mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-web3-purple text-sm">+{{ metrics.viewsGrowth }}%</span>
              <span class="text-white/50 text-sm ml-1">互動提升</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-web3-purple/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 活躍訂閱 -->
      <div class="card-web3 p-6 hover:scale-[1.02] transition-transform">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-white/70 text-sm mb-1">活躍訂閱</p>
            <p class="text-3xl font-bold text-white mb-1">{{ metrics.activeSubscriptions }}</p>
            <p class="text-sm text-web3-amber">個會員</p>
            <div class="flex items-center mt-2">
              <svg class="w-4 h-4 text-web3-amber mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"/>
              </svg>
              <span class="text-web3-amber text-sm">{{ metrics.retentionRate }}%</span>
              <span class="text-white/50 text-sm ml-1">留存率</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-web3-amber/20 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-web3-amber" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 圖表區域 -->
    <div class="grid lg:grid-cols-3 gap-8 mb-10">
      <!-- 收益趨勢圖 -->
      <div class="lg:col-span-2 card-web3 p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-white">收益趨勢分析</h3>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-web3-emerald rounded-full"></div>
              <span class="text-white/70 text-sm">NFT 收益</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-web3-amber rounded-full"></div>
              <span class="text-white/70 text-sm">打賞收益</span>
            </div>
          </div>
        </div>
        <!-- 模擬圖表 -->
        <div class="h-64 bg-glass-dark rounded-xl p-4 relative overflow-hidden">
          <!-- 圖表背景網格 -->
          <div class="absolute inset-0 opacity-20">
            <div class="grid grid-cols-7 h-full">
              <div v-for="i in 7" :key="i" class="border-r border-white/10"></div>
            </div>
            <div class="grid grid-rows-4 h-full absolute inset-0">
              <div v-for="i in 4" :key="i" class="border-b border-white/10"></div>
            </div>
          </div>
          <!-- 模擬數據點和趨勢線 -->
          <div class="relative h-full flex items-end justify-between px-2">
            <div v-for="(value, index) in chartData" :key="index" 
                 class="bg-gradient-to-t from-web3-emerald/50 to-web3-emerald rounded-t-lg transition-all duration-500 hover:from-web3-emerald hover:to-web3-cyan"
                 :style="{ height: value + '%', width: '10%' }"
            ></div>
          </div>
          <!-- Y軸標籤 -->
          <div class="absolute left-2 top-0 h-full flex flex-col justify-between py-4 text-white/50 text-xs">
            <span>{{ maxRevenue }} STX</span>
            <span>{{ (maxRevenue * 0.75).toFixed(1) }}</span>
            <span>{{ (maxRevenue * 0.5).toFixed(1) }}</span>
            <span>{{ (maxRevenue * 0.25).toFixed(1) }}</span>
            <span>0</span>
          </div>
        </div>
      </div>

      <!-- 收益分佈圓餅圖 -->
      <div class="card-web3 p-6">
        <h3 class="text-xl font-bold text-white mb-6">收益來源分析</h3>
        <!-- 模擬圓餅圖 -->
        <div class="relative w-48 h-48 mx-auto mb-6">
          <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90">
            <!-- NFT 收益部分 -->
            <circle cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="8"
                    stroke-dasharray="{{revenueBreakdown.nftPercent * 2.51}} {{(100 - revenueBreakdown.nftPercent) * 2.51}}"
                    class="text-web3-emerald"
            />
            <!-- 打賞收益部分 -->
            <circle cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="8"
                    stroke-dasharray="{{revenueBreakdown.lightningPercent * 2.51}} {{(100 - revenueBreakdown.lightningPercent) * 2.51}}"
                    stroke-dashoffset="{{-revenueBreakdown.nftPercent * 2.51}}"
                    class="text-web3-amber opacity-80"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <p class="text-2xl font-bold text-white">{{ metrics.totalRevenue }}</p>
              <p class="text-sm text-white/70">STX</p>
            </div>
          </div>
        </div>
        
        <!-- 收益來源明細 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 bg-web3-emerald rounded-full"></div>
              <span class="text-white/80 text-sm">NFT 訂閱</span>
            </div>
            <div class="text-right">
              <p class="text-white font-medium">{{ revenueBreakdown.nft }} STX</p>
              <p class="text-white/50 text-xs">{{ revenueBreakdown.nftPercent }}%</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 bg-web3-amber rounded-full"></div>
              <span class="text-white/80 text-sm">Lightning 打賞</span>
            </div>
            <div class="text-right">
              <p class="text-white font-medium">{{ revenueBreakdown.lightning }} STX</p>
              <p class="text-white/50 text-xs">{{ revenueBreakdown.lightningPercent }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 詳細分析區域 -->
    <div class="grid lg:grid-cols-2 gap-8 mb-10">
      <!-- 熱門內容排行 -->
      <div class="card-web3 p-6">
        <h3 class="text-xl font-bold text-white mb-6 flex items-center">
          <svg class="w-5 h-5 text-web3-amber mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          熱門內容排行榜
        </h3>
        <div class="space-y-4">
          <div 
            v-for="(content, index) in topContents" 
            :key="content.id"
            class="flex items-center p-4 bg-glass-dark rounded-xl hover:bg-white/10 transition-all group"
          >
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-web3-purple/20 text-web3-purple font-bold text-sm mr-4">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-white group-hover:text-web3-cyan transition-colors">{{ content.title }}</h4>
              <p class="text-white/60 text-sm">{{ formatDate(content.publishDate) }}</p>
            </div>
            <div class="text-right">
              <p class="text-white font-medium">{{ formatNumber(content.views) }}</p>
              <div class="flex items-center text-sm">
                <svg class="w-3 h-3 text-web3-green mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                </svg>
                <span class="text-web3-green">{{ content.engagementRate }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 收益分配詳情 -->
      <div class="card-web3 p-6">
        <h3 class="text-xl font-bold text-white mb-6 flex items-center">
          <svg class="w-5 h-5 text-web3-emerald mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
          </svg>
          收益分配明細 (本月)
        </h3>
        
        <!-- 總收益概覽 -->
        <div class="bg-glass-dark rounded-xl p-4 mb-6">
          <div class="text-center">
            <p class="text-white/70 text-sm mb-1">本月總收益</p>
            <p class="text-3xl font-bold text-gradient-web3">{{ metrics.totalRevenue }} STX</p>
            <p class="text-white/50 text-sm">≈ ${{ (metrics.totalRevenue * 0.5).toFixed(2) }} USD</p>
          </div>
        </div>

        <!-- 團隊成員分配 -->
        <div class="space-y-4">
          <div 
            v-for="member in revenueDistribution" 
            :key="member.role"
            class="flex items-center justify-between p-4 bg-glass-dark rounded-xl hover:bg-white/10 transition-all"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-web3-purple/20 rounded-xl flex items-center justify-center">
                <span class="text-web3-purple text-sm font-bold">{{ member.role[0] }}</span>
              </div>
              <div>
                <p class="text-white font-medium">{{ member.role }}</p>
                <p class="text-white/60 text-sm">{{ member.percentage }}% 分潤</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-white font-bold">{{ member.amount }} STX</p>
              <p class="text-white/50 text-sm">≈ ${{ (member.amount * 0.5).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用戶洞察分析 -->
    <div class="grid lg:grid-cols-3 gap-8 mb-10">
      <!-- 用戶活躍度 -->
      <div class="card-web3 p-6">
        <h3 class="text-xl font-bold text-white mb-6">用戶活躍度</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-white/70">日活躍用戶</span>
            <span class="text-white font-bold">{{ userEngagement.dailyActive }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-white/70">週活躍用戶</span>
            <span class="text-white font-bold">{{ userEngagement.weeklyActive }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-white/70">月活躍用戶</span>
            <span class="text-white font-bold">{{ userEngagement.monthlyActive }}</span>
          </div>
          <div class="flex justify-between items-center border-t border-white/10 pt-4">
            <span class="text-web3-cyan">平均停留時間</span>
            <span class="text-web3-cyan font-bold">{{ userEngagement.avgSessionTime }}分鐘</span>
          </div>
        </div>
      </div>

      <!-- 內容表現 -->
      <div class="card-web3 p-6">
        <h3 class="text-xl font-bold text-white mb-6">內容表現</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-white/70">總發布數</span>
            <span class="text-white font-bold">{{ contentStats.totalPosts }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-white/70">平均點讚數</span>
            <span class="text-white font-bold">{{ contentStats.avgLikes }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-white/70">分享次數</span>
            <span class="text-white font-bold">{{ contentStats.totalShares }}</span>
          </div>
          <div class="flex justify-between items-center border-t border-white/10 pt-4">
            <span class="text-web3-purple">互動率</span>
            <span class="text-web3-purple font-bold">{{ contentStats.engagementRate }}%</span>
          </div>
        </div>
      </div>

      <!-- 訂閱趨勢 -->
      <div class="card-web3 p-6">
        <h3 class="text-xl font-bold text-white mb-6">訂閱趨勢</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-white/70">新增訂閱</span>
            <span class="text-web3-green font-bold">+{{ subscriptionTrends.newSubscriptions }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-white/70">取消訂閱</span>
            <span class="text-web3-rose font-bold">-{{ subscriptionTrends.cancellations }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-white/70">續費率</span>
            <span class="text-white font-bold">{{ subscriptionTrends.renewalRate }}%</span>
          </div>
          <div class="flex justify-between items-center border-t border-white/10 pt-4">
            <span class="text-web3-amber">淨成長</span>
            <span class="text-web3-amber font-bold">+{{ subscriptionTrends.netGrowth }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <div class="flex justify-center space-x-4">
      <button 
        @click="exportData" 
        class="btn-web3 px-6 py-3 rounded-xl flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
        <span>匯出報告</span>
      </button>
      <button 
        @click="generateInsights" 
        class="btn-glass px-6 py-3 rounded-xl flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>生成洞察</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'Analytics',
  setup() {
    const timeRange = ref('30')
    
    const metrics = ref({
      totalRevenue: 0,
      revenueGrowth: 0,
      newSubscribers: 0,
      subscriberGrowth: 0,
      totalViews: 0,
      viewsGrowth: 0,
      activeSubscriptions: 0,
      retentionRate: 0
    })
    
    const topContents = ref([])
    
    const revenueBreakdown = ref({
      nft: 0,
      nftPercent: 0,
      lightning: 0,
      lightningPercent: 0
    })
    
    const revenueDistribution = ref([])
    
    const userEngagement = ref({
      dailyActive: 0,
      weeklyActive: 0,
      monthlyActive: 0,
      avgSessionTime: 0
    })

    const contentStats = ref({
      totalPosts: 0,
      avgLikes: 0,
      totalShares: 0,
      engagementRate: 0
    })

    const subscriptionTrends = ref({
      newSubscriptions: 0,
      cancellations: 0,
      renewalRate: 0,
      netGrowth: 0
    })

    const chartData = ref([45, 68, 32, 89, 76, 54, 93])
    
    const maxRevenue = computed(() => {
      return Math.max(metrics.value.totalRevenue * 1.2, 100)
    })
    
    const refreshData = () => {
      loadAnalyticsData()
    }
    
    const exportData = () => {
      const data = {
        metrics: metrics.value,
        timeRange: timeRange.value,
        exportDate: new Date().toISOString(),
        topContents: topContents.value,
        revenueBreakdown: revenueBreakdown.value,
        revenueDistribution: revenueDistribution.value,
        userEngagement: userEngagement.value,
        contentStats: contentStats.value,
        subscriptionTrends: subscriptionTrends.value
      }
      
      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `satscribe-analytics-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      
      URL.revokeObjectURL(url)
    }

    const generateInsights = () => {
      const insights = [
        `您的收益在過去${timeRange.value}天內增長了${metrics.value.revenueGrowth}%，表現優秀！`,
        `訂閱者留存率達到${metrics.value.retentionRate}%，說明內容質量獲得認可。`,
        `建議增加會員專屬內容比例，以提升付費轉換率。`,
        `您的內容平均互動率為${contentStats.value.engagementRate}%，高於行業平均水準。`
      ]
      alert(insights.join('\n\n'))
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
    
    const loadAnalyticsData = () => {
      // 模擬數據 - 實際應用中應從 API 或智能合約獲取
      metrics.value = {
        totalRevenue: 67.8,
        revenueGrowth: 28.4,
        newSubscribers: 189,
        subscriberGrowth: 22.7,
        totalViews: 12650,
        viewsGrowth: 35.2,
        activeSubscriptions: 312,
        retentionRate: 84.3
      }
      
      topContents.value = [
        {
          id: 1,
          title: 'Stacks 2.0 升級完整指南',
          publishDate: new Date('2024-01-18'),
          views: 2340,
          engagementRate: 92.1
        },
        {
          id: 2,
          title: 'Clarity 智能合約最佳實踐',
          publishDate: new Date('2024-01-15'),
          views: 1980,
          engagementRate: 87.5
        },
        {
          id: 3,
          title: 'NFT 市場深度分析 2024',
          publishDate: new Date('2024-01-12'),
          views: 1756,
          engagementRate: 79.3
        },
        {
          id: 4,
          title: '去中心化身份解決方案',
          publishDate: new Date('2024-01-08'),
          views: 1489,
          engagementRate: 82.7
        },
        {
          id: 5,
          title: 'Bitcoin Layer 2 生態展望',
          publishDate: new Date('2024-01-05'),
          views: 1234,
          engagementRate: 76.2
        }
      ]
      
      revenueBreakdown.value = {
        nft: 56.7,
        nftPercent: 83.6,
        lightning: 11.1,
        lightningPercent: 16.4
      }
      
      revenueDistribution.value = [
        {
          role: '主創作者',
          percentage: 65,
          amount: 44.1
        },
        {
          role: '內容編輯',
          percentage: 20,
          amount: 13.6
        },
        {
          role: '技術支援',
          percentage: 10,
          amount: 6.8
        },
        {
          role: '行銷推廣',
          percentage: 5,
          amount: 3.4
        }
      ]

      userEngagement.value = {
        dailyActive: 89,
        weeklyActive: 267,
        monthlyActive: 1024,
        avgSessionTime: 18.5
      }

      contentStats.value = {
        totalPosts: 24,
        avgLikes: 156,
        totalShares: 89,
        engagementRate: 14.2
      }

      subscriptionTrends.value = {
        newSubscriptions: 45,
        cancellations: 8,
        renewalRate: 91.3,
        netGrowth: 37
      }
    }
    
    onMounted(() => {
      loadAnalyticsData()
    })
    
    return {
      timeRange,
      metrics,
      topContents,
      revenueBreakdown,
      revenueDistribution,
      userEngagement,
      contentStats,
      subscriptionTrends,
      chartData,
      maxRevenue,
      refreshData,
      exportData,
      generateInsights,
      formatDate,
      formatNumber
    }
  }
}
</script>