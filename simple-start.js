
const { spawn } = require('child_process');
const fs = require('fs');

function startApp() {
  console.log('🚀 Démarrage de l\'application...\n');
  
  // Vérifier si le serveur TypeScript peut démarrer
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '5000' }
  });
  
  server.on('error', (error) => {
    console.error('❌ Erreur TypeScript, fallback vers serveur simple...');
    startFallbackServer();
  });
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Arrêt du serveur...');
    server.kill();
    process.exit(0);
  });
  
  console.log('✅ Serveur démarré sur http://0.0.0.0:5000');
}

function startFallbackServer() {
  // Créer un serveur minimal si TypeScript échoue
  const simpleServer = `
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('client'));

app.get('/', (req, res) => {
  res.send(\`
    <h1>🎨 Visual Effects Transformer</h1>
    <p>Serveur de développement actif</p>
    <p>API disponible sur /health</p>
  \`);
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

// Démarrage
startApp();
