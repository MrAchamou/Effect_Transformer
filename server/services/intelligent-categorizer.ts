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
}

interface ClassificationResult {
  category: string;
  subcategory: string;
  availableLevels: number[];
  reason: string;
  confidence: number;
  recommendations: string[];
}

export class IntelligentCategorizer {
  private categories: Record<string, EffectCategory> = {
    ui_ux: {
      name: "Interface Utilisateur",
      subcategories: [
        'animations_boutons', 'effets_loading', 'preloaders',
        'animations_navigation', 'menus', 'micro_interactions',
        'effets_hover', 'effets_focus', 'ripple', 'hover',
        'button', 'menu', 'navigation', 'loading'
      ],
      availableLevels: [1],
      reason: "Effet UI déjà optimisé - niveau Standard parfait",
      description: "Effets d'interface utilisateur complets qui n'ont pas besoin d'améliorations complexes"
    },

    transitions_simples: {
      name: "Transitions Basiques",
      subcategories: [
        'fade_transitions', 'slide_transitions', 'wipes_basiques',
        'fade', 'slide', 'wipe', 'simple_transition'
      ],
      availableLevels: [1],
      reason: "Transitions simples déjà complètes",
      description: "Transitions basiques qui fonctionnent parfaitement au niveau Standard"
    },

    texte: {
      name: "Effets de Texte",
      subcategories: [
        'typewriter', 'glitch_text', 'neon_text',
        'fade_text', 'slide_text', 'rotate_text',
        'morphing_text', 'text', 'typography', 'letter'
      ],
      availableLevels: [1, 2],
      reason: "Potentiel modéré d'amélioration avec IA",
      description: "Effets de texte avec possibilités d'optimisation intelligente"
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
      description: "Effets d'images avec potentiel d'amélioration modéré"
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
      description: "Effets audio avec possibilités d'amélioration sonore"
    },

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
      reason: "ÉNORME potentiel d'amélioration IA - Tous niveaux recommandés",
      description: "Systèmes complexes avec potentiel révolutionnaire d'amélioration"
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
      reason: "Technologies 3D avancées - Maximum d'améliorations IA possible",
      description: "Effets 3D complexes avec potentiel maximal d'optimisation"
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
      reason: "Traitement vidéo complexe - IA révolutionnaire applicable",
      description: "Effets vidéo avancés nécessitant toute la puissance de l'IA"
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
      recommendations: this.generateRecommendations(category, analysis)
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
   * Classification par contenu
   */
  private classifyByContent(analysis: any): EffectCategory {
    // Vérifier chaque catégorie
    for (const [key, category] of Object.entries(this.categories)) {
      const matchScore = this.calculateCategoryMatch(analysis, category);
      if (matchScore > 0.6) {
        return category;
      }
    }

    // Classification par complexité si pas de match exact
    if (analysis.patterns.includes('3d_math') || analysis.patterns.includes('webgl') || 
        analysis.patterns.includes('particle_system')) {
      return this.categories.motion_3d;
    }

    if (analysis.complexity === 'low' && analysis.patterns.includes('interaction')) {
      return this.categories.ui_ux;
    }

    // Fallback sécurisé
    return this.categories.texte;
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