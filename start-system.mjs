
import { spawn } from 'child_process';
import fs from 'fs';

console.log('🚀 === DÉMARRAGE SYSTÈME SIMPLIFIÉ ===\n');

async function startSystem() {
  try {
    // 1. Vérifier que le serveur principal existe
    if (!fs.existsSync('server/index.ts')) {
      console.log('❌ server/index.ts manquant');
      return false;
    }

    console.log('✅ Fichiers de base vérifiés');

    // 2. Démarrer le serveur de développement
    console.log('🎯 Démarrage du serveur...');
    
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      env: { ...process.env }
    });

    server.on('error', (error) => {
      console.error('❌ Erreur lors du démarrage:', error.message);
    });

    console.log('✅ Commande de démarrage lancée');
    
  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

startSystem();
