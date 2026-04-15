const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
app.use(cors());
app.use(express.json());

// Ambil data dari .env
const INFLUX_URL = process.env.INFLUX_URL;
const INFLUX_TOKEN = process.env.INFLUX_TOKEN;
const INFLUX_ORG = process.env.INFLUX_ORG;

// Endpoint API
app.post('/api/query', async (req, res) => {
  try {
    const { query } = req.body;

    // ✅ Gunakan fetch NATIVE Node.js (v18+)
    // JANGAN pakai require('node-fetch') lagi!
    const response = await fetch(`${INFLUX_URL}/api/v2/query?org=${encodeURIComponent(INFLUX_ORG)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${INFLUX_TOKEN}`,
        'Content-Type': 'application/vnd.flux',
        'Accept': 'application/csv'
      },
      body: query
    });

    const csv = await response.text();
    res.json({ csv }); 

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend
app.use(express.static(path.join(__dirname, 'html')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'dashboard.html'));
});

// Start server
app.listen(3000, '0.0.0.0', () => {
  console.log('🔒 Server berjalan aman di http://localhost:3000');
});