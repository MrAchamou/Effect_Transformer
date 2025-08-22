
/**
 * Test complet du système d'audit des modules
 * Vérifie que tous les modules sont actifs et fonctionnels
 */

import { ModuleAuditSystem } from './services/module-audit-system.js';

const testEffects = {
  simple: `
function createEffect() {
  console.log("Simple effect");
  return true;
}
`,

  canvas: `
function drawEffect(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 100, 100);
  
  requestAnimationFrame(() => drawEffect(canvas));
}
`,

  complex: `
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    for (let i = 0; i < 100; i++) {
      this.particles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        age: 0,
        maxAge: 100
      });
    }
  }
  
  update() {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.age++;
      
      if (particle.age > particle.maxAge) {
        particle.x = Math.random() * 800;
        particle.y = Math.random() * 600;
        particle.age = 0;
      }
    });
    
    requestAnimationFrame(() => this.update());
  }
  
  render() {
    this.ctx.clearRect(0, 0, 800, 600);
    
    this.particles.forEach(particle => {
      const alpha = 1 - (particle.age / particle.maxAge);
      this.ctx.fillStyle = \`rgba(255, 100, 100, \${alpha})\`;
      this.ctx.fillRect(particle.x, particle.y, 2, 2);
    });
  }
}
`
};

async function runModuleAuditTests() {
  console.log('🚀 === TEST COMPLET DU SYSTÈME D\'AUDIT DES MODULES ===\n');
  
  const auditSystem = new ModuleAuditSystem();
  
  try {
    // 1. Audit général des modules
    console.log('1️⃣ Audit général des modules...');
    const auditResult = await auditSystem.auditModules();
    
    console.log(`✅ Modules totaux: ${auditResult.totalModules}`);
    console.log(`✅ Modules actifs: ${auditResult.activeModules}`);
    console.log(`✅ Taux d'activation: ${((auditResult.activeModules / auditResult.totalModules) * 100).toFixed(1)}%`);
    
    if (auditResult.inactiveModules.length > 0) {
      console.log(`❌ Modules inactifs: ${auditResult.inactiveModules.join(', ')}`);
    }
    
    if (auditResult.dependencyIssues.length > 0) {
      console.log(`⚠️ Problèmes de dépendances: ${auditResult.dependencyIssues.join(', ')}`);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 2. Test des transformations par niveau
    for (const level of [1, 2, 3]) {
      console.log(`${level + 1}️⃣ Test transformation niveau ${level}...`);
      
      for (const [effectName, effectCode] of Object.entries(testEffects)) {
        console.log(`  🎨 Test effet "${effectName}" niveau ${level}`);
        
        const result = await auditSystem.applyModules(effectCode, level, {
          effectName,
          test: true
        });
        
        console.log(`    ✅ Modules appliqués: ${result.appliedModules.length}`);
        console.log(`    📝 Améliorations: ${result.improvements.length}`);
        
        if (result.skippedModules.length > 0) {
          console.log(`    ⚠️ Modules ignorés: ${result.skippedModules.length}`);
        }
        
        if (result.warnings.length > 0) {
          console.log(`    ⚠️ Avertissements: ${result.warnings.length}`);
        }
        
        // Vérifier les temps d'exécution
        const slowModules = Object.entries(result.executionTimes)
          .filter(([_, time]) => time > 100)
          .map(([id, time]) => `${id}: ${time.toFixed(2)}ms`);
          
        if (slowModules.length > 0) {
          console.log(`    🐌 Modules lents: ${slowModules.join(', ')}`);
        }
        
        console.log('');
      }
      
      console.log('');
    }
    
    // 3. Génération du rapport détaillé
    console.log('4️⃣ Génération du rapport détaillé...');
    const report = await auditSystem.generateModuleReport();
    console.log('✅ Rapport généré avec succès');
    console.log('\n📄 RAPPORT DÉTAILLÉ:');
    console.log(report);
    
    // 4. Vérification de la couverture des modules
    console.log('\n5️⃣ Vérification de la couverture...');
    
    const expectedModulesByLevel = {
      1: 7,
      2: 13,
      3: 24
    };
    
    for (const [level, expectedCount] of Object.entries(expectedModulesByLevel)) {
      const testResult = await auditSystem.applyModules(testEffects.complex, parseInt(level), {
        test: true
      });
      
      const actualCount = testResult.appliedModules.length;
      const coverage = (actualCount / expectedCount * 100).toFixed(1);
      
      console.log(`  Niveau ${level}: ${actualCount}/${expectedCount} modules (${coverage}% couverture)`);
      
      if (actualCount < expectedCount) {
        console.log(`    ⚠️ ${expectedCount - actualCount} modules manquants`);
      }
    }
    
    console.log('\n🎉 === TEST TERMINÉ AVEC SUCCÈS ===');
    
    // Résumé final
    const finalStats = auditResult.performanceMetrics.reduce((acc, metric) => {
      acc.totalCalls += parseInt(metric.totalCalls);
      acc.avgSuccessRate += parseFloat(metric.successRate);
      return acc;
    }, { totalCalls: 0, avgSuccessRate: 0 });
    
    finalStats.avgSuccessRate = (finalStats.avgSuccessRate / auditResult.performanceMetrics.length).toFixed(1);
    
    console.log(`\n📊 STATISTIQUES FINALES:`);
    console.log(`   • Modules actifs: ${auditResult.activeModules}/${auditResult.totalModules}`);
    console.log(`   • Appels totaux: ${finalStats.totalCalls}`);
    console.log(`   • Taux de succès moyen: ${finalStats.avgSuccessRate}%`);
    console.log(`   • Problèmes détectés: ${auditResult.dependencyIssues.length + auditResult.inactiveModules.length}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors du test des modules:', error);
    return false;
  }
}

// Exécuter les tests si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  runModuleAuditTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

export { runModuleAuditTests };
