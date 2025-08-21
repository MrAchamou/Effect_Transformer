
const SystemDiagnostics = require('./server/diagnostics.js');
const SystemRepair = require('./server/system-repair.js');

async function runCompleteSystemTest() {
  console.log('🎯 === TEST SYSTÈME COMPLET ===\n');
  
  try {
    // 1. Diagnostic initial
    console.log('1️⃣ Diagnostic initial...');
    const diagnostics = new SystemDiagnostics();
    const initialState = await diagnostics.runFullDiagnostics();
    
    // 2. Réparation automatique si nécessaire
    if (hasIssues(initialState)) {
      console.log('\n2️⃣ Réparation automatique...');
      const repair = new SystemRepair();
      await repair.repairSystem();
    }
    
    // 3. Test de fonctionnement
    console.log('\n3️⃣ Test de fonctionnement...');
    await testFunctionality();
    
    // 4. Diagnostic final
    console.log('\n4️⃣ Diagnostic final...');
    const finalState = await diagnostics.runFullDiagnostics();
    
    console.log('\n🏆 === RÉSULTAT FINAL ===');
    const isHealthy = !hasIssues(finalState);
    console.log(`État: ${isHealthy ? '✅ SYSTÈME OPÉRATIONNEL' : '❌ PROBLÈMES PERSISTANTS'}`);
    
    return isHealthy;
    
  } catch (error) {
    console.error('💥 Erreur durant le test système:', error.message);
    console.log('🔧 Tentative de réparation d\'urgence...');
    
    try {
      await emergencyRepair();
      console.log('✅ Réparation d\'urgence terminée');
      return false; // Indique que des réparations ont été nécessaires
    } catch (repairError) {
      console.error('❌ Réparation d\'urgence échouée:', repairError.message);
      return false;
    }
  }
}

function hasIssues(diagnosticResult) {
  if (!diagnosticResult) return true;
  
  try {
    // Vérifier s'il y a des problèmes critiques
    const fileIssues = diagnosticResult.files ? 
      Object.values(diagnosticResult.files).some(f => f && f.critical) : false;
    
    const serviceIssues = diagnosticResult.services ? 
      Object.values(diagnosticResult.services).some(s => s && s.critical) : false;
    
    const configIssues = diagnosticResult.config ? 
      Object.values(diagnosticResult.config).some(c => c && c.needsRepair) : false;
    
    const portIssues = diagnosticResult.ports ? 
      !diagnosticResult.ports.port5000?.free : false;
    
    return fileIssues || serviceIssues || configIssues || portIssues;
  } catch (error) {
    console.warn('⚠️ Erreur lors de la vérification des problèmes:', error.message);
    return true; // En cas de doute, considérer qu'il y a des problèmes
  }
}

async function testFunctionality() {
  const fs = require('fs').promises;
  
  const tests = [
    { 
      name: 'UniversalPreprocessor file exists', 
      test: () => fs.access('./server/services/universal-preprocessor.ts'),
      critical: true 
    },
    { 
      name: 'JSPreprocessor file exists', 
      test: () => fs.access('./server/services/js-preprocessor.ts'),
      critical: true 
    },
    { 
      name: 'DocumentationPackager file exists', 
      test: () => fs.access('./server/services/documentation-packager.ts'),
      critical: false 
    },
    { 
      name: 'Routes file exists', 
      test: () => fs.access('./server/routes.ts'),
      critical: true 
    },
    { 
      name: 'Server index exists', 
      test: () => fs.access('./server/index.ts'),
      critical: true 
    },
    { 
      name: 'Package.json exists', 
      test: () => fs.access('./package.json'),
      critical: true 
    }
  ];
  
  let criticalFailures = 0;
  
  for (const test of tests) {
    try {
      await test.test();
      console.log(`  ✅ ${test.name}`);
    } catch (error) {
      const status = test.critical ? '❌' : '⚠️';
      console.log(`  ${status} ${test.name}: ${error.message}`);
      if (test.critical) criticalFailures++;
    }
  }
  
  if (criticalFailures > 0) {
    console.log(`\n⚠️ ${criticalFailures} test(s) critique(s) échoué(s)`);
  }
  
  return criticalFailures === 0;
}

async function emergencyRepair() {
  const fs = require('fs').promises;
  
  console.log('🚨 Réparation d\'urgence en cours...');
  
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
      console.log(`📁 Dossier créé: ${dir}`);
    } catch (error) {
      console.log(`⚠️ Dossier ${dir}: ${error.message}`);
    }
  }
  
  // Vérifier package.json
  try {
    const packageData = await fs.readFile('package.json', 'utf-8');
    const pkg = JSON.parse(packageData);
    if (!pkg.scripts || !pkg.scripts.dev) {
      console.log('📦 package.json semble incomplet');
    }
  } catch (error) {
    console.log('❌ Problème avec package.json:', error.message);
  }
  
  console.log('✅ Réparation d\'urgence terminée');
}

if (require.main === module) {
  runCompleteSystemTest()
    .then(success => {
      console.log(`\n📊 Test terminé: ${success ? 'SUCCÈS' : 'ÉCHEC/RÉPARATIONS NÉCESSAIRES'}`);
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test système échoué complètement:', error);
      process.exit(1);
    });
}

module.exports = { runCompleteSystemTest };
