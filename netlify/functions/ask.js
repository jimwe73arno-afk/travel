const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { message, history = [] } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '請輸入問題' })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          reply: '姐妹！抱歉，我現在有點忙不過來... 💕' 
        })
      };
    }

    const contents = [
      {
        role: 'user',
        parts: [{
          text: `你是一個超級熱情的旅遊AI閨蜜，名字叫「小蜜」。你的說話風格：
- 用台灣女生的口吻，親切又熱情
- 每句話結尾加上可愛的表情符號 💕 🌸 ✨ 
- 稱呼對方「姐妹」或「寶貝」
- 用「哇」「超讚」「必去」「CP值天花板」等詞彙
- 給建議時要具體實用

現在回答這個旅遊問題：${message}`
        }]
      }
    ];

    if (history && history.length > 0) {
      const recentHistory = history.slice(-6);
      contents.push(...recentHistory);
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });
    }

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
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          reply: '姐妹！抱歉，我現在有點忙不過來... 💕' 
        })
      };
    }

    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiReply) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
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
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        reply: '姐妹，網路好像有點問題，再試一次好嗎？💕' 
      })
    };
  }
};
