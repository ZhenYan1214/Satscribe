<template>
  <div class="subscription-page">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- 返回按钮 -->
      <button 
        @click="$router.go(-1)"
        class="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        返回
      </button>

      <!-- 订阅章详情 -->
      <div class="bg-white rounded-lg shadow-sm p-8">
        <div class="text-center mb-8">
          <!-- NFT 预览 -->
          <div class="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-xl shadow-lg flex items-center justify-center">
            <div class="text-white text-center">
              <h3 class="text-2xl font-bold mb-2">第 {{ seasonId }} 期</h3>
              <p class="text-lg">订阅章</p>
            </div>
          </div>
          
          <h1 class="text-3xl font-bold mb-2">{{ creator.name }} - 第{{ seasonId }}期订阅章</h1>
          <p class="text-gray-600 mb-6">{{ subscription.description || '独一无二的支持纪念，永久记录您的支持历程' }}</p>
        </div>

        <!-- 订阅信息 -->
        <div class="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 class="text-xl font-semibold mb-4">订阅详情</h2>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">创作者</span>
                <span class="font-medium">{{ creator.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">期别</span>
                <span class="font-medium">第 {{ seasonId }} 期</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">价格</span>
                <span class="font-medium text-blue-600">{{ subscription.price }} STX</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">有效期</span>
                <span class="font-medium">{{ formatDate(subscription.expiryDate) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">已售出</span>
                <span class="font-medium">{{ subscription.currentSupply }}/{{ subscription.maxSupply }}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 class="text-xl font-semibold mb-4">会员权益</h2>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                访问会员专属内容
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                永久收藏纪念
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                支持创作者收益
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                链上持有证明
              </li>
            </ul>
          </div>
        </div>

        <!-- 购买按钮 -->
        <div class="text-center">
          <div v-if="userSubscription.owned" class="mb-6">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
              <div class="flex items-center text-green-800">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                您已拥有此订阅章
              </div>
            </div>
          </div>
          
          <div v-else>
            <button 
              @click="purchaseSubscription"
              class="btn-primary text-lg px-8 py-3"
              :disabled="!walletConnected || purchasing"
            >
              <span v-if="purchasing">购买中...</span>
              <span v-else>购买订阅章 - {{ subscription.price }} STX</span>
            </button>
            
            <p v-if="!walletConnected" class="text-red-500 text-sm mt-2">
              请先连接钱包
            </p>
          </div>
        </div>

        <!-- 重要说明 -->
        <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="font-semibold text-blue-800 mb-2">重要说明</h3>
          <ul class="text-blue-700 text-sm space-y-1">
            <li>• 订阅章为不可转让的 NFT (Soulbound Token)</li>
            <li>• 每人每期限购一次，具有纪念收藏价值</li>
            <li>• 购买后立即获得会员权限，可访问专属内容</li>
            <li>• 收益将按创作者设定的比例自动分配</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useWalletStore } from '@/stores/wallet'

export default {
  name: 'SubscriptionPage',
  props: {
    address: {
      type: String,
      required: true
    },
    seasonId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const walletStore = useWalletStore()
    
    const creator = ref({})
    const subscription = ref({})
    const userSubscription = ref({
      owned: false,
      tokenId: null
    })
    const purchasing = ref(false)
    
    const walletConnected = computed(() => walletStore.isConnected)
    
    const purchaseSubscription = async () => {
      if (!walletConnected.value) {
        alert('请先连接钱包')
        return
      }
      
      purchasing.value = true
      try {
        const result = await walletStore.mintSubscriptionNFT(
          props.address,
          parseInt(props.seasonId),
          `ipfs://metadata-${props.address}-${props.seasonId}`
        )
        
        console.log('购买成功:', result)
        alert('购买成功！欢迎成为会员！')
        
        // 更新用户订阅状态
        userSubscription.value = {
          owned: true,
          tokenId: result.value
        }
        
      } catch (error) {
        console.error('购买失败:', error)
        alert('购买失败: ' + error.message)
      } finally {
        purchasing.value = false
      }
    }
    
    const loadSubscriptionData = async () => {
      try {
        // 示例数据
        creator.value = {
          name: '示例创作者'
        }
        
        subscription.value = {
          price: 2,
          description: '这是一个示例订阅章，包含独特的会员权益',
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
          currentSupply: 85,
          maxSupply: 100
        }
        
        // 检查用户是否已拥有
        if (walletConnected.value) {
          const isValid = await walletStore.checkSubscriptionValid(
            walletStore.userAddress,
            props.address,
            parseInt(props.seasonId)
          )
          userSubscription.value.owned = isValid
        }
        
      } catch (error) {
        console.error('加载订阅数据失败:', error)
      }
    }
    
    const formatDate = (date) => {
      if (!date) return '永久有效'
      return new Date(date).toLocaleDateString('zh-CN')
    }
    
    onMounted(() => {
      loadSubscriptionData()
    })
    
    return {
      creator,
      subscription,
      userSubscription,
      purchasing,
      walletConnected,
      purchaseSubscription,
      formatDate
    }
  }
}
</script>