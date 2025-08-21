
const SystemDiagnostics = require('./server/diagnostics.js');
const SystemRepair = require('./server/system-repair.js');

async function runCompleteSystemTest() {
  console.log('🎯 === TEST SYSTÈME COMPLET ===\n');
  
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
}

function hasIssues(diagnosticResult) {
  // Vérifier s'il y a des problèmes critiques
  return Object.values(diagnosticResult.files).some(f => f.critical) ||
         Object.values(diagnosticResult.services).some(s => s.critical) ||
         Object.values(diagnosticResult.config).some(c => c.needsRepair) ||
         !diagnosticResult.ports.port5000.free;
}

async function testFunctionality() {
  const tests = [
    { name: 'Import UniversalPreprocessor', test: () => import('./server/services/universal-preprocessor.js') },
    { name: 'Import JSPreprocessor', test: () => import('./server/services/js-preprocessor.js') },
    { name: 'Import DocumentationPackager', test: () => import('./server/services/documentation-packager.js') }
  ];
  
  for (const test of tests) {
    try {
      await test.test();
      console.log(`  ✅ ${test.name}`);
    } catch (error) {
      console.log(`  ❌ ${test.name}: ${error.message}`);
    }
  }
}

if (require.main === module) {
  runCompleteSystemTest()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('❌ Test système échoué:', error);
      process.exit(1);
    });
}

module.exports = { runCompleteSystemTest };
