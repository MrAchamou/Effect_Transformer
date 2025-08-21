#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CommonJSToESMConverter {
    constructor(options = {}) {
        this.options = {
            sourceDir: options.sourceDir || './src',
            outputDir: options.outputDir || './src-esm',
            backupDir: options.backupDir || './backup',
            fileExtensions: options.fileExtensions || ['.js', '.mjs'],
            createBackup: options.createBackup !== false,
            updatePackageJson: options.updatePackageJson !== false,
            ...options
        };
        
        this.conversionRules = [
            // require() vers import
            {
                pattern: /const\s+(\w+)\s*=\s*require\(['"`]([^'"`]+)['"`]\)/g,
                replacement: "import $1 from '$2';"
            },
            {
                pattern: /const\s+\{([^}]+)\}\s*=\s*require\(['"`]([^'"`]+)['"`]\)/g,
                replacement: "import { $1 } from '$2';"
            },
            {
                pattern: /const\s+(\w+)\s*=\s*require\(['"`]([^'"`]+)['"`]\)\.(\w+)/g,
                replacement: "import { $3 as $1 } from '$2';"
            },
            
            // module.exports vers export
            {
                pattern: /module\.exports\s*=\s*\{([^}]*)\}/gs,
                replacement: "export { $1 };"
            },
            {
                pattern: /module\.exports\s*=\s*([^;\n]+)/g,
                replacement: "export default $1;"
            },
            {
                pattern: /exports\.(\w+)\s*=\s*([^;\n]+)/g,
                replacement: "export const $1 = $2;"
            },
            
            // __dirname et __filename pour ES modules
            {
                pattern: /__dirname/g,
                replacement: "path.dirname(fileURLToPath(import.meta.url))"
            },
            {
                pattern: /__filename/g,
                replacement: "fileURLToPath(import.meta.url)"
            }
        ];
        
        this.requiredImports = new Set();
    }

    async convertFile(filePath) {
        try {
            let content = await fs.readFile(filePath, 'utf-8');
            let hasChanges = false;
            
            // Vérifier si le fichier utilise __dirname ou __filename
            if (content.includes('__dirname') || content.includes('__filename')) {
                this.requiredImports.add("import { fileURLToPath } from 'url';");
                this.requiredImports.add("import path from 'path';");
            }
            
            // Appliquer les règles de conversion
            for (const rule of this.conversionRules) {
                const originalContent = content;
                content = content.replace(rule.pattern, rule.replacement);
                if (content !== originalContent) {
                    hasChanges = true;
                }
            }
            
            // Ajouter les imports nécessaires au début du fichier
            if (this.requiredImports.size > 0 && hasChanges) {
                const imports = Array.from(this.requiredImports).join('\n');
                content = `${imports}\n\n${content}`;
            }
            
            // Nettoyer les lignes vides multiples
            content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
            
            return { content, hasChanges };
        } catch (error) {
            console.error(`Erreur lors de la conversion de ${filePath}:`, error.message);
            return { content: null, hasChanges: false };
        }
    }

    async processDirectory(sourceDir, outputDir) {
        try {
            const entries = await fs.readdir(sourceDir, { withFileTypes: true });
            
            for (const entry of entries) {
                const sourcePath = path.join(sourceDir, entry.name);
                const outputPath = path.join(outputDir, entry.name);
                
                if (entry.isDirectory()) {
                    // Créer le répertoire de sortie
                    await fs.mkdir(outputPath, { recursive: true });
                    // Traitement récursif
                    await this.processDirectory(sourcePath, outputPath);
                } else if (this.shouldProcessFile(entry.name)) {
                    const { content, hasChanges } = await this.convertFile(sourcePath);
                    
                    if (content && hasChanges) {
                        await fs.writeFile(outputPath, content, 'utf-8');
                        console.log(`✅ Converti: ${sourcePath} → ${outputPath}`);
                    } else {
                        // Copier le fichier sans modification
                        await fs.copyFile(sourcePath, outputPath);
                        console.log(`📄 Copié: ${sourcePath} → ${outputPath}`);
                    }
                }
            }
        } catch (error) {
            console.error(`Erreur lors du traitement du répertoire ${sourceDir}:`, error.message);
        }
    }

    shouldProcessFile(filename) {
        return this.options.fileExtensions.some(ext => filename.endsWith(ext));
    }

    async createBackup() {
        if (!this.options.createBackup) return;
        
        try {
            await fs.mkdir(this.options.backupDir, { recursive: true });
            await this.copyDirectory(this.options.sourceDir, this.options.backupDir);
            console.log(`🔒 Sauvegarde créée dans: ${this.options.backupDir}`);
        } catch (error) {
            console.error('Erreur lors de la création de la sauvegarde:', error.message);
        }
    }

    async copyDirectory(src, dest) {
        const entries = await fs.readdir(src, { withFileTypes: true });
        
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            
            if (entry.isDirectory()) {
                await fs.mkdir(destPath, { recursive: true });
                await this.copyDirectory(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    }

    async updatePackageJson() {
        if (!this.options.updatePackageJson) return;
        
        try {
            const packagePath = path.join(process.cwd(), 'package.json');
            const packageContent = await fs.readFile(packagePath, 'utf-8');
            const packageJson = JSON.parse(packageContent);
            
            // Ajouter "type": "module"
            packageJson.type = "module";
            
            // Mettre à jour les scripts si nécessaire
            if (packageJson.scripts) {
                Object.keys(packageJson.scripts).forEach(key => {
                    if (packageJson.scripts[key].includes('node ')) {
                        packageJson.scripts[key] = packageJson.scripts[key].replace(/\.js\b/g, '.mjs');
                    }
                });
            }
            
            await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
            console.log('📦 package.json mis à jour avec "type": "module"');
        } catch (error) {
            console.error('Erreur lors de la mise à jour de package.json:', error.message);
        }
    }

    async convert() {
        console.log('🚀 Début de la conversion CommonJS → ES Modules\n');
        
        try {
            // Créer une sauvegarde
            await this.createBackup();
            
            // Créer le répertoire de sortie
            await fs.mkdir(this.options.outputDir, { recursive: true });
            
            // Convertir tous les fichiers
            await this.processDirectory(this.options.sourceDir, this.options.outputDir);
            
            // Mettre à jour package.json
            await this.updatePackageJson();
            
            console.log('\n✨ Conversion terminée avec succès !');
            console.log(`📁 Fichiers convertis dans: ${this.options.outputDir}`);
            if (this.options.createBackup) {
                console.log(`🔒 Sauvegarde dans: ${this.options.backupDir}`);
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de la conversion:', error.message);
        }
    }
}

// Utilisation du module
export default CommonJSToESMConverter;

// Exécution directe si appelé depuis la ligne de commande
if (import.meta.url === `file://${process.argv[1]}`) {
    const converter = new CommonJSToESMConverter({
        sourceDir: process.argv[2] || './src',
        outputDir: process.argv[3] || './src-esm',
        createBackup: true,
        updatePackageJson: true
    });
    
    await converter.convert();
}