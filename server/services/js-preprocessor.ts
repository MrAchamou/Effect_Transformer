/**
 * Module de préprocessing automatique pour standardiser les fichiers JavaScript
 * Convertit automatiquement les effets en format compatible avec le système
 */

export class JSPreprocessor {
  private baseEffectTemplate = `
// Classe de base générée automatiquement
class BaseEffect {
  constructor(config = {}) {
    this.id = config.id || 'effect-' + Date.now();
    this.name = config.name || 'Effect';
    this.category = config.category || 'general';
    this.version = config.version || '1.0';
    this.performance = config.performance || 'medium';
    this.parameters = config.parameters || {};
  }
  
  initialize(canvas, element) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.element = element;
  }
  
  animate(deltaTime) {
    // Méthode à surcharger
  }
  
  destroy() {
    // Nettoyage
  }
}
`;

  /**
   * Préprocess un fichier JavaScript pour le rendre compatible
   */
  async preprocessJS(originalCode: string, filename: string): Promise<{
    processedCode: string;
    changes: string[];
    isValid: boolean;
    error?: string;
  }> {
    const changes: string[] = [];
    let processedCode = originalCode;

    try {
      // 1. Ajouter BaseEffect si nécessaire
      if (this.needsBaseEffect(originalCode)) {
        processedCode = this.baseEffectTemplate + '\n' + processedCode;
        changes.push('Classe BaseEffect ajoutée automatiquement');
      }

      // 2. Corriger les dépendances manquantes
      processedCode = this.fixMissingDependencies(processedCode);
      if (processedCode !== originalCode) {
        changes.push('Dépendances manquantes corrigées');
      }

      // 3. Standardiser la structure de classe
      processedCode = this.standardizeClassStructure(processedCode);
      changes.push('Structure de classe standardisée');

      // 4. Ajouter les méthodes d'export/utilisation
      processedCode = this.addExportMethods(processedCode);
      changes.push('Méthodes d\'export ajoutées');

      // 5. Valider la syntaxe JavaScript
      const validationResult = this.validateJavaScript(processedCode);
      if (!validationResult.isValid) {
        // Tenter une correction automatique
        const corrected = this.autoCorrectSyntax(processedCode);
        if (corrected.isValid) {
          processedCode = corrected.code;
          changes.push('Erreurs de syntaxe corrigées automatiquement');
        } else {
          return {
            processedCode: originalCode,
            changes: [],
            isValid: false,
            error: validationResult.error
          };
        }
      }

      // 6. Optimiser les performances
      processedCode = this.optimizePerformance(processedCode);
      changes.push('Optimisations de performance appliquées');

      return {
        processedCode,
        changes,
        isValid: true
      };

    } catch (error) {
      return {
        processedCode: originalCode,
        changes: [],
        isValid: false,
        error: `Erreur de preprocessing: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Vérifie si le code a besoin de la classe BaseEffect
   */
  private needsBaseEffect(code: string): boolean {
    return code.includes('extends BaseEffect') && !code.includes('class BaseEffect');
  }

  /**
   * Corrige les dépendances manquantes communes
   */
  private fixMissingDependencies(code: string): string {
    let fixed = code;

    // Ajouter Math si utilisé mais non défini
    if (fixed.includes('Math.') && !fixed.includes('const Math')) {
      // Math est global, pas besoin de correction
    }

    // Ajouter requestAnimationFrame si utilisé
    if (fixed.includes('requestAnimationFrame')) {
      fixed = `
// Polyfill pour requestAnimationFrame
const requestAnimationFrame = (callback) => {
  return setTimeout(callback, 1000 / 60);
};

${fixed}`;
    }

    // Ajouter document si utilisé côté serveur
    if (fixed.includes('document.')) {
      fixed = `
// Mock document pour compatibilité serveur
const document = {
  createElement: (tag) => ({
    width: 800, height: 600,
    getContext: () => ({
      clearRect: () => {}, fillStyle: '', strokeStyle: '',
      beginPath: () => {}, moveTo: () => {}, lineTo: () => {},
      arc: () => {}, fill: () => {}, stroke: () => {}
    })
  }),
  getElementById: (id) => null
};

${fixed}`;
    }

    return fixed;
  }

  /**
   * Standardise la structure des classes d'effet
   */
  private standardizeClassStructure(code: string): string {
    // Assurer que la classe a les méthodes essentielles
    let standardized = code;

    // Vérifier et ajouter initialize si manquante
    if (!standardized.includes('initialize(') && standardized.includes('class ')) {
      const classMatch = standardized.match(/class\s+\w+[^{]*{/);
      if (classMatch) {
        const insertPos = standardized.indexOf(classMatch[0]) + classMatch[0].length;
        const initializeMethod = `
  initialize(canvas, element) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.element = element || { width: canvas.width, height: canvas.height };
  }
`;
        standardized = standardized.slice(0, insertPos) + initializeMethod + standardized.slice(insertPos);
      }
    }

    // Vérifier et ajouter animate si manquante
    if (!standardized.includes('animate(') && standardized.includes('class ')) {
      const classMatch = standardized.match(/class\s+\w+[^{]*{/);
      if (classMatch) {
        const insertPos = standardized.indexOf(classMatch[0]) + classMatch[0].length;
        const animateMethod = `
  animate(deltaTime = 16) {
    if (!this.ctx || !this.canvas) return;
    // Animation par défaut
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
`;
        standardized = standardized.slice(0, insertPos) + animateMethod + standardized.slice(insertPos);
      }
    }

    return standardized;
  }

  /**
   * Ajoute les méthodes d'export et d'utilisation
   */
  private addExportMethods(code: string): string {
    // Détecter le nom de la classe principale
    const classMatch = code.match(/class\s+(\w+)/);
    const className = classMatch ? classMatch[1] : 'Effect';

    const exportCode = `

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ${className};
}

// Usage autonome si chargé directement  
if (typeof window !== 'undefined') {
  window.${className} = ${className};
  
  // Fonction utilitaire pour démarrage rapide
  window.start${className} = function(canvasId, config = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error('Canvas non trouvé:', canvasId);
      return null;
    }
    
    const effect = new ${className}(config);
    effect.initialize(canvas, { 
      width: canvas.width, 
      height: canvas.height 
    });
    
    let lastTime = 0;
    const animationLoop = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      effect.animate(deltaTime);
      requestAnimationFrame(animationLoop);
    };
    
    requestAnimationFrame(animationLoop);
    return effect;
  };
}`;

    return code + exportCode;
  }

  /**
   * Valide la syntaxe JavaScript
   */
  private validateJavaScript(code: string): { isValid: boolean; error?: string } {
    try {
      // Validation basique avec Function constructor
      new Function(code);
      return { isValid: true };
    } catch (error) {
      return { 
        isValid: false, 
        error: `Erreur de syntaxe: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  /**
   * Tente de corriger automatiquement les erreurs de syntaxe courantes
   */
  private autoCorrectSyntax(code: string): { isValid: boolean; code: string } {
    let corrected = code;

    // Corriger les points-virgules manquants
    corrected = corrected.replace(/([^;\s}])\s*\n\s*([a-zA-Z])/g, '$1;\n$2');

