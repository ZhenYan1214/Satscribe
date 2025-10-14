# 🚀 Satscribe V6 部署和測試指南

## 📋 修復摘要

### ✅ 已修復的價格問題
- **原問題**: 10 STX → 10,000,000,000,000 microSTX (錯誤的雙重轉換)
- **修復後**: 10 STX → 10,000,000 microSTX (正確的單次轉換)
- **安全機制**: 添加了價格驗證，防止超過1000 STX的異常值

### ✅ 已完成的升級
1. **合約版本升級**: 所有合約名稱升級為 v6
2. **前端整合**: 探索頁面現在讀取真實的鏈上數據
3. **價格安全**: 多重驗證機制防止價格轉換錯誤
4. **部署配置**: 更新了所有 Clarinet 配置文件

## 🛠️ 部署步驟

### 1. 部署 V6 合約

```bash
cd contracts
clarinet deploy --testnet
```

預期輸出:
```
✅ creator-registry-v6 deployed
✅ revenue-splitter-v6 deployed  
✅ subscription-nft-v6 deployed
```

### 2. 設置分潤配置

使用 Clarinet console 或前端設置分潤:

```clarity
(contract-call? .revenue-splitter-v6 set-revenue-split
  (list 
    {wallet: 'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ, percentage: u60, role: "creator"}
    {wallet: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5, percentage: u25, role: "developer"} 
    {wallet: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG, percentage: u15, role: "designer"}
  )
  true  ;; NFT分潤啟用
  false ;; Lightning分潤暫停
)
```

### 3. 創建正確價格的 NFT

使用前端創作者介面或直接調用合約:

```clarity
(contract-call? .subscription-nft-v6 create-season
  u20255          ;; 新的季度ID (2025年第5季)
  u10000000       ;; 10 STX (正確的microSTX)
  u9999           ;; 最大供應量
  u1768137893     ;; 過期時間
  "VIP"           ;; 層級
  true            ;; 啟用分潤
)
```

## 🧪 測試流程

### 第一階段: 合約驗證

1. **檢查合約部署**:
   ```bash
   clarinet check
   ```

2. **驗證合約調用**:
   ```clarity
   ;; 檢查季度信息
   (contract-call? .subscription-nft-v6 get-season-info 
     'ST2FGWKW4M6KBY2P19WZRDH9TCDMGMTDGA2D301HQ u20255)
   
   ;; 應該返回: price: u10000000 (10 STX)
   ```

### 第二階段: 前端測試

1. **啟動前端**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **測試步驟**:
   - 連接錢包
   - 前往探索頁面
   - 確認看到真實的創作者NFT
   - 檢查價格顯示為 "10.00 STX"
   - 嘗試購買NFT

### 第三階段: 購買測試

1. **用戶購買流程**:
   - 使用新錢包地址
   - 確保餘額 > 10 STX
   - 購買創作者的NFT
   - 檢查交易成功

2. **分潤驗證**:
   - 檢查創作者錢包: +6 STX (60%)
   - 檢查開發者錢包: +2.5 STX (25%)  
   - 檢查設計師錢包: +1.5 STX (15%)

## ✅ 預期結果

### 成功指標:
- ✅ NFT價格正確顯示 "10.00 STX"
- ✅ 購買交易成功執行
- ✅ 分潤按比例正確分配
- ✅ 用戶收藏頁面顯示購買的NFT
- ✅ 創作者dashboard更新統計數據

### 價格驗證:
```
用戶輸入: 10 STX
前端轉換: 10 * 1,000,000 = 10,000,000 microSTX
合約存儲: u10000000
前端顯示: 10,000,000 / 1,000,000 = 10.00 STX ✅
```

## 🔧 故障排除

### 如果價格仍然異常:
1. 檢查瀏覽器控制台的價格轉換日誌
2. 驗證 `formatSTXAmount` 函數是否正確處理數值
3. 確認前端使用的是 v6 合約地址

### 如果購買失敗:
1. 檢查錢包餘額和網路連接
2. 確認創作者已設置分潤配置
3. 驗證季度NFT存在且活躍

### 如果分潤未執行:
1. 檢查分潤配置總百分比 = 100%
2. 確認NFT創建時啟用了分潤
3. 查看合約調用日誌

## 📞 測試聯絡

準備好測試時，請:
1. 部署 V6 合約
2. 使用新錢包地址測試購買
3. 驗證整個流程正常運作
4. 確認分潤機制正確執行

**重要**: 現在價格轉換已修復，NFT創建時輸入10 STX將正確存儲為10,000,000 microSTX，而不是之前的10,000,000,000,000！