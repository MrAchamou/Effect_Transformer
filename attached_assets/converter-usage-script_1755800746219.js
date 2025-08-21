// convert-to-esm.js
import CommonJSToESMConverter from './commonjs-to-esm-converter.js';

async function convertProject() {
    // Configuration pour votre projet
    const converter = new CommonJSToESMConverter({
        sourceDir: './src',           // Répertoire source
        outputDir: './src',           // Même répertoire (remplace les fichiers)
        backupDir: './backup-cjs',    // Sauvegarde des anciens fichiers
        createBackup: true,           // Créer une sauvegarde
        updatePackageJson: true,      // Mettre à jour package.json
        fileExtensions: ['.js', '.mjs'] // Extensions à traiter
    });

    await converter.convert();
}

// Exécuter la conversion
convertProject().catch(console.error);

// Ou pour convertir module par module :
export async function convertSingleModule(modulePath) {
    const converter = new CommonJSToESMConverter();
    const result = await converter.convertFile(modulePath);
    
    if (result.hasChanges) {
        console.log(`Module ${modulePath} converti avec succès`);
        return result.content;
    } else {
        console.log(`Aucune conversion nécessaire pour ${modulePath}`);
        return null;
    }
}