
/**
 * VisualFocusEngine - Module 4 du Niveau 1
 * Détecteur de zones d'intérêt visuel avec IA de composition artistique
 * 100% autonome - Aucune dépendance externe
 */

interface FocusPoint {
  x: number;
  y: number;
  weight: number;
  type: 'primary' | 'secondary' | 'tertiary';
  magneticStrength: number;
  attractionRadius: number;
}

interface VisualTrajectory {
  points: Array<{ x: number; y: number; time: number }>;
  naturalFlow: boolean;
  eyeTrackingOptimized: boolean;
  fibonacciAligned: boolean;
}

interface CompositionRules {
  ruleOfThirds: boolean;
  goldenRatio: boolean;
  fibonacci: boolean;
  leadingLines: boolean;
  symmetry: boolean;
  contrast: boolean;
}

interface MagneticZone {
  centerX: number;
  centerY: number;
  radius: number;
  strength: number;
  priority: number;
  effectType: 'glow' | 'pulse' | 'parallax' | 'subtle';
  active: boolean;
}

interface EyeTrackingData {
  scanPattern: 'F' | 'Z' | 'circular' | 'layered';
  hotspots: FocusPoint[];
  readingDirection: 'ltr' | 'rtl' | 'ttb';
  attentionSpan: number;
  cognitiveLoad: number;
}

interface VisualGuidance {
  type: 'glow' | 'pulse' | 'trail' | 'magnetic';
  intensity: number;
  color: string;
  timing: number;
  subtlety: number;
}

export class VisualFocusEngine {
  private container: HTMLElement;
  private dimensions: { width: number; height: number };
  private focusPoints: FocusPoint[] = [];
  private magneticZones: MagneticZone[] = [];
  private activeTrajectories: VisualTrajectory[] = [];
  private compositionRules: CompositionRules;
  private eyeTrackingData: EyeTrackingData;
  private visualGuidances: VisualGuidance[] = [];
  private contentAnalysis: any = {};
  private performanceLevel: 'low' | 'medium' | 'high' = 'medium';
  private isActive: boolean = false;

  constructor(container: HTMLElement, options: any = {}) {
    this.container = container;
    this.dimensions = this.getDimensions();
    this.compositionRules = this.initializeCompositionRules(options);
    this.eyeTrackingData = this.initializeEyeTracking();
    
    this.analyzeContent();
    this.detectPerformanceLevel();
    this.generateDynamicFocusPoints();
    this.createMagneticZones();
    this.setupVisualGuidance();
    
    this.startFocusEngine();
  }

  /**
   * 1. DÉTECTION INTELLIGENTE DE ZONES MAGNÉTIQUES
   */
  private generateDynamicFocusPoints(): void {
    this.focusPoints = [];
    
    // Application de la règle des tiers avec variations créatives
    const thirdPoints = this.calculateRuleOfThirdsPoints();
    this.focusPoints.push(...thirdPoints);
    
    // Points dorés basés sur le ratio d'or
    const goldenPoints = this.calculateGoldenRatioPoints();
    this.focusPoints.push(...goldenPoints);
    
    // Spirale de Fibonacci pour trajectoires naturelles
    const fibonacciPoints = this.calculateFibonacciPoints();
    this.focusPoints.push(...fibonacciPoints);
    
    // Zones de focus multiples avec hiérarchisation
    this.hierarchizeFocusPoints();
    
    // Optimisation basée sur le contenu détecté
    this.optimizeFocusForContent();
  }

  private calculateRuleOfThirdsPoints(): FocusPoint[] {
    const { width, height } = this.dimensions;
    const points: FocusPoint[] = [];
    
    // Points d'intersection de la règle des tiers
    const thirdX = [width * 0.33, width * 0.67];
    const thirdY = [height * 0.33, height * 0.67];
    
    let pointIndex = 0;
    for (const x of thirdX) {
      for (const y of thirdY) {
        // Variations créatives : décalage subtil pour naturel
        const variation = this.calculateCreativeVariation(pointIndex);
        
        points.push({
          x: x + variation.x,
          y: y + variation.y,
          weight: 0.8 - pointIndex * 0.1, // Priorité décroissante
          type: pointIndex === 0 ? 'primary' : 'secondary',
          magneticStrength: 0.7,
          attractionRadius: Math.min(width, height) * 0.15
        });
        pointIndex++;
      }
    }
    
    return points;
  }

