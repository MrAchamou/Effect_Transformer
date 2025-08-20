export class CodeValidator {
  async validateCode(code: string): Promise<{ valid: boolean; error?: string }> {
    try {
      // 1. Syntax validation
      new Function(code);
      
      // 2. Size validation (max 1MB)
      if (code.length > 1024 * 1024) {
        return { valid: false, error: 'Le fichier est trop volumineux (max 1MB)' };
      }
      
      // 3. Detect dangerous patterns
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
      
      // 4. Check for minimum content
      if (code.trim().length < 10) {
        return { valid: false, error: 'Le fichier semble vide ou trop court' };
      }
      
      // 5. Basic JavaScript structure check
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

  sanitizeCode(code: string): string {
    // Remove potentially dangerous content
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .trim();
  }
}
