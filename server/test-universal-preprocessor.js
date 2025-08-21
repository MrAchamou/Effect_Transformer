
const { UniversalPreprocessor } = require('./services/universal-preprocessor.ts');

async function testUniversalPreprocessor() {
  console.log('🔄 Test du Universal Preprocessor...\n');
  
  const processor = new UniversalPreprocessor();
  
  // Test avec code d'effet de fumée
  const testCode = `
// smoke-simulation.js

export const smokeSimulationEffect = {
  id: "video-smoke-simulation-particles-055",
  name: "Simulation Fumée Particules Réaliste",
  
  description: \`## 💨 EFFET 55 : SMOKE_SIMULATION

**CATÉGORIE :** VIDÉO
**EFFET DEMANDÉ :** Smoke_Simulation
**ID UNIQUE :** video-smoke-simulation-particles-055
**NOM AFFICHAGE :** Simulation Fumée Particules Réaliste

**DESCRIPTION :** Une simulation réaliste de fumée est ajoutée à la vidéo.
\`,

  // Code JavaScript de l'effet
  initialize: function(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.options = { ...this.defaultOptions, ...options };
    this.setupSimulation();
  },
  
  defaultOptions: {
    particleCount: 500,
    temperature: 300,
    density: 1.0,
    windSpeed: 0.5
  },
  
  setupSimulation: function() {
    console.log('Configuration de la simulation de fumée');
    this.initializeParticles();
  },
  
  initializeParticles: function() {
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        life: 1.0
      });
    }
  },
  
  start: function() {
    this.animate();
  },
  
  animate: function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateParticles();
    this.renderParticles();
    requestAnimationFrame(() => this.animate());
  },
  
  updateParticles: function() {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.01;
      particle.opacity *= 0.99;
    });
  },
  
  renderParticles: function() {
    this.particles.forEach(particle => {
      if (particle.life > 0) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = '#666';
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    });
  }
};
`;

  try {
    console.log('📝 Code original:');
    console.log(testCode.substring(0, 200) + '...\n');
    
    const result = await processor.preprocessScript(testCode, {
      removeComments: true,
      extractJavaScript: true,
      standardizeFormat: true,
      validateSyntax: true
    });
    
    console.log('✅ Résultat du préprocessing:');
    console.log('- Code nettoyé:', result.cleanedCode ? '✓' : '✗');
    console.log('- JavaScript extrait:', result.extractedJavaScript ? '✓' : '✗');
    console.log('- Format standardisé:', result.standardizedCode ? '✓' : '✗');
    console.log('- Syntaxe validée:', result.isValidSyntax ? '✓' : '✗');
    console.log('- Modifications appliquées:', result.modifications.length);
    
    if (result.modifications.length > 0) {
      console.log('\n🔧 Modifications appliquées:');
      result.modifications.forEach((mod, index) => {
        console.log(`  ${index + 1}. ${mod}`);
      });
    }
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️  Avertissements:');
      result.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    }
    
    if (result.errors.length > 0) {
      console.log('\n❌ Erreurs:');
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    console.log('\n📊 Statistiques:');
    console.log(`- Lignes originales: ${testCode.split('\n').length}`);
    console.log(`- Lignes finales: ${result.finalCode.split('\n').length}`);
    console.log(`- Taille originale: ${testCode.length} chars`);
    console.log(`- Taille finale: ${result.finalCode.length} chars`);
    console.log(`- Réduction: ${((testCode.length - result.finalCode.length) / testCode.length * 100).toFixed(1)}%`);
    
    console.log('\n🎯 Code final (aperçu):');
    console.log(result.finalCode.substring(0, 300) + '...');
    
    console.log('\n✅ Test terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
  }
}

// Exécuter le test
if (require.main === module) {
  testUniversalPreprocessor().catch(console.error);
}

module.exports = { testUniversalPreprocessor };
