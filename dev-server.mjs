
#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Démarrage du serveur de développement...\n');

// Démarrer le serveur avec tsx
const serverProcess = spawn('npx', [
  'tsx',
  'server/index.ts'
], {
  cwd: __dirname,
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '5000'
  },
  stdio: 'inherit'
});

serverProcess.on('error', (error) => {
  console.error('❌ Erreur serveur:', error);
  process.exit(1);
});

serverProcess.on('close', (code) => {
  console.log(`🔚 Serveur fermé avec le code: ${code}`);
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  serverProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});
