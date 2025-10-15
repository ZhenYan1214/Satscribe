import { onMounted, watch } from 'vue'
import { useContractsStore } from '@/stores/contracts'
import { useWalletStore } from '@/stores/wallet'

/**
 * 區塊鏈狀態同步 Composable
 * 
 * 這個 composable 會自動：
 * 1. 在組件掛載時從區塊鏈載入最新數據
 * 2. 當用戶地址改變時重新載入數據
 * 3. 提供手動重新整理功能
 */
export function useBlockchainSync() {
  const contractsStore = useContractsStore()
  const walletStore = useWalletStore()

  // 延遲函數，避免 API 限流
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  // 從區塊鏈載入所有相關數據
  const syncFromBlockchain = async (forceRefresh = false) => {
    if (!walletStore.isConnected || !walletStore.userAddress) {
      return
    }

    // 簡化同步邏輯，減少不必要的請求
    console.log('快速數據同步...', walletStore.userAddress)
    
    try {
      // 只載入必要的創作者資訊（使用緩存）
      try {
        await contractsStore.getCreatorInfo(walletStore.userAddress, false)
      } catch (err) {
        console.log('跳過創作者資訊載入')
      }
      
      console.log('快速數據同步完成')
      
    } catch (error) {
      console.log('數據同步失敗，使用緩存')
    }
  }

  // 監聽用戶地址變化（減少頻率）
  watch(
    () => walletStore.userAddress,
    (newAddress, oldAddress) => {
      if (newAddress && newAddress !== oldAddress) {
        console.log('檢測到用戶地址變化，快速同步:', newAddress)
        // 使用緩存，避免重複請求
        syncFromBlockchain(false)
      }
    },
    { immediate: false }
  )

  // 組件掛載時僅做最小同步
  onMounted(() => {
    // 減少初始延遲，僅在必要時同步
    setTimeout(() => {
      if (walletStore.isConnected) {
        syncFromBlockchain(false)
      }
    }, 100)
  })

  return {
    syncFromBlockchain
  }
}