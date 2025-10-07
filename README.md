# Satscribe - Creator-Fi 平台

去中心化的創作者支持與訂閱平台，基於 Stacks 區塊鏈構建。

## 🎯 專案概述

Satscribe 是一個創新的 Creator-Fi 平台，將創作者支持轉化為可收藏的鏈上資產。透過不可轉讓的訂閱章 NFT 和智慧分潤機制，為創作者提供真正的收入自主權。

### 核心特色

- **可收藏的支持證明**：訂閱章作為 Soulbound Token，記錄每一次支持
- **智慧分潤機制**：基於 Clarity 智慧合約的透明收益分配
- **雙重支付方式**：STX 訂閱 + Lightning Network 打賞
- **雙角色介面**：使用者模式與創作者模式一鍵切換

## 🏗️ 技術架構

### 前端 (Vue 3)
- **框架**：Vue 3 + Vite
- **狀態管理**：Pinia
- **UI 框架**：Tailwind CSS
- **錢包整合**：@stacks/connect (Leather Wallet)

### 智慧合約 (Clarity)
- **subscription-nft.clar**：訂閱章 NFT 合約 (Soulbound Token)
- **revenue-splitter.clar**：收益分潤合約
- **creator-registry.clar**：創作者註冊表合約

### 區塊鏈
- **主鏈**：Stacks (Bitcoin Layer 2)
- **網路**：支援 Mainnet 和 Testnet
- **錢包**：Leather Wallet

## 📁 專案結構

```
satscribe-project/
├── frontend/                 # Vue 3 前端專案
│   ├── src/
│   │   ├── views/
│   │   │   ├── user/         # 使用者端頁面
│   │   │   └── creator/      # 創作者端頁面
│   │   ├── stores/           # Pinia 狀態管理
│   │   ├── components/       # Vue 組件
│   │   └── utils/           # 工具函數
│   └── package.json
├── contracts/                # Clarity 智慧合約
│   ├── contracts/           # 合約檔案
│   │   ├── subscription-nft.clar
│   │   ├── revenue-splitter.clar
│   │   └── creator-registry.clar
│   ├── tests/              # 合約測試
│   └── Clarinet.toml       # Clarinet 配置
└── backend/                # 後端服務 (待開發)
```

## 🚀 快速開始

### 前置要求

- Node.js 18+
- npm 或 yarn
- Clarinet (用於智慧合約開發)
- Leather Wallet 瀏覽器擴充功能

### 安裝相依性

```bash
# 前端相依性
cd frontend
npm install

# 智慧合約工具
npm install -g @hirosystems/clarinet-cli
```

### 執行開發環境

```bash
# 啟動前端開發伺服器
cd frontend
npm run dev

# 啟動 Clarinet 本地網路 (另一個終端)
cd contracts
clarinet integrate
```

### 部署合約 (測試網)

```bash
cd contracts
clarinet console
```

## 💡 功能特性

### 使用者端功能
- 🏠 **首頁瀏覽**：發現優質創作者和內容
- 👤 **創作者頁面**：查看創作者資料和訂閱選項
- 💎 **購買訂閱章**：使用 STX 購買不可轉讓的紀念 NFT
- 📚 **我的收藏**：展示已購買的訂閱章
- ⚡ **Lightning 打賞**：小額 sats 打賞 (Phase 2)

### 創作者端功能
- 📊 **儀表板**：收益、訂閱者、內容統計
- ✍️ **內容管理**：發布和管理內容
- 🎫 **訂閱章管理**：創建和配置訂閱 NFT
- 💰 **分潤設定**：配置工作室成員收益分配
- 📈 **數據分析**：粉絲數據和收益報表

## 🔗 智慧合約功能

### 訂閱章 NFT 合約
- 鑄造不可轉讓的訂閱憑證
- 期別管理和到期機制
- 會員權限驗證

### 分潤合約
- 動態配置分潤比例
- 自動收益分配
- 透明的分潤記錄

### 創作者註冊表
- 創作者資料管理
- 統計數據記錄
- 驗證機制

## 🛣️ 開發路線圖

### Phase 1 (MVP)
- [x] 基礎前端框架
- [x] 核心智慧合約
- [ ] 錢包整合測試
- [ ] 內容管理後端
- [ ] 基礎功能測試

### Phase 2
- [ ] Lightning Network 整合
- [ ] 內容推薦演算法
- [ ] 社交功能
- [ ] 行動端適配

### Phase 3
- [ ] DAO 治理
- [ ] 進階數據分析
- [ ] API 開放平台
- [ ] 跨鏈擴展

## 🤝 貢獻指南

1. Fork 本儲存庫
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權條款

本專案採用 MIT 授權條款 - 查看 [LICENSE](LICENSE) 檔案了解詳情。

## 📞 聯絡方式

- **專案連結**：[https://github.com/your-username/satscribe](https://github.com/your-username/satscribe)
- **問題回報**：[Issues](https://github.com/your-username/satscribe/issues)

---

**Satscribe** - 讓每一份支持都被記錄，讓創作者擁有真正的收入自主權。# Satscribe
