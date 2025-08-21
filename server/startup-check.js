
#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

class StartupChecker {
  constructor() {
    this.criticalErrors = [];
    this.warnings = [];
  }

  async performStartupCheck() {
    console.log('🚀 Vérification de démarrage...\n');
    
    // Vérifier Node.js version
    await this.checkNodeVersion();
    
    // Vérifier les fichiers critiques
    await this.checkCriticalFiles();
    
    // Vérifier les dépendances
    await this.checkDependencies();
    
    // Vérifier les configurations
    await this.checkConfigurations();
    
    // Vérifier les ports
    await this.checkPorts();
    
    // Rapport final
    this.generateStartupReport();
    
    return this.criticalErrors.length === 0;
  }

  async checkNodeVersion() {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
      this.criticalErrors.push(`Version Node.js trop ancienne: ${version}. Minimum requis: 16.x`);
    } else {
      console.log(`✅ Node.js ${version} - OK`);
    }
  }

  async checkCriticalFiles() {
    const criticalFiles = [
      'package.json',
      'server/index.ts',
      'server/routes.ts',
      'client/src/App.tsx',
      'server/services/universal-preprocessor.ts',
      'server/services/js-preprocessor.ts'
    ];

    for (const file of criticalFiles) {
      try {
        const stat = await fs.stat(file);
        if (stat.size < 100) {
          this.warnings.push(`Fichier ${file} semble vide`);
        } else {
          console.log(`✅ ${file} - OK`);
        }
      } catch (error) {
        this.criticalErrors.push(`Fichier critique manquant: ${file}`);
      }
    }
  }

  async checkDependencies() {
    try {
      const packageJson = await fs.readFile('package.json', 'utf-8');
      const pkg = JSON.parse(packageJson);
      
      const requiredDeps = [
        'express',
        'typescript',
        'ts-node',
        'react',
        'vite'
      ];

      for (const dep of requiredDeps) {
        if (!pkg.dependencies?.[dep] && !pkg.devDependencies?.[dep]) {
          this.criticalErrors.push(`Dépendance critique manquante: ${dep}`);
        }
      }
      
      console.log('✅ Dépendances principales vérifiées');
    } catch (error) {
      this.criticalErrors.push('package.json invalide ou manquant');
    }
  }

  async checkConfigurations() {
    const configFiles = [
      'server/config/modules-definitions.json',
      'server/config/transformation-levels.json',
      'server/config/advanced-enhancement-modules.json'
    ];

    for (const file of configFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        JSON.parse(content);
        console.log(`✅ ${path.basename(file)} - OK`);
      } catch (error) {
        this.warnings.push(`Configuration ${file} invalide ou manquante`);
      }
    }
  }

  async checkPorts() {
    const { exec } = require('child_process');
    
    return new Promise((resolve) => {
      exec('netstat -tlnp 2>/dev/null | grep :5000 || echo "libre"', (error, stdout) => {
        if (stdout.includes('libre')) {
          console.log('✅ Port 5000 disponible');
        } else {
          this.warnings.push('Port 5000 pourrait être occupé');
        }
        resolve();
      });
    });
  }

  generateStartupReport() {
    console.log('\n📋 === RAPPORT DE DÉMARRAGE ===');
    
    if (this.criticalErrors.length > 0) {
      console.log('\n❌ ERREURS CRITIQUES:');
      this.criticalErrors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ AVERTISSEMENTS:');
      this.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning}`);
      });
    }

    const status = this.criticalErrors.length === 0 ? 
      (this.warnings.length === 0 ? 'PARFAIT' : 'ACCEPTABLE') : 'CRITIQUE';
    
    console.log(`\n🎯 STATUT: ${status}`);
    console.log(`Erreurs: ${this.criticalErrors.length} | Avertissements: ${this.warnings.length}\n`);
  }
}

// Exécution si appelé directement
if (require.main === module) {
  const checker = new StartupChecker();
  checker.performStartupCheck()
    .then(success => {
      if (success) {
        console.log('🎉 Système prêt pour le démarrage!');
        process.exit(0);
      } else {
        console.log('🚨 Problèmes critiques détectés. Corrigez avant de continuer.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Erreur lors de la vérification:', error);
      process.exit(1);
    });
}

module.exports = StartupChecker;
