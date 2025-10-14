// NFT 購買測試工具
// 用於驗證跨錢包購買和分潤機制

import { useContractsStore } from '@/stores/contracts'
import { useWalletStore } from '@/stores/wallet'

export class NFTTestHelper {
  constructor() {
    this.contractsStore = useContractsStore()
    this.walletStore = useWalletStore()
  }

  // 測試場景1: 創作者創建NFT
  async testCreatorCreateNFT() {
    console.log('🧪 測試場景1: 創作者創建NFT')
    
    try {
      const nftData = {
        price: 10, // 10 STX
        enableRevenueSplit: true,
        imageUri: '/src/assets/test/nft-season-20254.svg',
        description: '測試用的VIP會員NFT'
      }
      
      console.log('📞 調用 createSeasonAuto:', nftData)
      const result = await this.contractsStore.createSeasonAuto(nftData)
      
      console.log('✅ NFT 創建成功:', result)
      return {
        success: true,
        seasonId: result.seasonId,
        transactionId: result.transactionId
      }
      
    } catch (error) {
      console.error('❌ NFT 創建失敗:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 測試場景2: 檢查NFT數據
  async testNFTData(creatorAddress, seasonId) {
    console.log('🧪 測試場景2: 檢查NFT數據')
    console.log('參數:', { creatorAddress, seasonId })
    
    try {
      // 獲取季度信息
      const seasonInfo = await this.contractsStore.getSeasonInfo(creatorAddress, seasonId, true)
      console.log('📊 季度信息:', seasonInfo)
      
      // 獲取創作者信息
      const creatorInfo = await this.contractsStore.getCreatorInfo(creatorAddress, true)
      console.log('👨‍🎨 創作者信息:', creatorInfo)
      
      // 獲取分潤設定
      const revenueSplit = await this.contractsStore.getRevenueSplit(creatorAddress, true)
      console.log('💰 分潤設定:', revenueSplit)
      
      return {
        success: true,
        data: {
          seasonInfo,
          creatorInfo,
          revenueSplit
        }
      }
      
    } catch (error) {
      console.error('❌ 數據檢查失敗:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 測試場景3: 跨錢包購買NFT
  async testCrossWalletPurchase(creatorAddress, seasonId) {
    console.log('🧪 測試場景3: 跨錢包購買NFT')
    
    // 檢查是否為不同錢包
    if (this.walletStore.userAddress === creatorAddress) {
      return {
        success: false,
        error: '不能用相同錢包進行跨錢包測試。請切換到不同的錢包地址。'
      }
    }
    
    try {
      const metadataUri = `nft-test-${seasonId}-${Date.now()}`
      
      console.log('📞 調用 purchaseNFT:', {
        creatorAddress,
        seasonId,
        metadataUri,
        buyerAddress: this.walletStore.userAddress
      })
      
      const result = await this.contractsStore.purchaseNFT(creatorAddress, seasonId, metadataUri)
      
      console.log('✅ NFT 購買成功:', result)
      return {
        success: true,
        transactionId: result.txId,
        buyerAddress: this.walletStore.userAddress,
        creatorAddress
      }
      
    } catch (error) {
      console.error('❌ NFT 購買失敗:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 測試場景4: 驗證分潤結果
  async testRevenueSplitResult(creatorAddress) {
    console.log('🧪 測試場景4: 驗證分潤結果')
    
    try {
      // 獲取更新後的創作者統計
      const creatorInfo = await this.contractsStore.getCreatorInfo(creatorAddress, true)
      console.log('📊 創作者收益統計:', creatorInfo)
      
      // 獲取分潤設定以查看團隊成員
      const revenueSplit = await this.contractsStore.getRevenueSplit(creatorAddress, true)
      console.log('👥 分潤成員:', revenueSplit)
      
      return {
        success: true,
        data: {
          creatorInfo,
          revenueSplit
        }
      }
      
    } catch (error) {
      console.error('❌ 分潤驗證失敗:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 綜合測試流程
  async runFullTest() {
    console.log('🚀 開始 NFT 購買和分潤綜合測試')
    
    const results = {
      walletAddress: this.walletStore.userAddress,
      timestamp: new Date().toISOString(),
      tests: []
    }
    
    // 測試1: 獲取現有NFT數據
    const creatorAddress = this.walletStore.userAddress // 假設當前用戶就是創作者
    const seasonId = 20254 // 使用已創建的季度
    
    const dataTest = await this.testNFTData(creatorAddress, seasonId)
    results.tests.push({
      name: 'NFT數據檢查',
      result: dataTest
    })
    
    if (!dataTest.success) {
      console.log('⚠️ NFT數據檢查失敗，跳過後續測試')
      return results
    }
    
    console.log('💡 提示: 請切換到不同的錢包地址以測試跨錢包購買功能')
    console.log('🔗 當前創作者地址:', creatorAddress)
    
    return results
  }

  // 輔助函數：格式化測試結果
  formatTestResults(results) {
    console.log('\n📋 測試結果摘要:')
    console.log('================')
    console.log(`錢包地址: ${results.walletAddress}`)
    console.log(`測試時間: ${results.timestamp}`)
    console.log(`測試數量: ${results.tests.length}`)
    
    results.tests.forEach((test, index) => {
      const status = test.result.success ? '✅ 成功' : '❌ 失敗'
      console.log(`${index + 1}. ${test.name}: ${status}`)
      if (!test.result.success) {
        console.log(`   錯誤: ${test.result.error}`)
      }
    })
    
    return results
  }
}

// 導出便利函數
export const createNFTTestHelper = () => {
  return new NFTTestHelper()
}

// 快速測試函數
export const quickNFTTest = async () => {
  const helper = new NFTTestHelper()
  const results = await helper.runFullTest()
  return helper.formatTestResults(results)
}