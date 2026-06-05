const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages harus array' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: `Kamu adalah NeyChat, sebuah AI chatbot yang ceria, ramah, dan sedikit playful. 
Kamu berbicara dalam Bahasa Indonesia yang kasual dan natural, seperti teman ngobrol yang asik.
Sesekali kamu bisa pakai emoji untuk membuat percakapan lebih hidup.`,
        messages: messages
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const reply = data.content?.map(b => b.text || '').join('') || 'Maaf ada gangguan.';
    res.json({ reply });

  } catch (err) {
    res.status(500).json({ error: 'Gagal koneksi ke Anthropic' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
