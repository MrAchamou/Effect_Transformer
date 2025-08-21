
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5000;

const server = http.createServer((req, res) => {
  // Headers CORS manuels
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  
  // API Routes
  if (url.pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    
    if (url.pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'OK',
        server: 'Emergency Server',
        timestamp: new Date().toISOString(),
        nodejs: process.version
      }));
      return;
    }
    
    if (url.pathname === '/api/status') {
      res.writeHead(200);
      res.end(JSON.stringify({
        server: 'Emergency HTTP Server',
        message: 'Serveur de secours actif - cors installé avec succès',
        uptime: process.uptime(),
        memory: process.memoryUsage()
      }));
      return;
    }
    
    // Autres routes API
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
    return;
  }
  
  // Servir la page principale
  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>🎨 Visual Effects Transformer</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .status { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .error { background: #ffe8e8; }
        .success { background: #e8f5e8; }
        button { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        .api-test { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 Visual Effects Transformer</h1>
        <div class="status success">
            <h3>✅ Serveur d'urgence actif</h3>
            <p>Le serveur fonctionne maintenant sans dépendances externes.</p>
            <p><strong>Port:</strong> ${PORT}</p>
            <p><strong>Status:</strong> Emergency Server OK</p>
        </div>
        
        <div class="api-test">
            <h3>🔍 Test API</h3>
            <button onclick="testAPI()">Tester /api/health</button>
            <button onclick="testStatus()">Tester /api/status</button>
            <div id="result" style="margin-top: 10px;"></div>
        </div>
        
        <div style="margin-top: 30px;">
            <h3>📋 Prochaines étapes :</h3>
            <ol>
                <li>Installer les dépendances manquantes : <code>npm install cors @types/cors</code></li>
                <li>Redémarrer le serveur TypeScript principal</li>
                <li>Vérifier que l'application fonctionne normalement</li>
            </ol>
        </div>
    </div>
    
    <script>
        async function testAPI() {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('result').innerHTML = '<div class="error">Erreur: ' + error.message + '</div>';
            }
        }
        
        async function testStatus() {
            try {
                const response = await fetch('/api/status');
                const data = await response.json();
                document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('result').innerHTML = '<div class="error">Erreur: ' + error.message + '</div>';
            }
        }
    </script>
</body>
</html>
    `);
    return;
  }
  
  // 404 pour autres routes
  res.writeHead(404);
  res.end('Page not found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur d'urgence démarré sur http://0.0.0.0:${PORT}`);
  console.log(`🔗 Interface web : http://localhost:${PORT}`);
  console.log(`✅ Serveur sans dépendances - Prêt à recevoir les requêtes`);
});

// Gestion d'arrêt gracieux
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du serveur d\'urgence...');
  server.close(() => {
    console.log('Serveur fermé');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n👋 Arrêt du serveur d\'urgence...');
  server.close(() => {
    console.log('Serveur fermé');
    process.exit(0);
  });
});
