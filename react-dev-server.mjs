
import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ReactDevServer {
  constructor() {
    this.port = process.env.PORT || 5000;
    this.server = null;
  }

  async start() {
    console.log('🚀 Démarrage du serveur React...');
    
    this.server = http.createServer(async (req, res) => {
      await this.handleRequest(req, res);
    });

    this.server.listen(this.port, '0.0.0.0', () => {
      console.log(`✅ Serveur React actif sur http://0.0.0.0:${this.port}`);
      console.log(`🎨 Interface utilisateur disponible`);
    });
  }

  async handleRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    // Headers CORS pour tous les endpoints
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    try {
      // Routes API
      if (url.pathname.startsWith('/api/')) {
        await this.handleApi(req, res, url);
        return;
      }

      // Fichiers statiques et routes React
      if (url.pathname === '/' || url.pathname === '/index.html') {
        await this.serveReactHTML(res);
      } else if (url.pathname.startsWith('/src/')) {
        await this.serveSourceFile(req, res, url.pathname);
      } else if (url.pathname.startsWith('/node_modules/')) {
        await this.serveNodeModules(req, res, url.pathname);
      } else {
        // SPA routing - toutes les autres routes retournent l'app React
        await this.serveReactHTML(res);
      }
    } catch (error) {
      console.error('❌ Erreur serveur:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erreur interne du serveur' }));
    }
  }

  async serveReactHTML(res) {
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
        }
        .app-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            padding: 20px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }
        .header h1 {
            text-align: center;
            color: #2d3748;
            font-size: 2rem;
            margin-bottom: 10px;
        }
        .main-content {
            flex: 1;
            padding: 40px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .content-card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            max-width: 800px;
            width: 100%;
        }
        .upload-zone {
            border: 3px dashed #cbd5e0;
            border-radius: 15px;
            padding: 60px 20px;
            text-align: center;
            background: #f7fafc;
            cursor: pointer;
            transition: all 0.3s;
            margin: 20px 0;
        }
        .upload-zone:hover {
            border-color: #667eea;
            background: #edf2f7;
            transform: translateY(-2px);
        }
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s;
            margin: 10px;
        }
        .btn:hover { 
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        .status {
            background: #c6f6d5;
            color: #22543d;
            padding: 10px 20px;
            border-radius: 20px;
            display: inline-block;
            margin: 10px;
            font-weight: 500;
        }
        .level-selector {
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .level-option {
            margin: 10px 0;
            padding: 10px;
            cursor: pointer;
            border-radius: 5px;
            transition: background 0.3s;
        }
        .level-option:hover {
            background: #e2e8f0;
        }
        .level-option input {
            margin-right: 10px;
        }
        .file-info {
            background: #e6fffa;
            border: 1px solid #81e6d9;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            display: none;
        }
        .progress-container {
            margin: 20px 0;
            display: none;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            width: 0%;
            transition: width 0.3s;
        }
    </style>
</head>
<body>
    <div class="app-container">
        <header class="header">
            <h1>🎨 Visual Effects Transformer</h1>
            <div style="text-align: center;">
                <span class="status">✅ Système React Actif</span>
                <span class="status">🔧 24 Modules Prêts</span>
            </div>
        </header>

        <main class="main-content">
            <div class="content-card">
                <h2 style="text-align: center; margin-bottom: 30px; color: #2d3748;">
                    Transformez vos Effets JavaScript
                </h2>

                <div class="upload-zone" onclick="document.getElementById('file-input').click()">
                    <div style="font-size: 3rem; margin-bottom: 20px;">📁</div>
                    <h3>Télécharger un Effet JavaScript</h3>
                    <p style="margin: 10px 0; color: #718096;">
                        Formats supportés: .js, .ts, .jsx, .tsx
                    </p>
                    <input type="file" id="file-input" style="display: none" 
                           accept=".js,.ts,.jsx,.tsx" multiple>
                    <button class="btn">Choisir vos fichiers</button>
                </div>

                <div class="file-info" id="file-info">
                    <h4>📄 Fichier sélectionné:</h4>
                    <div id="file-details"></div>
                </div>

                <div class="level-selector">
                    <h3 style="margin-bottom: 15px;">🎯 Niveau de Transformation</h3>
                    <div class="level-option">
                        <label>
                            <input type="radio" name="level" value="1" checked>
                            <strong>Niveau 1 - Standard</strong> (Normalisation + Optimisations)
                        </label>
                    </div>
                    <div class="level-option">
                        <label>
                            <input type="radio" name="level" value="2">
                            <strong>Niveau 2 - Pro</strong> (+ IA + Performance + Documentation)
                        </label>
                    </div>
                    <div class="level-option">
                        <label>
                            <input type="radio" name="level" value="3">
                            <strong>Niveau 3 - Premium</strong> (+ Révolutionnaire + Packageur)
                        </label>
                    </div>
                </div>

                <div class="progress-container" id="progress-container">
                    <h4>🔄 Transformation en cours...</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                    <div id="progress-text">Initialisation...</div>
                </div>

                <div style="text-align: center;">
                    <button class="btn" onclick="startTransformation()" id="transform-btn">
                        🚀 Transformer mon effet
                    </button>
                    <button class="btn" onclick="resetForm()" style="background: #e53e3e;">
                        🔄 Réinitialiser
                    </button>
                </div>
            </div>
        </main>
    </div>

    <script>
        // État de l'application
        let selectedFiles = [];
        let transformationLevel = 1;

        // Gestion de la sélection de fichiers
        document.getElementById('file-input').addEventListener('change', function(e) {
            selectedFiles = Array.from(e.target.files);
            displayFileInfo();
        });

        function displayFileInfo() {
            const fileInfo = document.getElementById('file-info');
            const fileDetails = document.getElementById('file-details');
            
            if (selectedFiles.length > 0) {
                fileInfo.style.display = 'block';
                fileDetails.innerHTML = selectedFiles.map(file => 
                    \`<div>📄 \${file.name} (\${(file.size / 1024).toFixed(1)} KB)</div>\`
                ).join('');
            } else {
                fileInfo.style.display = 'none';
            }
        }

        // Gestion des niveaux de transformation
        document.querySelectorAll('input[name="level"]').forEach(radio => {
            radio.addEventListener('change', function() {
                transformationLevel = parseInt(this.value);
                console.log('Niveau sélectionné:', transformationLevel);
            });
        });

        // Fonction de transformation
        async function startTransformation() {
            if (selectedFiles.length === 0) {
                alert('⚠️ Veuillez sélectionner au moins un fichier JavaScript');
                return;
            }

            const transformBtn = document.getElementById('transform-btn');
            const progressContainer = document.getElementById('progress-container');
            const progressFill = document.getElementById('progress-fill');
            const progressText = document.getElementById('progress-text');

            // Désactiver le bouton et afficher la barre de progression
            transformBtn.disabled = true;
            transformBtn.textContent = '⏳ Transformation...';
            progressContainer.style.display = 'block';

            try {
                // Simulation du processus de transformation
                const steps = [
                    'Analyse du code JavaScript...',
                    'Normalisation de la structure...',
                    'Application des transformations...',
                    'Génération de la documentation...',
                    'Packaging final...'
                ];

                for (let i = 0; i < steps.length; i++) {
                    progressText.textContent = steps[i];
                    progressFill.style.width = ((i + 1) / steps.length * 100) + '%';
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Simulation d'appel API
                const formData = new FormData();
                selectedFiles.forEach(file => formData.append('files', file));
                formData.append('level', transformationLevel);

                const response = await fetch('/api/transform', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    progressText.textContent = '✅ Transformation terminée!';
                    alert('🎉 Transformation réussie! Votre effet a été optimisé.');
                } else {
                    throw new Error('Erreur de transformation');
                }

            } catch (error) {
                console.error('Erreur:', error);
                progressText.textContent = '❌ Erreur lors de la transformation';
                alert('❌ Erreur: ' + error.message);
            } finally {
                // Réactiver l'interface
                setTimeout(() => {
                    transformBtn.disabled = false;
                    transformBtn.textContent = '🚀 Transformer mon effet';
                    progressContainer.style.display = 'none';
                    progressFill.style.width = '0%';
                }, 2000);
            }
        }

        function resetForm() {
            selectedFiles = [];
            document.getElementById('file-input').value = '';
            document.getElementById('file-info').style.display = 'none';
            document.querySelector('input[name="level"][value="1"]').checked = true;
            transformationLevel = 1;
            console.log('Formulaire réinitialisé');
        }

        // Test de connectivité API au chargement
        window.addEventListener('load', async () => {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                console.log('✅ API connectée:', data);
            } catch (error) {
                console.log('⚠️ API non disponible:', error);
            }
        });

        console.log('🎨 Visual Effects Transformer chargé avec succès!');
    </script>
</body>
</html>`;

    res.writeHead(200, { 
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    res.end(html);
  }

  async handleApi(req, res, url) {
    const pathname = url.pathname;

    if (pathname === '/api/health') {
      const healthData = {
        status: 'OK',
        service: 'React Development Server',
        timestamp: new Date().toISOString(),
        uptime: Math.round(process.uptime()),
        memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
        port: this.port
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(healthData, null, 2));
    } 
    else if (pathname === '/api/transform' && req.method === 'POST') {
      // Endpoint de transformation (simulé pour l'instant)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: true, 
        message: 'Transformation simulée réussie',
        timestamp: new Date().toISOString()
      }));
    }
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint non trouvé' }));
    }
  }

  async serveSourceFile(req, res, pathname) {
    // Pour les fichiers source, on retourne une réponse simple
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Module source non disponible en mode développement simple');
  }

  async serveNodeModules(req, res, pathname) {
    // Pour node_modules, on retourne une réponse simple
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Modules node non disponibles en mode développement simple');
  }
}

// Démarrage du serveur
const server = new ReactDevServer();
server.start().catch(error => {
  console.error('❌ Erreur de démarrage:', error);
  process.exit(1);
});

export default ReactDevServer;
