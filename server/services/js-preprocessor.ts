/**
 * Module de préprocessing automatique pour standardiser les fichiers JavaScript
 * Convertit automatiquement les effets en format compatible avec le système
 */

import { UniversalPreprocessor } from './universal-preprocessor';

export class JSPreprocessor {
  private universalPreprocessor: UniversalPreprocessor;
  constructor() {
    this.universalPreprocessor = new UniversalPreprocessor();
  }

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
   * Point d'entrée principal du preprocessing JavaScript
   */
  async preprocessJS(originalCode: string, filename: string): Promise<{
    processedCode: string;
    changes: string[];
    isValid: boolean;
    error?: string;
    metadata?: any;
  }> {
    let processedCode = originalCode;
    const changes: string[] = [];

    try {
      // 0. PREPROCESSING UNIVERSEL - Point d'entrée obligatoire
      console.log('🔄 Démarrage du preprocessing universel...');
      const universalResult = await this.universalPreprocessor.preprocessEffect(originalCode, filename);

      if (!universalResult.isValid) {
        return {
          processedCode: originalCode,
          changes: [],
          isValid: false,
          error: universalResult.error,
          metadata: universalResult.metadata
        };
      }

      processedCode = universalResult.cleanCode;
      changes.push(...universalResult.changes);
      console.log(`✅ Preprocessing universel terminé: ${universalResult.changes.length} changements`);

      // 1. Détection de fichiers incomplets ou de métadonnées seulement
      const metadataConversion = this.convertMetadataToEffect(processedCode, filename);
      if (metadataConversion.converted) {
        processedCode = metadataConversion.code;
        changes.push(...metadataConversion.changes);
      }

      // 2. Détection et conversion des formats de modules
      const moduleConversion = this.convertModuleFormat(processedCode);
      if (moduleConversion.converted) {
        processedCode = moduleConversion.code;
        changes.push(...moduleConversion.changes);
      }

      // 3. Ajout de la classe BaseEffect si nécessaire
      if (processedCode.includes('extends BaseEffect') && !processedCode.includes('class BaseEffect')) {
        processedCode = this.baseEffectTemplate + '\n\n' + processedCode;
        changes.push('Classe BaseEffect ajoutée');
      }

      // 4. Ajout des exports standardisés
      if (!processedCode.includes('module.exports') && !processedCode.includes('export')) {
        processedCode = this.addStandardExports(processedCode);
        changes.push('Exports ajoutés');
      }

      // 5. Validation finale
      const validationResult = this.validateJavaScript(processedCode);
      if (!validationResult.isValid) {
        const corrected = this.autoCorrectSyntax(processedCode);
        if (corrected.isValid) {
          processedCode = corrected.code;
          changes.push('Erreurs de syntaxe corrigées automatiquement');
        } else {
          return {
            processedCode: originalCode,
            changes: [],
            isValid: false,
            error: validationResult.error,
            metadata: this.universalPreprocessor.getExtractedMetadata()
          };
        }
      }

      // 6. Optimisations finales
      processedCode = this.optimizePerformance(processedCode);
      changes.push('Optimisations de performance appliquées');

      return {
        processedCode,
        changes,
        isValid: true,
        metadata: this.universalPreprocessor.getExtractedMetadata()
      };

    } catch (error) {
      return {
        processedCode: originalCode,
        changes: [],
        isValid: false,
        error: `Erreur de preprocessing: ${error instanceof Error ? error.message : String(error)}`,
        metadata: this.universalPreprocessor.getExtractedMetadata()
      };
    }
  }

  /**
   * Convertit les métadonnées en classe d'effet complète
   */
  private convertMetadataToEffect(code: string, filename: string): {
    code: string;
    converted: boolean;
    changes: string[];
  } {
    const changes: string[] = [];

    // Si le fichier ne contient que des métadonnées, générer un effet complet
    if (code.includes('export const') && code.includes('description:') && !code.includes('class ')) {
      const effectName = this.extractEffectNameFromFilename(filename);
      const generatedClass = this.generateEffectClassFromMetadata(code, effectName);

      return {
        code: code + '\n\n' + generatedClass,
        converted: true,
        changes: [`Classe ${effectName} générée à partir des métadonnées`]
      };
    }

    return { code, converted: false, changes: [] };
  }

  /**
   * Convertit différents formats de modules
   */
  private convertModuleFormat(code: string): {
    code: string;
    converted: boolean;
    changes: string[];
  } {
    let convertedCode = code;
    const changes: string[] = [];
    let hasChanged = false;

    // Conversion AMD vers CommonJS
    if (code.includes('define(') && code.includes('function(')) {
      convertedCode = this.convertAMDToCommonJS(convertedCode);
      changes.push('Format AMD converti vers CommonJS');
      hasChanged = true;
    }

    // Conversion UMD vers CommonJS
    if (code.includes('(function (root, factory)')) {
      convertedCode = this.convertUMDToCommonJS(convertedCode);
      changes.push('Format UMD converti vers CommonJS');
      hasChanged = true;
    }

    return { code: convertedCode, converted: hasChanged, changes };
  }

