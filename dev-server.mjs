
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 === DÉMARRAGE SERVEUR DÉVELOPPEMENT COMPLET ===\n');

let backendProcess = null;
let frontendProcess = null;

async function startBackend() {
  console.log('🔧 Démarrage du serveur backend...');
  
  return new Promise((resolve) => {
    backendProcess = spawn('npx', ['tsx', 'server/index.ts'], {
      stdio: ['inherit', 'inherit', 'inherit'],
      cwd: process.cwd(),
      shell: true,
      env: { ...process.env, PORT: '5000' }
    });

    backendProcess.on('error', (error) => {
      console.error('❌ Erreur backend:', error.message);
    });

    // Considérer que le backend est prêt après 3 secondes
    setTimeout(() => {
      console.log('✅ Backend démarré sur http://localhost:5000');
      resolve();
    }, 3000);
  });
}

async function startFrontend() {
  console.log('🎨 Démarrage du frontend Vite...');
  
  frontendProcess = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
    stdio: ['inherit', 'inherit', 'inherit'],
    cwd: process.cwd(),
    shell: true
  });

  frontendProcess.on('error', (error) => {
    console.error('❌ Erreur frontend:', error.message);
  });

  console.log('✅ Frontend Vite démarré sur http://localhost:5173');
}

async function startServers() {
  try {
    // Démarrer le backend en premier
    await startBackend();
    
    // Puis démarrer le frontend
    await startFrontend();
    
    console.log('\n🎯 === SERVICES ACTIFS ===');
    console.log('🔧 Backend API: http://localhost:5000');
    console.log('🎨 Frontend App: http://localhost:5173');
    console.log('💡 L\'application complète est accessible via le frontend\n');
    
  } catch (error) {
    console.error('💥 Erreur lors du démarrage:', error);
    process.exit(1);
  }
}

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt des serveurs...');
  
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }
  
  if (frontendProcess) {
    frontendProcess.kill('SIGTERM');
  }
  
  setTimeout(() => {
    console.log('✅ Serveurs arrêtés');
    process.exit(0);
  }, 1000);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt demandé...');
  
  if (backendProcess) backendProcess.kill('SIGTERM');
  if (frontendProcess) frontendProcess.kill('SIGTERM');
  
  process.exit(0);
});

// Démarrage
startServers();
