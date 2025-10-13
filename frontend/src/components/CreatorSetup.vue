<template>
  <div class="creator-setup max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gradient-web3 mb-8">創作者設定</h1>
    
    <!-- 步驟指示器 -->
    <div class="flex justify-between items-center mb-8">
      <div v-for="(step, index) in steps" :key="step.id" 
           class="flex items-center"
           :class="{ 'opacity-50': currentStep < index + 1 }">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
             :class="currentStep > index ? 'bg-web3-green' : currentStep === index + 1 ? 'bg-web3-purple' : 'bg-gray-600'">
          {{ index + 1 }}
        </div>
        <span class="ml-3 font-medium text-white">{{ step.title }}</span>
        <div v-if="index < steps.length - 1" class="w-16 h-0.5 bg-gray-600 ml-6"></div>
      </div>
    </div>
    
    <!-- 步驟 1: 註冊創作者 -->
    <div v-if="currentStep === 1" class="card-web3 p-8">
      <h2 class="text-2xl font-bold text-white mb-6">步驟 1: 註冊創作者資料</h2>
      
      <!-- 檢查中提示 -->
      <div v-if="isCheckingRegistration" class="bg-web3-purple/10 border border-web3-purple/30 rounded-2xl p-6 mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-6 h-6 border-2 border-web3-purple border-t-transparent rounded-full animate-spin"></div>
          <span class="text-white">正在檢查註冊狀態...</span>
        </div>
      </div>
      
      <!-- 已註冊提示 -->
      <div v-else-if="alreadyRegistered" class="bg-web3-green/10 border border-web3-green/30 rounded-2xl p-6 mb-6">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-web3-green/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-web3-green" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-web3-green mb-2">您已經是註冊創作者了！</h3>
            <p class="text-white/80 mb-4">
              您的錢包地址已經在我們的創作者註冊表中。您可以直接進入創作者儀表板開始使用。
            </p>
            <button
              @click="router.push('/creator/dashboard')"
              class="btn-web3 mr-4"
            >
              進入創作者儀表板
            </button>
            <button
              @click="router.push('/')"
              class="btn-glass"
            >
              返回首頁
            </button>
          </div>
        </div>
      </div>
      
      <!-- 註冊表單 (只在未註冊時顯示) -->
      <form v-else @submit.prevent="registerCreator" class="space-y-6">
        <div>
          <label class="block text-white font-medium mb-2">創作者名稱</label>
          <input
            v-model="creatorForm.name"
            type="text"
            class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white"
            placeholder="請輸入您的創作者名稱"
            required
          />
        </div>
        
        <div>
          <label class="block text-white font-medium mb-2">個人介紹</label>
          <textarea
            v-model="creatorForm.bio"
            class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white h-32"
            placeholder="介紹您的創作內容和風格"
            required
          ></textarea>
        </div>
        
        <!-- 頭像上傳組件 -->
        <AvatarUploader 
          v-model="creatorForm.avatarUri"
          @upload-success="handleAvatarUploadSuccess"
          @upload-error="handleAvatarUploadError"
        />
        
        <div>
          <label class="block text-white font-medium mb-2">創作類別</label>
          <select
            v-model="creatorForm.category"
            class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white"
            required
          >
            <option value="">請選擇類別</option>
            <option value="digital-art">數位藝術</option>
            <option value="music">音樂</option>
            <option value="writing">寫作</option>
            <option value="photography">攝影</option>
            <option value="programming">程式開發</option>
            <option value="education">教學</option>
            <option value="other">其他</option>
          </select>
        </div>
        
        <button
          type="submit"
          :disabled="contractsStore.isLoading"
          class="btn-web3 w-full py-3 rounded-xl"
        >
          {{ contractsStore.isLoading ? '註冊中...' : '註冊創作者' }}
        </button>
      </form>
    </div>
    
    <!-- 步驟 2: 完成和可選功能 -->
    <div v-if="currentStep === 2" class="card-web3 p-8">
      <h2 class="text-2xl font-bold text-white mb-6">🎉 創作者註冊完成！</h2>
      
      <!-- 成功提示 -->
      <div class="bg-gradient-to-r from-web3-green/10 to-web3-cyan/10 border border-web3-green/30 rounded-2xl p-6 mb-8">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-web3-green/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-web3-green" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-web3-green mb-2">歡迎加入 Satscribe！</h3>
            <p class="text-white/80 mb-4">
              您的創作者帳戶已成功建立。現在您可以開始發布內容，或者先設置一些進階功能。
            </p>
          </div>
        </div>
      </div>

      <h3 class="text-xl font-bold text-white mb-6">您現在可以：</h3>

      <!-- 快速操作選項 -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <!-- 直接開始使用 -->
        <div class="bg-gradient-to-br from-web3-purple/10 to-web3-cyan/10 border border-web3-purple/30 rounded-2xl p-6 hover:border-web3-purple/50 transition-all duration-300">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-web3-purple/20 rounded-2xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-web3-purple" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h4 class="text-lg font-bold text-white">立即開始創作</h4>
          </div>
          <p class="text-white/70 mb-4">直接進入創作者儀表板，開始發布內容和管理您的創作事業。</p>
          <button
            @click="$router.push('/creator/dashboard')"
            class="btn-web3 w-full"
          >
            進入儀表板
          </button>
        </div>

        <!-- 設置進階功能 -->
        <div class="bg-gradient-to-br from-web3-cyan/10 to-web3-green/10 border border-web3-cyan/30 rounded-2xl p-6 hover:border-web3-cyan/50 transition-all duration-300">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-web3-cyan/20 rounded-2xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-web3-cyan" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106.886-.54 2.042-.061 2.287.947.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h4 class="text-lg font-bold text-white">設置進階功能</h4>
          </div>
          <p class="text-white/70 mb-4">先設置收益分潤和訂閱季度，讓您的創作事業更專業化。</p>
          <button
            @click="showAdvancedSetup = true"
            class="btn-glass w-full"
          >
            進階設置
          </button>
        </div>
      </div>
    </div>

    <!-- 進階設置展開面板 -->
    <div v-if="currentStep === 2 && showAdvancedSetup" class="space-y-8">
      <!-- 分潤設定 (可選) -->
      <div class="card-web3 p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 text-web3-purple mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
            團隊收益分潤 (可選)
          </h2>
          <button
            @click="skipRevenueSplit"
            class="text-white/60 hover:text-white text-sm"
          >
            暫時跳過
          </button>
        </div>
        
        <div class="bg-web3-purple/5 border border-web3-purple/20 rounded-2xl p-6 mb-6">
          <p class="text-white/80 mb-4">
            如果您有團隊成員共同創作，可以設置自動收益分配。NFT銷售收入會按照您設定的比例自動分配給每個成員。
          </p>
          <div class="text-web3-cyan text-sm">
            💡 您隨時可以在「分潤設置」頁面進行配置
          </div>
        </div>
      
        <div class="space-y-4 mb-6">
          <div v-for="(member, index) in teamMembers" :key="index" 
               class="flex items-center space-x-4 p-4 bg-glass-dark rounded-xl">
            <input
              v-model="member.name"
              placeholder="成員名稱"
              class="flex-1 p-2 bg-gray-800/80 border border-white/20 rounded-lg text-white placeholder-gray-400"
            />
            <div class="flex-2 relative">
              <input
                v-model="member.walletAddress"
                placeholder="錢包地址 (ST...)"
                :class="[
                  'w-full p-2 bg-gray-800/80 border rounded-lg text-white font-mono text-sm placeholder-gray-400',
                  member.walletAddress && validateAddress(member.walletAddress) 
                    ? 'border-green-400' 
                    : member.walletAddress 
                      ? 'border-red-400' 
                      : 'border-white/20'
                ]"
              />
              <div v-if="member.walletAddress" class="absolute right-2 top-2">
                <span v-if="validateAddress(member.walletAddress)" class="text-green-400">✓</span>
                <span v-else class="text-red-400">✗</span>
              </div>
            </div>
            <input
              v-model.number="member.percentage"
              type="number"
              min="1"
              max="100"
              placeholder="%"
              class="w-20 p-2 bg-gray-800/80 border border-white/20 rounded-lg text-white text-center placeholder-gray-400"
            />
            <select
              v-model="member.role"
              class="p-2 bg-gray-800/80 border border-white/20 rounded-lg text-white"
            >
              <option value="creator">主創</option>
              <option value="editor">編輯</option>
              <option value="artist">美術</option>
              <option value="developer">開發</option>
              <option value="investor">投資人</option>
            </select>
            <button
              @click="removeMember(index)"
              v-if="teamMembers.length > 1"
              class="text-red-400 hover:text-red-300 p-2"
            >
              🗑️
            </button>
          </div>
        </div>
      
        <div class="flex justify-between items-center mb-6">
          <button
            @click="addMember"
            class="btn-glass px-4 py-2 rounded-lg"
          >
            + 添加成員
          </button>
          
          <div class="text-right">
            <div class="text-white">
              總計: <span :class="totalPercentage === 100 ? 'text-web3-green' : 'text-red-400'">
                {{ totalPercentage }}%
              </span>
            </div>
            <div v-if="totalPercentage !== 100" class="text-red-400 text-sm">
              必須等於 100%
            </div>
          </div>
        </div>
      
        <button
          @click="setupRevenueSplit"
          :disabled="totalPercentage !== 100 || contractsStore.isLoading"
          class="btn-web3 w-full py-3 rounded-xl"
        >
          {{ contractsStore.isLoading ? '設定中...' : '保存分潤設定' }}
        </button>
      </div>

      <!-- 訂閱季度創建 (可選) -->
      <div class="card-web3 p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 text-web3-cyan mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
            </svg>
            創建第一個訂閱季度 (可選)
          </h2>
          <button
            @click="finishSetup"
            class="text-white/60 hover:text-white text-sm"
          >
            暫時跳過
          </button>
        </div>
        
        <div class="bg-web3-cyan/5 border border-web3-cyan/20 rounded-2xl p-6 mb-6">
          <p class="text-white/80 mb-4">
            創建您的第一個訂閱季度 NFT，讓粉絲可以購買並獲得專屬內容存取權。
          </p>
          <div class="text-web3-purple text-sm">
            💡 您隨時可以在「訂閱管理」頁面創建更多季度
          </div>
        </div>

        <form @submit.prevent="createFirstSeason" class="space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-white font-medium mb-2">季度價格 (STX)</label>
              <input
                v-model.number="seasonForm.price"
                type="text"
                step="0.1"
                min="0.1"
                class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white"
                placeholder="2.0"
                required
                @input="validatePrice"
              />
            </div>
            
            <div>
              <label class="block text-white font-medium mb-2">發行數量</label>
              <input
                v-model.number="seasonForm.maxSupply"
                type="number"
                min="1"
                class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white"
                placeholder="1000"
                required
              />
            </div>
          </div>
          
          <div>
            <label class="block text-white font-medium mb-2">會員等級</label>
            <select
              v-model="seasonForm.tier"
              class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white"
              required
            >
              <option value="basic">基礎會員</option>
              <option value="premium">高級會員</option>
              <option value="vip">VIP 會員</option>
            </select>
          </div>
          
          <div>
            <label class="block text-white font-medium mb-2">有效期限 (天)</label>
            <input
              v-model.number="seasonForm.validityDays"
              type="number"
              min="1"
              class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white"
              placeholder="365"
              required
            />
          </div>
          
          <div class="flex items-center space-x-3">
            <input
              v-model="seasonForm.enableRevenueSplit"
              type="checkbox"
              id="revenue-split-season"
              class="w-5 h-5"
            />
            <label for="revenue-split-season" class="text-white">
              啟用自動分潤（購買時自動分配給團隊成員）
            </label>
          </div>
          
          <div class="flex space-x-4">
            <button
              type="submit"
              :disabled="contractsStore.isLoading"
              class="btn-web3 flex-1 py-3 rounded-xl"
            >
              {{ contractsStore.isLoading ? '創建中...' : '創建季度' }}
            </button>
            <button
              type="button"
              @click="finishSetup"
              class="btn-glass px-6 py-3 rounded-xl"
            >
              稍後設定
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 錯誤提示 -->
    <div v-if="contractsStore.error" class="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
      <p class="text-red-400">{{ contractsStore.error }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContractsStore } from '@/stores/contracts'
