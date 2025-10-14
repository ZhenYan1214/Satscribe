// V6 合約整合測試和診斷腳本
// 用於驗證前端是否能正確讀取鏈上數據並診斷 NFT 購買問題

import { StacksTestnet } from '@stacks/network'
import { callReadOnlyFunction, standardPrincipalCV, uintCV, makeContractCall, broadcastTransaction, AnchorMode } from '@stacks/transactions'

const network = new StacksTestnet()
const CONTRACT_ADDRESS = 'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ'

// 測試創作者註冊合約
async function testCreatorRegistry() {
  console.log('🔍 測試創作者註冊合約 v6...')
  
  try {
    // 測試實際的創作者地址
    const testAddress = CONTRACT_ADDRESS // 使用部署者地址
    
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'creator-registry-v6',
      functionName: 'is-registered-creator',
      functionArgs: [standardPrincipalCV(testAddress)],
      senderAddress: testAddress
    })
    
    console.log('✅ 創作者註冊合約 v6 正常，返回結果:', result)
    return true
  } catch (error) {
    console.error('❌ 創作者註冊合約 v6 測試失敗:', error.message)
    return false
  }
}

// 測試 NFT 合約
async function testNFTContract() {
  console.log('🔍 測試 NFT 合約 v6...')
  
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'subscription-nft-v6',
      functionName: 'get-current-quarter',
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS
    })
    
    console.log('✅ NFT 合約 v6 正常，當前季度:', result)
    return true
  } catch (error) {
    console.error('❌ NFT 合約 v6 測試失敗:', error.message)
    return false
  }
}

// 診斷季度 20254 的狀態
async function diagnoseSeason20254() {
  console.log('🔍 診斷季度 20254 狀態...')
  
  try {
    const creatorAddress = CONTRACT_ADDRESS
    
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'subscription-nft-v6',
      functionName: 'get-season-info',
      functionArgs: [
        standardPrincipalCV(creatorAddress),
        uintCV(20254)
      ],
      senderAddress: creatorAddress
    })
    
    console.log('📊 季度 20254 狀態:', result)
    
    // 解析結果
    if (result && result.value) {
      console.log('🔍 詳細解析 Clarity 數據結構...')
      console.log('原始結果類型:', result.type)
      console.log('原始結果值類型:', result.value.type)
      
      let seasonData = result.value
      
      // 如果是 tuple 類型 (type: 12)，提取 data
      if (seasonData.type === 12 && seasonData.data) {
        seasonData = seasonData.data
        console.log('提取的 tuple 數據:', seasonData)
        
        // 解析每個字段
        const parsedData = {}
        for (const [key, value] of Object.entries(seasonData)) {
          console.log(`解析字段 "${key}" (類型: ${value.type}):`)
          if (value.type === 3) { // bool-false
            parsedData[key] = false
            console.log(`  -> false`)
          } else if (value.type === 4) { // bool-true  
            parsedData[key] = true
            console.log(`  -> true`)
          } else if (value.type === 1 || value.type === 2) { // int/uint
            const numValue = typeof value.value === 'bigint' ? Number(value.value) : parseInt(value.value || value.data)
            parsedData[key] = numValue
            console.log(`  -> ${numValue}`)
          } else if (value.type === 13 || value.type === 14) { // string
            const strValue = value.data || ''
            parsedData[key] = strValue
            console.log(`  -> "${strValue}"`)
          } else {
            const otherValue = value.value || value.data || value
            parsedData[key] = otherValue
            console.log(`  -> ${otherValue} (類型未知)`)
          }
        }
        
        console.log('🔍 詳細分析:')
        console.log('  - Active:', parsedData.active)
        console.log('  - Price:', parsedData.price, 'microSTX =', (parsedData.price / 1000000).toFixed(2), 'STX')
        console.log('  - Current Supply:', parsedData['current-supply'])
        console.log('  - Revenue Split Enabled:', parsedData['revenue-split-enabled'])
        console.log('  - Created At:', parsedData['created-at'])
        console.log('  - Image URI:', parsedData['image-uri'])
        console.log('  - Description:', parsedData.description)
      } else {
        console.log('🔍 詳細分析:')
        console.log('  - 無法解析數據結構，類型:', seasonData.type)
      }
    }
    
    return true
  } catch (error) {
    console.error('❌ 季度 20254 診斷失敗:', error.message)
    return false
  }
}

