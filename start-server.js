
#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs').promises;

async function cleanupAndStart() {
  console.log('🧹 Nettoyage des processus existants...');
  
  // Tuer tous les processus Node/TSX existants
  try {
    await new Promise((resolve) => {
      exec('pkill -f "node\\|tsx" 2>/dev/null || true', () => resolve());
    });
    console.log('✅ Processus nettoyés');
  } catch (error) {
    console.log('⚠️ Nettoyage partiel des processus');
  }
  
  // Attendre un peu pour que les ports se libèrent
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('🚀 Démarrage du serveur...');
  
  // Démarrer le serveur avec gestion d'erreurs
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
      console.error(`❌ Serveur arrêté avec le code: ${code}`);
      process.exit(code);
    }
  });
  
  // Gestionnaire de signaux pour arrêt propre
  process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du serveur...');
    server.kill('SIGTERM');
    process.exit(0);
  });
}

cleanupAndStart().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
