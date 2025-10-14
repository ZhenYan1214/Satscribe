<template>
  <div class="revenue-settings min-h-screen text-white p-6">
    <!-- 頁面標題 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-4xl font-display font-bold text-gradient-web3 mb-2">收益分配設定</h1>
          <p class="text-white/70">設定工作室成員的收益分配比例，讓每個貢獻者都能獲得公平報酬</p>
        </div>
        <div class="glass-purple px-4 py-2 rounded-xl">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-web3-green rounded-full animate-pulse"></div>
            <span class="text-white/90 text-sm">智能合約自動分配</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 當前配置狀態卡片 -->
    <div class="card-web3 p-6 mb-8 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <svg class="w-6 h-6 text-web3-purple mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          配置狀態
        </h2>
        <div :class="[
          'px-4 py-2 rounded-full text-sm font-bold border',
          isConfigured 
            ? 'bg-web3-green/20 text-web3-green border-web3-green/30' 
            : 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
        ]">
          {{ isConfigured ? '✓ 已完成配置' : '⚠ 待設定' }}
        </div>
      </div>
      
      <!-- 未配置狀態 -->
      <div v-if="!isConfigured" class="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-6">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-yellow-400 mb-2">尚未設定分潤配置</h3>
            <p class="text-yellow-200/80 mb-4">
              請添加工作室成員並設置分潤比例，所有NFT銷售收益將按照您設定的比例自動分配給團隊成員。
            </p>
            <button @click="addMember" class="btn-web3 text-sm px-4 py-2">
              立即開始設定
            </button>
          </div>
        </div>
      </div>
      
      <!-- 已配置狀態 -->
      <div v-else class="grid md:grid-cols-2 gap-6">
        <!-- NFT 銷售分潤 -->
        <div class="bg-gradient-to-br from-web3-purple/10 to-web3-cyan/10 rounded-2xl p-6 border border-web3-purple/30">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-web3-purple/20 rounded-xl flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                  <path fill-rule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-white">NFT 銷售分潤</h3>
                <p class="text-white/60 text-sm">訂閱章銷售收益分配</p>
              </div>
            </div>
            <div :class="[
              'w-3 h-3 rounded-full',
              nftEnabled ? 'bg-web3-green shadow-glow' : 'bg-gray-500'
            ]"></div>
          </div>
          <p :class="[
            'text-sm font-medium',
            nftEnabled ? 'text-web3-green' : 'text-gray-400'
          ]">
            {{ nftEnabled ? '✓ 已啟用自動分潤' : '✗ 未啟用' }}
          </p>
        </div>

        <!-- Lightning 打賞分潤 - 暫時隱藏 -->
        <!-- 
        <div class="bg-gradient-to-br from-web3-cyan/10 to-web3-green/10 rounded-2xl p-6 border border-web3-cyan/30">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-web3-cyan/20 rounded-xl flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-white">Lightning 打賞分潤</h3>
                <p class="text-white/60 text-sm">即時打賞收益分配</p>
              </div>
            </div>
            <div :class="[
              'w-3 h-3 rounded-full',
              lightningEnabled ? 'bg-web3-green shadow-glow' : 'bg-gray-500'
            ]"></div>
          </div>
          <p :class="[
            'text-sm font-medium',
            lightningEnabled ? 'text-web3-green' : 'text-gray-400'
          ]">
            {{ lightningEnabled ? '✓ 已啟用自動分潤' : '✗ 暫未啟用' }}
          </p>
        </div>
        -->
      </div>
    </div>

    <!-- 工作室成員管理 -->
    <div class="card-web3 p-6 mb-8 animate-fade-in" style="animation-delay: 0.1s">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <svg class="w-6 h-6 text-web3-purple mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
          </svg>
          工作室成員
          <span class="ml-3 px-2 py-1 bg-web3-purple/20 text-web3-purple text-sm rounded-full">
            {{ members.length }} 位成員
          </span>
        </h2>
        <div class="flex space-x-3">
          <button 
            @click="initializeDefaultSettings" 
            class="btn-glass text-sm px-4 py-2"
          >
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
            </svg>
            重設為預設
          </button>
          <button @click="addMember" class="btn-web3">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
            </svg>
            添加成員
          </button>
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-if="members.length === 0" class="text-center py-12">
        <div class="w-20 h-20 bg-web3-purple/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <svg class="w-10 h-10 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-white mb-3">還沒有工作室成員</h3>
        <p class="text-white/60 mb-6 max-w-md mx-auto">
          添加您的團隊成員並設置分潤比例，讓每個貢獻者都能獲得應有的報酬
        </p>
        <button @click="addMember" class="btn-web3">
          添加第一個成員
        </button>
      </div>

      <!-- 成員列表 -->
      <div v-else class="space-y-4">
        <div 
          v-for="(member, index) in members" 
          :key="index"
          class="bg-gradient-to-r from-web3-purple/5 to-web3-cyan/5 border border-white/10 rounded-2xl p-6 hover:border-web3-purple/30 transition-all duration-300"
        >
          <div class="grid lg:grid-cols-5 gap-4">
            <!-- 錢包地址 -->
            <div class="lg:col-span-2">
              <label class="block text-white font-medium mb-2">
                <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                錢包地址
              </label>
              <div class="relative">
                <input 
                  v-model="member.wallet"
                  type="text" 
                  class="w-full p-3 bg-gray-800/50 border border-white/20 rounded-xl text-white font-mono text-sm placeholder-gray-400 focus:border-web3-purple/60 focus:outline-none"
                  placeholder="ST1ABC..."
                  :class="[
                    member.wallet && validateAddress(member.wallet) 
                      ? 'border-green-400' 
                      : member.wallet 
                        ? 'border-red-400' 
                        : 'border-white/20'
                  ]"
                >
                <div v-if="member.wallet" class="absolute right-3 top-3">
                  <span v-if="validateAddress(member.wallet)" class="text-green-400">✓</span>
                  <span v-else class="text-red-400">✗</span>
                </div>
              </div>
            </div>
            
            <!-- 角色 -->
            <div>
              <label class="block text-white font-medium mb-2">
                <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                </svg>
                角色
              </label>
              <select 
                v-model="member.role"
                class="w-full p-3 bg-gray-800/50 border border-white/20 rounded-xl text-white focus:border-web3-purple/60 focus:outline-none"
              >
                <option value="">請選擇角色</option>
                <option value="creator">主創作者</option>
                <option value="editor">編輯</option>
                <option value="artist">美術設計</option>
                <option value="developer">技術開發</option>
                <option value="marketing">行銷推廣</option>
                <option value="manager">專案管理</option>
                <option value="investor">投資人</option>
                <option value="other">其他</option>
              </select>
            </div>
            
            <!-- 分潤比例 -->
            <div>
              <label class="block text-white font-medium mb-2">
                <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm5 5a1 1 0 100-2 1 1 0 000 2zm5 0a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm-5 0a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                </svg>
                分潤比例 (%)
              </label>
              <div class="relative">
                <input 
                  v-model.number="member.percentage"
                  type="number" 
                  min="0"
                  max="100"
                  step="1"
                  class="w-full p-3 bg-gray-800/50 border border-white/20 rounded-xl text-white text-center focus:border-web3-purple/60 focus:outline-none"
                  placeholder="25"
                  @input="validatePercentages"
                >
                <span class="absolute right-3 top-3 text-white/60">%</span>
              </div>
            </div>
            
            <!-- 移除按鈕 -->
            <div class="flex items-end">
              <button 
                @click="removeMember(index)"
                class="w-full h-12 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 flex items-center justify-center group"
              >
                <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 分潤比例總計 -->
        <div class="bg-gradient-to-r from-web3-purple/10 to-web3-cyan/10 border border-white/20 rounded-2xl p-6">
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-web3-gold/20 rounded-xl flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-web3-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                </svg>
              </div>
              <span class="text-xl font-bold text-white">總分潤比例</span>
            </div>
            <div class="text-right">
              <div :class="[
                'text-3xl font-bold',
                totalPercentage === 100 ? 'text-web3-green' : 'text-red-400'
              ]">
                {{ totalPercentage }}%
              </div>
              <p v-if="totalPercentage !== 100" class="text-red-400 text-sm mt-1">
                {{ totalPercentage > 100 ? '超過 100%' : '必須等於 100%' }}
              </p>
              <p v-else class="text-web3-green text-sm mt-1">
                ✓ 配置正確
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- NFT 分潤設置 -->
    <div class="card-web3 p-6 mb-8 animate-fade-in" style="animation-delay: 0.2s">
      <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
        <svg class="w-6 h-6 text-web3-purple mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106.886-.54 2.042-.061 2.287.947.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
        </svg>
        NFT 訂閱分潤設置
      </h2>
      
      <div class="space-y-6">
        <!-- NFT 銷售分潤 -->
        <div class="bg-gradient-to-r from-web3-purple/10 to-web3-pink/10 border border-web3-purple/30 rounded-2xl p-6 transition-all duration-300 hover:border-web3-purple/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center flex-1">
              <div class="w-12 h-12 bg-web3-purple/20 rounded-2xl flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                  <path fill-rule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white mb-1">NFT 銷售分潤</h3>
                <p class="text-white/60">訂閱章銷售收入按比例自動分配給團隊成員</p>
              </div>
            </div>
            
            <!-- 切換開關 -->
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="nftEnabled"
                type="checkbox" 
                class="sr-only peer"
              >
              <div class="w-14 h-8 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-web3-purple/30 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-web3-purple"></div>
            </label>
          </div>
        </div>
        
        <!-- Lightning 打賞分潤 - 暫時隱藏，專注於 NFT 分潤 -->
        <!--
        <div class="bg-gradient-to-r from-web3-cyan/10 to-web3-green/10 border border-web3-cyan/30 rounded-2xl p-6 transition-all duration-300 hover:border-web3-cyan/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center flex-1">
              <div class="w-12 h-12 bg-web3-cyan/20 rounded-2xl flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white mb-1">Lightning 打賞分潤</h3>
                <p class="text-white/60">Lightning 網路即時打賞收入按比例分配</p>
              </div>
            </div>
            
            切換開關
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="lightningEnabled"
                type="checkbox" 
                class="sr-only peer"
              >
              <div class="w-14 h-8 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-web3-cyan/30 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-web3-cyan"></div>
            </label>
          </div>
        </div>
        -->
      </div>
    </div>

    <!-- 操作按鈕 -->
    <div class="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
      <button 
        @click="previewSplit"
        class="btn-glass px-6 py-3"
        :disabled="!canSave"
        :class="{ 'opacity-50 cursor-not-allowed': !canSave }"
      >
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
          <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
        </svg>
        預覽分潤效果
      </button>
      <button 
        @click="saveSettings"
        class="btn-web3 px-6 py-3"
        :disabled="!canSave"
        :class="{ 'opacity-50 cursor-not-allowed': !canSave }"
      >
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        {{ isConfigured ? '更新設定' : '保存設定' }}
      </button>
    </div>

    <!-- 預覽模態框 -->
    <div v-if="showPreview" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="card-web3 w-full max-w-md p-6 animate-scale-in">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-white">💰 分潤預覽</h3>
          <button @click="showPreview = false" class="text-white/60 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <label class="block text-white font-medium mb-2">收入金額 (STX)</label>
          <input 
            v-model.number="previewAmount"
            type="text" 
            step="0.1"
            min="0.1"
            class="w-full p-3 bg-gray-800/50 border border-white/20 rounded-xl text-white focus:border-web3-purple/60 focus:outline-none"
            placeholder="例如: 10"
            @input="validateAmount"
          >
        </div>

        <div class="space-y-3 mb-6">
          <h4 class="font-medium text-white mb-4">💸 分潤詳情</h4>
          <div v-for="member in members" :key="member.wallet" 
               class="flex justify-between items-center bg-gray-800/30 rounded-xl p-3">
            <div>
              <span class="text-white font-medium">{{ member.role || '未命名角色' }}</span>
              <div class="text-white/60 text-sm font-mono">{{ member.percentage }}%</div>
            </div>
            <div class="text-right">
              <span class="text-web3-green font-bold">
                {{ (previewAmount * member.percentage / 100).toFixed(2) }} STX
              </span>
            </div>
          </div>
        </div>

        <button 
          @click="showPreview = false"
          class="w-full btn-web3"
        >
          關閉預覽
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import { useContractsStore } from '@/stores/contracts'

