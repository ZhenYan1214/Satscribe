// 部署腳本範例
const { StacksTestnet } = require('@stacks/network');
const { 
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode
} = require('@stacks/transactions');
const { readFileSync } = require('fs');

// 測試網配置
const network = new StacksTestnet();

// 部署者私鑰（請使用實際的測試網私鑰）
const DEPLOYER_KEY = "your-testnet-private-key-here";

async function deployContract(contractName, contractSource) {
  console.log(`部署合約: ${contractName}`);
  
  const txOptions = {
    contractName: contractName,
    codeBody: contractSource,
    senderKey: DEPLOYER_KEY,
    network: network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow
  };

  const transaction = await makeContractDeploy(txOptions);
  
  try {
    const broadcastResponse = await broadcastTransaction(transaction, network);
    console.log(`${contractName} 部署成功!`);
    console.log(`交易 ID: ${broadcastResponse.txid}`);
    console.log(`Explorer: https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=testnet`);
    return broadcastResponse.txid;
  } catch (error) {
    console.error(`部署 ${contractName} 失敗:`, error);
    throw error;
  }
}

async function deployAll() {
  try {
    // 1. 部署 creator-registry（基礎合約）
    const creatorRegistrySource = readFileSync('./contracts/creator-registry.clar', 'utf8');
    await deployContract('creator-registry', creatorRegistrySource);
    
    // 等待確認
    await new Promise(resolve => setTimeout(resolve, 60000)); // 等待 1 分鐘
    
    // 2. 部署 revenue-splitter
    const revenueSplitterSource = readFileSync('./contracts/revenue-splitter.clar', 'utf8');
    await deployContract('revenue-splitter', revenueSplitterSource);
    
    // 等待確認
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    // 3. 部署 subscription-nft-improved（依賴前兩個合約）
    const subscriptionNFTSource = readFileSync('./contracts/subscription-nft-improved.clar', 'utf8');
    await deployContract('subscription-nft', subscriptionNFTSource);
    
    console.log('所有合約部署完成！');
    
  } catch (error) {
    console.error('部署過程中發生錯誤:', error);
  }
}

// 執行部署
deployAll();