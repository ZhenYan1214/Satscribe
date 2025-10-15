<template>
  <div class="creator-setup max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gradient-web3 mb-8">Creator Setup</h1>
    
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
      <h2 class="text-2xl font-bold text-white mb-6">Step 1: Register Creator Profile</h2>
      
      <!-- 註冊表單 -->
      <form @submit.prevent="registerCreator" class="space-y-6">
        <div>
          <label class="block text-white font-medium mb-2">Creator Name</label>
          <input
            v-model="creatorForm.name"
            type="text"
            class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white"
            placeholder="Please enter your creator name"
            required
          />
        </div>
        
        <div>
          <label class="block text-white font-medium mb-2">Personal Introduction</label>
          <textarea
            v-model="creatorForm.bio"
            class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white h-32"
            placeholder="Introduce your creative content and style"
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
          <label class="block text-white font-medium mb-2">Creation Category</label>
          <select
            v-model="creatorForm.category"
            class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white"
            required
          >
            <option value="">Please select a category</option>
            <option value="digital-art">Digital Art</option>
            <option value="music">Music</option>
            <option value="writing">Writing</option>
            <option value="photography">Photography</option>
            <option value="programming">Programming</option>
            <option value="education">Education</option>
            <option value="other">Other</option>

          </select>
        </div>
        
        <button
          type="submit"
          :disabled="contractsStore.isLoading"
          class="btn-web3 w-full py-3 rounded-xl"
        >
        {{ contractsStore.isLoading ? 'Registering...' : 'Register as Creator' }}

        </button>
      </form>
    </div>
    
    <!-- 步驟 2: 完成和可選功能 -->
    <div v-if="currentStep === 2" class="card-web3 p-8">
      <h2 class="text-2xl font-bold text-white mb-6">🎉 creator registration completed!</h2>
      
      <!-- 成功提示 -->
      <div class="bg-gradient-to-r from-web3-green/10 to-web3-cyan/10 border border-web3-green/30 rounded-2xl p-6 mb-8">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-web3-green/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-web3-green" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-web3-green mb-2">welcome to Satscribe！</h3>
            <p class="text-white/80 mb-4">
              Your creator account has been successfully created. Now you can start publishing content, or set up some advanced features first.
            </p>
          </div>
        </div>
      </div>

      <h3 class="text-xl font-bold text-white mb-6">You can now:</h3>

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
            <h4 class="text-lg font-bold text-white">Immediately start creating</h4>
          </div>
          <p class="text-white/70 mb-4">Directly enter the creator dashboard to start publishing content and managing your creative career.</p>
          <button
            @click="$router.push('/creator/dashboard')"
            class="btn-web3 w-full"
          >
            Enter the dashboard
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
            <h4 class="text-lg font-bold text-white">Set up advanced features</h4>
          </div>
          <p class="text-white/70 mb-4">Set up revenue sharing and subscription quarters to make your creative career more professional.</p>
          <button
            @click="showAdvancedSetup = true"
            class="btn-glass w-full"
          >
            Advanced setup
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
            Team revenue sharing (optional)
          </h2>
          <button
            @click="skipRevenueSplit"
            class="text-white/60 hover:text-white text-sm"
          >
            Skip for now
          </button>
        </div>
        
        <div class="bg-web3-purple/5 border border-web3-purple/20 rounded-2xl p-6 mb-6">
          <p class="text-white/80 mb-4">
            If you have team members working together, you can set up automatic revenue allocation. NFT sales income will be automatically allocated to each member according to the ratio you set.
          </p>
          <div class="text-web3-cyan text-sm">
            💡 You can configure at any time on the "Revenue Setting" page
          </div>
        </div>
      
        <div class="space-y-4 mb-6">
          <div v-for="(member, index) in teamMembers" :key="index" 
               class="flex items-center space-x-4 p-4 bg-glass-dark rounded-xl">
            <input
              v-model="member.name"
              placeholder="Member name"
              class="flex-1 p-2 bg-gray-800/80 border border-white/20 rounded-lg text-white placeholder-gray-400"
            />
            <div class="flex-2 relative">
              <input
                v-model="member.walletAddress"
                placeholder="Wallet address (ST...)"
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
              <option value="creator">Main creator</option>
              <option value="editor">Editor</option>
              <option value="artist">Artist</option>
              <option value="developer">Developer</option>
              <option value="investor">Investor</option>
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
            + Add member
          </button>
          
          <div class="text-right">
            <div class="text-white">
              Total: <span :class="totalPercentage === 100 ? 'text-web3-green' : 'text-red-400'">
                {{ totalPercentage }}%
              </span>
            </div>
            <div v-if="totalPercentage !== 100" class="text-red-400 text-sm">
              Must be equal to 100%
            </div>
          </div>
        </div>
      
        <button
          @click="setupRevenueSplit"
          :disabled="totalPercentage !== 100 || contractsStore.isLoading"
          class="btn-web3 w-full py-3 rounded-xl"
        >
          {{ contractsStore.isLoading ? 'Setting...' : 'Save revenue setting' }}
        </button>
      </div>

      <!-- 訂閱季度創建 (可選) -->
      <div class="card-web3 p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 text-web3-cyan mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
            </svg>
            Create the first subscription quarter (optional)
          </h2>
          <button
            @click="finishSetup"
            class="text-white/60 hover:text-white text-sm"
          >
            Skip for now
          </button>
        </div>
        
        <div class="bg-web3-cyan/5 border border-web3-cyan/20 rounded-2xl p-6 mb-6">
          <p class="text-white/80 mb-4">
            Create your first subscription quarter NFT, so fans can purchase and gain exclusive content access.
          </p>
          <div class="text-web3-purple text-sm">
            💡 You can create more quarters on the "Subscription Management" page at any time
          </div>
        </div>

        <form @submit.prevent="createFirstSeason" class="space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-white font-medium mb-2">Quarter price (STX)</label>
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
              <label class="block text-white font-medium mb-2">Issuance quantity</label>
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
            <label class="block text-white font-medium mb-2">Member level</label>
            <select
              v-model="seasonForm.tier"
              class="w-full p-3 bg-glass-dark border border-white/20 rounded-xl text-white"
              required
            >
              <option value="basic">  Basic member</option>
              <option value="premium">Premium member</option>
              <option value="vip">VIP member</option>
            </select>
          </div>
          
          <div>
            <label class="block text-white font-medium mb-2">Validity period (days)</label>
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
              Enable automatic revenue sharing (automatically allocated to team members when purchased)
            </label>
          </div>
          
          <div class="flex space-x-4">
            <button
              type="submit"
              :disabled="contractsStore.isLoading"
              class="btn-web3 flex-1 py-3 rounded-xl"
            >
              {{ contractsStore.isLoading ? 'Creating...' : 'Create quarter' }}
            </button>
            <button
              type="button"
              @click="finishSetup"
              class="btn-glass px-6 py-3 rounded-xl"
            >
              Set later
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
    
    const steps = ref([
      { id: 1, title: 'Creator Profile' },
      { id: 2, title: 'Completed' }
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
        name: 'Myself',
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
      console.log('Avatar upload success:', uploadData)
      // creatorForm.avatarUri 會自動通過 v-model 更新
    }
    
    // 處理頭像上傳錯誤
    const handleAvatarUploadError = (error) => {
      console.error('Avatar upload failed:', error)
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
        console.error('Check registration status failed:', error)
        return false
      } finally {
        isCheckingRegistration.value = false
      }
    }
    
    // 註冊創作者
    const registerCreator = async () => {
      try {
        console.log('🚀 Start creator registration process...')
        console.log('📝 Form Data:', creatorForm.value)
        
        console.log('📞 Call contract registration function...')
        const result = await contractsStore.registerCreator(creatorForm.value)
        console.log('✅ Registration Successful:', result)
        
          alert('🎉 Creator registration successful! Welcome to Satscribe!')
        currentStep.value = 2
      } catch (error) {
        console.error('❌ Registration failed:', error)
        alert('Registration failed: ' + error.message)
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
        console.log('🚀 Start setting revenue...')
        console.log('👥 Team member data:', teamMembers.value)
        
        // 驗證所有錢包地址
        for (let i = 0; i < teamMembers.value.length; i++) {
          const member = teamMembers.value[i]
          if (!validateAddress(member.walletAddress)) {
            alert(`The wallet address format of the ${i + 1}th member is incorrect, please confirm the address starts with ST and is formatted correctly`)
            return
          }
          
          if (member.percentage <= 0 || member.percentage > 100) {
            alert(`The revenue percentage of the ${i + 1}th member must be between 1-100%`)
            return
          }
          
          if (!member.name || member.name.trim() === '') {
            alert(`The name of the ${i + 1}th member cannot be empty`)
            return
          }
        }
        
        // 檢查總比例
        if (totalPercentage.value !== 100) {
          alert('The total revenue percentage must be equal to 100%')
          return
        }
        
        const members = teamMembers.value.map(member => ({
          walletAddress: member.walletAddress.trim(),
          percentage: member.percentage,
          role: member.role
        }))
        
        console.log('📞 Call contract setting revenue...')
        const result = await contractsStore.setupRevenueSplit(members)
        console.log('✅ Revenue setting successful:', result)
        
        alert('🎉 Revenue setting successful! Your team income will be automatically allocated according to the set ratio.')
        // 設定完成後保持在當前頁面
      } catch (error) {
        console.error('❌ Revenue setting failed:', error)
        alert('Revenue setting failed: ' + error.message)
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
        console.log('🚀 Start creating the first quarter...')
        console.log('📋 季度表單數據:', seasonForm.value)
        
        // 計算當前季度ID
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentQuarter = Math.ceil((now.getMonth() + 1) / 3)
        const seasonId = currentYear * 10 + currentQuarter
        
        const seasonData = {
          seasonId: seasonId,
          price: seasonForm.value.price,
          maxSupply: seasonForm.value.maxSupply,
          expiryDate: Math.floor(Date.now() / 1000) + (seasonForm.value.validityDays * 24 * 60 * 60),
          tier: seasonForm.value.tier,
          enableRevenueSplit: seasonForm.value.enableRevenueSplit
        }
        
        console.log('📞 Call contract creating quarter...')
        console.log('📊 Quarter data:', seasonData)
        
        const result = await contractsStore.createSeason(seasonData)
        console.log('✅ Quarter creation successful:', result)
        
        alert(`🎉 Quarter creation successful! Quarter ID: ${seasonId} (${currentYear}年第${currentQuarter}季度)`)
        finishSetup()
      } catch (error) {
        console.error('❌ Quarter creation failed:', error)
        alert('Quarter creation failed: ' + error.message)
      }
    }
    
    // 載入現有資料
    const loadExistingData = async () => {
      if (walletStore.isConnected && walletStore.userAddress) {
        try {
          // 強制從區塊鏈重新載入分潤設定
          const revenueSplit = await contractsStore.getRevenueSplit(walletStore.userAddress, true)
          if (revenueSplit && revenueSplit.value) {
            console.log('Load existing revenue setting:', revenueSplit)
            // 這裡可以更新 teamMembers 來反映鏈上的最新數據
          }
        } catch (error) {
          console.log('Load existing data failed:', error)
        }
      }
    }
    
    // 組件掛載時載入數據
    onMounted(async () => {
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
      handleAvatarUploadSuccess,
      handleAvatarUploadError,
      router
    }
  }
}
</script>