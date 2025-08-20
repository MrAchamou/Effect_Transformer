/**
 * Service de classification intelligente des effets JavaScript
 * Détermine automatiquement les niveaux disponibles selon la catégorie de l'effet
 */

interface EffectCategory {
  name: string;
  subcategories: string[];
  availableLevels: number[];
  reason: string;
  description: string;
  category_type: 'complete' | 'moderate' | 'revolutionary';
  icon: string;
}

interface ClassificationResult {
  category: string;
  subcategory: string;
  availableLevels: number[];
  reason: string;
  confidence: number;
  recommendations: string[];
  category_type?: 'complete' | 'moderate' | 'revolutionary';
  icon?: string;
}

export class IntelligentCategorizer {
  private categories: Record<string, EffectCategory> = {
    // 🟢 NIVEAU 1 SEULEMENT - Effets "complets" qui n'ont pas besoin de plus
    ui_ux: {
      name: "Interface Utilisateur (UI/UX)",
      subcategories: [
        'animations_boutons', 'effets_loading', 'preloaders',
        'animations_navigation', 'menus', 'micro_interactions',
        'effets_hover', 'effets_focus', 'ripple', 'hover',
        'button', 'menu', 'navigation', 'loading'
      ],
      availableLevels: [1],
      reason: "Effet UI optimisé - Parfaitement complet au niveau Standard",
      description: "🟢 Effets d'interface utilisateur déjà optimisés qui n'ont pas besoin d'améliorations complexes",
      category_type: "complete",
      icon: "🎯"
    },

    transitions_simples: {
      name: "Transitions Basiques",
      subcategories: [
        'fade_transitions', 'slide_transitions', 'wipes_basiques',
        'fade', 'slide', 'wipe', 'simple_transition'
      ],
      availableLevels: [1],
      reason: "Transitions simples déjà complètes - Niveau Standard parfait",
      description: "🟢 Transitions basiques qui fonctionnent parfaitement sans améliorations",
      category_type: "complete",
      icon: "⚡"
    },

    // 🟡 NIVEAUX 1 + 2 - Effets avec potentiel d'amélioration modéré
    texte: {
      name: "Effets de Texte",
      subcategories: [
        'typewriter', 'glitch_text', 'neon_text',
        'fade_text', 'slide_text', 'rotate_text',
        'morphing_text', 'text', 'typography', 'letter'
      ],
      availableLevels: [1, 2],
      reason: "Potentiel modéré d'amélioration avec IA",
      description: "🟡 Effets de texte avec possibilités d'optimisation intelligente (sauf effets 3D sur texte)",
      category_type: "moderate",
      icon: "📝"
    },

    images: {
      name: "Effets d'Images",
      subcategories: [
        'slideshow_effects', 'filtres_overlays', 
        'parallaxe', 'zoom_pan', 'revelations_images',
        'masques_creatifs', 'image', 'photo', 'gallery',
        'slideshow', 'parallax', 'zoom'
      ],
      availableLevels: [1, 2],
      reason: "Améliorations visuelles possibles avec IA",
      description: "🟡 Effets d'images avec potentiel d'amélioration modéré",
      category_type: "moderate",
      icon: "🖼️"
    },

    audio: {
      name: "Effets Audio",
      subcategories: [
        'effets_sonores', 'musiques_ambiance', 
        'transitions_audio', 'sound_design',
        'audio', 'sound', 'music', 'voice'
      ],
      availableLevels: [1, 2],
      reason: "Optimisations audio intelligentes disponibles",
      description: "🟡 Effets audio avec possibilités d'amélioration sonore",
      category_type: "moderate",
      icon: "🔊"
    },

    // 🔴 TOUS NIVEAUX (1, 2, 3+) - Effets avec énorme potentiel d'amélioration IA
    particules_simulation: {
      name: "Particules et Simulation",
      subcategories: [
        'systemes_particules', 'feu', 'fumee', 'neige',
        'effets_meteorologiques', 'simulations_physiques',
        'effets_magie', 'effets_fantastique',
        'particle', 'fire', 'smoke', 'snow', 'weather',
        'physics', 'magic', 'fantasy', 'explosion'
      ],
      availableLevels: [1, 2, 3, 4, 5, 6],
      reason: "🚀 ÉNORME potentiel d'amélioration IA - Tous niveaux recommandés",
      description: "🔴 Systèmes complexes avec potentiel révolutionnaire d'amélioration",
      category_type: "revolutionary",
      icon: "✨"
    },

    motion_3d: {
      name: "Animation 3D et Mouvement",
      subcategories: [
        'elements_3d_animes', 'effets_camera', 'mouvements',
        'rendus_visualisations', 'templates_after_effects',
        'effets_3d_texte', '3d', 'camera', 'movement',
        'render', 'visualization', 'rotation', 'transform',
        'matrix', 'perspective', 'depth'
      ],
      availableLevels: [1, 2, 3, 4, 5, 6],
      reason: "🚀 Technologies 3D avancées - Maximum d'améliorations IA possible",
      description: "🔴 Effets 3D complexes avec potentiel maximal d'optimisation (inclut les effets 3D sur texte)",
      category_type: "revolutionary",
      icon: "🎮"
    },

    video_avance: {
      name: "Vidéo et Post-Production",
      subcategories: [
        'morphing_video', 'post_production', 'color_grading',
        'overlays_animes', 'green_screen', 'compositing',
        'video', 'morphing', 'grading', 'overlay',
        'composite', 'chroma', 'filter'
      ],
      availableLevels: [1, 2, 3, 4, 5, 6],
      reason: "🚀 Traitement vidéo complexe - IA révolutionnaire applicable",
      description: "🔴 Effets vidéo avancés nécessitant toute la puissance de l'IA",
      category_type: "revolutionary",
      icon: "🎬"
    }
  };

