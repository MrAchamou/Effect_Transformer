
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ESMVerifier {
    constructor() {
        this.results = {
            converted: [],
            alreadyES: [],
            needsWork: [],
            errors: []
        };
    }

    async verifyDirectory(dirPath) {
        try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);
                
                if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                    await this.verifyDirectory(fullPath);
                } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.mjs') || entry.name.endsWith('.ts'))) {
                    await this.verifyFile(fullPath);
                }
            }
        } catch (error) {
            this.results.errors.push(`Erreur lecture ${dirPath}: ${error.message}`);
        }
    }

    async verifyFile(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const hasRequire = content.includes('require(');
            const hasModuleExports = content.includes('module.exports');
            const hasExports = content.includes('exports.');
            const hasImport = content.includes('import ');
            const hasExport = content.includes('export ');

            if (hasRequire || hasModuleExports || hasExports) {
                if (hasImport || hasExport) {
                    this.results.needsWork.push(`${filePath} (mixte CommonJS/ES)`);
                } else {
                    this.results.needsWork.push(`${filePath} (CommonJS pur)`);
                }
            } else if (hasImport || hasExport) {
                this.results.alreadyES.push(filePath);
            } else {
                // Fichier sans imports/exports significatifs
                this.results.converted.push(`${filePath} (neutre)`);
            }
        } catch (error) {
            this.results.errors.push(`Erreur lecture ${filePath}: ${error.message}`);
        }
    }

    async runVerification() {
        console.log('🔍 === VÉRIFICATION CONVERSION ES MODULES ===\n');
        
        const dirsToCheck = ['server', 'client/src', '.'];
        
        for (const dir of dirsToCheck) {
            try {
                await fs.access(dir);
                await this.verifyDirectory(dir);
            } catch (error) {
                console.log(`⚠️ Répertoire ${dir} non accessible`);
            }
        }
        
        this.displayResults();
    }

    displayResults() {
        console.log('📊 === RÉSULTATS VÉRIFICATION ===');
        console.log(`✅ Fichiers ES modules: ${this.results.alreadyES.length}`);
        console.log(`🔄 Fichiers convertis/neutres: ${this.results.converted.length}`);
        console.log(`⚠️ Fichiers à retravailler: ${this.results.needsWork.length}`);
        console.log(`❌ Erreurs: ${this.results.errors.length}`);
        
        if (this.results.needsWork.length > 0) {
            console.log('\n⚠️ FICHIERS À RETRAVAILLER:');
            this.results.needsWork.forEach(file => console.log(`  - ${file}`));
        }
        
        if (this.results.errors.length > 0) {
            console.log('\n❌ ERREURS:');
            this.results.errors.forEach(error => console.log(`  - ${error}`));
        }
        
        console.log('\n🎯 Vérification terminée !');
        
        if (this.results.needsWork.length === 0) {
            console.log('🎉 Tous vos modules sont maintenant en ES modules !');
        } else {
            console.log(`📝 ${this.results.needsWork.length} fichier(s) nécessitent encore une conversion manuelle.`);
        }
    }
}

// Auto-exécution
const verifier = new ESMVerifier();
await verifier.runVerification();
