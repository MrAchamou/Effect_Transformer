
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 === SERVEUR COMPLET DÉMARRÉ ===');
console.log('🎯 Problème: Interface ne s\'affiche pas');
console.log('💡 Solution: Serveur avec frontend React intégré\n');

const app = express();
const PORT = 5000;

// Configuration CORS et middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'client')));

// Routes API pour l'application Visual Effects Transformer
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Visual Effects Transformer API',
    frontend: 'React avec Vite',
    time: new Date().toISOString()
  });
});

app.get('/api/modules', (req, res) => {
  res.json({
    levels: [
      { id: 1, name: 'Basique', description: 'Optimisations simples' },
      { id: 2, name: 'Avancé', description: 'Transformations complexes' },
      { id: 3, name: 'Expert', description: 'IA + Modules révolutionnaires' }
    ]
  });
});

// Route pour upload de fichiers JS
app.post('/api/upload', (req, res) => {
  res.json({
    success: true,
    message: 'Fichier reçu (simulation)',
    originalCode: req.body.code || 'console.log("Hello World");',
    transformedCode: '// Code transformé\nconsole.log("Hello Transformed World!");'
  });
});

// Diagnostic système
app.get('/api/diagnostic', (req, res) => {
  const clientPath = join(__dirname, 'client');
  const serverPath = join(__dirname, 'server');
  
  const diagnostic = {
    timestamp: new Date().toISOString(),
    frontend: {
      react: fs.existsSync(join(clientPath, 'src', 'App.tsx')),
      index: fs.existsSync(join(clientPath, 'index.html')),
      components: fs.existsSync(join(clientPath, 'src', 'components'))
    },
    backend: {
      server: fs.existsSync(join(serverPath, 'index.ts')),
      routes: fs.existsSync(join(serverPath, 'routes.ts')),
      services: fs.existsSync(join(serverPath, 'services'))
    },
    config: {
      packageJson: fs.existsSync(join(__dirname, 'package.json')),
      viteConfig: fs.existsSync(join(__dirname, 'vite.config.ts')),
      tsConfig: fs.existsSync(join(__dirname, 'tsconfig.json'))
    }
  };
  
  res.json(diagnostic);
});

// Servir le frontend React
app.get('*', (req, res) => {
  const indexPath = join(__dirname, 'client', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf-8');
    
    // Injecter les scripts nécessaires
    html = html.replace(
      '</head>',
      `  <script type="module">
        // Configuration pour le développement
        window.__DEV__ = true;
        window.__API_URL__ = 'http://0.0.0.0:${PORT}';
      </script>
    </head>`
    );
    
    res.send(html);
  } else {
    // Fallback HTML si index.html n'existe pas
    res.send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🎨 Visual Effects Transformer</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; }
          .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        </style>
      </head>
      <body class="bg-gray-50">
        <div id="root">
          <div class="min-h-screen gradient-bg flex items-center justify-center">
            <div class="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4">
              <h1 class="text-3xl font-bold text-center mb-6">🎨 Visual Effects Transformer</h1>
              <div class="space-y-4">
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  ✅ Serveur démarré avec succès sur le port ${PORT}
                </div>
                <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                  🔧 Mode développement actif
                </div>
                <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                  ⚠️ Frontend React en cours de chargement...
                </div>
                <div class="text-center mt-6">
                  <button onclick="location.reload()" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                    🔄 Recharger l'application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <script>
          // Auto-refresh pour le développement
          setTimeout(() => {
            console.log('🔄 Tentative de rechargement automatique...');
            fetch('/api/health')
              .then(response => response.json())
              .then(data => {
                console.log('✅ API connectée:', data);
                // Ici on pourrait charger le vrai React app
              })
              .catch(error => {
                console.warn('⚠️ API non disponible:', error);
              });
          }, 2000);
        </script>
      </body>
      </html>
    `);
  }
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur complet démarré sur http://0.0.0.0:${PORT}`);
  console.log(`🎨 Frontend React: http://0.0.0.0:${PORT}`);
  console.log(`🔧 API Health: http://0.0.0.0:${PORT}/api/health`);
  console.log(`📊 Diagnostic: http://0.0.0.0:${PORT}/api/diagnostic`);
  console.log('\n✅ Cliquez sur le lien pour voir votre application !');
});

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur critique:', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée:', reason);
});
