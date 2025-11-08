# 🚀 快速開始指南 (Gemini 版本)

## ⚡ 10分鐘完成部署

### 第 1 步：獲取 Gemini API Key（3分鐘）

1. 訪問：https://makersuite.google.com/app/apikey
2. 用 Google 帳號登入
3. 點擊 "Create API Key"
4. 選擇或創建一個 Google Cloud 專案
5. 複製 API Key（格式：`AIza...`）
6. ✅ 完成！Gemini API 有免費額度！

---

### 第 2 步：獲取 Google OAuth Client ID（5分鐘）

#### 為什麼需要？
用於 Google 登入功能，讓用戶可以用 Google 帳號登入聊天。

#### 步驟：

1. **訪問 Google Cloud Console**
   https://console.cloud.google.com/apis/credentials

2. **創建專案**（如果沒有）
   - 點擊頂部的專案選擇器
   - 點擊 "New Project"
   - 輸入專案名稱：`Travel AI Bestie`
   - 點擊 "Create"

3. **啟用 API**
   - 左側選單 → "Library"
   - 搜尋 "Google+ API"
   - 點擊並啟用

4. **創建 OAuth 2.0 Client ID**
   - 返回 "Credentials" 頁面
   - 點擊 "+ CREATE CREDENTIALS"
   - 選擇 "OAuth 2.0 Client ID"
   
5. **配置 OAuth 同意畫面**（如果是第一次）
   - User Type: External
   - App name: Travel AI Bestie
   - User support email: 您的 email
   - Developer contact: 您的 email
   - 儲存並繼續

6. **設置 Client ID**
   - 應用程式類型：**Web application**
   - 名稱：Travel AI Bestie
   - 授權的 JavaScript 來源：
     - `http://localhost:8888` (本地測試)
     - `https://your-site.netlify.app` (部署後添加)
   - 點擊 "CREATE"

7. **複製 Client ID**
   - 格式：`xxxxx-xxxxx.apps.googleusercontent.com`
   - ✅ 保存好這個 ID！

---

### 第 3 步：部署到 Netlify（2分鐘）

#### 選項 A：拖放部署（推薦！）

1. 訪問：https://app.netlify.com/drop
2. 拖放整個 `travel-ai-bestie-gemini` 資料夾
3. 等待上傳完成
4. ✅ 獲得您的網站網址！

#### 選項 B：GitHub 部署

1. 推送到 GitHub
2. 在 Netlify 連接 repo
3. 自動部署

---

### 第 4 步：設置環境變數（1分鐘）

1. 在 Netlify Dashboard
2. 點擊您的網站
3. Site settings → Environment variables
4. 添加：
   ```
   Key: GEMINI_API_KEY
   Value: 貼上您的 Gemini API Key
   ```
5. 點擊 "Save"

---

### 第 5 步：設置 Google Client ID（1分鐘）

1. 下載部署後的網站的 `index.html`
2. 或者在本地編輯，找到第 426 行：

```javascript
client_id: 'YOUR_GOOGLE_CLIENT_ID',
```

改為：

```javascript
client_id: '您的Client_ID.apps.googleusercontent.com',
```

3. 重新上傳或提交到 GitHub

---

### 第 6 步：更新 OAuth 設置

1. 返回 Google Cloud Console
2. 編輯您的 OAuth Client ID
3. 添加授權的 JavaScript 來源：
   ```
   https://your-actual-site.netlify.app
   ```
4. 儲存

---

### 第 7 步：重新部署並測試

1. Netlify → Deploys → Trigger deploy
2. 等待完成（約1分鐘）
3. 訪問您的網站
4. 點擊 Google 登入
5. 嘗試問問題
6. ✅ 成功！🎉

---

## ✅ 檢查清單

部署前：
```
☐ 已獲取 Gemini API Key
☐ 已獲取 Google OAuth Client ID
☐ 已設置 Netlify 環境變數
☐ 已在 index.html 設置 Client ID
☐ 已在 Google Console 添加網站網址
```

測試：
```
☐ 網站可以訪問
☐ 可以用 Google 登入
☐ 點擊快速提問有反應
☐ AI 有回覆
☐ 對話記憶正常
```

---

## 🐛 常見問題

### Q: Google 登入失敗？
A: 
1. 檢查 Client ID 是否正確設置
2. 檢查 Google Console 的授權網域
3. 確保使用 HTTPS（Netlify 自動提供）

### Q: AI 沒有回覆？
A:
1. 檢查 Netlify 環境變數
2. 查看 Functions 日誌
3. 確認 Gemini API Key 有效

### Q: 本地測試登入失敗？
A: 
這是正常的！Google 登入需要：
- HTTPS 網域（本地是 HTTP）
- 在 Google Console 授權的網域

**解決方案**：
1. 先部署到 Netlify 測試登入
2. 或在 Google Console 添加 `http://localhost:8888`

### Q: 免費額度夠用嗎？
A:
- Gemini API：每分鐘 60 次請求（免費）
- Netlify：每月 125,000 次 Function 調用（免費）
- 對個人使用綽綽有餘！

---

## 🎯 下一步

成功部署後，您可以：

1. **自定義 AI 個性**
   - 編輯 `netlify/functions/ask.js`
   - 修改系統提示詞

2. **修改界面風格**
   - 編輯 `index.html` 的 CSS
   - 改變顏色、字體等

3. **添加更多功能**
   - 添加收藏功能
   - 添加行程分享
   - 整合地圖 API

---

## 📞 需要幫助？

- 📖 查看完整 README.md
- 🔍 查看 Google AI Studio 文檔
- 💬 提交 Issue 到 GitHub

---

祝您部署順利！💖✨

有問題隨時回來查看這份指南！
