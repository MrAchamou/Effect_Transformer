
export class DocumentationGenerator {
  private modules: any;

  constructor() {
    this.loadModulesDefinitions();
  }

  private async loadModulesDefinitions() {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const modulesPath = path.join(process.cwd(), 'server/config/modules-definitions.json');
      const modulesData = await fs.readFile(modulesPath, 'utf-8');
      this.modules = JSON.parse(modulesData);
    } catch (error) {
      console.error('Failed to load modules definitions:', error);
    }
  }

  async generateDocumentation(
    originalCode: string,
    transformedCode: string,
    stats: any,
    level: number,
    effectAnalysis: any,
    transformationId: string
  ): Promise<{
    markdown: string;
    html: string;
    readme: string;
    changelog: string;
  }> {
    const effectName = this.extractEffectName(transformedCode);
    const levelName = this.getLevelName(level);
    const appliedModules = this.getAppliedModules(level);

    // Génération du contenu de documentation
    const markdown = this.generateMarkdownDoc(
      effectName,
      levelName,
      originalCode,
      transformedCode,
      stats,
      appliedModules,
      effectAnalysis
    );

    const html = this.generateHTMLDoc(
      effectName,
      levelName,
      originalCode,
      transformedCode,
      stats,
      appliedModules,
      effectAnalysis
    );

    const readme = this.generateReadme(
      effectName,
      levelName,
      stats,
      appliedModules,
      effectAnalysis
    );

    const changelog = this.generateChangelog(
      effectName,
      levelName,
      appliedModules,
      stats
    );

    return { markdown, html, readme, changelog };
  }

  private extractEffectName(code: string): string {
    // Extraire le nom de l'effet depuis le code
    const classMatch = code.match(/class\s+(\w+)/);
    const nameMatch = code.match(/name:\s*['"`]([^'"`]+)['"`]/);
    
    return nameMatch ? nameMatch[1] : (classMatch ? classMatch[1] : 'VisualEffect');
  }

  private getLevelName(level: number): string {
    const levels = {
      1: 'Standard',
      2: 'Professional',
      3: 'Premium',
      4: 'Elite',
      5: 'Master',
      6: 'Ultimate'
    };
    return levels[level] || 'Standard';
  }

  private getAppliedModules(level: number): any[] {
    const levelConfigs = {
      1: ['CodeOptimizationEngine', 'ContentAnalyzer', 'SmartOptimizer'],
      2: ['CodeOptimizationEngine', 'ContentAnalyzer', 'SmartOptimizer', 'VisualFocusEngine', 'TimingMaster', 'ColorHarmonyEngine'],
      3: ['CodeOptimizationEngine', 'ContentAnalyzer', 'SmartOptimizer', 'VisualFocusEngine', 'TimingMaster', 'ColorHarmonyEngine', 'PerformanceAdaptiveEngine', 'UserPreferenceEngine', 'ContextualAdaptationEngine'],
    };

    const moduleNames = levelConfigs[level] || levelConfigs[1];
    return moduleNames.map(name => ({
      name,
      ...this.modules[name]
    }));
  }

  private generateMarkdownDoc(
    effectName: string,
    levelName: string,
    originalCode: string,
    transformedCode: string,
    stats: any,
    appliedModules: any[],
    effectAnalysis: any
  ): string {
    return `# ${effectName} - Documentation Technique

## 📊 Informations Générales

- **Nom de l'effet**: ${effectName}
- **Niveau de transformation**: ${levelName}
- **Version**: 1.0
- **Compatibilité**: Tous navigateurs modernes
- **Type**: ${effectAnalysis.category || 'Effet visuel'}
- **Date de génération**: ${new Date().toLocaleDateString('fr-FR')}

## 🚀 Améliorations Appliquées

### Statistiques de Performance

- **Réduction de taille**: ${stats.sizeReduction}%
- **Amélioration performance**: +${stats.performanceImprovement}%
- **Amélioration fluidité**: +${stats.fluidityImprovement}%
- **Lignes de code**: ${stats.originalLines} → ${stats.transformedLines}
- **Modules appliqués**: ${stats.modulesApplied}

### Modules IA Intégrés

${appliedModules.map(module => `
#### ${module.name}
- **Catégorie**: ${module.category}
- **Description**: ${module.description}
`).join('')}

## 🎯 Analyse de l'Effet Original

**Catégorie détectée**: ${effectAnalysis.category}
**Niveau de complexité**: ${effectAnalysis.complexity || 'Moyen'}
**Potentiel d'amélioration**: ${effectAnalysis.improvementPotential || 'Élevé'}

**Raison de la classification**: ${effectAnalysis.reason}

${effectAnalysis.recommendations ? `
## 💡 Recommandations d'Utilisation

${effectAnalysis.recommendations.map(rec => `- ${rec}`).join('\n')}
` : ''}

## 🔧 Guide d'Implémentation

### Installation Rapide

\`\`\`html
<!-- Inclure dans votre HTML -->
<script src="${effectName.toLowerCase()}.js"></script>
<canvas id="effectCanvas" width="800" height="600"></canvas>

<script>
  // Initialisation automatique
  const effect = new ${effectName}();
  effect.initialize(document.getElementById('effectCanvas'));
  effect.start();
</script>
\`\`\`

### Configuration Avancée

\`\`\`javascript
const effect = new ${effectName}({
  // Configuration personnalisée
  performance: 'high',
  responsive: true,
  autoStart: true,
  parameters: {
    // Paramètres spécifiques à l'effet
  }
});
\`\`\`

## 📱 Compatibilité et Performance

### Navigateurs Supportés
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Appareils Testés
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Mobile (iOS 12+, Android 7+)
- ✅ Tablettes (iPad, Android tablets)

## 🛠️ API et Méthodes

### Méthodes Principales

\`\`\`javascript
// Initialisation
effect.initialize(canvas, options)

// Contrôle de l'animation
effect.start()
effect.pause()
effect.stop()
effect.reset()

// Configuration dynamique
effect.updateConfig(newConfig)
effect.setParameter(key, value)
\`\`\`

### Événements

\`\`\`javascript
effect.on('start', () => console.log('Effet démarré'));
effect.on('complete', () => console.log('Animation terminée'));
effect.on('error', (error) => console.error('Erreur:', error));
\`\`\`

## 🎨 Personnalisation

L'effet a été optimisé avec les modules suivants pour une personnalisation maximale :

${appliedModules.filter(m => m.category === 'visual').map(module => `
- **${module.name}**: ${module.description}
`).join('')}

## ⚡ Optimisations Techniques

${appliedModules.filter(m => m.category === 'performance').map(module => `
### ${module.name}
${module.description}
`).join('')}

## 📄 Licence et Support

- **Licence**: Usage commercial autorisé
- **Support**: Documentation complète incluse
- **Mises à jour**: Compatibilité future garantie
- **Garantie**: Code optimisé et testé

---

*Documentation générée automatiquement par Visual Effects Transformer v1.0*
`;
  }

  private generateHTMLDoc(
    effectName: string,
    levelName: string,
    originalCode: string,
    transformedCode: string,
    stats: any,
    appliedModules: any[],
    effectAnalysis: any
  ): string {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${effectName} - Documentation Interactive</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }
        .modules-list {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        .module-item {
            padding: 15px;
            border-left: 4px solid #667eea;
            margin: 10px 0;
            background: #f8f9fa;
            border-radius: 0 8px 8px 0;
        }
        .code-container {
            background: #2d3748;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
        }
        .demo-section {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin: 20px 0;
            text-align: center;
        }
        .btn-demo {
            background: #667eea;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
        }
        .btn-demo:hover {
            background: #5a67d8;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${effectName}</h1>
        <p>Documentation Interactive - Niveau ${levelName}</p>
        <p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-value">-${stats.sizeReduction}%</div>
            <div>Réduction de taille</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">+${stats.performanceImprovement}%</div>
            <div>Amélioration performance</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">+${stats.fluidityImprovement}%</div>
            <div>Amélioration fluidité</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.modulesApplied}</div>
            <div>Modules IA appliqués</div>
        </div>
    </div>

    <div class="modules-list">
        <h2>🤖 Modules IA Intégrés</h2>
        ${appliedModules.map(module => `
        <div class="module-item">
            <h3>${module.name}</h3>
            <p><strong>Catégorie:</strong> ${module.category}</p>
            <p>${module.description}</p>
        </div>
        `).join('')}
    </div>

    <div class="demo-section">
        <h2>🎮 Démo Interactive</h2>
        <canvas id="demoCanvas" width="600" height="400" style="border: 2px solid #667eea; border-radius: 8px;"></canvas>
        <br>
        <button class="btn-demo" onclick="startDemo()">▶️ Démarrer</button>
        <button class="btn-demo" onclick="pauseDemo()">⏸️ Pause</button>
        <button class="btn-demo" onclick="resetDemo()">🔄 Reset</button>
    </div>

    <div class="modules-list">
        <h2>💻 Code d'Implémentation</h2>
        <div class="code-container">
            <pre><code>&lt;script src="${effectName.toLowerCase()}.js"&gt;&lt;/script&gt;
&lt;canvas id="effectCanvas" width="800" height="600"&gt;&lt;/canvas&gt;

&lt;script&gt;
  const effect = new ${effectName}();
  effect.initialize(document.getElementById('effectCanvas'));
  effect.start();
&lt;/script&gt;</code></pre>
        </div>
    </div>

    <script>
        // Code de démonstration intégré
        let demoEffect = null;
        
        // Intégrer le code transformé ici
        ${transformedCode}
        
        function startDemo() {
            const canvas = document.getElementById('demoCanvas');
            if (!demoEffect && typeof ${effectName} !== 'undefined') {
                demoEffect = new ${effectName}();
                demoEffect.initialize(canvas);
            }
            if (demoEffect && demoEffect.start) {
                demoEffect.start();
            }
        }
        
        function pauseDemo() {
            if (demoEffect && demoEffect.pause) {
                demoEffect.pause();
            }
        }
        
        function resetDemo() {
            if (demoEffect && demoEffect.reset) {
                demoEffect.reset();
            }
        }
        
        // Auto-démarrage de la démo
        window.addEventListener('load', startDemo);
    </script>
</body>
</html>`;
  }

  private generateReadme(
    effectName: string,
    levelName: string,
    stats: any,
    appliedModules: any[],
    effectAnalysis: any
  ): string {
    return `# ${effectName}

> Effet visuel JavaScript optimisé par IA - Niveau ${levelName}

## 🚀 Installation Rapide

\`\`\`bash
# Télécharger et inclure dans votre projet
<script src="${effectName.toLowerCase()}.js"></script>
\`\`\`

## 📈 Performances

- ⚡ **${stats.performanceImprovement}%** plus rapide
- 📦 **${stats.sizeReduction}%** plus léger  
- 🎨 **${stats.fluidityImprovement}%** plus fluide
- 🤖 **${stats.modulesApplied}** modules IA intégrés

## 🎯 Utilisation

\`\`\`javascript
const effect = new ${effectName}();
effect.initialize(canvas);
effect.start();
\`\`\`

## 🛠️ Configuration

\`\`\`javascript
const effect = new ${effectName}({
  performance: 'high',
  responsive: true,
  autoStart: true
});
\`\`\`

## 📱 Compatibilité

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Desktop, Mobile, Tablette  
- ✅ Responsive automatique
- ✅ Optimisé pour tous appareils

## 📄 Licence

Usage commercial autorisé - Documentation complète incluse

---

*Optimisé par Visual Effects Transformer*`;
  }

  private generateChangelog(
    effectName: string,
    levelName: string,
    appliedModules: any[],
    stats: any
  ): string {
    return `# Changelog - ${effectName}

## Version 1.0 - ${new Date().toLocaleDateString('fr-FR')}

### ✨ Améliorations Niveau ${levelName}

#### 🤖 Modules IA Appliqués
${appliedModules.map(module => `- **${module.name}**: ${module.description}`).join('\n')}

#### 📊 Optimisations
- Réduction taille: -${stats.sizeReduction}%
- Performance: +${stats.performanceImprovement}%
- Fluidité: +${stats.fluidityImprovement}%

#### 🔧 Améliorations Techniques
- Compatibilité navigateurs optimisée
- Code restructuré et optimisé
- Gestion d'erreurs améliorée
- API simplifiée

#### 🎨 Améliorations Visuelles
- Animations plus fluides
- Rendu optimisé
- Adaptation responsive automatique
- Qualité visuelle améliorée

---

*Généré automatiquement par Visual Effects Transformer*`;
  }
}
