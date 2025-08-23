
/**
 * 🧠 CONTEXTUAL INTELLIGENCE MODERATOR
 * 
 * Module qui analyse le contexte d'un effet et modère intelligemment 
 * les améliorations pour éviter la sur-complexification
 */

export interface EffectComplexityProfile {
  original_complexity: 'simple' | 'moderate' | 'complex' | 'very_complex';
  effect_type: string;
  original_lines: number;
  core_functionality: string[];
  performance_requirements: 'light' | 'moderate' | 'heavy';
  visual_impact_needed: 'subtle' | 'moderate' | 'dramatic';
  recommended_enhancement_intensity: number; // 0.1 to 1.0
}

export interface ModerationStrategy {
  allow_full_enhancement: boolean;
  complexity_cap: number; // Maximum lines multiplier
  priority_modules: string[];
  forbidden_modules: string[];
  enhancement_focus: 'performance' | 'visual' | 'creative' | 'balanced';
  simplification_needed: boolean;
}

export class ContextualIntelligenceModerator {
  private complexityPatterns: Map<string, RegExp> = new Map();
  private effectTypeClassifier: EffectTypeClassifier;

  constructor() {
    this.initializeComplexityPatterns();
    this.effectTypeClassifier = new EffectTypeClassifier();
  }

  private initializeComplexityPatterns(): void {
    // Patterns pour détecter la complexité du code original
    this.complexityPatterns.set('simple_animation', /requestAnimationFrame|setInterval.*\d+.*ms/);
    this.complexityPatterns.set('basic_dom_manipulation', /\.style\.|\.innerHTML|\.textContent/);
    this.complexityPatterns.set('simple_canvas', /getContext.*2d.*fillRect|arc|lineTo/);
    this.complexityPatterns.set('basic_particles', /for.*particles.*length.*push/);
    this.complexityPatterns.set('complex_physics', /velocity|acceleration|gravity.*equations/);
    this.complexityPatterns.set('advanced_math', /Math\.(sin|cos|tan).*Math\.(sqrt|pow).*complex/);
    this.complexityPatterns.set('webgl_usage', /getContext.*webgl|shader|vertex|fragment/);
  }

  /**
   * 🎯 ANALYSE PRINCIPALE - Détermine si l'effet a besoin d'être modéré
   */
  public analyzeEffectComplexity(originalCode: string, filename: string): EffectComplexityProfile {
    const lines = originalCode.split('\n').length;
    const coreFeatures = this.extractCoreFeatures(originalCode);
    const effectType = this.classifyEffectType(originalCode, filename);
    
    const complexity = this.determineOriginalComplexity(originalCode, lines);
    const visualImpact = this.assessRequiredVisualImpact(effectType, originalCode);
    const performance = this.assessPerformanceRequirements(originalCode, lines);

    return {
      original_complexity: complexity,
      effect_type: effectType,
      original_lines: lines,
      core_functionality: coreFeatures,
      performance_requirements: performance,
      visual_impact_needed: visualImpact,
      recommended_enhancement_intensity: this.calculateOptimalEnhancementIntensity(
        complexity, effectType, lines, visualImpact
      )
    };
  }

  /**
   * 🎛️ GÉNÉRATION DE STRATÉGIE DE MODÉRATION
   */
  public generateModerationStrategy(
    profile: EffectComplexityProfile, 
    requestedLevel: number
  ): ModerationStrategy {
    console.log(`🧠 Modération contextuelle pour effet ${profile.effect_type} niveau ${requestedLevel}`);

    // CAS CRITIQUE : Effets simples avec niveau 3
    if (this.isOverEnhancementRisk(profile, requestedLevel)) {
      return this.createProtectiveStrategy(profile, requestedLevel);
    }

    // CAS NORMAL : Modération intelligente
    return this.createBalancedStrategy(profile, requestedLevel);
  }

