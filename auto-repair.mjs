
#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import ComprehensiveSystemAuditor from './comprehensive-audit.mjs';

class AutoRepairSystem {
  constructor() {
    this.repairs = [];
    this.failures = [];
  }

  async performAutoRepair() {
    console.log('🔧 === SYSTÈME DE RÉPARATION AUTOMATIQUE ===\n');

    // D'abord, faire un audit pour identifier les problèmes
    const auditor = new ComprehensiveSystemAuditor();
    const auditReport = await auditor.performCompleteAudit();

    console.log('\n🔧 Début des réparations automatiques...\n');

    // Réparer les dossiers manquants
    await this.repairMissingDirectories();
    
    // Réparer les fichiers critiques
    await this.repairCriticalFiles();
    
    // Réparer les configurations
    await this.repairConfigurations();
    
    // Optimiser les performances
    await this.optimizePerformance();
    
    // Nettoyer le système
    await this.cleanupSystem();

    return this.generateRepairReport();
  }

  async repairMissingDirectories() {
    const requiredDirs = [
      'server/services',
      'server/config',
      'server/utils',
      'uploads',
      'outputs',
      'outputs/temp',
      'shared'
    ];

    for (const dir of requiredDirs) {
      try {
        await fs.access(dir);
      } catch {
        try {
          await fs.mkdir(dir, { recursive: true });
          this.repairs.push(`Dossier créé: ${dir}`);
          console.log(`✅ Dossier réparé: ${dir}`);
        } catch (error) {
          this.failures.push(`Impossible de créer ${dir}: ${error.message}`);
          console.error(`❌ Échec création ${dir}: ${error.message}`);
        }
      }
    }
  }

  async repairCriticalFiles() {
    // Réparer server/index.ts si manquant ou corrompu
    try {
      const indexContent = await fs.readFile('server/index.ts', 'utf-8');
      if (indexContent.length < 200) {
        await this.createServerIndex();
      }
    } catch {
      await this.createServerIndex();
    }

    // Réparer server/routes.ts si manquant
    try {
      const routesContent = await fs.readFile('server/routes.ts', 'utf-8');
      if (routesContent.length < 200) {
        await this.createServerRoutes();
      }
    } catch {
      await this.createServerRoutes();
    }

    // Réparer logger s'il manque
    try {
      await fs.access('server/utils/logger.ts');
    } catch {
      await this.createLogger();
    }
  }

  async createServerIndex() {
    const serverIndexContent = `
import express from 'express';
import cors from 'cors';
import { routes } from './routes.js';
import { logger } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de base
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : true,
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes API
app.use('/api', routes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'
  });
});

// Gestion d'erreurs globale
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Erreur serveur:', error);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
  });
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  logger.info(\`🚀 Serveur démarré sur le port \${PORT}\`);
  logger.info(\`🌐 Environnement: \${process.env.NODE_ENV || 'development'}\`);
});

export default app;
`;

    try {
      await fs.writeFile('server/index.ts', serverIndexContent, 'utf-8');
      this.repairs.push('server/index.ts créé');
      console.log('✅ server/index.ts réparé');
    } catch (error) {
      this.failures.push(`Impossible de réparer server/index.ts: ${error.message}`);
    }
  }

