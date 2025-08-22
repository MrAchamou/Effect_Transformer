
/**
 * AttentionGuide - Module Niveau 2 Professionnel
 * Système de guidage visuel subtil avec intelligence psychologique
 * Aimants visuels, chemins d'attention et parallaxe intelligent
 */

interface VisualAttractor {
  id: string;
  element: Element;
  priority: number;
  type: 'primary' | 'secondary' | 'contextual' | 'temporal';
  intensity: number;
  timing: AttentionTiming;
  effects: VisualEffect[];
  magneticField: MagneticField;
}

interface AttentionTiming {
  appearDelay: number;
  duration: number;
  fadeInTime: number;
  sustainTime: number;
  fadeOutTime: number;
  pulseCycle: number;
  restPeriod: number;
}

interface VisualEffect {
  type: 'glow' | 'pulse' | 'shimmer' | 'float' | 'breathe' | 'magnetic' | 'parallax';
  strength: number;
  frequency: number;
  pattern: 'linear' | 'easeInOut' | 'heartbeat' | 'golden' | 'fibonacci';
  color?: string;
  spread?: number;
  direction?: number;
}

interface MagneticField {
  radius: number;
  strength: number;
  falloff: 'linear' | 'quadratic' | 'exponential';
  influence: 'cursor' | 'gaze' | 'scroll' | 'time';
  responsiveness: number;
}

interface AttentionPath {
  id: string;
  waypoints: AttentionWaypoint[];
  totalDuration: number;
  pathStyle: PathStyle;
  triggers: PathTrigger[];
  adaptive: boolean;
}

interface AttentionWaypoint {
  element: Element;
  dwellTime: number;
  priority: number;
  transitionStyle: 'direct' | 'curved' | 'organic' | 'spiral';
  anticipationTime: number;
}

interface PathStyle {
  visibility: 'invisible' | 'subtle' | 'visible' | 'adaptive';
  color: string;
  width: number;
  opacity: number;
  animation: 'static' | 'flow' | 'pulse' | 'particle';
}

interface PathTrigger {
  type: 'load' | 'scroll' | 'hover' | 'click' | 'time' | 'engagement';
  condition: any;
  delay: number;
  priority: number;
}

interface ParallaxLayer {
  depth: number;
  elements: Element[];
  speedMultiplier: number;
  direction: 'vertical' | 'horizontal' | 'radial' | 'organic';
  semanticImportance: number;
  interactionResponsiveness: number;
}

interface GazeSimulation {
  currentFocus: Element | null;
  gazePath: GazePoint[];
  readingPattern: 'western' | 'eastern' | 'rtl' | 'adaptive';
  scanBehavior: ScanBehavior;
  attentionModel: AttentionModel;
}

interface GazePoint {
  x: number;
  y: number;
  timestamp: number;
  confidence: number;
  element: Element | null;
  dwellDuration: number;
}

interface ScanBehavior {
  initialScanDuration: number;
  detailedScanTrigger: number;
  attentionSpan: number;
  fatigueRate: number;
  restRequirement: number;
}

interface AttentionModel {
  curiosityFactor: number;
  expertiseLevel: number;
  culturalContext: string;
  deviceContext: string;
  timeContext: string;
}

export class AttentionGuide {
  private container: Element;
  private attractors: Map<string, VisualAttractor> = new Map();
  private attentionPaths: Map<string, AttentionPath> = new Map();
  private parallaxLayers: ParallaxLayer[] = [];
  private gazeSimulation: GazeSimulation;
  private userProfile: UserAttentionProfile;
  private contextAnalyzer: AttentionContextAnalyzer;
  private psychologyEngine: VisualPsychologyEngine;
  private adaptiveController: AdaptiveAttentionController;
  private performanceOptimizer: AttentionPerformanceOptimizer;
  private isActive: boolean = false;

  constructor(container: Element = document.documentElement, options: any = {}) {
    this.container = container;
    this.contextAnalyzer = new AttentionContextAnalyzer();
    this.psychologyEngine = new VisualPsychologyEngine();
    this.adaptiveController = new AdaptiveAttentionController();
    this.performanceOptimizer = new AttentionPerformanceOptimizer();

    this.initializeAttentionGuide(options);
  }

  /**
   * 1. AIMANTS VISUELS SUBTILS INTELLIGENTS
   */
  private async initializeAttentionGuide(options: any): Promise<void> {
    console.log('🎯 Initialisation AttentionGuide...');

    // Analyse du contexte utilisateur
    this.userProfile = await this.contextAnalyzer.analyzeUserProfile();

    // Initialisation de la simulation de regard
    this.initializeGazeSimulation();

    // Scan des éléments importants
    this.scanForImportantElements();

    // Création des attracteurs visuels
    this.createVisualAttractors();

    // Génération des chemins d'attention
    this.generateAttentionPaths();

    // Configuration du parallaxe intelligent
    this.setupIntelligentParallax();

    // Démarrage du système adaptatif
    this.startAdaptiveSystem();

    this.isActive = true;
    console.log('✅ AttentionGuide initialisé avec', this.attractors.size, 'attracteurs');
  }

  private createVisualAttractors(): void {
    const importantElements = this.identifyImportantElements();

    importantElements.forEach((element, index) => {
      const attractor: VisualAttractor = {
        id: `attractor_${index}`,
        element,
        priority: this.calculateElementPriority(element),
        type: this.determineAttractorType(element),
        intensity: this.calculateOptimalIntensity(element),
        timing: this.generateAttentionTiming(element),
        effects: this.selectVisualEffects(element),
        magneticField: this.createMagneticField(element)
      };

      this.attractors.set(attractor.id, attractor);
      this.applyVisualAttractor(attractor);
    });

    console.log('🧲 Attracteurs visuels créés:', this.attractors.size);
  }

  private applyVisualAttractor(attractor: VisualAttractor): void {
    const { element, effects, timing, magneticField } = attractor;

    // Application des effets visuels
    effects.forEach(effect => {
      this.applyVisualEffect(element, effect, timing);
    });

    // Configuration du champ magnétique
    this.setupMagneticInteraction(element, magneticField);

    // Timing d'apparition adaptatif
    this.scheduleAttractorActivation(attractor);
  }

  private applyVisualEffect(element: Element, effect: VisualEffect, timing: AttentionTiming): void {
    const animations = {
      'glow': () => this.createGlowEffect(element, effect, timing),
      'pulse': () => this.createPulseEffect(element, effect, timing),
      'shimmer': () => this.createShimmerEffect(element, effect, timing),
      'float': () => this.createFloatEffect(element, effect, timing),
      'breathe': () => this.createBreatheEffect(element, effect, timing),
      'magnetic': () => this.createMagneticEffect(element, effect, timing)
    };

    const animationFn = animations[effect.type];
    if (animationFn) {
      setTimeout(animationFn, timing.appearDelay);
    }
  }

  private createGlowEffect(element: Element, effect: VisualEffect, timing: AttentionTiming): void {
    const glowIntensity = effect.strength * this.calculateContextualIntensity();
    const glowColor = effect.color || this.psychologyEngine.getOptimalGlowColor();

    const glowStyle = `
      box-shadow: 0 0 ${10 * glowIntensity}px ${glowColor}${Math.floor(glowIntensity * 255).toString(16)};
      transition: box-shadow ${timing.fadeInTime}ms ease-in-out;
    `;

    (element as HTMLElement).style.cssText += glowStyle;

    // Animation pulsante
    this.createPulseAnimation(element, timing.pulseCycle, glowIntensity);
  }

  private createPulseEffect(element: Element, effect: VisualEffect, timing: AttentionTiming): void {
    const pulsePattern = this.psychologyEngine.generateHeartbeatPattern();
    
    const keyframes = pulsePattern.map((intensity, index) => ({
      offset: index / (pulsePattern.length - 1),
      transform: `scale(${1 + (intensity * effect.strength * 0.05)})`,
      opacity: 0.8 + (intensity * 0.2)
    }));

    const animation = element.animate(keyframes, {
      duration: timing.pulseCycle,
      iterations: Infinity,
      easing: 'ease-in-out'
    });

    // Adaptation basée sur l'engagement utilisateur
    this.adaptPulseToEngagement(animation, effect);
  }