  /**
   * Ajoute les exports standardisés
   */
  private addStandardExports(code: string): string {
    const className = this.extractMainClassName(code);

    if (className) {
      return code + `\n\n// Export standard\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = ${className};\n}\n\nif (typeof window !== 'undefined') {\n  window.${className} = ${className};\n}`;
    }

    return code;
  }

  /**
   * Validation JavaScript
   */
  private validateJavaScript(code: string): { isValid: boolean; error?: string } {
    try {
      new Function(code);
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Erreur de syntaxe JavaScript'
      };
    }
  }

  /**
   * Correction automatique de syntaxe
   */
  private autoCorrectSyntax(code: string): { code: string; isValid: boolean } {
    let correctedCode = code;

    // Correction des accolades manquantes
    const openBraces = (correctedCode.match(/\{/g) || []).length;
    const closeBraces = (correctedCode.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      correctedCode += '\n' + '}'.repeat(openBraces - closeBraces);
    }

    // Correction des parenthèses manquantes
    const openParens = (correctedCode.match(/\(/g) || []).length;
    const closeParens = (correctedCode.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      correctedCode += ')'.repeat(openParens - closeParens);
    }

    // Validation du code corrigé
    const validation = this.validateJavaScript(correctedCode);
    return { code: correctedCode, isValid: validation.isValid };
  }

  /**
   * Optimisations de performance
   */
  private optimizePerformance(code: string): string {
    let optimizedCode = code;

    // Cache des calculs Math
    if (code.includes('Math.sin') || code.includes('Math.cos')) {
      optimizedCode = `// Cache trigonométrique\nconst MathCache = new Map();\nconst cachedSin = (x) => MathCache.has('sin_' + x) ? MathCache.get('sin_' + x) : MathCache.set('sin_' + x, Math.sin(x)).get('sin_' + x);\nconst cachedCos = (x) => MathCache.has('cos_' + x) ? MathCache.get('cos_' + x) : MathCache.set('cos_' + x, Math.cos(x)).get('cos_' + x);\n\n${optimizedCode.replace(/Math\.sin/g, 'cachedSin').replace(/Math\.cos/g, 'cachedCos')}`;
    }

    return optimizedCode;
  }

  /**
   * Utilitaires privés
   */
  private extractEffectNameFromFilename(filename: string): string {
    const name = filename
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\s/g, '');

    return name.endsWith('Effect') ? name : name + 'Effect';
  }

  private extractMainClassName(code: string): string | null {
    const classMatch = code.match(/class\s+(\w+)/);
    return classMatch ? classMatch[1] : null;
  }

  private generateEffectClassFromMetadata(metadataCode: string, effectName: string): string {
    return `
class ${effectName} extends BaseEffect {
  constructor(config = {}) {
    super({
      id: '${effectName.toLowerCase()}',
      name: '${effectName}',
      category: 'generated',
      ...config
    });
  }

  initialize(canvas, element) {
    super.initialize(canvas, element);
    // Initialisation personnalisée basée sur les métadonnées
  }

  animate(deltaTime) {
    if (!this.isActive || !this.ctx) return;

    // Animation par défaut
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // TODO: Implémenter l'animation basée sur les métadonnées
  }
}`;
  }

  private convertAMDToCommonJS(code: string): string {
    // Conversion basique AMD -> CommonJS
    return code.replace(
      /define\s*\(\s*\[(.*?)\]\s*,\s*function\s*\((.*?)\)\s*{([\s\S]*?)}\s*\)/,
      (match, deps, params, body) => {
        const requires = deps.split(',').map((dep: string, index: number) => {
          const paramName = params.split(',')[index]?.trim();
          return paramName ? `const ${paramName} = require(${dep.trim()});` : '';
        }).filter(Boolean).join('\n');

        return `${requires}\n\n${body}\n\nmodule.exports = /* export principal */;`;
      }
    );
  }

  private convertUMDToCommonJS(code: string): string {
    // Extraction du contenu principal UMD
    const umdPattern = /\(function\s*\([^)]*\)\s*{[\s\S]*?if\s*\([^)]*typeof\s+exports[^)]*\)[^{]*{[\s\S]*?}\s*else[^{]*{([\s\S]*?)}\s*}\)\s*\(/;
    const match = umdPattern.exec(code);

    if (match && match[1]) {
      return match[1].trim() + '\n\nmodule.exports = /* export principal */;';
    }

    return code;
  }

  /**
   * Réinitialise le preprocessor
   */
  reset(): void {
    this.universalPreprocessor.reset();
  }
}