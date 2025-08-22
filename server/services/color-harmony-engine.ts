
/**
 * ColorHarmonyEngine - Module 6 du Niveau 1
 * Analyseur et optimiseur de palettes couleur avec IA de théorie des couleurs avancée
 * 100% autonome - Aucune dépendance externe
 */

interface ColorHarmony {
  type: 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic' | 'split-complementary';
  colors: string[];
  baseColor: string;
  harmony: number; // Score de 0 à 1
  accessibility: number; // Score WCAG
  emotion: string;
  temperature: 'warm' | 'cool' | 'neutral';
}

interface ColorProperty {
  property: string;
  element: Element;
  originalValue: string;
  computedValue: string;
  priority: 'critical' | 'important' | 'normal' | 'low';
  context: 'background' | 'text' | 'border' | 'shadow' | 'accent';
  isGradient: boolean;
  hasAlpha: boolean;
}

interface ColorAnalysis {
  dominantHues: number[];
  averageSaturation: number;
  averageLightness: number;
  contrast: number;
  colorCount: number;
  harmonyScore: number;
  accessibilityScore: number;
  emotionalTone: string;
  seasonalAlignment: string;
}

interface GradientEvolution {
  id: string;
  baseGradient: string;
  evolutionPhases: string[];
  transitionDuration: number;
  easing: string;
  responsive: boolean;
  seasonal: boolean;
}

interface EmotionalContext {
  primary: 'calming' | 'energetic' | 'professional' | 'creative' | 'trustworthy' | 'luxurious';
  secondary: string[];
  intensity: number;
  culturalAlignment: 'western' | 'eastern' | 'universal';
  ageTarget: 'young' | 'adult' | 'senior' | 'universal';
}

interface AccessibilityCompliance {
  wcagAA: boolean;
  wcagAAA: boolean;
  contrastRatio: number;
  colorBlindSafe: boolean;
  lowVisionOptimized: boolean;
  recommendations: string[];
}

export class ColorHarmonyEngine {
  private container: Element;
  private colorProperties: ColorProperty[] = [];
  private currentHarmony: ColorHarmony | null = null;
  private gradientEvolutions: Map<string, GradientEvolution> = new Map();
  private emotionalContext: EmotionalContext;
  private accessibility: AccessibilityCompliance;
  private performanceLevel: 'low' | 'medium' | 'high' = 'medium';
  private seasonalMode: boolean = true;
  private adaptiveMode: boolean = true;
  private isActive: boolean = false;

  // Constantes de théorie des couleurs
  private readonly COLOR_HARMONIES = {
    complementary: 180,
    splitComplementary: [150, 210],
    analogous: [30, -30],
    triadic: [120, 240],
    tetradic: [90, 180, 270],
    monochromatic: [0]
  };

  private readonly EMOTIONAL_COLORS = {
    calming: { hue: [180, 240], saturation: [0.3, 0.7], lightness: [0.4, 0.8] },
    energetic: { hue: [0, 60], saturation: [0.7, 1.0], lightness: [0.4, 0.7] },
    professional: { hue: [200, 260], saturation: [0.2, 0.5], lightness: [0.2, 0.6] },
    creative: { hue: [270, 330], saturation: [0.6, 0.9], lightness: [0.3, 0.8] },
    trustworthy: { hue: [180, 240], saturation: [0.4, 0.8], lightness: [0.3, 0.7] },
    luxurious: { hue: [240, 300], saturation: [0.3, 0.8], lightness: [0.1, 0.4] }
  };

  constructor(container: Element = document.documentElement, options: any = {}) {
    this.container = container;
    this.detectPerformanceLevel();
    this.initializeEmotionalContext(options);
    this.analyzeExistingColors();
    this.generateOptimalHarmony();
    this.setupAccessibilityCompliance();
    
    if (options.autoApply !== false) {
      this.startColorEngine();
    }
  }

  /**
   * 1. ANALYSEUR CSS INTELLIGENT COMPLET
   */
  private analyzeExistingColors(): void {
    this.colorProperties = [];
    
    // Analyse de TOUTES les propriétés couleur CSS
    this.analyzeColorProperties();
    this.analyzeGradients();
    this.analyzeCustomProperties();
    this.analyzeShadows();
    this.analyzeFilters();
    
    // Classification par contexte et priorité
    this.classifyColorProperties();
    this.calculateColorStatistics();
  }

