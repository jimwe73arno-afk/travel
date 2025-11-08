const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // 只允許 POST 請求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { userId, message, history = [] } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '請輸入問題' })
      };
    }

    // 檢查 API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'API Key 未設置',
          reply: '姐妹！抱歉，我現在有點忙不過來... 💕' 
        })
      };
    }

    // 構建對話內容
    const contents = [
      {
        role: 'user',
        parts: [{
          text: `你是一個超級熱情的旅遊AI閨蜜，名字叫「小蜜」。你的說話風格：
- 用台灣女生的口吻，親切又熱情
- 每句話結尾加上可愛的表情符號 💕 🌸 ✨ 
- 稱呼對方「姐妹」或「寶貝」
- 用「哇」「超讚」「必去」「CP值天花板」等詞彙
- 給建議時要具體實用，包含價格、交通、時間等細節
- 分享省錢小技巧和網美打卡點

現在回答這個旅遊問題：${message}`
        }]
      }
    ];

    // 添加對話歷史（如果有）
    if (history && history.length > 0) {
      // 只保留最近的對話，避免超出 token 限制
      const recentHistory = history.slice(-6); // 保留最近3輪對話
      contents.push(...recentHistory);
      
      // 添加當前問題
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });
    }

    // 調用 Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', data);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: data.error?.message || 'API 錯誤',
          reply: '姐妹！抱歉，我現在有點忙不過來... 💕' 
        })
      };
    }

    // 提取回覆
    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiReply) {
      console.error('No reply from Gemini:', data);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: '無法取得回覆',
          reply: '姐妹！抱歉，我現在有點忙不過來... 💕' 
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        reply: aiReply
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        reply: '姐妹，網路好像有點問題，再試一次好嗎？💕' 
      })
    };
  }
};
