
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Démarrage de votre interface Digital Alchemy Lab...');

// Vérifier que les dépendances sont installées
const packageJsonPath = join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json non trouvé');
  process.exit(1);
}

// Vérifier que node_modules existe
const nodeModulesPath = join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installation des dépendances...');
  const install = spawn('npm', ['install'], { stdio: 'inherit' });
  install.on('close', (code) => {
    if (code === 0) {
      startViteServer();
    } else {
      console.error('❌ Erreur lors de l\'installation des dépendances');
      process.exit(1);
    }
  });
} else {
  startViteServer();
}

function startViteServer() {
  console.log('🎨 Lancement de Vite pour votre interface React...');
  
  // Démarrer Vite en mode développement
  const viteServer = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5000'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development'
    }
  });

  viteServer.on('error', (err) => {
    console.error('❌ Erreur Vite:', err);
  });

  viteServer.on('close', (code) => {
    console.log(`Vite fermé avec le code ${code}`);
  });

  // Gérer l'arrêt propre
  process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du serveur...');
    viteServer.kill('SIGINT');
    process.exit(0);
  });

  console.log('✅ Votre interface Digital Alchemy Lab devrait être disponible sur http://0.0.0.0:5000');
  console.log('🎨 Interface avec particules, animations et style cyberpunk activée');
}
