
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'client')));

// Routes basiques
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>🎨 Visual Effects Transformer</title>
      <style>
        body { 
          font-family: 'Segoe UI', sans-serif; 
          max-width: 800px; 
          margin: 50px auto; 
          padding: 20px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }
        .status { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <h1>🎨 Visual Effects Transformer</h1>
      <div class="status">
        <h2>✅ Serveur de développement actif</h2>
        <p>Mode: Serveur de fallback Express</p>
        <p>Port: ${PORT}</p>
        <p>Status: Opérationnel</p>
      </div>
      <div class="status">
        <h3>📡 API Endpoints disponibles:</h3>
        <ul style="text-align: left; display: inline-block;">
          <li>GET / - Cette page</li>
          <li>GET /health - Status de santé</li>
          <li>GET /api/status - Informations système</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mode: 'fallback',
    time: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    server: 'Express Fallback',
    nodejs: process.version,
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur fallback Express sur http://0.0.0.0:${PORT}`);
  console.log(`🔗 Accessible via: http://localhost:${PORT}`);
});
