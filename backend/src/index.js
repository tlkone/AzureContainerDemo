const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  // TODO: validate; save to storage; send email -- still a lot to do here but it's a POC
  console.log('Contact form received:', { name, email, message });
  res.status(200).json({ ok: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
