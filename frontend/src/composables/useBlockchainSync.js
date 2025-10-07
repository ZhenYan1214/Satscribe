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
  const syncFromBlockchain = async (forceRefresh = true) => {
    if (!walletStore.isConnected || !walletStore.userAddress) {
      console.log('錢包未連接，跳過數據同步')
      return
    }

    console.log('開始從區塊鏈同步數據...', walletStore.userAddress)
    
    try {
      // 序列載入以避免 API 限流問題
      
      // 載入創作者資訊
      try {
        await contractsStore.getCreatorInfo(walletStore.userAddress, forceRefresh)
        await delay(1000) // 1秒延遲
      } catch (err) {
        console.log('載入創作者資訊失敗:', err)
      }
      
      // 載入分潤設定
      try {
        await contractsStore.getRevenueSplit(walletStore.userAddress, forceRefresh)
        await delay(1000) // 1秒延遲
      } catch (err) {
        console.log('載入分潤設定失敗:', err)
      }
      
      // 只載入第一個季度，避免過多請求
      try {
        await contractsStore.getSeasonInfo(walletStore.userAddress, 1, forceRefresh)
      } catch (err) {
        console.log('載入季度 1 資訊失敗:', err)
      }
      
      console.log('區塊鏈數據同步完成')
      
    } catch (error) {
      console.error('數據同步過程中發生錯誤:', error)
    }
  }

  // 監聽用戶地址變化
  watch(
    () => walletStore.userAddress,
    (newAddress, oldAddress) => {
      if (newAddress && newAddress !== oldAddress) {
        console.log('檢測到用戶地址變化，重新同步數據:', newAddress)
        syncFromBlockchain(true)
      }
    },
    { immediate: false }
  )

  // 組件掛載時自動同步
  onMounted(() => {
    // 延遲一點時間確保錢包已經初始化
    setTimeout(() => {
      syncFromBlockchain(true)
    }, 500)
  })

  return {
    syncFromBlockchain
  }
}