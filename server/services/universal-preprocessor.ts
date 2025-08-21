
/**
 * Module Universel de Preprocessing
 * Intercepte et normalise tout code JavaScript d'effet avant transformation
 * 
 * Rôles :
 * 1. Extraire uniquement le code JavaScript sans descriptions
 * 2. Reconditionner au format parfait du logiciel
 */

export class UniversalPreprocessor {
  private effectMetadata: any = null;

  /**
   * Point d'entrée principal du preprocessing universel
   */
  async preprocessEffect(originalCode: string, filename: string): Promise<{
    cleanCode: string;
    metadata: any;
    changes: string[];
    isValid: boolean;
    error?: string;
  }> {
    const changes: string[] = [];
    
    try {
      // 1. Extraction des métadonnées et séparation du code
      const extracted = this.extractCodeFromDescriptions(originalCode);
      if (extracted.hasDescriptions) {
        changes.push('Descriptions séparées du code JavaScript');
        this.effectMetadata = extracted.metadata;
      }

      // 2. Nettoyage et normalisation du code
      const cleaned = this.cleanAndNormalizeCode(extracted.code);
      if (cleaned.hasChanges) {
        changes.push(...cleaned.changes);
      }

      // 3. Reconditionnement au format parfait
      const formatted = this.formatToStandardStructure(cleaned.code, filename);
      if (formatted.hasChanges) {
        changes.push(...formatted.changes);
      }

      // 4. Validation finale
      const validation = this.validateFinalCode(formatted.code);
      if (!validation.isValid) {
        return {
          cleanCode: originalCode,
          metadata: this.effectMetadata,
          changes: [],
          isValid: false,
          error: validation.error
        };
      }

      return {
        cleanCode: formatted.code,
        metadata: this.effectMetadata,
        changes,
        isValid: true
      };

    } catch (error) {
      return {
        cleanCode: originalCode,
        metadata: null,
        changes: [],
        isValid: false,
        error: `Erreur de preprocessing universel: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Extrait le code JavaScript pur des descriptions
   */
  private extractCodeFromDescriptions(code: string): {
    code: string;
    metadata: any;
    hasDescriptions: boolean;
  } {
    let cleanCode = code;
    let metadata = null;
    let hasDescriptions = false;

    // Détection des blocs de description longs (comme dans smoke-simulation)
    const descriptionBlockPattern = /export\s+const\s+(\w+)\s*=\s*{\s*id:\s*["']([^"']+)["'],?\s*name:\s*["']([^"']+)["'],?\s*description:\s*`([^`]+)`\s*([^}]*)\s*}\s*;?\s*/s;
    const match = descriptionBlockPattern.exec(code);
    
    if (match) {
      const [fullMatch, objectName, effectId, effectName, description, otherProps] = match;
      
      // Extraction des métadonnées utiles
      metadata = {
        objectName,
        effectId,
        effectName,
        description,
        category: this.extractFromDescription(description, 'CATÉGORIE'),
        effectType: this.extractFromDescription(description, 'EFFET DEMANDÉ'),
        originalBlock: fullMatch
      };

      // Suppression du bloc de description du code
      cleanCode = code.replace(fullMatch, '');
      hasDescriptions = true;
    }

    // Nettoyage des commentaires de description excessifs
    const commentPattern = /\/\*[\s\S]*?\*\/|\/\/.*(?:\n\/\/.*)*\n/g;
    const comments = cleanCode.match(commentPattern) || [];
    
    if (comments.length > 0) {
      comments.forEach(comment => {
        // Garder seulement les commentaires courts et techniques
        if (comment.length > 200 || comment.includes('EFFET') || comment.includes('DESCRIPTION')) {
          cleanCode = cleanCode.replace(comment, '');
          hasDescriptions = true;
        }
      });
    }

    // Nettoyage des lignes vides excessives
    cleanCode = cleanCode.replace(/\n\s*\n\s*\n+/g, '\n\n');

    return {
      code: cleanCode.trim(),
      metadata,
      hasDescriptions
    };
  }

  /**
   * Extrait une valeur spécifique de la description
   */
  private extractFromDescription(description: string, key: string): string {
    const pattern = new RegExp(`\\*\\*${key}\\s*:\\*\\*\\s*([^\\n]+)`, 'i');
    const match = pattern.exec(description);
    return match ? match[1].trim() : '';
  }

  /**
   * Nettoie et normalise le code JavaScript
   */
  private cleanAndNormalizeCode(code: string): {
    code: string;
    hasChanges: boolean;
    changes: string[];
  } {
    let cleanCode = code;
    const changes: string[] = [];
    let hasChanges = false;

    // 1. Nettoyage des exports/imports ES6
    if (/export\s+|import\s+.*from/.test(cleanCode)) {
      cleanCode = cleanCode.replace(/export\s+default\s+/g, '');
      cleanCode = cleanCode.replace(/export\s+/g, '');
      cleanCode = cleanCode.replace(/import\s+.*from\s+['"][^'"]*['"];\s*/g, '');
      changes.push('Syntaxe ES6 modules nettoyée');
      hasChanges = true;
    }

    // 2. Correction des erreurs de syntaxe communes
    const originalLength = cleanCode.length;
    cleanCode = this.fixCommonSyntaxErrors(cleanCode);
    if (cleanCode.length !== originalLength) {
      changes.push('Erreurs de syntaxe corrigées');
      hasChanges = true;
    }

    // 3. Standardisation des noms de méthodes
    cleanCode = cleanCode.replace(/émettreParticuleDepuisSource/g, 'emettreParticuleDepuisSource');
    cleanCode = cleanCode.replace(/mettreÀJour/g, 'mettreAJour');
    if (cleanCode !== code) {
      changes.push('Noms de méthodes standardisés');
      hasChanges = true;
    }

    return {
      code: cleanCode,
      hasChanges,
      changes
    };
  }

  /**
   * Corrige les erreurs de syntaxe communes
   */
  private fixCommonSyntaxErrors(code: string): string {
    let fixed = code;

    // Correction des espaces dans les noms de méthodes
    fixed = fixed.replace(/(\w+)\s+(\w+)\s*\(/g, '$1$2(');

    // Correction des caractères spéciaux dans les identificateurs
    fixed = fixed.replace(/émettrePart iculeDepuisSource/g, 'emettreParticuleDepuisSource');

    // Correction des points-virgules manquants
    fixed = fixed.replace(/([^;\s}])\s*\n\s*([a-zA-Z])/g, '$1;\n$2');

    // Correction des accolades manquantes
    const openBraces = (fixed.match(/{/g) || []).length;
    const closeBraces = (fixed.match(/}/g) || []).length;
    if (openBraces > closeBraces) {
      fixed += '\n' + '}'.repeat(openBraces - closeBraces);
    }

    return fixed;
  }

  /**
   * Formate le code au format standard du logiciel
   */
  private formatToStandardStructure(code: string, filename: string): {
    code: string;
    hasChanges: boolean;
    changes: string[];
  } {
    const changes: string[] = [];
    let formattedCode = code;
    let hasChanges = false;

    // 1. Ajout de BaseEffect si nécessaire
    if (code.includes('extends BaseEffect') && !code.includes('class BaseEffect')) {
      const baseEffectTemplate = this.getBaseEffectTemplate();
      formattedCode = baseEffectTemplate + '\n\n' + formattedCode;
      changes.push('Classe BaseEffect ajoutée');
      hasChanges = true;
    }

    // 2. Standardisation de la structure de classe
    if (!formattedCode.includes('initialize(') && formattedCode.includes('class ')) {
      formattedCode = this.addMissingMethods(formattedCode);
      changes.push('Méthodes essentielles ajoutées');
      hasChanges = true;
    }

    // 3. Ajout des exports standardisés
    const className = this.extractClassName(formattedCode);
    if (className && !formattedCode.includes('module.exports')) {
      formattedCode = this.addStandardExports(formattedCode, className);
      changes.push('Exports standardisés ajoutés');
      hasChanges = true;
    }

    return {
      code: formattedCode,
      hasChanges,
      changes
    };
  }

  /**
   * Template de la classe BaseEffect
   */
  private getBaseEffectTemplate(): string {
    return `// Classe de base générée automatiquement
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
}`;
  }

  /**
   * Ajoute les méthodes manquantes essentielles
   */
  private addMissingMethods(code: string): string {
    let enhanced = code;

    // Ajouter initialize si manquante
    if (!enhanced.includes('initialize(')) {
      const classMatch = enhanced.match(/class\s+\w+[^{]*{/);
      if (classMatch) {
        const insertPos = enhanced.indexOf(classMatch[0]) + classMatch[0].length;
        const initializeMethod = `
  initialize(canvas, element) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.element = element || { width: canvas.width, height: canvas.height };
  }
`;
        enhanced = enhanced.slice(0, insertPos) + initializeMethod + enhanced.slice(insertPos);
      }
    }

    // Ajouter animate si manquante
    if (!enhanced.includes('animate(')) {
      const classMatch = enhanced.match(/class\s+\w+[^{]*{/);
      if (classMatch) {
        const insertPos = enhanced.indexOf(classMatch[0]) + classMatch[0].length;
        const animateMethod = `
  animate(deltaTime = 16) {
    if (!this.ctx || !this.canvas) return;
    // Animation par défaut
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
`;
        enhanced = enhanced.slice(0, insertPos) + animateMethod + enhanced.slice(insertPos);
      }
    }

    return enhanced;
  }

  /**
   * Extrait le nom de la classe principale
   */
  private extractClassName(code: string): string | null {
    const classMatch = code.match(/class\s+(\w+)/);
    return classMatch ? classMatch[1] : null;
  }

  /**
   * Ajoute les exports standardisés
   */
  private addStandardExports(code: string, className: string): string {
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
   * Validation finale du code nettoyé
   */
  private validateFinalCode(code: string): { isValid: boolean; error?: string } {
    try {
      // Préparation du code pour validation
      let validationCode = code;
      
      // Remplacement temporaire des template literals complexes
      validationCode = validationCode.replace(/`[\s\S]*?`/g, '"TEMPLATE_LITERAL"');
      
      // Remplacement temporaire des regex complexes
      validationCode = validationCode.replace(/\/[^\/\n]+\/[gimuy]*/g, '/REGEX/');
      
      // Test de syntaxe basique
      new Function(validationCode);
      return { isValid: true };
    } catch (error) {
      return { 
        isValid: false, 
        error: `Code JavaScript invalide après preprocessing: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  /**
   * Récupère les métadonnées extraites
   */
  getExtractedMetadata(): any {
    return this.effectMetadata;
  }

  /**
   * Réinitialise le preprocessor
   */
  reset(): void {
    this.effectMetadata = null;
  }
}