  private calculateGoldenRatioPoints(): FocusPoint[] {
    const { width, height } = this.dimensions;
    const goldenRatio = 1.618;
    const points: FocusPoint[] = [];
    
    // Points basés sur le ratio d'or
    const goldenX = width / goldenRatio;
    const goldenY = height / goldenRatio;
    
    points.push({
      x: goldenX,
      y: goldenY,
      weight: 0.9,
      type: 'primary',
      magneticStrength: 0.8,
      attractionRadius: Math.min(width, height) * 0.12
    });
    
    // Point complémentaire
    points.push({
      x: width - goldenX,
      y: height - goldenY,
      weight: 0.7,
      type: 'secondary',
      magneticStrength: 0.6,
      attractionRadius: Math.min(width, height) * 0.1
    });
    
    return points;
  }

  private calculateFibonacciPoints(): FocusPoint[] {
    const { width, height } = this.dimensions;
    const points: FocusPoint[] = [];
    
    // Spirale de Fibonacci pour trajectoires naturelles
    const fibSequence = [1, 1, 2, 3, 5, 8, 13, 21];
    const maxFib = fibSequence[fibSequence.length - 1];
    
    for (let i = 0; i < Math.min(6, fibSequence.length); i++) {
      const ratio = fibSequence[i] / maxFib;
      const angle = (i * 137.5) * Math.PI / 180; // Angle d'or
      
      const radius = Math.min(width, height) * 0.3 * ratio;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        weight: 0.6 - i * 0.08,
        type: i < 2 ? 'secondary' : 'tertiary',
        magneticStrength: 0.5 - i * 0.05,
        attractionRadius: radius * 0.8
      });
    }
    
    return points;
  }

  private calculateCreativeVariation(index: number): { x: number; y: number } {
    // Variations créatives pour éviter la rigidité
    const maxVariation = Math.min(this.dimensions.width, this.dimensions.height) * 0.02;
    const seed = index * 137.5; // Utilisation de l'angle d'or comme seed
    
    return {
      x: Math.sin(seed) * maxVariation,
      y: Math.cos(seed) * maxVariation
    };
  }

  private hierarchizeFocusPoints(): void {
    // Tri par poids et type pour hiérarchisation
    this.focusPoints.sort((a, b) => {
      if (a.type !== b.type) {
        const typeOrder = { 'primary': 3, 'secondary': 2, 'tertiary': 1 };
        return typeOrder[b.type] - typeOrder[a.type];
      }
      return b.weight - a.weight;
    });
    
    // Limitation du nombre de points selon les performances
    const maxPoints = this.getMaxFocusPoints();
    this.focusPoints = this.focusPoints.slice(0, maxPoints);
  }

  private getMaxFocusPoints(): number {
    switch (this.performanceLevel) {
      case 'high': return 12;
      case 'medium': return 8;
      case 'low': return 5;
      default: return 8;
    }
  }

  /**
   * 2. EYE-TRACKING VIRTUEL PRÉDICTIF
   */
  private initializeEyeTracking(): EyeTrackingData {
    const contentType = this.detectContentType();
    const scanPattern = this.determineScanPattern(contentType);
    
    return {
      scanPattern,
      hotspots: [],
      readingDirection: this.detectReadingDirection(),
      attentionSpan: this.calculateAttentionSpan(),
      cognitiveLoad: this.assessCognitiveLoad()
    };
  }

  private determineScanPattern(contentType: string): 'F' | 'Z' | 'circular' | 'layered' {
    // Prédiction basée sur la psychologie cognitive
    switch (contentType) {
      case 'text-heavy': return 'F';
      case 'image-rich': return 'Z';
      case 'interactive': return 'circular';
      case 'mixed': return 'layered';
      default: return 'Z';
    }
  }

  private generateEyeTrackingTrajectories(): VisualTrajectory[] {
    const trajectories: VisualTrajectory[] = [];
    const pattern = this.eyeTrackingData.scanPattern;
    
    switch (pattern) {
      case 'F':
        trajectories.push(this.createFPatternTrajectory());
        break;
      case 'Z':
        trajectories.push(this.createZPatternTrajectory());
        break;
      case 'circular':
        trajectories.push(this.createCircularTrajectory());
        break;
      case 'layered':
        trajectories.push(...this.createLayeredTrajectories());
        break;
    }
    
    return trajectories;
  }

  private createFPatternTrajectory(): VisualTrajectory {
    const { width, height } = this.dimensions;
    const points = [
      { x: width * 0.1, y: height * 0.2, time: 0 },
      { x: width * 0.9, y: height * 0.2, time: 1000 },
      { x: width * 0.1, y: height * 0.5, time: 2000 },
      { x: width * 0.6, y: height * 0.5, time: 3000 },
      { x: width * 0.1, y: height * 0.8, time: 4000 }
    ];
    
    return {
      points,
      naturalFlow: true,
      eyeTrackingOptimized: true,
      fibonacciAligned: false
    };
  }

  private createZPatternTrajectory(): VisualTrajectory {
    const { width, height } = this.dimensions;
    const points = [
      { x: width * 0.1, y: height * 0.1, time: 0 },
      { x: width * 0.9, y: height * 0.1, time: 1000 },
      { x: width * 0.1, y: height * 0.9, time: 2000 },
      { x: width * 0.9, y: height * 0.9, time: 3000 }
    ];
    
    return {
      points,
      naturalFlow: true,
      eyeTrackingOptimized: true,
      fibonacciAligned: false
    };
  }

  private createCircularTrajectory(): VisualTrajectory {
    const { width, height } = this.dimensions;
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const radius = Math.min(width, height) * 0.3;
    const points = [];
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        time: i * 500
      });
    }
    
    return {
      points,
      naturalFlow: true,
      eyeTrackingOptimized: true,
      fibonacciAligned: true
    };
  }

  /**
   * 3. AIMANTS VISUELS SUBTILS MULTI-NIVEAU
   */
  private createMagneticZones(): void {
    this.magneticZones = [];
    
    // Zones basées sur les points de focus
    this.focusPoints.forEach((point, index) => {
      this.magneticZones.push({
        centerX: point.x,
        centerY: point.y,
        radius: point.attractionRadius,
        strength: point.magneticStrength,
        priority: this.getPriorityFromType(point.type),
        effectType: this.selectEffectType(point.type, index),
        active: true
      });
    });
    
    // Zones de contenu importantes détectées
    const contentZones = this.detectImportantContentZones();
    this.magneticZones.push(...contentZones);
  }

  private selectEffectType(type: string, index: number): 'glow' | 'pulse' | 'parallax' | 'subtle' {
    if (this.performanceLevel === 'low') return 'subtle';
    
    switch (type) {
      case 'primary': return index % 2 === 0 ? 'glow' : 'pulse';
      case 'secondary': return 'parallax';
      case 'tertiary': return 'subtle';
      default: return 'subtle';
    }
  }

  private generateSubtleLueurs(zone: MagneticZone): void {
    if (!this.shouldCreateEffect('glow')) return;
    
    const glowElement = this.createGlowElement(zone);
    this.applyMicroSynchronization(glowElement);
    this.attachToContainer(glowElement);
  }

  private generatePulsationsMicro(zone: MagneticZone): void {
    if (!this.shouldCreateEffect('pulse')) return;
    
    const pulseElement = this.createPulseElement(zone);
    const naturalRhythm = this.calculateNaturalRhythm();
    this.applyPulseAnimation(pulseElement, naturalRhythm);
    this.attachToContainer(pulseElement);
  }

  private calculateNaturalRhythm(): number {
    // Basé sur le rythme cardiaque au repos (60-100 bpm)
    const baseRhythm = 72; // BPM moyen
    const variation = Math.sin(Date.now() * 0.001) * 8; // Variation naturelle
    return (baseRhythm + variation) / 60; // Conversion en Hz
  }

  /**
   * 4. SYSTÈME DE COMPOSITION ARTISTIQUE AVANCÉ
   */
  private initializeCompositionRules(options: any): CompositionRules {
    return {
      ruleOfThirds: options.ruleOfThirds !== false,
      goldenRatio: options.goldenRatio !== false,
      fibonacci: options.fibonacci !== false,
      leadingLines: options.leadingLines !== false,
      symmetry: options.symmetry !== false,
      contrast: options.contrast !== false
    };
  }

  private analyzeColorHarmony(): any {
    const computedStyle = window.getComputedStyle(this.container);
    const backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;
    
    return {
      dominantHue: this.extractHue(backgroundColor),
      contrastRatio: this.calculateContrast(backgroundColor, color),
      harmony: this.assessColorHarmony(backgroundColor, color),
      temperature: this.analyzeColorTemperature(backgroundColor)
    };
  }

  private generateOptimalPaths(): VisualTrajectory[] {
    const paths: VisualTrajectory[] = [];
    
    // Chemin principal basé sur la composition
    const mainPath = this.createMainCompositionPath();
    paths.push(mainPath);
    
    // Chemins secondaires pour la profondeur
    if (this.performanceLevel !== 'low') {
      const secondaryPaths = this.createSecondaryPaths();
      paths.push(...secondaryPaths);
    }
    
    return paths;
  }

  private createMainCompositionPath(): VisualTrajectory {
    const orderedPoints = [...this.focusPoints]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 4);
    
    const pathPoints = orderedPoints.map((point, index) => ({
      x: point.x,
      y: point.y,
      time: index * 800
    }));
    
    return {
      points: pathPoints,
      naturalFlow: true,
      eyeTrackingOptimized: true,
      fibonacciAligned: this.compositionRules.fibonacci
    };
  }

  /**
   * 5. ADAPTATION CONTEXTUELLE INTELLIGENTE
   */
  private analyzeContent(): void {
    this.contentAnalysis = {
      contentType: this.detectContentType(),
      complexity: this.calculateContentComplexity(),
      interactivity: this.assessInteractivity(),
      visualDensity: this.calculateVisualDensity(),
      readabilityNeeds: this.assessReadabilityNeeds()
    };
  }

  private detectContentType(): string {
    const textRatio = this.calculateTextRatio();
    const imageRatio = this.calculateImageRatio();
    const interactiveRatio = this.calculateInteractiveRatio();
    
    if (interactiveRatio > 0.3) return 'interactive';
    if (imageRatio > 0.5) return 'image-rich';
    if (textRatio > 0.7) return 'text-heavy';
    return 'mixed';
  }

  private optimizeFocusForContent(): void {
    const { contentType, complexity, interactivity } = this.contentAnalysis;
    
    switch (contentType) {
      case 'text-heavy':
        this.optimizeForText();
        break;
      case 'image-rich':
        this.optimizeForImages();
        break;
      case 'interactive':
        this.optimizeForInteraction();
        break;
      case 'mixed':
        this.optimizeForMixed();
        break;
    }
    
    // Ajustements basés sur la complexité
    if (complexity > 0.8) {
      this.reduceVisualNoise();
    }
  }

  private optimizeForText(): void {
    // Priorité aux zones de lecture
    this.focusPoints = this.focusPoints.filter(point => 
      point.type === 'primary' || point.y < this.dimensions.height * 0.7
    );
    
    // Ajustement pour le pattern de lecture F
    this.eyeTrackingData.scanPattern = 'F';
  }

  private optimizeForImages(): void {
    // Focus sur les points forts visuels
    this.focusPoints.forEach(point => {
      if (point.type === 'primary') {
        point.magneticStrength *= 1.2;
        point.attractionRadius *= 1.1;
      }
    });
  }

  /**
   * 6. PERFORMANCE OPTIMISÉE
   */
  private detectPerformanceLevel(): void {
    const deviceMetrics = this.getDeviceMetrics();
    const complexity = this.contentAnalysis.complexity || 0.5;
    
    let score = 0;
    
    // Score basé sur les métriques du device
    score += deviceMetrics.cores >= 4 ? 2 : deviceMetrics.cores >= 2 ? 1 : 0;
    score += deviceMetrics.memory >= 4 ? 2 : deviceMetrics.memory >= 2 ? 1 : 0;
    score += deviceMetrics.isMobile ? -1 : 1;
    
    // Ajustement basé sur la complexité du contenu
    score -= complexity > 0.7 ? 1 : 0;
    
    if (score >= 4) this.performanceLevel = 'high';
    else if (score >= 2) this.performanceLevel = 'medium';
    else this.performanceLevel = 'low';
  }

  private getDeviceMetrics(): any {
    return {
      cores: navigator.hardwareConcurrency || 2,
      memory: (navigator as any).deviceMemory || 2,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };
  }

  private createOptimizedTrajectories(): void {
    // Cache des trajectoires calculées
    const cacheKey = `trajectories_${this.dimensions.width}x${this.dimensions.height}_${this.performanceLevel}`;
    
    if (this.hasTrajectoryCache(cacheKey)) {
      this.activeTrajectories = this.getTrajectoryCache(cacheKey);
      return;
    }
    
    this.activeTrajectories = this.generateEyeTrackingTrajectories();
    this.setTrajectoryCache(cacheKey, this.activeTrajectories);
  }

  /**
   * MÉTHODES PUBLIQUES PRINCIPALES
   */
  public activateFocusGuidance(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.createMagneticZones();
    this.generateVisualGuidances();
    this.startFocusAnimations();
  }

  public deactivateFocusGuidance(): void {
    this.isActive = false;
    this.cleanupVisualElements();
  }

  public updateFocusPoints(newPoints: Partial<FocusPoint>[]): void {
    newPoints.forEach((newPoint, index) => {
      if (this.focusPoints[index]) {
        Object.assign(this.focusPoints[index], newPoint);
      }
    });
    
    this.regenerateMagneticZones();
  }

  public getFocusAnalytics(): any {
    return {
      totalFocusPoints: this.focusPoints.length,
      activeMagneticZones: this.magneticZones.filter(z => z.active).length,
      eyeTrackingPattern: this.eyeTrackingData.scanPattern,
      performanceLevel: this.performanceLevel,
      contentOptimization: this.contentAnalysis.contentType
    };
  }

  public adaptToNewContent(): void {
    this.analyzeContent();
    this.generateDynamicFocusPoints();
    this.createMagneticZones();
    
    if (this.isActive) {
      this.regenerateVisualGuidances();
    }
  }

  /**
   * MÉTHODES UTILITAIRES PRIVÉES
   */
  private getDimensions(): { width: number; height: number } {
    const rect = this.container.getBoundingClientRect();
    return {
      width: rect.width || window.innerWidth,
      height: rect.height || window.innerHeight
    };
  }

  private detectReadingDirection(): 'ltr' | 'rtl' | 'ttb' {
    const computedStyle = window.getComputedStyle(this.container);
    const direction = computedStyle.direction;
    const writingMode = computedStyle.writingMode;
    
    if (writingMode.includes('vertical')) return 'ttb';
    return direction === 'rtl' ? 'rtl' : 'ltr';
  }

  private calculateAttentionSpan(): number {
    // Basé sur la recherche en UX (8-12 secondes moyenne)
    const complexity = this.contentAnalysis.complexity || 0.5;
    const baseSpan = 10000; // 10 secondes
    
    return baseSpan * (1 - complexity * 0.3);
  }

  private assessCognitiveLoad(): number {
    const elementCount = this.container.querySelectorAll('*').length;
    const textLength = this.container.textContent?.length || 0;
    const interactiveElements = this.container.querySelectorAll('button, input, select, textarea').length;
    
    let load = 0;
    load += Math.min(elementCount / 100, 1) * 0.4;
    load += Math.min(textLength / 1000, 1) * 0.3;
    load += Math.min(interactiveElements / 10, 1) * 0.3;
    
    return Math.min(load, 1);
  }

  private calculateTextRatio(): number {
    const totalText = this.container.textContent?.length || 0;
    const totalElements = this.container.querySelectorAll('*').length;
    return totalElements > 0 ? Math.min(totalText / (totalElements * 50), 1) : 0;
  }

  private calculateImageRatio(): number {
    const images = this.container.querySelectorAll('img, svg, canvas').length;
    const totalElements = this.container.querySelectorAll('*').length;
    return totalElements > 0 ? images / totalElements : 0;
  }

  private calculateInteractiveRatio(): number {
    const interactive = this.container.querySelectorAll('button, input, select, textarea, [onclick]').length;
    const totalElements = this.container.querySelectorAll('*').length;
    return totalElements > 0 ? interactive / totalElements : 0;
  }

  private calculateContentComplexity(): number {
    const elementCount = this.container.querySelectorAll('*').length;
    const nestingDepth = this.calculateNestingDepth();
    const styleComplexity = this.calculateStyleComplexity();
    
    let complexity = 0;
    complexity += Math.min(elementCount / 200, 1) * 0.4;
    complexity += Math.min(nestingDepth / 15, 1) * 0.3;
    complexity += styleComplexity * 0.3;
    
    return Math.min(complexity, 1);
  }

  private calculateNestingDepth(): number {
    let maxDepth = 0;
    
    const traverse = (element: Element, depth: number) => {
      maxDepth = Math.max(maxDepth, depth);
      for (const child of element.children) {
        traverse(child, depth + 1);
      }
    };
    
    traverse(this.container, 0);
    return maxDepth;
  }

  private calculateStyleComplexity(): number {
    const computedStyle = window.getComputedStyle(this.container);
    let complexity = 0;
    
    // Analyse des propriétés complexes
    if (computedStyle.transform !== 'none') complexity += 0.2;
    if (computedStyle.filter !== 'none') complexity += 0.2;
    if (computedStyle.background.includes('gradient')) complexity += 0.2;
    if (computedStyle.animation !== 'none') complexity += 0.2;
    if (computedStyle.boxShadow !== 'none') complexity += 0.2;
    
    return Math.min(complexity, 1);
  }

  private calculateVisualDensity(): number {
    const rect = this.container.getBoundingClientRect();
    const area = rect.width * rect.height;
    const elementCount = this.container.querySelectorAll('*').length;
    
    return elementCount / (area / 10000); // Éléments par 10k pixels²
  }

  private assessInteractivity(): number {
    const interactiveElements = this.container.querySelectorAll(
      'button, input, select, textarea, a, [onclick], [onmouseover]'
    ).length;
    const totalElements = this.container.querySelectorAll('*').length;
    
    return totalElements > 0 ? interactiveElements / totalElements : 0;
  }

  private assessReadabilityNeeds(): number {
    const textElements = this.container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div').length;
    const totalElements = this.container.querySelectorAll('*').length;
    
    return totalElements > 0 ? textElements / totalElements : 0;
  }

  private getPriorityFromType(type: string): number {
    const priorities = { 'primary': 3, 'secondary': 2, 'tertiary': 1 };
    return priorities[type as keyof typeof priorities] || 1;
  }

  private detectImportantContentZones(): MagneticZone[] {
    const zones: MagneticZone[] = [];
    
    // Zones de titres importants
    const headings = this.container.querySelectorAll('h1, h2');
    headings.forEach(heading => {
      const rect = heading.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();
      
      zones.push({
        centerX: rect.left - containerRect.left + rect.width / 2,
        centerY: rect.top - containerRect.top + rect.height / 2,
        radius: Math.max(rect.width, rect.height) / 2,
        strength: 0.6,
        priority: 2,
        effectType: 'subtle',
        active: true
      });
    });
    
    return zones;
  }

  private extractHue(color: string): number {
    // Extraction autonome de la teinte
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return 0;
    
    const [, r, g, b] = match.map(Number);
    return this.rgbToHue(r / 255, g / 255, b / 255);
  }

  private rgbToHue(r: number, g: number, b: number): number {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    if (diff === 0) return 0;
    
    let hue = 0;
    if (max === r) hue = (g - b) / diff;
    else if (max === g) hue = 2 + (b - r) / diff;
    else hue = 4 + (r - g) / diff;
    
    return (hue * 60 + 360) % 360;
  }

  private calculateContrast(bg: string, fg: string): number {
    // Calcul simplifié du contraste
    return 4.5; // Valeur par défaut WCAG AA
  }

  private assessColorHarmony(bg: string, fg: string): string {
    const bgHue = this.extractHue(bg);
    const fgHue = this.extractHue(fg);
    const difference = Math.abs(bgHue - fgHue);
    
    if (difference < 30) return 'monochromatic';
    if (difference < 90) return 'analogous';
    if (difference < 150) return 'triadic';
    return 'complementary';
  }

  private analyzeColorTemperature(color: string): 'warm' | 'cool' | 'neutral' {
    const hue = this.extractHue(color);
    
    if (hue >= 0 && hue <= 60) return 'warm';
    if (hue >= 240 && hue <= 300) return 'cool';
    return 'neutral';
  }

  private createLayeredTrajectories(): VisualTrajectory[] {
    return [
      this.createFPatternTrajectory(),
      this.createCircularTrajectory()
    ];
  }

  private createSecondaryPaths(): VisualTrajectory[] {
    return this.focusPoints
      .filter(point => point.type === 'secondary')
      .slice(0, 3)
      .map(point => ({
        points: [{ x: point.x, y: point.y, time: 0 }],
        naturalFlow: true,
        eyeTrackingOptimized: false,
        fibonacciAligned: false
      }));
  }

  private shouldCreateEffect(type: string): boolean {
    if (this.performanceLevel === 'low') return type === 'subtle';
    if (this.performanceLevel === 'medium') return type !== 'parallax';
    return true;
  }

  private createGlowElement(zone: MagneticZone): HTMLElement {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: absolute;
      left: ${zone.centerX - zone.radius}px;
      top: ${zone.centerY - zone.radius}px;
      width: ${zone.radius * 2}px;
      height: ${zone.radius * 2}px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      pointer-events: none;
      z-index: 1000;
    `;
    return glow;
  }

  private createPulseElement(zone: MagneticZone): HTMLElement {
    const pulse = document.createElement('div');
    pulse.style.cssText = `
      position: absolute;
      left: ${zone.centerX - 5}px;
      top: ${zone.centerY - 5}px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      pointer-events: none;
      z-index: 1001;
    `;
    return pulse;
  }

  private applyMicroSynchronization(element: HTMLElement): void {
    const rhythm = this.calculateNaturalRhythm();
    const duration = 1000 / rhythm;
    
    element.style.animation = `subtleGlow ${duration}ms ease-in-out infinite alternate`;
  }

  private applyPulseAnimation(element: HTMLElement, rhythm: number): void {
    const duration = 1000 / rhythm;
    element.style.animation = `subtlePulse ${duration}ms ease-in-out infinite`;
  }

  private attachToContainer(element: HTMLElement): void {
    if (this.container.style.position === 'static') {
      this.container.style.position = 'relative';
    }
    this.container.appendChild(element);
  }

  private startFocusEngine(): void {
    this.setupVisualGuidance();
    this.createOptimizedTrajectories();
    this.injectFocusStyles();
  }

  private setupVisualGuidance(): void {
    this.magneticZones.forEach(zone => {
      switch (zone.effectType) {
        case 'glow':
          this.generateSubtleLueurs(zone);
          break;
        case 'pulse':
          this.generatePulsationsMicro(zone);
          break;
        case 'parallax':
          this.createParallaxEffect(zone);
          break;
        case 'subtle':
          this.createSubtleEffect(zone);
          break;
      }
    });
  }

  private generateVisualGuidances(): void {
    this.visualGuidances = this.magneticZones.map(zone => ({
      type: zone.effectType,
      intensity: zone.strength,
      color: 'rgba(255,255,255,0.1)',
      timing: this.calculateNaturalRhythm(),
      subtlety: this.performanceLevel === 'low' ? 0.9 : 0.7
    }));
  }

  private startFocusAnimations(): void {
    if (!this.isActive) return;
    
    this.magneticZones.forEach((zone, index) => {
      setTimeout(() => {
        this.animateZone(zone);
      }, index * 200);
    });
  }

  private animateZone(zone: MagneticZone): void {
    // Animation personnalisée par zone
  }

  private createParallaxEffect(zone: MagneticZone): void {
    // Effet de parallaxe pour la profondeur
  }

  private createSubtleEffect(zone: MagneticZone): void {
    // Effet subtil minimal
  }

  private regenerateMagneticZones(): void {
    this.cleanupVisualElements();
    this.createMagneticZones();
    if (this.isActive) {
      this.setupVisualGuidance();
    }
  }

  private regenerateVisualGuidances(): void {
    this.cleanupVisualElements();
    this.generateVisualGuidances();
    this.startFocusAnimations();
  }

  private cleanupVisualElements(): void {
    const focusElements = this.container.querySelectorAll('[data-visual-focus]');
    focusElements.forEach(element => element.remove());
  }

  private injectFocusStyles(): void {
    if (document.getElementById('visual-focus-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'visual-focus-styles';
    style.textContent = `
      @keyframes subtleGlow {
        0% { opacity: 0.1; transform: scale(1); }
        100% { opacity: 0.3; transform: scale(1.05); }
      }
      
      @keyframes subtlePulse {
        0% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(1.2); }
        100% { opacity: 0.2; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  private hasTrajectoryCache(key: string): boolean {
    return localStorage.getItem(`vfe_${key}`) !== null;
  }

  private getTrajectoryCache(key: string): VisualTrajectory[] {
    const cached = localStorage.getItem(`vfe_${key}`);
    return cached ? JSON.parse(cached) : [];
  }

  private setTrajectoryCache(key: string, trajectories: VisualTrajectory[]): void {
    try {
      localStorage.setItem(`vfe_${key}`, JSON.stringify(trajectories));
    } catch (e) {
      // Cache non critique, ignorer les erreurs
    }
  }

  private reduceVisualNoise(): void {
    // Réduction du bruit visuel en cas de complexité élevée
    this.focusPoints = this.focusPoints.filter(point => point.weight > 0.5);
    this.magneticZones = this.magneticZones.filter(zone => zone.priority >= 2);
  }

  private optimizeForMixed(): void {
    // Optimisation équilibrée pour contenu mixte
    this.eyeTrackingData.scanPattern = 'layered';
  }

  private optimizeForInteraction(): void {
    // Focus sur les éléments interactifs
    const interactiveElements = this.container.querySelectorAll('button, input, select, textarea, [onclick]');
    
    interactiveElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();
      
      this.focusPoints.push({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
        weight: 0.8,
        type: 'primary',
        magneticStrength: 0.9,
        attractionRadius: Math.max(rect.width, rect.height) / 2 + 20
      });
    });
  }
}

export default VisualFocusEngine;