    // Corriger les accolades manquantes
    const openBraces = (corrected.match(/{/g) || []).length;
    const closeBraces = (corrected.match(/}/g) || []).length;
    if (openBraces > closeBraces) {
      corrected += '\n' + '}'.repeat(openBraces - closeBraces);
    }

    // Corriger les parenthèses manquantes
    const openParens = (corrected.match(/\(/g) || []).length;
    const closeParens = (corrected.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      corrected += ')'.repeat(openParens - closeParens);
    }

    try {
      new Function(corrected);
      return { isValid: true, code: corrected };
    } catch (error) {
      return { isValid: false, code: corrected };
    }
  }

  /**
   * Applique des optimisations de performance
   */
  private optimizePerformance(code: string): string {
    let optimized = code;

    // Optimiser les boucles
    optimized = optimized.replace(
      /for\s*\(\s*let\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*([^;]+)\.length\s*;\s*\1\+\+\s*\)/g,
      'for (let $1 = 0, len = $2.length; $1 < len; $1++)'
    );

    // Optimiser les accès répétés au DOM
    if (optimized.includes('document.getElementById')) {
      optimized = `// Cache des éléments DOM pour performance
const domCache = new Map();
const getElementById = (id) => {
  if (!domCache.has(id)) {
    domCache.set(id, document.getElementById(id));
  }
  return domCache.get(id);
};

` + optimized.replace(/document\.getElementById/g, 'getElementById');
    }

    return optimized;
  }
}