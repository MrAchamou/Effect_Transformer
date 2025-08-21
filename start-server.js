
#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class ServerManager {
  constructor() {
    this.serverProcess = null;
    this.isShuttingDown = false;
  }

  async startServer() {
    console.log('🔍 Vérifications pré-démarrage...\n');

    // Vérification rapide des fichiers critiques
    const criticalFiles = [
      'package.json',
      'server/index.ts',
      'server/routes.ts'
    ];

    for (const file of criticalFiles) {
      try {
        await fs.access(file);
        console.log(`✅ ${file} - OK`);
      } catch (error) {
        console.error(`❌ Fichier critique manquant: ${file}`);
        process.exit(1);
      }
    }

    // Vérifier si TypeScript est installé
    try {
      require.resolve('typescript');
      console.log('✅ TypeScript - OK');
    } catch (error) {
      console.error('❌ TypeScript non installé. Exécutez: npm install');
      process.exit(1);
    }

    console.log('\n🚀 Démarrage du serveur...\n');

    // Démarrer le serveur avec ts-node
    this.serverProcess = spawn('npx', ['ts-node', 'server/index.ts'], {
      stdio: 'inherit',
      env: { 
        ...process.env, 
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || '5000'
      }
    });

    // Gestion des signaux
    this.setupSignalHandlers();

    // Gestion des erreurs du processus serveur
    this.serverProcess.on('error', (error) => {
      console.error('💥 Erreur serveur:', error.message);
      if (!this.isShuttingDown) {
        console.log('🔄 Tentative de redémarrage...');
        setTimeout(() => this.startServer(), 3000);
      }
    });

    this.serverProcess.on('exit', (code, signal) => {
      if (!this.isShuttingDown) {
        console.log(`⚠️ Serveur arrêté (code: ${code}, signal: ${signal})`);
        if (code !== 0) {
          console.log('🔄 Redémarrage automatique...');
          setTimeout(() => this.startServer(), 3000);
        }
      }
    });

    // Test de santé après démarrage
    setTimeout(() => this.healthCheck(), 5000);
  }

  setupSignalHandlers() {
    const shutdown = (signal) => {
      console.log(`\n🛑 Signal ${signal} reçu. Arrêt en cours...`);
      this.isShuttingDown = true;
      
      if (this.serverProcess) {
        this.serverProcess.kill('SIGTERM');
        
        // Force kill après 10 secondes
        setTimeout(() => {
          if (this.serverProcess) {
            console.log('⚠️ Arrêt forcé du serveur');
            this.serverProcess.kill('SIGKILL');
          }
          process.exit(0);
        }, 10000);
      } else {
        process.exit(0);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }

  async healthCheck() {
    const http = require('http');
    
    const req = http.request({
      hostname: 'localhost',
      port: process.env.PORT || 5000,
      path: '/api/health',
      method: 'GET',
      timeout: 3000
    }, (res) => {
      if (res.statusCode === 200 || res.statusCode === 503) {
        console.log('✅ Serveur opérationnel - Health check OK');
      } else {
        console.log(`⚠️ Health check - Status: ${res.statusCode}`);
      }
    });

    req.on('error', (error) => {
      console.log('❌ Health check échoué:', error.message);
    });

    req.on('timeout', () => {
      req.destroy();
      console.log('⏱️ Health check timeout');
    });

    req.end();
  }
}

// Démarrage
const manager = new ServerManager();
manager.startServer().catch(error => {
  console.error('💥 Erreur critique au démarrage:', error);
  process.exit(1);
});