  /**
   * 🚨 DÉTECTION DES RISQUES DE SUR-AMÉLIORATION
   */
  private isOverEnhancementRisk(profile: EffectComplexityProfile, level: number): boolean {
    // Effets simples + niveau élevé = RISQUE
    if (profile.original_complexity === 'simple' && level >= 3) {
      console.log(`⚠️  RISQUE DÉTECTÉ : Effet simple "${profile.effect_type}" avec niveau ${level}`);
      return true;
    }

    // Effets basiques avec beaucoup de lignes potentielles
    if (profile.original_lines < 50 && level >= 3) {
      console.log(`⚠️  RISQUE DÉTECTÉ : Code court (${profile.original_lines} lignes) avec niveau élevé`);
      return true;
    }

    // Effets UI/UX simples
    if (['button_hover', 'simple_transition', 'loading_spinner', 'menu_animation'].includes(profile.effect_type)) {
      console.log(`⚠️  RISQUE DÉTECTÉ : Effet UI simple avec amélioration complexe`);
      return true;
    }

    return false;
  }

  /**
   * 🛡️ STRATÉGIE PROTECTIVE - Pour éviter la sur-complexification
   */
  private createProtectiveStrategy(profile: EffectComplexityProfile, level: number): ModerationStrategy {
    console.log(`🛡️  Mode PROTECTION activé pour ${profile.effect_type}`);

    return {
      allow_full_enhancement: false,
      complexity_cap: this.calculateProtectiveCap(profile),
      priority_modules: this.selectConservativeModules(profile),
      forbidden_modules: this.getForbiddenModulesForSimpleEffects(),
      enhancement_focus: this.determineProtectiveFocus(profile),
      simplification_needed: level > 2
    };
  }

  private calculateProtectiveCap(profile: EffectComplexityProfile): number {
    // Limite l'augmentation du code selon l'effet original
    switch (profile.original_complexity) {
      case 'simple': return 3.0; // Max 3x la taille originale
      case 'moderate': return 4.0;
      case 'complex': return 6.0;
      case 'very_complex': return 10.0;
      default: return 3.0;
    }
  }

  private selectConservativeModules(profile: EffectComplexityProfile): string[] {
    const safeModules: string[] = [];

    // Modules sûrs selon le type d'effet
    if (profile.effect_type.includes('animation')) {
      safeModules.push('smart-optimizer', 'performance-boost', 'timing-master');
    }
    
    if (profile.effect_type.includes('visual')) {
      safeModules.push('color-harmonizer', 'visual-focus-engine');
    }

    if (profile.performance_requirements === 'light') {
      safeModules.push('code-compressor', 'efficiency-optimizer');
    }

    // JAMAIS plus de 4 modules pour les effets simples
    return safeModules.slice(0, 4);
  }

  private getForbiddenModulesForSimpleEffects(): string[] {
    return [
      'atmospheric-physics-engine',
      'quantum-mechanics-simulator',
      'fluid-dynamics-calculator',
      'weather-simulation-system',
      'particle-coalescence-engine',
      'thermodynamic-processor',
      'electromagnetic-field-simulator',
      'chaos-theory-generator',
      'fractal-mathematics-engine',
      'relativistic-physics-engine'
    ];
  }

  private determineProtectiveFocus(profile: EffectComplexityProfile): 'performance' | 'visual' | 'creative' | 'balanced' {
    if (profile.performance_requirements === 'light') return 'performance';
    if (profile.visual_impact_needed === 'subtle') return 'visual';
    return 'balanced';
  }

  /**
   * ⚖️ STRATÉGIE ÉQUILIBRÉE - Pour les cas normaux
   */
  private createBalancedStrategy(profile: EffectComplexityProfile, level: number): ModerationStrategy {
    const enhancementIntensity = profile.recommended_enhancement_intensity;
    
    return {
      allow_full_enhancement: enhancementIntensity > 0.7,
      complexity_cap: this.calculateBalancedCap(profile, level),
      priority_modules: this.selectBalancedModules(profile, level),
      forbidden_modules: [],
      enhancement_focus: this.determineBalancedFocus(profile),
      simplification_needed: false
    };
  }

