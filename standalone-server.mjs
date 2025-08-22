
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

console.log('🚀 === SERVEUR AUTONOME AVEC INTERFACE REACT ===');

// Configuration CORS ultra-permissive
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, X-Forwarded-For');
  
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Routes API
app.get('/', (req, res) => {
  res.json({ 
    message: 'Code Enhancement Server', 
    status: 'Running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    cors: 'Fully configured for Replit'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Visual Effects Transformer',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    port: PORT
  });
});

app.get('/api/levels', (req, res) => {
  res.json({
    levels: {
      1: {
        name: 'Standard',
        description: 'Optimisations de base',
        modules: 7,
        price: 'Gratuit'
      },
      2: {
        name: 'Professionnel', 
        description: 'Amélioration avancée avec IA',
        modules: 15,
        price: 'Premium'
      },
      3: {
        name: 'Enterprise',
        description: 'Transformation complète avec apprentissage',
        modules: 23,
        price: 'Enterprise'
      }
    }
  });
});

// Route pour servir l'interface React
app.get('/app', async (req, res) => {
  try {
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Alchemy Lab - Visual Effects Transformer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d2d5f 100%);
            color: #ffffff;
            min-height: 100vh;
            overflow-x: hidden;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 10;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
        }

        .logo {
            font-size: 3rem;
            font-weight: bold;
            background: linear-gradient(45deg, #00d4ff, #ff00ff, #ffff00);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
            from { filter: drop-shadow(0 0 10px #00d4ff); }
            to { filter: drop-shadow(0 0 20px #ff00ff); }
        }

        .subtitle {
            font-size: 1.2rem;
            color: #888;
            margin-top: 10px;
        }

        .upload-zone {
            border: 3px dashed #00d4ff;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            margin: 30px 0;
            background: rgba(0, 212, 255, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .upload-zone:hover {
            border-color: #ff00ff;
            background: rgba(255, 0, 255, 0.1);
            transform: translateY(-5px);
        }

        .upload-zone::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(0, 212, 255, 0.1), transparent);
            animation: rotate 3s linear infinite;
            z-index: -1;
        }

        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .level-selector {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }

        .level-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            border-radius: 15px;
            padding: 25px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .level-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 212, 255, 0.3);
        }

        .level-card.selected {
            border-color: #00d4ff;
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(255, 0, 255, 0.1));
        }

        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: #00d4ff;
            border-radius: 50%;
            animation: float 6s linear infinite;
        }

        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }

        .btn {
            background: linear-gradient(45deg, #00d4ff, #ff00ff);
            border: none;
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .btn:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.5);
        }

        .status-bar {
            background: rgba(0, 0, 0, 0.3);
            padding: 10px 20px;
            border-radius: 10px;
            margin: 20px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .preview-area {
            background: rgba(0, 0, 0, 0.5);
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            min-height: 300px;
            position: relative;
        }

        .code-preview {
            background: #1a1a1a;
            color: #00ff00;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            white-space: pre-wrap;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="particles" id="particles"></div>
    
    <div class="container">
        <div class="header">
            <h1 class="logo">Digital Alchemy Lab</h1>
            <p class="subtitle">Transformateur d'Effets Visuels avec IA</p>
        </div>

        <div class="status-bar">
            <span>🟢 Serveur Actif</span>
            <span>🔗 API Connectée</span>
            <span>⚡ Prêt à Transformer</span>
        </div>

        <div class="upload-zone" onclick="document.getElementById('fileInput').click()">
            <input type="file" id="fileInput" accept=".js,.mjs" style="display: none;" onchange="handleFileSelect(event)">
            <h3>📁 Glissez votre fichier JavaScript ici</h3>
            <p>ou cliquez pour sélectionner</p>
            <p style="font-size: 0.9rem; color: #888; margin-top: 10px;">
                Formats supportés: .js, .mjs
            </p>
        </div>

        <div class="level-selector">
            <div class="level-card" onclick="selectLevel(1)">
                <h3>🚀 Standard</h3>
                <p>Optimisations de base</p>
                <p><strong>7 modules</strong> • Gratuit</p>
            </div>
            <div class="level-card" onclick="selectLevel(2)">
                <h3>⚡ Professionnel</h3>
                <p>Amélioration avancée avec IA</p>
                <p><strong>15 modules</strong> • Premium</p>
            </div>
            <div class="level-card" onclick="selectLevel(3)">
                <h3>🔥 Enterprise</h3>
                <p>Transformation complète</p>
                <p><strong>23 modules</strong> • Enterprise</p>
            </div>
        </div>

        <div class="preview-area">
            <h3>📊 Aperçu de la Transformation</h3>
            <div class="code-preview" id="codePreview">
// Votre code transformé apparaîtra ici...
// Sélectionnez un fichier JavaScript pour commencer

console.log("🎨 Bienvenue dans Digital Alchemy Lab!");
console.log("✨ Transformez vos effets visuels avec l'IA");
            </div>
        </div>

        <button class="btn" onclick="startTransformation()">
            🎯 Démarrer la Transformation
        </button>
    </div>

    <script>
        console.log('🎨 Visual Effects Transformer chargé avec succès!');
        
        // Créer les particules
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                
                const colors = ['#00d4ff', '#ff00ff', '#ffff00', '#00ff00'];
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                particlesContainer.appendChild(particle);
            }
        }

        let selectedLevel = 1;
        let selectedFile = null;

        function selectLevel(level) {
            selectedLevel = level;
            document.querySelectorAll('.level-card').forEach(card => {
                card.classList.remove('selected');
            });
            event.target.closest('.level-card').classList.add('selected');
        }

        function handleFileSelect(event) {
            selectedFile = event.target.files[0];
            if (selectedFile) {
                document.querySelector('.upload-zone h3').textContent = 
                    '✅ ' + selectedFile.name + ' sélectionné';
                
                // Aperçu du fichier
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('codePreview').textContent = 
                        '// Fichier: ' + selectedFile.name + '\\n\\n' + e.target.result.substring(0, 500) + '...';
                };
                reader.readAsText(selectedFile);
            }
        }

        async function startTransformation() {
            if (!selectedFile) {
                alert('Veuillez sélectionner un fichier JavaScript');
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('level', selectedLevel);

            try {
                const response = await fetch('/api/transform', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('codePreview').textContent = result.result;
                    alert('🎉 Transformation réussie!');
                } else {
                    alert('❌ Erreur: ' + result.error);
                }
            } catch (error) {
                alert('❌ Erreur de connexion: ' + error.message);
            }
        }

        // Test de connectivité API
        fetch('/api/health')
            .then(response => response.json())
            .then(data => {
                console.log('✅ API connectée:', data);
            })
            .catch(error => {
                console.error('❌ Problème API:', error);
            });

        // Initialiser
        createParticles();
        selectLevel(1);
    </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement de l\'interface' });
  }
});

// Route de redirection par défaut vers l'interface
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Route API non trouvée' });
  } else {
    res.redirect('/app');
  }
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur autonome démarré sur http://0.0.0.0:${PORT}`);
  console.log(`🎨 Interface disponible sur: http://0.0.0.0:${PORT}/app`);
  console.log(`📡 API accessible sur: http://0.0.0.0:${PORT}/api/*`);
  console.log(`✅ CORS configuré pour Replit`);
  console.log(`🎯 Votre Digital Alchemy Lab est prêt!`);
});
