const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Ganti dengan API key kamu dari console.anthropic.com
const ANTHROPIC_API_KEY = 'sk-ant-XXXXXXXXXXXXXXXX';

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // folder HTML kamu

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
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: `Kamu adalah NeyChat, sebuah AI chatbot yang ceria, ramah, dan sedikit playful. 
Kamu berbicara dalam Bahasa Indonesia yang kasual dan natural, seperti teman ngobrol yang asik.
Kamu helpful, kreatif, dan selalu berusaha memberikan jawaban yang bermanfaat.
Sesekali kamu bisa pakai emoji untuk membuat percakapan lebih hidup.
Jawaban kamu singkat dan to-the-point, tapi tetap hangat dan personal.`,
        messages: messages
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.content?.map(b => b.text || '').join('') || 'Maaf ada gangguan.';
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal koneksi ke Anthropic' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server jalan di http://localhost:${PORT}`);
});
