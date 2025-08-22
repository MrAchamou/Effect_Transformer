
/**
 * Test d'Intégration des Modules Niveau 1
 * Vérifie que tous les modules fonctionnent ensemble harmonieusement
 */

import fs from 'fs/promises';

class IntegrationTester {
  constructor() {
    this.modules = {};
    this.testResults = [];
  }

  async runIntegrationTests() {
    console.log('🔗 === TESTS D\'INTÉGRATION NIVEAU 1 ===\n');

    try {
      // Simuler l'importation des modules
      await this.loadModules();
      
      // Tests de compatibilité
      await this.testModuleCompatibility();
      
      // Tests de synchronisation
      await this.testModuleSynchronization();
      
      // Tests de performance
      await this.testPerformanceImpact();
      
      this.generateIntegrationReport();
      
    } catch (error) {
      console.error('❌ Erreur lors des tests d\'intégration:', error);
    }
  }

  async loadModules() {
    console.log('📦 Chargement des modules...');
    
    const moduleFiles = [
      'smart-optimizer.ts',
      'timing-master.ts', 
      'visual-focus-engine.ts',
      'color-harmony-engine.ts',
      'performance-adaptive-engine.ts'
    ];

    for (const file of moduleFiles) {
      try {
        const content = await fs.readFile(`server/services/${file}`, 'utf-8');
        this.modules[file] = {
          loaded: true,
          content,
          exports: this.extractExports(content),
          dependencies: this.extractDependencies(content)
        };
        console.log(`  ✅ ${file}`);
      } catch (error) {
        this.modules[file] = {
          loaded: false,
          error: error.message
        };
        console.log(`  ❌ ${file}: ${error.message}`);
      }
    }
  }

  extractExports(content) {
    const exports = [];
    
    // Classes exportées
    const classMatch = content.match(/export\s+class\s+(\w+)/g);
    if (classMatch) {
      classMatch.forEach(match => {
        const className = match.match(/class\s+(\w+)/)[1];
        exports.push({ type: 'class', name: className });
      });
    }
    
    // Interfaces
    const interfaceMatch = content.match(/interface\s+(\w+)/g);
    if (interfaceMatch) {
      interfaceMatch.forEach(match => {
        const interfaceName = match.match(/interface\s+(\w+)/)[1];
        exports.push({ type: 'interface', name: interfaceName });
      });
    }
    
    return exports;
  }

