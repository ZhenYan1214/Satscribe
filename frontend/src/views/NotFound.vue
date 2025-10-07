<template>
  <div class="not-found">
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="text-center">
        <div class="mb-8">
          <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 class="text-2xl font-semibold text-gray-700 mb-4">页面未找到</h2>
          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            抱歉，您访问的页面不存在。可能是链接错误或页面已被移动。
          </p>
        </div>
        
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <router-link 
            to="/"
            class="inline-block btn-primary"
          >
            回到首页
          </router-link>
          <button 
            @click="goBack"
            class="inline-block btn-secondary"
          >
            返回上一页
          </button>
        </div>
        
        <div class="mt-12">
          <h3 class="text-lg font-medium text-gray-900 mb-4">您可能在寻找:</h3>
          <div class="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <router-link 
              to="/"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
              </div>
              <h4 class="font-medium text-sm">首页</h4>
              <p class="text-xs text-gray-500 mt-1">发现优质创作者</p>
            </router-link>
            
            <router-link 
              to="/creator/dashboard"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <h4 class="font-medium text-sm">创作者仪表盘</h4>
              <p class="text-xs text-gray-500 mt-1">管理您的内容</p>
            </router-link>
            
            <router-link 
              to="/my-collections"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                </svg>
              </div>
              <h4 class="font-medium text-sm">我的收藏</h4>
              <p class="text-xs text-gray-500 mt-1">查看订阅章NFT</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFound',
  setup() {
    const router = useRouter()
    
    const goBack = () => {
      if (window.history.length > 1) {
        router.go(-1)
      } else {
        router.push('/')
      }
    }
    
    return {
      goBack
    }
  }
}
</script>