
import fs from 'fs';
import { execSync } from 'child_process';

console.log('🚨 === DIAGNOSTIC D\'URGENCE ===\n');

try {
  // Test basique du système
  console.log('📋 État du système:');
  console.log(`  Node.js: ${process.version}`);
  console.log(`  Mémoire: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
  console.log(`  Plateforme: ${process.platform}`);
  
  // Vérifier les fichiers essentiels
  console.log('\n📁 Fichiers essentiels:');
  const files = [
    'package.json',
    'tsconfig.json', 
    'server/index.ts',
    'server/routes.ts'
  ];
  
  for (const file of files) {
    try {
      fs.accessSync(file);
      const size = fs.statSync(file).size;
      console.log(`  ✅ ${file} (${size} bytes)`);
    } catch {
      console.log(`  ❌ ${file} - MANQUANT`);
    }
  }
  
  // Vérifier TypeScript
  console.log('\n🔧 Test TypeScript:');
  try {
    execSync('npx tsc --version', { stdio: 'pipe' });
    console.log('  ✅ TypeScript disponible');
  } catch {
    console.log('  ❌ TypeScript indisponible');
  }
  
  // Tester les dépendances
  console.log('\n📦 Dépendances:');
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    console.log(`  📋 ${Object.keys(pkg.dependencies || {}).length} dépendances`);
    console.log(`  🔧 ${Object.keys(pkg.devDependencies || {}).length} dev dépendances`);
  } catch {
    console.log('  ❌ package.json illisible');
  }
  
  console.log('\n🎯 DIAGNOSTIC TERMINÉ');
  
} catch (error) {
  console.error('💥 Erreur critique:', error.message);
}
