
/**
 * VALIDATEUR DE RECONDITIONNEMENT
 * Valide que les effets reconditionnés respectent les standards
 */

export class ReconditioningValidator {
  constructor() {
    this.requiredMethods = [
      'initialize', 'update', 'render', 'destroy',
      'start', 'stop', 'pause', 'resume', 'reset',
      'setParameter', 'getParameter', 'getState', 'isActive'
    ];
    
    this.requiredStaticProperties = ['metadata', 'defaultParameters'];
  }

  /**
   * Validation complète d'un effet reconditionné
   */
  async validate(effectCode, originalCode) {
    console.log('🔍 Validation du reconditionnement...');
    
    const validation = {
      overall: { success: true, score: 0, maxScore: 100 },
      structure: this.validateStructure(effectCode),
      esm: this.validateESMFormat(effectCode),
      api: this.validateStandardAPI(effectCode),
      metadata: this.validateMetadata(effectCode),
      preservation: await this.validatePreservation(effectCode, originalCode),
      compatibility: this.validateCompatibility(effectCode),
      performance: this.validatePerformance(effectCode)
    };

    // Calcul du score global
    const categories = ['structure', 'esm', 'api', 'metadata', 'preservation', 'compatibility', 'performance'];
    let totalScore = 0;
    
    categories.forEach(category => {
      const categoryResult = validation[category];
      if (categoryResult.success) {
        totalScore += categoryResult.weight || 15;
      } else {
        validation.overall.success = false;
      }
    });

    validation.overall.score = totalScore;
    
    console.log(`📊 Score de validation: ${totalScore}/100`);
    return validation;
  }

  /**
   * Validation de la structure ESM
   */
  validateStructure(code) {
    const checks = {
      hasExportClass: /export\s+class\s+\w+/.test(code),
      hasDefaultExport: /export\s+default\s+\w+/.test(code),
      hasConstructor: /constructor\s*\([^)]*\)\s*{/.test(code),
      hasStaticMetadata: /static\s+metadata\s*=/.test(code),
      hasStaticParameters: /static\s+defaultParameters\s*=/.test(code)
    };

    const passed = Object.values(checks).filter(Boolean).length;
    const success = passed >= 4; // Au moins 4/5 checks doivent passer

    return {
      success,
      weight: 20,
      checks,
      score: (passed / Object.keys(checks).length) * 100,
      message: success ? 'Structure ESM valide' : 'Structure ESM incomplète'
    };
  }