  private createMagneticEffect(element: Element, effect: VisualEffect, timing: AttentionTiming): void {
    let isHovered = false;
    let magneticAnimation: Animation | null = null;

    const magneticHandler = (event: MouseEvent) => {
      if (!isHovered) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const magneticRadius = effect.spread || 100;

      if (distance < magneticRadius) {
        const magneticStrength = (1 - distance / magneticRadius) * effect.strength;
        const offsetX = deltaX * magneticStrength * 0.3;
        const offsetY = deltaY * magneticStrength * 0.3;

        if (magneticAnimation) {
          magneticAnimation.cancel();
        }

        magneticAnimation = element.animate([
          { transform: `translate(${offsetX}px, ${offsetY}px)` }
        ], {
          duration: 200,
          fill: 'forwards',
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
      }
    };

    element.addEventListener('mouseenter', () => {
      isHovered = true;
      document.addEventListener('mousemove', magneticHandler);
    });

    element.addEventListener('mouseleave', () => {
      isHovered = false;
      document.removeEventListener('mousemove', magneticHandler);
      
      if (magneticAnimation) {
        magneticAnimation.cancel();
      }

      element.animate([
        { transform: 'translate(0px, 0px)' }
      ], {
        duration: 300,
        fill: 'forwards',
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });
    });
  }

  /**
   * 2. CHEMINS D'ATTENTION INTELLIGENTS
   */
  private generateAttentionPaths(): void {
    const readingFlow = this.analyzeOptimalReadingFlow();
    const importanceHierarchy = this.calculateImportanceHierarchy();
    
    // Chemin principal basé sur la hiérarchie visuelle
    const primaryPath = this.createPrimaryAttentionPath(importanceHierarchy);
    
    // Chemins contextuels pour différents scénarios
    const discoveryPath = this.createDiscoveryPath();
    const expertPath = this.createExpertPath();
    const mobilePath = this.createMobilePath();

    this.attentionPaths.set('primary', primaryPath);
    this.attentionPaths.set('discovery', discoveryPath);
    this.attentionPaths.set('expert', expertPath);
    this.attentionPaths.set('mobile', mobilePath);

    // Activation du chemin approprié
    const activePath = this.selectOptimalPath();
    this.activateAttentionPath(activePath);

    console.log('🛤️ Chemins d\'attention générés:', this.attentionPaths.size);
  }

  private createPrimaryAttentionPath(hierarchy: Element[]): AttentionPath {
    const waypoints: AttentionWaypoint[] = hierarchy.map((element, index) => ({
      element,
      dwellTime: this.calculateOptimalDwellTime(element),
      priority: hierarchy.length - index,
      transitionStyle: this.selectTransitionStyle(element, index),
      anticipationTime: this.calculateAnticipationTime(element)
    }));

    return {
      id: 'primary',
      waypoints,
      totalDuration: waypoints.reduce((sum, wp) => sum + wp.dwellTime, 0),
      pathStyle: this.generatePathStyle('primary'),
      triggers: this.generatePathTriggers('primary'),
      adaptive: true
    };
  }

  private activateAttentionPath(pathId: string): void {
    const path = this.attentionPaths.get(pathId);
    if (!path) return;

    path.triggers.forEach(trigger => {
      this.setupPathTrigger(trigger, path);
    });

    // Animation du chemin si visible
    if (path.pathStyle.visibility !== 'invisible') {
      this.animateAttentionPath(path);
    }

    // Guidage par waypoints
    this.initiateWaypointGuidance(path);
  }

  private initiateWaypointGuidance(path: AttentionPath): void {
    let currentWaypointIndex = 0;
    const guideNextWaypoint = () => {
      if (currentWaypointIndex >= path.waypoints.length) return;

      const waypoint = path.waypoints[currentWaypointIndex];
      const anticipationTime = waypoint.anticipationTime;

      // Pre-activation pour anticipation
      setTimeout(() => {
        this.preActivateWaypoint(waypoint);
      }, Math.max(0, anticipationTime - 200));

      // Activation principale
      setTimeout(() => {
        this.activateWaypoint(waypoint);
        currentWaypointIndex++;
        
        setTimeout(guideNextWaypoint, waypoint.dwellTime);
      }, anticipationTime);
    };

    guideNextWaypoint();
  }

  /**
   * 3. PARALLAXE INTELLIGENT MULTI-COUCHES
   */
  private setupIntelligentParallax(): void {
    const semanticLayers = this.analyzeSemanticeImportance();
    
    semanticLayers.forEach((layer, index) => {
      const parallaxLayer: ParallaxLayer = {
        depth: index + 1,
        elements: layer.elements,
        speedMultiplier: this.calculateOptimalSpeed(layer.importance, index),
        direction: this.determineOptimalDirection(layer.context),
        semanticImportance: layer.importance,
        interactionResponsiveness: this.calculateResponsiveness(layer.importance)
      };

      this.parallaxLayers.push(parallaxLayer);
      this.applyParallaxLayer(parallaxLayer);
    });

    this.initializeParallaxController();
    console.log('🌊 Parallaxe intelligent configuré:', this.parallaxLayers.length, 'couches');
  }

  private applyParallaxLayer(layer: ParallaxLayer): void {
    const elements = Array.from(layer.elements);
    
    elements.forEach(element => {
      // Configuration de base
      (element as HTMLElement).style.willChange = 'transform';
      (element as HTMLElement).style.backfaceVisibility = 'hidden';
      
      // Application de la profondeur sémantique
      const zIndex = Math.floor((1 - layer.semanticImportance) * 1000);
      (element as HTMLElement).style.zIndex = zIndex.toString();
    });

    // Enregistrement pour les calculs de parallaxe
    this.registerParallaxElements(layer);
  }

  private initializeParallaxController(): void {
    let ticking = false;
    let lastScrollY = window.scrollY;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const updateParallax = () => {
      const scrollDelta = window.scrollY - lastScrollY;
      const mouseDeltaX = event ? (event as MouseEvent).clientX - lastMouseX : 0;
      const mouseDeltaY = event ? (event as MouseEvent).clientY - lastMouseY : 0;

      this.parallaxLayers.forEach(layer => {
        this.updateLayerParallax(layer, {
          scrollDelta,
          mouseDeltaX,
          mouseDeltaY,
          timestamp: performance.now()
        });
      });

      lastScrollY = window.scrollY;
      ticking = false;
    };

    const requestParallaxUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Événements optimisés
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    document.addEventListener('mousemove', (e) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      requestParallaxUpdate();
    }, { passive: true });
  }

  /**
   * 4. SIMULATION EYE-TRACKING VIRTUEL
   */
  private initializeGazeSimulation(): void {
    this.gazeSimulation = {
      currentFocus: null,
      gazePath: [],
      readingPattern: this.detectReadingPattern(),
      scanBehavior: this.analyzeScanBehavior(),
      attentionModel: this.buildAttentionModel()
    };

    this.startVirtualGazeTracking();
    console.log('👁️ Simulation eye-tracking initialisée');
  }

  private startVirtualGazeTracking(): void {
    const gazeUpdateInterval = 100; // 10 FPS pour simulation
    let simulationStep = 0;

    const updateGazeSimulation = () => {
      const predictedGazePoint = this.predictGazePoint(simulationStep);
      const focusedElement = this.getElementAtPoint(predictedGazePoint);

      if (focusedElement !== this.gazeSimulation.currentFocus) {
        this.handleGazeFocusChange(this.gazeSimulation.currentFocus, focusedElement);
        this.gazeSimulation.currentFocus = focusedElement;
      }

      // Enregistrement du point de regard
      this.gazeSimulation.gazePath.push({
        x: predictedGazePoint.x,
        y: predictedGazePoint.y,
        timestamp: performance.now(),
        confidence: this.calculateGazeConfidence(predictedGazePoint),
        element: focusedElement,
        dwellDuration: this.calculateDwellDuration(focusedElement)
      });

      // Nettoyage du chemin (garder seulement les 100 derniers points)
      if (this.gazeSimulation.gazePath.length > 100) {
        this.gazeSimulation.gazePath.shift();
      }

      simulationStep++;
    };

    setInterval(updateGazeSimulation, gazeUpdateInterval);

    // Génération de heatmap virtuelle
    setInterval(() => {
      this.generateVirtualHeatmap();
    }, 5000);
  }

  private predictGazePoint(step: number): { x: number; y: number } {
    const { readingPattern, scanBehavior } = this.gazeSimulation;
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    // Patterns de lecture selon la culture
    const patterns = {
      'western': () => this.predictWesternGaze(step, viewport),
      'eastern': () => this.predictEasternGaze(step, viewport),
      'rtl': () => this.predictRTLGaze(step, viewport),
      'adaptive': () => this.predictAdaptiveGaze(step, viewport)
    };

    return patterns[readingPattern]();
  }

  private predictWesternGaze(step: number, viewport: any): { x: number; y: number } {
    // Simulation du pattern Z occidental
    const phase = (step * 0.1) % (Math.PI * 4);
    const baseX = (Math.sin(phase * 0.5) + 1) * viewport.width * 0.4 + viewport.width * 0.1;
    const baseY = (phase / (Math.PI * 4)) * viewport.height * 0.8 + viewport.height * 0.1;

    // Ajout de variations naturelles
    const naturalVariationX = (Math.sin(step * 0.3) * 20);
    const naturalVariationY = (Math.sin(step * 0.2) * 15);

    return {
      x: baseX + naturalVariationX,
      y: baseY + naturalVariationY
    };
  }

  /**
   * 5. SYSTÈME ADAPTATIF D'ATTENTION
   */
  private startAdaptiveSystem(): void {
    // Monitoring de l'engagement
    this.startEngagementMonitoring();

    // Adaptation en temps réel
    this.startRealtimeAdaptation();

    // Apprentissage continu
    this.startContinuousLearning();

    console.log('🔄 Système adaptatif d\'attention activé');
  }

  private startEngagementMonitoring(): void {
    const engagementMetrics = {
      mouseMovements: 0,
      scrollEvents: 0,
      clickEvents: 0,
      timeSpent: 0,
      focusTime: 0
    };

    let startTime = Date.now();
    let lastActivity = Date.now();

    // Monitoring des interactions
    ['mousemove', 'scroll', 'click', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        engagementMetrics[eventType === 'mousemove' ? 'mouseMovements' :
                         eventType === 'scroll' ? 'scrollEvents' :
                         eventType === 'click' ? 'clickEvents' : 'mouseMovements']++;
        lastActivity = Date.now();
      }, { passive: true });
    });

    // Calcul de l'engagement périodique
    setInterval(() => {
      const now = Date.now();
      const totalTime = now - startTime;
      const timeSinceActivity = now - lastActivity;
      
      const engagementLevel = this.calculateEngagementLevel(
        engagementMetrics, 
        totalTime, 
        timeSinceActivity
      );

      this.adaptToEngagement(engagementLevel);
    }, 2000);
  }

  private adaptToEngagement(level: number): void {
    // Adaptation de l'intensité des attracteurs
    this.attractors.forEach(attractor => {
      const newIntensity = this.calculateAdaptedIntensity(attractor.intensity, level);
      this.updateAttractorIntensity(attractor.id, newIntensity);
    });

    // Adaptation des chemins d'attention
    const optimalPath = level < 0.3 ? 'discovery' : 
                       level > 0.7 ? 'expert' : 'primary';
    
    if (![...this.attentionPaths.keys()].includes(optimalPath)) return;
    
    this.transitionToPath(optimalPath);
  }

  /**
   * 6. MÉTHODES PUBLIQUES PRINCIPALES
   */
  public createVisualMagnet(element: Element, options: Partial<VisualAttractor> = {}): string {
    const attractorId = `custom_${Date.now()}`;
    
    const attractor: VisualAttractor = {
      id: attractorId,
      element,
      priority: options.priority || 5,
      type: options.type || 'contextual',
      intensity: options.intensity || 0.7,
      timing: options.timing || this.generateAttentionTiming(element),
      effects: options.effects || this.selectVisualEffects(element),
      magneticField: options.magneticField || this.createMagneticField(element)
    };

    this.attractors.set(attractorId, attractor);
    this.applyVisualAttractor(attractor);

    return attractorId;
  }

  public createAttentionPath(elements: Element[], options: Partial<AttentionPath> = {}): string {
    const pathId = `path_${Date.now()}`;
    
    const waypoints = elements.map(element => ({
      element,
      dwellTime: options.waypoints?.[0]?.dwellTime || 1000,
      priority: 5,
      transitionStyle: 'organic' as const,
      anticipationTime: 200
    }));

    const path: AttentionPath = {
      id: pathId,
      waypoints,
      totalDuration: waypoints.reduce((sum, wp) => sum + wp.dwellTime, 0),
      pathStyle: options.pathStyle || this.generatePathStyle('custom'),
      triggers: options.triggers || [],
      adaptive: options.adaptive !== undefined ? options.adaptive : true
    };

    this.attentionPaths.set(pathId, path);
    return pathId;
  }

  public activatePath(pathId: string): boolean {
    const path = this.attentionPaths.get(pathId);
    if (!path) return false;

    this.activateAttentionPath(pathId);
    return true;
  }

  public updateAttractorIntensity(attractorId: string, newIntensity: number): void {
    const attractor = this.attractors.get(attractorId);
    if (!attractor) return;

    attractor.intensity = Math.max(0, Math.min(1, newIntensity));
    
    // Re-application avec nouvelle intensité
    this.applyVisualAttractor(attractor);
  }

  public getAttentionHeatmap(): any {
    return this.generateVirtualHeatmap();
  }

  public getGazeAnalytics(): any {
    return {
      currentFocus: this.gazeSimulation.currentFocus,
      gazePathLength: this.gazeSimulation.gazePath.length,
      averageDwellTime: this.calculateAverageDwellTime(),
      focusAreas: this.identifyFocusAreas(),
      attentionSpan: this.calculateAttentionSpan()
    };
  }

  public adaptToUserType(userType: 'novice' | 'intermediate' | 'expert'): void {
    const adaptations = {
      'novice': {
        attractorIntensity: 0.9,
        pathVisibility: 'visible',
        guidanceDuration: 'extended'
      },
      'intermediate': {
        attractorIntensity: 0.7,
        pathVisibility: 'subtle',
        guidanceDuration: 'normal'
      },
      'expert': {
        attractorIntensity: 0.4,
        pathVisibility: 'invisible',
        guidanceDuration: 'minimal'
      }
    };

    const config = adaptations[userType];
    this.applyUserTypeAdaptation(config);
  }

  /**
   * 7. MÉTHODES UTILITAIRES PRIVÉES
   */
  private identifyImportantElements(): Element[] {
    const selectors = [
      'h1, h2, h3', // Titres
      '[data-important]', // Éléments marqués
      'button, .btn', // Boutons
      '.cta, .call-to-action', // Call to action
      'nav a', // Navigation
      '.highlight, .featured', // Éléments mis en avant
      'input[type="submit"]', // Soumission de formulaires
      '.pricing, .price' // Prix
    ];

    const elements: Element[] = [];
    selectors.forEach(selector => {
      const found = this.container.querySelectorAll(selector);
      elements.push(...Array.from(found));
    });

    return [...new Set(elements)]; // Dédoublonnage
  }

  private calculateElementPriority(element: Element): number {
    let priority = 1;

    // Priorité basée sur le tag
    const tagPriorities: Record<string, number> = {
      'H1': 10, 'H2': 8, 'H3': 6,
      'BUTTON': 9, 'A': 7,
      'INPUT': 8, 'FORM': 6
    };

    priority += tagPriorities[element.tagName] || 1;

    // Priorité basée sur les classes/attributs
    if (element.classList.contains('cta')) priority += 5;
    if (element.classList.contains('primary')) priority += 4;
    if (element.hasAttribute('data-important')) priority += 3;

    // Priorité basée sur la position
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.5) priority += 2; // Above fold

    return Math.min(10, priority);
  }

  private generateAttentionTiming(element: Element): AttentionTiming {
    const priority = this.calculateElementPriority(element);
    const baseTiming = 1000;
    
    return {
      appearDelay: Math.max(100, (10 - priority) * 200),
      duration: baseTiming + (priority * 500),
      fadeInTime: 300,
      sustainTime: baseTiming,
      fadeOutTime: 500,
      pulseCycle: Math.max(800, 2000 - (priority * 100)),
      restPeriod: Math.max(200, 1000 - (priority * 50))
    };
  }

  private selectVisualEffects(element: Element): VisualEffect[] {
    const effects: VisualEffect[] = [];
    const priority = this.calculateElementPriority(element);

    // Effet principal basé sur le type d'élément
    if (element.tagName === 'BUTTON' || element.classList.contains('btn')) {
      effects.push({
        type: 'glow',
        strength: 0.6 + (priority * 0.04),
        frequency: 1,
        pattern: 'easeInOut',
        color: this.psychologyEngine.getOptimalGlowColor(),
        spread: 8
      });
    }

    // Effet de pulsation pour éléments importants
    if (priority > 7) {
      effects.push({
        type: 'pulse',
        strength: 0.4,
        frequency: 0.8,
        pattern: 'heartbeat'
      });
    }

    // Effet magnétique pour interactions
    if (element.tagName === 'BUTTON' || element.tagName === 'A') {
      effects.push({
        type: 'magnetic',
        strength: 0.3,
        frequency: 1,
        pattern: 'easeInOut',
        spread: 50
      });
    }

    return effects;
  }

  private createMagneticField(element: Element): MagneticField {
    const priority = this.calculateElementPriority(element);
    
    return {
      radius: 50 + (priority * 10),
      strength: 0.2 + (priority * 0.05),
      falloff: 'quadratic',
      influence: 'cursor',
      responsiveness: Math.min(1, 0.5 + (priority * 0.05))
    };
  }

  private calculateOptimalDwellTime(element: Element): number {
    const priority = this.calculateElementPriority(element);
    const baseTime = 800;
    const contentLength = element.textContent?.length || 0;
    
    // Temps basé sur le contenu et la priorité
    return baseTime + (priority * 100) + Math.min(contentLength * 10, 1000);
  }

  private calculateAnticipationTime(element: Element): number {
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    return isVisible ? 100 : 300; // Plus d'anticipation si pas visible
  }

  private generatePathStyle(pathType: string): PathStyle {
    const styles: Record<string, PathStyle> = {
      'primary': {
        visibility: 'subtle',
        color: '#4A90E2',
        width: 2,
        opacity: 0.3,
        animation: 'flow'
      },
      'discovery': {
        visibility: 'visible',
        color: '#F39C12',
        width: 3,
        opacity: 0.6,
        animation: 'pulse'
      },
      'expert': {
        visibility: 'invisible',
        color: '#2ECC71',
        width: 1,
        opacity: 0.1,
        animation: 'static'
      }
    };

    return styles[pathType] || styles.primary;
  }

  private calculateContextualIntensity(): number {
    const hour = new Date().getHours();
    const isEvening = hour > 18 || hour < 6;
    const baseIntensity = 0.7;
    
    // Plus intense le soir (moins de lumière ambiante)
    return isEvening ? baseIntensity * 1.3 : baseIntensity;
  }

  // Méthodes de simulation et calculs avancés (implémentations simplifiées)
  private detectReadingPattern(): any { return 'western'; }
  private analyzeScanBehavior(): any { return {}; }
  private buildAttentionModel(): any { return {}; }
  private analyzeOptimalReadingFlow(): any { return []; }
  private calculateImportanceHierarchy(): Element[] { return []; }
  private selectOptimalPath(): string { return 'primary'; }
  private analyzeSemanticeImportance(): any[] { return []; }
  private calculateOptimalSpeed(importance: number, index: number): number { return 1; }
  private determineOptimalDirection(context: any): any { return 'vertical'; }
  private calculateResponsiveness(importance: number): number { return 1; }
  private registerParallaxElements(layer: ParallaxLayer): void {}
  private updateLayerParallax(layer: ParallaxLayer, deltas: any): void {}
  private getElementAtPoint(point: any): Element | null { return null; }
  private handleGazeFocusChange(oldElement: Element | null, newElement: Element | null): void {}
  private calculateGazeConfidence(point: any): number { return 0.8; }
  private calculateDwellDuration(element: Element | null): number { return 500; }
  private generateVirtualHeatmap(): any { return {}; }
  private predictEasternGaze(step: number, viewport: any): any { return { x: 0, y: 0 }; }
  private predictRTLGaze(step: number, viewport: any): any { return { x: 0, y: 0 }; }
  private predictAdaptiveGaze(step: number, viewport: any): any { return { x: 0, y: 0 }; }
  private calculateEngagementLevel(metrics: any, totalTime: number, timeSinceActivity: number): number { return 0.5; }
  private calculateAdaptedIntensity(baseIntensity: number, engagementLevel: number): number { return baseIntensity; }
  private transitionToPath(pathId: string): void {}
  private calculateAverageDwellTime(): number { return 800; }
  private identifyFocusAreas(): any[] { return []; }
  private calculateAttentionSpan(): number { return 5000; }
  private applyUserTypeAdaptation(config: any): void {}
  private determineAttractorType(element: Element): any { return 'contextual'; }
  private calculateOptimalIntensity(element: Element): number { return 0.7; }
  private setupMagneticInteraction(element: Element, field: MagneticField): void {}
  private scheduleAttractorActivation(attractor: VisualAttractor): void {}
  private createShimmerEffect(element: Element, effect: VisualEffect, timing: AttentionTiming): void {}
  private createFloatEffect(element: Element, effect: VisualEffect, timing: AttentionTiming): void {}
  private createBreatheEffect(element: Element, effect: VisualEffect, timing: AttentionTiming): void {}
  private createPulseAnimation(element: Element, cycle: number, intensity: number): void {}
  private adaptPulseToEngagement(animation: Animation, effect: VisualEffect): void {}
  private selectTransitionStyle(element: Element, index: number): any { return 'organic'; }
  private generatePathTriggers(pathType: string): PathTrigger[] { return []; }
  private setupPathTrigger(trigger: PathTrigger, path: AttentionPath): void {}
  private animateAttentionPath(path: AttentionPath): void {}
  private preActivateWaypoint(waypoint: AttentionWaypoint): void {}
  private activateWaypoint(waypoint: AttentionWaypoint): void {}
  private startRealtimeAdaptation(): void {}
  private startContinuousLearning(): void {}
  private createDiscoveryPath(): AttentionPath { return {} as AttentionPath; }
  private createExpertPath(): AttentionPath { return {} as AttentionPath; }
  private createMobilePath(): AttentionPath { return {} as AttentionPath; }

  public destroy(): void {
    this.isActive = false;
    this.attractors.clear();
    this.attentionPaths.clear();
    this.parallaxLayers = [];
  }
}