export default {
  name: 'RevenueSettings',
  setup() {
    const walletStore = useWalletStore()
    const contractsStore = useContractsStore()
    
    const members = ref([])
    const nftEnabled = ref(true)
    const lightningEnabled = ref(false)
    const showPreview = ref(false)
    const previewAmount = ref(10)
    
    const totalPercentage = computed(() => {
      return members.value.reduce((sum, member) => sum + (member.percentage || 0), 0)
    })
    
    const isConfigured = computed(() => {
      return members.value.length > 0 && totalPercentage.value === 100
    })
    
    const canSave = computed(() => {
      const hasMembers = members.value.length > 0
      const validPercentage = totalPercentage.value === 100
      const allFieldsValid = members.value.every(m => m.wallet && m.role && m.percentage > 0)
      const allAddressesValid = members.value.every(m => validateAddress(m.wallet))
      
      console.log('canSave 檢查:', {
        hasMembers,
        validPercentage,
        allFieldsValid,
        allAddressesValid,
        totalPercentage: totalPercentage.value,
        members: members.value
      })
      
      return hasMembers && validPercentage && allFieldsValid && allAddressesValid
    })
    
    // 驗證錢包地址格式
    const validateAddress = (address) => {
      if (!address || address.trim() === '') {
        console.log('地址驗證失敗: 空地址')
        return false
      }
      
      const trimmedAddress = address.trim()
      
      // 標準 Stacks 地址格式
      const stacksAddressRegex = /^S[TP][0-9A-Z]{39}$/
      
      // 區塊鏈載入的 hash160 格式（臨時解決方案）
      const hash160Regex = /^\[hash160:[a-fA-F0-9]+.*\]$/
      
      const isValid = stacksAddressRegex.test(trimmedAddress) || hash160Regex.test(trimmedAddress)
      
      console.log('地址驗證:', {
        address: trimmedAddress,
        isStandardFormat: stacksAddressRegex.test(trimmedAddress),
        isHash160Format: hash160Regex.test(trimmedAddress),
        isValid: isValid
      })
      
      return isValid
    }
    
    const addMember = () => {
      members.value.push({
        wallet: '',
        role: '',
        percentage: 0
      })
    }
    
    const removeMember = (index) => {
      members.value.splice(index, 1)
      validatePercentages()
    }
    
    const validatePercentages = () => {
      // 實時驗證邏輯
    }
    
    const validateAmount = (event) => {
      const value = event.target.value
      // 只允許數字和小數點
      const cleanValue = value.replace(/[^0-9.]/g, '')
      // 確保只有一個小數點
      const parts = cleanValue.split('.')
      if (parts.length > 2) {
        event.target.value = parts[0] + '.' + parts.slice(1).join('')
      } else {
        event.target.value = cleanValue
      }
      // 更新 v-model
      previewAmount.value = event.target.value
    }
    
    const previewSplit = () => {
      if (!canSave.value) {
        alert('請先完成分潤配置')
        return
      }
      showPreview.value = true
    }
    
    const saveSettings = async () => {
      if (!canSave.value) {
        alert('請檢查配置是否完整和正確')
        return
      }
      
      try {
        // 準備成員數據
        const membersData = members.value.map(member => ({
          walletAddress: member.wallet.trim(),
          percentage: member.percentage,
          role: member.role
        }))
        
        // 調用合約設置分潤
        await contractsStore.setupRevenueSplit(membersData)
        
        alert('✅ 分潤設定已成功保存到區塊鏈！')
        
      } catch (error) {
        console.error('保存分潤設置失敗:', error)
        alert('❌ 保存失敗: ' + error.message)
      }
    }
    
    const loadCurrentSettings = async () => {
      console.log('🔧 使用本地分潤設定顯示模式')
      
      // 不再從鏈上查詢，直接使用預設的本地設定
      // 這樣確保前端顯示完全基於使用者的本地修改
      if (walletStore.isConnected && walletStore.userAddress) {
        console.log('初始化本地分潤設定，用戶地址:', walletStore.userAddress)
        initializeDefaultSettings()
      } else {
        console.log('錢包未連接，無法初始化設定')
      }
    }
    
    const initializeDefaultSettings = () => {
      if (walletStore.userAddress) {
        // 使用預設配置：創作者100%
        members.value = [{
          wallet: walletStore.userAddress,
          role: 'creator',
          percentage: 100
        }]
        nftEnabled.value = true
        lightningEnabled.value = false  // Lightning 分潤永遠關閉
        console.log('✅ 初始化本地分潤設定 (預設: 創作者100%):', members.value)
      }
    }
    
    onMounted(() => {
      // 使用本地設定模式，不延遲載入
      console.log('🚀 分潤設定頁面載入 - 本地顯示模式')
      if (walletStore.isConnected && walletStore.userAddress) {
        loadCurrentSettings()
      } else {
        // 如果錢包還沒連接，等待一下再初始化
        setTimeout(() => {
          if (walletStore.userAddress) {
            loadCurrentSettings()
          }
        }, 1000)
      }
    })
    
    return {
      members,
      nftEnabled,
      lightningEnabled,
      showPreview,
      previewAmount,
      totalPercentage,
      isConfigured,
      canSave,
      contractsStore,
      validateAddress,
      addMember,
      removeMember,
      validatePercentages,
      validateAmount,
      previewSplit,
      saveSettings,
      loadCurrentSettings
    }
  }
}
</script>