# ✨ 旅遊AI閨蜜 - Travel AI Bestie (Gemini 版本) ✨

一個超可愛的旅遊AI聊天機器人，用閨蜜的口吻幫你規劃完美旅程！💕

**使用 Google Gemini API** 🚀

---

## 🌟 功能特色

- 🎀 親切的閨蜜口吻，像朋友一樣聊天
- ✈️ 提供實用的旅遊建議和行程規劃
- 💰 預算控制和省錢攻略
- 🔐 Google 登入功能
- 💬 對話記憶功能
- 🎯 快速提問按鈕

---

## 📋 前置需求

### 1. Google Gemini API Key

1. 訪問 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登入您的 Google 帳號
3. 點擊 "Create API Key"
4. 複製 API Key（格式：`AIza...`）

**重要**：Gemini API 目前有免費額度！

### 2. Google OAuth Client ID（用於登入功能）

1. 訪問 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. 創建新專案（或選擇現有專案）
3. 啟用 "Google+ API"
4. 創建 OAuth 2.0 Client ID：
   - 應用程式類型：Web 應用程式
   - 授權的 JavaScript 來源：添加您的網站網址（例如：`https://your-site.netlify.app`）
   - 授權的重新導向 URI：添加您的網站網址
5. 複製 Client ID（格式：`xxxxx.apps.googleusercontent.com`）

---

## 🚀 快速開始

### 步驟 1: 獲取 API Keys

✅ Gemini API Key (必需)  
✅ Google OAuth Client ID (必需)

### 步驟 2: 部署到 Netlify

#### 方法 A: 直接拖放（推薦）

1. 訪問 https://app.netlify.com/drop
2. 拖放整個專案資料夾
3. 等待上傳完成

#### 方法 B: 從 GitHub

1. 將代碼推送到 GitHub
2. 在 Netlify 連接 repository
3. 自動部署

### 步驟 3: 設置環境變數

在 Netlify Dashboard：

1. Site settings → Environment variables
2. 添加變數：
   - Key: `GEMINI_API_KEY`
   - Value: 您的 Gemini API Key

### 步驟 4: 設置 Google Client ID

編輯 `index.html` 第 426 行：

```javascript
client_id: '您的Google_Client_ID.apps.googleusercontent.com',
```

### 步驟 5: 重新部署

1. Deploys → Trigger deploy → Deploy site
2. 等待部署完成
3. 測試網站！

---

## 🔧 本地開發

### 安裝依賴

```bash
npm install
```

### 創建 .env 文件

```bash
cp .env.example .env
# 編輯 .env，填入您的 Gemini API Key
```

### 啟動開發服務器

```bash
npm run dev
# 訪問 http://localhost:8888
```

---

## 📁 專案結構

```
travel-ai-bestie-gemini/
├── index.html              # 前端界面（含 Google 登入）
├── netlify/
│   └── functions/
│       └── ask.js         # Gemini API 處理函數
├── netlify.toml           # Netlify 配置
├── package.json           # 依賴管理
├── .env.example          # 環境變數範例
├── .gitignore            # Git 忽略文件
└── README.md             # 本文件
```

---

## ⚙️ API 說明

### Gemini API

- **模型**: gemini-pro
- **Temperature**: 0.9（較有創意）
- **Max Tokens**: 1024
- **安全設置**: 中等封鎖等級

### 對話格式

```javascript
{
  role: 'user',        // 或 'model'
  parts: [{ text: '訊息內容' }]
}
```

---

## 🎨 自定義

### 修改 AI 個性

編輯 `netlify/functions/ask.js`：

```javascript
text: `你是一個超級熱情的旅遊AI閨蜜，名字叫「小蜜」...`
```

### 修改界面樣式

編輯 `index.html` 中的 CSS：

```css
background: linear-gradient(135deg, #ffeef8 0%, #ffe8f0 100%);
```

### 添加快速提問

編輯 `index.html`：

```html
<button class="quick-btn" onclick="askQuestion('你的問題')">按鈕文字</button>
```

---

## 🐛 故障排除

### AI 沒有回覆？

1. **檢查 Gemini API Key**
   - 前往 Netlify → Environment variables
   - 確認 `GEMINI_API_KEY` 正確設置
   - 確認 API Key 有效且有額度

2. **檢查 Function 日誌**
   - Netlify → Functions → ask
   - 查看錯誤訊息

3. **常見錯誤**
   ```
   "API key not valid"
   → 檢查 API Key 是否正確
   
   "Quota exceeded"
   → API 額度用完了
   
   "CORS error"
   → 檢查 netlify.toml 配置
   ```

### 無法登入 Google？

1. **檢查 Client ID**
   - 確認 index.html 中的 Client ID 正確
   - 確認授權的網域正確設置

2. **本地測試**
   - Google 登入在本地可能無法使用
   - 需要部署到正式網域測試

### 對話記憶不工作？

- 檢查瀏覽器 Console 是否有錯誤
- 確認 conversationHistory 陣列正常運作

---

## 💰 費用說明

### Gemini API

- ✅ **免費額度**：每分鐘 60 次請求
- ✅ **適合個人使用**

詳情：https://ai.google.dev/pricing

### Netlify

- ✅ **免費方案**：
  - 100 GB 頻寬/月
  - 125,000 次 Function 調用/月
- ✅ **適合小型專案**

---

## 🔐 安全性

### 重要提醒

- ❌ 不要將 API Key 提交到 Git
- ✅ 使用環境變數存儲敏感資訊
- ✅ 定期檢查 API 使用量
- ✅ 啟用適當的安全設置

### .gitignore 配置

```
.env
.env.local
```

---

## 📝 授權

MIT License - 隨意使用和修改！

---

## 💖 貢獻

歡迎提交 Issue 和 Pull Request！

---

## 🆘 需要幫助？

1. 查看 [Google AI Studio 文檔](https://ai.google.dev/docs)
2. 查看 [Netlify 文檔](https://docs.netlify.com/)
3. 提交 Issue 到 GitHub

---

Made with 💕 using Google Gemini API

**重要提醒**：
- 確保設置 `GEMINI_API_KEY` 環境變數
- 確保在 index.html 中設置 Google Client ID
- 部署後重新啟動網站