/**
 * CLASSES AUXILIAIRES POUR FONCTIONNALITÉS AVANCÉES
 */

interface UserAttentionProfile {
  experienceLevel: 'novice' | 'intermediate' | 'expert';
  attentionSpan: number;
  preferredGuidance: 'high' | 'medium' | 'low';
  culturalContext: string;
  devicePreferences: any;
}

class AttentionContextAnalyzer {
  async analyzeUserProfile(): Promise<UserAttentionProfile> {
    return {
      experienceLevel: 'intermediate',
      attentionSpan: 5000,
      preferredGuidance: 'medium',
      culturalContext: 'western',
      devicePreferences: {}
    };
  }
}

class VisualPsychologyEngine {
  generateHeartbeatPattern(): number[] {
    // Génère un pattern basé sur le rythme cardiaque au repos (60-70 BPM)
    const bpm = 65;
    const samples = 20;
    const pattern = [];

    for (let i = 0; i < samples; i++) {
      const phase = (i / samples) * Math.PI * 2;
      const heartbeat = Math.sin(phase) * 0.3 + 0.7;
      pattern.push(heartbeat);
    }

    return pattern;
  }

  getOptimalGlowColor(): string {
    const hour = new Date().getHours();
    
    // Couleurs adaptées selon l'heure (circadian design)
    if (hour >= 6 && hour < 12) return '#4A90E2'; // Bleu matinal
    if (hour >= 12 && hour < 18) return '#F39C12'; // Orange après-midi
    if (hour >= 18 && hour < 22) return '#E67E22'; // Orange chaud soirée
    return '#8E44AD'; // Violet nuit
  }
}

