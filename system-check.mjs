
import { promises as fs } from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { spawn } from 'child_process';

const require = createRequire(import.meta.url);

async function auditCompletSysteme() {
  console.log('🔍 === AUDIT SYSTÈME COMPLET ===\n');
  
  const problems = [];
  const repairs = [];

  // 1. Vérifier la configuration Node.js
  console.log('1️⃣ Vérification configuration Node.js...');
  try {
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf-8'));
    console.log(`✅ Type de module: ${packageJson.type || 'commonjs'}`);
    console.log(`✅ Scripts disponibles: ${Object.keys(packageJson.scripts).join(', ')}`);
  } catch (error) {
    problems.push('package.json inaccessible');
  }

  // 2. Vérifier les fichiers TypeScript critiques
  console.log('\n2️⃣ Vérification fichiers TypeScript...');
  const criticalTsFiles = [
    'server/index.ts',
    'server/routes.ts',
    'server/storage.ts',
    'tsconfig.json'
  ];

  for (const file of criticalTsFiles) {
    try {
      await fs.access(file);
      const content = await fs.readFile(file, 'utf-8');
      if (content.length < 50) {
        problems.push(`${file} semble incomplet`);
        console.log(`⚠️ ${file} - Trop court`);
      } else {
        console.log(`✅ ${file} - OK`);
      }
    } catch (error) {
      problems.push(`${file} manquant`);
      console.log(`❌ ${file} - MANQUANT`);
    }
  }

  // 3. Vérifier les services
  console.log('\n3️⃣ Vérification services...');
  try {
    const servicesDir = 'server/services';
    const services = await fs.readdir(servicesDir);
    const tsServices = services.filter(f => f.endsWith('.ts'));
    console.log(`✅ ${tsServices.length} services TypeScript trouvés`);
    
    for (const service of tsServices.slice(0, 3)) {
      const content = await fs.readFile(`${servicesDir}/${service}`, 'utf-8');
      if (content.includes('export') || content.includes('class')) {
        console.log(`✅ ${service} - Structure correcte`);
      } else {
        problems.push(`${service} mal structuré`);
      }
    }
  } catch (error) {
    problems.push('Dossier services inaccessible');
  }

  // 4. Test de compilation TypeScript
  console.log('\n4️⃣ Test compilation TypeScript...');
  try {
    await new Promise((resolve, reject) => {
      const tsc = spawn('npx', ['tsc', '--noEmit'], {
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      let output = '';
      tsc.stderr.on('data', (data) => output += data.toString());
      
      tsc.on('close', (code) => {
        if (code === 0) {
          console.log('✅ TypeScript compile sans erreur');
          resolve(code);
        } else {
          console.log('⚠️ Erreurs TypeScript détectées');
          problems.push('Erreurs de compilation TypeScript');
          resolve(code);
        }
      });
    });
  } catch (error) {
    problems.push('Impossible de tester TypeScript');
  }

  // 5. Créer les réparations automatiques
  console.log('\n5️⃣ Réparations automatiques...');
  
  // Créer les dossiers manquants
  const requiredDirs = [
    'uploads', 'outputs', 'outputs/temp', 
    'server/config', 'server/services', 'server/utils'
  ];
  
  for (const dir of requiredDirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
      repairs.push(`Dossier ${dir} créé`);
    } catch (error) {
      // Ignore si existe déjà
    }
  }

  // 6. Rapport final
  console.log('\n📋 === RAPPORT D\'AUDIT ===');
  console.log(`🚨 Problèmes détectés: ${problems.length}`);
  problems.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));
  
  console.log(`🔧 Réparations effectuées: ${repairs.length}`);
  repairs.forEach((r, i) => console.log(`  ${i + 1}. ${r}`));

  const status = problems.length === 0 ? 'PARFAIT' : 
               problems.length <= 2 ? 'ACCEPTABLE' : 'CRITIQUE';
  
  console.log(`\n🎯 STATUT SYSTÈME: ${status}`);
  
  return problems.length <= 2;
}

// Lancement immédiat
auditCompletSysteme()
  .then(success => {
    console.log(`\n🏁 Audit terminé: ${success ? 'SUCCÈS' : 'ATTENTION REQUISE'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Erreur critique:', error.message);
    process.exit(1);
  });
