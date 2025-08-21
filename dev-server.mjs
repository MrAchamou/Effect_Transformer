import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Démarrage du serveur de développement ES...\n');

// Démarrer le serveur backend avec tsx pour TypeScript ES modules
const backendProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  shell: true
});

backendProcess.on('error', (error) => {
  console.error('❌ Erreur backend:', error.message);
  process.exit(1);
});

// Attendre un peu avant de démarrer le frontend
setTimeout(() => {
  console.log('🎨 Démarrage du frontend Vite...');

  const frontendProcess = spawn('npx', ['vite'], {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true
  });

  frontendProcess.on('error', (error) => {
    console.error('❌ Erreur frontend:', error.message);
  });
}, 2000);

console.log('✅ Serveurs en cours de démarrage !');
console.log('🌐 Frontend: http://localhost:5173');
console.log('🔧 Backend: http://localhost:5000');