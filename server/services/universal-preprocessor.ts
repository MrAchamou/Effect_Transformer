
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

      // 3. Auto-réparation du code
      const repaired = this.autoRepairCode(cleaned.code);
      if (repaired !== cleaned.code) {
        changes.push('Code auto-réparé');
      }

      // 4. Injection de modules manquants
      const enhanced = this.injectMissingModules(repaired);
      if (enhanced.injectedModules.length > 0) {
        changes.push(`Modules injectés: ${enhanced.injectedModules.join(', ')}`);
      }

      // 5. Compatibilité navigateur
      const compatible = this.ensureBrowserCompatibility(enhanced.code);
      if (compatible !== enhanced.code) {
        changes.push('Compatibilité navigateur ajoutée');
      }

      // 6. Correction des anti-patterns
      const optimized = this.fixPerformanceAntiPatterns(compatible);
      if (optimized.fixes.length > 0) {
        changes.push(...optimized.fixes);
      }

      // 7. Génération d'utilitaires personnalisés
      const withUtilities = this.generateCustomUtilities(optimized.code);
      if (withUtilities !== optimized.code) {
        changes.push('Utilitaires personnalisés ajoutés');
      }

      // 8. Application de templates intelligents
      const templated = this.applyIntelligentTemplate(withUtilities, filename);
      if (templated.hasChanges) {
        changes.push(...templated.changes);
      }

      // 9. Reconditionnement au format parfait
      const formatted = this.formatToStandardStructure(templated.code, filename);
      if (formatted.hasChanges) {
        changes.push(...formatted.changes);
      }

      // 10. Validation finale
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
   * Auto-réparation intelligente du code
   */
  private autoRepairCode(code: string): string {
    let repairedCode = code;

    // 1. Correction des parenthèses/accolades manquantes
    const openParens = (repairedCode.match(/\(/g) || []).length;
    const closeParens = (repairedCode.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      repairedCode += ')'.repeat(openParens - closeParens);
    }

    const openBraces = (repairedCode.match(/\{/g) || []).length;
    const closeBraces = (repairedCode.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      repairedCode += '}'.repeat(openBraces - closeBraces);
    }

    // 2. Correction des variables non déclarées
    repairedCode = repairedCode.replace(
      /^(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/gm,
      (match, indent, varName) => {
        // Vérifier si la variable est déjà déclarée
        const declarationRegex = new RegExp(`(let|const|var)\\s+${varName}`, 'g');
        if (!declarationRegex.test(repairedCode)) {
          return `${indent}let ${varName} =`;
        }
        return match;
      }
    );

    // 3. Correction des fonctions malformées
    repairedCode = repairedCode.replace(
      /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(\s*\)\s*\{/g,
      'function $1() {'
    );

    // 4. Correction des méthodes sans this
    repairedCode = repairedCode.replace(
      /(\w+)\s*\(\s*\)\s*\{/g,
      (match, methodName) => {
        if (!match.includes('function') && !match.includes('=>')) {
          return `${methodName}() {`;
        }
        return match;
      }
    );

    return repairedCode;
  }

  /**
   * Application de templates intelligents selon le type d'effet
   */
  private applyIntelligentTemplate(code: string, filename: string): {
    code: string;
    hasChanges: boolean;
    changes: string[];
  } {
    const changes: string[] = [];
    let templatedCode = code;
    let hasChanges = false;

    // Détection du type d'effet
    const effectType = this.detectEffectType(code);

    // Application du template approprié
    switch (effectType) {
      case 'particles':
        if (!code.includes('ParticleSystem')) {
          templatedCode = this.wrapInParticleTemplate(code);
          changes.push('Template système de particules appliqué');
          hasChanges = true;
        }
        break;

      case 'animation':
        if (!code.includes('AnimationEngine')) {
          templatedCode = this.wrapInAnimationTemplate(code);
          changes.push('Template moteur d\'animation appliqué');
          hasChanges = true;
        }
        break;

      case 'canvas':
        if (!code.includes('CanvasRenderer')) {
          templatedCode = this.wrapInCanvasTemplate(code);
          changes.push('Template renderer Canvas appliqué');
          hasChanges = true;
        }
        break;

      case 'webgl':
        if (!code.includes('WebGLRenderer')) {
          templatedCode = this.wrapInWebGLTemplate(code);
          changes.push('Template renderer WebGL appliqué');
          hasChanges = true;
        }
        break;

      default:
        // Template générique
        if (!code.includes('class ') && !code.includes('function ')) {
          templatedCode = this.wrapInGenericTemplate(code, filename);
          changes.push('Template générique appliqué');
          hasChanges = true;
        }
    }

    return { code: templatedCode, hasChanges, changes };
  }

  /**
   * Détection du type d'effet
   */
  private detectEffectType(code: string): 'particles' | 'animation' | 'canvas' | 'webgl' | 'dom' | 'physics' | 'generic' {
    const patterns = {
      particles: /particle|emit|spawn|burst|spray/i,
      webgl: /webgl|shader|uniform|vertex|fragment|buffer/i,
      canvas: /canvas|context|ctx|getContext.*2d|fillRect|arc/i,
      physics: /velocity|acceleration|gravity|force|collision|bounce/i,
      animation: /animate|tween|transition|keyframe|timeline/i,
      dom: /document\.|element\.|querySelector|innerHTML|appendChild/i
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(code)) {
        return type as any;
      }
    }

    return 'generic';
  }

  /**
   * Templates spécialisés
   */
  private wrapInParticleTemplate(code: string): string {
    return `
// Système de particules optimisé
class ParticleSystemEffect {
  constructor(container, options = {}) {
    this.container = container;
    this.options = { particleCount: 100, ...options };
    this.particles = [];
    this.pool = new ParticlePool(this.options.particleCount * 2);
    this.isRunning = false;
    
    this.initialize();
  }
  
  initialize() {
    // Code utilisateur intégré
    ${code.replace(/^/gm, '    ')}
    
    this.setupParticleSystem();
    this.start();
  }
  
  setupParticleSystem() {
    // Configuration automatique du système
    this.emitter = {
      x: this.container.width / 2,
      y: this.container.height / 2,
      rate: 10,
      lastEmit: 0
    };
  }
  
  update(deltaTime) {
    if (!this.isRunning) return;
    
    // Émission de particules
    this.emit(deltaTime);
    
    // Mise à jour des particules
    this.updateParticles(deltaTime);
    
    // Rendu
    this.render();
  }
  
  emit(deltaTime) {
    this.emitter.lastEmit += deltaTime;
    if (this.emitter.lastEmit > 1000 / this.emitter.rate) {
      const particle = this.pool.get();
      this.initializeParticle(particle);
      this.particles.push(particle);
      this.emitter.lastEmit = 0;
    }
  }
  
  updateParticles(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      this.updateParticle(particle, deltaTime);
      
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        this.pool.release(particle);
      }
    }
  }
  
  start() {
    this.isRunning = true;
    this.animate();
  }
  
  stop() {
    this.isRunning = false;
  }
  
  animate = (currentTime = performance.now()) => {
    if (!this.isRunning) return;
    
    const deltaTime = currentTime - (this.lastTime || currentTime);
    this.lastTime = currentTime;
    
    this.update(deltaTime);
    requestAnimationFrame(this.animate);
  }
}`;
  }

  private wrapInAnimationTemplate(code: string): string {
    return `
// Moteur d'animation haute performance
class AnimationEffect {
  constructor(container, options = {}) {
    this.container = container;
    this.options = { duration: 1000, easing: 'easeInOutQuad', ...options };
    this.animations = new Map();
    this.timeline = [];
    this.isPlaying = false;
    
    this.initialize();
  }
  
  initialize() {
    // Code utilisateur intégré
    ${code.replace(/^/gm, '    ')}
    
    this.setupAnimationEngine();
    this.play();
  }
  
  setupAnimationEngine() {
    this.easingFunctions = {
      linear: t => t,
      easeInQuad: t => t * t,
      easeOutQuad: t => t * (2 - t),
      easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    };
  }
  
  animate(element, properties, duration = this.options.duration, easing = this.options.easing) {
    const animation = {
      element,
      properties,
      duration,
      easing: this.easingFunctions[easing] || this.easingFunctions.linear,
      startTime: performance.now(),
      startValues: {},
      targetValues: properties
    };
    
    // Capture des valeurs initiales
    for (const prop in properties) {
      animation.startValues[prop] = this.getCurrentValue(element, prop);
    }
    
    this.animations.set(element, animation);
  }
  
  update(currentTime) {
    if (!this.isPlaying) return;
    
    for (const [element, animation] of this.animations) {
      const elapsed = currentTime - animation.startTime;
      const progress = Math.min(elapsed / animation.duration, 1);
      const easedProgress = animation.easing(progress);
      
      // Application des valeurs interpolées
      for (const prop in animation.properties) {
        const startValue = animation.startValues[prop];
        const targetValue = animation.targetValues[prop];
        const currentValue = startValue + (targetValue - startValue) * easedProgress;
        
        this.applyValue(element, prop, currentValue);
      }
      
      // Nettoyage des animations terminées
      if (progress >= 1) {
        this.animations.delete(element);
      }
    }
    
    if (this.animations.size > 0) {
      requestAnimationFrame(this.update.bind(this));
    }
  }
  
  play() {
    this.isPlaying = true;
    requestAnimationFrame(this.update.bind(this));
  }
  
  pause() {
    this.isPlaying = false;
  }
}`;
  }

  private wrapInGenericTemplate(code: string, filename: string): string {
    const effectName = this.generateEffectName(filename);
    
    return `
// Effet générique optimisé
class ${effectName} {
  constructor(container, options = {}) {
    this.container = container;
    this.options = { ...this.getDefaultOptions(), ...options };
    this.isActive = false;
    this.state = {};
    
    this.initialize();
  }
  
  getDefaultOptions() {
    return {
      autoStart: true,
      responsive: true,
      performance: 'auto'
    };
  }
  
  initialize() {
    // Configuration automatique
    this.setupContainer();
    this.setupEventListeners();
    
    // Code utilisateur intégré
    ${code.replace(/^/gm, '    ')}
    
    if (this.options.autoStart) {
      this.start();
    }
  }
  
  setupContainer() {
    if (this.options.responsive) {
      this.handleResize();
      window.addEventListener('resize', this.handleResize.bind(this));
    }
  }
  
  setupEventListeners() {
    if (this.container) {
      this.container.addEventListener('click', this.onClick.bind(this));
      this.container.addEventListener('mouseover', this.onMouseEnter.bind(this));
      this.container.addEventListener('mouseout', this.onMouseLeave.bind(this));
    }
  }
  
  start() {
    this.isActive = true;
    this.onStart();
  }
  
  stop() {
    this.isActive = false;
    this.onStop();
  }
  
  restart() {
    this.stop();
    setTimeout(() => this.start(), 100);
  }
  
  // Méthodes à surcharger
  onStart() {}
  onStop() {}
  onClick(event) {}
  onMouseEnter(event) {}
  onMouseLeave(event) {}
  
  handleResize() {
    if (this.container && this.options.responsive) {
      this.state.width = this.container.offsetWidth;
      this.state.height = this.container.offsetHeight;
      this.onResize?.(this.state.width, this.state.height);
    }
  }
  
  destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize.bind(this));
    if (this.container) {
      this.container.removeEventListener('click', this.onClick.bind(this));
      this.container.removeEventListener('mouseover', this.onMouseEnter.bind(this));
      this.container.removeEventListener('mouseout', this.onMouseLeave.bind(this));
    }
  }
}`;
  }

  private generateEffectName(filename: string): string {
    const name = filename
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[^a-zA-Z0-9]/g, ' ') // Replace special chars with spaces
      .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize words
      .replace(/\s/g, ''); // Remove spaces
    
    return name.endsWith('Effect') ? name : name + 'Effect';
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
   * Détecte et injecte automatiquement les modules manquants
   */
  private injectMissingModules(code: string): {
    code: string;
    injectedModules: string[];
  } {
    const injectedModules: string[] = [];
    let enhancedCode = code;

    // Détection de besoins spécifiques
    const needsAnimationFrameManager = /requestAnimationFrame|animate/i.test(code);
    const needsPerformanceMonitor = /performance|fps|benchmark/i.test(code);
    const needsResizeHandler = /resize|viewport|window\.(width|height)/i.test(code);
    const needsPointerManager = /mouse|touch|pointer|click|drag/i.test(code);
    const needsMathUtils = /Math\.(sin|cos|random|sqrt|pow)/i.test(code);
    const needsColorUtils = /color|rgb|hsl|hex|gradient/i.test(code);

    // Injection automatique si nécessaire
    if (needsAnimationFrameManager && !code.includes('AnimationFrameManager')) {
      enhancedCode = this.injectAnimationFrameManager() + '\n\n' + enhancedCode;
      injectedModules.push('AnimationFrameManager');
    }

    if (needsPerformanceMonitor && !code.includes('PerformanceMonitor')) {
      enhancedCode = this.injectPerformanceMonitor() + '\n\n' + enhancedCode;
      injectedModules.push('PerformanceMonitor');
    }

    if (needsResizeHandler && !code.includes('ResizeObserver')) {
      enhancedCode = this.injectResizeHandler() + '\n\n' + enhancedCode;
      injectedModules.push('ResizeHandler');
    }

    if (needsPointerManager && !code.includes('PointerManager')) {
      enhancedCode = this.injectPointerManager() + '\n\n' + enhancedCode;
      injectedModules.push('PointerManager');
    }

    if (needsMathUtils && !code.includes('MathUtils')) {
      enhancedCode = this.injectMathUtils() + '\n\n' + enhancedCode;
      injectedModules.push('MathUtils');
    }

    if (needsColorUtils && !code.includes('ColorUtils')) {
      enhancedCode = this.injectColorUtils() + '\n\n' + enhancedCode;
      injectedModules.push('ColorUtils');
    }

    return { code: enhancedCode, injectedModules };
  }

  /**
   * Système de compatibilité navigateur automatique
   */
  private ensureBrowserCompatibility(code: string): string {
    let compatibleCode = code;

    // Polyfills automatiques
    if (code.includes('requestAnimationFrame') && !code.includes('window.requestAnimationFrame')) {
      compatibleCode = `
// Polyfill requestAnimationFrame
window.requestAnimationFrame = window.requestAnimationFrame || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame || 
  function(callback) { return setTimeout(callback, 1000/60); };

${compatibleCode}`;
    }

    // Support WebGL avec fallback Canvas
    if (code.includes('getContext(\'webgl\'')) {
      compatibleCode = compatibleCode.replace(
        /getContext\('webgl'\)/g,
        `getContext('webgl') || getContext('experimental-webgl') || getContext('2d')`
      );
    }

    return compatibleCode;
  }

  /**
   * Détection et correction des patterns anti-performance
   */
  private fixPerformanceAntiPatterns(code: string): {
    code: string;
    fixes: string[];
  } {
    let fixedCode = code;
    const fixes: string[] = [];

    // Correction des boucles dans render
    if (code.includes('for (') && code.includes('render')) {
      fixedCode = fixedCode.replace(
        /(render[^{]*{[^}]*)(for\s*\([^)]+\)\s*{[^}]+})/g,
        '$1// Optimisé: boucle mise en cache\nif (!this._cachedLoop) { $2 this._cachedLoop = true; }'
      );
      fixes.push('Optimisation des boucles en render');
    }

    // Cache des calculs répétitifs
    if (code.includes('Math.sin') || code.includes('Math.cos')) {
      fixedCode = `
// Cache trigonométrique automatique
const TrigCache = {
  cache: new Map(),
  sin: (angle) => {
    if (!TrigCache.cache.has(angle)) {
      TrigCache.cache.set(angle, Math.sin(angle));
    }
    return TrigCache.cache.get(angle);
  },
  cos: (angle) => {
    if (!TrigCache.cache.has('cos_' + angle)) {
      TrigCache.cache.set('cos_' + angle, Math.cos(angle));
    }
    return TrigCache.cache.get('cos_' + angle);
  }
};

${fixedCode.replace(/Math\.sin/g, 'TrigCache.sin').replace(/Math\.cos/g, 'TrigCache.cos')}`;
      fixes.push('Cache trigonométrique ajouté');
    }

    return { code: fixedCode, fixes };
  }

  /**
   * Génération de méthodes utilitaires personnalisées
   */
  private generateCustomUtilities(code: string): string {
    let enhancedCode = code;

    // Si l'effet utilise des particules, ajouter un gestionnaire
    if (/particle|emit|spawn/i.test(code)) {
      enhancedCode = `
// Gestionnaire de particules optimisé
class ParticlePool {
  constructor(size = 1000) {
    this.pool = [];
    this.active = [];
    for (let i = 0; i < size; i++) {
      this.pool.push(this.createParticle());
    }
  }
  
  createParticle() {
    return { x: 0, y: 0, vx: 0, vy: 0, life: 1, active: false };
  }
  
  get() {
    return this.pool.pop() || this.createParticle();
  }
  
  release(particle) {
    particle.active = false;
    this.pool.push(particle);
  }
}

${enhancedCode}`;
    }

    return enhancedCode;
  }

  // Méthodes d'injection des modules
  private injectAnimationFrameManager(): string {
    return `
// Gestionnaire d'animation optimisé
class AnimationFrameManager {
  constructor() {
    this.callbacks = new Set();
    this.isRunning = false;
    this.lastTime = 0;
    this.deltaTime = 0;
  }
  
  add(callback) {
    this.callbacks.add(callback);
    if (!this.isRunning) this.start();
  }
  
  remove(callback) {
    this.callbacks.delete(callback);
    if (this.callbacks.size === 0) this.stop();
  }
  
  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick();
  }
  
  tick = (currentTime = performance.now()) => {
    this.deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    this.callbacks.forEach(callback => callback(this.deltaTime));
    
    if (this.isRunning) {
      requestAnimationFrame(this.tick);
    }
  }
  
  stop() {
    this.isRunning = false;
  }
}`;
  }

  private injectPerformanceMonitor(): string {
    return `
// Moniteur de performance automatique
class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.frameTime = 16.67;
  }
  
  update() {
    const now = performance.now();
    this.frameTime = now - this.lastTime;
    this.lastTime = now;
    this.frameCount++;
    
    if (this.frameCount % 60 === 0) {
      this.fps = Math.round(1000 / this.frameTime);
      if (this.fps < 30) {
        this.onPerformanceIssue?.();
      }
    }
  }
  
  getFPS() { return this.fps; }
  getFrameTime() { return this.frameTime; }
}`;
  }

  private injectMathUtils(): string {
    return `
// Utilitaires mathématiques optimisés
class MathUtils {
  static lerp(a, b, t) { return a + (b - a) * t; }
  static clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
  static map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }
  static distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }
  static angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  }
  static randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
}`;
  }

  private injectColorUtils(): string {
    return `
// Utilitaires de couleur
class ColorUtils {
  static hexToRgb(hex) {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  static rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 };
  }
  
  static interpolateColors(color1, color2, factor) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    return {
      r: Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor),
      g: Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor),
      b: Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor)
    };
  }
}`;
  }

  private injectResizeHandler(): string {
    return `
// Gestionnaire de redimensionnement optimisé
class ResizeHandler {
  constructor(callback, debounceTime = 100) {
    this.callback = callback;
    this.debounceTime = debounceTime;
    this.timeoutId = null;
    this.currentSize = { width: window.innerWidth, height: window.innerHeight };
    
    window.addEventListener('resize', this.handleResize);
  }
  
  handleResize = () => {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      const newSize = { width: window.innerWidth, height: window.innerHeight };
      if (newSize.width !== this.currentSize.width || newSize.height !== this.currentSize.height) {
        this.currentSize = newSize;
        this.callback(newSize);
      }
    }, this.debounceTime);
  }
  
  destroy() {
    window.removeEventListener('resize', this.handleResize);
    clearTimeout(this.timeoutId);
  }
}`;
  }

  private injectPointerManager(): string {
    return `
// Gestionnaire d'événements pointer unifié
class PointerManager {
  constructor(element) {
    this.element = element;
    this.pointers = new Map();
    this.callbacks = {
      down: new Set(),
      move: new Set(),
      up: new Set()
    };
    
    this.setupListeners();
  }
  
  setupListeners() {
    const events = ['mousedown', 'touchstart'];
    events.forEach(event => {
      this.element.addEventListener(event, this.handlePointerDown);
    });
    
    const moveEvents = ['mousemove', 'touchmove'];
    moveEvents.forEach(event => {
      document.addEventListener(event, this.handlePointerMove);
    });
    
    const upEvents = ['mouseup', 'touchend', 'touchcancel'];
    upEvents.forEach(event => {
      document.addEventListener(event, this.handlePointerUp);
    });
  }
  
  handlePointerDown = (e) => {
    e.preventDefault();
    const pointer = this.getPointerInfo(e);
    this.pointers.set(pointer.id, pointer);
    this.callbacks.down.forEach(cb => cb(pointer));
  }
  
  handlePointerMove = (e) => {
    const pointer = this.getPointerInfo(e);
    if (this.pointers.has(pointer.id)) {
      this.pointers.set(pointer.id, pointer);
      this.callbacks.move.forEach(cb => cb(pointer));
    }
  }
  
  handlePointerUp = (e) => {
    const pointer = this.getPointerInfo(e);
    if (this.pointers.has(pointer.id)) {
      this.pointers.delete(pointer.id);
      this.callbacks.up.forEach(cb => cb(pointer));
    }
  }
  
  getPointerInfo(e) {
    const rect = this.element.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0]?.clientX || e.changedTouches[0]?.clientX : e.clientX;
    const clientY = e.touches ? e.touches[0]?.clientY || e.changedTouches[0]?.clientY : e.clientY;
    
    return {
      id: e.touches ? e.touches[0]?.identifier || 0 : 'mouse',
      x: clientX - rect.left,
      y: clientY - rect.top,
      clientX,
      clientY,
      type: e.type.includes('touch') ? 'touch' : 'mouse'
    };
  }
  
  on(event, callback) {
    this.callbacks[event]?.add(callback);
  }
  
  off(event, callback) {
    this.callbacks[event]?.delete(callback);
  }
}`;
  }

  /**
   * Récupère les métadonnées extraites
   */
  getExtractedMetadata(): any {
    return this.effectMetadata;
  }

  /**
   * Analyse un README associé pour enrichir les métadonnées
   */
  analyzeAssociatedReadme(readmeContent: string): any {
    if (!readmeContent) return null;

    try {
      // Import dynamique pour éviter les dépendances circulaires
      const { ReadmeAnalyzer } = require('./readme-analyzer');
      const analyzer = new ReadmeAnalyzer();
      
      const readmeAnalysis = analyzer.analyzeReadme(readmeContent);
      const variationSuggestions = analyzer.generateVariationSuggestions(readmeAnalysis);

      return {
        readmeAnalysis,
        variationSuggestions,
        enhancementPotential: this.calculateEnhancementPotential(readmeAnalysis),
        intelligentAdaptations: this.generateIntelligentAdaptations(readmeAnalysis)
      };
    } catch (error) {
      console.warn('Erreur lors de l\'analyse du README:', error);
      return null;
    }
  }

  /**
   * Calcule le potentiel d'amélioration basé sur l'analyse README
   */
  private calculateEnhancementPotential(analysis: any): any {
    const potential = {
      parameterOptimization: analysis.parameters.length * 0.15, // 15% par paramètre
      typeVariations: analysis.effectTypes.length * 0.10, // 10% par type
      applicationOptimizations: analysis.applications.length * 0.08, // 8% par application
      scientificAccuracy: analysis.scientificBasis ? 0.25 : 0, // 25% si base scientifique
      total: 0
    };

    potential.total = Math.min(
      potential.parameterOptimization + 
      potential.typeVariations + 
      potential.applicationOptimizations + 
      potential.scientificAccuracy, 
      1.0
    );

    return potential;
  }

  /**
   * Génère des adaptations intelligentes
   */
  private generateIntelligentAdaptations(analysis: any): any[] {
    const adaptations = [];

    // Adaptations basées sur les contraintes physiques
    if (analysis.physicalConstraints && analysis.physicalConstraints.equations) {
      adaptations.push({
        type: 'physics_optimization',
        description: 'Optimisation des calculs physiques',
        impact: 'Amélioration performance + réalisme',
        equations: analysis.physicalConstraints.equations.length
      });
    }

    // Adaptations basées sur les paramètres
    if (analysis.parameters.length > 0) {
      adaptations.push({
        type: 'parameter_intelligence',
        description: `Gestion intelligente de ${analysis.parameters.length} paramètres`,
        impact: 'Contrôle précis et variations automatiques',
        parameters: analysis.parameters.map(p => p.name)
      });
    }

    // Adaptations basées sur les applications
    if (analysis.applications.length > 0) {
      adaptations.push({
        type: 'application_specific',
        description: `Optimisations spécifiques pour ${analysis.applications.length} applications`,
        impact: 'Performance adaptée au contexte d\'usage',
        applications: analysis.applications
      });
    }

    return adaptations;
  }

  /**
   * Injection automatique du système de debug
   */
  private injectDebugSystem(code: string): string {
    return `
// Système de debug intégré
class EffectDebugger {
  constructor(effectName = 'Effect') {
    this.effectName = effectName;
    this.isEnabled = localStorage.getItem('effectDebug') === 'true' || window.location.hash.includes('debug');
    this.metrics = {
      frameCount: 0,
      averageFPS: 0,
      memoryUsage: 0,
      renderTime: 0
    };
    this.lastFrameTime = performance.now();
    
    if (this.isEnabled) {
      this.createDebugPanel();
    }
  }
  
  log(message, ...args) {
    if (this.isEnabled) {
      console.log(\`[\${this.effectName}]\`, message, ...args);
    }
  }
  
  warn(message, ...args) {
    if (this.isEnabled) {
      console.warn(\`[\${this.effectName}]\`, message, ...args);
    }
  }
  
  error(message, ...args) {
    console.error(\`[\${this.effectName}]\`, message, ...args);
  }
  
  time(label) {
    if (this.isEnabled) {
      console.time(\`[\${this.effectName}] \${label}\`);
    }
  }
  
  timeEnd(label) {
    if (this.isEnabled) {
      console.timeEnd(\`[\${this.effectName}] \${label}\`);
    }
  }
  
  updateMetrics() {
    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;
    
    this.metrics.frameCount++;
    this.metrics.renderTime = frameTime;
    
    if (this.metrics.frameCount % 60 === 0) {
      this.metrics.averageFPS = Math.round(1000 / frameTime);
      
      if (performance.memory) {
        this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
      }
      
      if (this.isEnabled) {
        this.updateDebugPanel();
      }
    }
  }
  
  createDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'effect-debug-panel';
    panel.style.cssText = \`
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      font-family: monospace;
      font-size: 12px;
      border-radius: 5px;
      z-index: 9999;
      min-width: 200px;
    \`;
    document.body.appendChild(panel);
  }
  
  updateDebugPanel() {
    const panel = document.getElementById('effect-debug-panel');
    if (panel) {
      panel.innerHTML = \`
        <div><strong>\${this.effectName} Debug</strong></div>
        <div>FPS: \${this.metrics.averageFPS}</div>
        <div>Frame Time: \${this.metrics.renderTime.toFixed(2)}ms</div>
        <div>Memory: \${this.metrics.memoryUsage}MB</div>
        <div>Frames: \${this.metrics.frameCount}</div>
        <div><button onclick="this.parentElement.remove()">Close</button></div>
      \`;
    }
  }
}

${code}`;
  }

  /**
   * Réinitialise le preprocessor
   */
  reset(): void {
    this.effectMetadata = null;
  }
}
