import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useWalletStore } from './wallet'
import {
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  listCV,
  tupleCV,
  boolCV
} from '@stacks/transactions'

export const useContractsStore = defineStore('contracts', () => {
  const walletStore = useWalletStore()
  
  // 合約地址（測試網部署地址）
  const CONTRACT_ADDRESS = ref('ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ')
  
  // 載入狀態
  const isLoading = ref(false)
  const error = ref(null)
  
  // 數據緩存
  const creatorInfoCache = ref(new Map())
  const seasonInfoCache = ref(new Map())
  const revenueSplitCache = ref(new Map())
  
  // 清除緩存
  const clearCache = (type, key) => {
    if (type === 'creator' || type === 'all') {
      if (key) {
        creatorInfoCache.value.delete(key)
      } else {
        creatorInfoCache.value.clear()
      }
    }
    if (type === 'season' || type === 'all') {
      if (key) {
        seasonInfoCache.value.delete(key)
      } else {
        seasonInfoCache.value.clear()
      }
    }
    if (type === 'revenue' || type === 'all') {
      if (key) {
        revenueSplitCache.value.delete(key)
      } else {
        revenueSplitCache.value.clear()
      }
    }
  }
  
  // 自動重新載入數據
  const reloadData = async (userAddress) => {
    if (userAddress) {
      try {
        // 重新載入創作者資訊
        await getCreatorInfo(userAddress, true)
        // 重新載入分潤設定
        await getRevenueSplit(userAddress, true)
        console.log('數據已自動重新載入')
      } catch (error) {
        console.log('自動重新載入數據時發生錯誤:', error)
      }
    }
  }
  
  // =================== 創作者註冊 ===================
  const registerCreator = async (creatorData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await walletStore.callContract(
        CONTRACT_ADDRESS.value,
        'creator-registry',
        'register-creator',
        [
          stringAsciiCV(creatorData.name),
          stringAsciiCV(creatorData.bio),
          stringAsciiCV(creatorData.avatarUri),
          stringAsciiCV(creatorData.category)
        ]
      )
      
      console.log('創作者註冊成功:', result)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // =================== 分潤設定 ===================
  const setupRevenueSplit = async (teamMembers) => {
    isLoading.value = true
    error.value = null
    
    try {
      // 驗證百分比總和
      const totalPercentage = teamMembers.reduce((sum, member) => sum + member.percentage, 0)
      if (totalPercentage !== 100) {
        throw new Error('分潤比例總和必須等於 100%')
      }
      
      // 構建團隊成員列表
      const membersList = teamMembers.map(member => 
        tupleCV({
          wallet: standardPrincipalCV(member.walletAddress),
          percentage: uintCV(member.percentage),
          role: stringAsciiCV(member.role)
        })
      )
      
      const result = await walletStore.callContract(
        CONTRACT_ADDRESS.value,
        'revenue-splitter',
        'set-revenue-split',
        [
          listCV(membersList),
          boolCV(false), // lightning-enabled (暫時關閉)
          boolCV(true)   // nft-enabled
        ]
      )
      
      console.log('分潤設定成功:', result)
      
      // 清除相關緩存並重新載入數據
      clearCache('revenue', walletStore.userAddress)
      setTimeout(() => {
        reloadData(walletStore.userAddress)
      }, 2000) // 等待區塊確認後重新載入
      
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // =================== 季度管理 ===================
  // 新的自動季度創建函數
  const createSeasonAuto = async (nftData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await walletStore.callContract(
        CONTRACT_ADDRESS.value,
        'subscription-nft',
        'create-season-auto',
        [
          uintCV(nftData.price * 1000000), // 轉換為 microSTX
          stringAsciiCV(nftData.imageUri),
          stringAsciiCV(nftData.description),
          boolCV(nftData.enableRevenueSplit)
        ]
      )
      
      console.log('自動季度創建成功:', result)
      
      // 清除相關緩存並重新載入數據
      clearCache('season', walletStore.userAddress)
      setTimeout(() => {
        reloadData(walletStore.userAddress)
      }, 2000)
      
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // 舊版季度創建函數（保持兼容性）
  const createSeason = async (seasonData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await walletStore.callContract(
        CONTRACT_ADDRESS.value,
        'subscription-nft',
        'create-season',
        [
          uintCV(seasonData.seasonId),
          uintCV(seasonData.price * 1000000), // 轉換為 microSTX
          uintCV(seasonData.maxSupply || 9999),
          uintCV(seasonData.expiryDate || Math.floor(Date.now() / 1000) + 86400 * 90),
          stringAsciiCV(seasonData.tier || 'VIP'),
          boolCV(seasonData.enableRevenueSplit)
        ]
      )
      
      console.log('季度創建成功:', result)
      
      // 清除相關緩存並重新載入數據
      clearCache('season', `${walletStore.userAddress}_${seasonData.seasonId}`)
      setTimeout(() => {
        reloadData(walletStore.userAddress)
      }, 2000) // 等待區塊確認後重新載入
      
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // =================== NFT 購買 ===================
  const purchaseNFT = async (creatorAddress, seasonId, metadataUri) => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await walletStore.callContract(
        CONTRACT_ADDRESS.value,
        'subscription-nft',
        'mint-subscription',
        [
          standardPrincipalCV(creatorAddress),
          uintCV(seasonId),
          stringAsciiCV(metadataUri)
        ]
      )
      
      console.log('NFT 購買成功:', result)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // =================== 查詢函數 ===================
  const getCreatorInfo = async (creatorAddress, forceRefresh = false) => {
    try {
      // 檢查緩存
      if (!forceRefresh && creatorInfoCache.value.has(creatorAddress)) {
        console.log('從緩存載入創作者資訊:', creatorAddress)
        return creatorInfoCache.value.get(creatorAddress)
      }
      
      const result = await walletStore.readContract(
        CONTRACT_ADDRESS.value,
        'creator-registry',
        'get-creator-info',
        [standardPrincipalCV(creatorAddress)]
      )
      
      // 存入緩存
      if (result) {
        creatorInfoCache.value.set(creatorAddress, result)
        console.log('創作者資訊已更新:', creatorAddress)
      }
      
      return result
    } catch (err) {
      console.error('查詢創作者資訊失敗:', err)
      return null
    }
  }
  
  // 獲取增強季度信息
  const getEnhancedSeasonInfo = async (creatorAddress, seasonId, forceRefresh = false) => {
    try {
      const cacheKey = `enhanced_${creatorAddress}_${seasonId}`
      
      // 檢查緩存
      if (!forceRefresh && seasonInfoCache.value.has(cacheKey)) {
        console.log('從緩存載入增強季度資訊:', cacheKey)
        return seasonInfoCache.value.get(cacheKey)
      }
      
      const result = await walletStore.readContract(
        CONTRACT_ADDRESS.value,
        'subscription-nft',
        'get-enhanced-season-info',
        [
          standardPrincipalCV(creatorAddress),
          uintCV(seasonId)
        ]
      )
      
      // 解析結果
      const parsedResult = parseContractResponse(result)
      
      // 存入緩存
      if (parsedResult) {
        seasonInfoCache.value.set(cacheKey, parsedResult)
        console.log('增強季度資訊已更新:', cacheKey, parsedResult)
      }
      
      return parsedResult
    } catch (err) {
      console.error('查詢增強季度資訊失敗:', err)
      return null
    }
  }
  
  // 舊版季度信息獲取（保持兼容性）
  const getSeasonInfo = async (creatorAddress, seasonId, forceRefresh = false) => {
    try {
      const cacheKey = `${creatorAddress}_${seasonId}`
      
      // 檢查緩存
      if (!forceRefresh && seasonInfoCache.value.has(cacheKey)) {
        console.log('從緩存載入季度資訊:', cacheKey)
        return seasonInfoCache.value.get(cacheKey)
      }
      
      const result = await walletStore.readContract(
        CONTRACT_ADDRESS.value,
        'subscription-nft',
        'get-season-info',
        [
          standardPrincipalCV(creatorAddress),
          uintCV(seasonId)
        ]
      )
      
      // 解析結果
      const parsedResult = parseContractResponse(result)
      
      // 存入緩存
      if (parsedResult) {
        seasonInfoCache.value.set(cacheKey, parsedResult)
        console.log('季度資訊已更新:', cacheKey)
      }
      
      return parsedResult
    } catch (err) {
      console.error('查詢季度資訊失敗:', err)
      return null
    }
  }
  
  // 獲取當前季度信息
  const getCurrentQuarterInfo = async () => {
    try {
      const result = await walletStore.readContract(
        CONTRACT_ADDRESS.value,
        'subscription-nft',
        'get-current-quarter-info',
        []
      )
      
      return parseContractResponse(result)
    } catch (err) {
      console.error('查詢當前季度資訊失敗:', err)
      return null
    }
  }
  
  const checkSubscriptionValid = async (subscriber, creator, seasonId) => {
    try {
      const result = await walletStore.readContract(
        CONTRACT_ADDRESS.value,
        'subscription-nft',
        'is-subscription-valid',
        [
          standardPrincipalCV(subscriber),
          standardPrincipalCV(creator),
          uintCV(seasonId)
        ]
      )
      
      return result
    } catch (err) {
      console.error('檢查訂閱狀態失敗:', err)
      return false
    }
  }
  
  const getRevenueSplit = async (creatorAddress, forceRefresh = false, retryCount = 0) => {
    try {
      // 檢查緩存
      if (!forceRefresh && revenueSplitCache.value.has(creatorAddress)) {
        console.log('從緩存載入分潤設定:', creatorAddress)
        return revenueSplitCache.value.get(creatorAddress)
      }
      
      console.log('從區塊鏈載入分潤設定...', creatorAddress)
      
      const result = await walletStore.readContract(
        CONTRACT_ADDRESS.value,
        'revenue-splitter',
        'get-revenue-split',
        [standardPrincipalCV(creatorAddress)]
      )
      
      // 存入緩存
      if (result) {
        revenueSplitCache.value.set(creatorAddress, result)
        console.log('分潤設定已更新:', creatorAddress)
      }
      
      return result
    } catch (err) {
      console.error('查詢分潤設定失敗:', err)
      
      // 如果是 API 限流錯誤且重試次數不超過 3 次，則延遲後重試
      if ((err.message.includes('429') || err.message.includes('Too Many Requests')) && retryCount < 3) {
        console.log(`API 限流，${2 ** retryCount * 2} 秒後重試... (${retryCount + 1}/3)`)
        await new Promise(resolve => setTimeout(resolve, 2 ** retryCount * 2000))
        return getRevenueSplit(creatorAddress, forceRefresh, retryCount + 1)
      }
      
      return null
    }
  }
  
  // =================== 工具函數 ===================
  const formatSTXAmount = (microSTX) => {
    return (microSTX / 1000000).toFixed(2)
  }
  
  const parseContractResponse = (response) => {
    // 解析合約返回的複雜 Clarity 數據結構
    if (!response) return null
    
    // 如果是 ok 結果，提取 value
    if (response.type === 'ok' && response.value) {
      return parseClarityValue(response.value)
    }
    
    // 如果有 value 屬性，直接解析
    if (response.value) {
      return parseClarityValue(response.value)
    }
    
    return parseClarityValue(response)
  }
  
  // 解析 Clarity 數據值
  const parseClarityValue = (value) => {
    if (!value) return null
    
    // 根據 Clarity 數據類型進行解析
    switch (value.type) {
      case 1: // int/uint
        console.log('解析 type 1 (int/uint):', value)
        if (value.value !== undefined) {
          // 處理 BigInt
          return typeof value.value === 'bigint' ? Number(value.value) : parseInt(value.value)
        }
        return 0
        
      case 2: // uint
        console.log('解析 type 2 (uint):', value)
        if (value.value !== undefined) {
          // 處理 BigInt
          return typeof value.value === 'bigint' ? Number(value.value) : parseInt(value.value)
        }
        return 0
        
      case 3: // buffer or bool (depends on context)
        console.log('解析 type 3:', value)
        if (value.buffer !== undefined) {
          return value.buffer
        }
        // 有時候 boolean false 會是 type 3
        if (value.data !== undefined) {
          return value.data
        }
        return false
        
      case 4: // bool-true
        console.log('解析 bool-true:', value)
        return true
        
      case 5: // principal-standard (based on debug data)
        console.log('解析 type 5 (principal):', value)
        if (value.address) {
          // 處理複雜的地址結構
          if (typeof value.address === 'string') {
            return value.address
          } else if (value.address.hash160 && value.address.version !== undefined) {
            // 簡化處理 - 暫時返回 hash160 作為調試
            console.log('需要轉換的地址結構:', value.address)
            return `[hash160:${value.address.hash160.slice(0, 16)}...]`
          }
          return value.address
        }
        return value
        
      case 6: // principal-standard
        console.log('解析 principal-standard:', value)
        if (value.address) {
          if (typeof value.address === 'string') {
            return value.address
          } else if (value.address.hash160 && value.address.version !== undefined) {
            // 這是 Stacks 地址的內部表示，需要轉換
            return value.address.hash160 || String(value.address)
          }
          return value.address
        }
        return value
        
      case 7: // principal-contract
        console.log('解析 principal-contract:', value)
        return `${value.address}.${value.contractName}`
        
      case 8: // response-ok
        return parseClarityValue(value.value)
        
      case 9: // response-err
        return { error: parseClarityValue(value.value) }
        
      case 10: // none
        return null
        
      case 11: // some
        console.log('解析 some 類型:', value)
        if (value.value) {
          return parseClarityValue(value.value)
        }
        // 特殊情況：某些 some 類型的數據可能直接在 list 中
        if (value.list) {
          console.log('some 類型數據在 list 中:', value.list)
          return value.list.map(item => parseClarityValue(item))
        }
        // 檢查其他可能的屬性
        if (value.data) {
          return parseClarityValue(value.data)
        }
        return null
        
      case 12: // tuple
        console.log('解析 tuple 類型:', value)
        if (value.data) {
          const result = {}
          for (const [key, val] of Object.entries(value.data)) {
            console.log(`解析 tuple 字段 "${key}":`, val)
            result[key] = parseClarityValue(val)
          }
          console.log('tuple 解析結果:', result)
          return result
        }
        return value
        
      case 13: // string-ascii (based on debug data showing role: {type: 13, data: 'creator'})
        console.log('解析 type 13 (string-ascii):', value)
        if (value.data !== undefined) {
          return value.data
        }
        // 備用：檢查是否是 list 結構
        if (Array.isArray(value.list)) {
          console.log('type 13 作為 list 解析:', value.list)
          return value.list.map(item => parseClarityValue(item))
        }
        if (value.data && Array.isArray(value.data)) {
          return value.data.map(item => parseClarityValue(item))
        }
        return value.data || ''
        
      case 14: // string-ascii
        return value.data
        
      case 15: // string-utf8
        return value.data
        
      // 兼容舊的字符串格式
      case 'tuple':
        if (value.data) {
          const result = {}
          for (const [key, val] of Object.entries(value.data)) {
            result[key] = parseClarityValue(val)
          }
          return result
        }
        return value
        
      case 'list':
        if (Array.isArray(value.list)) {
          return value.list.map(item => parseClarityValue(item))
        }
        return value
        
      case 'principal':
        return value.address
        
      case 'uint':
        return parseInt(value.value)
        
      case 'string-ascii':
      case 'string-utf8':
        return value.data
        
      case 'bool':
        return value.value
        
      case 'none':
        return null
        
      case 'some':
        return parseClarityValue(value.value)
        
      default:
        // 如果是簡單值，直接返回
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          return value
        }
        
        console.log('無法解析的 Clarity 數據類型:', value)
        return value
    }
  }
  
  return {
    // 狀態
    CONTRACT_ADDRESS,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    
    // 創作者相關
    registerCreator,
    getCreatorInfo,
    
    // 分潤相關
    setupRevenueSplit,
    getRevenueSplit,
    
    // 季度和 NFT 相關
    createSeason,
    createSeasonAuto,
    purchaseNFT,
    getSeasonInfo,
    getEnhancedSeasonInfo,
    getCurrentQuarterInfo,
    checkSubscriptionValid,
    
    // 緩存管理
    clearCache,
    reloadData,
    
    // 工具函數
    formatSTXAmount,
    parseContractResponse,
    parseClarityValue
  }
})