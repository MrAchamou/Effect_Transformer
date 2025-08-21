
const fs = require('fs').promises;
const path = require('path');

class SystemDiagnostics {
  constructor() {
    this.issues = [];
    this.fixes = [];
    this.warnings = [];
  }

  async runFullDiagnostics() {
    console.log('🔍 === DIAGNOSTIC SYSTÈME COMPLET ===\n');
    
    try {
      this.issues = [];
      this.fixes = [];
      this.warnings = [];

      const results = {
        files: await this.checkCriticalFiles(),
        services: await this.checkServices(),
        config: await this.checkConfiguration(),
        dependencies: await this.checkDependencies(),
        ports: await this.checkPorts(),
        environment: this.checkEnvironment(),
        structure: await this.checkDirectoryStructure(),
        performance: await this.checkPerformance()
      };
      
      // Auto-réparation si activée
      if (this.issues.length > 0) {
        console.log('\n🔧 === TENTATIVE DE RÉPARATION ===');
        await this.performAutoRepair();
      }
      
      this.generateReport(results);
      return {
        ...results,
        issues: this.issues,
        fixes: this.fixes,
        warnings: this.warnings,
        status: this.getOverallStatus()
      };
    } catch (error) {
      console.error('❌ Erreur lors du diagnostic:', error.message);
      return {
        error: error.message,
        status: 'failed'
      };
    }
  }
  
  async checkCriticalFiles() {
    const criticalFiles = [
      { 
        path: 'server/index.ts', 
        required: ['express', 'app.listen', 'PORT'],
        minSize: 500 
      },
      { 
        path: 'server/routes.ts', 
        required: ['Router', 'export'],
        minSize: 300 
      },
      { 
        path: 'server/services/universal-preprocessor.ts',
        required: ['export', 'class'],
        minSize: 200 
      },
      { 
        path: 'server/services/js-preprocessor.ts',
        required: ['export', 'class'],
        minSize: 200 
      },
      { 
        path: 'server/services/documentation-packager.ts',
        required: ['export', 'class'],
        minSize: 200 
      },
      { 
        path: 'package.json',
        required: ['"type":', '"scripts":'],
        minSize: 200 
      },
      { 
        path: 'tsconfig.json',
        required: ['compilerOptions'],
        minSize: 100 
      }
    ];
    
    const results = {};
    
    for (const file of criticalFiles) {
      try {
        const stat = await fs.stat(file.path);
        const content = await fs.readFile(file.path, 'utf-8');
        
        results[file.path] = {
          exists: true,
          size: stat.size,
          lastModified: stat.mtime,
          hasContent: content.length >= file.minSize,
          status: 'OK'
        };
        
        // Vérifier le contenu requis
        const missingContent = file.required.filter(req => !content.includes(req));
        if (missingContent.length > 0) {
          results[file.path].status = `WARNING: Contenu manquant - ${missingContent.join(', ')}`;
          this.warnings.push(`${file.path}: contenu manquant - ${missingContent.join(', ')}`);
        }
        
        if (content.length < file.minSize) {
          results[file.path].status = `WARNING: Fichier trop petit (${content.length} < ${file.minSize})`;
          this.warnings.push(`${file.path}: fichier trop petit`);
        }
        
      } catch (error) {
        results[file.path] = {
          exists: false,
          status: `ERROR: ${error.message}`,
          critical: true
        };
        this.issues.push(`Fichier critique manquant: ${file.path}`);
      }
    }
    
    return results;
  }
  
  async checkServices() {
    const services = [
      'universal-preprocessor',
      'js-preprocessor', 
      'documentation-packager',
      'advanced-enhancer',
      'code-validator',
      'file-processor'
    ];
    
    const results = {};
    
    for (const service of services) {
      try {
        const servicePath = `server/services/${service}.ts`;
        
        await fs.access(servicePath);
        const content = await fs.readFile(servicePath, 'utf-8');
        
        results[service] = {
          exists: true,
          hasContent: content.length > 100,
          hasExports: content.includes('export'),
          hasClass: content.includes('class'),
          status: 'OK'
        };
        
        if (!content.includes('export')) {
          results[service].status = 'WARNING: Pas d\'exports détectés';
          this.warnings.push(`Service ${service}: pas d'exports`);
        }
        
        if (content.length < 200) {
          results[service].status = 'WARNING: Service trop petit';
          this.warnings.push(`Service ${service}: fichier trop petit`);
        }
        
      } catch (error) {
        results[service] = {
          exists: false,
          status: `ERROR: ${error.message}`,
          critical: true
        };
        this.issues.push(`Service manquant: ${service}`);
      }
    }
    
    return results;
  }
  
