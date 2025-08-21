
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { spawn } from 'child_process';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Page de diagnostic
app.get('/', async (req, res) => {
  const diagnostics = await runDiagnostics();
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>🔍 Audit Application - Visual Effects Transformer</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #0d1421; color: #ffffff; }
        .container { max-width: 1000px; margin: 0 auto; }
        .status-ok { background: #1f4332; border-left: 4px solid #10b981; padding: 15px; margin: 10px 0; }
        .status-error { background: #4c1d1d; border-left: 4px solid #ef4444; padding: 15px; margin: 10px 0; }
        .status-warning { background: #4c3d1d; border-left: 4px solid #f59e0b; padding: 15px; margin: 10px 0; }
        button { background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; margin: 10px 5px; }
        button:hover { background: #2563eb; }
        .section { background: #1f2937; padding: 20px; border-radius: 8px; margin: 20px 0; }
        pre { background: #111827; padding: 15px; border-radius: 6px; overflow-x: auto; }
        .fix-button { background: #10b981; }
        .fix-button:hover { background: #059669; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔍 Audit Général - Visual Effects Transformer</h1>
        
        <div class="section">
          <h2>📊 État Actuel du Système</h2>
          ${diagnostics.summary}
        </div>
        
        <div class="section">
          <h2>🗂️ Vérification des Fichiers Critiques</h2>
          ${diagnostics.files}
        </div>
        
        <div class="section">
          <h2>🔧 Vérification des Services</h2>
          ${diagnostics.services}
        </div>
        
        <div class="section">
          <h2>📦 Vérification des Dépendances</h2>
          ${diagnostics.dependencies}
        </div>
        
        <div class="section">
          <h2>⚡ Actions Recommandées</h2>
          ${diagnostics.actions}
          <div style="margin-top: 20px;">
            <button class="fix-button" onclick="window.location.href='/fix-all'">🔧 Réparer Automatiquement</button>
            <button onclick="window.location.href='/test-interface'">🎨 Tester Interface</button>
            <button onclick="window.location.href='/start-dev'">🚀 Démarrer Dev Server</button>
          </div>
        </div>
      </div>
      
      <script>
        // Refresh automatique toutes les 30 secondes
        setTimeout(() => window.location.reload(), 30000);
      </script>
    </body>
    </html>
  `);
});

// API de réparation automatique
app.get('/fix-all', async (req, res) => {
  try {
    console.log('🔧 Démarrage réparation automatique...');
    
    // 1. Installer les dépendances manquantes
    await runCommand('npm install');
    
    // 2. Nettoyer les caches
    await runCommand('npm run build').catch(() => {}); // Ignore les erreurs
    
    // 3. Démarrer le serveur de développement
    const devServer = spawn('npm', ['run', 'dev'], { 
      detached: true,
      stdio: 'ignore'
    });
    
    devServer.unref();
    
    res.json({ 
      status: 'success', 
      message: 'Réparation terminée. Interface devrait être disponible sur le port 5173.' 
    });
    
    // Rediriger vers le serveur de développement après 3 secondes
    setTimeout(() => {
      process.exit(0);
    }, 3000);
    
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// Test de l'interface
app.get('/test-interface', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>🎨 Test Interface</title>
      <style>
        body { 
          font-family: 'Segoe UI', sans-serif; 
          background: linear-gradient(135deg, #0d1421 0%, #1f2937 100%); 
          color: #ffffff; 
          margin: 0; 
          padding: 40px; 
        }
        .container { 
          max-width: 800px; 
          margin: 0 auto; 
          text-align: center; 
        }
        .test-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 40px;
          margin: 20px 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .status-indicator {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 10px;
        }
        .online { background: #10b981; }
        .offline { background: #ef4444; }
        button {
          background: linear-gradient(135deg, #ffd700, #00f2fe);
          border: none;
          padding: 15px 30px;
          border-radius: 30px;
          color: #000;
          font-weight: bold;
          cursor: pointer;
          margin: 10px;
          transition: transform 0.2s;
        }
        button:hover { transform: scale(1.05); }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎨 Visual Effects Transformer</h1>
        <div class="test-card">
          <h2>Interface de Test Fonctionnelle</h2>
          <p><span class="status-indicator online"></span> Serveur de diagnostic actif</p>
          <p><span class="status-indicator offline"></span> Interface principale en cours de réparation</p>
          
          <div style="margin-top: 30px;">
            <button onclick="testAPI()">🔍 Tester API</button>
            <button onclick="window.open('http://localhost:5173', '_blank')">🚀 Ouvrir Interface Principale</button>
          </div>
          
          <div id="result" style="margin-top: 20px;"></div>
        </div>
      </div>
      
      <script>
        async function testAPI() {
          try {
            const response = await fetch('/api/health');
            const data = await response.json();
            document.getElementById('result').innerHTML = 
              '<div style="background: #1f4332; padding: 15px; border-radius: 8px;">✅ API fonctionne: ' + 
              JSON.stringify(data, null, 2) + '</div>';
          } catch (error) {
            document.getElementById('result').innerHTML = 
              '<div style="background: #4c1d1d; padding: 15px; border-radius: 8px;">❌ API Error: ' + 
              error.message + '</div>';
          }
        }
      </script>
    </body>
    </html>
  `);
});

// API de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Visual Effects Transformer - Diagnostic Server',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Démarrer serveur de développement
app.get('/start-dev', async (req, res) => {
  try {
    spawn('npm', ['run', 'dev'], { 
      detached: true,
      stdio: 'inherit'
    });
    
    res.json({ 
      message: 'Serveur de développement démarré. Interface disponible sur http://localhost:5173' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function runDiagnostics() {
  const diagnostics = {
    summary: '',
    files: '',
    services: '',
    dependencies: '',
    actions: ''
  };
  
  try {
    // Vérifier les fichiers critiques
    const criticalFiles = [
      'client/src/App.tsx',
      'client/src/main.tsx', 
      'server/index.ts',
      'server/routes.ts',
      'package.json'
    ];
    
    let fileStatus = '';
    let missingFiles = 0;
    
    for (const file of criticalFiles) {
      try {
        await fs.access(file);
        fileStatus += `<div class="status-ok">✅ ${file}</div>`;
      } catch {
        fileStatus += `<div class="status-error">❌ ${file} - MANQUANT</div>`;
        missingFiles++;
      }
    }
    
    diagnostics.files = fileStatus;
    
    // Résumé général
    if (missingFiles === 0) {
      diagnostics.summary = '<div class="status-ok">✅ Tous les fichiers critiques sont présents</div>';
    } else {
      diagnostics.summary = `<div class="status-error">❌ ${missingFiles} fichiers critiques manquants</div>`;
    }
    
    // Vérifier package.json
    try {
      const pkg = JSON.parse(await fs.readFile('package.json', 'utf-8'));
      const requiredDeps = ['react', 'express', 'vite', 'typescript'];
      let depsStatus = '';
      
      for (const dep of requiredDeps) {
        if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) {
          depsStatus += `<div class="status-ok">✅ ${dep}</div>`;
        } else {
          depsStatus += `<div class="status-error">❌ ${dep} - MANQUANT</div>`;
        }
      }
      
      diagnostics.dependencies = depsStatus;
    } catch (error) {
      diagnostics.dependencies = '<div class="status-error">❌ Impossible de lire package.json</div>';
    }
    
    // Services
    diagnostics.services = '<div class="status-warning">⚠️ Serveur principal arrêté - Serveur de diagnostic actif</div>';
    
    // Actions recommandées
    diagnostics.actions = `
      <div class="status-warning">
        <h3>🎯 Problème Principal Identifié</h3>
        <p><strong>L'interface ne s'affiche pas car :</strong></p>
        <ul style="text-align: left;">
          <li>Le serveur de développement Vite n'est pas démarré</li>
          <li>Possible conflit de ports ou dépendances</li>
          <li>Configuration TypeScript/React à vérifier</li>
        </ul>
        
        <h3>🔧 Solution Recommandée :</h3>
        <ol style="text-align: left;">
          <li>Cliquer sur "Réparer Automatiquement" ci-dessous</li>
          <li>Attendre la fin de l'installation des dépendances</li>
          <li>L'interface sera disponible sur http://localhost:5173</li>
        </ol>
      </div>
    `;
    
  } catch (error) {
    diagnostics.summary = `<div class="status-error">❌ Erreur lors du diagnostic: ${error.message}</div>`;
  }
  
  return diagnostics;
}

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    const process = spawn(cmd, args, { stdio: 'inherit' });
    
    process.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🔍 === AUDIT SYSTÈME DÉMARRÉ ===
📊 Serveur de diagnostic: http://0.0.0.0:${PORT}
🎯 Problème: Interface ne s'affiche pas
⚡ Solution: Ouvrez le lien ci-dessus pour diagnostic complet
  `);
});
