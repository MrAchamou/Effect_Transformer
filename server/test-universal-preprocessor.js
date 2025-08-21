
const { UniversalPreprocessor } = require('./services/universal-preprocessor');

// Test avec le fichier smoke-simulation
const testCode = `// smoke-simulation.js

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

  category: "vidéo",
};

class SmokeSimulationEffect extends BaseEffect {
    constructor(config = {}) {
        super({
            id: 'video-smoke-simulation-particles-055',
            name: 'Simulation Fumée Particules Réaliste',
            category: 'vidéo'
        });
    }

    update(deltaTime) {
        // Code d'animation
    }
}`;

async function testUniversalPreprocessor() {
  const preprocessor = new UniversalPreprocessor();
  
  console.log('🧪 Test du module universel de preprocessing...\n');
  
  const result = await preprocessor.preprocessEffect(testCode, 'smoke-simulation.js');
  
  console.log('✅ Résultat du preprocessing :');
  console.log('- Valide :', result.isValid);
  console.log('- Changements :', result.changes);
  console.log('- Métadonnées extraites :', result.metadata);
  console.log('\n📄 Code nettoyé (extrait) :');
  console.log(result.cleanCode.substring(0, 500) + '...');
}

testUniversalPreprocessor().catch(console.error);
