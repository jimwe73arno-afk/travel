# 🔧 故障排除指南 (Gemini 版本)

## 常見問題與解決方案

---

## 1. AI 完全沒有回覆

### 症狀
- 發送訊息後顯示「正在思考中...」
- 然後顯示：「姐妹！抱歉，我現在有點忙不過來...」

### 可能原因與解決方案

#### A. Gemini API Key 未設置或錯誤

**檢查步驟**：
1. 登入 Netlify Dashboard
2. 進入您的網站
3. Site settings → Environment variables
4. 確認有 `GEMINI_API_KEY` 變數

**API Key 格式**：
- ✅ 正確：`AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX`
- ❌ 錯誤：有空格、換行、或不完整

**解決方案**：
1. 前往 https://makersuite.google.com/app/apikey
2. 重新複製 API Key
3. 更新 Netlify 環境變數
4. Deploys → Trigger deploy → Deploy site
5. 等待部署完成
6. 重新測試

#### B. API Key 無效或過期

**檢查方法**：
```bash
# 測試 API Key 是否有效
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"hello"}]}]}'
```

**如果返回錯誤**：
```json
{
  "error": {
    "code": 400,
    "message": "API key not valid"
  }
}
```

**解決方案**：重新創建 API Key

#### C. API 額度用完

**檢查額度**：
1. 訪問 https://console.cloud.google.com/
2. 選擇您的專案
3. APIs & Services → Dashboard
4. 查看 Gemini API 使用情況

**Gemini 免費額度**：
- ✅ 每分鐘 60 次請求
- ✅ 每天 1,500 次請求
- ✅ 每月免費

**如果超過額度**：
- 等待配額重置（每分鐘重置）
- 或啟用付費方案

---

## 2. Google 登入失敗

### 症狀
- 點擊「Google 登入」沒反應
- 或顯示「Invalid Client ID」

### 可能原因與解決方案

#### A. Client ID 未設置

**檢查步驟**：
1. 打開 `index.html`
2. 搜尋 `YOUR_GOOGLE_CLIENT_ID`
3. 確認已替換為真實的 Client ID

**正確格式**：
```javascript
client_id: '123456789-xxxxx.apps.googleusercontent.com',
```

#### B. 授權網域未設置

**問題**：
```
Error: origin_mismatch
```

**解決方案**：
1. 前往 https://console.cloud.google.com/apis/credentials
2. 點擊您的 OAuth 2.0 Client ID
3. 添加「授權的 JavaScript 來源」：
   ```
   https://your-site.netlify.app
   ```
4. 儲存

**注意**：網域必須完全匹配！

#### C. 在本地環境測試

**問題**：本地環境（localhost）Google 登入可能失敗

**原因**：
- Google OAuth 需要 HTTPS
- 本地是 HTTP

**解決方案**：
1. 在 Google Console 添加：
   ```
   http://localhost:8888
   ```
2. 或直接在 Netlify 測試

---

## 3. 對話記憶不工作

### 症狀
- AI 不記得之前的對話
- 每次都像第一次聊天

### 可能原因與解決方案

#### A. 前端代碼問題

**檢查**：
打開瀏覽器開發者工具（F12）：
1. Console 標籤
2. 查看是否有 JavaScript 錯誤

**常見錯誤**：
```javascript
Uncaught ReferenceError: conversationHistory is not defined
```

**解決方案**：
確認 `index.html` 中有：
```javascript
let conversationHistory = [];
```

#### B. 歷史記錄格式錯誤

**正確格式**（Gemini）：
```javascript
{
  role: 'user',        // 或 'model'
  parts: [{ text: '訊息內容' }]
}
```

**錯誤格式**（Claude/ChatGPT）：
```javascript
{
  role: 'user',
  content: '訊息內容'  // ❌ Gemini 不支援
}
```

---

## 4. Function 部署失敗

### 症狀
- Netlify 顯示部署失敗
- Functions 標籤沒有 `ask` function

### 可能原因與解決方案

#### A. 文件結構錯誤

