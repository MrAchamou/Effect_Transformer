
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import http from 'http';

class UniversalAppStarter {
  constructor() {
    this.processes = [];
    this.setupGracefulShutdown();
  }

  setupGracefulShutdown() {
    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, () => {
        console.log(`\n👋 Arrêt gracieux (${signal})...`);
        this.processes.forEach(proc => {
          try {
            proc.kill('SIGTERM');
          } catch (e) {
            // Ignore errors
          }
        });
        process.exit(0);
      });
    });
  }

  async checkPort(port) {
    return new Promise((resolve) => {
      const server = http.createServer();
      server.listen(port, '0.0.0.0', () => {
        server.close(() => resolve(true));
      }).on('error', () => resolve(false));
    });
  }

  async startTypeScriptServer() {
    console.log('🚀 Tentative de démarrage serveur TypeScript...\n');
    
    try {
      // Vérifier que tsx est disponible
      const tsxProcess = spawn('npx', ['tsx', '--version'], { 
        stdio: ['ignore', 'pipe', 'pipe'] 
      });
      
      await new Promise((resolve, reject) => {
        tsxProcess.on('close', (code) => {
          if (code === 0) resolve(code);
          else reject(new Error('tsx non disponible'));
        });
      });

      // Démarrer le serveur principal
      const serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        env: { 
          ...process.env, 
          NODE_ENV: 'development',
          PORT: '5000'
        }
      });

      this.processes.push(serverProcess);

      serverProcess.on('error', (error) => {
        console.error('❌ Erreur serveur TypeScript:', error.message);
        this.startFallbackServer();
      });

      // Attendre un peu pour voir si le serveur démarre correctement
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const portAvailable = await this.checkPort(5000);
      if (portAvailable) {
        throw new Error('Le serveur ne semble pas avoir démarré sur le port 5000');
      }

      console.log('✅ Serveur TypeScript démarré avec succès sur http://0.0.0.0:5000');
      return true;

    } catch (error) {
      console.log('⚠️ Échec TypeScript, passage au serveur de fallback...');
      this.startFallbackServer();
      return false;
    }
  }

  async startFallbackServer() {
    console.log('🔄 Démarrage serveur de fallback...\n');

    const fallbackCode = `
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'client')));

// Routes basiques
app.get('/', (req, res) => {
  res.send(\`
    <!DOCTYPE html>
    <html>
    <head>
      <title>🎨 Visual Effects Transformer</title>
      <style>
        body { 
          font-family: 'Segoe UI', sans-serif; 
          max-width: 800px; 
          margin: 50px auto; 
          padding: 20px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }
        .status { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <h1>🎨 Visual Effects Transformer</h1>
      <div class="status">
        <h2>✅ Serveur de développement actif</h2>
        <p>Mode: Serveur de fallback Express</p>
        <p>Port: \${PORT}</p>
        <p>Status: Opérationnel</p>
      </div>
      <div class="status">
        <h3>📡 API Endpoints disponibles:</h3>
        <ul style="text-align: left; display: inline-block;">
          <li>GET / - Cette page</li>
          <li>GET /health - Status de santé</li>
          <li>GET /api/status - Informations système</li>
        </ul>
      </div>
    </body>
    </html>
  \`);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mode: 'fallback',
    time: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    server: 'Express Fallback',
    nodejs: process.version,
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`🚀 Serveur fallback Express sur http://0.0.0.0:\${PORT}\`);
  console.log(\`🔗 Accessible via: http://localhost:\${PORT}\`);
});
`;

    // Écrire le serveur de fallback
    await fs.writeFile('fallback-server.mjs', fallbackCode);

    const fallbackProcess = spawn('node', ['fallback-server.mjs'], {
      stdio: 'inherit'
    });

    this.processes.push(fallbackProcess);

    fallbackProcess.on('error', (error) => {
      console.error('❌ Erreur serveur de fallback:', error.message);
      process.exit(1);
    });
  }

  async start() {
    console.log('🎯 Démarrage universel de l\'application...\n');
    
    // Tentative de démarrage du serveur TypeScript principal
    const success = await this.startTypeScriptServer();
    
    if (!success) {
      console.log('📋 Serveur de fallback activé pour assurer la continuité');
    }
  }
}

// Démarrage immédiat
const starter = new UniversalAppStarter();
starter.start().catch(error => {
  console.error('💥 Erreur fatale:', error.message);
  process.exit(1);
});
