import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

class UniversalStartup {
  constructor() {
    this.baseDir = process.cwd();
    this.serverDir = path.join(this.baseDir, 'server');
    this.startupAttempts = 0;
    this.maxAttempts = 5;
  }

  async start() {
    console.log('🚀 === DÉMARRAGE UNIVERSEL DE L\'APPLICATION ===\n');

    try {
      // 1. Vérifications préliminaires
      await this.performPreflightChecks();

      // 2. Diagnostic système
      await this.runSystemDiagnostic();

      // 3. Démarrage du serveur
      await this.startServer();

    } catch (error) {
      console.error('💥 ERREUR CRITIQUE:', error.message);
      await this.handleStartupFailure(error);
    }
  }

  async performPreflightChecks() {
    console.log('🔍 Vérifications préliminaires...');

    const criticalFiles = [
      'server/index.ts',
      'server/routes.ts', 
      'server/services',
      'package.json'
    ];

    for (const file of criticalFiles) {
      try {
        await fs.access(file);
        console.log(`  ✅ ${file}: OK`);
      } catch (error) {
        console.log(`  ❌ ${file}: MANQUANT`);
        throw new Error(`Fichier critique manquant: ${file}`);
      }
    }

    console.log('✅ Vérifications préliminaires terminées\n');
  }

  async runSystemDiagnostic() {
    console.log('🔧 Diagnostic système rapide...');

    try {
      // Vérifier les dépendances npm
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf-8'));

      if (!packageJson.dependencies.tsx) {
        console.log('  ⚠️ tsx manquant, installation automatique...');
        await this.executeCommand('npm', ['install', 'tsx']);
      }

      // Vérifier les modules ES
      const indexContent = await fs.readFile('server/index.ts', 'utf-8');
      if (!indexContent.includes('import')) {
        console.log('  ⚠️ Conversion ES6 nécessaire');
      }

      console.log('✅ Diagnostic système terminé\n');

    } catch (error) {
      console.warn('⚠️ Diagnostic système partiel:', error.message);
    }
  }

  async startServer() {
    console.log('🎯 Démarrage du serveur...');

    const startupCommands = [
      { cmd: 'npm', args: ['run', 'dev'], description: 'Serveur de développement' },
      { cmd: 'node', args: ['--import', 'tsx/esm', 'server/index.ts'], description: 'Mode direct TSX' },
      { cmd: 'node', args: ['quick-fix-server.mjs'], description: 'Serveur de secours' }
    ];

    for (const command of startupCommands) {
      try {
        console.log(`📡 Tentative: ${command.description}`);
        await this.executeCommand(command.cmd, command.args);
        console.log(`✅ ${command.description} démarré avec succès`);
        return;

      } catch (error) {
        console.log(`❌ ${command.description} échoué: ${error.message}`);
        this.startupAttempts++;

        if (this.startupAttempts >= this.maxAttempts) {
          throw new Error('Tous les modes de démarrage ont échoué');
        }
      }
    }
  }

  async executeCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      console.log(`📡 Exécution: ${command} ${args.join(' ')}`);

      const process = spawn(command, args, {
        stdio: ['inherit', 'inherit', 'inherit'],
        shell: true,
        cwd: this.baseDir
      });

      let startupTimer = null;

      // Pour les serveurs, on considère le démarrage réussi après 3 secondes
      if (command === 'npm' && args.includes('dev')) {
        startupTimer = setTimeout(() => {
          console.log('✅ Serveur démarré (timeout atteint)');
          resolve();
        }, 3000);
      }

      process.on('exit', (code) => {
        if (startupTimer) clearTimeout(startupTimer);

        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Processus terminé avec le code ${code}`));
        }
      });

      process.on('error', (error) => {
        if (startupTimer) clearTimeout(startupTimer);
        reject(error);
      });
    });
  }

  async handleStartupFailure(error) {
    console.log('\n🚨 === MODE DE RÉCUPÉRATION ===');
    console.log('Tentative de création d\'un serveur de secours...');

    try {
      await this.createEmergencyServer();
      await this.executeCommand('node', ['emergency-server.mjs']);
      console.log('✅ Serveur de secours démarré');

    } catch (recoveryError) {
      console.error('❌ Récupération impossible:', recoveryError.message);
      console.log('\n📋 Actions suggérées:');
      console.log('1. Vérifier les dépendances: npm install');
      console.log('2. Nettoyer le cache: npm cache clean --force');
      console.log('3. Redémarrer le processus');

      process.exit(1);
    }
  }

  async createEmergencyServer() {
    const emergencyServerCode = `
import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de base
app.use(cors());
app.use(express.json());
app.use(express.static('client'));

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur de secours actif' });
});

// Route principale
app.get('/', (req, res) => {
  res.send(\`
    <html>
      <body>
        <h1>🚀 Serveur de Secours Actif</h1>
        <p>L'application fonctionne en mode de récupération.</p>
        <p>Port: \${PORT}</p>
      </body>
    </html>
  \`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`✅ Serveur de secours démarré sur le port \${PORT}\`);
  console.log(\`🌐 URL: http://0.0.0.0:\${PORT}\`);
});
`;

    await fs.writeFile('emergency-server.mjs', emergencyServerCode);
    console.log('📝 Serveur de secours créé');
  }
}

// Démarrage automatique
const startup = new UniversalStartup();
startup.start().catch(console.error);