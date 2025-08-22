import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StandaloneServer {
  constructor() {
    this.port = process.env.PORT || 5000;
    this.server = null;
  }

  async start() {
    this.server = http.createServer(async (req, res) => {
      await this.handleRequest(req, res);
    });

    this.server.listen(this.port, '0.0.0.0', () => {
      console.log(`🚀 Serveur autonome démarré sur http://0.0.0.0:${this.port}`);
      console.log(`🌐 Preview disponible sur le port ${this.port}`);
    });
  }

  async handleRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    try {
      if (url.pathname === '/' || url.pathname === '/index.html') {
        await this.serveHomePage(res);
      } else if (url.pathname === '/api/health') {
        await this.serveHealth(res);
      } else if (url.pathname === '/api/modules') {
        await this.serveModules(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Fichier non trouvé');
      }
    } catch (error) {
      console.error('Erreur serveur:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erreur interne du serveur' }));
    }
  }

  async serveHomePage(res) {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎨 Visual Effects Transformer</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .content { padding: 40px; }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        .card {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 15px;
            border-left: 5px solid #667eea;
        }
        .card h3 { color: #2d3748; margin-bottom: 15px; }
        .status { 
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            margin: 10px 0;
        }
        .status.active { background: #c6f6d5; color: #22543d; }
        .upload-zone {
            border: 3px dashed #cbd5e0;
            border-radius: 15px;
            padding: 60px 20px;
            text-align: center;
            background: #f7fafc;
            cursor: pointer;
            transition: all 0.3s;
        }
        .upload-zone:hover {
            border-color: #667eea;
            background: #edf2f7;
        }
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Visual Effects Transformer</h1>
            <p>Serveur autonome - Version robuste sans dépendances</p>
        </div>

        <div class="content">
            <div class="grid">
                <div class="card">
                    <h3>📊 État du Système</h3>
                    <div id="system-status">
                        <div class="status active">✅ Serveur Actif</div>
                        <div class="status active">✅ API Disponible</div>
                        <div class="status active">✅ Frontend Opérationnel</div>
                    </div>
                </div>

                <div class="card">
                    <h3>🔧 Modules Disponibles</h3>
                    <div id="modules-list">
                        <div>📝 Universal Preprocessor</div>
                        <div>🎨 JS Preprocessor</div>
                        <div>📖 Documentation Packager</div>
                        <div>⚡ Advanced Enhancer</div>
                    </div>
                </div>

                <div class="card">
                    <h3>📈 Statistiques</h3>
                    <div id="stats">
                        <div>Temps de fonctionnement: <span id="uptime">0s</span></div>
                        <div>Port: <span>5000</span></div>
                        <div>Status: <span style="color: green;">✅ Opérationnel</span></div>
                    </div>
                </div>
            </div>

            <div class="upload-zone" onclick="document.getElementById('file-input').click()">
                <h3>📁 Zone de Téléchargement</h3>
                <p>Cliquez pour sélectionner un fichier JavaScript à transformer</p>
                <input type="file" id="file-input" style="display: none" accept=".js,.ts,.json">
                <button class="btn" style="margin-top: 15px;">Choisir un fichier</button>
            </div>
        </div>
    </div>

    <script>
        let startTime = Date.now();
        setInterval(() => {
            const uptime = Math.floor((Date.now() - startTime) / 1000);
            document.getElementById('uptime').textContent = uptime + 's';
        }, 1000);

        // Test de l'API
        fetch('/api/health')
            .then(response => response.json())
            .then(data => {
                console.log('✅ API Health check:', data);
            })
            .catch(err => console.log('⚠️ API en cours de démarrage...'));

        document.getElementById('file-input').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                alert('Fichier sélectionné: ' + file.name + '\nFonctionnalité de transformation bientôt disponible!');
            }
        });
    </script>
</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  }

  async serveHealth(res) {
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      port: this.port,
      version: '1.0.0'
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(healthData, null, 2));
  }

  async serveModules(res) {
    try {
      const servicesDir = path.join(__dirname, 'server', 'services');
      const services = await fs.readdir(servicesDir);

      const modules = services
        .filter(file => file.endsWith('.ts'))
        .map(file => ({
          name: file.replace('.ts', ''),
          status: 'active',
          path: `/server/services/${file}`
        }));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ modules, count: modules.length }, null, 2));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erreur lors de la lecture des modules' }));
    }
  }
}

const server = new StandaloneServer();
server.start().catch(error => {
  console.error('❌ Erreur de démarrage:', error);
  process.exit(1);
});

export default StandaloneServer;
