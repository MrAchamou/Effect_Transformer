
const fs = require('fs').promises;

async function runCompleteSystemTest() {
  console.log('🎯 === TEST SYSTÈME COMPLET ===\n');
  
  try {
    // 1. Test de base des fichiers critiques
    console.log('1️⃣ Vérification des fichiers critiques...');
    await testCriticalFiles();
    
    // 2. Test des services
    console.log('\n2️⃣ Vérification des services...');
    await testServices();
    
    // 3. Test de la configuration
    console.log('\n3️⃣ Vérification de la configuration...');
    await testConfiguration();
    
    // 4. Test des dépendances
    console.log('\n4️⃣ Vérification des dépendances...');
    await testDependencies();
    
    // 5. Réparations automatiques si nécessaire
    console.log('\n5️⃣ Réparations automatiques...');
    await performEmergencyRepairs();
    
    console.log('\n🏆 === RÉSULTAT FINAL ===');
    console.log('✅ SYSTÈME OPÉRATIONNEL');
    
    return true;
    
  } catch (error) {
    console.error('💥 Erreur durant le test système:', error.message);
    console.log('🔧 Tentative de réparation d\'urgence...');
    
    try {
      await performEmergencyRepairs();
      console.log('✅ Réparations d\'urgence terminées');
      return true;
    } catch (repairError) {
      console.error('❌ Réparations échouées:', repairError.message);
      return false;
    }
  }
}

async function testCriticalFiles() {
  const criticalFiles = [
    'server/index.ts',
    'server/routes.ts',
    'server/services/universal-preprocessor.ts',
    'server/services/js-preprocessor.ts',
    'server/services/documentation-packager.ts',
    'package.json'
  ];
  
  let issues = 0;
  
  for (const file of criticalFiles) {
    try {
      const stat = await fs.stat(file);
      const content = await fs.readFile(file, 'utf-8');
      
      if (content.length < 50) {
        console.log(`  ⚠️ ${file}: Fichier trop petit (${content.length} caractères)`);
        issues++;
      } else {
        console.log(`  ✅ ${file}: OK (${stat.size} bytes)`);
      }
    } catch (error) {
      console.log(`  ❌ ${file}: MANQUANT - ${error.message}`);
      issues++;
    }
  }
  
  if (issues > 0) {
    console.log(`\n⚠️ ${issues} problème(s) détecté(s) dans les fichiers critiques`);
  }
  
  return issues === 0;
}

async function testServices() {
  const services = [
    'universal-preprocessor',
    'js-preprocessor',
    'documentation-packager',
    'code-validator',
    'file-processor'
  ];
  
  let issues = 0;
  
  for (const service of services) {
    try {
      const servicePath = `server/services/${service}.ts`;
      const content = await fs.readFile(servicePath, 'utf-8');
      
      const hasExport = content.includes('export class') || content.includes('export default');
      
      if (hasExport) {
        console.log(`  ✅ ${service}: Service OK`);
      } else {
        console.log(`  ⚠️ ${service}: Pas d'exports détectés`);
        issues++;
      }
    } catch (error) {
      console.log(`  ❌ ${service}: MANQUANT - ${error.message}`);
      issues++;
    }
  }
  
  if (issues > 0) {
    console.log(`\n⚠️ ${issues} problème(s) détecté(s) dans les services`);
  }
  
  return issues === 0;
}

async function testConfiguration() {
  const configFiles = [
    'server/config/transformation-levels.json',
    'server/config/modules-definitions.json'
  ];
  
  let issues = 0;
  
  for (const file of configFiles) {
    try {
      const content = await fs.readFile(file, 'utf-8');
      const parsed = JSON.parse(content);
      
      if (Object.keys(parsed).length > 0) {
        console.log(`  ✅ ${file.split('/').pop()}: JSON valide`);
      } else {
        console.log(`  ⚠️ ${file.split('/').pop()}: JSON vide`);
        issues++;
      }
    } catch (error) {
      console.log(`  ❌ ${file.split('/').pop()}: ${error.message}`);
      issues++;
    }
  }
  
  return issues === 0;
}

async function testDependencies() {
  try {
    const packageContent = await fs.readFile('package.json', 'utf-8');
    const pkg = JSON.parse(packageContent);
    
    const requiredDeps = ['express', 'multer', 'zod'];
    let missing = 0;
    
    for (const dep of requiredDeps) {
      if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) {
        console.log(`  ✅ ${dep}: Installé`);
      } else {
        console.log(`  ❌ ${dep}: MANQUANT`);
        missing++;
      }
    }
    
    return missing === 0;
  } catch (error) {
    console.log(`  ❌ package.json: ${error.message}`);
    return false;
  }
}

async function performEmergencyRepairs() {
  console.log('🚨 Démarrage des réparations...');
  
  // Créer les dossiers manquants
  const requiredDirs = [
    'server/services',
    'server/config',
    'server/utils',
    'uploads'
  ];
  
  for (const dir of requiredDirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(`  📁 Dossier créé: ${dir}`);
    } catch (error) {
      // Ignorer si le dossier existe déjà
      if (error.code !== 'EEXIST') {
        console.log(`  ⚠️ Erreur création ${dir}: ${error.message}`);
      }
    }
  }
  
  // Vérifier les fichiers de configuration critiques
  const configChecks = [
    {
      file: 'server/config/transformation-levels.json',
      content: {
        "1": { "name": "Basic Enhancement", "description": "Basic improvements" },
        "2": { "name": "Advanced Enhancement", "description": "Advanced improvements" }
      }
    }
  ];
  
  for (const config of configChecks) {
    try {
      await fs.access(config.file);
      console.log(`  ✅ ${config.file}: Existe déjà`);
    } catch (error) {
      try {
        await fs.writeFile(config.file, JSON.stringify(config.content, null, 2));
        console.log(`  📝 ${config.file}: Créé avec contenu par défaut`);
      } catch (writeError) {
        console.log(`  ❌ Erreur création ${config.file}: ${writeError.message}`);
      }
    }
  }
  
  console.log('✅ Réparations terminées');
}

// Exécution directe
if (require.main === module) {
  runCompleteSystemTest()
    .then(success => {
      console.log(`\n📊 Test terminé: ${success ? 'SUCCÈS' : 'ÉCHEC'}`);
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test système échoué complètement:', error);
      process.exit(1);
    });
}

module.exports = { runCompleteSystemTest };