  private calculateBalancedCap(profile: EffectComplexityProfile, level: number): number {
    const baseMultiplier = level * 2;
    const complexityAdjustment = {
      'simple': 0.5,
      'moderate': 1.0,
      'complex': 1.5,
      'very_complex': 2.0
    }[profile.original_complexity] || 1.0;

    return baseMultiplier * complexityAdjustment;
  }

  private selectBalancedModules(profile: EffectComplexityProfile, level: number): string[] {
    const modules: string[] = [];
    const maxModules = Math.min(level * 3, 12); // Maximum raisonnable

    // Sélection intelligente selon le profil
    if (profile.performance_requirements === 'heavy') {
      modules.push('performance-adaptive-engine', 'resource-optimization');
    }

    if (profile.visual_impact_needed === 'dramatic') {
      modules.push('creative-ai-core', 'visual-enhancement-engine');
    }

    // Ajout progressif selon le niveau
    const levelModules = this.getLevelAppropriateModules(level);
    modules.push(...levelModules);

    return modules.slice(0, maxModules);
  }

  private getLevelAppropriateModules(level: number): string[] {
    const modulesByLevel = {
      1: ['smart-optimizer', 'color-harmonizer'],
      2: ['performance-boost', 'visual-focus-engine', 'timing-master'],
      3: ['creative-ai-core', 'adaptive-rendering', 'intelligent-caching'],
      4: ['advanced-physics', 'complex-animations', 'ai-predictor'],
      5: ['quantum-effects', 'neural-enhancement', 'reality-distortion'],
      6: ['consciousness-engine', 'universe-simulator', 'time-manipulation']
    };

    return modulesByLevel[level] || [];
  }

  /**
   * 📊 MÉTHODES D'ANALYSE DÉTAILLÉE
   */
  private determineOriginalComplexity(code: string, lines: number): 'simple' | 'moderate' | 'complex' | 'very_complex' {
    let complexityScore = 0;

    // Analyse du nombre de lignes
    if (lines < 30) complexityScore += 0;
    else if (lines < 100) complexityScore += 1;
    else if (lines < 300) complexityScore += 2;
    else complexityScore += 3;

    // Analyse des patterns
    for (const [pattern, regex] of this.complexityPatterns) {
      if (regex.test(code)) {
        if (pattern.includes('simple')) complexityScore += 0.5;
        else if (pattern.includes('basic')) complexityScore += 1;
        else if (pattern.includes('complex')) complexityScore += 2;
        else if (pattern.includes('advanced')) complexityScore += 3;
      }
    }

    // Classification finale
    if (complexityScore <= 2) return 'simple';
    if (complexityScore <= 5) return 'moderate';
    if (complexityScore <= 8) return 'complex';
    return 'very_complex';
  }

  private classifyEffectType(code: string, filename: string): string {
    const name = filename.toLowerCase();
    
    // Classification par nom de fichier
    if (name.includes('rain') || name.includes('pluie')) return 'rain_simulation';
    if (name.includes('button') || name.includes('hover')) return 'button_hover';
    if (name.includes('menu') || name.includes('nav')) return 'menu_animation';
    if (name.includes('load') || name.includes('spinner')) return 'loading_spinner';
    if (name.includes('particle')) return 'particle_system';
    if (name.includes('3d') || name.includes('webgl')) return '3d_animation';

    // Classification par contenu
    if (/rain|drop|weather|precipitation/i.test(code)) return 'weather_effect';
    if (/button|hover|click|interaction/i.test(code)) return 'ui_interaction';
    if (/particle|explosion|fire|smoke/i.test(code)) return 'particle_effect';
    
    return 'generic_effect';
  }

