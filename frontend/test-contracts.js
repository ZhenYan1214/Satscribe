// 合約整合測試腳本
// 用於驗證前端是否能正確讀取鏈上數據

import { StacksTestnet } from '@stacks/network'
import { callReadOnlyFunction, standardPrincipalCV, uintCV } from '@stacks/transactions'

const network = new StacksTestnet()
const CONTRACT_ADDRESS = 'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ'

// 測試創作者註冊合約
async function testCreatorRegistry() {
  console.log('🔍 測試創作者註冊合約...')
  
  try {
    // 測試一個假的地址是否已註冊
    const testAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'creator-registry-v5',
      functionName: 'is-registered-creator',
      functionArgs: [standardPrincipalCV(testAddress)],
      senderAddress: testAddress
    })
    
    console.log('✅ 創作者註冊合約正常，返回結果:', result)
    return true
  } catch (error) {
    console.error('❌ 創作者註冊合約測試失敗:', error.message)
    return false
  }
}

// 測試 NFT 合約
async function testNFTContract() {
  console.log('🔍 測試 NFT 合約...')
  
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'subscription-nft-v5',
      functionName: 'get-current-quarter',
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS
    })
    
    console.log('✅ NFT 合約正常，當前季度:', result)
    return true
  } catch (error) {
    console.error('❌ NFT 合約測試失敗:', error.message)
    return false
  }
}

// 測試分潤合約
async function testRevenueSplitter() {
  console.log('🔍 測試分潤合約...')
  
  try {
    const testAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'revenue-splitter-v5',
      functionName: 'get-revenue-split',
      functionArgs: [standardPrincipalCV(testAddress)],
      senderAddress: testAddress
    })
    
    console.log('✅ 分潤合約正常，返回結果:', result)
    return true
  } catch (error) {
    console.error('❌ 分潤合約測試失敗:', error.message)
    return false
  }
}

// 執行所有測試
async function runAllTests() {
  console.log('🚀 開始測試 Satscribe 合約整合...\n')
  
  const results = await Promise.all([
    testCreatorRegistry(),
    testNFTContract(),
    testRevenueSplitter()
  ])
  
  const successCount = results.filter(r => r).length
  const totalCount = results.length
  
  console.log(`\n📊 測試結果: ${successCount}/${totalCount} 合約正常運行`)
  
  if (successCount === totalCount) {
    console.log('🎉 所有合約整合測試通過！前端可以正確讀取鏈上數據。')
  } else {
    console.log('⚠️ 部分合約測試失敗，請檢查合約部署狀態。')
  }
  
  return successCount === totalCount
}

export { runAllTests }

// 如果直接執行此腳本
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests()
}