
const fs = require('fs').promises;
const path = require('path');

class SystemRepair {
  constructor() {
    this.issues = [];
    this.fixes = [];
  }

  async repairSystem() {
    console.log('🔧 Démarrage de la réparation automatique du système...\n');

    // 1. Vérifier et réparer les fichiers de configuration
    await this.repairConfigFiles();
    
    // 2. Vérifier et réparer les services
    await this.repairServices();
    
    // 3. Vérifier les dépendances
    await this.checkDependencies();
    
    // 4. Nettoyer les fichiers temporaires
    await this.cleanTempFiles();

    console.log('\n📊 Rapport de réparation:');
    console.log(`✅ Réparations effectuées: ${this.fixes.length}`);
    console.log(`❌ Problèmes persistants: ${this.issues.length}`);
    
    if (this.fixes.length > 0) {
      console.log('\n🔧 Réparations effectuées:');
      this.fixes.forEach((fix, index) => {
        console.log(`  ${index + 1}. ${fix}`);
      });
    }
    
    if (this.issues.length > 0) {
      console.log('\n⚠️  Problèmes nécessitant une attention manuelle:');
      this.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
    
    console.log('\n✅ Réparation terminée!');
    return this.issues.length === 0;
  }

  async repairConfigFiles() {
    const configFiles = [
      'server/config/modules-definitions.json',
      'server/config/transformation-levels.json',
      'server/config/advanced-enhancement-modules.json'
    ];

    for (const file of configFiles) {
      try {
        await fs.access(file);
        const content = await fs.readFile(file, 'utf-8');
        
        // Vérifier que c'est du JSON valide
        JSON.parse(content);
        
      } catch (error) {
        if (error.code === 'ENOENT') {
          // Créer le fichier s'il n'existe pas
          await this.createDefaultConfig(file);
          this.fixes.push(`Configuration créée: ${file}`);
        } else if (error instanceof SyntaxError) {
          // JSON invalide
          await this.repairJsonFile(file);
          this.fixes.push(`JSON réparé: ${file}`);
        } else {
          this.issues.push(`Erreur configuration ${file}: ${error.message}`);
        }
      }
    }
  }

  async createDefaultConfig(filePath) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    const filename = path.basename(filePath);
    let defaultContent = '{}';
    
    if (filename === 'modules-definitions.json') {
      defaultContent = JSON.stringify({
        "performance": {
          "name": "Optimisation Performance",
          "description": "Optimise les performances du code JavaScript"
        },
        "security": {
          "name": "Sécurité Renforcée", 
          "description": "Ajoute des protections de sécurité"
        }
      }, null, 2);
    } else if (filename === 'transformation-levels.json') {
      defaultContent = JSON.stringify({
        "1": { "name": "Basique", "modules": 3 },
        "2": { "name": "Intermédiaire", "modules": 6 },
        "3": { "name": "Avancé", "modules": 12 }
      }, null, 2);
    }
    
    await fs.writeFile(filePath, defaultContent, 'utf-8');
  }

  async repairJsonFile(filePath) {
    try {
      let content = await fs.readFile(filePath, 'utf-8');
      
      // Tentatives de réparation JSON communes
      content = content.replace(/,(\s*[}\]])/g, '$1'); // Virgules en trop
      content = content.replace(/([{,]\s*)(\w+):/g, '$1"$2":'); // Clés non quotées
      
      // Tester si c'est maintenant valide
      JSON.parse(content);
      await fs.writeFile(filePath, content, 'utf-8');
      
    } catch (error) {
      // Si la réparation échoue, créer un fichier par défaut
      await this.createDefaultConfig(filePath);
    }
  }

  async repairServices() {
    const services = [
      'server/services/universal-preprocessor.ts',
      'server/services/js-preprocessor.ts',
      'server/services/documentation-packager.ts'
    ];

    for (const service of services) {
      try {
        await fs.access(service);
        const content = await fs.readFile(service, 'utf-8');
        
        // Vérifications basiques
        if (content.length < 500) {
          this.issues.push(`Service ${service} semble incomplet`);
        }
        
        if (!content.includes('export')) {
          this.issues.push(`Service ${service} n'a pas d'exports`);
        }
        
      } catch (error) {
        this.issues.push(`Service manquant: ${service}`);
      }
    }
  }

  async checkDependencies() {
    try {
      const packageJson = await fs.readFile('package.json', 'utf-8');
      const pkg = JSON.parse(packageJson);
      
      const requiredDeps = [
        '@anthropic-ai/sdk',
        'archiver',
        'express',
        'multer'
      ];
      
      for (const dep of requiredDeps) {
        if (!pkg.dependencies?.[dep] && !pkg.devDependencies?.[dep]) {
          this.issues.push(`Dépendance manquante: ${dep}`);
        }
      }
      
    } catch (error) {
      this.issues.push('Impossible de vérifier package.json');
    }
  }

  async cleanTempFiles() {
    const tempDirs = [
      'outputs/temp',
      'server/temp',
      '.temp'
    ];

    for (const dir of tempDirs) {
      try {
        const stat = await fs.stat(dir);
        if (stat.isDirectory()) {
          await fs.rmdir(dir, { recursive: true });
          this.fixes.push(`Dossier temporaire nettoyé: ${dir}`);
        }
      } catch (error) {
        // Dossier n'existe pas, pas de problème
      }
    }
  }
}

// Exécuter la réparation si le script est appelé directement
if (require.main === module) {
  const repair = new SystemRepair();
  repair.repairSystem()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Erreur lors de la réparation:', error);
      process.exit(1);
    });
}

module.exports = SystemRepair;