class AdaptiveAttentionController {
  // Contrôleur pour adaptation temps réel
}

class AttentionPerformanceOptimizer {
  // Optimiseur de performance pour les effets d'attention
}

export default AttentionGuide;
/**
 * 🎯 ATTENTION GUIDE - Système de Guidage Visuel Subtil
 * 
 * Transforme n'importe quel effet en guide d'expérience utilisateur intelligent
 * avec aimants visuels, chemins dynamiques et parallaxe hiérarchique.
 * 
 * Fonctionnalités:
 * • Aimants visuels subtils (lueurs, pulsations, particules)
 * • Chemins visuels intelligents vers éléments importants
 * • Parallaxe intelligent pour hiérarchiser
 * • Psychologie cognitive avancée
 * • Adaptation comportementale temps réel
 */

export interface VisualMagnet {
  element: HTMLElement;
  intensity: number;
  type: 'glow' | 'pulse' | 'particles' | 'shimmer';
  duration: number;
  priority: number;
}

export interface VisualPath {
  from: HTMLElement;
  to: HTMLElement;
  style: 'direct' | 'curved' | 'gestural' | 'breadcrumb';
  intensity: number;
  timing: number;
}

export interface ParallaxLevel {
  elements: HTMLElement[];
  depth: number;
  movement: number;
  blur: number;
  priority: number;
}

export interface AttentionMetrics {
  gazeTime: number;
  interactionRate: number;
  skipRate: number;
  fatigueLevel: number;
  lastInteraction: number;
}

export interface CognitivePattern {
  gestalt: {
    proximity: number;
    similarity: number;
    closure: number;
    continuity: number;
  };
  contrast: {
    color: number;
    brightness: number;
    motion: number;
    size: number;
  };
  timing: {
    attention_span: number;
    peak_focus: number;
    fatigue_threshold: number;
  };
}

export class AttentionGuide {
  private container: HTMLElement;
  private config: any;
  private isActive: boolean = false;

  // 1. AIMANTS VISUELS SUBTILS
  private visualMagnets: Map<string, VisualMagnet> = new Map();
  private magnetStyles: CSSStyleSheet;
  private activeAnimations: Map<string, Animation> = new Map();

  // 2. CHEMINS VISUELS INTELLIGENTS
  private visualPaths: VisualPath[] = [];
  private pathCanvas: HTMLCanvasElement;
  private pathContext: CanvasRenderingContext2D;
  private pathAnimationFrame: number = 0;

  // 3. PARALLAXE INTELLIGENT
  private parallaxLevels: ParallaxLevel[] = [];
  private scrollHandler: (() => void) | null = null;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

  // 4. PSYCHOLOGIE COGNITIVE
  private cognitivePatterns: CognitivePattern;
  private gestaltAnalyzer: GestaltAnalyzer;
  private contrastCalculator: ContrastCalculator;
  private timingOptimizer: TimingOptimizer;

  // 5. ADAPTATION COMPORTEMENTALE
  private attentionMetrics: Map<string, AttentionMetrics> = new Map();
  private behaviorLearner: BehaviorLearner;
  private fatigueDetector: FatigueDetector;
  private personalizer: AttentionPersonalizer;

  // Performance et optimisation
  private performanceMonitor: PerformanceMonitor;
  private adaptiveQuality: AdaptiveQuality;

