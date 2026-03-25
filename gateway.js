const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

// 1. Route AI Engine traffic (to Python FastAPI on port 8000)
app.use('/api/ai', createProxyMiddleware({ 
  target: 'http://localhost:8000', 
  changeOrigin: true,
  pathRewrite: { '^/api/ai': '' } // Strips /api/ai before sending to Python
}));

// 2. Route Backend traffic (to Node Express on port 5000)
app.use('/api/v1', createProxyMiddleware({ 
  target: 'http://localhost:5000', 
  changeOrigin: true 
}));

// 3. Route everything else to the Frontend (Expo Web on port 8081)
app.use('/', createProxyMiddleware({ 
  target: 'http://localhost:8081', 
  changeOrigin: true,
  ws: true // Allows WebSocket connections for Expo fast-refresh
}));

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🌾 Farm Seeva Unified Gateway started!`);
  console.log(`All services are now running on ONE PORT:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`========================================`);
});
