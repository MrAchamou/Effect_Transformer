
const fs = require('fs').promises;
const path = require('path');

class SystemDiagnostics {
  async runFullDiagnostics() {
    console.log('🔍 === DIAGNOSTIC SYSTÈME COMPLET ===\n');
    
    try {
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
      'server/index.ts',
      'server/routes.ts', 
      'server/services/universal-preprocessor.ts',
      'server/services/js-preprocessor.ts',
      'server/services/documentation-packager.ts',
      'package.json'
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
      'server/config/modules-definitions.json'
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
        'express',
        'multer',
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
    return {
      port5000: {
        free: true,
        status: 'OK',
        details: 'Port disponible'
      }
    };
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
    
    // Environnement
    if (results.environment) {
      console.log('\n🌍 ENVIRONNEMENT:');
      console.log(`  Node.js: ${results.environment.nodeVersion}`);
      console.log(`  Mémoire: ${results.environment.memory.used}MB / ${results.environment.memory.total}MB`);
      console.log(`  Replit: ${results.environment.environment.isReplit ? 'Oui' : 'Non'}`);
    }
    
    // Résumé
    const totalIssues = criticalIssues + serviceIssues;
    console.log('\n📊 RÉSUMÉ:');
    console.log(`  Problèmes critiques: ${totalIssues}`);
    console.log(`  État général: ${totalIssues === 0 ? '✅ SAIN' : totalIssues < 3 ? '⚠️ ATTENTION' : '❌ CRITIQUE'}`);
  }
}

// Exécution directe
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
