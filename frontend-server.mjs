
import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FrontendServer {
  constructor() {
    this.port = process.env.PORT || 5000;
    this.server = null;
  }

  async start() {
    this.server = http.createServer(async (req, res) => {
      await this.handleRequest(req, res);
    });

    this.server.listen(this.port, '0.0.0.0', () => {
      console.log(`🚀 Frontend React démarré sur http://0.0.0.0:${this.port}`);
      console.log(`🎨 Interface utilisateur disponible`);
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
      // Servir les fichiers statiques du client
      if (url.pathname.startsWith('/src/') || url.pathname.startsWith('/node_modules/')) {
        await this.serveStaticFile(req, res, url.pathname);
      } else if (url.pathname === '/' || url.pathname === '/index.html') {
        await this.serveReactApp(res);
      } else if (url.pathname === '/api/health') {
        await this.serveHealth(res);
      } else if (url.pathname === '/api/upload') {
        await this.handleFileUpload(req, res);
      } else {
        // Toutes les autres routes renvoient vers l'app React (SPA routing)
        await this.serveReactApp(res);
      }
    } catch (error) {
      console.error('Erreur serveur:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erreur interne du serveur' }));
    }
  }

  async serveReactApp(res) {
    try {
      const indexPath = path.join(__dirname, 'client', 'index.html');
      const indexContent = await fs.readFile(indexPath, 'utf-8');
      
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(indexContent);
    } catch (error) {
      console.error('Erreur index.html:', error);
      await this.serveFallbackPage(res);
    }
  }

  async serveStaticFile(req, res, pathname) {
    try {
      const filePath = path.join(__dirname, 'client', pathname);
      const content = await fs.readFile(filePath);
      
      // Déterminer le type MIME
      const ext = path.extname(pathname).toLowerCase();
      const mimeTypes = {
        '.js': 'application/javascript',
        '.jsx': 'application/javascript',
        '.ts': 'application/typescript',
        '.tsx': 'application/typescript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
      };
      
      const contentType = mimeTypes[ext] || 'text/plain';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Fichier non trouvé');
    }
  }

  async serveFallbackPage(res) {
    const fallbackHTML = `<!DOCTYPE html>
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
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 600px;
        }
        .header { color: #2d3748; margin-bottom: 30px; }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .upload-zone {
            border: 3px dashed #cbd5e0;
            border-radius: 15px;
            padding: 60px 20px;
            margin: 30px 0;
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
        .status { 
            background: #c6f6d5; 
            color: #22543d; 
            padding: 10px 20px; 
            border-radius: 20px; 
            display: inline-block;
            margin: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Visual Effects Transformer</h1>
            <p>Interface utilisateur simplifiée</p>
        </div>

        <div class="status">✅ Serveur Frontend Actif</div>

        <div class="upload-zone" onclick="document.getElementById('file-input').click()">
            <h3>📁 Télécharger un Effet JavaScript</h3>
            <p>Cliquez pour sélectionner votre fichier .js</p>
            <input type="file" id="file-input" style="display: none" accept=".js,.ts">
            <button class="btn" style="margin-top: 15px;">Choisir un fichier</button>
        </div>

        <div style="margin-top: 30px;">
            <h3>Niveaux de Transformation</h3>
            <div style="margin: 20px 0;">
                <label><input type="radio" name="level" value="1" checked> Niveau 1 - Standard</label><br>
                <label><input type="radio" name="level" value="2"> Niveau 2 - Pro</label><br>
                <label><input type="radio" name="level" value="3"> Niveau 3 - Premium</label>
            </div>
            <button class="btn" onclick="transformFile()">Transformer mon effet</button>
        </div>
    </div>

    <script>
        document.getElementById('file-input').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                console.log('Fichier sélectionné:', file.name);
                alert('Fichier sélectionné: ' + file.name);
            }
        });

        function transformFile() {
            const level = document.querySelector('input[name="level"]:checked').value;
            alert('Transformation niveau ' + level + ' - Fonctionnalité en développement');
        }

        // Test de connection API
        fetch('/api/health')
            .then(response => response.json())
            .then(data => console.log('✅ API connectée:', data))
            .catch(err => console.log('⚠️ API non disponible'));
    </script>
</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fallbackHTML);
  }

  async serveHealth(res) {
    const healthData = {
      status: 'OK',
      service: 'Frontend React Server',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      port: this.port
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(healthData, null, 2));
  }

  async handleFileUpload(req, res) {
    // Simple file upload handler
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Upload endpoint prêt' }));
  }
}

const server = new FrontendServer();
server.start().catch(error => {
  console.error('❌ Erreur de démarrage du frontend:', error);
  process.exit(1);
});

export default FrontendServer;