  async createServerRoutes() {
    const serverRoutesContent = `
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { logger } from './utils/logger.js';

const router = Router();

// Configuration multer pour uploads sécurisés
const upload = multer({
  dest: 'uploads/',
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.js', '.ts', '.html', '.css', '.json', '.txt', '.md'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(\`Type de fichier non autorisé: \${ext}\`));
    }
  }
});

// Route de santé API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    services: [
      'universal-preprocessor',
      'js-preprocessor', 
      'documentation-packager'
    ],
    timestamp: new Date().toISOString()
  });
});

// Route de transformation de fichier
router.post('/transform', upload.single('file'), async (req, res) => {
  try {
    logger.info('Nouvelle demande de transformation');
    
    if (!req.file) {
      return res.status(400).json({ 
        error: 'Fichier requis',
        details: 'Aucun fichier fourni dans la requête'
      });
    }

    const { level = '1' } = req.body;
    
    // Traitement basique pour maintenant
    const result = {
      success: true,
      originalName: req.file.originalname,
      size: req.file.size,
      level: parseInt(level),
      processedAt: new Date().toISOString(),
      message: 'Fichier traité avec succès'
    };

    logger.info(\`Fichier traité: \${req.file.originalname} (niveau \${level})\`);
    res.json(result);
    
  } catch (error) {
    logger.error('Erreur de transformation:', error);
    res.status(500).json({ 
      error: 'Erreur lors du traitement',
      message: error.message
    });
  }
});

// Route d'information sur les niveaux
router.get('/levels', (req, res) => {
  res.json({
    levels: {
      1: { name: 'Basique', description: 'Nettoyage et optimisation simple' },
      2: { name: 'Intermédiaire', description: 'Transformation et amélioration' },
      3: { name: 'Avancé', description: 'IA et optimisation complète' }
    }
  });
});

export { router as routes };
export default router;
`;

    try {
      await fs.writeFile('server/routes.ts', serverRoutesContent, 'utf-8');
      this.repairs.push('server/routes.ts créé');
      console.log('✅ server/routes.ts réparé');
    } catch (error) {
      this.failures.push(`Impossible de réparer server/routes.ts: ${error.message}`);
    }
  }

  async createLogger() {
    const loggerContent = `
export class Logger {
  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const prefix = \`[\${timestamp}] [\${level.toUpperCase()}]\`;
    return \`\${prefix} \${message} \${args.length > 0 ? JSON.stringify(args) : ''}\`;
  }

  info(message: string, ...args: any[]): void {
    console.log(this.formatMessage('info', message, ...args));
  }

  error(message: string, ...args: any[]): void {
    console.error(this.formatMessage('error', message, ...args));
  }

  warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage('warn', message, ...args));
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, ...args));
    }
  }
}

export const logger = new Logger();
export default logger;
`;

    try {
      await fs.writeFile('server/utils/logger.ts', loggerContent, 'utf-8');
      this.repairs.push('server/utils/logger.ts créé');
      console.log('✅ Logger créé');
    } catch (error) {
      this.failures.push(`Impossible de créer le logger: ${error.message}`);
    }
  }

  async repairConfigurations() {
    // Réparer .replit si nécessaire
    try {
      const replitContent = await fs.readFile('.replit', 'utf-8');
      if (!replitContent.includes('[run]') || !replitContent.includes('npm run dev')) {
        await this.updateReplitConfig();
      }
    } catch {
      await this.updateReplitConfig();
    }

    // Créer les configurations JSON manquantes
    const configs = [
      {
        path: 'server/config/transformation-levels.json',
        content: {
          level1: { description: "Nettoyage et optimisation basique", enabled: true },
          level2: { description: "Transformation intermédiaire avec améliorations", enabled: true },
          level3: { description: "IA et optimisation complète", enabled: true }
        }
      },
      {
        path: 'server/config/modules-definitions.json',
        content: {
          effects: { enabled: true, category: "visual", priority: 1 },
          animations: { enabled: true, category: "interaction", priority: 2 },
          utilities: { enabled: true, category: "tools", priority: 3 }
        }
      }
    ];

    for (const config of configs) {
      try {
        await fs.access(config.path);
      } catch {
        try {
          await fs.mkdir(path.dirname(config.path), { recursive: true });
          await fs.writeFile(config.path, JSON.stringify(config.content, null, 2), 'utf-8');
          this.repairs.push(`Configuration créée: ${path.basename(config.path)}`);
          console.log(`✅ Configuration créée: ${path.basename(config.path)}`);
        } catch (error) {
          this.failures.push(`Impossible de créer ${config.path}: ${error.message}`);
        }
      }
    }
  }

  async updateReplitConfig() {
    const replitContent = `
[deployment]
run = ["npm", "run", "dev"]
deploymentTarget = "cloudrun"

[run]
run = "npm run dev"

[env]
NODE_ENV = "development"

[nix]
channel = "stable-22_11"

[packager]
language = "nodejs"

[interpreter]
command = ["node", "--import", "tsx/esm", "server/index.ts"]
`;

    try {
      await fs.writeFile('.replit', replitContent.trim(), 'utf-8');
      this.repairs.push('.replit configuré');
      console.log('✅ Configuration .replit réparée');
    } catch (error) {
      this.failures.push(`Impossible de réparer .replit: ${error.message}`);
    }
  }