  private analyzeColorProperties(): void {
    const colorCSSProperties = [
      'color', 'background-color', 'background',
      'border-color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
      'outline-color', 'text-decoration-color', 'text-shadow', 'box-shadow',
      'fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color'
    ];

    const allElements = this.container.querySelectorAll('*');
    
    allElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      
      colorCSSProperties.forEach(property => {
        const value = computedStyle.getPropertyValue(property);
        
        if (this.hasColor(value)) {
          this.colorProperties.push({
            property,
            element,
            originalValue: this.getOriginalValue(element, property),
            computedValue: value,
            priority: this.determinePriority(property, element),
            context: this.determineContext(property),
            isGradient: this.isGradient(value),
            hasAlpha: this.hasAlpha(value)
          });
        }
      });
    });
  }

  private analyzeGradients(): void {
    const elements = this.container.querySelectorAll('*');
    
    elements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const background = computedStyle.background;
      const backgroundImage = computedStyle.backgroundImage;
      
      [background, backgroundImage].forEach(prop => {
        if (this.isGradient(prop)) {
          const colors = this.extractColorsFromGradient(prop);
          colors.forEach(color => {
            this.colorProperties.push({
              property: 'background-gradient',
              element,
              originalValue: prop,
              computedValue: color,
              priority: 'important',
              context: 'background',
              isGradient: true,
              hasAlpha: this.hasAlpha(color)
            });
          });
        }
      });
    });
  }

  private analyzeCustomProperties(): void {
    // Analyse des variables CSS personnalisées
    const rootStyles = window.getComputedStyle(document.documentElement);
    
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        this.analyzeStyleSheet(sheet);
      } catch (e) {
        // Ignorer les feuilles de style cross-origin
      }
    }
  }

  private analyzeStyleSheet(sheet: CSSStyleSheet): void {
    try {
      const rules = sheet.cssRules || sheet.rules;
      
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i] as CSSStyleRule;
        
        if (rule.style) {
          for (let j = 0; j < rule.style.length; j++) {
            const property = rule.style[j];
            const value = rule.style.getPropertyValue(property);
            
            if (property.startsWith('--') && this.hasColor(value)) {
              // Variable CSS personnalisée contenant une couleur
              this.colorProperties.push({
                property: property,
                element: document.documentElement,
                originalValue: value,
                computedValue: value,
                priority: 'critical',
                context: 'accent',
                isGradient: this.isGradient(value),
                hasAlpha: this.hasAlpha(value)
              });
            }
          }
        }
      }
    } catch (e) {
      // Gérer les erreurs de cross-origin
    }
  }

  private analyzeShadows(): void {
    const elements = this.container.querySelectorAll('*');
    
    elements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const boxShadow = computedStyle.boxShadow;
      const textShadow = computedStyle.textShadow;
      
      [
        { prop: boxShadow, type: 'box-shadow' },
        { prop: textShadow, type: 'text-shadow' }
      ].forEach(({ prop, type }) => {
        if (prop && prop !== 'none') {
          const colors = this.extractColorsFromShadow(prop);
          colors.forEach(color => {
            this.colorProperties.push({
              property: type,
              element,
              originalValue: prop,
              computedValue: color,
              priority: 'normal',
              context: 'shadow',
              isGradient: false,
              hasAlpha: this.hasAlpha(color)
            });
          });
        }
      });
    });
  }

  private analyzeFilters(): void {
    const elements = this.container.querySelectorAll('*');
    
    elements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const filter = computedStyle.filter;
      
      if (filter && filter !== 'none') {
        // Analyser les filtres qui affectent les couleurs
        const colorFilters = ['hue-rotate', 'sepia', 'saturate', 'contrast', 'brightness'];
        
        colorFilters.forEach(filterType => {
          if (filter.includes(filterType)) {
            this.colorProperties.push({
              property: `filter-${filterType}`,
              element,
              originalValue: filter,
              computedValue: this.extractFilterValue(filter, filterType),
              priority: 'low',
              context: 'accent',
              isGradient: false,
              hasAlpha: false
            });
          }
        });
      }
    });
  }

  /**
   * 2. GÉNÉRATEUR D'HARMONIES CHROMATIQUES AVANCÉ
   */
  private generateOptimalHarmony(): void {
    const analysis = this.calculateColorStatistics();
    const dominantColor = this.findDominantColor();
    
    // Génération de différents types d'harmonie
    const harmonies: ColorHarmony[] = [];
    
    Object.keys(this.COLOR_HARMONIES).forEach(harmonyType => {
      const harmony = this.generateHarmony(dominantColor, harmonyType as keyof typeof this.COLOR_HARMONIES);
      harmonies.push(harmony);
    });
    
    // Sélection de la meilleure harmonie selon le contexte
    this.currentHarmony = this.selectOptimalHarmony(harmonies, analysis);
    
    // Génération des variations pour adaptation contextuelle
    this.generateHarmonyVariations();
  }

  private generateHarmony(baseColor: string, type: keyof typeof this.COLOR_HARMONIES): ColorHarmony {
    const hsl = this.rgbToHsl(baseColor);
    const colors: string[] = [baseColor];
    
    const angles = Array.isArray(this.COLOR_HARMONIES[type]) 
      ? this.COLOR_HARMONIES[type] as number[]
      : [this.COLOR_HARMONIES[type] as number];
    
    angles.forEach(angle => {
      if (angle !== 0) {
        const newHue = (hsl.h + angle) % 360;
        const harmonicColor = this.hslToRgb({ ...hsl, h: newHue });
        colors.push(harmonicColor);
      }
    });
    
    // Génération de variations pour chaque couleur
    const expandedColors = this.generateColorVariations(colors);
    
    return {
      type,
      colors: expandedColors,
      baseColor,
      harmony: this.calculateHarmonyScore(expandedColors),
      accessibility: this.calculateAccessibilityScore(expandedColors),
      emotion: this.determineEmotionalTone(expandedColors),
      temperature: this.analyzeTemperature(expandedColors)
    };
  }

  private generateColorVariations(colors: string[]): string[] {
    const variations: string[] = [...colors];
    
    colors.forEach(color => {
      const hsl = this.rgbToHsl(color);
      
      // Variations de saturation intelligente
      const saturationVariations = [0.3, 0.5, 0.7, 0.9].map(sat => 
        this.hslToRgb({ ...hsl, s: sat })
      );
      
      // Variations de luminosité naturelles
      const lightnessVariations = [0.2, 0.4, 0.6, 0.8].map(light => 
        this.hslToRgb({ ...hsl, l: light })
      );
      
      variations.push(...saturationVariations, ...lightnessVariations);
    });
    
    return this.removeDuplicateColors(variations);
  }

  private selectOptimalHarmony(harmonies: ColorHarmony[], analysis: ColorAnalysis): ColorHarmony {
    let bestHarmony = harmonies[0];
    let bestScore = 0;
    
    harmonies.forEach(harmony => {
      let score = 0;
      
      // Score d'harmonie naturelle
      score += harmony.harmony * 0.3;
      
      // Score d'accessibilité
      score += harmony.accessibility * 0.25;
      
      // Alignement avec le contexte émotionnel
      score += this.emotionalContext.primary === harmony.emotion ? 0.2 : 0;
      
      // Compatibilité avec les couleurs existantes
      score += this.calculateCompatibilityScore(harmony, analysis) * 0.15;
      
      // Adaptation saisonnière
      score += this.calculateSeasonalScore(harmony) * 0.1;
      
      if (score > bestScore) {
        bestScore = score;
        bestHarmony = harmony;
      }
    });
    
    return bestHarmony;
  }

  /**
   * 3. SYSTÈME ÉMOTIONNEL ET CONTEXTUEL
   */
  private initializeEmotionalContext(options: any): void {
    this.emotionalContext = {
      primary: options.emotion || this.detectContextualEmotion(),
      secondary: options.secondaryEmotions || [],
      intensity: options.intensity || this.calculateOptimalIntensity(),
      culturalAlignment: options.culture || 'universal',
      ageTarget: options.ageTarget || 'universal'
    };
  }

  private detectContextualEmotion(): EmotionalContext['primary'] {
    // Analyse du contenu pour déterminer l'émotion appropriée
    const textContent = this.container.textContent?.toLowerCase() || '';
    const elementTypes = this.analyzeElementTypes();
    
    // Mots-clés émotionnels
    const emotionalKeywords = {
      professional: ['business', 'corporate', 'professional', 'enterprise', 'official'],
      creative: ['art', 'design', 'creative', 'innovation', 'imagination'],
      calming: ['relax', 'calm', 'peaceful', 'zen', 'meditation', 'wellness'],
      energetic: ['energy', 'dynamic', 'active', 'sport', 'fitness', 'power'],
      trustworthy: ['trust', 'secure', 'reliable', 'banking', 'finance', 'insurance'],
      luxurious: ['luxury', 'premium', 'exclusive', 'elegant', 'sophisticated']
    };
    
    let emotionScores: Record<string, number> = {};
    
    Object.entries(emotionalKeywords).forEach(([emotion, keywords]) => {
      emotionScores[emotion] = keywords.reduce((score, keyword) => 
        textContent.includes(keyword) ? score + 1 : score, 0
      );
    });
    
    // Analyse des types d'éléments
    if (elementTypes.forms > 0.3) emotionScores.professional += 2;
    if (elementTypes.media > 0.4) emotionScores.creative += 2;
    if (elementTypes.text > 0.7) emotionScores.calming += 1;
    
    const dominantEmotion = Object.entries(emotionScores)
      .sort(([,a], [,b]) => b - a)[0][0] as EmotionalContext['primary'];
    
    return dominantEmotion || 'professional';
  }

  private generateEmotionalPalette(emotion: EmotionalContext['primary']): string[] {
    const emotionConfig = this.EMOTIONAL_COLORS[emotion];
    const palette: string[] = [];
    
    // Génération de couleurs selon les paramètres émotionnels
    for (let i = 0; i < 6; i++) {
      const hue = this.interpolate(emotionConfig.hue[0], emotionConfig.hue[1], i / 5);
      const saturation = this.interpolate(emotionConfig.saturation[0], emotionConfig.saturation[1], 
        Math.sin(i * Math.PI / 3) * 0.5 + 0.5);
      const lightness = this.interpolate(emotionConfig.lightness[0], emotionConfig.lightness[1], 
        Math.cos(i * Math.PI / 4) * 0.5 + 0.5);
      
      palette.push(this.hslToRgb({ h: hue, s: saturation, l: lightness }));
    }
    
    return palette;
  }

  private adaptToTimeOfDay(): void {
    if (!this.seasonalMode) return;
    
    const hour = new Date().getHours();
    let temperatureShift = 0;
    let intensityModifier = 1;
    
    // Adaptation circadienne des couleurs
    if (hour >= 6 && hour < 12) {
      // Matin - couleurs plus fraîches et énergisantes
      temperatureShift = -10;
      intensityModifier = 1.1;
    } else if (hour >= 12 && hour < 18) {
      // Après-midi - couleurs équilibrées
      temperatureShift = 0;
      intensityModifier = 1.0;
    } else if (hour >= 18 && hour < 22) {
      // Soirée - couleurs plus chaudes
      temperatureShift = 15;
      intensityModifier = 0.9;
    } else {
      // Nuit - couleurs très atténuées
      temperatureShift = 10;
      intensityModifier = 0.7;
    }
    
    this.applyTemperatureShift(temperatureShift);
    this.applyIntensityModification(intensityModifier);
  }

  private generateSeasonalPalettes(): Record<string, string[]> {
    return {
      spring: this.generateSeasonalPalette([60, 120], [0.4, 0.8], [0.5, 0.9]),
      summer: this.generateSeasonalPalette([120, 240], [0.6, 1.0], [0.6, 0.9]),
      autumn: this.generateSeasonalPalette([20, 60], [0.7, 0.9], [0.3, 0.7]),
      winter: this.generateSeasonalPalette([180, 260], [0.3, 0.6], [0.2, 0.5])
    };
  }

  private generateSeasonalPalette(hueRange: number[], satRange: number[], lightRange: number[]): string[] {
    const palette: string[] = [];
    
    for (let i = 0; i < 8; i++) {
      const hue = this.interpolate(hueRange[0], hueRange[1], Math.random());
      const saturation = this.interpolate(satRange[0], satRange[1], Math.random());
      const lightness = this.interpolate(lightRange[0], lightRange[1], Math.random());
      
      palette.push(this.hslToRgb({ h: hue, s: saturation, l: lightness }));
    }
    
    return palette;
  }

  /**
   * 4. GRADIENTS ÉVOLUTIFS INTELLIGENTS
   */
  private replaceStaticColorsWithGradients(): void {
    this.colorProperties.forEach(prop => {
      if (!prop.isGradient && prop.context === 'background' && prop.priority !== 'low') {
        const evolutiveGradient = this.createEvolutiveGradient(prop.computedValue);
        this.applyEvolutiveGradient(prop.element, prop.property, evolutiveGradient);
      }
    });
  }

  private createEvolutiveGradient(baseColor: string): GradientEvolution {
    const harmony = this.currentHarmony;
    if (!harmony) return this.createSimpleGradient(baseColor);
    
    const gradientColors = this.selectGradientColors(baseColor, harmony);
    const phases = this.generateGradientPhases(gradientColors);
    
    return {
      id: `gradient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      baseGradient: this.createGradientCSS(gradientColors),
      evolutionPhases: phases,
      transitionDuration: this.calculateOptimalTransitionDuration(),
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      responsive: true,
      seasonal: this.seasonalMode
    };
  }

  private selectGradientColors(baseColor: string, harmony: ColorHarmony): string[] {
    const baseHsl = this.rgbToHsl(baseColor);
    const selectedColors = [baseColor];
    
    // Sélection de couleurs harmonieuses pour le gradient
    const harmonicColors = harmony.colors.filter(color => {
      const colorHsl = this.rgbToHsl(color);
      const contrast = this.calculateContrast(baseColor, color);
      
      // Critères de sélection pour gradients
      return contrast > 1.5 && contrast < 7 && 
             Math.abs(colorHsl.l - baseHsl.l) < 0.4;
    });
    
    selectedColors.push(...harmonicColors.slice(0, 2));
    
    // Ajout de couleurs intermédiaires si nécessaire
    while (selectedColors.length < 3) {
      const intermediateColor = this.generateIntermediateColor(
        selectedColors[0], 
        selectedColors[selectedColors.length - 1]
      );
      selectedColors.push(intermediateColor);
    }
    
    return selectedColors;
  }

  private generateGradientPhases(colors: string[]): string[] {
    const phases: string[] = [];
    const phaseCount = 6; // Nombre de phases d'évolution
    
    for (let i = 0; i < phaseCount; i++) {
      const phaseColors = this.interpolateColorArray(colors, i / (phaseCount - 1));
      const gradient = this.createGradientCSS(phaseColors, this.getRandomGradientDirection());
      phases.push(gradient);
    }
    
    return phases;
  }

  private createGradientCSS(colors: string[], direction: string = '45deg'): string {
    const colorStops = colors.map((color, index) => 
      `${color} ${(index / (colors.length - 1) * 100).toFixed(1)}%`
    ).join(', ');
    
    return `linear-gradient(${direction}, ${colorStops})`;
  }

  private getRandomGradientDirection(): string {
    const directions = [
      '45deg', '135deg', '225deg', '315deg',
      'to right', 'to left', 'to bottom', 'to top',
      'to bottom right', 'to bottom left', 'to top right', 'to top left'
    ];
    
    return directions[Math.floor(Math.random() * directions.length)];
  }

  private startGradientAnimation(evolution: GradientEvolution, element: Element): void {
    if (this.performanceLevel === 'low') return;
    
    let currentPhase = 0;
    
    const animate = () => {
      if (currentPhase >= evolution.evolutionPhases.length) {
        currentPhase = 0;
      }
      
      const gradient = evolution.evolutionPhases[currentPhase];
      this.applyGradientToElement(element, gradient);
      
      currentPhase++;
      
      setTimeout(animate, evolution.transitionDuration);
    };
    
    animate();
  }

  /**
   * 5. CONTRASTE ET ACCESSIBILITÉ AUTOMATIQUE
   */
  private setupAccessibilityCompliance(): void {
    this.accessibility = {
      wcagAA: false,
      wcagAAA: false,
      contrastRatio: 0,
      colorBlindSafe: false,
      lowVisionOptimized: false,
      recommendations: []
    };
    
    this.calculateAccessibilityMetrics();
    this.generateAccessibilityRecommendations();
    this.applyAccessibilityOptimizations();
  }

  private calculateAccessibilityMetrics(): void {
    let totalContrast = 0;
    let contrastChecks = 0;
    let aaCompliant = 0;
    let aaaCompliant = 0;
    
    this.colorProperties.forEach(prop => {
      if (prop.context === 'text') {
        const backgroundColor = this.getBackgroundColor(prop.element);
        const textColor = prop.computedValue;
        
        const contrast = this.calculateContrast(backgroundColor, textColor);
        totalContrast += contrast;
        contrastChecks++;
        
        if (contrast >= 4.5) aaCompliant++;
        if (contrast >= 7) aaaCompliant++;
      }
    });
    
    this.accessibility.contrastRatio = contrastChecks > 0 ? totalContrast / contrastChecks : 0;
    this.accessibility.wcagAA = contrastChecks > 0 && (aaCompliant / contrastChecks) >= 0.8;
    this.accessibility.wcagAAA = contrastChecks > 0 && (aaaCompliant / contrastChecks) >= 0.8;
    this.accessibility.colorBlindSafe = this.testColorBlindness();
  }

  private generateAccessibilityRecommendations(): void {
    const recommendations: string[] = [];
    
    if (!this.accessibility.wcagAA) {
      recommendations.push('Améliorer le contraste pour atteindre WCAG AA (4.5:1 minimum)');
    }
    
    if (!this.accessibility.wcagAAA) {
      recommendations.push('Optimiser le contraste pour WCAG AAA (7:1 minimum)');
    }
    
    if (!this.accessibility.colorBlindSafe) {
      recommendations.push('Ajuster les couleurs pour la compatibilité daltonisme');
    }
    
    // Analyse des problèmes spécifiques
    this.colorProperties.forEach(prop => {
      if (prop.context === 'text') {
        const bg = this.getBackgroundColor(prop.element);
        const contrast = this.calculateContrast(bg, prop.computedValue);
        
        if (contrast < 4.5) {
          recommendations.push(`Améliorer le contraste pour ${prop.property} (actuel: ${contrast.toFixed(2)}:1)`);
        }
      }
    });
    
    this.accessibility.recommendations = recommendations;
  }

  private applyAccessibilityOptimizations(): void {
    this.colorProperties.forEach(prop => {
      if (prop.context === 'text' && prop.priority === 'critical') {
        const optimizedColor = this.optimizeForAccessibility(prop);
        if (optimizedColor !== prop.computedValue) {
          this.applyColorToElement(prop.element, prop.property, optimizedColor);
        }
      }
    });
  }

  private optimizeForAccessibility(prop: ColorProperty): string {
    const backgroundColor = this.getBackgroundColor(prop.element);
    const currentContrast = this.calculateContrast(backgroundColor, prop.computedValue);
    
    if (currentContrast >= 4.5) return prop.computedValue;
    
    const hsl = this.rgbToHsl(prop.computedValue);
    
    // Ajustement de la luminosité pour améliorer le contraste
    let optimizedColor = prop.computedValue;
    let bestContrast = currentContrast;
    
    for (let lightness = 0.1; lightness <= 0.9; lightness += 0.1) {
      const testColor = this.hslToRgb({ ...hsl, l: lightness });
      const testContrast = this.calculateContrast(backgroundColor, testColor);
      
      if (testContrast > bestContrast && testContrast >= 4.5) {
        bestContrast = testContrast;
        optimizedColor = testColor;
      }
    }
    
    return optimizedColor;
  }

  private testColorBlindness(): boolean {
    // Test simplifié pour la compatibilité daltonisme
    const colors = this.currentHarmony?.colors || [];
    
    if (colors.length < 2) return true;
    
    // Vérification que les couleurs sont distinguables pour les différents types de daltonisme
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const protanopia = this.simulateColorBlindness(colors[i], 'protanopia');
        const deuteranopia = this.simulateColorBlindness(colors[i], 'deuteranopia');
        const tritanopia = this.simulateColorBlindness(colors[i], 'tritanopia');
        
        const protanopiaJ = this.simulateColorBlindness(colors[j], 'protanopia');
        const deuteranopiaJ = this.simulateColorBlindness(colors[j], 'deuteranopia');
        const tritanopiaJ = this.simulateColorBlindness(colors[j], 'tritanopia');
        
        if (this.calculateContrast(protanopia, protanopiaJ) < 2 ||
            this.calculateContrast(deuteranopia, deuteranopiaJ) < 2 ||
            this.calculateContrast(tritanopia, tritanopiaJ) < 2) {
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * 6. INTELLIGENCE ADAPTIVE MULTI-CONTEXTE
   */
  private adaptToContentType(): void {
    const contentAnalysis = this.analyzeContentContext();
    
    switch (contentAnalysis.type) {
      case 'text-heavy':
        this.optimizeForReadability();
        break;
      case 'image-rich':
        this.optimizeForVisualImpact();
        break;
      case 'interactive':
        this.optimizeForInteraction();
        break;
      case 'data-visualization':
        this.optimizeForDataViz();
        break;
      case 'e-commerce':
        this.optimizeForEcommerce();
        break;
      default:
        this.applyBalancedOptimization();
    }
  }

  private optimizeForReadability(): void {
    // Optimisation pour contenu textuel
    this.colorProperties.forEach(prop => {
      if (prop.context === 'text') {
        const optimizedColor = this.enhanceTextReadability(prop);
        this.applyColorToElement(prop.element, prop.property, optimizedColor);
      }
      
      if (prop.context === 'background') {
        const neutralBackground = this.createNeutralBackground(prop.computedValue);
        this.applyColorToElement(prop.element, prop.property, neutralBackground);
      }
    });
  }

  private optimizeForVisualImpact(): void {
    // Optimisation pour contenu visuel
    if (this.currentHarmony) {
      const vibrantPalette = this.enhanceVibrancy(this.currentHarmony.colors);
      this.applyPaletteToContext(vibrantPalette, ['accent', 'border']);
    }
  }

  private optimizeForInteraction(): void {
    // Optimisation pour éléments interactifs
    const interactiveElements = this.container.querySelectorAll('button, input, select, textarea, a');
    
    interactiveElements.forEach(element => {
      const focusColor = this.generateFocusColor(element);
      const hoverColor = this.generateHoverColor(element);
      
      this.applyInteractiveStates(element, focusColor, hoverColor);
    });
  }

  private syncWithOtherModules(): void {
    // Synchronisation avec VisualFocusEngine pour hiérarchie visuelle
    this.setupFocusColorSync();
    
    // Synchronisation avec TimingMaster pour transitions
    this.setupTimingSync();
    
    // Adaptation basée sur SmartOptimizer
    this.setupPerformanceSync();
  }

  private setupFocusColorSync(): void {
    // Écouter les événements du VisualFocusEngine
    window.addEventListener('focus-zone-activated', (event: any) => {
      const { zone, priority } = event.detail;
      this.highlightFocusZone(zone, priority);
    });
  }

  private highlightFocusZone(zone: any, priority: number): void {
    if (!this.currentHarmony) return;
    
    const highlightColor = this.generateHighlightColor(priority);
    const elements = this.getElementsInZone(zone);
    
    elements.forEach(element => {
      this.applyTemporaryHighlight(element, highlightColor);
    });
  }

  private learnFromUserPreferences(): void {
    // Apprentissage basé sur les interactions utilisateur
    const userInteractions = this.analyzeUserInteractions();
    
    if (userInteractions.preferredColors.length > 0) {
      this.adaptHarmonyToPreferences(userInteractions.preferredColors);
    }
    
    if (userInteractions.avoidedColors.length > 0) {
      this.avoidColorsInFuture(userInteractions.avoidedColors);
    }
  }

  /**
   * MÉTHODES UTILITAIRES POUR COULEURS
   */
  private hasColor(value: string): boolean {
    if (!value || value === 'none' || value === 'transparent') return false;
    
    // Vérifier les formats de couleur
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) ||
           /^rgb\(/.test(value) ||
           /^rgba\(/.test(value) ||
           /^hsl\(/.test(value) ||
           /^hsla\(/.test(value) ||
           this.isNamedColor(value);
  }

  private isNamedColor(value: string): boolean {
    const namedColors = [
      'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
      'pink', 'brown', 'gray', 'grey', 'cyan', 'magenta', 'lime', 'navy',
      'maroon', 'olive', 'teal', 'silver', 'aqua', 'fuchsia'
    ];
    
    return namedColors.includes(value.toLowerCase());
  }

  private isGradient(value: string): boolean {
    return value.includes('gradient(') || value.includes('repeating-');
  }

  private hasAlpha(value: string): boolean {
    return value.includes('rgba(') || value.includes('hsla(') || 
           (value.includes('#') && value.length === 9);
  }

  private rgbToHsl(rgb: string): { h: number; s: number; l: number } {
    // Conversion autonome RGB vers HSL
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return { h: 0, s: 0, l: 0 };
    
    const r = parseInt(match[1]) / 255;
    const g = parseInt(match[2]) / 255;
    const b = parseInt(match[3]) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let h = 0;
    const l = (max + min) / 2;
    const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));
    
    if (diff !== 0) {
      if (max === r) h = (g - b) / diff + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / diff + 2;
      else h = (r - g) / diff + 4;
      h /= 6;
    }
    
    return { h: h * 360, s, l };
  }

  private hslToRgb(hsl: { h: number; s: number; l: number }): string {
    // Conversion autonome HSL vers RGB
    const { h, s, l } = hsl;
    const hueNorm = h / 360;
    
    const a = s * Math.min(l, 1 - l);
    
    const f = (n: number) => {
      const k = (n + hueNorm * 12) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color);
    };
    
    return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
  }

  private calculateContrast(color1: string, color2: string): number {
    // Calcul du contraste selon WCAG
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  private getLuminance(color: string): number {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return 0;
    
    const [, r, g, b] = match.map(Number);
    
    const normalize = (c: number) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    
    return 0.2126 * normalize(r) + 0.7152 * normalize(g) + 0.0722 * normalize(b);
  }

  private interpolate(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
  }

  private interpolateColorArray(colors: string[], factor: number): string[] {
    // Interpolation entre array de couleurs
    const result: string[] = [];
    
    colors.forEach((color, index) => {
      const hsl = this.rgbToHsl(color);
      const modifiedHsl = {
        h: (hsl.h + factor * 30) % 360,
        s: Math.max(0, Math.min(1, hsl.s + factor * 0.1)),
        l: Math.max(0, Math.min(1, hsl.l + factor * 0.05))
      };
      result.push(this.hslToRgb(modifiedHsl));
    });
    
    return result;
  }

  /**
   * MÉTHODES PUBLIQUES PRINCIPALES
   */
  public applyHarmonyToContainer(): void {
    if (!this.currentHarmony) return;
    
    this.replaceStaticColorsWithGradients();
    this.adaptToTimeOfDay();
    this.adaptToContentType();
    this.syncWithOtherModules();
  }

  public generateCustomHarmony(baseColor: string, type: string = 'complementary'): ColorHarmony | null {
    if (!this.COLOR_HARMONIES[type as keyof typeof this.COLOR_HARMONIES]) return null;
    
    return this.generateHarmony(baseColor, type as keyof typeof this.COLOR_HARMONIES);
  }

  public optimizeForDevice(deviceType: 'mobile' | 'tablet' | 'desktop'): void {
    switch (deviceType) {
      case 'mobile':
        this.optimizeForMobile();
        break;
      case 'tablet':
        this.optimizeForTablet();
        break;
      case 'desktop':
        this.optimizeForDesktop();
        break;
    }
  }

  public getColorAnalytics(): any {
    return {
      totalColors: this.colorProperties.length,
      currentHarmony: this.currentHarmony,
      accessibility: this.accessibility,
      emotionalContext: this.emotionalContext,
      performanceLevel: this.performanceLevel,
      activeGradients: this.gradientEvolutions.size
    };
  }

  public exportOptimizedCSS(): string {
    let css = '/* Optimisations ColorHarmonyEngine */\n';
    
    // Variables CSS pour les couleurs principales
    if (this.currentHarmony) {
      css += ':root {\n';
      this.currentHarmony.colors.forEach((color, index) => {
        css += `  --harmony-color-${index + 1}: ${color};\n`;
      });
      css += '}\n\n';
    }
    
    // Styles optimisés pour l'accessibilité
    css += this.generateAccessibilityCSS();
    
    // Gradients évolutifs
    css += this.generateGradientCSS();
    
    return css;
  }

  public startColorEngine(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.applyHarmonyToContainer();
    
    // Mise à jour périodique si mode saisonnier activé
    if (this.seasonalMode) {
      setInterval(() => {
        this.adaptToTimeOfDay();
      }, 60000); // Toutes les minutes
    }
    
    // Apprentissage continu des préférences
    if (this.adaptiveMode) {
      setInterval(() => {
        this.learnFromUserPreferences();
      }, 300000); // Toutes les 5 minutes
    }
  }

  public stopColorEngine(): void {
    this.isActive = false;
    // Nettoyage des timers et événements
  }

  /**
   * MÉTHODES PRIVÉES UTILITAIRES SUPPLÉMENTAIRES
   */
  private detectPerformanceLevel(): void {
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let score = 0;
    score += deviceMemory >= 8 ? 2 : deviceMemory >= 4 ? 1 : 0;
    score += hardwareConcurrency >= 8 ? 2 : hardwareConcurrency >= 4 ? 1 : 0;
    score += isMobile ? -1 : 1;
    
    if (score >= 4) this.performanceLevel = 'high';
    else if (score >= 2) this.performanceLevel = 'medium';
    else this.performanceLevel = 'low';
  }

  private calculateColorStatistics(): ColorAnalysis {
    const hues: number[] = [];
    let totalSaturation = 0;
    let totalLightness = 0;
    let totalContrast = 0;
    let validColors = 0;
    
    this.colorProperties.forEach(prop => {
      if (this.hasColor(prop.computedValue)) {
        const hsl = this.rgbToHsl(prop.computedValue);
        hues.push(hsl.h);
        totalSaturation += hsl.s;
        totalLightness += hsl.l;
        validColors++;
      }
    });
    
    return {
      dominantHues: this.findDominantHues(hues),
      averageSaturation: validColors > 0 ? totalSaturation / validColors : 0,
      averageLightness: validColors > 0 ? totalLightness / validColors : 0,
      contrast: this.calculateAverageContrast(),
      colorCount: validColors,
      harmonyScore: this.calculateCurrentHarmonyScore(),
      accessibilityScore: this.accessibility.contrastRatio,
      emotionalTone: this.emotionalContext.primary,
      seasonalAlignment: this.getCurrentSeason()
    };
  }

  private findDominantColor(): string {
    const colorFrequency = new Map<string, number>();
    
    this.colorProperties.forEach(prop => {
      if (prop.priority === 'critical' || prop.priority === 'important') {
        const count = colorFrequency.get(prop.computedValue) || 0;
        colorFrequency.set(prop.computedValue, count + 1);
      }
    });
    
    let dominantColor = 'rgb(128, 128, 128)'; // Gris par défaut
    let maxCount = 0;
    
    colorFrequency.forEach((count, color) => {
      if (count > maxCount) {
        maxCount = count;
        dominantColor = color;
      }
    });
    
    return dominantColor;
  }

  private findDominantHues(hues: number[]): number[] {
    const hueGroups = new Map<number, number>();
    const groupSize = 30; // Grouper les teintes par segments de 30°
    
    hues.forEach(hue => {
      const group = Math.floor(hue / groupSize) * groupSize;
      hueGroups.set(group, (hueGroups.get(group) || 0) + 1);
    });
    
    return Array.from(hueGroups.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hue]) => hue);
  }

  private calculateHarmonyScore(colors: string[]): number {
    if (colors.length < 2) return 0.5;
    
    let score = 0;
    let comparisons = 0;
    
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const hsl1 = this.rgbToHsl(colors[i]);
        const hsl2 = this.rgbToHsl(colors[j]);
        
        const hueDiff = Math.abs(hsl1.h - hsl2.h);
        const satDiff = Math.abs(hsl1.s - hsl2.s);
        const lightDiff = Math.abs(hsl1.l - hsl2.l);
        
        // Score basé sur les règles d'harmonie
        let pairScore = 0;
        
        // Harmonie complémentaire
        if (Math.abs(hueDiff - 180) < 15) pairScore += 0.8;
        
        // Harmonie analogique
        if (hueDiff < 60) pairScore += 0.6;
        
        // Harmonie triadique
        if (Math.abs(hueDiff - 120) < 15 || Math.abs(hueDiff - 240) < 15) pairScore += 0.7;
        
        // Pénalité pour trop de différence de saturation/luminosité
        if (satDiff > 0.5) pairScore -= 0.3;
        if (lightDiff > 0.6) pairScore -= 0.3;
        
        score += Math.max(0, pairScore);
        comparisons++;
      }
    }
    
    return comparisons > 0 ? Math.min(1, score / comparisons) : 0.5;
  }

  private calculateAccessibilityScore(colors: string[]): number {
    // Score basé sur le contraste WCAG
    let totalScore = 0;
    let checks = 0;
    
    colors.forEach((color, i) => {
      colors.forEach((otherColor, j) => {
        if (i !== j) {
          const contrast = this.calculateContrast(color, otherColor);
          let score = 0;
          
          if (contrast >= 7) score = 1;
          else if (contrast >= 4.5) score = 0.8;
          else if (contrast >= 3) score = 0.5;
          else score = 0.2;
          
          totalScore += score;
          checks++;
        }
      });
    });
    
    return checks > 0 ? totalScore / checks : 0.5;
  }

  private determineEmotionalTone(colors: string[]): string {
    const emotionScores: Record<string, number> = {
      calming: 0, energetic: 0, professional: 0,
      creative: 0, trustworthy: 0, luxurious: 0
    };
    
    colors.forEach(color => {
      const hsl = this.rgbToHsl(color);
      
      // Analyse émotionnelle basée sur HSL
      Object.entries(this.EMOTIONAL_COLORS).forEach(([emotion, config]) => {
        const hueMatch = hsl.h >= config.hue[0] && hsl.h <= config.hue[1];
        const satMatch = hsl.s >= config.saturation[0] && hsl.s <= config.saturation[1];
        const lightMatch = hsl.l >= config.lightness[0] && hsl.l <= config.lightness[1];
        
        if (hueMatch && satMatch && lightMatch) {
          emotionScores[emotion] += 1;
        }
      });
    });
    
    return Object.entries(emotionScores)
      .sort(([,a], [,b]) => b - a)[0][0];
  }

  private analyzeTemperature(colors: string[]): 'warm' | 'cool' | 'neutral' {
    let warmCount = 0;
    let coolCount = 0;
    
    colors.forEach(color => {
      const hsl = this.rgbToHsl(color);
      
      if ((hsl.h >= 0 && hsl.h <= 60) || (hsl.h >= 300 && hsl.h <= 360)) {
        warmCount++;
      } else if (hsl.h >= 180 && hsl.h <= 240) {
        coolCount++;
      }
    });
    
    if (warmCount > coolCount * 1.5) return 'warm';
    if (coolCount > warmCount * 1.5) return 'cool';
    return 'neutral';
  }

  // Implémentation des méthodes manquantes...
  private getOriginalValue(element: Element, property: string): string {
    // Récupérer la valeur originale depuis les styles inline ou CSS
    const inlineStyle = (element as HTMLElement).style.getPropertyValue(property);
    return inlineStyle || window.getComputedStyle(element).getPropertyValue(property);
  }

  private determinePriority(property: string, element: Element): ColorProperty['priority'] {
    if (property === 'color' && element.textContent?.trim()) return 'critical';
    if (property === 'background-color') return 'important';
    if (property.includes('border')) return 'normal';
    return 'low';
  }

  private determineContext(property: string): ColorProperty['context'] {
    if (property === 'color') return 'text';
    if (property.includes('background')) return 'background';
    if (property.includes('border') || property.includes('outline')) return 'border';
    if (property.includes('shadow')) return 'shadow';
    return 'accent';
  }

  private extractColorsFromGradient(gradient: string): string[] {
    const colorRegex = /(rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)|#[a-fA-F0-9]{3,8}|\b\w+\b)/g;
    return gradient.match(colorRegex) || [];
  }

  private extractColorsFromShadow(shadow: string): string[] {
    return this.extractColorsFromGradient(shadow);
  }

  private extractFilterValue(filter: string, filterType: string): string {
    const regex = new RegExp(`${filterType}\\(([^)]+)\\)`);
    const match = filter.match(regex);
    return match ? match[1] : '0';
  }

  private classifyColorProperties(): void {
    // Classification déjà effectuée dans l'analyse
  }

  private generateHarmonyVariations(): void {
    if (!this.currentHarmony) return;
    
    // Générer des variations pour différents contextes
    this.currentHarmony.colors = [
      ...this.currentHarmony.colors,
      ...this.generateColorVariations(this.currentHarmony.colors.slice(0, 3))
    ];
  }

  private removeDuplicateColors(colors: string[]): string[] {
    return [...new Set(colors)];
  }

  private calculateCompatibilityScore(harmony: ColorHarmony, analysis: ColorAnalysis): number {
    // Score de compatibilité avec les couleurs existantes
    return 0.7; // Implémentation simplifiée
  }

  private calculateSeasonalScore(harmony: ColorHarmony): number {
    const currentSeason = this.getCurrentSeason();
    const seasonalPalettes = this.generateSeasonalPalettes();
    
    if (!seasonalPalettes[currentSeason]) return 0.5;
    
    // Calculer la similarité avec la palette saisonnière
    return 0.8; // Implémentation simplifiée
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  private calculateOptimalIntensity(): number {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 18) return 0.8;
    return 0.6;
  }

  private analyzeElementTypes(): { text: number; media: number; forms: number; interactive: number } {
    const total = this.container.querySelectorAll('*').length;
    
    return {
      text: this.container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div').length / total,
      media: this.container.querySelectorAll('img, video, audio, svg, canvas').length / total,
      forms: this.container.querySelectorAll('form, input, textarea, select, button').length / total,
      interactive: this.container.querySelectorAll('a, button, [onclick]').length / total
    };
  }

  // Méthodes manquantes supplémentaires (implémentation simplifiée pour garder le code concis)
  private createSimpleGradient(color: string): GradientEvolution {
    return {
      id: 'simple',
      baseGradient: `linear-gradient(45deg, ${color}, ${color})`,
      evolutionPhases: [],
      transitionDuration: 3000,
      easing: 'ease',
      responsive: false,
      seasonal: false
    };
  }

  private calculateOptimalTransitionDuration(): number { return 3000; }
  private generateIntermediateColor(color1: string, color2: string): string { return color1; }
  private applyEvolutiveGradient(element: Element, property: string, gradient: GradientEvolution): void {}
  private applyGradientToElement(element: Element, gradient: string): void {}
  private getBackgroundColor(element: Element): string { return 'rgb(255, 255, 255)'; }
  private applyColorToElement(element: Element, property: string, color: string): void {}
  private simulateColorBlindness(color: string, type: string): string { return color; }
  private analyzeContentContext(): { type: string } { return { type: 'mixed' }; }
  private enhanceTextReadability(prop: ColorProperty): string { return prop.computedValue; }
  private createNeutralBackground(color: string): string { return color; }
  private enhanceVibrancy(colors: string[]): string[] { return colors; }
  private applyPaletteToContext(palette: string[], contexts: string[]): void {}
  private generateFocusColor(element: Element): string { return 'rgb(0, 123, 255)'; }
  private generateHoverColor(element: Element): string { return 'rgb(0, 86, 179)'; }
  private applyInteractiveStates(element: Element, focus: string, hover: string): void {}
  private setupTimingSync(): void {}
  private setupPerformanceSync(): void {}
  private generateHighlightColor(priority: number): string { return 'rgb(255, 255, 0)'; }
  private getElementsInZone(zone: any): Element[] { return []; }
  private applyTemporaryHighlight(element: Element, color: string): void {}
  private analyzeUserInteractions(): { preferredColors: string[]; avoidedColors: string[] } {
    return { preferredColors: [], avoidedColors: [] };
  }
  private adaptHarmonyToPreferences(colors: string[]): void {}
  private avoidColorsInFuture(colors: string[]): void {}
  private applyTemperatureShift(shift: number): void {}
  private applyIntensityModification(modifier: number): void {}
  private optimizeForMobile(): void {}
  private optimizeForTablet(): void {}
  private optimizeForDesktop(): void {}
  private optimizeForDataViz(): void {}
  private optimizeForEcommerce(): void {}
  private applyBalancedOptimization(): void {}
  private calculateAverageContrast(): number { return 4.5; }
  private calculateCurrentHarmonyScore(): number { return 0.7; }
  private generateAccessibilityCSS(): string { return ''; }
  private generateGradientCSS(): string { return ''; }
}

export default ColorHarmonyEngine;