  /**
   * Analyse le code JavaScript et détermine sa catégorie
   */
  analyzeEffect(filename: string, code: string): ClassificationResult {
    const analysis = this.performDeepAnalysis(filename, code);
    const category = this.classifyByContent(analysis);
    
    return {
      category: category.name,
      subcategory: analysis.detectedSubcategory,
      availableLevels: category.availableLevels,
      reason: category.reason,
      confidence: analysis.confidence,
      recommendations: this.generateRecommendations(category, analysis),
      category_type: category.category_type,
      icon: category.icon
    };
  }

  /**
   * Analyse approfondie du contenu du fichier
   */
  private performDeepAnalysis(filename: string, code: string): {
    keywords: string[];
    patterns: string[];
    complexity: 'low' | 'medium' | 'high' | 'very_high';
    detectedSubcategory: string;
    confidence: number;
  } {
    const lowerFilename = filename.toLowerCase();
    const lowerCode = code.toLowerCase();
    
    // Extraction des mots-clés
    const keywords = this.extractKeywords(lowerFilename + ' ' + lowerCode);
    
    // Détection de patterns techniques
    const patterns = this.detectTechnicalPatterns(code);
    
    // Évaluation de la complexité
    const complexity = this.evaluateComplexity(code, patterns);
    
    // Détection de la sous-catégorie
    const detectedSubcategory = this.detectSubcategory(keywords, patterns);
    
    // Calcul de la confiance
    const confidence = this.calculateConfidence(keywords, patterns, complexity);

    return {
      keywords,
      patterns,
      complexity,
      detectedSubcategory,
      confidence
    };
  }

