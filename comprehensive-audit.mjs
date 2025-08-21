
#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ComprehensiveSystemAuditor {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.successes = [];
    this.metrics = {
      filesChecked: 0,
      servicesValidated: 0,
      configsVerified: 0,
      dependenciesChecked: 0
    };
  }

  async performCompleteAudit() {
    console.log('🔍 === AUDIT SYSTÈME COMPLET ===\n');
    
    const auditSteps = [
      { name: '📦 Configuration Node.js/NPM', fn: this.auditNodeConfiguration },
      { name: '🏗️ Architecture des fichiers', fn: this.auditFileArchitecture },
      { name: '⚙️ Services TypeScript', fn: this.auditTypeScriptServices },
      { name: '🔧 Configuration système', fn: this.auditSystemConfiguration },
      { name: '📋 Dépendances', fn: this.auditDependencies },
      { name: '🚀 Capacités de démarrage', fn: this.auditStartupCapabilities },
      { name: '🔒 Sécurité', fn: this.auditSecurity },
      { name: '⚡ Performance', fn: this.auditPerformance },
      { name: '🌐 API et Routes', fn: this.auditAPIRoutes },
      { name: '🧹 Nettoyage système', fn: this.performSystemCleanup }
    ];

    for (const step of auditSteps) {
      console.log(`\n${step.name}...`);
      try {
        await step.fn.call(this);
      } catch (error) {
        this.issues.push(`Erreur lors de ${step.name}: ${error.message}`);
        console.error(`❌ ${error.message}`);
      }
    }

    return this.generateComprehensiveReport();
  }

  async auditNodeConfiguration() {
    try {
      // Vérifier package.json
      const packageContent = await fs.readFile('package.json', 'utf-8');
      const packageJson = JSON.parse(packageContent);
      
      console.log(`✅ Type de module: ${packageJson.type || 'commonjs'}`);
      this.successes.push('package.json valide');
      
      if (packageJson.type === 'module') {
        this.successes.push('Configuration ES modules correcte');
      } else {
        this.warnings.push('Projet non configuré pour ES modules');
      }

      // Vérifier les scripts
      if (packageJson.scripts?.dev) {
        console.log('✅ Script de développement disponible');
        this.successes.push('Scripts de développement configurés');
      } else {
        this.issues.push('Script de développement manquant');
      }

      this.metrics.configsVerified++;
    } catch (error) {
      this.issues.push('package.json inaccessible ou invalide');
    }
  }

  async auditFileArchitecture() {
    const requiredDirs = [
      'server', 'server/services', 'server/config', 'server/utils',
      'client/src', 'uploads', 'outputs', 'shared'
    ];

    const criticalFiles = [
      'server/index.ts', 'server/routes.ts', 'server/storage.ts',
      'tsconfig.json', 'vite.config.ts', 'shared/schema.ts'
    ];

    // Vérifier les dossiers
    for (const dir of requiredDirs) {
      try {
        await fs.access(dir);
        console.log(`✅ Dossier: ${dir}`);
        this.successes.push(`Dossier ${dir} présent`);
      } catch {
        console.log(`❌ Dossier manquant: ${dir}`);
        this.issues.push(`Dossier manquant: ${dir}`);
        
        // Auto-création
        try {
          await fs.mkdir(dir, { recursive: true });
          console.log(`🔧 Dossier créé: ${dir}`);
          this.successes.push(`Dossier ${dir} créé automatiquement`);
        } catch (createError) {
          this.issues.push(`Impossible de créer ${dir}: ${createError.message}`);
        }
      }
    }

    // Vérifier les fichiers critiques
    for (const file of criticalFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        if (content.length < 50) {
          this.warnings.push(`Fichier ${file} semble incomplet (${content.length} caractères)`);
        } else {
          console.log(`✅ Fichier: ${file} (${content.length} caractères)`);
          this.successes.push(`Fichier ${file} valide`);
        }
        this.metrics.filesChecked++;
      } catch {
        console.log(`❌ Fichier critique manquant: ${file}`);
        this.issues.push(`Fichier critique manquant: ${file}`);
      }
    }
  }

  async auditTypeScriptServices() {
    const servicesDir = 'server/services';
    
    try {
      const services = await fs.readdir(servicesDir);
      const tsServices = services.filter(f => f.endsWith('.ts'));
      
      console.log(`📋 ${tsServices.length} services TypeScript trouvés`);
      
      const expectedServices = [
        'universal-preprocessor.ts',
        'js-preprocessor.ts',
        'documentation-packager.ts',
        'advanced-enhancer.ts'
      ];

      for (const expectedService of expectedServices) {
        if (tsServices.includes(expectedService)) {
          try {
            const content = await fs.readFile(`${servicesDir}/${expectedService}`, 'utf-8');
            
            // Vérifications de base
            if (content.includes('export') || content.includes('class')) {
              console.log(`✅ Service: ${expectedService}`);
              this.successes.push(`Service ${expectedService} bien structuré`);
            } else {
              this.warnings.push(`Service ${expectedService} mal structuré`);
            }
            
            // Vérifier la longueur
            if (content.length < 200) {
              this.warnings.push(`Service ${expectedService} semble incomplet`);
            }
            
            this.metrics.servicesValidated++;
          } catch (error) {
            this.issues.push(`Erreur lecture service ${expectedService}: ${error.message}`);
          }
        } else {
          console.log(`❌ Service manquant: ${expectedService}`);
          this.issues.push(`Service manquant: ${expectedService}`);
          
          // Auto-création du service basique
          await this.createBasicService(expectedService);
        }
      }
    } catch (error) {
      this.issues.push(`Dossier services inaccessible: ${error.message}`);
    }
  }

  async createBasicService(serviceName) {
    const className = serviceName.replace('.ts', '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    const basicServiceContent = `
import { logger } from '../utils/logger.js';

export class ${className} {
  async process(input: any): Promise<any> {
    logger.info(\`Traitement avec \${this.constructor.name}\`);
    
    try {
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
      await fs.writeFile(`server/services/${serviceName}`, basicServiceContent, 'utf-8');
      console.log(`🔧 Service créé automatiquement: ${serviceName}`);
      this.successes.push(`Service ${serviceName} créé automatiquement`);
    } catch (error) {
      this.issues.push(`Impossible de créer le service ${serviceName}: ${error.message}`);
    }
  }

  async auditSystemConfiguration() {
    const configFiles = [
      'server/config/transformation-levels.json',
      'server/config/modules-definitions.json',
      'server/config/advanced-enhancement-modules.json'
    ];

    for (const configFile of configFiles) {
      try {
        const content = await fs.readFile(configFile, 'utf-8');
        JSON.parse(content); // Validation JSON
        console.log(`✅ Configuration: ${path.basename(configFile)}`);
        this.successes.push(`Configuration ${path.basename(configFile)} valide`);
        this.metrics.configsVerified++;
      } catch {
        console.log(`❌ Configuration invalide: ${path.basename(configFile)}`);
        this.issues.push(`Configuration invalide: ${configFile}`);
        
        // Auto-création de configuration basique
        await this.createBasicConfig(configFile);
      }
    }
  }

  async createBasicConfig(configPath) {
    let defaultConfig = {};
    
    if (configPath.includes('transformation-levels')) {
      defaultConfig = {
        level1: { description: "Nettoyage et optimisation basique", enabled: true, priority: 1 },
        level2: { description: "Transformation intermédiaire", enabled: true, priority: 2 },
        level3: { description: "Amélioration avancée", enabled: true, priority: 3 }
      };
    } else if (configPath.includes('modules-definitions')) {
      defaultConfig = {
        effects: { enabled: true, category: "visual", priority: 1 },
        animations: { enabled: true, category: "interaction", priority: 2 },
        utilities: { enabled: true, category: "tools", priority: 3 }
      };
    } else if (configPath.includes('advanced-enhancement')) {
      defaultConfig = {
        aiTransformation: { enabled: true, model: "advanced" },
        intelligentCategorization: { enabled: true, threshold: 0.8 },
        documentationGeneration: { enabled: true, format: "markdown" }
      };
    }

    try {
      await fs.mkdir(path.dirname(configPath), { recursive: true });
      await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
      console.log(`🔧 Configuration créée: ${path.basename(configPath)}`);
      this.successes.push(`Configuration ${path.basename(configPath)} créée`);
    } catch (error) {
      this.issues.push(`Impossible de créer ${configPath}: ${error.message}`);
    }
  }

  async auditDependencies() {
    try {
      const packageContent = await fs.readFile('package.json', 'utf-8');
      const packageJson = JSON.parse(packageContent);
      
      const requiredDeps = [
        'express', 'cors', 'multer', 'zod', 
        'typescript', 'tsx', '@types/node'
      ];

      const allDeps = {
        ...packageJson.dependencies || {},
        ...packageJson.devDependencies || {}
      };

      const missingDeps = requiredDeps.filter(dep => !allDeps[dep]);
      
      if (missingDeps.length === 0) {
        console.log('✅ Toutes les dépendances requises sont présentes');
        this.successes.push('Dépendances complètes');
      } else {
        console.log(`❌ Dépendances manquantes: ${missingDeps.join(', ')}`);
        this.warnings.push(`Dépendances manquantes: ${missingDeps.join(', ')}`);
      }

      console.log(`📋 ${Object.keys(allDeps).length} dépendances totales`);
      this.metrics.dependenciesChecked = Object.keys(allDeps).length;
      
    } catch (error) {
      this.issues.push(`Impossible de vérifier les dépendances: ${error.message}`);
    }
  }

  async auditStartupCapabilities() {
    // Tester la compilation TypeScript
    console.log('🔄 Test de compilation TypeScript...');
    try {
      const result = await this.runCommand('npx', ['tsc', '--noEmit', '--skipLibCheck']);
      if (result.success) {
        console.log('✅ TypeScript compile sans erreur');
        this.successes.push('Compilation TypeScript réussie');
      } else {
        console.log('⚠️ Erreurs de compilation détectées');
        this.warnings.push('Erreurs de compilation TypeScript');
      }
    } catch (error) {
      this.warnings.push('Impossible de tester la compilation TypeScript');
    }

    // Vérifier les workflows
    try {
      const replitContent = await fs.readFile('.replit', 'utf-8');
      if (replitContent.includes('[run]')) {
        console.log('✅ Configuration de démarrage présente');
        this.successes.push('Configuration .replit valide');
      } else {
        this.warnings.push('Configuration de démarrage incomplète');
      }
    } catch {
      this.warnings.push('Fichier .replit inaccessible');
    }
  }

  async auditSecurity() {
    try {
      const routesContent = await fs.readFile('server/routes.ts', 'utf-8');
      
      // Vérifications de sécurité basiques
      const securityChecks = [
        { check: routesContent.includes('fileFilter'), name: 'Filtrage de fichiers upload' },
        { check: routesContent.includes('cors'), name: 'Configuration CORS' },
        { check: routesContent.includes('limits'), name: 'Limitation de taille' }
      ];

      for (const { check, name } of securityChecks) {
        if (check) {
          console.log(`✅ Sécurité: ${name}`);
          this.successes.push(`Sécurité ${name} configurée`);
        } else {
          console.log(`⚠️ Sécurité: ${name} manquante`);
          this.warnings.push(`Sécurité ${name} manquante`);
        }
      }
    } catch (error) {
      this.issues.push(`Impossible de vérifier la sécurité: ${error.message}`);
    }
  }

  async auditPerformance() {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    
    console.log(`📊 Utilisation mémoire: ${heapUsedMB}MB`);
    console.log(`📊 Temps de fonctionnement: ${Math.round(process.uptime())}s`);
    
    if (heapUsedMB < 200) {
      this.successes.push(`Utilisation mémoire optimale: ${heapUsedMB}MB`);
    } else if (heapUsedMB < 500) {
      this.warnings.push(`Utilisation mémoire modérée: ${heapUsedMB}MB`);
    } else {
      this.issues.push(`Utilisation mémoire élevée: ${heapUsedMB}MB`);
    }

    // Vérifier les fichiers temporaires
    try {
      const uploadsFiles = await fs.readdir('uploads/').catch(() => []);
      if (uploadsFiles.length > 50) {
        this.warnings.push(`Beaucoup de fichiers temporaires: ${uploadsFiles.length}`);
      } else {
        console.log(`✅ Fichiers temporaires: ${uploadsFiles.length}`);
      }
    } catch {
      // Dossier n'existe pas, c'est normal
    }
  }

  async auditAPIRoutes() {
    try {
      const routesContent = await fs.readFile('server/routes.ts', 'utf-8');
      
      // Vérifier les routes essentielles
      const essentialRoutes = ['/health', '/api', 'router'];
      let routesFound = 0;
      
      for (const route of essentialRoutes) {
        if (routesContent.includes(route)) {
          routesFound++;
        }
      }
      
      if (routesFound >= 2) {
        console.log(`✅ Routes API: ${routesFound}/${essentialRoutes.length} routes essentielles trouvées`);
        this.successes.push('Routes API configurées');
      } else {
        this.warnings.push(`Routes API incomplètes: ${routesFound}/${essentialRoutes.length}`);
      }
    } catch (error) {
      this.issues.push(`Impossible de vérifier les routes API: ${error.message}`);
    }
  }

  async performSystemCleanup() {
    let cleanupActions = 0;
    
    // Nettoyer les fichiers temporaires anciens
    try {
      const uploadsFiles = await fs.readdir('uploads/').catch(() => []);
      const now = Date.now();
      
      for (const file of uploadsFiles) {
        const filePath = path.join('uploads', file);
        const stat = await fs.stat(filePath);
        
        // Supprimer les fichiers de plus de 24h
        if (now - stat.mtime.getTime() > 24 * 60 * 60 * 1000) {
          await fs.unlink(filePath);
          cleanupActions++;
        }
      }
    } catch {
      // Ignorer les erreurs de nettoyage
    }

    if (cleanupActions > 0) {
      console.log(`🧹 ${cleanupActions} fichiers temporaires supprimés`);
      this.successes.push(`${cleanupActions} fichiers nettoyés`);
    } else {
      console.log('✅ Aucun nettoyage nécessaire');
    }
  }

  async runCommand(command, args = []) {
    return new Promise((resolve) => {
      const process = spawn(command, args, { stdio: 'pipe' });
      
      let stdout = '';
      let stderr = '';
      
      process.stdout?.on('data', (data) => stdout += data.toString());
      process.stderr?.on('data', (data) => stderr += data.toString());
      
      process.on('close', (code) => {
        resolve({
          success: code === 0,
          stdout,
          stderr,
          code
        });
      });
    });
  }

  generateComprehensiveReport() {
    const totalChecks = this.successes.length + this.warnings.length + this.issues.length;
    const healthScore = Math.round((this.successes.length / totalChecks) * 100);
    
    console.log('\n🎯 === RAPPORT D\'AUDIT COMPLET ===');
    console.log(`📊 Score de santé: ${healthScore}%`);
    console.log(`✅ Succès: ${this.successes.length}`);
    console.log(`⚠️ Avertissements: ${this.warnings.length}`);
    console.log(`❌ Problèmes: ${this.issues.length}`);
    
    console.log('\n📈 Métriques:');
    console.log(`  📁 Fichiers vérifiés: ${this.metrics.filesChecked}`);
    console.log(`  ⚙️ Services validés: ${this.metrics.servicesValidated}`);
    console.log(`  🔧 Configurations vérifiées: ${this.metrics.configsVerified}`);
    console.log(`  📦 Dépendances vérifiées: ${this.metrics.dependenciesChecked}`);

    if (this.issues.length > 0) {
      console.log('\n🚨 PROBLÈMES CRITIQUES:');
      this.issues.forEach((issue, i) => {
        console.log(`  ${i + 1}. ${issue}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ AVERTISSEMENTS:');
      this.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning}`);
      });
    }

    const status = this.issues.length === 0 && this.warnings.length <= 2 ? 'EXCELLENT' :
                  this.issues.length <= 2 ? 'BON' :
                  this.issues.length <= 5 ? 'ACCEPTABLE' : 'CRITIQUE';

    console.log(`\n🏆 STATUT FINAL: ${status} (${healthScore}%)`);
    console.log('\n🎉 Audit complet terminé!\n');

    return {
      status: status.toLowerCase(),
      healthScore,
      totalChecks,
      successes: this.successes,
      warnings: this.warnings,
      issues: this.issues,
      metrics: this.metrics
    };
  }
}

// Exécution de l'audit
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new ComprehensiveSystemAuditor();
  
  auditor.performCompleteAudit()
    .then((report) => {
      const exitCode = report.status === 'critique' ? 1 : 0;
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale lors de l\'audit:', error);
      process.exit(1);
    });
}

export default ComprehensiveSystemAuditor;
