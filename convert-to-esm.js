
import CommonJSToESMConverter from './commonjs-to-esm-converter.js';

async function convertProject() {
    console.log('🔄 === CONVERSION COMPLÈTE VERS ES MODULES ===\n');
    
    const converter = new CommonJSToESMConverter({
        sourceDir: './server',
        outputDir: './server',
        backupDir: './backup-cjs',
        createBackup: true,
        fileExtensions: ['.js', '.mjs']
    });

    await converter.convert();
    
    console.log('\n🎯 Conversion terminée ! Votre projet est maintenant entièrement en ES modules.');
}

export async function convertSingleModule(modulePath) {
    const converter = new CommonJSToESMConverter();
    const result = await converter.convertFile(modulePath);
    
    if (result.hasChanges) {
        console.log(`✅ Module ${modulePath} converti avec succès`);
        return result.content;
    } else {
        console.log(`📄 Module ${modulePath} déjà en ES`);
        return null;
    }
}

// Auto-exécution si lancé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    convertProject().catch(console.error);
}
