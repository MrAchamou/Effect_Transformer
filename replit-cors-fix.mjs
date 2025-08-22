
import { spawn } from 'child_process';

console.log('🔧 === CORRECTION CORS REPLIT ===');
console.log('🎯 Démarrage avec configuration CORS ultra-permissive...');

// Démarrer le serveur avec variables d'environnement spéciales
const server = spawn('node', ['--import', 'tsx/esm', 'server/index.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    CORS_ORIGIN: '*',
    ALLOW_ALL_HOSTS: 'true',
    REPLIT_CORS_FIX: 'enabled',
    PORT: '5000'
  }
});

server.on('error', (err) => {
  console.error('❌ Erreur serveur:', err);
});

server.on('close', (code) => {
  console.log(`Serveur fermé avec le code ${code}`);
});

// Gérer l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  server.kill('SIGINT');
  process.exit(0);
});

console.log('✅ Serveur CORS-fixé démarré sur http://0.0.0.0:5000');
console.log('🌐 Autorisation automatique de tous les hôtes Replit');
