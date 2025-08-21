
import fs from 'fs/promises';
import path from 'path';
import { logger } from './utils/logger.js';

export class SystemHealthMonitor {
  private isMonitoring = false;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private issues: string[] = [];
  private autoRepairEnabled = true;

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      logger.warn('Le monitoring est déjà actif');
      return;
    }

    this.isMonitoring = true;
    logger.info('🔍 Démarrage du monitoring de santé système');

    // Check initial complet
    await this.performFullHealthCheck();

    // Monitoring continu toutes les 2 minutes
    this.healthCheckInterval = setInterval(async () => {
      await this.performQuickHealthCheck();
    }, 120000);

    // Auto-réparation si problèmes critiques
    if (this.issues.length > 0 && this.autoRepairEnabled) {
      await this.performAutoRepair();
    }
  }

  async stopMonitoring(): Promise<void> {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    logger.info('⏹️ Arrêt du monitoring système');
  }

  async performFullHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    fixes: string[];
  }> {
    logger.info('🔬 Diagnostic complet du système...');
    
    this.issues = [];
    const fixes: string[] = [];

    // 1. Vérifier l'architecture des dossiers
    await this.checkDirectoryStructure(fixes);
    
    // 2. Vérifier les fichiers critiques
    await this.checkCriticalFiles(fixes);
    
    // 3. Vérifier les services
    await this.checkServices(fixes);
    
    // 4. Vérifier la configuration
    await this.checkConfiguration(fixes);
    
    // 5. Vérifier les dépendances
    await this.checkDependencies(fixes);
    
    // 6. Vérifier la performance système
    await this.checkSystemPerformance();
    
    // 7. Vérifier la sécurité
    await this.checkSecurity();

    const status = this.issues.length === 0 ? 'healthy' : 
                  this.issues.length <= 3 ? 'warning' : 'critical';

    logger.info(`✅ Diagnostic terminé: ${status} (${this.issues.length} problèmes, ${fixes.length} corrections)`);

    return { status, issues: this.issues, fixes };
  }

  private async checkDirectoryStructure(fixes: string[]): Promise<void> {
    const requiredDirs = [
      'server',
      'server/services',
      'server/config',
      'server/utils',
      'client/src',
      'uploads',
      'outputs',
      'outputs/temp'
    ];

    for (const dir of requiredDirs) {
      try {
        await fs.access(dir);
      } catch {
        this.issues.push(`Dossier manquant: ${dir}`);
        try {
          await fs.mkdir(dir, { recursive: true });
          fixes.push(`Création du dossier: ${dir}`);
          logger.info(`📁 Dossier créé: ${dir}`);
        } catch (error) {
          logger.error(`Impossible de créer ${dir}:`, error);
        }
      }
    }
  }

  private async checkCriticalFiles(fixes: string[]): Promise<void> {
    const criticalFiles = [
      {
        path: 'server/index.ts',
        minSize: 500,
        mustContain: ['express', 'app.listen'],
        template: this.generateServerIndex
      },
      {
        path: 'server/routes.ts',
        minSize: 300,
        mustContain: ['Router', '/api'],
        template: this.generateServerRoutes
      },
      {
        path: 'tsconfig.json',
        minSize: 100,
        mustContain: ['compilerOptions'],
        template: this.generateTsConfig
      },
      {
        path: 'package.json',
        minSize: 200,
        mustContain: ['dependencies', 'scripts'],
        template: null // Ne pas régénérer automatiquement
      }
    ];

    for (const file of criticalFiles) {
      try {
        const content = await fs.readFile(file.path, 'utf-8');
        
        if (content.length < file.minSize) {
          this.issues.push(`Fichier trop petit: ${file.path} (${content.length} < ${file.minSize})`);
          if (file.template && this.autoRepairEnabled) {
            await this.repairFile(file, fixes);
          }
        }

        const missingContent = file.mustContain.filter(required => !content.includes(required));
        if (missingContent.length > 0) {
          this.issues.push(`Contenu manquant dans ${file.path}: ${missingContent.join(', ')}`);
          if (file.template && this.autoRepairEnabled) {
            await this.repairFile(file, fixes);
          }
        }
      } catch {
        this.issues.push(`Fichier critique manquant: ${file.path}`);
        if (file.template && this.autoRepairEnabled) {
          await this.repairFile(file, fixes);
        }
      }
    }
  }

  private async repairFile(file: any, fixes: string[]): Promise<void> {
    try {
      const newContent = file.template();
      await fs.writeFile(file.path, newContent, 'utf-8');
      fixes.push(`Réparation du fichier: ${file.path}`);
      logger.info(`🔧 Fichier réparé: ${file.path}`);
    } catch (error) {
      logger.error(`Impossible de réparer ${file.path}:`, error);
    }
  }

  private async checkServices(fixes: string[]): Promise<void> {
    const services = [
      'universal-preprocessor.ts',
      'js-preprocessor.ts',
      'documentation-packager.ts',
      'advanced-enhancer.ts'
    ];

    for (const service of services) {
      const servicePath = `server/services/${service}`;
      try {
        const content = await fs.readFile(servicePath, 'utf-8');
        
        if (!content.includes('export')) {
          this.issues.push(`Service sans exports: ${service}`);
        }
        
        if (content.length < 200) {
          this.issues.push(`Service trop petit: ${service}`);
        }
        
      } catch {
        this.issues.push(`Service manquant: ${service}`);
        if (this.autoRepairEnabled) {
          await this.createBasicService(service, fixes);
        }
      }
    }
  }

  private async createBasicService(serviceName: string, fixes: string[]): Promise<void> {
    const className = serviceName.split('.')[0]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    const serviceContent = `
import { logger } from '../utils/logger.js';

export class ${className} {
  async process(input: any): Promise<any> {
    logger.info(\`Processing with \${this.constructor.name}\`);
    
    try {
      // Logique de traitement basique
      return {
        success: true,
        data: input,
        processedBy: this.constructor.name,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error(\`Erreur dans \${this.constructor.name}:\`, error);
      throw error;
    }
  }

  async validate(input: any): Promise<boolean> {
    return input !== null && input !== undefined;
  }
}

export default ${className};
`;

    try {
      await fs.writeFile(`server/services/${serviceName}`, serviceContent, 'utf-8');
      fixes.push(`Service créé: ${serviceName}`);
      logger.info(`🔧 Service créé: ${serviceName}`);
    } catch (error) {
      logger.error(`Impossible de créer ${serviceName}:`, error);
    }
  }

  private async checkConfiguration(fixes: string[]): Promise<void> {
    const configFiles = [
      'server/config/transformation-levels.json',
      'server/config/modules-definitions.json'
    ];

    for (const configFile of configFiles) {
      try {
        const content = await fs.readFile(configFile, 'utf-8');
        JSON.parse(content); // Valider JSON
      } catch {
        this.issues.push(`Configuration invalide: ${configFile}`);
        if (this.autoRepairEnabled) {
          await this.createBasicConfig(configFile, fixes);
        }
      }
    }
  }

  private async createBasicConfig(configPath: string, fixes: string[]): Promise<void> {
    let defaultConfig = {};
    
    if (configPath.includes('transformation-levels')) {
      defaultConfig = {
        level1: { description: "Nettoyage basique", enabled: true },
        level2: { description: "Optimisation intermédiaire", enabled: true },
        level3: { description: "Transformation avancée", enabled: true }
      };
    } else if (configPath.includes('modules-definitions')) {
      defaultConfig = {
        effects: { enabled: true, priority: 1 },
        animations: { enabled: true, priority: 2 },
        utilities: { enabled: true, priority: 3 }
      };
    }

    try {
      await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
      fixes.push(`Configuration créée: ${configPath}`);
      logger.info(`🔧 Configuration créée: ${configPath}`);
    } catch (error) {
      logger.error(`Impossible de créer ${configPath}:`, error);
    }
  }

  private async checkDependencies(fixes: string[]): Promise<void> {
    try {
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf-8'));
      const requiredDeps = ['express', 'multer', 'zod', 'cors'];
      
      const missingDeps = requiredDeps.filter(dep => 
        !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
      );
      
      if (missingDeps.length > 0) {
        this.issues.push(`Dépendances manquantes: ${missingDeps.join(', ')}`);
      }
    } catch {
      this.issues.push('package.json inaccessible ou invalide');
    }
  }

  private async checkSystemPerformance(): Promise<void> {
    const memory = process.memoryUsage();
    const heapUsedMB = Math.round(memory.heapUsed / 1024 / 1024);
    
    if (heapUsedMB > 800) {
      this.issues.push(`Utilisation mémoire élevée: ${heapUsedMB}MB`);
    }
    
    // Vérifier les fichiers temporaires
    try {
      const uploadsFiles = await fs.readdir('uploads/').catch(() => []);
      if (uploadsFiles.length > 50) {
        this.issues.push(`Trop de fichiers temporaires: ${uploadsFiles.length}`);
        if (this.autoRepairEnabled) {
          await this.cleanupTempFiles();
        }
      }
    } catch {
      // Ignorer si le dossier n'existe pas
    }
  }

  private async checkSecurity(): Promise<void> {
    try {
      const routesContent = await fs.readFile('server/routes.ts', 'utf-8');
      
      if (!routesContent.includes('fileFilter')) {
        this.issues.push('Filtrage de fichiers manquant dans les uploads');
      }
      
      if (!routesContent.includes('cors')) {
        this.issues.push('Configuration CORS manquante');
      }
    } catch {
      this.issues.push('Impossible de vérifier la sécurité des routes');
    }
  }

  private async cleanupTempFiles(): Promise<void> {
    try {
      const files = await fs.readdir('uploads/');
      const now = Date.now();
      let cleaned = 0;
      
      for (const file of files) {
        const filePath = path.join('uploads', file);
        const stat = await fs.stat(filePath);
        
        // Supprimer les fichiers de plus de 24h
        if (now - stat.mtime.getTime() > 24 * 60 * 60 * 1000) {
          await fs.unlink(filePath);
          cleaned++;
        }
      }
      
      if (cleaned > 0) {
        logger.info(`🧹 ${cleaned} fichiers temporaires supprimés`);
      }
    } catch (error) {
      logger.error('Erreur lors du nettoyage:', error);
    }
  }

  private async performQuickHealthCheck(): Promise<void> {
    const quickIssues: string[] = [];
    
    // Vérification rapide des fichiers critiques
    const criticalFiles = ['server/index.ts', 'server/routes.ts', 'package.json'];
    for (const file of criticalFiles) {
      try {
        await fs.access(file);
      } catch {
        quickIssues.push(`Fichier critique manquant: ${file}`);
      }
    }
    
    // Vérification mémoire
    const memory = process.memoryUsage();
    const heapUsedMB = Math.round(memory.heapUsed / 1024 / 1024);
    if (heapUsedMB > 1000) {
      quickIssues.push(`Mémoire critique: ${heapUsedMB}MB`);
    }
    
    if (quickIssues.length > 0) {
      logger.warn('⚠️ Problèmes détectés:', quickIssues);
      if (this.autoRepairEnabled) {
        await this.performAutoRepair();
      }
    }
  }

  private async performAutoRepair(): Promise<void> {
    logger.info('🔧 Tentative de réparation automatique...');
    
    try {
      // Créer les dossiers manquants
      await this.checkDirectoryStructure([]);
      
      // Nettoyer les fichiers temporaires
      await this.cleanupTempFiles();
      
      logger.info('✅ Réparation automatique terminée');
    } catch (error) {
      logger.error('❌ Échec de la réparation automatique:', error);
    }
  }

  private generateServerIndex(): string {
    return `
import express from 'express';
import cors from 'cors';
import { routes } from './routes.js';
import { logger } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Gestion d'erreurs
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Erreur serveur:', error);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: error.message 
  });
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  logger.info(\`🚀 Serveur démarré sur le port \${PORT}\`);
});

export default app;
`;
  }

  private generateServerRoutes(): string {
    return `
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { logger } from './utils/logger.js';

const router = Router();

// Configuration multer pour uploads sécurisés
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.js', '.ts', '.html', '.css', '.json', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowedTypes.includes(ext));
  }
});

// Route de santé
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    services: ['universal-preprocessor', 'js-preprocessor'],
    timestamp: new Date().toISOString()
  });
});

// Route principale de traitement
router.post('/transform', upload.single('file'), async (req, res) => {
  try {
    logger.info('Nouvelle demande de transformation');
    
    if (!req.file) {
      return res.status(400).json({ error: 'Fichier requis' });
    }

    // Traitement basique
    const result = {
      success: true,
      originalName: req.file.originalname,
      processedAt: new Date().toISOString(),
      message: 'Fichier traité avec succès'
    };

    res.json(result);
  } catch (error) {
    logger.error('Erreur de transformation:', error);
    res.status(500).json({ error: 'Erreur lors du traitement' });
  }
});

export { router as routes };
export default router;
`;
  }

  private generateTsConfig(): string {
    return `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "server/**/*",
    "shared/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "client"
  ]
}`;
  }

  getHealthStatus(): {
    isMonitoring: boolean;
    issuesCount: number;
    lastCheck: Date;
  } {
    return {
      isMonitoring: this.isMonitoring,
      issuesCount: this.issues.length,
      lastCheck: new Date()
    };
  }
}

export default SystemHealthMonitor;