  /**
   * Extraction des mots-clés pertinents
   */
  private extractKeywords(text: string): string[] {
    const keywordRegexes = [
      /particle|particule/g,
      /3d|three|webgl/g,
      /animation|animate/g,
      /button|bouton|hover/g,
      /text|texte|font/g,
      /image|img|photo/g,
      /video|film/g,
      /audio|sound|music/g,
      /fire|feu|flame/g,
      /smoke|fumee/g,
      /snow|neige/g,
      /magic|magie/g,
      /camera|perspective/g,
      /transition|fade|slide/g,
      /loading|preloader/g,
      /menu|navigation/g
    ];

    const keywords: string[] = [];
    keywordRegexes.forEach(regex => {
      const matches = text.match(regex);
      if (matches) keywords.push(...matches);
    });

    return Array.from(new Set(keywords));
  }

  /**
   * Détection des patterns techniques
   */
  private detectTechnicalPatterns(code: string): string[] {
    const patterns: string[] = [];

    // Patterns 3D
    if (/Math\.(sin|cos|tan)|matrix|transform|rotate|perspective/i.test(code)) {
      patterns.push('3d_math');
    }

    // Patterns de particules
    if (/particle|\.length.*for|array.*push/i.test(code)) {
      patterns.push('particle_system');
    }

    // Patterns WebGL
    if (/webgl|gl\.|shader|vertex|fragment/i.test(code)) {
      patterns.push('webgl');
    }

    // Patterns d'animation
    if (/requestAnimationFrame|setInterval|transition|animate/i.test(code)) {
      patterns.push('animation');
    }

    // Patterns de physique
    if (/velocity|acceleration|gravity|physics/i.test(code)) {
      patterns.push('physics');
    }

    // Patterns d'interaction
    if (/addEventListener|onclick|hover|mouseover/i.test(code)) {
      patterns.push('interaction');
    }

    // Patterns de rendu
    if (/canvas|ctx\.|getContext|drawImage|fillRect/i.test(code)) {
      patterns.push('rendering');
    }

    return patterns;
  }

  /**
   * Évaluation de la complexité du code
   */
  private evaluateComplexity(code: string, patterns: string[]): 'low' | 'medium' | 'high' | 'very_high' {
    let complexityScore = 0;

    // Facteurs de complexité
    complexityScore += Math.min(code.length / 1000, 10); // Longueur du code
    complexityScore += patterns.length * 2; // Nombre de patterns
    complexityScore += (code.match(/function|class|if|for|while/g) || []).length * 0.5; // Structures de contrôle
    complexityScore += (code.match(/Math\./g) || []).length * 1; // Calculs mathématiques

    if (complexityScore < 5) return 'low';
    if (complexityScore < 15) return 'medium';
    if (complexityScore < 30) return 'high';
    return 'very_high';
  }

  /**
   * Détection de la sous-catégorie
   */
  private detectSubcategory(keywords: string[], patterns: string[]): string {
    // Logique de détection basée sur les mots-clés et patterns
    if (keywords.some(k => /particle|fire|smoke|snow|magic/.test(k))) {
      return 'systemes_particules';
    }
    if (keywords.some(k => /3d|webgl|camera|perspective/.test(k)) || patterns.includes('3d_math')) {
      return 'elements_3d_animes';
    }
    if (keywords.some(k => /button|hover|menu|navigation/.test(k))) {
      return 'micro_interactions';
    }
    if (keywords.some(k => /text|font|typography/.test(k))) {
      return 'effets_texte';
    }
    if (keywords.some(k => /video|film/.test(k))) {
      return 'effets_video';
    }
    if (keywords.some(k => /fade|slide|transition/.test(k))) {
      return 'transitions_simples';
    }

    return 'effet_generique';
  }

  /**
   * Classification par contenu utilisant l'algorithme intelligent
   */
  private classifyByContent(analysis: any): EffectCategory {
    const { keywords, patterns, complexity, detectedSubcategory } = analysis;
    
    // Applique l'algorithme de détection des niveaux disponibles
    const detectionResult = this.detectAvailableLevels(
      detectedSubcategory, 
      keywords, 
      patterns, 
      complexity
    );

    return detectionResult.category;
  }

