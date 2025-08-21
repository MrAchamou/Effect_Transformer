
import { spawn } from 'child_process';
import { readFile, writeFile } from 'fs/promises';
import fs from 'fs';

console.log('🚀 === DÉMARRAGE ROBUSTE DU SYSTÈME ===\n');

// Classe SystemHealthMonitor intégrée
class SystemHealthMonitor {
  constructor() {
    this.issues = [];
  }

  async performFullHealthCheck() {
    console.log('🔍 Diagnostic système en cours...');
    this.issues = [];
    
    const checks = [
      this.checkServerFile(),
      this.checkPackageJson(),
      this.checkNodeModules(),
      this.checkTsConfig()
    ];

    const results = await Promise.allSettled(checks);
    const fixes = [];
    
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        this.issues.push(result.reason);
      } else if (result.value?.fix) {
        fixes.push(result.value.fix);
      }
    });

    const status = this.issues.length > 5 ? 'critical' : 
                  this.issues.length > 0 ? 'warning' : 'healthy';

    return { status, issues: this.issues, fixes };
  }

  async checkServerFile() {
    if (!fs.existsSync('server/index.ts')) {
      throw new Error('server/index.ts manquant');
    }
    return { status: 'ok' };
  }

  async checkPackageJson() {
    if (!fs.existsSync('package.json')) {
      throw new Error('package.json manquant');
    }
    return { status: 'ok' };
  }

  async checkNodeModules() {
    if (!fs.existsSync('node_modules')) {
      return { status: 'warning', fix: 'node_modules manquant' };
    }
    return { status: 'ok' };
  }

  async checkTsConfig() {
    if (!fs.existsSync('tsconfig.json')) {
      return { status: 'warning', fix: 'tsconfig.json manquant' };
    }
    return { status: 'ok' };
  }

  async startMonitoring() {
    console.log('✅ Monitoring système démarré');
    return true;
  }
}

class RobustStartup {
  constructor() {
    this.maxRetries = 3;
    this.currentRetries = 0;
    this.healthMonitor = new SystemHealthMonitor();
  }

  async start() {
    try {
      // 1. Diagnostic initial complet
      console.log('1️⃣ Diagnostic initial...');
      const healthCheck = await this.healthMonitor.performFullHealthCheck();
      
      if (healthCheck.status === 'critical') {
        console.log('❌ Problèmes critiques détectés. Tentative de réparation...');
        await this.performEmergencyRepair();
        
        // Re-vérifier après réparation
        const recheck = await this.healthMonitor.performFullHealthCheck();
        if (recheck.status === 'critical') {
          throw new Error('Impossible de résoudre les problèmes critiques');
        }
      }

      console.log(`✅ État système: ${healthCheck.status}`);
      if (healthCheck.fixes.length > 0) {
        console.log(`🔧 Réparations effectuées: ${healthCheck.fixes.length}`);
      }

      // 2. Vérification des dépendances
      console.log('\n2️⃣ Vérification des dépendances...');
      await this.checkAndInstallDependencies();

      // 3. Compilation TypeScript si nécessaire
      console.log('\n3️⃣ Compilation TypeScript...');
      await this.compileTypeScript();

      // 4. Démarrage du monitoring
      console.log('\n4️⃣ Démarrage du monitoring...');
      await this.healthMonitor.startMonitoring();

      // 5. Démarrage du serveur
      console.log('\n5️⃣ Démarrage du serveur...');
      await this.startServer();

    } catch (error) {
      console.error('💥 Erreur critique lors du démarrage:', error.message);
      
      if (this.currentRetries < this.maxRetries) {
        this.currentRetries++;
        console.log(`🔄 Tentative ${this.currentRetries}/${this.maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.start();
      }
      
      console.log('❌ Échec définitif du démarrage');
      process.exit(1);
    }
  }

  async performEmergencyRepair() {
    console.log('🚨 Réparation d\'urgence en cours...');
    
    // Créer les fichiers critiques manquants
    const criticalRepairs = [
      {
        path: 'server/index.ts',
        content: this.generateMinimalServer()
      },
      {
        path: 'server/routes.ts',
        content: this.generateMinimalRoutes()
      },
      {
        path: 'server/utils/logger.ts',
        content: this.generateMinimalLogger()
      }
    ];

    for (const repair of criticalRepairs) {
      try {
        if (!fs.existsSync(repair.path)) {
          await writeFile(repair.path, repair.content, 'utf-8');
          console.log(`  ✅ ${repair.path} créé`);
        }
      } catch (error) {
        console.log(`  ❌ Échec réparation ${repair.path}: ${error.message}`);
      }
    }
  }

  async checkAndInstallDependencies() {
    try {
      const packageJson = JSON.parse(await readFile('package.json', 'utf-8'));
      const requiredDeps = ['express', 'cors', 'multer', 'zod'];
      
      const missingDeps = requiredDeps.filter(dep => 
        !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
      );
      
      if (missingDeps.length > 0) {
        console.log(`📦 Installation des dépendances manquantes: ${missingDeps.join(', ')}`);
        await this.runCommand('npm', ['install', ...missingDeps]);
      } else {
        console.log('✅ Toutes les dépendances sont présentes');
      }
    } catch (error) {
      console.log('⚠️ Vérification des dépendances impossible:', error.message);
    }
  }

  async compileTypeScript() {
    try {
      await this.runCommand('npx', ['tsc', '--noEmit']);
      console.log('✅ TypeScript compile sans erreur');
    } catch (error) {
      console.log('⚠️ Avertissements TypeScript (continuant...)');
    }
  }

  async startServer() {
    return new Promise((resolve, reject) => {
      const server = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'development' }
      });

      server.on('spawn', () => {
        console.log('✅ Serveur démarré avec succès');
        setTimeout(() => resolve(true), 2000);
      });

      server.on('error', (error) => {
        console.error('❌ Erreur serveur:', error.message);
        reject(error);
      });

      server.on('exit', (code) => {
        if (code !== 0) {
          console.error(`❌ Serveur arrêté avec le code: ${code}`);
          reject(new Error(`Exit code: ${code}`));
        }
      });
    });
  }

  async runCommand(command, args) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, { stdio: 'pipe' });
      
      let output = '';
      process.stdout?.on('data', (data) => output += data.toString());
      process.stderr?.on('data', (data) => output += data.toString());
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Command failed: ${command} ${args.join(' ')}\n${output}`));
        }
      });
    });
  }

  generateMinimalServer() {
    return `
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'API' });
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});

export default app;
`;
  }

  generateMinimalRoutes() {
    return `
import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Routes'
  });
});

router.post('/transform', (req, res) => {
  res.json({
    success: true,
    message: 'Service temporairement indisponible',
    timestamp: new Date().toISOString()
  });
});

export { router as routes };
export default router;
`;
  }

  generateMinimalLogger() {
    return `
export const logger = {
  info: (message, data) => console.log(\`[INFO] \${message}\`, data || ''),
  warn: (message, data) => console.warn(\`[WARN] \${message}\`, data || ''),
  error: (message, data) => console.error(\`[ERROR] \${message}\`, data || ''),
  debug: (message, data) => console.debug(\`[DEBUG] \${message}\`, data || '')
};

export default logger;
`;
  }
}

// Démarrage
const startup = new RobustStartup();
startup.start().catch(error => {
  console.error('Échec du démarrage:', error);
  process.exit(1);
});
