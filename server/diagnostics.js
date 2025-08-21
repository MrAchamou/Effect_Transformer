import { fileURLToPath } from 'url';
import path from 'path';

import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const fileURLToPath(import.meta.url) = fileURLToPath(import.meta.url);
const path.dirname(fileURLToPath(import.meta.url)) = path.dirname(fileURLToPath(import.meta.url));

/**
 * Système de diagnostic complet en ES modules
 */
class SystemDiagnostics {
  constructor() {
    this.results = [];
    this.warnings = [];
    this.errors = [];
    this.startTime = Date.now();
  }

  async runFullDiagnostic() {
    console.log('🔍 === DIAGNOSTIC SYSTÈME COMPLET ES ===\n');

    await this.checkESModuleCompatibility();
    await this.checkFileStructure();
    await this.checkPackageConfiguration();
    await this.checkTypeScriptCompilation();
    await this.performESRepairs();

    this.displayResults();
  }

  async checkESModuleCompatibility() {
    console.log('1️⃣ Vérification compatibilité ES modules...');

    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageContent);

      if (packageJson.type === 'module') {
        console.log('✅ Package configuré pour ES modules');
        this.results.push('Package.json configuré ES modules');
      } else {
        console.log('⚠️ Package non configuré pour ES modules');
        this.warnings.push('Package.json manque "type": "module"');
      }
    } catch (error) {
      this.errors.push(`Erreur lecture package.json: ${error.message}`);
    }
  }

  async checkFileStructure() {
    console.log('2️⃣ Vérification structure fichiers...');

    const criticalFiles = [
      'server/index.ts',
      'server/routes.ts',
      'client/src/main.tsx',
      'vite.config.ts'
    ];

    for (const file of criticalFiles) {
      try {
        await fs.access(file);
        console.log(`✅ ${file} existe`);
        this.results.push(`${file} présent`);
      } catch (error) {
        console.log(`❌ ${file} manquant`);
        this.warnings.push(`${file} manquant`);
      }
    }
  }

  async checkPackageConfiguration() {
    console.log('3️⃣ Vérification configuration packages...');

    try {
      const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
      const tsConfig = JSON.parse(await fs.readFile(tsConfigPath, 'utf-8'));

      if (tsConfig.compilerOptions?.module === 'ESNext' || tsConfig.compilerOptions?.module === 'ES2022') {
        console.log('✅ TypeScript configuré pour ES modules');
        this.results.push('TypeScript ES modules OK');
      } else {
        this.warnings.push('TypeScript non optimisé pour ES modules');
      }
    } catch (error) {
      this.warnings.push(`Erreur tsconfig: ${error.message}`);
    }
  }

  async checkTypeScriptCompilation() {
    console.log('4️⃣ Test compilation TypeScript ES...');

    return new Promise((resolve) => {
      const tscProcess = spawn('npx', ['tsc', '--noEmit'], {
        stdio: 'pipe',
        shell: true
      });

      let errorOutput = '';
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
    console.log('5️⃣ Réparations automatiques ES...');

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
      this.warnings.push(`Erreur vérification tsx: ${error.message}`);
    }
  }

  displayResults() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

    console.log('\n📊 === RÉSULTATS DIAGNOSTIC ES ===');
    console.log(`⏱️ Durée: ${duration}s`);
    console.log(`✅ Succès: ${this.results.length}`);
    console.log(`⚠️ Avertissements: ${this.warnings.length}`);
    console.log(`❌ Erreurs: ${this.errors.length}`);

    if (this.warnings.length > 0) {
      console.log('\n⚠️ AVERTISSEMENTS:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    if (this.errors.length > 0) {
      console.log('\n❌ ERREURS:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }

    console.log('\n🎯 Diagnostic terminé !');
  }
}

async function runDiagnostic() {
  const diagnostics = new SystemDiagnostics();
  await diagnostics.runFullDiagnostic();
}

// Export par défaut
export default SystemDiagnostics;

// Auto-exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  runDiagnostic().then(() => {
    console.log('Diagnostic terminé avec succès');
  }).catch(console.error);
}