  /**
   * Algorithme de détection intelligent des niveaux disponibles
   */
  private detectAvailableLevels(
    effectName: string, 
    keywords: string[], 
    patterns: string[], 
    complexity: string
  ): { category: EffectCategory; levels: number[]; reason: string } {
    
    // 🟢 Niveau 1 seulement - Effets UI/UX et transitions simples
    if (this.isUIUXEffect(keywords, patterns) || this.isSimpleTransition(effectName, keywords)) {
      return { 
        category: this.categories.ui_ux, 
        levels: [1], 
        reason: "Effet UI optimisé" 
      };
    }
    
    // 🟡 Niveaux 1+2 - Texte, images, audio (sauf 3D avancé)
    if (this.isTextEffect(keywords, patterns) && !this.isAdvanced3D(keywords, patterns)) {
      return { 
        category: this.categories.texte, 
        levels: [1, 2], 
        reason: "Potentiel modéré d'amélioration" 
      };
    }
    
    if (this.isImageEffect(keywords, patterns) && !this.isAdvanced3D(keywords, patterns)) {
      return { 
        category: this.categories.images, 
        levels: [1, 2], 
        reason: "Améliorations visuelles possibles" 
      };
    }
    
    if (this.isAudioEffect(keywords, patterns)) {
      return { 
        category: this.categories.audio, 
        levels: [1, 2], 
        reason: "Optimisations audio intelligentes" 
      };
    }
    
    // 🔴 Tous niveaux - Particules, 3D, vidéo complexe
    if (this.isParticleSimulation(keywords, patterns)) {
      return { 
        category: this.categories.particules_simulation, 
        levels: [1, 2, 3, 4, 5, 6], 
        reason: "Fort potentiel d'amélioration IA" 
      };
    }
    
    if (this.is3DMotion(keywords, patterns) || this.isAdvanced3D(keywords, patterns)) {
      return { 
        category: this.categories.motion_3d, 
        levels: [1, 2, 3, 4, 5, 6], 
        reason: "Technologies 3D avancées" 
      };
    }
    
    if (this.isAdvancedVideo(keywords, patterns)) {
      return { 
        category: this.categories.video_avance, 
        levels: [1, 2, 3, 4, 5, 6], 
        reason: "Traitement vidéo complexe" 
      };
    }
    
    // Fallback sécurisé
    return { 
      category: this.categories.texte, 
      levels: [1, 2], 
      reason: "Classification par défaut" 
    };
  }

  // Méthodes d'aide pour la détection
  private isUIUXEffect(keywords: string[], patterns: string[]): boolean {
    const uiKeywords = ['button', 'menu', 'navigation', 'loading', 'hover', 'ripple'];
    return keywords.some(k => uiKeywords.some(ui => k.includes(ui))) || 
           patterns.includes('interaction');
  }

  private isSimpleTransition(name: string, keywords: string[]): boolean {
    const transitionKeywords = ['fade', 'slide', 'wipe', 'transition'];
    return transitionKeywords.some(t => name.includes(t) || keywords.some(k => k.includes(t)));
  }

  private isTextEffect(keywords: string[], patterns: string[]): boolean {
    const textKeywords = ['text', 'font', 'typography', 'typewriter', 'glitch_text'];
    return keywords.some(k => textKeywords.some(t => k.includes(t)));
  }

  private isImageEffect(keywords: string[], patterns: string[]): boolean {
    const imageKeywords = ['image', 'photo', 'gallery', 'slideshow', 'parallax'];
    return keywords.some(k => imageKeywords.some(i => k.includes(i)));
  }

  private isAudioEffect(keywords: string[], patterns: string[]): boolean {
    const audioKeywords = ['audio', 'sound', 'music', 'voice'];
    return keywords.some(k => audioKeywords.some(a => k.includes(a)));
  }