**正確結構**：
```
travel-ai-bestie-gemini/
├── index.html
├── netlify.toml
├── package.json
└── netlify/
    └── functions/
        └── ask.js  ← 必須在這裡
```

#### B. netlify.toml 配置錯誤

**檢查**：
```toml
[build]
  functions = "netlify/functions"  # 路徑必須正確
  publish = "."
```

#### C. 依賴安裝失敗

**查看部署日誌**：
1. Netlify → Deploys
2. 點擊失敗的部署
3. 查看 "Deploy log"

**常見錯誤**：
```
npm ERR! missing: node-fetch@^2.6.7
```

**解決方案**：
確認 `package.json` 包含：
```json
"dependencies": {
  "node-fetch": "^2.6.7"
}
```

---

## 5. API 回應太慢

### 症狀
- 等待時間超過 30 秒
- 有時會超時

### 可能原因與解決方案

#### A. 對話歷史太長

**問題**：發送太多歷史對話給 API

**解決方案**：
編輯 `netlify/functions/ask.js`：
```javascript
// 只保留最近 3 輪對話
const recentHistory = history.slice(-6);
```

#### B. Netlify Function 超時

**Netlify 限制**：
- 免費方案：10 秒
- Pro 方案：26 秒

**解決方案**：
- 減少 maxOutputTokens
- 簡化提示詞
- 升級 Netlify 方案

---

## 6. 亂碼或編碼問題

### 症狀
- 中文顯示為亂碼
- 表情符號顯示為 ��

### 解決方案

**確認 index.html**：
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">  ← 必須有這行
```

**確認文件保存編碼**：
- 使用 UTF-8 編碼
- 不使用 BOM

---

## 7. CORS 錯誤

### 症狀
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

### 解決方案

**檢查 netlify.toml**：
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

**重新部署**：
修改配置後必須重新部署

---

## 🆘 診斷檢查清單

### 環境變數
```
☐ GEMINI_API_KEY 已設置
☐ API Key 格式正確（AIza...）
☐ API Key 有效且有額度
☐ 設置後已重新部署
```

### Google 登入
```
☐ Client ID 已在 index.html 設置
☐ Client ID 格式正確（xxx.apps.googleusercontent.com）
☐ 授權網域已在 Google Console 設置
☐ 網域完全匹配（包含 https://）
```

### 文件結構
```
☐ netlify.toml 存在且配置正確
☐ netlify/functions/ask.js 存在
☐ package.json 包含 node-fetch
☐ index.html 編碼為 UTF-8
```

### Function 狀態
```
☐ Netlify Functions 標籤有 ask function
☐ Function 日誌無錯誤
☐ 部署成功完成
```

---

## 🔍 深度診斷

### 測試 Gemini API

```bash
# 替換 YOUR_API_KEY
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{"text": "Hello"}]
    }]
  }'
```

**預期回應**：
```json
{
  "candidates": [{
    "content": {
      "parts": [{"text": "Hi there!"}],
      "role": "model"
    }
  }]
}
```

### 查看 Function 日誌

1. Netlify Dashboard
2. Functions → ask
3. 點擊最近的調用
4. 查看詳細日誌

**常見錯誤訊息**：

```javascript
// Error 1: API Key 問題
"GEMINI_API_KEY not found in environment variables"
→ 檢查環境變數設置

// Error 2: API 錯誤
"API key not valid"
→ 重新創建 API Key

// Error 3: 額度問題
"Quota exceeded"
→ 等待配額重置或啟用付費
```

---

## 📞 取得幫助

### 官方資源
- [Google AI Studio 文檔](https://ai.google.dev/docs)
- [Netlify 文檔](https://docs.netlify.com/)
- [Google OAuth 文檔](https://developers.google.com/identity/protocols/oauth2)

### 提交 Issue

如果以上都無法解決，請提交 Issue 並包含：
1. 錯誤訊息截圖
2. Netlify Function 日誌
3. 瀏覽器 Console 截圖
4. 您已嘗試的解決方案

---

祝您順利解決問題！💖

如果還有其他問題，歡迎查看 README.md 或 QUICKSTART.md
