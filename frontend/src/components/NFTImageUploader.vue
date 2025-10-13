<template>
  <div class="nft-image-uploader">
    <!-- 使用 AvatarUploader 組件，但配置為 NFT 類型 -->
    <AvatarUploader 
      v-model="modelValue"
      type="nft"
      @upload-success="handleUploadSuccess"
      @upload-error="handleUploadError"
    />
    
    <!-- NFT 特有的額外信息顯示 -->
    <div v-if="nftImageData" class="mt-4 p-4 bg-glass-purple rounded-xl">
      <h4 class="text-white font-medium mb-2">NFT 圖片信息</h4>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-white/70">尺寸：</span>
          <span class="text-white">{{ nftImageData.width }} × {{ nftImageData.height }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-white/70">格式：</span>
          <span class="text-white">{{ nftImageData.format?.toUpperCase() }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-white/70">文件大小：</span>
          <span class="text-white">{{ formatFileSize(nftImageData.size) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-white/70">優化狀態：</span>
          <span :class="nftImageData.optimized ? 'text-web3-green' : 'text-web3-cyan'">
            {{ nftImageData.optimized ? '已優化' : '原始品質' }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- 預覽 Metadata -->
    <div v-if="modelValue" class="mt-4 p-4 bg-glass-dark rounded-xl">
      <h4 class="text-white font-medium mb-2">NFT Metadata 預覽</h4>
      <div class="text-xs text-white/70 font-mono bg-black/20 p-3 rounded-lg">
        <div>"image": "{{ modelValue }}"</div>
        <div>"name": "{{ seasonName || 'Q1 2024 訂閱章' }}"</div>
        <div>"description": "{{ seasonDescription || 'Satscribe 季度訂閱 NFT' }}"</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import AvatarUploader from './AvatarUploader.vue'

export default {
  name: 'NFTImageUploader',
  components: {
    AvatarUploader
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    seasonName: {
      type: String,
      default: ''
    },
    seasonDescription: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'upload-success', 'upload-error'],
  setup(props, { emit }) {
    const nftImageData = ref(null)
    
    // 處理上傳成功
    const handleUploadSuccess = (uploadData) => {
      nftImageData.value = uploadData
      emit('upload-success', uploadData)
    }
    
    // 處理上傳錯誤
    const handleUploadError = (error) => {
      nftImageData.value = null
      emit('upload-error', error)
    }
    
    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    return {
      nftImageData,
      handleUploadSuccess,
      handleUploadError,
      formatFileSize
    }
  }
}
</script>

<style scoped>
/* NFT 圖片上傳器特有樣式 */
.nft-image-uploader :deep(.avatar-uploader) {
  /* 可以在這裡添加 NFT 特有的樣式覆蓋 */
}
</style>