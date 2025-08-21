
#!/usr/bin/env node

const fs = require('fs').promises;
const { spawn } = require('child_process');

async function startServer() {
  console.log('🚀 === DÉMARRAGE SERVEUR ROBUSTE ===\n');
  
  try {
    // 1. Vérification pré-démarrage
    console.log('1️⃣ Vérification pré-démarrage...');
    await preStartupChecks();
    
    // 2. Démarrage du serveur
    console.log('\n2️⃣ Démarrage du serveur...');
    await startMainServer();
    
  } catch (error) {
    console.error('❌ Erreur critique:', error.message);
    
    // Fallback: Démarrer un serveur minimal
    console.log('\n🔄 Démarrage serveur de secours...');
    await startFallbackServer();
  }
}

async function preStartupChecks() {
  const checks = [
    { name: 'package.json', path: 'package.json' },
    { name: 'Server directory', path: 'server' },
    { name: 'Start script', path: 'server/index.ts' }
  ];
  
  for (const check of checks) {
    try {
      await fs.access(check.path);
      console.log(`  ✅ ${check.name}: OK`);
    } catch (error) {
      console.log(`  ⚠️ ${check.name}: Manquant`);
      
      if (check.name === 'Start script') {
        await createMinimalServer();
      }
    }
  }
}

async function createMinimalServer() {
  const serverContent = `const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes de base
app.get('/', (req, res) => {
  res.json({ 
    message: 'Code Enhancement Server', 
    status: 'Running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    api: 'active',
    services: 'minimal',
    status: 'operational'
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrage
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`🚀 Serveur démarré sur http://0.0.0.0:\${PORT}\`);
  console.log(\`📡 Santé: http://0.0.0.0:\${PORT}/health\`);
  console.log(\`🔍 API: http://0.0.0.0:\${PORT}/api/status\`);
});

module.exports = app;
`;
  
  try {
    await fs.mkdir('server', { recursive: true });
    await fs.writeFile('server/index.js', serverContent, 'utf-8');
    console.log('  🔧 Serveur minimal créé');
  } catch (error) {
    console.error('  ❌ Erreur création serveur minimal:', error.message);
  }
}

async function startMainServer() {
  return new Promise((resolve, reject) => {
    // Essayer TypeScript d'abord, puis JavaScript
    const commands = [
      { cmd: 'npm', args: ['run', 'dev'] },
      { cmd: 'npx', args: ['ts-node', 'server/index.ts'] },
      { cmd: 'node', args: ['server/index.js'] }
    ];
    
    let currentCommand = 0;
    
    function tryNextCommand() {
      if (currentCommand >= commands.length) {
        reject(new Error('Impossible de démarrer le serveur avec toutes les méthodes'));
        return;
      }
      
      const { cmd, args } = commands[currentCommand];
      console.log(`  🔄 Tentative: ${cmd} ${args.join(' ')}`);
      
      const server = spawn(cmd, args, {
        stdio: ['inherit', 'inherit', 'inherit'],
        env: { ...process.env, PORT: '5000' }
      });
      
      server.on('error', (error) => {
        console.log(`  ❌ ${cmd} a échoué: ${error.message}`);
        currentCommand++;
        setTimeout(tryNextCommand, 1000);
      });
      
      server.on('exit', (code) => {
        if (code !== 0) {
          console.log(`  ❌ ${cmd} s'est arrêté avec le code ${code}`);
          currentCommand++;
          setTimeout(tryNextCommand, 1000);
        } else {
          resolve();
        }
      });
      
      // Si le processus survit 3 secondes, considérer comme succès
      setTimeout(() => {
        if (!server.killed) {
          console.log(`  ✅ Serveur démarré avec succès: ${cmd} ${args.join(' ')}`);
          resolve();
        }
      }, 3000);
    }
    
    tryNextCommand();
  });
}

async function startFallbackServer() {
  // Créer et démarrer un serveur minimal de secours
  await createMinimalServer();
  
  const server = spawn('node', ['server/index.js'], {
    stdio: ['inherit', 'inherit', 'inherit'],
    env: { ...process.env, PORT: '5000' }
  });
  
  server.on('error', (error) => {
    console.error('❌ Serveur de secours échoué:', error.message);
    process.exit(1);
  });
  
  console.log('🆘 Serveur de secours démarré');
  
  // Garder le processus vivant
  process.on('SIGINT', () => {
    console.log('\n👋 Arrêt du serveur...');
    server.kill();
    process.exit(0);
  });
}

// Démarrage automatique
if (require.main === module) {
  startServer().catch(error => {
    console.error('💥 Échec complet du démarrage:', error);
    process.exit(1);
  });
}

module.exports = { startServer };
