
const fs = require('fs').promises;
const path = require('path');

class SystemDiagnostics {
  async runFullDiagnostics() {
    console.log('🔍 === DIAGNOSTIC SYSTÈME COMPLET ===\n');
    
    const results = {
      files: await this.checkCriticalFiles(),
      services: await this.checkServices(),
      config: await this.checkConfiguration(),
      dependencies: await this.checkDependencies(),
      ports: await this.checkPorts(),
      environment: this.checkEnvironment()
    };
    
    this.generateReport(results);
    return results;
  }
  
  async checkCriticalFiles() {
    const criticalFiles = [
      'server/index.ts',
      'server/routes.ts', 
      'server/services/universal-preprocessor.ts',
      'server/services/js-preprocessor.ts',
      'server/services/documentation-packager.ts',
      'server/utils/system-auditor.ts',
      'package.json',
      'client/src/App.tsx'
    ];
    
    const results = {};
    
    for (const file of criticalFiles) {
      try {
        const stat = await fs.stat(file);
        const content = await fs.readFile(file, 'utf-8');
        
        results[file] = {
          exists: true,
          size: stat.size,
          lastModified: stat.mtime,
          hasContent: content.length > 100,
          hasExports: content.includes('export') || content.includes('module.exports'),
          status: 'OK'
        };
        
        if (content.length < 100) {
          results[file].status = 'WARNING: Fichier trop petit';
        }
        
      } catch (error) {
        results[file] = {
          exists: false,
          status: `ERROR: ${error.message}`,
          critical: true
        };
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
      'intelligent-categorizer',
      'ai-transformer',
      'code-validator',
      'file-processor'
    ];
    
    const results = {};
    
    for (const service of services) {
      try {
        const servicePath = `./services/${service}.ts`;
        
        // Vérifier que le fichier existe avant d'essayer de l'importer
        await fs.access(servicePath);
        
        const content = await fs.readFile(servicePath, 'utf-8');
        
        results[service] = {
          exists: true,
          hasContent: content.length > 100,
          hasExports: content.includes('export'),
          status: 'OK'
        };
        
        if (!content.includes('export')) {
          results[service].status = 'WARNING: Pas d\'exports détectés';
        }
        
      } catch (error) {
        results[service] = {
          exists: false,
          status: `ERROR: ${error.message}`,
          critical: true
        };
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
          status: 'OK'
        };
        
      } catch (error) {
        results[file] = {
          exists: error.code !== 'ENOENT',
          validJson: false,
          status: `ERROR: ${error.message}`,
          needsRepair: true
        };
      }
    }
    
    return results;
  }
  
  async checkDependencies() {
    try {
      const packageJson = await fs.readFile('package.json', 'utf-8');
      const pkg = JSON.parse(packageJson);
      
      const requiredDeps = [
        '@anthropic-ai/sdk',
        'express',
        'multer',
        'archiver',
        'drizzle-orm',
        'zod'
      ];
      
      const results = {
        packageJsonValid: true,
        dependencies: {}
      };
      
      for (const dep of requiredDeps) {
        results.dependencies[dep] = {
          installed: !!(pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]),
          version: pkg.dependencies?.[dep] || pkg.devDependencies?.[dep] || 'missing'
        };
      }
      
      return results;
      
    } catch (error) {
      return {
        packageJsonValid: false,
        error: error.message,
        critical: true
      };
    }
  }
  
  async checkPorts() {
    const { exec } = require('child_process');
    
    return new Promise((resolve) => {
      exec('netstat -tlnp 2>/dev/null | grep :5000 || echo "Port 5000 libre"', (error, stdout) => {
        const isPortFree = stdout.includes('Port 5000 libre');
        
        resolve({
          port5000: {
            free: isPortFree,
            status: isPortFree ? 'OK' : 'OCCUPÉ',
            details: stdout.trim()
          }
        });
      });
    });
  }
  
  checkEnvironment() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      environment: {
        isReplit: !!process.env.REPL_ID,
        hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
        nodeEnv: process.env.NODE_ENV
      }
    };
  }
  
  generateReport(results) {
    console.log('📋 === RAPPORT DE DIAGNOSTIC ===\n');
    
    // Fichiers critiques
    console.log('📁 FICHIERS CRITIQUES:');
    let criticalIssues = 0;
    for (const [file, result] of Object.entries(results.files)) {
      const status = result.critical ? '❌' : result.status === 'OK' ? '✅' : '⚠️';
      console.log(`  ${status} ${file}: ${result.status}`);
      if (result.critical) criticalIssues++;
    }
    
    // Services
    console.log('\n🔧 SERVICES:');
    let serviceIssues = 0;
    for (const [service, result] of Object.entries(results.services)) {
      const status = result.critical ? '❌' : result.status === 'OK' ? '✅' : '⚠️';
      console.log(`  ${status} ${service}: ${result.status}`);
      if (result.critical) serviceIssues++;
    }
    
    // Configuration
    console.log('\n⚙️ CONFIGURATION:');
    let configIssues = 0;
    for (const [file, result] of Object.entries(results.config)) {
      const status = result.needsRepair ? '❌' : result.status === 'OK' ? '✅' : '⚠️';
      console.log(`  ${status} ${path.basename(file)}: ${result.status}`);
      if (result.needsRepair) configIssues++;
    }
    
    // Ports
    console.log('\n🌐 PORTS:');
    const portStatus = results.ports.port5000.free ? '✅' : '❌';
    console.log(`  ${portStatus} Port 5000: ${results.ports.port5000.status}`);
    
    // Environnement
    console.log('\n🌍 ENVIRONNEMENT:');
    console.log(`  Node.js: ${results.environment.nodeVersion}`);
    console.log(`  Mémoire: ${results.environment.memory.used}MB / ${results.environment.memory.total}MB`);
    console.log(`  Replit: ${results.environment.environment.isReplit ? 'Oui' : 'Non'}`);
    console.log(`  Clé Anthropic: ${results.environment.environment.hasAnthropicKey ? 'Configurée' : 'Manquante'}`);
    
    // Résumé
    const totalIssues = criticalIssues + serviceIssues + configIssues + (!results.ports.port5000.free ? 1 : 0);
    console.log('\n📊 RÉSUMÉ:');
    console.log(`  Problèmes critiques: ${totalIssues}`);
    console.log(`  État général: ${totalIssues === 0 ? '✅ SAIN' : totalIssues < 3 ? '⚠️ ATTENTION' : '❌ CRITIQUE'}`);
  }
}

// Exécuter le diagnostic si appelé directement
if (require.main === module) {
  const diagnostics = new SystemDiagnostics();
  diagnostics.runFullDiagnostics()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Erreur diagnostic:', error);
      process.exit(1);
    });
}

module.exports = SystemDiagnostics;
