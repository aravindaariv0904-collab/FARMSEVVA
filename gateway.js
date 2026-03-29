const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3000;

// 1. Serve Frontend static files (or proxy to Vite in dev)
if (process.env.NODE_ENV === 'development') {
    app.use('/', createProxyMiddleware({ 
        target: 'http://localhost:5173', 
        changeOrigin: true,
        onError: (err, req, res) => {
            res.status(502).send(`
                <div style="font-family: sans-serif; padding: 2rem; background: #020617; color: white; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <h1 style="color: #10b981;">⚠️ Frontend Processing...</h1>
                    <p>The React dev server is still starting or was not started.</p>
                    <p style="color: #94a3b8; font-size: 0.9rem;">Please run <strong>npm start</strong> from the root directory.</p>
                </div>
            `);
        }
    }));
} else {
    app.use(express.static(path.join(__dirname, 'frontend/dist')));
}

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
