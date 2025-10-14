# Satscribe NFT 購買功能 Demo 指南

## 🎯 Demo 概覽

本次更新完成了完整的 NFT 購買功能，包括：
- ✅ NFT 價格顯示修復（10 STX 正確顯示）
- ✅ 本地測試圖片支援
- ✅ 探索頁面 demo 文章（zhenyan 創作者）
- ✅ 跨錢包購買功能
- ✅ 分潤機制整合
- ✅ 合約版本修復

## 🚀 Demo 流程

### 1. 創作者端 (zhenyan 錢包)

**步驟1: 註冊創作者**
- 前往 `/creator/profile` 
- 完成創作者註冊

**步驟2: 設置分潤**
- 前往 `/creator/revenue`
- 添加團隊成員和分潤比例
- 確保總計 100%

**步驟3: 創建 NFT**
- 前往 `/creator/subscriptions`
- 點擊「創建新季度 NFT」
- 設定價格：10 STX
- 啟用分潤機制
- 上傳圖片並填寫描述

### 2. 用戶端 (不同錢包)

**步驟1: 發現 NFT**
- 前往 `/explore` 探索頁面
- 在最新文章中看到「🎨 解鎖 2025 創作之旅 - VIP 會員限量招募」
- 這是 zhenyan 15秒前發布的文章

**步驟2: 購買 NFT**
- 點擊文章中的「購買訂閱權」按鈕
- 確認購買資訊：
  - 創作者：zhenyan
  - 價格：10 STX
  - 權益：終身會員、獨家內容、早期預覽
- 確認交易

**步驟3: 驗證購買**
- 前往 `/collections` 我的收藏
- 查看新購買的 NFT
- 檢查 NFT 圖片和詳細信息

### 3. 驗證分潤機制

**在創作者儀表板檢查：**
- 前往 `/creator/dashboard`
- 查看收益統計更新
- 確認 10 STX 已按設定比例分配給團隊成員

## 🔧 技術實現

### 修復內容

1. **價格顯示修復**
   - `formatSTXAmount()` 函數增加異常處理
   - 修復重複轉換導致的天文數字問題

2. **圖片顯示優化**
   - 添加本地測試圖片 fallback
   - 創建 `/src/assets/test/` 目錄和 SVG 圖片
   - 優化圖片載入邏輯

3. **探索頁面 Demo 文章**
   - 在 `ExploreHub.vue` 添加 zhenyan 的真實可購買文章
   - 時間顯示：15秒前發布
   - 連接真實 NFT 數據 (seasonId: 20254)

4. **NFT 購買功能**
   - `EnhancedArticleCard.vue` 添加購買按鈕
   - 實現 `handleNFTPurchase()` 完整購買流程
   - 錯誤處理和用戶體驗優化

5. **合約版本修復**
   - 修復 `subscription-nft.clar` 中的版本調用
   - `revenue-splitter-v4` → `revenue-splitter-v5`
   - `creator-registry-v4` → `creator-registry-v5`

### 分潤機制流程

1. 用戶購買 NFT (10 STX)
2. 資金轉入 subscription-nft 合約
3. 觸發 `distribute-nft-revenue` 函數
4. 根據分潤設定自動分配給團隊成員
5. 更新創作者收益統計

## 🧪 測試工具

已創建 `nftTestHelper.js` 測試工具：

```javascript
import { quickNFTTest } from '@/utils/nftTestHelper'

// 在瀏覽器控制台運行
quickNFTTest()
```

## 📱 Demo 腳本

### 完整展示流程

1. **[創作者錢包]** 展示已創建的 NFT
2. **[切換到探索頁面]** 找到 zhenyan 的最新文章
3. **[切換用戶錢包]** 模擬不同用戶購買
4. **[點擊購買]** 展示購買確認和交易
5. **[查看收藏]** 展示用戶獲得的 NFT
6. **[回到創作者]** 展示收益統計更新

### 展示要點

- ✨ 圖片正常顯示（不再是空白）
- 💰 價格正確顯示（10 STX 而非天文數字）
- 🔄 跨錢包購買流暢
- 💎 分潤機制自動執行
- 📊 實時統計更新

## 🚨 注意事項

1. **錢包切換**：需要實際切換不同錢包地址來測試跨錢包購買
2. **區塊鏈確認**：交易需等待區塊鏈確認（約2-3分鐘）
3. **餘額檢查**：確保用戶錢包有足夠的 STX 進行購買
4. **網路狀態**：確保連接到正確的 Stacks 測試網

## 🎉 Demo 成果

通過這次更新，Satscribe 現在具備了：
- 完整的創作者經濟生態
- 真實可用的 NFT 購買體驗  
- 自動化分潤機制
- 跨錢包交易支援
- 美觀的用戶界面

這為 hackathon 展示提供了一個完整、可用的產品原型！