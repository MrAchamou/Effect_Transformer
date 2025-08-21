
const { spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 Démarrage du serveur...');

// Vérifier si le serveur est déjà en cours d'exécution
const { exec } = require('child_process');
exec('lsof -ti:5000', (error, stdout) => {
  if (stdout.trim()) {
    console.log('⚠️ Port 5000 déjà utilisé, arrêt du processus existant...');
    exec(`kill -9 ${stdout.trim()}`, () => {
      startServer();
    });
  } else {
    startServer();
  }
});

function startServer() {
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });

  server.on('error', (error) => {
    console.error('❌ Erreur de démarrage:', error);
    process.exit(1);
  });

  server.on('exit', (code) => {
    if (code !== 0) {
      console.log(`⚠️ Serveur arrêté avec le code ${code}`);
    }
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du serveur...');
    server.kill('SIGTERM');
    process.exit(0);
  });
}
