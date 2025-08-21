import fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';
import archiver from 'archiver';

export class DocumentationPackager {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'outputs');
  }

  async packageEffect(
    transformedCode: string,
    documentation: any,
    effectName: string,
    transformationId: string
  ): Promise<string> {
    try {
      // Validation des paramètres
      if (!transformedCode || typeof transformedCode !== 'string') {
        throw new Error('Code transformé invalide');
      }

      if (!documentation || typeof documentation !== 'object') {
        throw new Error('Documentation invalide');
      }

      if (!effectName || typeof effectName !== 'string') {
        effectName = `Effect_${Date.now()}`;
      }

      if (!transformationId || typeof transformationId !== 'string') {
        transformationId = `transformation_${Date.now()}`;
      }

      // Assurer que le répertoire de sortie existe
      await fs.mkdir(this.outputDir, { recursive: true });

      const sanitizedEffectName = this.sanitizeFileName(effectName);
      const timestamp = Date.now();
      const packageDir = path.join(this.outputDir, `${sanitizedEffectName}_${timestamp}`);

      // Créer le dossier du package avec gestion d'erreurs
      try {
        await fs.mkdir(this.outputDir, { recursive: true });
        await fs.mkdir(packageDir, { recursive: true });
      } catch (dirError) {
        throw new Error(`Impossible de créer le dossier: ${dirError.message}`);
      }

      // Sauvegarder tous les fichiers avec gestion d'erreurs
      await Promise.all([
        // Code JavaScript optimisé
        this.safeWriteFile(
          path.join(packageDir, `${sanitizedEffectName.toLowerCase()}.js`),
          transformedCode
        ),

        // Documentation Markdown
        this.safeWriteFile(
          path.join(packageDir, 'DOCUMENTATION.md'),
          documentation.markdown || 'Documentation non disponible'
        ),

        // Documentation HTML interactive
        this.safeWriteFile(
          path.join(packageDir, 'documentation.html'),
          documentation.html || this.generateExampleHTML(sanitizedEffectName)
        ),

        // README pour marketplace
        this.safeWriteFile(
          path.join(packageDir, 'README.md'),
          documentation.readme || `# ${sanitizedEffectName}\n\nEffet JavaScript optimisé`
        ),

        // Changelog
        this.safeWriteFile(
          path.join(packageDir, 'CHANGELOG.md'),
          documentation.changelog || '# Changelog\n\nVersion 1.0 - Première version'
        ),

        // Fichier d'exemple d'utilisation
        this.safeWriteFile(
          path.join(packageDir, 'example.html'),
          this.generateExampleHTML(sanitizedEffectName)
        ),

        // Informations de licence
        this.safeWriteFile(
          path.join(packageDir, 'LICENSE.txt'),
          this.generateLicense()
        ),

        // Guide d'installation
        this.safeWriteFile(
          path.join(packageDir, 'INSTALLATION.md'),
          this.generateInstallationGuide(sanitizedEffectName)
        )
      ]);

      // Créer une archive ZIP
      const zipPath = path.join(this.outputDir, `${effectName}_${timestamp}.zip`);
      await this.createZipArchive(packageDir, zipPath);

      return zipPath;
    } catch (error) {
      throw new Error(`Erreur lors de la création du package: ${error.message}`);
    }
  }

  private generateExampleHTML(effectName: string): string {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${effectName} - Exemple d'Utilisation</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #f0f0f0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        #effectCanvas {
            border: 2px solid #333;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        .controls {
            display: flex;
            gap: 10px;
            margin: 20px 0;
        }
        .btn {
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .btn:hover {
            background: #45a049;
        }
        .info {
            max-width: 600px;
            text-align: center;
            color: #666;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <h1>${effectName} - Exemple d'Utilisation</h1>

    <div class="info">
        <p>Cet exemple montre comment intégrer et utiliser l'effet ${effectName} dans votre projet.</p>
        <p>L'effet est optimisé par IA et compatible avec tous les navigateurs modernes.</p>
    </div>

    <canvas id="effectCanvas" width="800" height="600"></canvas>

    <div class="controls">
        <button class="btn" onclick="startEffect()">Démarrer</button>
        <button class="btn" onclick="pauseEffect()">Pause</button>
        <button class="btn" onclick="resetEffect()">Reset</button>
    </div>

    <!-- Inclure l'effet -->
    <script src="${effectName.toLowerCase()}.js"></script>

    <script>
        let effect = null;

        function startEffect() {
            if (!effect) {
                const canvas = document.getElementById('effectCanvas');
                effect = new ${effectName}({
                    responsive: true,
                    autoStart: false
                });
                effect.initialize(canvas);
            }
            effect.start();
        }

        function pauseEffect() {
            if (effect && effect.pause) {
                effect.pause();
            }
        }

        function resetEffect() {
            if (effect && effect.reset) {
                effect.reset();
            }
        }

        // Auto-démarrage optionnel
        // startEffect();
    </script>
</body>
</html>`;
  }

  private generateLicense(): string {
    return `LICENCE D'UTILISATION COMMERCIALE

Effet JavaScript Optimisé par IA
© ${new Date().getFullYear()} Visual Effects Transformer

DROITS ACCORDÉS:
✅ Usage commercial illimité
✅ Modification et personnalisation
✅ Intégration dans des projets clients
✅ Revente dans le cadre de projets
✅ Usage sur sites web commerciaux

RESTRICTIONS:
❌ Pas de redistribution du code source seul
❌ Pas de revente directe de l'effet isolé
❌ Pas de revendication de propriété intellectuelle

GARANTIE:
- Code testé et optimisé
- Compatibilité navigateurs garantie
- Support technique disponible

Pour plus d'informations, consultez la documentation complète.
`;
  }

  private generateInstallationGuide(effectName: string): string {
    return `# Guide d'Installation - ${effectName}

## 🚀 Installation Rapide (Recommandée)

### 1. Téléchargement
Téléchargez le package complet contenant tous les fichiers nécessaires.

### 2. Intégration HTML
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Mon Site avec ${effectName}</title>
</head>
<body>
    <canvas id="monEffet" width="800" height="600"></canvas>

    <!-- Inclure l'effet -->
    <script src="path/to/${effectName.toLowerCase()}.js"></script>

    <script>
        // Initialisation
        const effet = new ${effectName}();
        effet.initialize(document.getElementById('monEffet'));
        effet.start();
    </script>
</body>
</html>
\`\`\`

## 🔧 Installation Avancée

### Configuration Personnalisée
\`\`\`javascript
const effet = new ${effectName}({
    // Paramètres de performance
    performance: 'high',          // 'low', 'medium', 'high'

    // Adaptabilité
    responsive: true,             // Adaptation automatique
    autoStart: true,              // Démarrage automatique

    // Paramètres visuels
    quality: 'premium',           // 'standard', 'high', 'premium'

    // Événements
    onStart: () => console.log('Effet démarré'),
    onComplete: () => console.log('Animation terminée')
});
\`\`\`

### API Complète
\`\`\`javascript
// Contrôle de l'animation
effet.start();                   // Démarrer
effet.pause();                   // Mettre en pause  
effet.stop();                    // Arrêter
effet.reset();                   // Remettre à zéro

// Configuration dynamique
effet.updateConfig(newConfig);   // Mise à jour config
effet.setParameter(key, value);  // Paramètre spécifique

// Événements
effet.on('start', callback);     // Écouter démarrage
effet.on('complete', callback);  // Écouter fin
effet.on('error', callback);     // Écouter erreurs
\`\`\`

## 📱 Compatibilité

### Navigateurs Supportés
- ✅ Chrome 60+
- ✅ Firefox 55+  
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile Safari (iOS 12+)
- ✅ Chrome Mobile (Android 7+)

### Fonctionnalités Adaptives
- 🖥️ **Desktop**: Performance maximale
- 📱 **Mobile**: Optimisation automatique
- 🔄 **Responsive**: Adaptation écran automatique
- ⚡ **Performance**: Détection capacités appareil

## ❓ Dépannage

### Problèmes Courants

**L'effet ne s'affiche pas:**
- Vérifiez que le canvas existe dans le DOM
- Assurez-vous que le script est chargé après le DOM
- Vérifiez la console pour les erreurs

**Performance lente:**
- Réduisez les paramètres de qualité
- Utilisez \`performance: 'medium'\` ou \`'low'\`
- Vérifiez la taille du canvas

**Sur mobile:**
- Activez \`responsive: true\`
- Utilisez des tailles de canvas adaptées
- Testez sur vrais appareils

## 📞 Support

Pour toute question ou problème:
- Consultez la documentation complète
- Vérifiez les exemples inclus
- Contactez le support technique

---

*Installation et support par Visual Effects Transformer*`;
  }

  private async createZipArchive(sourceDir: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const output = createWriteStream(outputPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        // Timeout de sécurité
        const timeout = setTimeout(() => {
          reject(new Error('Timeout lors de la création de l\'archive'));
        }, 30000);

        output.on('close', () => {
          clearTimeout(timeout);
          console.log(`Archive créée: ${archive.pointer()} bytes`);
          resolve();
        });

        output.on('error', (err) => {
          clearTimeout(timeout);
          reject(new Error(`Erreur d'écriture: ${err.message}`));
        });

        archive.on('error', (err) => {
          clearTimeout(timeout);
          reject(new Error(`Erreur d'archivage: ${err.message}`));
        });

        archive.on('warning', (err) => {
          console.warn('Archive warning:', err);
        });

        archive.pipe(output);
        archive.directory(sourceDir, false);
        archive.finalize();

      } catch (error) {
        reject(new Error(`Erreur lors de la création de l'archive: ${error.message}`));
      }
    });
  }

  private sanitizeFileName(filename: string): string {
    // Nettoyer le nom de fichier pour éviter les problèmes de sécurité
    return filename
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .replace(/__+/g, '_')
      .substring(0, 50)
      .trim();
  }

  private async safeWriteFile(filePath: string, content: string): Promise<void> {
    try {
      // Vérifier que le contenu n'est pas trop volumineux
      if (content.length > 10 * 1024 * 1024) { // 10MB max
        throw new Error('Contenu trop volumineux');
      }

      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      throw new Error(`Erreur d'écriture fichier ${path.basename(filePath)}: ${error.message}`);
    }
  }
}