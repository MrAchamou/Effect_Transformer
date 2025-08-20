export class CodeValidator {
  async validateCode(code: string): Promise<{ valid: boolean; error?: string }> {
    try {
      // 1. Préparation du code pour validation
      let validationCode = this.prepareCodeForValidation(code);
      
      // 2. Tentative de validation JavaScript
      try {
        new Function(validationCode);
      } catch (syntaxError) {
        // Tentative avec correction automatique
        const correctedCode = this.autoCorrectForValidation(code);
        new Function(correctedCode);
      }
      
      // 3. Size validation (max 1MB)
      if (code.length > 1024 * 1024) {
        return { valid: false, error: 'Le fichier est trop volumineux (max 1MB)' };
      }
      
      // 4. Detect dangerous patterns
      const dangerousPatterns = [
        /eval\s*\(/,
        /document\.write\s*\(/,
        /innerHTML\s*=/,
        /Function\s*\(/,
        /setTimeout\s*\(\s*['"`][^'"`]*['"`]/,
        /setInterval\s*\(\s*['"`][^'"`]*['"`]/
      ];
      
      for (const pattern of dangerousPatterns) {
        if (pattern.test(code)) {
          return { valid: false, error: 'Code potentiellement dangereux détecté' };
        }
      }
      
      // 5. Check for minimum content
      if (code.trim().length < 10) {
        return { valid: false, error: 'Le fichier semble vide ou trop court' };
      }
      
      // 6. Basic JavaScript structure check
      if (!this.hasValidJSStructure(code)) {
        return { valid: false, error: 'Structure JavaScript invalide' };
      }
      
      return { valid: true };
      
    } catch (error) {
      return { 
        valid: false, 
        error: `Erreur de syntaxe JavaScript: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  private hasValidJSStructure(code: string): boolean {
    // Check for basic JavaScript elements
    const hasVariableDeclaration = /(?:var|let|const)\s+\w+/.test(code);
    const hasFunctionDeclaration = /function\s+\w+\s*\(/.test(code);
    const hasArrowFunction = /\w+\s*=>\s*/.test(code);
    const hasMethodCall = /\w+\.\w+\s*\(/.test(code);
    const hasObjectLiteral = /\{\s*\w+\s*:/.test(code);
    
    // Should have at least one of these patterns
    return hasVariableDeclaration || hasFunctionDeclaration || 
           hasArrowFunction || hasMethodCall || hasObjectLiteral;
  }

  /**
   * Prépare le code pour la validation en supprimant les éléments problématiques
   */
  private prepareCodeForValidation(code: string): string {
    let prepared = code;
    
    // Suppression des exports/imports ES6
    prepared = prepared.replace(/export\s+(?:default\s+)?/g, '');
    prepared = prepared.replace(/import\s+.*?from\s+['"][^'"]*['"];\s*/g, '');
    
    // Simplification des template literals complexes
    prepared = prepared.replace(/`[\s\S]*?`/g, '"TEMPLATE_LITERAL"');
    
    // Simplification des regex complexes
    prepared = prepared.replace(/\/[^\/\n]+\/[gimuy]*/g, '/REGEX/g');
    
    return prepared;
  }

  /**
   * Correction automatique basique pour la validation
   */
  private autoCorrectForValidation(code: string): string {
    let corrected = this.prepareCodeForValidation(code);
    
    // Correction des erreurs de syntaxe communes
    corrected = corrected.replace(/([^;\s}])\s*\n\s*([a-zA-Z])/g, '$1;\n$2');
    
    // Correction des accolades manquantes
    const openBraces = (corrected.match(/{/g) || []).length;
    const closeBraces = (corrected.match(/}/g) || []).length;
    if (openBraces > closeBraces) {
      corrected += '\n' + '}'.repeat(openBraces - closeBraces);
    }
    
    // Correction des parenthèses manquantes  
    const openParens = (corrected.match(/\(/g) || []).length;
    const closeParens = (corrected.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      corrected += ')'.repeat(openParens - closeParens);
    }
    
    return corrected;
  }

  sanitizeCode(code: string): string {
    // Remove potentially dangerous content
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .trim();
  }
}