  /**
   * Validation du format ESM
   */
  validateESMFormat(code) {
    const antiPatterns = [
      { pattern: /module\.exports\s*=/, issue: 'CommonJS export détecté' },
      { pattern: /require\s*\(/, issue: 'require() détecté (utilisez import)' },
      { pattern: /window\.\w+\s*=/, issue: 'Attribution globale détectée' },
      { pattern: /var\s+\w+\s*=\s*function/, issue: 'Déclaration var function (utilisez class/const)' }
    ];

    const issues = antiPatterns
      .filter(ap => ap.pattern.test(code))
      .map(ap => ap.issue);

    const hasValidImports = /import\s+.*\s+from\s+/.test(code) || code.indexOf('import') === -1;
    const hasValidExports = /export\s+(class|default|const|function)/.test(code);

    const success = issues.length === 0 && hasValidImports && hasValidExports;

    return {
      success,
      weight: 15,
      issues,
      hasValidImports,
      hasValidExports,
      message: success ? 'Format ESM correct' : `Problèmes ESM: ${issues.join(', ')}`
    };
  }

  /**
   * Validation de l'API standard
   */
  validateStandardAPI(code) {
    const foundMethods = this.requiredMethods.filter(method => {
      const pattern = new RegExp(`${method}\\s*\\([^)]*\\)\\s*{`);
      return pattern.test(code);
    });

    const missingMethods = this.requiredMethods.filter(method => !foundMethods.includes(method));
    
    const success = missingMethods.length === 0;
    const completeness = (foundMethods.length / this.requiredMethods.length) * 100;

    return {
      success,
      weight: 25,
      foundMethods,
      missingMethods,
      completeness,
      message: success ? 'API standard complète' : `Méthodes manquantes: ${missingMethods.join(', ')}`
    };
  }

  /**
   * Validation des métadonnées
   */
  validateMetadata(code) {
    const metadataMatch = code.match(/static\s+metadata\s*=\s*({[\s\S]*?});/);
    
    if (!metadataMatch) {
      return {
        success: false,
        weight: 15,
        message: 'Métadonnées statiques manquantes'
      };
    }

    try {
      // Extraction sécurisée des métadonnées
      const metadataStr = metadataMatch[1];
      
      // Vérifications basiques de structure
      const requiredFields = ['id', 'name', 'category', 'version', 'esm'];
      const hasRequiredFields = requiredFields.every(field => 
        metadataStr.includes(`"${field}"`) || metadataStr.includes(`${field}:`)
      );

      const hasValidCategory = /category\s*:\s*['"][\w|]+['"]/.test(metadataStr);
      const hasValidVersion = /version\s*:\s*['"][\d.]+['"]/.test(metadataStr);
      const hasESMFlag = /esm\s*:\s*true/.test(metadataStr);

      const success = hasRequiredFields && hasValidCategory && hasValidVersion && hasESMFlag;

      return {
        success,
        weight: 15,
        hasRequiredFields,
        hasValidCategory,
        hasValidVersion,
        hasESMFlag,
        message: success ? 'Métadonnées complètes et valides' : 'Métadonnées incomplètes'
      };

    } catch (error) {
      return {
        success: false,
        weight: 15,
        error: error.message,
        message: 'Erreur lors de l\'analyse des métadonnées'
      };
    }
  }

  /**
   * Validation de la préservation des fonctionnalités
   */
  async validatePreservation(effectCode, originalCode) {
    // Analyse comparative basique
    const originalComplexity = this.calculateComplexity(originalCode);
    const effectComplexity = this.calculateComplexity(effectCode);
    
    // Les fonctions/méthodes originales devraient être préservées d'une manière ou d'une autre
    const originalFunctions = this.extractFunctionNames(originalCode);
    const preservationIndicators = originalFunctions.filter(func => 
      effectCode.includes(`_original${func}`) || effectCode.includes(func)
    );

    const preservationRatio = originalFunctions.length > 0 ? 
      (preservationIndicators.length / originalFunctions.length) * 100 : 100;

    const success = preservationRatio >= 80; // Au moins 80% de préservation

    return {
      success,
      weight: 20,
      originalComplexity,
      effectComplexity,
      originalFunctions: originalFunctions.length,
      preservedIndicators: preservationIndicators.length,
      preservationRatio,
      message: success ? 
        `Préservation excellente (${preservationRatio.toFixed(1)}%)` : 
        `Préservation insuffisante (${preservationRatio.toFixed(1)}%)`
    };
  }

  /**
   * Validation de la compatibilité système
   */
  validateCompatibility(code) {
    const compatibilityChecks = {
      noGlobalConflicts: !/window\.\w+\s*=/.test(code),
      noConsolePolyfills: !/console\s*=/.test(code),
      modernSyntax: /=>\s*{/.test(code) || /class\s+\w+/.test(code),
      noEval: !/eval\s*\(/.test(code),
      noDocumentWrite: !/document\.write/.test(code)
    };

    const passed = Object.values(compatibilityChecks).filter(Boolean).length;
    const success = passed >= 4;

    return {
      success,
      weight: 10,
      checks: compatibilityChecks,
      score: (passed / Object.keys(compatibilityChecks).length) * 100,
      message: success ? 'Compatible avec le système' : 'Problèmes de compatibilité détectés'
    };
  }

  /**
   * Validation basique de performance
   */
  validatePerformance(code) {
    const performanceIssues = [
      { pattern: /setInterval\([^,]*,\s*[1-9]\)/, issue: 'setInterval avec intervalle trop court' },
      { pattern: /while\s*\(\s*true\s*\)/, issue: 'Boucle infinie détectée' },
      { pattern: /document\.createElement.*loop/, issue: 'Création DOM excessive' }
    ];

    const issues = performanceIssues
      .filter(pi => pi.pattern.test(code))
      .map(pi => pi.issue);

    // Indicateurs positifs de performance
    const optimizations = [
      { pattern: /requestAnimationFrame/, name: 'RequestAnimationFrame utilisé' },
      { pattern: /performance\.now/, name: 'Monitoring de performance' },
      { pattern: /cache|Cache/, name: 'Système de cache détecté' }
    ];

    const foundOptimizations = optimizations
      .filter(opt => opt.pattern.test(code))
      .map(opt => opt.name);

    const success = issues.length === 0;

    return {
      success,
      weight: 10,
      issues,
      optimizations: foundOptimizations,
      message: success ? 
        `Performance OK${foundOptimizations.length > 0 ? ' avec optimisations' : ''}` : 
        `Problèmes de performance: ${issues.join(', ')}`
    };
  }

  /**
   * Calcul de complexité pour comparaison
   */
  calculateComplexity(code) {
    const patterns = [
      { pattern: /function|=>/g, weight: 1 },
      { pattern: /class\s+\w+/g, weight: 3 },
      { pattern: /for|while/g, weight: 2 },
      { pattern: /if|switch/g, weight: 1 },
      { pattern: /try|catch/g, weight: 2 }
    ];

    return patterns.reduce((complexity, { pattern, weight }) => {
      const matches = code.match(pattern) || [];
      return complexity + (matches.length * weight);
    }, 0);
  }

  /**
   * Extraction des noms de fonction
   */
  extractFunctionNames(code) {
    const functionNames = new Set();
    
    // Fonctions normales
    const funcMatches = code.matchAll(/function\s+(\w+)\s*\(/g);
    for (const match of funcMatches) {
      functionNames.add(match[1]);
    }
    
    // Méthodes de classe
    const methodMatches = code.matchAll(/^\s*(\w+)\s*\([^)]*\)\s*{/gm);
    for (const match of methodMatches) {
      if (match[1] !== 'function' && match[1] !== 'if' && match[1] !== 'for') {
        functionNames.add(match[1]);
      }
    }
    
    // Fonctions fléchées nommées
    const arrowMatches = code.matchAll(/const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g);
    for (const match of arrowMatches) {
      functionNames.add(match[1]);
    }

    return Array.from(functionNames);
  }

  /**
   * Génère un rapport de validation détaillé
   */
  generateReport(validation) {
    const report = [`
# 📋 RAPPORT DE VALIDATION DU RECONDITIONNEMENT
=====================================

## 🎯 RÉSULTAT GLOBAL
**Succès:** ${validation.overall.success ? '✅ OUI' : '❌ NON'}
**Score:** ${validation.overall.score}/100

## 📊 DÉTAILS PAR CATÉGORIE
`];

    const categories = [
      { key: 'structure', name: '🏗️  Structure ESM', weight: 20 },
      { key: 'esm', name: '📦 Format ESM', weight: 15 },
      { key: 'api', name: '🔌 API Standard', weight: 25 },
      { key: 'metadata', name: '📝 Métadonnées', weight: 15 },
      { key: 'preservation', name: '🔒 Préservation', weight: 20 },
      { key: 'compatibility', name: '🤝 Compatibilité', weight: 10 },
      { key: 'performance', name: '⚡ Performance', weight: 10 }
    ];

    categories.forEach(({ key, name, weight }) => {
      const result = validation[key];
      report.push(`
### ${name} (${weight} points)
**Statut:** ${result.success ? '✅ VALIDÉ' : '❌ ÉCHEC'}
**Message:** ${result.message}
${result.score ? `**Score:** ${result.score.toFixed(1)}%` : ''}
`);

      // Détails spécifiques selon la catégorie
      if (key === 'api' && result.missingMethods?.length > 0) {
        report.push(`**Méthodes manquantes:** ${result.missingMethods.join(', ')}`);
      }
      
      if (key === 'preservation') {
        report.push(`**Fonctions originales:** ${result.originalFunctions}`);
        report.push(`**Préservées:** ${result.preservedIndicators}`);
        report.push(`**Taux de préservation:** ${result.preservationRatio.toFixed(1)}%`);
      }
      
      if (key === 'esm' && result.issues?.length > 0) {
        report.push(`**Problèmes:** ${result.issues.join(', ')}`);
      }
    });

    report.push(`
## 🚀 CONCLUSION
${validation.overall.success ? 
  '✅ L\'effet a été reconditionné avec succès et respecte tous les standards requis.' : 
  '⚠️ Le reconditionnement présente des problèmes qui doivent être corrigés.'}

**Compatibilité système:** ${validation.overall.score >= 80 ? 'EXCELLENTE' : 
  validation.overall.score >= 60 ? 'BONNE' : 'INSUFFISANTE'}
`);

    return report.join('\n');
  }
}

export default ReconditioningValidator;
