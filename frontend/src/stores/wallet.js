import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  AppConfig, 
  UserSession, 
  showConnect,
  openContractCall
} from '@stacks/connect'
import { 
  StacksMainnet, 
  StacksTestnet 
} from '@stacks/network'
import {
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  listCV,
  contractPrincipalCV,
  trueCV,
  falseCV,
  callReadOnlyFunction
} from '@stacks/transactions'

export const useWalletStore = defineStore('wallet', () => {
  // 状态
  const userSession = ref(null)
  const userData = ref(null)
  const networkType = ref('testnet') // 'mainnet' or 'testnet'
  
  // 初始化应用配置
  const appConfig = new AppConfig(['store_write', 'publish_data'])
  
  // 计算属性
  const isConnected = computed(() => {
    return userSession.value && userSession.value.isUserSignedIn()
  })
  
  const userAddress = computed(() => {
    if (userData.value?.profile?.stxAddress) {
      return networkType.value === 'mainnet' 
        ? userData.value.profile.stxAddress.mainnet
        : userData.value.profile.stxAddress.testnet
    }
    return null
  })
  
  const network = computed(() => {
    return networkType.value === 'mainnet' ? new StacksMainnet() : new StacksTestnet()
  })
  
  // 初始化用户会话
  const initUserSession = () => {
    userSession.value = new UserSession({ appConfig })
    
    if (userSession.value.isUserSignedIn()) {
      userData.value = userSession.value.loadUserData()
    }
  }
  
  // 连接钱包
  const connectWallet = () => {
    return new Promise((resolve, reject) => {
      showConnect({
        appDetails: {
          name: 'Satscribe',
          icon: '/favicon.ico'
        },
        redirectTo: '/',
        onFinish: () => {
          userData.value = userSession.value.loadUserData()
          resolve(userData.value)
        },
        onCancel: () => {
          reject(new Error('用户取消连接'))
        },
        userSession: userSession.value
      })
    })
  }
  
  // 断开钱包
  const disconnectWallet = () => {
    if (userSession.value) {
      userSession.value.signUserOut()
      userData.value = null
    }
  }
  
  // 调用合约函数
  const callContract = (contractAddress, contractName, functionName, functionArgs = []) => {
    return new Promise((resolve, reject) => {
      if (!isConnected.value) {
        reject(new Error('请先连接钱包'))
        return
      }
      
      openContractCall({
        network: network.value,
        contractAddress,
        contractName,
        functionName,
        functionArgs,
        onFinish: (data) => {
          resolve(data)
        },
        onCancel: () => {
          reject(new Error('用户取消交易'))
        }
      })
    })
  }
  
  // 只读合约调用
  const readContract = async (contractAddress, contractName, functionName, functionArgs = []) => {
    try {
      const result = await callReadOnlyFunction({
        network: network.value,
        contractAddress,
        contractName,
        functionName,
        functionArgs,
        senderAddress: userAddress.value || contractAddress
      })
      return result
    } catch (error) {
      console.error('读取合约失败:', error)
      throw error
    }
  }
  
  // 铸造订阅章 NFT
  const mintSubscriptionNFT = async (creatorAddress, seasonId, metadataUri) => {
    try {
      const result = await callContract(
        'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ', // 合约地址
        'subscription-nft-v5',
        'mint-subscription',
        [
          standardPrincipalCV(creatorAddress),
          uintCV(seasonId),
          stringAsciiCV(metadataUri)
        ]
      )
      return result
    } catch (error) {
      console.error('铸造 NFT 失败:', error)
      throw error
    }
  }
  
  // 设置分润配置
  const setRevenueSplit = async (members, lightningEnabled = false, nftEnabled = true) => {
    try {
      const membersList = members.map(member => ({
        wallet: standardPrincipalCV(member.wallet),
        percentage: uintCV(member.percentage),
        role: stringAsciiCV(member.role)
      }))
      
      const result = await callContract(
        'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ', // 合约地址
        'revenue-splitter-v5',
        'set-revenue-split',
        [
          listCV(membersList),
          lightningEnabled ? trueCV() : falseCV(),
          nftEnabled ? trueCV() : falseCV()
        ]
      )
      return result
    } catch (error) {
      console.error('设置分润失败:', error)
      throw error
    }
  }
  
  // 注册创作者
  const registerCreator = async (name, bio, avatarUri, category) => {
    try {
      console.log('📝 註冊創作者:', { name, bio, avatarUri, category, userAddress: userAddress.value })
      
      const result = await callContract(
        'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ', // 合约地址
        'creator-registry-v5',
        'register-creator',
        [
          stringAsciiCV(name),
          stringAsciiCV(bio),
          stringAsciiCV(avatarUri),
          stringAsciiCV(category)
        ]
      )
      
      console.log('✅ 創作者註冊成功:', result)
      
      // 註冊成功後，立即設置本地狀態
      if (userAddress.value) {
        setLocalRegistrationStatus(userAddress.value, true)
        console.log('💾 已更新本地註冊狀態為 true')
      }
      
      return result
    } catch (error) {
      console.error('❌ 注册创作者失败:', error)
      throw error
    }
  }
  
  // 检查订阅是否有效
  const checkSubscriptionValid = async (subscriber, creator, seasonId) => {
    try {
      const result = await readContract(
        'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ', // 合约地址
        'subscription-nft-v5',
        'is-subscription-valid',
        [
          standardPrincipalCV(subscriber),
          standardPrincipalCV(creator),
          uintCV(seasonId)
        ]
      )
      return result
    } catch (error) {
      console.error('检查订阅失败:', error)
      throw error
    }
  }
  
  // 檢查本地存儲的註冊狀態（開發期間使用）
  const checkLocalRegistrationStatus = (address) => {
    const localKey = `creator_registered_${address}_${networkType.value}`
    const isRegistered = localStorage.getItem(localKey) === 'true'
    console.log('💾 本地註冊狀態:', { address, isRegistered, key: localKey })
    return isRegistered
  }
  
  // 設置本地註冊狀態
  const setLocalRegistrationStatus = (address, isRegistered) => {
    const localKey = `creator_registered_${address}_${networkType.value}`
    if (isRegistered) {
      localStorage.setItem(localKey, 'true')
      console.log('💾 已記錄註冊狀態到本地:', address)
    } else {
      localStorage.removeItem(localKey)
      console.log('💾 已清除本地註冊狀態:', address)
    }
  }

  // 检查是否已注册创作者
  const isRegisteredCreator = async (creatorAddress = null) => {
    try {
      const addressToCheck = creatorAddress || userAddress.value
      console.log('🔍 檢查創作者註冊狀態:', {
        creatorAddress,
        userAddress: userAddress.value,
        addressToCheck,
        isConnected: isConnected.value,
        network: networkType.value
      })
      
      if (!addressToCheck) {
        console.log('❌ 沒有地址可檢查')
        return false
      }
      
      if (!isConnected.value) {
        console.log('❌ 錢包未連接')
        return false
      }
      
      // 首先檢查本地存儲狀態
      const localStatus = checkLocalRegistrationStatus(addressToCheck)
      console.log('💾 本地註冊狀態:', localStatus)
      
      try {
        console.log('📞 調用合約 is-registered-creator...')
        console.log('🏗️ 合約詳情:', {
          contractAddress: 'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ',
          contractName: 'creator-registry-v5',
          functionName: 'is-registered-creator',
          senderAddress: addressToCheck
        })
        
        // 同時調用 get-creator-info 來獲取更多信息
        console.log('🔍 同時查詢創作者資料...')
        const creatorInfo = await readContract(
          'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ',
          'creator-registry-v5',
          'get-creator-info',
          [standardPrincipalCV(addressToCheck)]
        )
        console.log('📊 創作者資料查詢結果:', creatorInfo)
        
        const result = await readContract(
          'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ', // 合约地址
          'creator-registry-v5',
          'is-registered-creator',
          [standardPrincipalCV(addressToCheck)]
        )
        
        console.log('📋 合約返回結果:', result)
        console.log('📋 合約返回結果類型:', typeof result)
        console.log('📋 合約返回結果完整結構:', JSON.stringify(result, null, 2))
        
        // 🔧 修復：使用 get-creator-info 的結果來判斷註冊狀態
        console.log('🔧 使用 get-creator-info 來判斷註冊狀態...')
        console.log('🔍 creatorInfo 詳細結構:', creatorInfo)
        
        if (creatorInfo && creatorInfo.type === 12 && creatorInfo.data) {
          console.log('🔍 creatorInfo.data:', creatorInfo.data)
          console.log('🔍 creatorInfo.data.profile:', creatorInfo.data.profile)
          
          // 檢查 profile 字段
          if (creatorInfo.data.profile) {
            if (creatorInfo.data.profile.type === 11) { // type 11 = some（有資料）
              console.log('✅ 從 get-creator-info 確認已註冊 (type 11):', true)
              setLocalRegistrationStatus(addressToCheck, true)
              return true
            } else if (creatorInfo.data.profile.type === 10) { // type 10 = none（無資料）
              console.log('✅ 從 get-creator-info 確認未註冊 (type 10):', false)
              setLocalRegistrationStatus(addressToCheck, false)
              return false
            } else if (creatorInfo.data.profile.name && creatorInfo.data.profile.name.type === 13) {
              // 直接檢查是否有 name 字段（type 13 = string-ascii）
              console.log('✅ 從 get-creator-info 確認已註冊 (有 name 字段):', true)
              setLocalRegistrationStatus(addressToCheck, true)
              return true
            }
          }
        }
        
        // 備用：檢查 is-registered-creator 的返回值
        if (result && typeof result.value === 'boolean') {
          console.log('✅ 鏈上註冊狀態:', result.value)
          setLocalRegistrationStatus(addressToCheck, result.value)
          return result.value
        } else if (result && result.type === 'bool') {
          console.log('✅ 鏈上註冊狀態 (type bool):', result.value)
          setLocalRegistrationStatus(addressToCheck, result.value)
          return result.value
        } else if (result && result.type === 4) {
          // type 4 = bool-true in Clarity
          console.log('✅ 鏈上註冊狀態 (type 4 - true):', true)
          setLocalRegistrationStatus(addressToCheck, true)
          return true
        } else if (result && result.type === 3) {
          // type 3 = bool-false in Clarity
          console.log('✅ 鏈上註冊狀態 (type 3 - false):', false)
          setLocalRegistrationStatus(addressToCheck, false)
          return false
        } else {
          console.log('⚠️ 意外的返回格式:', result)
          // 使用本地狀態作為回退
          return localStatus
        }
        
      } catch (contractError) {
        console.error('❌ 合約讀取失敗，使用本地狀態:', contractError.message)
        
        // 檢查是否是合約不存在的錯誤
        if (contractError.message && contractError.message.includes('contract not found')) {
          console.error('🚨 合約未部署！使用本地存儲作為回退')
          console.error('🚨 請檢查合約地址是否正確：ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ.creator-registry-v5')
        }
        
        // 如果是函數不存在的錯誤
        if (contractError.message && contractError.message.includes('NoSuchFunction')) {
          console.error('🚨 函數不存在！請檢查合約版本和函數名稱')
        }
        
        // 使用本地狀態作為回退
        return localStatus
      }
      
    } catch (error) {
      console.error('❌ 整體檢查失敗:', error)
      console.error('錯誤詳情:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      
      // 最後回退到 false
      return false
    }
  }
  
  // 获取创作者信息
  const getCreatorInfo = async (creatorAddress) => {
    try {
      const result = await readContract(
        'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ', // 合约地址
        'creator-registry-v5',
        'get-creator-info',
        [standardPrincipalCV(creatorAddress)]
      )
      return result
    } catch (error) {
      console.error('获取创作者信息失败:', error)
      throw error
    }
  }
  
  // STX 餘額查詢
  const getSTXBalance = async () => {
    if (!isConnected.value || !userAddress.value) {
      return 0
    }
    
    try {
      // 使用 Stacks API 查詢餘額
      const response = await fetch(`https://api.testnet.hiro.so/extended/v1/address/${userAddress.value}/balances`)
      const data = await response.json()
      
      // 轉換 microSTX 為 STX
      const microSTX = parseInt(data.stx?.balance || '0')
      return microSTX / 1000000
    } catch (error) {
      console.error('查詢餘額失敗:', error)
      return 0
    }
  }
  
  return {
    // 状态
    userSession,
    userData,
    networkType,
    
    // 计算属性
    isConnected,
    userAddress,
    network,
    
    // 方法
    initUserSession,
    connectWallet,
    disconnectWallet,
    callContract,
    readContract,
    getSTXBalance,
    
    // Satscribe 特定方法
    mintSubscriptionNFT,
    setRevenueSplit,
    registerCreator,
    checkSubscriptionValid,
    isRegisteredCreator,
    getCreatorInfo,
    
    // 本地狀態管理（開發期間）
    checkLocalRegistrationStatus,
    setLocalRegistrationStatus
  }
})