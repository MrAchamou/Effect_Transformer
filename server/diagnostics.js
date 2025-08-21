import fs from 'fs/promises';
import path from 'path';

export class DiagnosticSystem {
  constructor() {
    this.issues = [];
    this.fixes = [];
  }

  async performFullDiagnostic() {
    console.log('🔍 === DIAGNOSTIC SYSTÈME COMPLET ===');

    const checks = [
      this.checkFileStructure(),
      this.checkPackageConfiguration(),
      this.checkTypeScriptConfiguration(),
      this.checkDependencies()
    ];

    const results = await Promise.allSettled(checks);

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`✅ Check ${index + 1} passed`);
      } else {
        console.log(`❌ Check ${index + 1} failed:`, result.reason);
        this.issues.push(result.reason);
      }
    });

    return {
      status: this.issues.length === 0 ? 'healthy' : 'issues_found',
      issues: this.issues,
      fixes: this.fixes
    };
  }

  async checkFileStructure() {
    const requiredFiles = [
      'package.json',
      'server/index.ts',
      'tsconfig.json'
    ];

    for (const file of requiredFiles) {
      try {
        await fs.access(file);
      } catch (error) {
        throw new Error(`Fichier manquant: ${file}`);
      }
    }

    return true;
  }

  async checkPackageConfiguration() {
    try {
      const packageContent = await fs.readFile('package.json', 'utf-8');
      const packageJson = JSON.parse(packageContent);

      if (packageJson.type !== 'module') {
        throw new Error('package.json doit avoir "type": "module"');
      }

      return true;
    } catch (error) {
      throw new Error(`Configuration package.json invalide: ${error.message}`);
    }
  }

  async checkTypeScriptConfiguration() {
    try {
      await fs.access('tsconfig.json');
      return true;
    } catch (error) {
      throw new Error('tsconfig.json manquant');
    }
  }

  async checkDependencies() {
    try {
      await fs.access('node_modules');
      return true;
    } catch (error) {
      this.fixes.push('Installation des dépendances nécessaire');
      throw new Error('node_modules manquant - exécuter npm install');
    }
  }
}

// Export pour les deux formats
const diagnosticSystem = new DiagnosticSystem();
export default diagnosticSystem;

// Compatibilité CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DiagnosticSystem, default: diagnosticSystem };
}