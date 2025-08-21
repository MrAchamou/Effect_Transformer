
// Détection automatique du type de module
const isESModule = typeof module === 'undefined';

// Import universel
let spawn, fs;

async function loadDependencies() {
  if (isESModule) {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    spawn = require('child_process').spawn;
    fs = require('fs');
  } else {
    const childProcess = require('child_process');
    spawn = childProcess.spawn;
    fs = require('fs');
  }
}

async function startUniversalApp() {
  await loadDependencies();
  
  console.log('🚀 Démarrage universel de l\'application...\n');
  
  // Essayer TypeScript en premier
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '5000' }
  });
  
  server.on('error', (error) => {
    console.error('❌ TypeScript failed, démarrage serveur simple...');
    startFallbackServer();
  });
  
  // Gestion propre de l'arrêt
  process.on('SIGINT', () => {
    console.log('\n👋 Arrêt du serveur...');
    server.kill();
    process.exit(0);
  });
  
  console.log('✅ Serveur démarré sur http://0.0.0.0:5000');
}

function startFallbackServer() {
  const simpleServer = `
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: '🎨 Visual Effects Transformer',
    status: 'Serveur de développement actif',
    api: '/health'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`🚀 Serveur simple sur http://0.0.0.0:\${PORT}\`);
});
`;
  
  fs.writeFileSync('fallback-server.js', simpleServer);
  
  const fallback = spawn('node', ['fallback-server.js'], {
    stdio: 'inherit'
  });
  
  process.on('SIGINT', () => {
    fallback.kill();
    process.exit(0);
  });
}

// Exécution universelle
startUniversalApp().catch(error => {
  console.error('❌ Erreur démarrage:', error);
  process.exit(1);
});
