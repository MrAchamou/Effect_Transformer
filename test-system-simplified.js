
const fs = require('fs');
const path = require('path');

async function quickSystemCheck() {
  console.log('🚀 Test système rapide...\n');
  
  let errors = 0;
  
  // Vérifier les fichiers essentiels
  const essentialFiles = [
    'package.json',
    'server/index.ts',
    'client/src/App.tsx'
  ];
  
  for (const file of essentialFiles) {
    try {
      fs.accessSync(file);
      console.log(`✅ ${file}`);
    } catch (error) {
      console.log(`❌ ${file} - MANQUANT`);
      errors++;
    }
  }
  
  // Créer les dossiers manquants
  const dirs = ['uploads', 'outputs', 'server/config', 'server/services'];
  dirs.forEach(dir => {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 ${dir} - OK`);
    } catch (error) {
      // Ignore si existe déjà
    }
  });
  
  if (errors === 0) {
    console.log('\n🎉 Système OK - Prêt pour le démarrage!');
    return true;
  } else {
    console.log(`\n⚠️ ${errors} problème(s) détecté(s)`);
    return false;
  }
}

// Exécution immédiate
quickSystemCheck()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  });