  constructor(container: HTMLElement, config: any = {}) {
    this.container = container;
    this.config = this.mergeConfig(config);

    this.initializeComponents();
    this.setupStyles();
    this.bindEvents();

    console.log('🎯 AttentionGuide initialisé avec guidage intelligent');
  }

  private mergeConfig(userConfig: any): any {
    return {
      // Configuration des aimants visuels
      magnets: {
        enabled: true,
        defaultIntensity: 0.6,
        maxSimultaneous: 3,
        adaptiveIntensity: true,
        types: {
          glow: { enabled: true, maxRadius: 20, opacity: 0.4 },
          pulse: { enabled: true, scale: 1.05, duration: 1000 },
          particles: { enabled: true, count: 8, speed: 0.5 },
          shimmer: { enabled: true, angle: 45, duration: 2000 }
        }
      },

      // Configuration des chemins visuels
      paths: {
        enabled: true,
        maxPaths: 2,
        defaultWidth: 2,
        opacity: 0.3,
        animationSpeed: 1000,
        styles: {
          direct: { strokeDasharray: '5,5' },
          curved: { curvature: 0.3 },
          gestural: { handIcon: true },
          breadcrumb: { dotSize: 4, spacing: 20 }
        }
      },

      // Configuration du parallaxe
      parallax: {
        enabled: true,
        maxLevels: 5,
        intensityMultiplier: 0.1,
        blurIntensity: 0.5,
        responsiveToMouse: true,
        responsiveToScroll: true
      },

      // Configuration cognitive
      cognitive: {
        gestaltAnalysis: true,
        contrastOptimization: true,
        timingOptimization: true,
        culturalAdaptation: false
      },

      // Configuration comportementale
      behavioral: {
        learningEnabled: true,
        fatigueDetection: true,
        personalization: true,
        analytics: true,
        storageKey: 'attention_guide_data'
      },

      // Configuration performance
      performance: {
        maxFPS: 60,
        adaptiveQuality: true,
        lowPowerMode: false,
        memoryOptimization: true
      },

      ...userConfig
    };
  }

  private initializeComponents(): void {
    // 1. AIMANTS VISUELS
    this.magnetStyles = new CSSStyleSheet();
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, this.magnetStyles];

    // 2. CHEMINS VISUELS
    this.createPathCanvas();

    // 3. PARALLAXE
    this.setupParallaxLevels();

    // 4. PSYCHOLOGIE COGNITIVE
    this.cognitivePatterns = this.initializeCognitivePatterns();
    this.gestaltAnalyzer = new GestaltAnalyzer(this.container);
    this.contrastCalculator = new ContrastCalculator();
    this.timingOptimizer = new TimingOptimizer(this.cognitivePatterns.timing);

    // 5. ADAPTATION COMPORTEMENTALE
    this.behaviorLearner = new BehaviorLearner(this.config.behavioral.storageKey);
    this.fatigueDetector = new FatigueDetector();
    this.personalizer = new AttentionPersonalizer();

