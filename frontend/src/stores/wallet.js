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
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // 合约地址
        'subscription-nft',
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
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // 合约地址
        'revenue-splitter',
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
      const result = await callContract(
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // 合约地址
        'creator-registry',
        'register-creator',
        [
          stringAsciiCV(name),
          stringAsciiCV(bio),
          stringAsciiCV(avatarUri),
          stringAsciiCV(category)
        ]
      )
      return result
    } catch (error) {
      console.error('注册创作者失败:', error)
      throw error
    }
  }
  
  // 检查订阅是否有效
  const checkSubscriptionValid = async (subscriber, creator, seasonId) => {
    try {
      const result = await readContract(
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // 合约地址
        'subscription-nft',
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
  
  // 获取创作者信息
  const getCreatorInfo = async (creatorAddress) => {
    try {
      const result = await readContract(
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // 合约地址
        'creator-registry',
        'get-creator-info',
        [standardPrincipalCV(creatorAddress)]
      )
      return result
    } catch (error) {
      console.error('获取创作者信息失败:', error)
      throw error
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
    
    // Satscribe 特定方法
    mintSubscriptionNFT,
    setRevenueSplit,
    registerCreator,
    checkSubscriptionValid,
    getCreatorInfo
  }
})