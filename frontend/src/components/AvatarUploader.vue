<template>
  <div class="avatar-uploader">
    <label class="block text-white font-medium mb-4">{{ getTypeConfig().description }}</label>
    
    <!-- 頭像預覽區域 -->
    <div class="flex flex-col items-center">
      <!-- 主要頭像區域 -->
      <div 
        class="relative group cursor-pointer"
        @click="triggerFileInput"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <!-- 頭像容器 -->
        <div 
          :class="[
            'w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden relative transition-all duration-300',
            isDragging ? 'border-web3-cyan border-dashed scale-105' : '',
            isUploading ? 'border-web3-purple' : '',
            'group-hover:border-web3-cyan group-hover:shadow-glow'
          ]"
        >
          <!-- 預覽圖片 -->
          <img 
            v-if="previewUrl || modelValue"
            :src="previewUrl || modelValue"
            :alt="'Avatar Preview'"
            class="w-full h-full object-cover"
          />
          
          <!-- 默認頭像 -->
          <div 
            v-else
            class="w-full h-full bg-gradient-to-br from-web3-purple to-web3-cyan flex items-center justify-center"
          >
            <svg class="w-12 h-12 text-white/60" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
            </svg>
          </div>
          
          <!-- 懸停遮罩 -->
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div class="text-center text-white">
              <svg class="w-6 h-6 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
              </svg>
              <div class="text-xs font-medium">
                {{ previewUrl || modelValue ? 'Change' : 'Upload' }}
              </div>
            </div>
          </div>
          
          <!-- 上傳進度遮罩 -->
          <div 
            v-if="isUploading"
            class="absolute inset-0 bg-black/80 flex items-center justify-center"
          >
            <div class="text-center text-white">
              <div class="w-8 h-8 border-2 border-web3-cyan border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <div class="text-xs">{{ uploadProgress }}%</div>
            </div>
          </div>
        </div>
        
        <!-- 編輯圖標 -->
        <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-web3-cyan rounded-full border-2 border-web3-dark flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
          </svg>
        </div>
      </div>
      
      <!-- 上傳提示文字 -->
      <div class="mt-4 text-center">
        <p class="text-white/80 text-sm mb-2">
          click{{ getTypeConfig().description }}Or drag and drop an image here to upload
        </p>
        <p class="text-white/60 text-xs">
          {{ getTypeConfig().hint }}
        </p>
      </div>
      
      <!-- 操作按鈕 -->
      <div class="flex space-x-3 mt-4">
        <button
          type="button"
          @click="triggerFileInput"
          :disabled="isUploading"
          class="btn-glass text-sm px-4 py-2 rounded-lg"
        >
          <svg class="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
          Choose Image
        </button>
        
        <button
          v-if="previewUrl || modelValue"
          type="button"
          @click="removeAvatar"
          :disabled="isUploading"
          class="btn-glass text-sm px-4 py-2 rounded-lg text-red-400 hover:text-red-300"
        >
          <svg class="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          remove
        </button>
      </div>
    </div>
    
    <!-- 隱藏的文件輸入 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
      @change="handleFileSelect"
      class="hidden"
    />
    
    <!-- 錯誤提示 -->
    <div 
      v-if="errorMessage"
      class="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <span class="text-red-400 text-sm">{{ errorMessage }}</span>
      </div>
    </div>
    
    <!-- 成功提示 -->
    <div 
      v-if="successMessage"
      class="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        <span class="text-green-400 text-sm">{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'AvatarUploader',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'avatar', // 'avatar', 'nft', 'general'
      validator: (value) => ['avatar', 'nft', 'general'].includes(value)
    },
    maxSize: {
      type: Number,
      default: null // 如果未指定，使用後端默認值
    }
  },
  emits: ['update:modelValue', 'upload-success', 'upload-error'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const previewUrl = ref('')
    const isUploading = ref(false)
    const uploadProgress = ref(0)
    const isDragging = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')
    
    // 監聽 modelValue 變化
    watch(() => props.modelValue, (newValue) => {
      if (newValue && !previewUrl.value) {
        previewUrl.value = newValue
      }
    }, { immediate: true })
    
    // 觸發文件選擇
    const triggerFileInput = () => {
      if (!isUploading.value) {
        fileInput.value?.click()
      }
    }
    
    // 清除提示訊息
    const clearMessages = () => {
      errorMessage.value = ''
      successMessage.value = ''
    }
    
    // 顯示錯誤訊息
    const showError = (message) => {
      clearMessages()
      errorMessage.value = message
      setTimeout(() => {
        errorMessage.value = ''
      }, 5000)
    }
    
    // 顯示成功訊息
    const showSuccess = (message) => {
      clearMessages()
      successMessage.value = message
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }
    
    // 獲取類型相關的配置
    const getTypeConfig = () => {
      const configs = {
        avatar: {
          maxSize: 5 * 1024 * 1024, // 5MB
          allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
          description: 'Avatar',
          hint: 'support JPG、PNG format, max 5MB'
        },
        nft: {
          maxSize: 50 * 1024 * 1024, // 50MB
          allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
          description: 'NFT picture',
          hint: 'support JPG、PNG、GIF、WebP、SVG format, max 50MB'
        },
        general: {
          maxSize: 10 * 1024 * 1024, // 10MB
          allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
          description: 'picture',
          hint: 'support JPG、PNG、GIF、WebP format, max 10MB'
        }
      }
      return configs[props.type] || configs.general
    }
    
    // 驗證文件
    const validateFile = (file) => {
      const config = getTypeConfig()
      const maxSize = props.maxSize || config.maxSize
      
      if (!config.allowedTypes.includes(file.type)) {
        showError(`not supported file format!${config.hint}`)
        return false
      }
      
      if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / 1024 / 1024)
        showError(`file too large!please upload less than ${maxSizeMB}MB of ${config.description}.`)
        return false
      }
      
      return true
    }
    
    // 處理文件上傳
    const uploadFile = async (file) => {
      if (!validateFile(file)) return
      
      try {
        isUploading.value = true
        uploadProgress.value = 0
        clearMessages()
        
        const formData = new FormData()
        formData.append('image', file)
        
        const xhr = new XMLHttpRequest()
        
        // 監聽上傳進度
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            uploadProgress.value = Math.round((event.loaded / event.total) * 100)
          }
        })
        
        // 處理上傳完成
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            if (response.success) {
              previewUrl.value = response.data.imageUrl
              emit('update:modelValue', response.data.imageUrl)
              emit('upload-success', response.data)
              showSuccess('Avatar uploaded successfully!')
            } else {
              showError(response.error || 'upload failed')
              emit('upload-error', response.error)
            }
          } else {
            showError('upload failed, please try again later')
            emit('upload-error', 'internet error')
          }
          isUploading.value = false
        })
        
        // 處理上傳錯誤
        xhr.addEventListener('error', () => {
          showError('upload failed, please check your internet connection')
          emit('upload-error', 'internet error')
          isUploading.value = false
        })
        
        // 根據類型選擇 API 端點
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
        const endpoints = {
          avatar: `${API_BASE}/api/upload/avatar`,
          nft: `${API_BASE}/api/upload/nft`,
          general: `${API_BASE}/api/upload/image`
        }
        
        const endpoint = endpoints[props.type] || endpoints.general
        
        // 發送請求
        xhr.open('POST', endpoint)
        xhr.send(formData)
        
      } catch (error) {
        console.error('upload error:', error)
        showError('upload failed:' + error.message)
        emit('upload-error', error.message)
        isUploading.value = false
      }
    }
    
    // 處理文件選擇
    const handleFileSelect = (event) => {
      const file = event.target.files?.[0]
      if (file) {
        uploadFile(file)
      }
      // 清空 input value 以允許重複選擇同一文件
      event.target.value = ''
    }
    
    // 處理拖拽懸停
    const handleDragOver = (event) => {
      event.preventDefault()
      isDragging.value = true
    }
    
    // 處理拖拽離開
    const handleDragLeave = (event) => {
      event.preventDefault()
      isDragging.value = false
    }
    
    // 處理拖拽放下
    const handleDrop = (event) => {
      event.preventDefault()
      isDragging.value = false
      
      const files = event.dataTransfer?.files
      if (files && files.length > 0) {
        uploadFile(files[0])
      }
    }
    
    // 移除頭像
    const removeAvatar = () => {
      previewUrl.value = ''
      emit('update:modelValue', '')
      clearMessages()
      showSuccess('Avatar removed')
    }
    
    return {
      fileInput,
      previewUrl,
      isUploading,
      uploadProgress,
      isDragging,
      errorMessage,
      successMessage,
      getTypeConfig,
      triggerFileInput,
      handleFileSelect,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      removeAvatar
    }
  }
}
</script>

<style scoped>
/* 拖拽懸停效果 */
.avatar-uploader {
  @apply select-none;
}

/* 頭像容器懸停效果 */
.group:hover .shadow-glow {
  box-shadow: 0 0 20px rgba(116, 185, 255, 0.3);
}

/* 響應式設計 */
@media (max-width: 640px) {
  .w-32.h-32 {
    @apply w-24 h-24;
  }
}
</style>