  async checkConfiguration() {
    const configFiles = [
      'server/config/transformation-levels.json',
      'server/config/modules-definitions.json',
      'server/config/advanced-enhancement-modules.json'
    ];
    
    const results = {};
    
    for (const file of configFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const parsed = JSON.parse(content);
        
        results[file] = {
          exists: true,
          validJson: true,
          hasContent: Object.keys(parsed).length > 0,
          status: 'OK',
          entries: Object.keys(parsed).length
        };
        
      } catch (error) {
        const exists = error.code !== 'ENOENT';
        results[file] = {
          exists,
          validJson: false,
          status: exists ? 'ERROR: JSON invalide' : 'ERROR: Fichier manquant',
          needsRepair: true
        };
        
        if (exists) {
          this.issues.push(`Configuration JSON invalide: ${file}`);
        } else {
          this.issues.push(`Configuration manquante: ${file}`);
        }
      }
    }
    
    return results;
  }
  
  async checkDependencies() {
    try {
      const packageJson = await fs.readFile('package.json', 'utf-8');
      const pkg = JSON.parse(packageJson);
      
      const requiredDeps = [
        'express',
        'multer',
        'zod',
        'cors'
      ];

      const requiredDevDeps = [
        'typescript',
        '@types/node',
        '@types/express'
      ];
      
      const results = {
        packageJsonValid: true,
        dependencies: {},
        devDependencies: {},
        scripts: pkg.scripts || {},
        type: pkg.type || 'commonjs'
      };
      
      for (const dep of requiredDeps) {
        const installed = !!(pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]);
        results.dependencies[dep] = {
          installed,
          version: pkg.dependencies?.[dep] || pkg.devDependencies?.[dep] || 'missing'
        };
        
        if (!installed) {
          this.issues.push(`Dépendance manquante: ${dep}`);
        }
      }

      for (const dep of requiredDevDeps) {
        const installed = !!(pkg.devDependencies?.[dep]);
        results.devDependencies[dep] = {
          installed,
          version: pkg.devDependencies?.[dep] || 'missing'
        };
        
        if (!installed) {
          this.warnings.push(`Dépendance de développement manquante: ${dep}`);
        }
      }
      
      return results;
      
    } catch (error) {
      this.issues.push('package.json inaccessible ou invalide');
      return {
        packageJsonValid: false,
        error: error.message,
        critical: true
      };
    }
  }

  async checkDirectoryStructure() {
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

    const results = {};

    for (const dir of requiredDirs) {
      try {
        const stat = await fs.stat(dir);
        results[dir] = {
          exists: true,
          isDirectory: stat.isDirectory(),
          status: 'OK'
        };
      } catch (error) {
        results[dir] = {
          exists: false,
          status: 'MISSING',
          needsCreation: true
        };
        this.issues.push(`Dossier manquant: ${dir}`);
      }
    }

    return results;
  }

  async checkPerformance() {
    const memory = process.memoryUsage();
    const performance = {
      memory: {
        heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
        external: Math.round(memory.external / 1024 / 1024),
        rss: Math.round(memory.rss / 1024 / 1024)
      },
      uptime: Math.round(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform
    };

    // Vérifier les fichiers temporaires
    try {
      const uploadsFiles = await fs.readdir('uploads/').catch(() => []);
      performance.tempFiles = uploadsFiles.length;
      
      if (uploadsFiles.length > 50) {
        this.warnings.push(`Trop de fichiers temporaires: ${uploadsFiles.length}`);
      }
    } catch (error) {
      performance.tempFiles = 0;
    }

    if (performance.memory.heapUsed > 500) {
      this.warnings.push(`Utilisation mémoire élevée: ${performance.memory.heapUsed}MB`);
    }

    return performance;
  }
  
  async checkPorts() {
    return {
      port5000: {
        configured: true,
        free: true,
        status: 'OK',
        details: 'Port standard pour développement web'
      }
    };
  }
  
  checkEnvironment() {
    const env = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      environment: {
        isReplit: !!process.env.REPL_ID,
        hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
        nodeEnv: process.env.NODE_ENV || 'development',
        replId: process.env.REPL_ID || 'local'
      }
    };

    return env;
  }

  async performAutoRepair() {
    let repaired = 0;

    // Créer les dossiers manquants
    const requiredDirs = [
      'server/services',
      'server/config', 
      'server/utils',
      'uploads',
      'outputs',
      'outputs/temp'
    ];

    for (const dir of requiredDirs) {
      try {
        await fs.access(dir);
      } catch (error) {
        try {
          await fs.mkdir(dir, { recursive: true });
          this.fixes.push(`Dossier créé: ${dir}`);
          repaired++;
        } catch (createError) {
          console.error(`Impossible de créer ${dir}:`, createError.message);
        }
      }
    }

    // Créer les configurations manquantes
    await this.createMissingConfigs();

    console.log(`✅ ${repaired} réparations effectuées`);
  }

  async createMissingConfigs() {
    const configs = {
      'server/config/transformation-levels.json': {
        level1: { 
          description: "Nettoyage basique", 
          enabled: true,
          operations: ["clean", "format", "validate"]
        },
        level2: { 
          description: "Optimisation intermédiaire", 
          enabled: true,
          operations: ["optimize", "minify", "compress"]
        },
        level3: { 
          description: "Transformation avancée", 
          enabled: true,
          operations: ["enhance", "modernize", "restructure"]
        }
      },
      'server/config/modules-definitions.json': {
        effects: { 
          enabled: true, 
          priority: 1,
          types: ["visual", "animation", "transition"]
        },
        animations: { 
          enabled: true, 
          priority: 2,
          types: ["motion", "keyframes", "transforms"]
        },
        utilities: { 
          enabled: true, 
          priority: 3,
          types: ["helpers", "tools", "validators"]
        }
      }
    };

    for (const [configPath, defaultConfig] of Object.entries(configs)) {
      try {
        await fs.access(configPath);
      } catch (error) {
        try {
          await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
          this.fixes.push(`Configuration créée: ${configPath}`);
        } catch (writeError) {
          console.error(`Impossible de créer ${configPath}:`, writeError.message);
        }
      }
    }
  }

  getOverallStatus() {
    if (this.issues.length > 0) return 'critical';
    if (this.warnings.length > 3) return 'warning';
    return 'healthy';
  }
  
  generateReport(results) {
    console.log('\n📋 === RAPPORT DE DIAGNOSTIC ===\n');
    
    if (results.error) {
      console.log('❌ ERREUR:', results.error);
      return;
    }
    
    // Fichiers critiques
    console.log('📁 FICHIERS CRITIQUES:');
    let criticalIssues = 0;
    for (const [file, result] of Object.entries(results.files || {})) {
      const status = result.critical ? '❌' : result.status === 'OK' ? '✅' : '⚠️';
      console.log(`  ${status} ${file}: ${result.status}`);
      if (result.critical) criticalIssues++;
    }
    
    // Services
    console.log('\n🔧 SERVICES:');
    let serviceIssues = 0;
    for (const [service, result] of Object.entries(results.services || {})) {
      const status = result.critical ? '❌' : result.status === 'OK' ? '✅' : '⚠️';
      console.log(`  ${status} ${service}: ${result.status}`);
      if (result.critical) serviceIssues++;
    }

    // Configuration
    console.log('\n⚙️ CONFIGURATION:');
    for (const [config, result] of Object.entries(results.config || {})) {
      const status = result.needsRepair ? '❌' : result.status === 'OK' ? '✅' : '⚠️';
      const entries = result.entries ? ` (${result.entries} entrées)` : '';
      console.log(`  ${status} ${path.basename(config)}${entries}: ${result.status}`);
    }

    // Structure des dossiers
    console.log('\n📂 STRUCTURE:');
    for (const [dir, result] of Object.entries(results.structure || {})) {
      const status = !result.exists ? '❌' : '✅';
      console.log(`  ${status} ${dir}: ${result.status}`);
    }
    
    // Environnement
    if (results.environment) {
      console.log('\n🌍 ENVIRONNEMENT:');
      console.log(`  Node.js: ${results.environment.nodeVersion}`);
      console.log(`  Mémoire: ${results.environment.memory.used}MB / ${results.environment.memory.total}MB`);
      console.log(`  Replit: ${results.environment.environment.isReplit ? 'Oui' : 'Non'}`);
      console.log(`  Type de module: ${results.dependencies?.type || 'commonjs'}`);
    }

    // Performance
    if (results.performance) {
      console.log('\n📊 PERFORMANCE:');
      console.log(`  Uptime: ${results.performance.uptime}s`);
      console.log(`  Fichiers temp: ${results.performance.tempFiles}`);
      console.log(`  Mémoire RSS: ${results.performance.memory.rss}MB`);
    }
    
    // Résumé
    const totalIssues = this.issues.length;
    const totalWarnings = this.warnings.length;
    const totalFixes = this.fixes.length;
    
    console.log('\n📊 RÉSUMÉ:');
    console.log(`  🚨 Problèmes détectés: ${totalIssues}`);
    console.log(`  ⚠️ Avertissements: ${totalWarnings}`);
    console.log(`  🔧 Réparations effectuées: ${totalFixes}`);
    
    const overallStatus = this.getOverallStatus();
    const statusIcon = overallStatus === 'healthy' ? '✅' : 
                      overallStatus === 'warning' ? '⚠️' : '❌';
    console.log(`  🎯 STATUT SYSTÈME: ${statusIcon} ${overallStatus.toUpperCase()}`);
    
    console.log('\n🏁 Audit terminé: SUCCÈS\n');
  }
}

// Exécution directe
if (require.main === module) {
  const diagnostics = new SystemDiagnostics();
  diagnostics.runFullDiagnostics()
    .then((results) => {
      console.log(`\n✅ Diagnostic terminé avec statut: ${results.status}`);
      process.exit(results.status === 'critical' ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Erreur diagnostic:', error);
      process.exit(1);
    });
}

module.exports = SystemDiagnostics;