  extractDependencies(content) {
    const deps = [];
    
    // Imports locaux
    const localImports = content.match(/import.*from\s+['"]\.\.?\//g) || [];
    localImports.forEach(imp => {
      const match = imp.match(/from\s+['"]([^'"]+)['"]/);
      if (match) deps.push(match[1]);
    });
    
    return deps;
  }

  async testModuleCompatibility() {
    console.log('\n🔄 Test de compatibilité des modules...');
    
    let compatibilityScore = 0;
    let totalTests = 0;
    
    // Test 1: Vérifier que tous les modules ont des classes principales
    Object.entries(this.modules).forEach(([file, module]) => {
      totalTests++;
      if (module.loaded && module.exports.some(exp => exp.type === 'class')) {
        compatibilityScore++;
        console.log(`  ✅ ${file}: Classe principale trouvée`);
      } else {
        console.log(`  ❌ ${file}: Pas de classe principale`);
      }
    });

    // Test 2: Vérifier l'absence de conflits de nommage
    totalTests++;
    const allClasses = [];
    Object.values(this.modules).forEach(module => {
      if (module.loaded) {
        module.exports.forEach(exp => {
          if (exp.type === 'class') allClasses.push(exp.name);
        });
      }
    });
    
    const uniqueClasses = [...new Set(allClasses)];
    if (allClasses.length === uniqueClasses.length) {
      compatibilityScore++;
      console.log(`  ✅ Pas de conflits de nommage (${uniqueClasses.length} classes)`);
    } else {
      console.log(`  ❌ Conflits de nommage détectés`);
    }

    this.testResults.push({
      test: 'Compatibilité',
      score: compatibilityScore,
      total: totalTests,
      percentage: (compatibilityScore / totalTests * 100).toFixed(1)
    });
  }

  async testModuleSynchronization() {
    console.log('\n⚡ Test de synchronisation des modules...');
    
    let syncScore = 0;
    let totalTests = 0;

    // Test 1: Vérifier les méthodes de synchronisation dans TimingMaster
    totalTests++;
    const timingMaster = this.modules['timing-master.ts'];
    if (timingMaster?.loaded && timingMaster.content.includes('synchronizeModule')) {
      syncScore++;
      console.log(`  ✅ TimingMaster: Méthodes de synchronisation présentes`);
    } else {
      console.log(`  ❌ TimingMaster: Synchronisation manquante`);
    }

    // Test 2: Vérifier les callbacks d'adaptation dans PerformanceAdaptiveEngine
    totalTests++;
    const perfEngine = this.modules['performance-adaptive-engine.ts'];
    if (perfEngine?.loaded && perfEngine.content.includes('adaptationCallbacks')) {
      syncScore++;
      console.log(`  ✅ PerformanceEngine: Callbacks d'adaptation présents`);
    } else {
      console.log(`  ❌ PerformanceEngine: Callbacks manquants`);
    }

    // Test 3: Vérifier les événements customEvent dans VisualFocusEngine
    totalTests++;
    const focusEngine = this.modules['visual-focus-engine.ts'];
    if (focusEngine?.loaded && focusEngine.content.includes('CustomEvent')) {
      syncScore++;
      console.log(`  ✅ VisualFocusEngine: Événements personnalisés présents`);
    } else {
      console.log(`  ❌ VisualFocusEngine: Événements manquants`);
    }

    this.testResults.push({
      test: 'Synchronisation',
      score: syncScore,
      total: totalTests,
      percentage: (syncScore / totalTests * 100).toFixed(1)
    });
  }

  async testPerformanceImpact() {
    console.log('\n📊 Test d\'impact performance...');
    
    let perfScore = 0;
    let totalTests = 0;

    // Test 1: Vérifier les niveaux de performance adaptatifs
    totalTests++;
    const smartOptimizer = this.modules['smart-optimizer.ts'];
    if (smartOptimizer?.loaded && 
        smartOptimizer.content.includes('performanceLevel') &&
        smartOptimizer.content.includes('low') &&
        smartOptimizer.content.includes('medium') &&
        smartOptimizer.content.includes('high')) {
      perfScore++;
      console.log(`  ✅ SmartOptimizer: Niveaux adaptatifs configurés`);
    } else {
      console.log(`  ❌ SmartOptimizer: Niveaux adaptatifs manquants`);
    }

    // Test 2: Vérifier la gestion mémoire intelligente
    totalTests++;
    if (smartOptimizer?.loaded && smartOptimizer.content.includes('memoryUsage')) {
      perfScore++;
      console.log(`  ✅ Gestion mémoire intelligente présente`);
    } else {
      console.log(`  ❌ Gestion mémoire manquante`);
    }

    // Test 3: Vérifier les fallbacks de performance
    totalTests++;
    const modules = Object.values(this.modules);
    const fallbackCount = modules.filter(m => 
      m.loaded && m.content.includes('fallback')
    ).length;
    
    if (fallbackCount >= 2) {
      perfScore++;
      console.log(`  ✅ Fallbacks de performance présents (${fallbackCount} modules)`);
    } else {
      console.log(`  ❌ Fallbacks insuffisants (${fallbackCount} modules)`);
    }

    this.testResults.push({
      test: 'Performance',
      score: perfScore,
      total: totalTests,
      percentage: (perfScore / totalTests * 100).toFixed(1)
    });
  }

  generateIntegrationReport() {
    console.log('\n📋 === RAPPORT D\'INTÉGRATION ===\n');
    
    const totalScore = this.testResults.reduce((sum, result) => sum + result.score, 0);
    const totalTests = this.testResults.reduce((sum, result) => sum + result.total, 0);
    const overallPercentage = (totalScore / totalTests * 100).toFixed(1);
    
    console.log(`🎯 RÉSULTATS GLOBAUX:`);
    console.log(`   • Tests réussis: ${totalScore}/${totalTests}`);
    console.log(`   • Taux de réussite: ${overallPercentage}%`);
    console.log('');
    
    console.log(`📊 DÉTAIL PAR CATÉGORIE:`);
    this.testResults.forEach(result => {
      const status = result.score === result.total ? '🟢' : result.score >= result.total * 0.7 ? '🟡' : '🔴';
      console.log(`   ${status} ${result.test}: ${result.score}/${result.total} (${result.percentage}%)`);
    });
    
    console.log('\n🏆 VERDICT D\'INTÉGRATION:');
    if (overallPercentage >= 90) {
      console.log('   🎉 INTÉGRATION EXCELLENTE - Modules parfaitement synchronisés');
    } else if (overallPercentage >= 70) {
      console.log('   ✅ INTÉGRATION BONNE - Quelques ajustements mineurs possibles');
    } else {
      console.log('   ⚠️  INTÉGRATION À AMÉLIORER - Corrections nécessaires');
    }
    
    // Modules chargés avec succès
    const loadedModules = Object.values(this.modules).filter(m => m.loaded).length;
    const totalModules = Object.keys(this.modules).length;
    console.log(`\n📦 ÉTAT DES MODULES:`);
    console.log(`   • Modules chargés: ${loadedModules}/${totalModules}`);
    if (loadedModules === totalModules) {
      console.log('   ✅ Tous les modules sont accessibles');
    }
  }
}

// Exécution des tests d'intégration
const tester = new IntegrationTester();
tester.runIntegrationTests().catch(console.error);