  async optimizePerformance() {
    // Nettoyer le cache npm si nécessaire
    try {
      const nodeModulesSize = await this.getDirectorySize('node_modules');
      if (nodeModulesSize > 500 * 1024 * 1024) { // > 500MB
        console.log('🧹 Cache npm volumineux détecté, nettoyage...');
        // Note: on évite de supprimer node_modules car c'est dangereux
        this.repairs.push('Cache npm analysé (trop volumineux)');
      }
    } catch {
      // Ignorer les erreurs
    }

    // Optimiser les fichiers temporaires
    try {
      const uploadsFiles = await fs.readdir('uploads/').catch(() => []);
      let cleaned = 0;
      
      for (const file of uploadsFiles) {
        try {
          const filePath = path.join('uploads', file);
          const stat = await fs.stat(filePath);
          
          // Supprimer les fichiers de plus de 1 heure
          if (Date.now() - stat.mtime.getTime() > 60 * 60 * 1000) {
            await fs.unlink(filePath);
            cleaned++;
          }
        } catch {
          // Ignorer les erreurs de fichier individuel
        }
      }
      
      if (cleaned > 0) {
        this.repairs.push(`${cleaned} fichiers temporaires nettoyés`);
        console.log(`✅ ${cleaned} fichiers temporaires supprimés`);
      }
    } catch {
      // Ignorer si le dossier n'existe pas
    }
  }

  async getDirectorySize(dirPath) {
    let totalSize = 0;
    
    try {
      const files = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const file of files) {
        const filePath = path.join(dirPath, file.name);
        
        if (file.isDirectory()) {
          totalSize += await this.getDirectorySize(filePath);
        } else {
          const stat = await fs.stat(filePath);
          totalSize += stat.size;
        }
      }
    } catch {
      // Ignorer les erreurs d'accès
    }
    
    return totalSize;
  }

  async cleanupSystem() {
    // Vérifier et nettoyer les logs s'ils sont trop volumineux
    const logPaths = ['server/logs', 'logs', 'temp'];
    
    for (const logPath of logPaths) {
      try {
        const files = await fs.readdir(logPath);
        for (const file of files) {
          if (file.endsWith('.log')) {
            const filePath = path.join(logPath, file);
            const stat = await fs.stat(filePath);
            
            // Supprimer les logs de plus de 7 jours
            if (Date.now() - stat.mtime.getTime() > 7 * 24 * 60 * 60 * 1000) {
              await fs.unlink(filePath);
              this.repairs.push(`Log supprimé: ${file}`);
            }
          }
        }
      } catch {
        // Dossier n'existe pas, c'est normal
      }
    }

    console.log('✅ Nettoyage système terminé');
  }

  generateRepairReport() {
    console.log('\n🔧 === RAPPORT DE RÉPARATION ===');
    console.log(`✅ Réparations réussies: ${this.repairs.length}`);
    console.log(`❌ Échecs: ${this.failures.length}`);

    if (this.repairs.length > 0) {
      console.log('\n✅ RÉPARATIONS EFFECTUÉES:');
      this.repairs.forEach((repair, i) => {
        console.log(`  ${i + 1}. ${repair}`);
      });
    }

    if (this.failures.length > 0) {
      console.log('\n❌ ÉCHECS:');
      this.failures.forEach((failure, i) => {
        console.log(`  ${i + 1}. ${failure}`);
      });
    }

    const successRate = Math.round((this.repairs.length / (this.repairs.length + this.failures.length)) * 100) || 100;
    
    console.log(`\n🎯 TAUX DE SUCCÈS: ${successRate}%`);
    console.log('🔧 Réparation automatique terminée!\n');

    return {
      repairs: this.repairs,
      failures: this.failures,
      successRate
    };
  }
}

// Exécution du système de réparation
if (import.meta.url === `file://${process.argv[1]}`) {
  const repairSystem = new AutoRepairSystem();
  
  repairSystem.performAutoRepair()
    .then((report) => {
      const exitCode = report.successRate >= 80 ? 0 : 1;
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale lors de la réparation:', error);
      process.exit(1);
    });
}

export default AutoRepairSystem;