import { useWalletStore } from '@/stores/wallet'
import AvatarUploader from '@/components/AvatarUploader.vue'

export default {
  name: 'CreatorSetup',
  components: {
    AvatarUploader
  },
  setup() {
    const contractsStore = useContractsStore()
    const walletStore = useWalletStore()
    const router = useRouter()
    
    const currentStep = ref(1)
    const showAdvancedSetup = ref(false)
    const isCheckingRegistration = ref(false)
    const alreadyRegistered = ref(false)
    
    const steps = ref([
      { id: 1, title: '創作者資料' },
      { id: 2, title: '完成' }
    ])
    
    // 創作者表單
    const creatorForm = ref({
      name: '',
      bio: '',
      avatarUri: '',
      category: ''
    })
    
    // 團隊成員
    const teamMembers = ref([
      {
        name: '我自己',
        walletAddress: '',
        percentage: 100,
        role: 'creator'
      }
    ])
    
    // 初始化用戶地址
    const initializeUserAddress = () => {
      if (walletStore.isConnected && walletStore.userAddress) {
        teamMembers.value[0].walletAddress = walletStore.userAddress
      }
    }
    
    // 立即初始化地址
    initializeUserAddress()
    
    // 季度表單
    const seasonForm = ref({
      price: 2.0,
      maxSupply: 1000,
      tier: 'premium',
      validityDays: 365,
      enableRevenueSplit: true
    })
    
    const totalPercentage = computed(() => {
      return teamMembers.value.reduce((sum, member) => sum + (member.percentage || 0), 0)
    })
    
    // 處理頭像上傳成功
    const handleAvatarUploadSuccess = (uploadData) => {
      console.log('頭像上傳成功:', uploadData)
      // creatorForm.avatarUri 會自動通過 v-model 更新
    }
    
    // 處理頭像上傳錯誤
    const handleAvatarUploadError = (error) => {
      console.error('頭像上傳失敗:', error)
      // 錯誤已經在 AvatarUploader 組件中處理和顯示
    }
    
    // 檢查創作者註冊狀態
    const checkCreatorRegistration = async () => {
      if (!walletStore.isConnected || !walletStore.userAddress) {
        return false
      }
      
      try {
        isCheckingRegistration.value = true
        const isRegistered = await walletStore.isRegisteredCreator()
        alreadyRegistered.value = isRegistered
        return isRegistered
      } catch (error) {
        console.error('檢查註冊狀態失敗:', error)
        return false
      } finally {
        isCheckingRegistration.value = false
      }
    }
    
    // 註冊創作者
    const registerCreator = async () => {
      try {
        // 先檢查是否已經註冊
        const isRegistered = await checkCreatorRegistration()
        if (isRegistered) {
          alert('您已經註冊過創作者了！即將跳轉到創作者儀表板。')
          router.push('/creator/dashboard')
          return
        }
        
        await contractsStore.registerCreator(creatorForm.value)
        currentStep.value = 2
      } catch (error) {
        console.error('註冊失敗:', error)
      }
    }
    
    // 添加成員
    const addMember = () => {
      teamMembers.value.push({
        name: '',
        walletAddress: '',
        percentage: 0,
        role: 'editor'
      })
    }
    
    // 移除成員
    const removeMember = (index) => {
      teamMembers.value.splice(index, 1)
    }
    
    // 驗證錢包地址格式
    const validateAddress = (address) => {
      if (!address || address.trim() === '') {
        return false
      }
      
      // 檢查 Stacks 地址格式：以ST或SP開頭，總長度41字符，包含數字和大寫字母
      const stacksAddressRegex = /^S[TP][0-9A-Z]{39}$/
      return stacksAddressRegex.test(address.trim())
    }
    
    // 設定分潤
    const setupRevenueSplit = async () => {
      try {
        // 驗證所有錢包地址
        for (let i = 0; i < teamMembers.value.length; i++) {
          const member = teamMembers.value[i]
          if (!validateAddress(member.walletAddress)) {
            alert(`第 ${i + 1} 個成員的錢包地址格式不正確，請確認地址以 ST 開頭並且格式正確`)
            return
          }
          
          if (member.percentage <= 0 || member.percentage > 100) {
            alert(`第 ${i + 1} 個成員的分潤比例必須在 1-100% 之間`)
            return
          }
          
          if (!member.name || member.name.trim() === '') {
            alert(`第 ${i + 1} 個成員的姓名不能為空`)
            return
          }
        }
        
        // 檢查總比例
        if (totalPercentage.value !== 100) {
          alert('分潤比例總和必須等於 100%')
          return
        }
        
        const members = teamMembers.value.map(member => ({
          walletAddress: member.walletAddress.trim(),
          percentage: member.percentage,
          role: member.role
        }))
        
        await contractsStore.setupRevenueSplit(members)
        alert('分潤設定成功！')
        // 設定完成後保持在當前頁面
      } catch (error) {
        console.error('分潤設定失敗:', error)
        alert('分潤設定失敗：' + error.message)
      }
    }
    
    // 跳過分潤設定
    const skipRevenueSplit = () => {
      finishSetup()
    }
    
    // 完成設置
    const finishSetup = () => {
      router.push('/creator/dashboard')
    }
    
    const validatePrice = (event) => {
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
      seasonForm.value.price = event.target.value
    }
    
    // 創建季度
    const createFirstSeason = async () => {
      try {
        const seasonData = {
          seasonId: 1,
          price: seasonForm.value.price,
          maxSupply: seasonForm.value.maxSupply,
          expiryDate: Math.floor(Date.now() / 1000) + (seasonForm.value.validityDays * 24 * 60 * 60),
          tier: seasonForm.value.tier,
          enableRevenueSplit: seasonForm.value.enableRevenueSplit
        }
        
        await contractsStore.createSeason(seasonData)
        alert('季度創建成功！')
        finishSetup()
      } catch (error) {
        console.error('季度創建失敗:', error)
      }
    }
    
    // 載入現有資料
    const loadExistingData = async () => {
      if (walletStore.isConnected && walletStore.userAddress) {
        try {
          // 強制從區塊鏈重新載入分潤設定
          const revenueSplit = await contractsStore.getRevenueSplit(walletStore.userAddress, true)
          if (revenueSplit && revenueSplit.value) {
            console.log('載入現有分潤設定:', revenueSplit)
            // 這裡可以更新 teamMembers 來反映鏈上的最新數據
          }
        } catch (error) {
          console.log('載入現有資料失敗:', error)
        }
      }
    }
    
    // 組件掛載時載入數據
    onMounted(async () => {
      // 檢查創作者註冊狀態
      await checkCreatorRegistration()
      loadExistingData()
    })
    
    return {
      currentStep,
      steps,
      creatorForm,
      teamMembers,
      seasonForm,
      totalPercentage,
      contractsStore,
      isCheckingRegistration,
      alreadyRegistered,
      
      registerCreator,
      addMember,
      removeMember,
      validateAddress,
      setupRevenueSplit,
      createFirstSeason,
      skipRevenueSplit,
      finishSetup,
      validatePrice,
      showAdvancedSetup,
      loadExistingData,
      checkCreatorRegistration,
      handleAvatarUploadSuccess,
      handleAvatarUploadError,
      router
    }
  }
}
</script>