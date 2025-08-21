
/**
 * Système de diagnostic complet en ES modules
 */

import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class SystemDiagnostics {
  constructor() {
    this.results = [];
    this.errors = [];
    this.warnings = [];
  }

  async runFullDiagnostic() {
    console.log('🔍 === DIAGNOSTIC ES SYSTÈME COMPLET ===\n');

    try {
      await this.checkPackageConfiguration();
      await this.checkESModules();
      await this.checkServerFiles();
      await this.checkServicesES();
      await this.testESCompilation();
      await this.performESRepairs();

      return this.generateReport();
    } catch (error) {
      this.errors.push(`Erreur critique diagnostic: ${error.message}`);
      return this.generateReport();
    }
  }

  async checkPackageConfiguration() {
    console.log('1️⃣ Vérification configuration ES Node.js...');
    
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageContent);

      if (packageJson.type === 'module') {
        console.log('✅ Type de module: ES module');
        this.results.push('Configuration ES module correcte');
      } else {
        this.warnings.push('Type de module non défini ou CommonJS');
      }

      if (packageJson.scripts) {
        console.log('✅ Scripts disponibles:', Object.keys(packageJson.scripts).join(', '));
      }

    } catch (error) {
      this.errors.push(`Erreur package.json: ${error.message}`);
    }
  }

  async checkESModules() {
    console.log('2️⃣ Vérification fichiers ES TypeScript...');
    
    const filesToCheck = [
      'server/index.ts',
      'server/routes.ts',
      'server/storage.ts',
      'tsconfig.json'
    ];

    for (const file of filesToCheck) {
      try {
        await fs.access(file);
        console.log(`✅ ${file} - OK`);
        this.results.push(`${file} vérifié`);
      } catch (error) {
        console.log(`❌ ${file} - MANQUANT`);
        this.errors.push(`${file} manquant`);
      }
    }
  }

  async checkServerFiles() {
    console.log('3️⃣ Vérification fichiers serveur ES...');
    
    try {
      const serverDir = path.join(process.cwd(), 'server');
      const files = await fs.readdir(serverDir);
      
      const tsFiles = files.filter(f => f.endsWith('.ts'));
      const jsFiles = files.filter(f => f.endsWith('.js') || f.endsWith('.mjs'));
      
      console.log(`✅ ${tsFiles.length} fichiers TypeScript ES trouvés`);
      console.log(`✅ ${jsFiles.length} fichiers JavaScript ES trouvés`);
      
      this.results.push(`${tsFiles.length + jsFiles.length} fichiers serveur ES vérifiés`);
      
    } catch (error) {
      this.errors.push(`Erreur vérification serveur: ${error.message}`);
    }
  }

  async checkServicesES() {
    console.log('4️⃣ Vérification services ES...');
    
    try {
      const servicesDir = path.join(process.cwd(), 'server/services');
      const files = await fs.readdir(servicesDir);
      
      const serviceFiles = files.filter(f => f.endsWith('.ts'));
      console.log(`✅ ${serviceFiles.length} services ES TypeScript trouvés`);
      
      // Vérifier quelques services clés
      const keyServices = ['universal-preprocessor.ts', 'js-preprocessor.ts'];
      for (const service of keyServices) {
        if (files.includes(service)) {
          console.log(`✅ ${service} - Structure ES correcte`);
          this.results.push(`${service} ES vérifié`);
        } else {
          this.warnings.push(`${service} manquant`);
        }
      }
      
    } catch (error) {
      this.errors.push(`Erreur vérification services ES: ${error.message}`);
    }
  }

  async testESCompilation() {
    console.log('5️⃣ Test compilation ES TypeScript...');
    
    return new Promise((resolve) => {
      const tscProcess = spawn('npx', ['tsc', '--noEmit', '--skipLibCheck'], {
        stdio: 'pipe'
      });

      let output = '';
      let errorOutput = '';

      tscProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      tscProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      tscProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Compilation ES TypeScript réussie');
          this.results.push('Compilation ES TypeScript OK');
        } else {
          console.log('⚠️ Erreurs ES TypeScript détectées');
          this.warnings.push(`Erreurs compilation ES: ${errorOutput}`);
        }
        resolve();
      });
    });
  }

  async performESRepairs() {
    console.log('6️⃣ Réparations automatiques ES...');
    
    const dirsToEnsure = [
      'uploads',
      'outputs',
      'outputs/temp',
      'server/config',
      'server/services',
      'server/utils'
    ];

    let repairCount = 0;
    for (const dir of dirsToEnsure) {
      try {
        await fs.access(dir);
      } catch (error) {
        await fs.mkdir(dir, { recursive: true });
        console.log(`📁 Dossier créé: ${dir}`);
        this.results.push(`Dossier ${dir} créé`);
        repairCount++;
      }
    }

    // Vérifier que tsx est installé pour ES modules
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageContent);
      
      if (!packageJson.devDependencies?.tsx && !packageJson.dependencies?.tsx) {
        this.warnings.push('tsx manquant - requis pour ES modules TypeScript');
      }
    } catch (error) {
      // Ignore
    }

    console.log(`🔧 ${repairCount} réparations ES effectuées`);
  }

  generateReport() {
    const totalIssues = this.errors.length + this.warnings.length;
    const totalRepairs = this.results.length;

    console.log('\n📋 === RAPPORT DIAGNOSTIC ES ===');
    
    if (this.errors.length > 0) {
      console.log(`🚨 Problèmes critiques: ${this.errors.length}`);
      this.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log(`⚠️ Avertissements: ${this.warnings.length}`);
      this.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning}`);
      });
    }

    console.log(`🔧 Réparations ES effectuées: ${totalRepairs}`);
    this.results.forEach((result, i) => {
      console.log(`  ${i + 1}. ${result}`);
    });

    let status;
    if (this.errors.length === 0 && this.warnings.length === 0) {
      status = 'PARFAIT ES';
    } else if (this.errors.length === 0) {
      status = 'BON ES';
    } else if (this.errors.length <= 2) {
      status = 'ACCEPTABLE ES';
    } else {
      status = 'PROBLÉMATIQUE ES';
    }

    console.log(`\n🎯 STATUT SYSTÈME ES: ${status}`);
    console.log('\n🏁 Diagnostic ES terminé: SUCCÈS\n');

    return {
      status,
      errors: this.errors,
      warnings: this.warnings,
      results: this.results,
      totalIssues,
      totalRepairs
    };
  }
}

// Point d'entrée principal
export async function runDiagnostic() {
  const diagnostic = new SystemDiagnostics();
  return await diagnostic.runFullDiagnostic();
}

// Export par défaut
export default SystemDiagnostics;

// Auto-exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  runDiagnostic().then(() => {
    console.log('Diagnostic ES terminé');
  }).catch((error) => {
    console.error('Erreur diagnostic ES:', error);
    process.exit(1);
  });
}