    // Performance
    this.performanceMonitor = new PerformanceMonitor();
    this.adaptiveQuality = new AdaptiveQuality(this.config.performance);
  }

  /**
   * 1. AIMANTS VISUELS SUBTILS
   */
  createVisualMagnet(element: HTMLElement, options: Partial<VisualMagnet> = {}): string {
    const magnetId = `magnet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const magnet: VisualMagnet = {
      element,
      intensity: options.intensity || this.config.magnets.defaultIntensity,
      type: options.type || this.selectOptimalMagnetType(element),
      duration: options.duration || this.timingOptimizer.getOptimalDuration(element),
      priority: options.priority || this.calculateElementPriority(element)
    };

    // Adaptation comportementale
    const metrics = this.attentionMetrics.get(this.getElementId(element));
    if (metrics && metrics.skipRate > 0.7) {
      magnet.intensity = Math.min(1, magnet.intensity * 1.5); // Intensification si ignoré
    }

    this.visualMagnets.set(magnetId, magnet);
    this.applyVisualMagnet(magnetId, magnet);

    return magnetId;
  }

  private selectOptimalMagnetType(element: HTMLElement): VisualMagnet['type'] {
    const gestaltData = this.gestaltAnalyzer.analyzeElement(element);
    const elementType = element.tagName.toLowerCase();
    const interactionType = this.detectInteractionType(element);

    // Sélection intelligente selon le contexte
    if (interactionType === 'button' || interactionType === 'link') {
      return gestaltData.motion > 0.5 ? 'pulse' : 'glow';
    } else if (elementType === 'input' || elementType === 'textarea') {
      return 'shimmer';
    } else if (gestaltData.complexity > 0.7) {
      return 'particles';
    }

    return 'glow'; // Par défaut
  }

  private applyVisualMagnet(magnetId: string, magnet: VisualMagnet): void {
    const { element, type, intensity, duration, priority } = magnet;
    
    // Gestion de la priorité (max 3 aimants simultanés)
    this.manageMagnetPriority(priority);

    switch (type) {
      case 'glow':
        this.applyGlowMagnet(element, intensity, duration);
        break;
      case 'pulse':
        this.applyPulseMagnet(element, intensity, duration);
        break;
      case 'particles':
        this.applyParticlesMagnet(element, intensity, duration);
        break;
      case 'shimmer':
        this.applyShimmerMagnet(element, intensity, duration);
        break;
    }

    // Suivi des métriques
    this.trackMagnetInteraction(magnetId, element);
  }

  private applyGlowMagnet(element: HTMLElement, intensity: number, duration: number): void {
    const glowConfig = this.config.magnets.types.glow;
    const radius = glowConfig.maxRadius * intensity;
    const opacity = glowConfig.opacity * intensity;

    const glowStyle = `
      filter: drop-shadow(0 0 ${radius}px rgba(64, 150, 255, ${opacity}));
      transition: filter ${duration}ms cubic-bezier(0.4, 0, 0.2, 1);
    `;

    element.style.cssText += glowStyle;

    // Animation de pulsation subtile
    const animation = element.animate([
      { filter: `drop-shadow(0 0 ${radius * 0.8}px rgba(64, 150, 255, ${opacity * 0.8}))` },
      { filter: `drop-shadow(0 0 ${radius * 1.2}px rgba(64, 150, 255, ${opacity * 1.2}))` },
      { filter: `drop-shadow(0 0 ${radius}px rgba(64, 150, 255, ${opacity}))` }
    ], {
      duration: duration * 2,
      iterations: Infinity,
      easing: 'ease-in-out'
    });

    this.activeAnimations.set(this.getElementId(element), animation);
  }

  private applyPulseMagnet(element: HTMLElement, intensity: number, duration: number): void {
    const pulseConfig = this.config.magnets.types.pulse;
    const scale = 1 + (pulseConfig.scale - 1) * intensity;

    const animation = element.animate([
      { transform: 'scale(1)', opacity: '1' },
      { transform: `scale(${scale})`, opacity: `${0.8 + intensity * 0.2}` },
      { transform: 'scale(1)', opacity: '1' }
    ], {
      duration: duration,
      iterations: Infinity,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });

    this.activeAnimations.set(this.getElementId(element), animation);
  }

  private applyParticlesMagnet(element: HTMLElement, intensity: number, duration: number): void {
    const particlesConfig = this.config.magnets.types.particles;
    const particleCount = Math.floor(particlesConfig.count * intensity);

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < particleCount; i++) {
      this.createMagnetParticle(centerX, centerY, intensity, duration);
    }
  }

  private applyShimmerMagnet(element: HTMLElement, intensity: number, duration: number): void {
    const shimmerConfig = this.config.magnets.types.shimmer;
    const opacity = 0.3 * intensity;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';

    const shimmer = document.createElement('div');
    shimmer.style.cssText = `
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        ${shimmerConfig.angle}deg,
        transparent,
        rgba(255, 255, 255, ${opacity}),
        transparent
      );
      animation: shimmer ${duration}ms ease-in-out infinite;
      pointer-events: none;
    `;

    // Injection du CSS d'animation
    this.magnetStyles.insertRule(`
      @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }
    `, this.magnetStyles.cssRules.length);

    element.appendChild(shimmer);
  }

  /**
   * 2. CHEMINS VISUELS INTELLIGENTS
   */
  createVisualPath(from: HTMLElement, to: HTMLElement, options: Partial<VisualPath> = {}): void {
    const path: VisualPath = {
      from,
      to,
      style: options.style || this.selectOptimalPathStyle(from, to),
      intensity: options.intensity || this.calculatePathIntensity(from, to),
      timing: options.timing || this.timingOptimizer.getOptimalPathTiming(from, to)
    };

    this.visualPaths.push(path);
    this.renderVisualPaths();
  }

  private selectOptimalPathStyle(from: HTMLElement, to: HTMLElement): VisualPath['style'] {
    const distance = this.calculateElementDistance(from, to);
    const gestaltRelation = this.gestaltAnalyzer.analyzeRelation(from, to);

    if (distance < 200 && gestaltRelation.proximity > 0.7) {
      return 'direct';
    } else if (gestaltRelation.continuity > 0.6) {
      return 'curved';
    } else if (this.detectInteractionType(to) === 'button') {
      return 'gestural';
    }

    return 'breadcrumb';
  }

  private renderVisualPaths(): void {
    if (!this.pathContext) return;

    this.pathContext.clearRect(0, 0, this.pathCanvas.width, this.pathCanvas.height);

    this.visualPaths.forEach(path => {
      this.drawPath(path);
    });
  }

  private drawPath(path: VisualPath): void {
    const fromRect = path.from.getBoundingClientRect();
    const toRect = path.to.getBoundingClientRect();

    const startX = fromRect.left + fromRect.width / 2;
    const startY = fromRect.top + fromRect.height / 2;
    const endX = toRect.left + toRect.width / 2;
    const endY = toRect.top + toRect.height / 2;

    this.pathContext.strokeStyle = `rgba(64, 150, 255, ${this.config.paths.opacity * path.intensity})`;
    this.pathContext.lineWidth = this.config.paths.defaultWidth;

    switch (path.style) {
      case 'direct':
        this.drawDirectPath(startX, startY, endX, endY, path);
        break;
      case 'curved':
        this.drawCurvedPath(startX, startY, endX, endY, path);
        break;
      case 'gestural':
        this.drawGesturalPath(startX, startY, endX, endY, path);
        break;
      case 'breadcrumb':
        this.drawBreadcrumbPath(startX, startY, endX, endY, path);
        break;
    }
  }

  private drawDirectPath(startX: number, startY: number, endX: number, endY: number, path: VisualPath): void {
    this.pathContext.setLineDash([5, 5]);
    this.pathContext.beginPath();
    this.pathContext.moveTo(startX, startY);
    this.pathContext.lineTo(endX, endY);
    this.pathContext.stroke();
  }

  private drawCurvedPath(startX: number, startY: number, endX: number, endY: number, path: VisualPath): void {
    const curvature = this.config.paths.styles.curved.curvature;
    const controlX = (startX + endX) / 2 + (endY - startY) * curvature;
    const controlY = (startY + endY) / 2 + (startX - endX) * curvature;

    this.pathContext.setLineDash([]);
    this.pathContext.beginPath();
    this.pathContext.moveTo(startX, startY);
    this.pathContext.quadraticCurveTo(controlX, controlY, endX, endY);
    this.pathContext.stroke();
  }

  /**
   * 3. PARALLAXE INTELLIGENT
   */
  private setupParallaxLevels(): void {
    if (!this.config.parallax.enabled) return;

    const elements = this.container.querySelectorAll('*') as NodeListOf<HTMLElement>;
    const prioritizedElements = Array.from(elements)
      .map(el => ({
        element: el,
        priority: this.calculateElementPriority(el)
      }))
      .sort((a, b) => b.priority - a.priority);

    // Création des niveaux de parallaxe
    const levelCount = Math.min(this.config.parallax.maxLevels, 5);
    for (let i = 0; i < levelCount; i++) {
      const depth = i / (levelCount - 1); // 0 à 1
      const movement = (1 - depth) * this.config.parallax.intensityMultiplier;
      const blur = depth * this.config.parallax.blurIntensity;

      this.parallaxLevels.push({
        elements: [],
        depth,
        movement,
        blur,
        priority: 1 - depth
      });
    }

    // Attribution des éléments aux niveaux
    prioritizedElements.forEach((item, index) => {
      const levelIndex = Math.floor((index / prioritizedElements.length) * levelCount);
      this.parallaxLevels[levelIndex].elements.push(item.element);
    });

    this.applyParallaxEffects();
  }

  private applyParallaxEffects(): void {
    this.parallaxLevels.forEach(level => {
      level.elements.forEach(element => {
        if (level.blur > 0) {
          element.style.filter = `blur(${level.blur}px)`;
        }
        element.style.willChange = 'transform';
      });
    });

    this.bindParallaxEvents();
  }

  private bindParallaxEvents(): void {
    if (this.config.parallax.responsiveToMouse) {
      this.mouseMoveHandler = this.throttle((e: MouseEvent) => {
        this.updateParallaxFromMouse(e);
      }, 16); // 60fps
      document.addEventListener('mousemove', this.mouseMoveHandler);
    }

    if (this.config.parallax.responsiveToScroll) {
      this.scrollHandler = this.throttle(() => {
        this.updateParallaxFromScroll();
      }, 16);
      window.addEventListener('scroll', this.scrollHandler);
    }
  }

  private updateParallaxFromMouse(e: MouseEvent): void {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;

    this.parallaxLevels.forEach(level => {
      const moveX = deltaX * level.movement * 20;
      const moveY = deltaY * level.movement * 20;

      level.elements.forEach(element => {
        element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    });
  }

  /**
   * 4. PSYCHOLOGIE COGNITIVE AVANCÉE
   */
  private initializeCognitivePatterns(): CognitivePattern {
    return {
      gestalt: {
        proximity: 0.8,    // Éléments proches sont liés
        similarity: 0.7,   // Éléments similaires sont groupés
        closure: 0.6,      // Formes incomplètes sont complétées mentalement
        continuity: 0.8    // Lignes continues sont suivies naturellement
      },
      contrast: {
        color: 0.7,        // Contraste de couleur nécessaire
        brightness: 0.8,   // Contraste de luminosité
        motion: 0.6,       // Contraste de mouvement
        size: 0.5          // Contraste de taille
      },
      timing: {
        attention_span: 3000,     // Durée d'attention moyenne (ms)
        peak_focus: 1500,         // Pic d'attention (ms)
        fatigue_threshold: 10000  // Seuil de fatigue (ms)
      }
    };
  }

  /**
   * 5. ADAPTATION COMPORTEMENTALE
   */
  private trackMagnetInteraction(magnetId: string, element: HTMLElement): void {
    const elementId = this.getElementId(element);
    const startTime = Date.now();

    const interactionHandler = () => {
      const interactionTime = Date.now() - startTime;
      this.updateAttentionMetrics(elementId, interactionTime, true);
      element.removeEventListener('click', interactionHandler);
    };

    const timeoutHandler = setTimeout(() => {
      this.updateAttentionMetrics(elementId, this.cognitivePatterns.timing.attention_span, false);
      element.removeEventListener('click', interactionHandler);
    }, this.cognitivePatterns.timing.attention_span);

    element.addEventListener('click', interactionHandler);
  }

  private updateAttentionMetrics(elementId: string, gazeTime: number, interacted: boolean): void {
    const current = this.attentionMetrics.get(elementId) || {
      gazeTime: 0,
      interactionRate: 0,
      skipRate: 0,
      fatigueLevel: 0,
      lastInteraction: 0
    };

    const updated: AttentionMetrics = {
      gazeTime: (current.gazeTime + gazeTime) / 2,
      interactionRate: interacted ? Math.min(1, current.interactionRate + 0.1) : current.interactionRate,
      skipRate: !interacted ? Math.min(1, current.skipRate + 0.1) : Math.max(0, current.skipRate - 0.05),
      fatigueLevel: this.fatigueDetector.calculateFatigue(gazeTime, Date.now() - current.lastInteraction),
      lastInteraction: Date.now()
    };

    this.attentionMetrics.set(elementId, updated);
    this.behaviorLearner.updateBehaviorData(elementId, updated);
  }

  /**
   * MÉTHODES UTILITAIRES
   */
  private createPathCanvas(): void {
    this.pathCanvas = document.createElement('canvas');
    this.pathCanvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
    `;
    this.pathCanvas.width = window.innerWidth;
    this.pathCanvas.height = window.innerHeight;
    
    this.pathContext = this.pathCanvas.getContext('2d')!;
    document.body.appendChild(this.pathCanvas);

    // Redimensionnement automatique
    window.addEventListener('resize', () => {
      this.pathCanvas.width = window.innerWidth;
      this.pathCanvas.height = window.innerHeight;
    });
  }

  private calculateElementPriority(element: HTMLElement): number {
    let priority = 0;

    // Type d'élément
    const tagName = element.tagName.toLowerCase();
    if (['button', 'a', 'input'].includes(tagName)) priority += 0.4;
    if (['h1', 'h2', 'h3'].includes(tagName)) priority += 0.3;
    if (['img', 'video'].includes(tagName)) priority += 0.2;

    // Classes et IDs importants
    const className = element.className.toLowerCase();
    if (className.includes('primary') || className.includes('main')) priority += 0.2;
    if (className.includes('cta') || className.includes('action')) priority += 0.3;

    // Position dans la page
    const rect = element.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const distanceFromCenter = Math.abs(rect.top + rect.height / 2 - viewportCenter);
    priority += (1 - distanceFromCenter / viewportCenter) * 0.2;

    // Taille de l'élément
    const size = rect.width * rect.height;
    const maxSize = window.innerWidth * window.innerHeight;
    priority += Math.min(size / maxSize, 0.1);

    return Math.min(priority, 1);
  }

  private getElementId(element: HTMLElement): string {
    return element.id || element.tagName + '_' + Array.from(element.parentNode?.children || []).indexOf(element);
  }

  private detectInteractionType(element: HTMLElement): string {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const className = element.className.toLowerCase();

    if (tagName === 'button' || role === 'button') return 'button';
    if (tagName === 'a') return 'link';
    if (['input', 'textarea', 'select'].includes(tagName)) return 'input';
    if (className.includes('clickable') || element.onclick) return 'clickable';

    return 'static';
  }

  private calculateElementDistance(from: HTMLElement, to: HTMLElement): number {
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();

    const fromCenterX = fromRect.left + fromRect.width / 2;
    const fromCenterY = fromRect.top + fromRect.height / 2;
    const toCenterX = toRect.left + toRect.width / 2;
    const toCenterY = toRect.top + toRect.height / 2;

    return Math.sqrt(
      Math.pow(toCenterX - fromCenterX, 2) + Math.pow(toCenterY - fromCenterY, 2)
    );
  }

  private throttle(func: Function, delay: number): (...args: any[]) => void {
    let timeoutId: number;
    let lastExecTime = 0;
    return (...args: any[]) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  private setupStyles(): void {
    const styles = `
      .attention-guide-container {
        position: relative;
        isolation: isolate;
      }
      
      .attention-guide-particle {
        position: fixed;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(64,150,255,0.8) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9998;
      }
      
      .attention-guide-focus {
        outline: 2px solid rgba(64, 150, 255, 0.5);
        outline-offset: 2px;
        transition: outline 300ms ease;
      }
    `;

    this.magnetStyles.insertRule(styles, 0);
  }

  private bindEvents(): void {
    // Suivi des interactions utilisateur
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const elementId = this.getElementId(target);
      this.updateAttentionMetrics(elementId, 0, true);
    });

    // Détection de fatigue par inactivité
    let inactivityTimer: number;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        this.fatigueDetector.incrementFatigue();
        this.adaptToFatigue();
      }, this.cognitivePatterns.timing.fatigue_threshold);
    };

    ['mousemove', 'click', 'scroll', 'keypress'].forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });
  }

  private manageMagnetPriority(newPriority: number): void {
    const activeMagnets = Array.from(this.visualMagnets.values())
      .sort((a, b) => b.priority - a.priority);

    if (activeMagnets.length >= this.config.magnets.maxSimultaneous) {
      // Supprime les aimants de plus faible priorité
      const toRemove = activeMagnets.slice(this.config.magnets.maxSimultaneous - 1);
      toRemove.forEach(magnet => {
        this.removeVisualMagnet(magnet);
      });
    }
  }

  private removeVisualMagnet(magnet: VisualMagnet): void {
    const elementId = this.getElementId(magnet.element);
    const animation = this.activeAnimations.get(elementId);
    
    if (animation) {
      animation.cancel();
      this.activeAnimations.delete(elementId);
    }

    // Reset des styles
    magnet.element.style.filter = '';
    magnet.element.style.transform = '';

    // Suppression des particules
    const particles = document.querySelectorAll('.attention-guide-particle');
    particles.forEach(particle => particle.remove());
  }

  private createMagnetParticle(centerX: number, centerY: number, intensity: number, duration: number): void {
    const particle = document.createElement('div');
    particle.className = 'attention-guide-particle';
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 50;
    const endX = centerX + Math.cos(angle) * distance;
    const endY = centerY + Math.sin(angle) * distance;

    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    particle.style.opacity = (0.8 * intensity).toString();

    document.body.appendChild(particle);

    const animation = particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: (0.8 * intensity).toString() },
      { transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0.3)`, opacity: '0' }
    ], {
      duration: duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });

    animation.onfinish = () => particle.remove();
  }

  private adaptToFatigue(): void {
    const fatigueLevel = this.fatigueDetector.getCurrentFatigue();
    
    if (fatigueLevel > 0.7) {
      // Réduction de l'intensité des effets
      this.config.magnets.defaultIntensity *= 0.8;
      this.config.paths.opacity *= 0.8;
      
      // Simplification des animations
      this.activeAnimations.forEach(animation => {
        animation.playbackRate = 0.5; // Ralentissement
      });
      
      console.log('🎯 AttentionGuide: Adaptation à la fatigue détectée');
    }
  }

  /**
   * API PUBLIQUE
   */
  public activate(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.startAttentionGuidance();
    console.log('🎯 AttentionGuide activé');
  }

  public deactivate(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    this.stopAttentionGuidance();
    console.log('🎯 AttentionGuide désactivé');
  }

  private startAttentionGuidance(): void {
    // Analyse initiale des éléments prioritaires
    const priorityElements = this.findPriorityElements();
    
    // Création des aimants visuels pour les éléments importants
    priorityElements.forEach(element => {
      this.createVisualMagnet(element);
    });

    // Création des chemins visuels logiques
    this.createLogicalPaths(priorityElements);
  }

  private stopAttentionGuidance(): void {
    // Suppression de tous les aimants visuels
    this.visualMagnets.forEach(magnet => {
      this.removeVisualMagnet(magnet);
    });
    this.visualMagnets.clear();

    // Nettoyage des chemins visuels
    this.visualPaths = [];
    if (this.pathContext) {
      this.pathContext.clearRect(0, 0, this.pathCanvas.width, this.pathCanvas.height);
    }

    // Suppression des event listeners
    if (this.mouseMoveHandler) {
      document.removeEventListener('mousemove', this.mouseMoveHandler);
    }
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  private findPriorityElements(): HTMLElement[] {
    const elements = Array.from(this.container.querySelectorAll('*')) as HTMLElement[];
    
    return elements
      .map(el => ({
        element: el,
        priority: this.calculateElementPriority(el)
      }))
      .filter(item => item.priority > 0.3)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5) // Top 5 éléments
      .map(item => item.element);
  }

  private createLogicalPaths(elements: HTMLElement[]): void {
    // Création de chemins entre éléments logiquement connectés
    for (let i = 0; i < elements.length - 1; i++) {
      const from = elements[i];
      const to = elements[i + 1];
      
      if (this.gestaltAnalyzer.analyzeRelation(from, to).continuity > 0.5) {
        this.createVisualPath(from, to);
      }
    }
  }

  public getMetrics(): any {
    return {
      activeMagnets: this.visualMagnets.size,
      activePaths: this.visualPaths.length,
      parallaxLevels: this.parallaxLevels.length,
      attentionData: Object.fromEntries(this.attentionMetrics),
      fatigueLevel: this.fatigueDetector.getCurrentFatigue(),
      performance: this.performanceMonitor.getMetrics()
    };
  }

  public destroy(): void {
    this.deactivate();
    
    // Nettoyage complet
    if (this.pathCanvas.parentNode) {
      this.pathCanvas.parentNode.removeChild(this.pathCanvas);
    }
    
    // Suppression des styles
    const index = document.adoptedStyleSheets.indexOf(this.magnetStyles);
    if (index !== -1) {
      document.adoptedStyleSheets.splice(index, 1);
    }
    
    console.log('🎯 AttentionGuide détruit');
  }
}

/**
 * CLASSES AUXILIAIRES
 */

class GestaltAnalyzer {
  constructor(private container: HTMLElement) {}

  analyzeElement(element: HTMLElement): any {
    return {
      proximity: this.calculateProximity(element),
      similarity: this.calculateSimilarity(element),
      closure: this.calculateClosure(element),
      continuity: this.calculateContinuity(element),
      motion: this.calculateMotion(element),
      complexity: this.calculateComplexity(element)
    };
  }

  analyzeRelation(from: HTMLElement, to: HTMLElement): any {
    return {
      proximity: this.calculateRelationProximity(from, to),
      similarity: this.calculateRelationSimilarity(from, to),
      continuity: this.calculateRelationContinuity(from, to)
    };
  }

  private calculateProximity(element: HTMLElement): number {
    const siblings = Array.from(element.parentNode?.children || []);
    const index = siblings.indexOf(element);
    const proximityElements = siblings.slice(Math.max(0, index - 2), index + 3);
    return proximityElements.length / 5; // Normalisation
  }

  private calculateSimilarity(element: HTMLElement): number {
    const siblings = Array.from(element.parentNode?.children || []) as HTMLElement[];
    const similarElements = siblings.filter(sibling => 
      sibling.tagName === element.tagName &&
      this.haveSimilarStyles(element, sibling)
    );
    return Math.min(similarElements.length / siblings.length, 1);
  }

  private calculateClosure(element: HTMLElement): number {
    // Analyse de la "fermeture" visuelle (formes complètes vs incomplètes)
    const styles = window.getComputedStyle(element);
    const hasBorder = styles.border !== 'none' && styles.border !== '';
    const hasBackground = styles.backgroundColor !== 'rgba(0, 0, 0, 0)';
    const hasOutline = styles.outline !== 'none';
    
    return (hasBorder ? 0.4 : 0) + (hasBackground ? 0.4 : 0) + (hasOutline ? 0.2 : 0);
  }

  private calculateContinuity(element: HTMLElement): number {
    // Analyse de la continuité visuelle avec les éléments environnants
    const rect = element.getBoundingClientRect();
    const siblings = Array.from(element.parentNode?.children || []) as HTMLElement[];
    
    let alignmentScore = 0;
    siblings.forEach(sibling => {
      if (sibling === element) return;
      const siblingRect = sibling.getBoundingClientRect();
      
      // Alignement horizontal
      if (Math.abs(rect.top - siblingRect.top) < 10) alignmentScore += 0.3;
      // Alignement vertical
      if (Math.abs(rect.left - siblingRect.left) < 10) alignmentScore += 0.3;
    });
    
    return Math.min(alignmentScore, 1);
  }

  private calculateMotion(element: HTMLElement): number {
    const styles = window.getComputedStyle(element);
    const hasTransition = styles.transition !== 'none' && styles.transition !== '';
    const hasAnimation = styles.animation !== 'none' && styles.animation !== '';
    const hasTransform = styles.transform !== 'none';
    
    return (hasTransition ? 0.3 : 0) + (hasAnimation ? 0.4 : 0) + (hasTransform ? 0.3 : 0);
  }

  private calculateComplexity(element: HTMLElement): number {
    const childCount = element.children.length;
    const depth = this.getElementDepth(element);
    const hasComplexStyles = this.hasComplexStyles(element);
    
    return Math.min((childCount / 10) + (depth / 10) + (hasComplexStyles ? 0.3 : 0), 1);
  }

  private calculateRelationProximity(from: HTMLElement, to: HTMLElement): number {
    const distance = this.calculateDistance(from, to);
    const maxDistance = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    return 1 - (distance / maxDistance);
  }

  private calculateRelationSimilarity(from: HTMLElement, to: HTMLElement): number {
    const tagSimilarity = from.tagName === to.tagName ? 0.4 : 0;
    const styleSimilarity = this.haveSimilarStyles(from, to) ? 0.4 : 0;
    const sizeSimilarity = this.haveSimilarSizes(from, to) ? 0.2 : 0;
    
    return tagSimilarity + styleSimilarity + sizeSimilarity;
  }

  private calculateRelationContinuity(from: HTMLElement, to: HTMLElement): number {
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    
    // Vérification de l'alignement
    const horizontalAlignment = Math.abs(fromRect.top - toRect.top) < 20 ? 0.5 : 0;
    const verticalAlignment = Math.abs(fromRect.left - toRect.left) < 20 ? 0.5 : 0;
    
    return Math.max(horizontalAlignment, verticalAlignment);
  }

  private haveSimilarStyles(el1: HTMLElement, el2: HTMLElement): boolean {
    const styles1 = window.getComputedStyle(el1);
    const styles2 = window.getComputedStyle(el2);
    
    return (
      styles1.color === styles2.color &&
      styles1.backgroundColor === styles2.backgroundColor &&
      styles1.fontSize === styles2.fontSize
    );
  }

  private haveSimilarSizes(el1: HTMLElement, el2: HTMLElement): boolean {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    
    const sizeDifference = Math.abs((rect1.width * rect1.height) - (rect2.width * rect2.height));
    const averageSize = ((rect1.width * rect1.height) + (rect2.width * rect2.height)) / 2;
    
    return sizeDifference / averageSize < 0.3;
  }

  private getElementDepth(element: HTMLElement): number {
    let depth = 0;
    let current = element.parentElement;
    while (current && current !== this.container) {
      depth++;
      current = current.parentElement;
    }
    return depth;
  }

  private hasComplexStyles(element: HTMLElement): boolean {
    const styles = window.getComputedStyle(element);
    return (
      styles.boxShadow !== 'none' ||
      styles.borderRadius !== '0px' ||
      styles.background.includes('gradient') ||
      styles.filter !== 'none'
    );
  }

  private calculateDistance(from: HTMLElement, to: HTMLElement): number {
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    
    const fromCenterX = fromRect.left + fromRect.width / 2;
    const fromCenterY = fromRect.top + fromRect.height / 2;
    const toCenterX = toRect.left + toRect.width / 2;
    const toCenterY = toRect.top + toRect.height / 2;
    
    return Math.sqrt((toCenterX - fromCenterX) ** 2 + (toCenterY - fromCenterY) ** 2);
  }
}

class ContrastCalculator {
  calculateColorContrast(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;
    
    const luminance1 = this.calculateLuminance(rgb1);
    const luminance2 = this.calculateLuminance(rgb2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private calculateLuminance(rgb: { r: number; g: number; b: number }): number {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
}

class TimingOptimizer {
  constructor(private timingConfig: CognitivePattern['timing']) {}

  getOptimalDuration(element: HTMLElement): number {
    const priority = this.calculateElementPriority(element);
    const baseTime = this.timingConfig.peak_focus;
    
    // Durée adaptée selon la priorité
    return baseTime * (0.5 + priority * 1.5);
  }

  getOptimalPathTiming(from: HTMLElement, to: HTMLElement): number {
    const distance = this.calculateDistance(from, to);
    const maxDistance = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    const normalizedDistance = distance / maxDistance;
    
    // Timing basé sur la distance (plus c'est loin, plus c'est lent)
    return 500 + (normalizedDistance * 1500);
  }

  private calculateElementPriority(element: HTMLElement): number {
    // Réimplémentation simplifiée pour éviter les dépendances circulaires
    const tagName = element.tagName.toLowerCase();
    let priority = 0.5;
    
    if (['button', 'a'].includes(tagName)) priority += 0.3;
    if (['h1', 'h2'].includes(tagName)) priority += 0.2;
    
    return Math.min(priority, 1);
  }

  private calculateDistance(from: HTMLElement, to: HTMLElement): number {
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    
    const dx = (toRect.left + toRect.width / 2) - (fromRect.left + fromRect.width / 2);
    const dy = (toRect.top + toRect.height / 2) - (fromRect.top + fromRect.height / 2);
    
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class BehaviorLearner {
  private storageKey: string;
  private behaviorData: Map<string, any> = new Map();

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.loadBehaviorData();
  }

  updateBehaviorData(elementId: string, metrics: AttentionMetrics): void {
    this.behaviorData.set(elementId, {
      ...metrics,
      lastUpdate: Date.now()
    });
    this.saveBehaviorData();
  }

  getBehaviorData(elementId: string): any {
    return this.behaviorData.get(elementId);
  }

  private loadBehaviorData(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.behaviorData = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des données comportementales:', error);
    }
  }

  private saveBehaviorData(): void {
    try {
      const dataObj = Object.fromEntries(this.behaviorData);
      localStorage.setItem(this.storageKey, JSON.stringify(dataObj));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des données comportementales:', error);
    }
  }
}

class FatigueDetector {
  private fatigueLevel: number = 0;
  private lastActivity: number = Date.now();

  calculateFatigue(gazeTime: number, timeSinceLastInteraction: number): number {
    // Calcul de fatigue basé sur le temps de regard et l'inactivité
    const gazeFatigue = gazeTime > 5000 ? 0.1 : 0;
    const inactivityFatigue = timeSinceLastInteraction > 30000 ? 0.2 : 0;
    
    return Math.min(gazeFatigue + inactivityFatigue, 1);
  }

  incrementFatigue(): void {
    this.fatigueLevel = Math.min(this.fatigueLevel + 0.1, 1);
  }

  getCurrentFatigue(): number {
    return this.fatigueLevel;
  }

  resetFatigue(): void {
    this.fatigueLevel = 0;
    this.lastActivity = Date.now();
  }
}

class AttentionPersonalizer {
  personalizeGuidance(elementId: string, defaultIntensity: number, metrics: AttentionMetrics): number {
    // Personnalisation basée sur les métriques d'attention
    let adjustedIntensity = defaultIntensity;

    // Augmentation si l'élément est souvent ignoré
    if (metrics.skipRate > 0.7) {
      adjustedIntensity *= 1.5;
    }

    // Diminution si l'élément a un bon taux d'interaction
    if (metrics.interactionRate > 0.8) {
      adjustedIntensity *= 0.8;
    }

    // Adaptation à la fatigue
    if (metrics.fatigueLevel > 0.5) {
      adjustedIntensity *= 0.7;
    }

    return Math.min(Math.max(adjustedIntensity, 0.1), 1);
  }
}

class PerformanceMonitor {
  private metrics = {
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    lastUpdate: Date.now()
  };

  getMetrics(): any {
    return { ...this.metrics };
  }

  updateFPS(fps: number): void {
    this.metrics.fps = fps;
    this.metrics.lastUpdate = Date.now();
  }

  updateMemoryUsage(): void {
    if ('memory' in performance) {
      this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }
  }

  updateRenderTime(time: number): void {
    this.metrics.renderTime = time;
  }
}

class AdaptiveQuality {
  private currentQuality: number = 1;

  constructor(private config: any) {}

  getCurrentQuality(): number {
    return this.currentQuality;
  }

  adjustQuality(fps: number): void {
    if (fps < 30 && this.currentQuality > 0.5) {
      this.currentQuality *= 0.9;
    } else if (fps > 50 && this.currentQuality < 1) {
      this.currentQuality *= 1.1;
    }

    this.currentQuality = Math.min(Math.max(this.currentQuality, 0.3), 1);
  }
}

// Export par défaut
export default AttentionGuide;