// 測試分潤合約
async function testRevenueSplitter() {
  console.log('🔍 測試分潤合約 v6...')
  
  try {
    const testAddress = CONTRACT_ADDRESS // 使用部署者地址
    
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'revenue-splitter-v6',
      functionName: 'get-revenue-split',
      functionArgs: [standardPrincipalCV(testAddress)],
      senderAddress: testAddress
    })
    
    console.log('✅ 分潤合約 v6 正常，返回結果:', result)
    
    // 解析分潤配置
    if (result && result.value) {
      console.log('🔍 分潤配置分析:')
      console.log('  原始數據:', JSON.stringify(result, null, 2))
    }
    
    return true
  } catch (error) {
    console.error('❌ 分潤合約 v6 測試失敗:', error.message)
    return false
  }
}

// 執行所有測試和診斷
async function runAllTests() {
  console.log('🚀 開始測試 Satscribe V6 合約整合和診斷...\n')
  
  const results = await Promise.all([
    testCreatorRegistry(),
    testNFTContract(),
    testRevenueSplitter()
  ])
  
  const successCount = results.filter(r => r).length
  const totalCount = results.length
  
  console.log(`\n📊 基本測試結果: ${successCount}/${totalCount} 合約正常運行`)
  
  // 執行特定診斷
  console.log('\n🔍 執行問題診斷...')
  await diagnoseSeason20254()
  
  if (successCount === totalCount) {
    console.log('\n🎉 所有合約整合測試通過！前端可以正確讀取鏈上數據。')
  } else {
    console.log('\n⚠️ 部分合約測試失敗，請檢查合約部署狀態。')
  }
  
  return successCount === totalCount
}

// 專門的診斷函數
async function runDiagnostics() {
  console.log('🔍 開始 NFT 購買問題診斷...\n')
  
  await diagnoseSeason20254()
  
  console.log('\n📋 診斷完成，請查看上述詳細信息。')
  
  // 生成解決方案指令
  generateActivationInstructions()
}

// 生成激活指令
function generateActivationInstructions() {
  console.log('\n🔧 NFT 季度激活指令生成器')
  console.log('===============================')
  console.log('\n根據診斷，需要激活季度 20254。請按照以下步驟操作:')
  console.log('\n步驟 1: 確保已連接創作者錢包')
  console.log('- 打開前端應用 (npm run dev)')
  console.log('- 使用部署合約的錢包連接')
  console.log(`- 確認錢包地址是: ${CONTRACT_ADDRESS}`)
  
  console.log('\n步驟 2: 在瀏覽器控制台執行激活代碼')
  console.log('- 打開開發者工具 (F12)')
  console.log('- 切換到 Console 標籤')
  console.log('- 複製並粘貼以下代碼:')
  
  console.log('\n--- 激活代碼 (複製全部) ---')
  console.log(`import { uintCV } from '@stacks/transactions'
const contractsStore = useContractsStore()
console.log('🔄 正在激活季度 20254...')
const result = await contractsStore.walletStore.callContract(
  '${CONTRACT_ADDRESS}',
  'subscription-nft-v6', 
  'toggle-season-status',
  [uintCV(20254)]
)
console.log('✅ 激活結果:', result)`)
  console.log('--- 代碼結束 ---')
  
  console.log('\n步驟 3: 驗證激活結果')
  console.log('- 等待交易在區塊鏈確認 (通常 1-2 分鐘)')
  console.log('- 重新運行此診斷腳本:')
  console.log('  node test-contracts.js')
  console.log('- 確認輸出顯示 "Active: true"')
  
  console.log('\n步驟 4: 測試 NFT 購買')
  console.log('- 使用不同的錢包地址測試購買')
  console.log('- 確認分潤功能正常工作')
  console.log('\n🎉 完成後，用戶將能夠成功購買 NFT!')
}

export { runAllTests, runDiagnostics, diagnoseSeason20254, generateActivationInstructions }

// 如果直接執行此腳本
if (process.argv[1] && process.argv[1].includes('test-contracts.js')) {
  console.log('🚀 直接執行腳本，開始診斷...')
  runDiagnostics().catch(console.error)
}