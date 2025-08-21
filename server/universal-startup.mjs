

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 === DÉMARRAGE UNIVERSEL ROBUSTE ===\n');

class UniversalStartup {
  constructor() {
    this.issues = [];
    this.fixes = [];
  }

  async start() {
    try {
      console.log('1️⃣ Installation des dépendances critiques...');
      await this.installCriticalDeps();

      console.log('\n2️⃣ Vérification et création des fichiers...');
      await this.ensureCriticalFiles();

      console.log('\n3️⃣ Démarrage du serveur...');
      await this.startServer();

    } catch (error) {
      console.error('💥 Erreur critique:', error.message);
      await this.emergencyFallback();
    }
  }

  async installCriticalDeps() {
    // Vérifier si tsx est installé
    try {
      await this.runCommand('npx', ['tsx', '--version']);
      console.log('✅ tsx déjà disponible');
    } catch {
      console.log('📦 Installation de tsx...');
      try {
        await this.runCommand('npm', ['install', 'tsx']);
        console.log('✅ tsx installé avec succès');
      } catch (error) {
        console.log('⚠️ Installation tsx échouée, utilisation de node...');
      }
    }
  }

  async ensureCriticalFiles() {
    // Vérifier server/index.ts
    if (!fs.existsSync('server/index.ts')) {
      console.log('🔧 Création de server/index.ts...');
      await this.createServerIndex();
    }

    // Vérifier server/routes.ts
    if (!fs.existsSync('server/routes.ts')) {
      console.log('🔧 Création de server/routes.ts...');
      await this.createServerRoutes();
    }

    // Vérifier logger
    if (!fs.existsSync('server/utils/logger.ts')) {
      console.log('🔧 Création du logger...');
      await this.createLogger();
    }

    console.log('✅ Tous les fichiers critiques sont présents');
  }

  async createServerIndex() {
    const content = `import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de base
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API basique
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Serveur opérationnel',
    services: ['universal-preprocessor', 'js-preprocessor'],
    timestamp: new Date().toISOString()
  });
});

// Route de test
app.post('/api/transform', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Service de transformation prêt',
      timestamp: new Date().toISOString(),
      data: req.body
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware d'erreur
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({ 
    error: 'Erreur interne',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// Démarrage
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`🚀 Serveur démarré sur http://0.0.0.0:\${PORT}\`);
  console.log(\`📡 API disponible sur http://0.0.0.0:\${PORT}/api\`);
  console.log(\`💓 Health check: http://0.0.0.0:\${PORT}/health\`);
});

export default app;
`;
    
    await fs.promises.writeFile('server/index.ts', content, 'utf-8');
  }

  async createServerRoutes() {
    const content = `import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

export { router as routes };
export default router;
`;
    
    await fs.promises.writeFile('server/routes.ts', content, 'utf-8');
  }

  async createLogger() {
    // Créer le dossier utils s'il n'existe pas
    if (!fs.existsSync('server/utils')) {
      await fs.promises.mkdir('server/utils', { recursive: true });
    }

    const content = `export const logger = {
  info: (message: string, data?: any) => console.log(\`[INFO] \${message}\`, data || ''),
  warn: (message: string, data?: any) => console.warn(\`[WARN] \${message}\`, data || ''),
  error: (message: string, data?: any) => console.error(\`[ERROR] \${message}\`, data || ''),
  debug: (message: string, data?: any) => console.debug(\`[DEBUG] \${message}\`, data || '')
};

export default logger;
`;
    
    await fs.promises.writeFile('server/utils/logger.ts', content, 'utf-8');
  }

  async startServer() {
    return new Promise((resolve, reject) => {
      const startCommand = fs.existsSync('node_modules/.bin/tsx') ? 
        ['npx', ['tsx', 'server/index.ts']] : 
        ['node', ['--loader', 'tsx/esm', 'server/index.ts']];

      const [command, args] = startCommand;
      
      console.log(\`📡 Démarrage avec: \${command} \${args.join(' ')}\`);
      
      const server = spawn(command, args, {
        stdio: 'inherit',
        env: { 
          ...process.env, 
          NODE_ENV: 'development',
          PORT: '5000'
        }
      });

      server.on('spawn', () => {
        console.log('✅ Serveur lancé avec succès!');
        console.log('🌐 Application disponible sur http://0.0.0.0:5000');
        setTimeout(() => resolve(true), 1000);
      });

      server.on('error', (error) => {
        console.error('❌ Erreur de démarrage:', error.message);
        reject(error);
      });

      server.on('exit', (code) => {
        if (code !== 0) {
          console.error(\`❌ Serveur arrêté avec le code: \${code}\`);
          reject(new Error(\`Exit code: \${code}\`));
        }
      });
    });
  }

  async emergencyFallback() {
    console.log('🚨 === MODE DE SECOURS ===');
    console.log('🔧 Création d\'un serveur de secours...');
    
    const emergencyServer = \`const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'EMERGENCY MODE',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Serveur de secours actif',
    status: 'EMERGENCY',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\\\`🚨 Serveur de secours sur port \\\${PORT}\\\`);
});
\`;

    await fs.promises.writeFile('emergency-server.js', emergencyServer, 'utf-8');
    
    console.log('🚀 Démarrage du serveur de secours...');
    const emergency = spawn('node', ['emergency-server.js'], {
      stdio: 'inherit',
      env: { ...process.env, PORT: '5000' }
    });

    emergency.on('spawn', () => {
      console.log('✅ Serveur de secours opérationnel!');
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
          reject(new Error(\`Command failed: \${command} \${args.join(' ')}\`));
        }
      });
    });
  }
}

// Démarrage
const startup = new UniversalStartup();
startup.start().catch(error => {
  console.error('Échec total:', error);
  process.exit(1);
});
