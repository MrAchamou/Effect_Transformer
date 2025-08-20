
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
    const timestamp = Date.now();
    const packageDir = path.join(this.outputDir, `${effectName}_${timestamp}`);
    
    // Créer le dossier du package
    await fs.mkdir(packageDir, { recursive: true });

    // Sauvegarder tous les fichiers
    await Promise.all([
      // Code JavaScript optimisé
      fs.writeFile(
        path.join(packageDir, `${effectName.toLowerCase()}.js`),
        transformedCode,
        'utf-8'
      ),
      
      // Documentation Markdown
      fs.writeFile(
        path.join(packageDir, 'DOCUMENTATION.md'),
        documentation.markdown,
        'utf-8'
      ),
      
      // Documentation HTML interactive
      fs.writeFile(
        path.join(packageDir, 'documentation.html'),
        documentation.html,
        'utf-8'
      ),
      
      // README pour marketplace
      fs.writeFile(
        path.join(packageDir, 'README.md'),
        documentation.readme,
        'utf-8'
      ),
      
      // Changelog
      fs.writeFile(
        path.join(packageDir, 'CHANGELOG.md'),
        documentation.changelog,
        'utf-8'
      ),
      
      // Fichier d'exemple d'utilisation
      fs.writeFile(
        path.join(packageDir, 'example.html'),
        this.generateExampleHTML(effectName),
        'utf-8'
      ),
      
      // Informations de licence
      fs.writeFile(
        path.join(packageDir, 'LICENSE.txt'),
        this.generateLicense(),
        'utf-8'
      ),
      
      // Guide d'installation
      fs.writeFile(
        path.join(packageDir, 'INSTALLATION.md'),
        this.generateInstallationGuide(effectName),
        'utf-8'
      )
    ]);

    // Créer une archive ZIP
    const zipPath = path.join(this.outputDir, `${effectName}_${timestamp}.zip`);
    await this.createZipArchive(packageDir, zipPath);

    return zipPath;
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
      const output = createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve());
      archive.on('error', (err) => reject(err));

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }
}
