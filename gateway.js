const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3000;

// 1. Serve Frontend static files
app.use(express.static(path.join(__dirname, 'frontend')));

// 2. Route Backend API traffic
app.use('/api/v1', createProxyMiddleware({ 
  target: 'http://localhost:5000', 
  changeOrigin: true 
}));

// Fallback to index.html for unknown routes (optional)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🌾 Farm Seeva Unified Gateway started!`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`========================================`);
});