  private extractCoreFeatures(code: string): string[] {
    const features: string[] = [];

    if (/canvas/i.test(code)) features.push('canvas_rendering');
    if (/animation/i.test(code)) features.push('animation');
    if (/interaction|event/i.test(code)) features.push('user_interaction');
    if (/particle/i.test(code)) features.push('particle_system');
    if (/physics|velocity|gravity/i.test(code)) features.push('physics_simulation');
    if (/sound|audio/i.test(code)) features.push('audio');
    if (/3d|webgl|matrix/i.test(code)) features.push('3d_graphics');

    return features;
  }

  private assessRequiredVisualImpact(effectType: string, code: string): 'subtle' | 'moderate' | 'dramatic' {
    // Effets UI = impact subtil
    if (['button_hover', 'menu_animation', 'loading_spinner'].includes(effectType)) {
      return 'subtle';
    }

    // Effets météo/naturels = impact dramatique
    if (['weather_effect', 'particle_effect', 'rain_simulation'].includes(effectType)) {
      return 'dramatic';
    }

    return 'moderate';
  }

  private assessPerformanceRequirements(code: string, lines: number): 'light' | 'moderate' | 'heavy' {
    if (lines < 50 && !(/physics|particle|3d/i.test(code))) return 'light';
    if (lines > 200 || /physics|particle|webgl/i.test(code)) return 'heavy';
    return 'moderate';
  }

  private calculateOptimalEnhancementIntensity(
    complexity: string, 
    effectType: string, 
    lines: number, 
    visualImpact: string
  ): number {
    let intensity = 0.5; // Base

    // Ajustement selon la complexité
    const complexityBonus = {
      'simple': -0.3,
      'moderate': 0,
      'complex': 0.2,
      'very_complex': 0.4
    }[complexity] || 0;

    intensity += complexityBonus;

    // Ajustement selon l'impact visuel requis
    const impactBonus = {
      'subtle': -0.2,
      'moderate': 0,
      'dramatic': 0.3
    }[visualImpact] || 0;

    intensity += impactBonus;

    // Ajustement selon la taille
    if (lines < 30) intensity -= 0.2;
    if (lines > 200) intensity += 0.2;

    return Math.max(0.1, Math.min(1.0, intensity));
  }

  private determineBalancedFocus(profile: EffectComplexityProfile): 'performance' | 'visual' | 'creative' | 'balanced' {
    if (profile.performance_requirements === 'heavy') return 'performance';
    if (profile.visual_impact_needed === 'dramatic') return 'creative';
    if (profile.original_complexity === 'simple') return 'visual';
    return 'balanced';
  }
}

/**
 * 🏷️ CLASSIFICATEUR DE TYPE D'EFFET
 */
class EffectTypeClassifier {
  private typePatterns: Map<string, RegExp> = new Map();

  constructor() {
    this.initializeTypePatterns();
  }

  private initializeTypePatterns(): void {
    this.typePatterns.set('rain_simulation', /rain|pluie|drop|goutte|precipitation/i);
    this.typePatterns.set('button_hover', /button|hover|click|ripple/i);
    this.typePatterns.set('menu_animation', /menu|nav|dropdown|sidebar/i);
    this.typePatterns.set('loading_spinner', /load|spinner|progress|preload/i);
    this.typePatterns.set('particle_system', /particle|explosion|fire|smoke|magic/i);
    this.typePatterns.set('text_effect', /text|font|typewriter|glitch/i);
    this.typePatterns.set('image_effect', /image|photo|gallery|slideshow/i);
    this.typePatterns.set('3d_animation', /3d|webgl|camera|matrix|perspective/i);
    this.typePatterns.set('audio_effect', /audio|sound|music|voice/i);
    this.typePatterns.set('video_effect', /video|film|morphing|composite/i);
  }

  classify(code: string, filename: string): string {
    for (const [type, pattern] of this.typePatterns) {
      if (pattern.test(code) || pattern.test(filename)) {
        return type;
      }
    }
    return 'generic_effect';
  }
}

export default ContextualIntelligenceModerator;