  private isParticleSimulation(keywords: string[], patterns: string[]): boolean {
    const particleKeywords = ['particle', 'fire', 'smoke', 'snow', 'magic', 'physics'];
    return keywords.some(k => particleKeywords.some(p => k.includes(p))) || 
           patterns.includes('particle_system') || patterns.includes('physics');
  }

  private is3DMotion(keywords: string[], patterns: string[]): boolean {
    const motionKeywords = ['3d', 'camera', 'render', 'rotation', 'transform', 'matrix'];
    return keywords.some(k => motionKeywords.some(m => k.includes(m))) || 
           patterns.includes('3d_math') || patterns.includes('webgl');
  }

  private isAdvanced3D(keywords: string[], patterns: string[]): boolean {
    return patterns.includes('webgl') || patterns.includes('3d_math') ||
           keywords.some(k => k.includes('webgl') || k.includes('three') || k.includes('3d'));
  }

  private isAdvancedVideo(keywords: string[], patterns: string[]): boolean {
    const videoKeywords = ['video', 'morphing', 'grading', 'composite', 'chroma'];
    return keywords.some(k => videoKeywords.some(v => k.includes(v)));
  }

  /**
   * Calcule le score de correspondance avec une catégorie
   */
  private calculateCategoryMatch(analysis: any, category: EffectCategory): number {
    let score = 0;
    const totalPossible = category.subcategories.length;

    // Vérifier la correspondance des sous-catégories
    category.subcategories.forEach(subcategory => {
      if (analysis.keywords.some((k: string) => k.includes(subcategory) || subcategory.includes(k))) {
        score += 1;
      }
    });

    return score / totalPossible;
  }

  /**
   * Calcul de la confiance
   */
  private calculateConfidence(keywords: string[], patterns: string[], complexity: string): number {
    let confidence = 0.5; // Base

    confidence += Math.min(keywords.length * 0.05, 0.3); // Bonus mots-clés
    confidence += Math.min(patterns.length * 0.08, 0.2); // Bonus patterns

    // Bonus complexité
    const complexityBonus: Record<string, number> = { 'low': 0.1, 'medium': 0.15, 'high': 0.2, 'very_high': 0.25 };
    confidence += complexityBonus[complexity] || 0.1;

    return Math.min(confidence, 1.0);
  }

  /**
   * Génération de recommandations
   */
  private generateRecommendations(category: EffectCategory, analysis: any): string[] {
    const recommendations: string[] = [];

    if (category.availableLevels.length === 1) {
      recommendations.push("Cet effet est déjà optimal au niveau Standard");
      recommendations.push("Aucune amélioration majeure nécessaire");
    } else if (category.availableLevels.length <= 2) {
      recommendations.push("Améliorations modérées possibles avec l'IA");
      recommendations.push("Niveau Professionnel recommandé pour plus de finesse");
    } else {
      recommendations.push("🚀 ÉNORME potentiel d'amélioration !");
      recommendations.push("Tous les niveaux disponibles - Niveau Premium recommandé");
      recommendations.push("Technologies révolutionnaires applicables");
    }

    // Recommandations spécifiques selon les patterns
    if (analysis.patterns.includes('webgl')) {
      recommendations.push("WebGL détecté - Optimisations GPU possibles");
    }
    if (analysis.patterns.includes('particle_system')) {
      recommendations.push("Système de particules - IA prédictive applicable");
    }
    if (analysis.patterns.includes('3d_math')) {
      recommendations.push("Calculs 3D - WebAssembly et parallélisation recommandés");
    }

    return recommendations;
  }

  /**
   * Obtient les catégories disponibles
   */
  getAvailableCategories(): Record<string, EffectCategory> {
    return this.categories;
  }

  /**
   * Détection rapide des niveaux disponibles
   */
  quickDetectLevels(filename: string, code: string): number[] {
    const analysis = this.performDeepAnalysis(filename, code);
    const category = this.classifyByContent(analysis);
    return category.availableLevels;
  }
}