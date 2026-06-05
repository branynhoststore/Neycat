module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

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
        system: 'Kamu adalah NeyChat, chatbot AI yang ramah dan ceria. Bicara Bahasa Indonesia yang kasual. Pakai emoji sesekali.',
        messages: messages
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const reply = data.content?.map(b => b.text || '').join('') || 'Maaf ada gangguan.';
    res.json({ reply });

  } catch (err) {
    res.status(500).json({ error: 'Gagal koneksi' });
  }
};
