const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST' }, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { message } = JSON.parse(event.body);
    if (!message) return { statusCode: 400, body: JSON.stringify({ error: '請輸入訊息' }) };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[ERROR] No API Key');
      return { statusCode: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ reply: '設定錯誤 💕' }) };
    }

    // 🔥 修正：使用正確的 API endpoint
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: `你是熱情的旅遊AI閨蜜「小蜜」，用台灣女生口吻，加💕表情，稱「姐妹」。\n\n${message}` }] 
        }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 1024 }
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[ERROR] Gemini API:', res.status, errorText);
      throw new Error(`API ${res.status}`);
    }
    
    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '有點忙💕';

    return { 
      statusCode: 200, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, 
      body: JSON.stringify({ reply }) 
    };

  } catch (err) {
    console.error('[ERROR]', err.message);
    return { 
      statusCode: 500, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, 
      body: JSON.stringify({ reply: '網路問題💕' }) 
    };
  }
};
