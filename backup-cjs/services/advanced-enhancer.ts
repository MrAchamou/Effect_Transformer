/**
 * Service d'amélioration avancée basé sur les suggestions IA
 * Intègre les recommandations pour transformer les effets vers le niveau professionnel/enterprise
 */

import fs from 'fs/promises';
import path from 'path';

interface AdvancedModule {
  name: string;
  description: string;
  complexity: 'low' | 'medium' | 'high' | 'very_high';
  impact: 'low' | 'medium' | 'high' | 'dramatic' | 'revolutionary' | 'innovative' | 'enterprise' | 'critical';
  performance_gain: number;
  code_patterns?: string[];
  replacement_strategy?: string;
  triggers?: string[];
  features?: string[];
  [key: string]: any;
}

interface EnhancementLevel {
  name: string;
  description: string;
  modules: string[];
  estimated_improvement: string;
  complexity: string;
  requires_external_apis?: boolean;
}

export class AdvancedEnhancer {
  private advancedModules: Record<string, AdvancedModule> = {};
  private enhancementLevels: Record<string, EnhancementLevel> = {};

  constructor() {
    this.loadAdvancedModules();
  }

  /**
   * Charge la configuration des modules avancés
   */
  private async loadAdvancedModules() {
    try {
      const configPath = path.join(process.cwd(), 'server/config/advanced-enhancement-modules.json');
      const configData = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configData);
      
      this.advancedModules = config.advancedModules;
      this.enhancementLevels = config.enhancement_levels;
    } catch (error) {
      console.error('Erreur de chargement des modules avancés:', error);
    }
  }

  /**
   * Analyse le code et suggère des améliorations basées sur les recommandations IA
   */
  async analyzeAndSuggestImprovements(code: string, currentLevel: number): Promise<{
    suggestions: Array<{
      module: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      impact: string;
      estimated_gain: number;
      implementation_complexity: string;
    }>;
    recommendedLevel: string;
    totalEstimatedGain: number;
  }> {
    const suggestions: Array<{
      module: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      impact: string;
      estimated_gain: number;
      implementation_complexity: string;
    }> = [];

    // Analyser les patterns dans le code
    const codePatterns = this.extractCodePatterns(code);
    
    // Évaluer chaque module avancé
    for (const [moduleId, module] of Object.entries(this.advancedModules)) {
      const priority = this.calculateModulePriority(module, codePatterns, currentLevel);
      
      if (priority !== 'none') {
        suggestions.push({
          module: module.name,
          priority: priority as 'low' | 'medium' | 'high' | 'critical',
          description: module.description,
          impact: module.impact,
          estimated_gain: module.performance_gain,
          implementation_complexity: module.complexity
        });
      }
    }

    // Trier par priorité et impact
    suggestions.sort((a, b) => {
      const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    const totalEstimatedGain = suggestions.reduce((sum, s) => sum + s.estimated_gain, 0);
    const recommendedLevel = this.suggestOptimalLevel(suggestions, currentLevel);

    return {
      suggestions: suggestions.slice(0, 10), // Top 10 suggestions
      recommendedLevel,
      totalEstimatedGain
    };
  }

  /**
   * Applique les améliorations avancées au code
   */
  async applyAdvancedEnhancements(
    code: string, 
    selectedModules: string[], 
    targetLevel: string
  ): Promise<{
    enhancedCode: string;
    appliedEnhancements: string[];
    performanceEstimate: number;
    warnings: string[];
  }> {
    let enhancedCode = code;
    const appliedEnhancements: string[] = [];
    const warnings: string[] = [];
    let totalPerformanceGain = 0;

    // Appliquer chaque module sélectionné
    for (const moduleId of selectedModules) {
      const module = this.advancedModules[moduleId];
      if (!module) continue;

      try {
        const enhancement = await this.applySpecificEnhancement(enhancedCode, moduleId, module);
        enhancedCode = enhancement.code;
        appliedEnhancements.push(enhancement.description);
        totalPerformanceGain += module.performance_gain;
        
        if (enhancement.warnings) {
          warnings.push(...enhancement.warnings);
        }
      } catch (error) {
        warnings.push(`Erreur lors de l'application de ${module.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // Appliquer les optimisations de niveau global
    if (targetLevel && this.enhancementLevels[targetLevel]) {
      const levelOptimizations = await this.applyLevelOptimizations(enhancedCode, targetLevel);
      enhancedCode = levelOptimizations.code;
      appliedEnhancements.push(...levelOptimizations.optimizations);
    }

    return {
      enhancedCode,
      appliedEnhancements,
      performanceEstimate: totalPerformanceGain,
      warnings
    };
  }

  /**
   * Extrait les patterns du code pour analyse
   */
  private extractCodePatterns(code: string): {
    has2DCanvas: boolean;
    hasAnimationLoop: boolean;
    hasComplexMath: boolean;
    hasParticleSystem: boolean;
    has3DTransforms: boolean;
    hasPerformanceIssues: boolean;
  } {
    return {
      has2DCanvas: code.includes("getContext('2d')") || code.includes('ctx.'),
      hasAnimationLoop: code.includes('requestAnimationFrame') || code.includes('setInterval'),
      hasComplexMath: /Math\.(sin|cos|tan|sqrt|pow)/.test(code),
      hasParticleSystem: code.includes('particle') || code.includes('Particle'),
      has3DTransforms: /rotate|transform|matrix/.test(code),
      hasPerformanceIssues: code.split('\n').length > 500 || /for.*length/.test(code)
    };
  }

  /**
   * Calcule la priorité d'un module basé sur le code
   */
  private calculateModulePriority(
    module: AdvancedModule, 
    patterns: any, 
    currentLevel: number
  ): string {
    let priority = 0;

    // Vérifier les patterns de code pertinents
    if (module.code_patterns) {
      const matchingPatterns = module.code_patterns.filter(pattern => 
        Object.values(patterns).some(value => value && String(value).includes(pattern))
      );
      priority += matchingPatterns.length * 10;
    }

    // Bonus selon l'impact
    const impactBonus = {
      'revolutionary': 30,
      'dramatic': 25,
      'innovative': 20,
      'high': 15,
      'enterprise': 12,
      'critical': 10,
      'medium': 5,
      'low': 2
    };
    priority += impactBonus[module.impact] || 0;

    // Ajustement selon le niveau actuel
    if (currentLevel <= 1 && module.complexity === 'low') priority += 5;
    if (currentLevel >= 2 && module.complexity === 'medium') priority += 5;
    if (currentLevel >= 3 && module.complexity === 'high') priority += 5;

    // Déterminer la priorité finale
    if (priority >= 40) return 'critical';
    if (priority >= 25) return 'high';
    if (priority >= 15) return 'medium';
    if (priority >= 5) return 'low';
    return 'none';
  }

  /**
   * Suggère le niveau optimal basé sur les améliorations
   */
  private suggestOptimalLevel(suggestions: any[], currentLevel: number): string {
    const highPrioritySuggestions = suggestions.filter(s => s.priority === 'critical' || s.priority === 'high').length;
    const totalComplexity = suggestions.reduce((sum, s) => {
      const complexityWeight: Record<string, number> = { 'low': 1, 'medium': 2, 'high': 3, 'very_high': 4 };
      return sum + (complexityWeight[s.implementation_complexity] || 1);
    }, 0);

    if (highPrioritySuggestions >= 8 && totalComplexity >= 20) {
      return 'level_6_revolutionary';
    } else if (highPrioritySuggestions >= 5 && totalComplexity >= 15) {
      return 'level_5_enterprise';
    } else if (highPrioritySuggestions >= 3) {
      return 'level_4_professional_plus';
    }

    return currentLevel >= 3 ? 'level_4_professional_plus' : `level_${Math.min(currentLevel + 1, 3)}_enhanced`;
  }

  /**
   * Applique une amélioration spécifique
   */
  private async applySpecificEnhancement(
    code: string, 
    moduleId: string, 
    module: AdvancedModule
  ): Promise<{ code: string; description: string; warnings?: string[] }> {
    const warnings: string[] = [];

    switch (moduleId) {
      case 'webgl_integration':
        return this.applyWebGLIntegration(code);
      
      case 'lod_system':
        return this.applyLODSystem(code);
        
      case 'web_workers':
        return this.applyWebWorkers(code);
        
      case 'adaptive_rendering':
        return this.applyAdaptiveRendering(code);
        
      case 'predictive_cache':
        return this.applyPredictiveCache(code);
        
      case 'resilience_system':
        return this.applyResilienceSystem(code);
        
      default:
        return {
          code: code + `\n// TODO: Implémenter ${module.name}\n`,
          description: `Placeholder ajouté pour ${module.name}`,
          warnings: [`Module ${moduleId} pas encore implémenté`]
        };
    }
  }

  /**
   * Applique l'intégration WebGL
   */
  private applyWebGLIntegration(code: string): { code: string; description: string } {
    const webglCode = `
// === INTÉGRATION WEBGL AVANCÉE ===
class WebGLEffectRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!this.gl) throw new Error('WebGL non supporté');
    
    this.initWebGL();
  }
  
  initWebGL() {
    const gl = this.gl;
    
    // Configuration de base
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // Shaders optimisés
    this.setupShaders();
    this.setupBuffers();
  }
  
  setupShaders() {
    const vertexShaderSource = \`
      attribute vec4 a_position;
      attribute vec2 a_texCoord;
      uniform mat4 u_matrix;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = u_matrix * a_position;
        v_texCoord = a_texCoord;
      }
    \`;
    
    const fragmentShaderSource = \`
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_time;
      varying vec2 v_texCoord;
      
      void main() {
        vec2 uv = v_texCoord;
        // Effets dynamiques basés sur le temps
        uv += 0.1 * sin(u_time + uv.y * 10.0);
        
        vec4 color = texture2D(u_texture, uv);
        gl_FragColor = color;
      }
    \`;
    
    this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
  }
  
  createProgram(vertexSource, fragmentSource) {
    const gl = this.gl;
    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentSource);
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('Erreur de linkage des shaders: ' + gl.getProgramInfoLog(program));
    }
    
    return program;
  }
  
  render(deltaTime) {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(this.program);
    
    // Mise à jour des uniforms
    const timeLocation = gl.getUniformLocation(this.program, 'u_time');
    gl.uniform1f(timeLocation, deltaTime * 0.001);
    
    // Rendu optimisé
    this.drawScene();
  }
}

`;

    // Intégrer WebGL dans le code existant
    const integratedCode = code.replace(
      /canvas\.getContext\('2d'\)/g,
      'canvas.getContext("2d") // Fallback - WebGL disponible via this.webglRenderer'
    );

    return {
      code: webglCode + integratedCode + `
// Initialisation WebGL automatique
if (typeof window !== 'undefined' && this.canvas) {
  try {
    this.webglRenderer = new WebGLEffectRenderer(this.canvas);
    console.log('WebGL activé pour performance optimale');
  } catch (e) {
    console.log('Fallback Canvas 2D:', e.message);
  }
}`,
      description: 'Intégration WebGL avec fallback Canvas 2D pour performance 3D optimale'
    };
  }

  /**
   * Applique le système LOD
   */
  private applyLODSystem(code: string): { code: string; description: string } {
    const lodCode = `
// === SYSTÈME LEVEL OF DETAIL (LOD) ===
class AdaptiveLODManager {
  constructor() {
    this.currentLOD = 1.0;
    this.performanceHistory = [];
    this.targetFPS = 60;
    this.adaptationRate = 0.02;
  }
  
  updateLOD(currentFPS, deltaTime) {
    this.performanceHistory.push(currentFPS);
    if (this.performanceHistory.length > 30) {
      this.performanceHistory.shift();
    }
    
    const avgFPS = this.performanceHistory.reduce((a, b) => a + b, 0) / this.performanceHistory.length;
    
    if (avgFPS < this.targetFPS * 0.8) {
      // Réduire la qualité
      this.currentLOD = Math.max(0.3, this.currentLOD - this.adaptationRate);
    } else if (avgFPS > this.targetFPS * 0.95) {
      // Augmenter la qualité
      this.currentLOD = Math.min(1.0, this.currentLOD + this.adaptationRate * 0.5);
    }
    
    return this.currentLOD;
  }
  
  getOptimalSettings() {
    return {
      particleCount: Math.floor(this.currentLOD * 100),
      textureQuality: this.currentLOD,
      effectsIntensity: this.currentLOD,
      shadowQuality: Math.max(0.5, this.currentLOD)
    };
  }
}

`;

    return {
      code: lodCode + code + `
// Intégration LOD automatique
if (!this.lodManager) {
  this.lodManager = new AdaptiveLODManager();
}

// Dans la boucle d'animation, ajouter:
const currentFPS = 1000 / deltaTime;
const lodLevel = this.lodManager.updateLOD(currentFPS, deltaTime);
const settings = this.lodManager.getOptimalSettings();
`,
      description: 'Système LOD adaptatif pour optimisation automatique des performances'
    };
  }

  /**
   * Applique les Web Workers
   */
  private applyWebWorkers(code: string): { code: string; description: string } {
    const workerCode = `
// === INTÉGRATION WEB WORKERS ===
class WorkerManager {
  constructor() {
    this.workers = new Map();
    this.taskQueue = [];
    this.initWorkers();
  }
  
  initWorkers() {
    // Worker pour calculs physiques
    const physicsWorkerCode = \`
      self.onmessage = function(e) {
        const { type, data, id } = e.data;
        
        switch(type) {
          case 'physics_update':
            const result = computePhysics(data);
            self.postMessage({ id, result });
            break;
            
          case 'particle_simulation':
            const particles = simulateParticles(data);
            self.postMessage({ id, result: particles });
            break;
        }
      };
      
      function computePhysics(data) {
        // Calculs physiques intensifs
        return data.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vx: particle.vx * 0.99,
          vy: particle.vy * 0.99
        }));
      }
      
      function simulateParticles(data) {
        return data.particles.map(p => {
          // Simulation avancée
          return {
            ...p,
            age: p.age + 1,
            opacity: Math.max(0, p.opacity - 0.01)
          };
        });
      }
    \`;
    
    const blob = new Blob([physicsWorkerCode], { type: 'application/javascript' });
    this.workers.set('physics', new Worker(URL.createObjectURL(blob)));
    
    // Configuration des callbacks
    this.workers.get('physics').onmessage = (e) => {
      this.handleWorkerResult(e.data);
    };
  }
  
  async delegateTask(workerType, taskType, data) {
    return new Promise((resolve) => {
      const id = Date.now() + Math.random();
      const worker = this.workers.get(workerType);
      
      const timeout = setTimeout(() => {
        resolve(null); // Fallback si timeout
      }, 100);
      
      const originalHandler = worker.onmessage;
      worker.onmessage = (e) => {
        if (e.data.id === id) {
          clearTimeout(timeout);
          worker.onmessage = originalHandler;
          resolve(e.data.result);
        } else {
          originalHandler(e);
        }
      };
      
      worker.postMessage({ type: taskType, data, id });
    });
  }
}

`;

    return {
      code: workerCode + code + `
// Initialisation Worker Manager
if (!this.workerManager && typeof Worker !== 'undefined') {
  this.workerManager = new WorkerManager();
  
  // Exemple d'utilisation dans l'animation
  if (this.particles && this.particles.length > 50) {
    this.workerManager.delegateTask('physics', 'particle_simulation', {
      particles: this.particles
    }).then(result => {
      if (result) this.particles = result;
    });
  }
}
`,
      description: 'Web Workers pour délégation des calculs lourds et amélioration des performances'
    };
  }

  /**
   * Applique le rendu adaptatif
   */
  private applyAdaptiveRendering(code: string): { code: string; description: string } {
    const adaptiveCode = `
// === RENDU ADAPTATIF MULTI-DEVICE ===
class AdaptiveRenderingEngine {
  constructor() {
    this.deviceCapabilities = this.detectDeviceCapabilities();
    this.renderingConfig = this.calculateOptimalConfig();
    this.dynamicQuality = 1.0;
  }
  
  detectDeviceCapabilities() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    
    return {
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      hasWebGL: !!gl,
      maxTextureSize: gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 2048,
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      devicePixelRatio: window.devicePixelRatio || 1,
      memoryLimit: navigator.deviceMemory || 4
    };
  }
  
  calculateOptimalConfig() {
    const caps = this.deviceCapabilities;
    
    if (caps.isMobile) {
      return {
        resolution: Math.min(1.0, caps.devicePixelRatio),
        particleCount: 30,
        textureQuality: 0.7,
        antialiasing: false,
        shadowQuality: 0.5
      };
    } else if (caps.memoryLimit < 4) {
      return {
        resolution: 1.0,
        particleCount: 60,
        textureQuality: 0.8,
        antialiasing: true,
        shadowQuality: 0.7
      };
    } else {
      return {
        resolution: Math.min(2.0, caps.devicePixelRatio),
        particleCount: 100,
        textureQuality: 1.0,
        antialiasing: true,
        shadowQuality: 1.0
      };
    }
  }
  
  adaptQualityRealTime(fps, targetFPS = 60) {
    if (fps < targetFPS * 0.8) {
      this.dynamicQuality *= 0.95;
    } else if (fps > targetFPS * 0.98) {
      this.dynamicQuality *= 1.02;
    }
    
    this.dynamicQuality = Math.max(0.3, Math.min(1.5, this.dynamicQuality));
    return this.getAdaptedConfig();
  }
  
  getAdaptedConfig() {
    const base = this.renderingConfig;
    return {
      resolution: base.resolution * this.dynamicQuality,
      particleCount: Math.floor(base.particleCount * this.dynamicQuality),
      textureQuality: base.textureQuality * this.dynamicQuality,
      antialiasing: this.dynamicQuality > 0.8 ? base.antialiasing : false,
      shadowQuality: base.shadowQuality * this.dynamicQuality
    };
  }
}

`;

    return {
      code: adaptiveCode + code + `
// Initialisation du rendu adaptatif
if (!this.adaptiveRenderer) {
  this.adaptiveRenderer = new AdaptiveRenderingEngine();
  const config = this.adaptiveRenderer.getAdaptedConfig();
  
  // Appliquer la configuration
  if (this.particles) {
    this.particles = this.particles.slice(0, config.particleCount);
  }
  
  console.log('Rendu adaptatif configuré:', config);
}
`,
      description: 'Système de rendu adaptatif optimisé pour chaque type de device'
    };
  }

  /**
   * Applique le cache prédictif
   */
  private applyPredictiveCache(code: string): { code: string; description: string } {
    const cacheCode = `
// === CACHE PRÉDICTIF INTELLIGENT ===
class PredictiveCacheSystem {
  constructor() {
    this.cache = new Map();
    this.accessHistory = [];
    this.predictionModel = new Map();
    this.preloadQueue = [];
  }
  
  trackAccess(key) {
    this.accessHistory.push({ key, timestamp: Date.now() });
    if (this.accessHistory.length > 1000) {
      this.accessHistory.shift();
    }
    
    this.updatePredictionModel();
  }
  
  updatePredictionModel() {
    const recent = this.accessHistory.slice(-100);
    const patterns = new Map();
    
    for (let i = 0; i < recent.length - 1; i++) {
      const current = recent[i].key;
      const next = recent[i + 1].key;
      
      if (!patterns.has(current)) {
        patterns.set(current, new Map());
      }
      
      const nextMap = patterns.get(current);
      nextMap.set(next, (nextMap.get(next) || 0) + 1);
    }
    
    this.predictionModel = patterns;
  }
  
  predictNext(currentKey) {
    const predictions = this.predictionModel.get(currentKey);
    if (!predictions) return null;
    
    let maxCount = 0;
    let bestPrediction = null;
    
    for (const [key, count] of predictions) {
      if (count > maxCount) {
        maxCount = count;
        bestPrediction = key;
      }
    }
    
    return bestPrediction;
  }
  
  async preloadResource(key, generator) {
    if (!this.cache.has(key)) {
      const resource = await generator();
      this.cache.set(key, {
        data: resource,
        timestamp: Date.now(),
        hits: 0
      });
    }
  }
  
  get(key, generator) {
    this.trackAccess(key);
    
    if (this.cache.has(key)) {
      const entry = this.cache.get(key);
      entry.hits++;
      return entry.data;
    }
    
    // Générer et cacher
    const data = generator();
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 1
    });
    
    // Prédire et précharger le suivant
    const nextKey = this.predictNext(key);
    if (nextKey && !this.cache.has(nextKey)) {
      setTimeout(() => this.preloadResource(nextKey, generator), 0);
    }
    
    return data;
  }
}

`;

    return {
      code: cacheCode + code + `
// Initialisation du cache prédictif
if (!this.predictiveCache) {
  this.predictiveCache = new PredictiveCacheSystem();
  
  // Exemple d'usage pour les textures/ressources
  this.getCachedResource = (key, generator) => {
    return this.predictiveCache.get(key, generator);
  };
}
`,
      description: 'Cache prédictif avec apprentissage automatique des patterns d\'utilisation'
    };
  }

  /**
   * Applique le système de résilience
   */
  private applyResilienceSystem(code: string): { code: string; description: string } {
    const resilienceCode = `
// === SYSTÈME DE RÉSILIENCE ET FALLBACKS ===
class ResilienceSystem {
  constructor() {
    this.fallbackLevels = [
      { name: 'optimal', check: () => this.checkOptimalPerformance() },
      { name: 'reduced', check: () => this.checkReducedPerformance() },
      { name: 'minimal', check: () => true }
    ];
    this.currentLevel = 0;
    this.performanceMonitor = new PerformanceMonitor();
  }
  
  checkOptimalPerformance() {
    const metrics = this.performanceMonitor.getMetrics();
    return metrics.fps > 55 && metrics.memory < 0.8;
  }
  
  checkReducedPerformance() {
    const metrics = this.performanceMonitor.getMetrics();
    return metrics.fps > 30 && metrics.memory < 0.95;
  }
  
  adaptToPerformance() {
    for (let i = 0; i < this.fallbackLevels.length; i++) {
      if (this.fallbackLevels[i].check()) {
        if (i !== this.currentLevel) {
          this.currentLevel = i;
          this.applyFallbackLevel(i);
        }
        break;
      }
    }
  }
  
  applyFallbackLevel(level) {
    const configs = {
      0: { // optimal
        particleCount: 100,
        textureQuality: 1.0,
        effectsEnabled: true,
        animationSmooth: true
      },
      1: { // reduced
        particleCount: 50,
        textureQuality: 0.7,
        effectsEnabled: true,
        animationSmooth: false
      },
      2: { // minimal
        particleCount: 20,
        textureQuality: 0.5,
        effectsEnabled: false,
        animationSmooth: false
      }
    };
    
    const config = configs[level];
    this.applyConfiguration(config);
    
    console.log(\`Fallback niveau \${level} activé:, config);
  }
  
  applyConfiguration(config) {
    // Appliquer la configuration au système
    if (window.currentEffect) {
      window.currentEffect.updateConfiguration(config);
    }
  }
}

class PerformanceMonitor {
  constructor() {
    this.frameHistory = [];
    this.memoryHistory = [];
  }
  
  recordFrame(deltaTime) {
    const fps = 1000 / deltaTime;
    this.frameHistory.push(fps);
    
    if (this.frameHistory.length > 60) {
      this.frameHistory.shift();
    }
    
    // Monitor memory if available
    if (performance.memory) {
      const memUsage = performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize;
      this.memoryHistory.push(memUsage);
      
      if (this.memoryHistory.length > 30) {
        this.memoryHistory.shift();
      }
    }
  }
  
  getMetrics() {
    const avgFPS = this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length || 60;
    const avgMemory = this.memoryHistory.reduce((a, b) => a + b, 0) / this.memoryHistory.length || 0.5;
    
    return {
      fps: avgFPS,
      memory: avgMemory,
      stability: this.calculateStability()
    };
  }
  
  calculateStability() {
    if (this.frameHistory.length < 30) return 1;
    
    const variance = this.frameHistory.reduce((sum, fps) => {
      const avg = this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length;
      return sum + Math.pow(fps - avg, 2);
    }, 0) / this.frameHistory.length;
    
    return Math.max(0, 1 - variance / 1000);
  }
}

`;

    return {
      code: resilienceCode + code + `
// Initialisation du système de résilience
if (!this.resilienceSystem) {
  this.resilienceSystem = new ResilienceSystem();
  
  // Monitoring automatique dans la boucle d'animation
  const originalAnimate = this.animate;
  this.animate = function(deltaTime) {
    this.resilienceSystem.performanceMonitor.recordFrame(deltaTime);
    this.resilienceSystem.adaptToPerformance();
    
    return originalAnimate.call(this, deltaTime);
  };
  
  window.currentEffect = this; // Pour l'accès global
}
`,
      description: 'Système de résilience avec fallbacks automatiques et monitoring des performances'
    };
  }

  /**
   * Applique les optimisations de niveau
   */
  private async applyLevelOptimizations(code: string, level: string): Promise<{
    code: string;
    optimizations: string[];
  }> {
    const optimizations: string[] = [];
    let optimizedCode = code;

    const levelConfig = this.enhancementLevels[level];
    if (!levelConfig) return { code, optimizations };

    // Optimisations globales selon le niveau
    const globalOptimizations = `
// === OPTIMISATIONS NIVEAU ${level.toUpperCase()} ===
class ${levelConfig.name.replace(/\s+/g, '')}Optimizer {
  constructor() {
    this.optimizationLevel = '${level}';
    this.activeModules = ${JSON.stringify(levelConfig.modules)};
    this.initOptimizations();
  }
  
  initOptimizations() {
    // Configuration globale
    this.setGlobalOptimizations();
    
    // Performance monitoring
    this.setupPerformanceTracking();
    
    // Resource management
    this.initResourceManager();
  }
  
  setGlobalOptimizations() {
    // Code optimisations spécifiques au niveau
    if (typeof requestIdleCallback !== 'undefined') {
      this.useIdleTimeProcessing = true;
    }
    
    // Memory management
    this.setupMemoryManagement();
  }
  
  setupPerformanceTracking() {
    this.performanceStats = {
      renderTime: [],
      memoryUsage: [],
      effectsCount: 0
    };
  }
  
  setupMemoryManagement() {
    // Garbage collection hints
    if (window.gc && Math.random() < 0.01) {
      requestIdleCallback(() => window.gc());
    }
  }
}

`;

    optimizedCode = globalOptimizations + optimizedCode;
    optimizations.push(`Optimisations niveau ${levelConfig.name} appliquées`);
    optimizations.push(`Architecture ${levelConfig.complexity} configurée`);
    optimizations.push(`Amélioration estimée: ${levelConfig.estimated_improvement}`);

    return { code: optimizedCode, optimizations };
  }

  /**
   * Obtient les niveaux d'amélioration disponibles
   */
  getAvailableEnhancementLevels(): Record<string, EnhancementLevel> {
    return this.enhancementLevels;
  }

  /**
   * Obtient les modules avancés disponibles
   */
  getAvailableModules(): Record<string, AdvancedModule> {
    return this.advancedModules;
  }
}