
/**
 * PerformanceAdaptiveEngine - Module 7 du Niveau 1
 * Moteur d'adaptation de performance temps réel avec IA de resource management
 * 100% autonome - Aucune dépendance externe
 */

interface DeviceProfile {
  tier: 'low' | 'medium' | 'high' | 'ultra';
  cpu: {
    cores: number;
    estimatedPower: number;
    architecture: string;
  };
  gpu: {
    available: boolean;
    tier: 'basic' | 'integrated' | 'dedicated' | 'high-end';
    webglVersion: '1' | '2' | 'none';
    maxTextureSize: number;
  };
  memory: {
    estimated: number;
    available: number;
    pressure: 'low' | 'medium' | 'high' | 'critical';
  };
  network: {
    speed: 'slow' | 'medium' | 'fast' | 'ultra';
    latency: number;
    effectiveType: string;
  };
  display: {
    pixelRatio: number;
    resolution: { width: number; height: number };
    colorDepth: number;
    refreshRate: number;
  };
  platform: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  battery: {
    level: number;
    charging: boolean;
    available: boolean;
  };
}

interface PerformanceMode {
  name: string;
  description: string;
  settings: {
    maxParticles: number;
    animationQuality: number;
    textureResolution: number;
    effectComplexity: number;
    frameTarget: number;
    memoryLimit: number;
    enableShadows: boolean;
    enablePostProcessing: boolean;
    enableAntialiasing: boolean;
  };
  triggers: {
    batteryBelow?: number;
    memoryAbove?: number;
    fpsBelow?: number;
    thermalState?: string;
  };
}

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  cpuUsage: number;
  gpuUsage: number;
  renderTime: number;
  stability: number;
  efficiency: number;
  timestamp: number;
}

interface AdaptiveCache {
  profiles: Map<string, any>;
  assets: Map<string, any>;
  computations: Map<string, any>;
  maxSize: number;
  currentSize: number;
  hits: number;
  misses: number;
}

interface PredictiveModel {
  usagePatterns: Map<string, number[]>;
  performanceHistory: PerformanceMetrics[];
  contextPredictions: Map<string, number>;
  learningRate: number;
  confidence: number;
}

export class PerformanceAdaptiveEngine {
  private deviceProfile: DeviceProfile;
  private currentMode: PerformanceMode;
  private availableModes: PerformanceMode[];
  private performanceMetrics: PerformanceMetrics[] = [];
  private adaptiveCache: AdaptiveCache;
  private predictiveModel: PredictiveModel;
  private monitoringActive: boolean = false;
  private adaptationCallbacks: Map<string, Function> = new Map();
  private emergencyMode: boolean = false;
  private lastOptimization: number = 0;
  private frameAnalyzer: any = null;

  constructor() {
    this.initializeDeviceProfile();
    this.initializePerformanceModes();
    this.initializeAdaptiveCache();
    this.initializePredictiveModel();
    this.selectOptimalMode();
    this.startPerformanceMonitoring();
  }

  /**
   * 1. DÉTECTION HARDWARE INTELLIGENTE MULTI-PLATEFORME
   */
  private initializeDeviceProfile(): void {
    this.deviceProfile = {
      tier: 'medium',
      cpu: this.analyzeCPU(),
      gpu: this.analyzeGPU(),
      memory: this.analyzeMemory(),
      network: this.analyzeNetwork(),
      display: this.analyzeDisplay(),
      platform: this.detectPlatform(),
      battery: this.analyzeBattery()
    };

    // Calculer le tier global
    this.deviceProfile.tier = this.calculateDeviceTier();
  }

  private analyzeCPU(): DeviceProfile['cpu'] {
    const cores = navigator.hardwareConcurrency || 2;
    
    // Estimation de la puissance basée sur plusieurs indices
    let estimatedPower = 1.0;
    
    // Test de performance CPU simple
    const startTime = performance.now();
    let operations = 0;
    const testDuration = 50; // 50ms de test
    
    const endTime = startTime + testDuration;
    while (performance.now() < endTime) {
      Math.sqrt(Math.random() * 1000);
      operations++;
    }
    
    const actualDuration = performance.now() - startTime;
    const opsPerMs = operations / actualDuration;
    
    // Normaliser selon les benchmarks typiques
    if (opsPerMs > 500) estimatedPower = 2.0; // CPU puissant
    else if (opsPerMs > 200) estimatedPower = 1.5; // CPU moyen-fort
    else if (opsPerMs > 100) estimatedPower = 1.0; // CPU moyen
    else estimatedPower = 0.5; // CPU faible

    // Ajustement selon le nombre de cores
    estimatedPower *= Math.min(cores / 4, 2);

    return {
      cores,
      estimatedPower,
      architecture: this.detectCPUArchitecture()
    };
  }

  private detectCPUArchitecture(): string {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('arm') || platform.includes('iphone') || platform.includes('ipad')) {
      return 'ARM';
    }
    if (platform.includes('x86') || platform.includes('intel') || platform.includes('amd')) {
      return 'x86_64';
    }
    return 'unknown';
  }

  private analyzeGPU(): DeviceProfile['gpu'] {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      return {
        available: false,
        tier: 'basic',
        webglVersion: 'none',
        maxTextureSize: 512
      };
    }

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const renderer = gl.getParameter(gl.RENDERER) || '';
    const vendor = gl.getParameter(gl.VENDOR) || '';
    
    // Analyse du GPU basée sur les capacités
    let tier: 'basic' | 'integrated' | 'dedicated' | 'high-end' = 'basic';
    
    if (maxTextureSize >= 16384) {
      tier = 'high-end';
    } else if (maxTextureSize >= 8192) {
      tier = 'dedicated';
    } else if (maxTextureSize >= 4096) {
      tier = 'integrated';
    }

    // Ajustement basé sur le renderer
    const rendererLower = renderer.toLowerCase();
    if (rendererLower.includes('nvidia') || rendererLower.includes('amd') || rendererLower.includes('radeon')) {
      if (tier === 'integrated') tier = 'dedicated';
    }

    return {
      available: true,
      tier,
      webglVersion: gl instanceof WebGL2RenderingContext ? '2' : '1',
      maxTextureSize
    };
  }

  private analyzeMemory(): DeviceProfile['memory'] {
    // Estimation de la mémoire disponible
    const navigatorMemory = (navigator as any).deviceMemory;
    let estimated = navigatorMemory || this.estimateMemoryFromOtherMetrics();
    
    // Mémoire disponible (estimation)
    let available = estimated * 0.7; // 70% typiquement disponible pour les apps web
    
    // Test de pression mémoire
    const pressure = this.testMemoryPressure();
    
    return {
      estimated,
      available,
      pressure
    };
  }

  private estimateMemoryFromOtherMetrics(): number {
    let memoryScore = 4; // Base 4GB
    
    // Ajustement selon CPU
    memoryScore += this.deviceProfile?.cpu?.cores ? this.deviceProfile.cpu.cores * 0.5 : 1;
    
    // Ajustement selon GPU
    if (this.deviceProfile?.gpu?.tier === 'high-end') memoryScore += 4;
    else if (this.deviceProfile?.gpu?.tier === 'dedicated') memoryScore += 2;
    else if (this.deviceProfile?.gpu?.tier === 'integrated') memoryScore += 1;
    
    // Ajustement selon plateforme
    if (this.deviceProfile?.platform === 'mobile') memoryScore *= 0.6;
    else if (this.deviceProfile?.platform === 'tablet') memoryScore *= 0.8;
    
    return Math.min(32, Math.max(1, memoryScore));
  }

  private testMemoryPressure(): 'low' | 'medium' | 'high' | 'critical' {
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      const usageRatio = memory.usedJSHeapSize / memory.totalJSHeapSize;
      
      if (usageRatio > 0.9) return 'critical';
      if (usageRatio > 0.7) return 'high';
      if (usageRatio > 0.5) return 'medium';
      return 'low';
    }
    
    // Test de stress mémoire pour estimation
    try {
      const testArray = new Array(100000).fill(0);
      testArray.forEach((_, i) => testArray[i] = Math.random());
      return 'low';
    } catch {
      return 'high';
    }
  }

  private analyzeNetwork(): DeviceProfile['network'] {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const effectiveType = connection.effectiveType || 'unknown';
      let speed: 'slow' | 'medium' | 'fast' | 'ultra' = 'medium';
      
      switch (effectiveType) {
        case 'slow-2g':
        case '2g':
          speed = 'slow';
          break;
        case '3g':
          speed = 'medium';
          break;
        case '4g':
          speed = 'fast';
          break;
        case '5g':
          speed = 'ultra';
          break;
      }
      
      return {
        speed,
        latency: connection.rtt || 100,
        effectiveType
      };
    }
    
    // Fallback - test de latency simple
    return {
      speed: 'medium',
      latency: 100,
      effectiveType: 'unknown'
    };
  }

  private analyzeDisplay(): DeviceProfile['display'] {
    const screen = window.screen;
    
    return {
      pixelRatio: window.devicePixelRatio || 1,
      resolution: {
        width: screen.width,
        height: screen.height
      },
      colorDepth: screen.colorDepth || 24,
      refreshRate: this.estimateRefreshRate()
    };
  }

  private estimateRefreshRate(): number {
    // Estimation du refresh rate
    let lastTime = performance.now();
    let frameCount = 0;
    const maxFrames = 10;
    
    return new Promise<number>((resolve) => {
      const measureFrame = () => {
        const currentTime = performance.now();
        frameCount++;
        
        if (frameCount >= maxFrames) {
          const avgFrameTime = (currentTime - lastTime) / maxFrames;
          const estimatedRefreshRate = Math.round(1000 / avgFrameTime);
          resolve(Math.min(144, Math.max(30, estimatedRefreshRate)));
        } else {
          requestAnimationFrame(measureFrame);
        }
      };
      
      requestAnimationFrame(measureFrame);
    }).then(rate => rate).catch(() => 60); // Fallback 60Hz
  }

  private detectPlatform(): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
    const userAgent = navigator.userAgent.toLowerCase();
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const maxDimension = Math.max(screenWidth, screenHeight);
    const minDimension = Math.min(screenWidth, screenHeight);
    
    // Détection mobile
    if (/android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return 'mobile';
    }
    
    // Détection tablette
    if (/ipad|android.*tablet|kindle/i.test(userAgent) || 
        (maxDimension >= 768 && maxDimension <= 1024 && minDimension >= 600)) {
      return 'tablet';
    }
    
    // Détection basée sur la taille d'écran
    if (maxDimension < 768) return 'mobile';
    if (maxDimension >= 768 && maxDimension <= 1366) return 'tablet';
    if (maxDimension > 1366) return 'desktop';
    
    return 'unknown';
  }

  private analyzeBattery(): DeviceProfile['battery'] {
    // API Battery (quand disponible)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        this.deviceProfile.battery = {
          level: battery.level,
          charging: battery.charging,
          available: true
        };
        
        // Réadapter si le niveau de batterie change
        battery.addEventListener('levelchange', () => {
          this.deviceProfile.battery.level = battery.level;
          this.checkForModeChange();
        });
      });
    }
    
    return {
      level: 1.0, // Assumer pleine charge par défaut
      charging: true,
      available: false
    };
  }

  private calculateDeviceTier(): 'low' | 'medium' | 'high' | 'ultra' {
    let score = 0;
    
    // Score CPU (0-3 points)
    if (this.deviceProfile.cpu.estimatedPower >= 2.0) score += 3;
    else if (this.deviceProfile.cpu.estimatedPower >= 1.5) score += 2;
    else if (this.deviceProfile.cpu.estimatedPower >= 1.0) score += 1;
    
    // Score GPU (0-3 points)
    switch (this.deviceProfile.gpu.tier) {
      case 'high-end': score += 3; break;
      case 'dedicated': score += 2; break;
      case 'integrated': score += 1; break;
    }
    
    // Score mémoire (0-2 points)
    if (this.deviceProfile.memory.estimated >= 8) score += 2;
    else if (this.deviceProfile.memory.estimated >= 4) score += 1;
    
    // Pénalité plateforme
    if (this.deviceProfile.platform === 'mobile') score -= 1;
    
    // Classification finale
    if (score >= 7) return 'ultra';
    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  /**
   * 2. SYSTÈME D'ADAPTATION DYNAMIQUE AVANCÉ
   */
  private initializePerformanceModes(): void {
    this.availableModes = [
      {
        name: 'Ultra Performance',
        description: 'Qualité maximale pour hardware haut de gamme',
        settings: {
          maxParticles: 1000,
          animationQuality: 1.0,
          textureResolution: 1.0,
          effectComplexity: 1.0,
          frameTarget: 60,
          memoryLimit: 0.8,
          enableShadows: true,
          enablePostProcessing: true,
          enableAntialiasing: true
        },
        triggers: {}
      },
      {
        name: 'High Performance',
        description: 'Équilibre qualité/performance pour hardware performant',
        settings: {
          maxParticles: 500,
          animationQuality: 0.9,
          textureResolution: 0.9,
          effectComplexity: 0.8,
          frameTarget: 60,
          memoryLimit: 0.7,
          enableShadows: true,
          enablePostProcessing: true,
          enableAntialiasing: false
        },
        triggers: {}
      },
      {
        name: 'Balanced',
        description: 'Mode équilibré pour hardware moyen',
        settings: {
          maxParticles: 250,
          animationQuality: 0.8,
          textureResolution: 0.8,
          effectComplexity: 0.7,
          frameTarget: 45,
          memoryLimit: 0.6,
          enableShadows: false,
          enablePostProcessing: false,
          enableAntialiasing: false
        },
        triggers: {
          memoryAbove: 0.7,
          fpsBelow: 45
        }
      },
      {
        name: 'Power Saver',
        description: 'Optimisations maximales pour économie d\'énergie',
        settings: {
          maxParticles: 100,
          animationQuality: 0.6,
          textureResolution: 0.6,
          effectComplexity: 0.5,
          frameTarget: 30,
          memoryLimit: 0.5,
          enableShadows: false,
          enablePostProcessing: false,
          enableAntialiasing: false
        },
        triggers: {
          batteryBelow: 0.3,
          memoryAbove: 0.8,
          fpsBelow: 30
        }
      },
      {
        name: 'Emergency',
        description: 'Mode minimal pour situations critiques',
        settings: {
          maxParticles: 50,
          animationQuality: 0.4,
          textureResolution: 0.4,
          effectComplexity: 0.3,
          frameTarget: 20,
          memoryLimit: 0.4,
          enableShadows: false,
          enablePostProcessing: false,
          enableAntialiasing: false
        },
        triggers: {
          batteryBelow: 0.1,
          memoryAbove: 0.9,
          fpsBelow: 20,
          thermalState: 'critical'
        }
      }
    ];
  }

  private selectOptimalMode(): void {
    const tier = this.deviceProfile.tier;
    
    switch (tier) {
      case 'ultra':
        this.currentMode = this.availableModes[0]; // Ultra Performance
        break;
      case 'high':
        this.currentMode = this.availableModes[1]; // High Performance
        break;
      case 'medium':
        this.currentMode = this.availableModes[2]; // Balanced
        break;
      case 'low':
        this.currentMode = this.availableModes[3]; // Power Saver
        break;
    }
  }

  public adaptModeToConditions(): void {
    if (this.emergencyMode) return;
    
    const currentMetrics = this.getCurrentMetrics();
    const battery = this.deviceProfile.battery;
    
    // Vérifier les triggers de chaque mode
    for (const mode of this.availableModes) {
      const triggers = mode.triggers;
      let shouldSwitch = false;
      
      // Vérifier batterie
      if (triggers.batteryBelow && battery.level < triggers.batteryBelow) {
        shouldSwitch = true;
      }
      
      // Vérifier mémoire
      if (triggers.memoryAbove && currentMetrics.memoryUsage > triggers.memoryAbove) {
        shouldSwitch = true;
      }
      
      // Vérifier FPS
      if (triggers.fpsBelow && currentMetrics.fps < triggers.fpsBelow) {
        shouldSwitch = true;
      }
      
      if (shouldSwitch && mode !== this.currentMode) {
        this.switchToMode(mode);
        break;
      }
    }
  }

  private switchToMode(newMode: PerformanceMode): void {
    const oldMode = this.currentMode;
    this.currentMode = newMode;
    
    // Notifier les callbacks
    this.adaptationCallbacks.forEach(callback => {
      try {
        callback({
          oldMode: oldMode.name,
          newMode: newMode.name,
          reason: 'automatic_adaptation',
          settings: newMode.settings
        });
      } catch (error) {
        console.warn('Erreur dans callback d\'adaptation:', error);
      }
    });
    
    // Ajuster le cache
    this.adjustCacheToMode(newMode);
  }

  /**
   * 3. MONITORING EN TEMPS RÉEL INTÉGRÉ
   */
  private startPerformanceMonitoring(): void {
    if (this.monitoringActive) return;
    
    this.monitoringActive = true;
    this.initializeFrameAnalyzer();
    this.startContinuousMonitoring();
  }

  private initializeFrameAnalyzer(): void {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameTimeHistory: number[] = [];
    
    this.frameAnalyzer = () => {
      const currentTime = performance.now();
      const frameTime = currentTime - lastTime;
      
      frameTimeHistory.push(frameTime);
      if (frameTimeHistory.length > 60) { // Garder 60 dernières frames
        frameTimeHistory.shift();
      }
      
      frameCount++;
      
      // Calculer métriques toutes les secondes
      if (frameCount % 60 === 0) {
        const avgFrameTime = frameTimeHistory.reduce((a, b) => a + b, 0) / frameTimeHistory.length;
        const fps = 1000 / avgFrameTime;
        const stability = this.calculateFrameStability(frameTimeHistory);
        
        this.recordMetrics({
          fps,
          frameTime: avgFrameTime,
          memoryUsage: this.getCurrentMemoryUsage(),
          cpuUsage: this.estimateCPUUsage(),
          gpuUsage: 0, // Difficile à mesurer précisément
          renderTime: avgFrameTime,
          stability,
          efficiency: this.calculateEfficiency(fps, avgFrameTime),
          timestamp: currentTime
        });
      }
      
      lastTime = currentTime;
      
      if (this.monitoringActive) {
        requestAnimationFrame(this.frameAnalyzer);
      }
    };
    
    requestAnimationFrame(this.frameAnalyzer);
  }

  private calculateFrameStability(frameTimeHistory: number[]): number {
    if (frameTimeHistory.length < 10) return 1;
    
    const avg = frameTimeHistory.reduce((a, b) => a + b, 0) / frameTimeHistory.length;
    const variance = frameTimeHistory.reduce((sum, frameTime) => 
      sum + Math.pow(frameTime - avg, 2), 0) / frameTimeHistory.length;
    
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = standardDeviation / avg;
    
    // Normaliser: plus la variation est faible, plus la stabilité est élevée
    return Math.max(0, 1 - coefficientOfVariation * 2);
  }

  private calculateEfficiency(fps: number, frameTime: number): number {
    const targetFPS = this.currentMode.settings.frameTarget;
    const targetFrameTime = 1000 / targetFPS;
    
    // Efficience = performance relative à la cible
    const fpsEfficiency = Math.min(fps / targetFPS, 1);
    const timeEfficiency = Math.min(targetFrameTime / frameTime, 1);
    
    return (fpsEfficiency + timeEfficiency) / 2;
  }

  private getCurrentMemoryUsage(): number {
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / memory.totalJSHeapSize;
    }
    return 0.5; // Estimation par défaut
  }

  private estimateCPUUsage(): number {
    // Estimation basée sur la performance des frames
    const recentMetrics = this.performanceMetrics.slice(-10);
    if (recentMetrics.length === 0) return 0.5;
    
    const avgFrameTime = recentMetrics.reduce((sum, m) => sum + m.frameTime, 0) / recentMetrics.length;
    const targetFrameTime = 1000 / this.currentMode.settings.frameTarget;
    
    return Math.min(avgFrameTime / targetFrameTime, 1);
  }

  private recordMetrics(metrics: PerformanceMetrics): void {
    this.performanceMetrics.push(metrics);
    
    // Garder seulement les 1000 dernières métriques
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics.shift();
    }
    
    // Déclencher adaptation si nécessaire
    this.checkForAdaptation(metrics);
    
    // Mettre à jour le modèle prédictif
    this.updatePredictiveModel(metrics);
  }

  private checkForAdaptation(metrics: PerformanceMetrics): void {
    const now = Date.now();
    
    // Éviter les adaptations trop fréquentes
    if (now - this.lastOptimization < 2000) return;
    
    // Conditions d'urgence
    if (metrics.fps < 15 || metrics.memoryUsage > 0.95) {
      this.triggerEmergencyMode();
      return;
    }
    
    // Adaptation normale
    if (metrics.fps < this.currentMode.settings.frameTarget * 0.8 ||
        metrics.memoryUsage > this.currentMode.settings.memoryLimit) {
      this.adaptModeToConditions();
      this.lastOptimization = now;
    }
  }

  private triggerEmergencyMode(): void {
    if (this.emergencyMode) return;
    
    this.emergencyMode = true;
    const emergencyMode = this.availableModes[4]; // Emergency mode
    this.switchToMode(emergencyMode);
    
    // Programmer la sortie du mode d'urgence
    setTimeout(() => {
      this.emergencyMode = false;
      this.selectOptimalMode();
    }, 10000); // 10 secondes
  }

  private startContinuousMonitoring(): void {
    // Monitoring périodique
    setInterval(() => {
      if (!this.monitoringActive) return;
      
      // Vérifier la pression mémoire
      this.deviceProfile.memory.pressure = this.testMemoryPressure();
      
      // Vérifier les changements de batterie
      this.checkBatteryStatus();
      
      // Nettoyer le cache si nécessaire
      this.cleanupCache();
      
      // Adaptation si nécessaire
      this.adaptModeToConditions();
      
    }, 5000); // Toutes les 5 secondes
  }

  private checkBatteryStatus(): void {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const oldLevel = this.deviceProfile.battery.level;
        const newLevel = battery.level;
        
        // Si la batterie a chuté significativement
        if (oldLevel - newLevel > 0.1) {
          this.deviceProfile.battery.level = newLevel;
          this.adaptModeToConditions();
        }
      });
    }
  }

  /**
   * 4. SYSTÈME DE CACHE INTELLIGENT MULTI-NIVEAU
   */
  private initializeAdaptiveCache(): void {
    const memoryLimit = this.deviceProfile.memory.estimated * 0.1; // 10% de la mémoire
    
    this.adaptiveCache = {
      profiles: new Map(),
      assets: new Map(),
      computations: new Map(),
      maxSize: memoryLimit * 1024 * 1024, // Convertir en bytes
      currentSize: 0,
      hits: 0,
      misses: 0
    };
  }

  public cacheProfile(key: string, profile: any): void {
    const size = this.estimateObjectSize(profile);
    
    if (this.adaptiveCache.currentSize + size > this.adaptiveCache.maxSize) {
      this.evictLeastUsed();
    }
    
    this.adaptiveCache.profiles.set(key, {
      data: profile,
      size,
      lastAccess: Date.now(),
      accessCount: 0
    });
    
    this.adaptiveCache.currentSize += size;
  }

  public getCachedProfile(key: string): any {
    const cached = this.adaptiveCache.profiles.get(key);
    
    if (cached) {
      cached.lastAccess = Date.now();
      cached.accessCount++;
      this.adaptiveCache.hits++;
      return cached.data;
    }
    
    this.adaptiveCache.misses++;
    return null;
  }

  private estimateObjectSize(obj: any): number {
    // Estimation simple de la taille d'un objet
    return JSON.stringify(obj).length * 2; // Approximation
  }

  private evictLeastUsed(): void {
    // Stratégie LRU pour les profils
    let oldestTime = Date.now();
    let oldestKey = '';
    
    this.adaptiveCache.profiles.forEach((value, key) => {
      if (value.lastAccess < oldestTime) {
        oldestTime = value.lastAccess;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      const removed = this.adaptiveCache.profiles.get(oldestKey);
      this.adaptiveCache.profiles.delete(oldestKey);
      this.adaptiveCache.currentSize -= removed?.size || 0;
    }
  }

  private adjustCacheToMode(mode: PerformanceMode): void {
    const targetSize = this.deviceProfile.memory.estimated * mode.settings.memoryLimit * 0.1;
    this.adaptiveCache.maxSize = targetSize * 1024 * 1024;
    
    // Réduire le cache si nécessaire
    while (this.adaptiveCache.currentSize > this.adaptiveCache.maxSize) {
      this.evictLeastUsed();
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10 minutes
    
    // Nettoyer les entrées anciennes
    this.adaptiveCache.profiles.forEach((value, key) => {
      if (now - value.lastAccess > maxAge) {
        this.adaptiveCache.profiles.delete(key);
        this.adaptiveCache.currentSize -= value.size;
      }
    });
  }

  /**
   * 5. OPTIMISATIONS CONTEXTUELLES AVANCÉES
   */
  public optimizeForContext(context: string): any {
    const optimizations: any = {};
    
    switch (context) {
      case 'animation':
        optimizations.maxParticles = Math.floor(this.currentMode.settings.maxParticles * 0.8);
        optimizations.frameTarget = Math.min(this.currentMode.settings.frameTarget, 30);
        break;
        
      case 'interaction':
        optimizations.responsiveness = 'high';
        optimizations.frameTarget = Math.max(this.currentMode.settings.frameTarget, 45);
        break;
        
      case 'background':
        optimizations.maxParticles = Math.floor(this.currentMode.settings.maxParticles * 0.3);
        optimizations.frameTarget = 15;
        break;
        
      case 'focus':
        optimizations.quality = Math.min(this.currentMode.settings.animationQuality * 1.2, 1.0);
        break;
    }
    
    return optimizations;
  }

  public preloadForContext(context: string): void {
    // Préchargement intelligent basé sur le contexte
    const predictions = this.predictiveModel.contextPredictions.get(context) || [];
    
    predictions.forEach(asset => {
      if (!this.adaptiveCache.assets.has(asset)) {
        this.preloadAsset(asset);
      }
    });
  }

  private preloadAsset(asset: string): void {
    // Logique de préchargement selon le type d'asset
    // Simulé ici
    this.adaptiveCache.assets.set(asset, {
      status: 'loading',
      timestamp: Date.now()
    });
  }

  /**
   * 6. INTELLIGENCE PRÉDICTIVE ET APPRENTISSAGE
   */
  private initializePredictiveModel(): void {
    this.predictiveModel = {
      usagePatterns: new Map(),
      performanceHistory: [],
      contextPredictions: new Map(),
      learningRate: 0.1,
      confidence: 0.5
    };
  }

  private updatePredictiveModel(metrics: PerformanceMetrics): void {
    // Ajouter aux données historiques
    this.predictiveModel.performanceHistory.push(metrics);
    
    // Garder seulement les 500 dernières métriques
    if (this.predictiveModel.performanceHistory.length > 500) {
      this.predictiveModel.performanceHistory.shift();
    }
    
    // Analyser les patterns
    this.analyzeUsagePatterns();
    
    // Mettre à jour les prédictions
    this.updateContextPredictions();
  }

  private analyzeUsagePatterns(): void {
    const history = this.predictiveModel.performanceHistory;
    if (history.length < 50) return;
    
    // Analyser les patterns temporels
    const hour = new Date().getHours();
    const hourlyMetrics = history.filter(m => 
      new Date(m.timestamp).getHours() === hour
    );
    
    if (hourlyMetrics.length > 0) {
      const avgFPS = hourlyMetrics.reduce((sum, m) => sum + m.fps, 0) / hourlyMetrics.length;
      const avgMemory = hourlyMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / hourlyMetrics.length;
      
      const pattern = this.predictiveModel.usagePatterns.get(hour.toString()) || [];
      pattern.push(avgFPS, avgMemory);
      
      // Garder seulement les 10 derniers patterns
      if (pattern.length > 20) pattern.splice(0, 2);
      
      this.predictiveModel.usagePatterns.set(hour.toString(), pattern);
    }
  }

  private updateContextPredictions(): void {
    // Mise à jour des prédictions basées sur l'apprentissage
    const recentMetrics = this.predictiveModel.performanceHistory.slice(-20);
    
    if (recentMetrics.length > 0) {
      const avgEfficiency = recentMetrics.reduce((sum, m) => sum + m.efficiency, 0) / recentMetrics.length;
      
      // Ajuster la confiance du modèle
      if (avgEfficiency > 0.8) {
        this.predictiveModel.confidence = Math.min(1.0, this.predictiveModel.confidence + 0.01);
      } else {
        this.predictiveModel.confidence = Math.max(0.1, this.predictiveModel.confidence - 0.01);
      }
    }
  }

  public predictOptimalSettings(futureContext: string): any {
    const patterns = this.predictiveModel.usagePatterns.get(futureContext);
    if (!patterns || patterns.length < 4) {
      return this.currentMode.settings; // Fallback
    }
    
    // Prédiction simple basée sur les patterns
    const recentFPS = patterns.slice(-2, -1)[0];
    const recentMemory = patterns.slice(-1)[0];
    
    const predictedSettings = { ...this.currentMode.settings };
    
    // Ajustements prédictifs
    if (recentFPS < 30) {
      predictedSettings.maxParticles = Math.floor(predictedSettings.maxParticles * 0.7);
      predictedSettings.animationQuality *= 0.8;
    }
    
    if (recentMemory > 0.8) {
      predictedSettings.memoryLimit = Math.min(recentMemory - 0.1, predictedSettings.memoryLimit);
    }
    
    return predictedSettings;
  }

  /**
   * MÉTHODES PUBLIQUES PRINCIPALES
   */
  public getCurrentMetrics(): PerformanceMetrics {
    if (this.performanceMetrics.length === 0) {
      return {
        fps: 60,
        frameTime: 16.67,
        memoryUsage: 0.5,
        cpuUsage: 0.5,
        gpuUsage: 0.5,
        renderTime: 16.67,
        stability: 1.0,
        efficiency: 1.0,
        timestamp: Date.now()
      };
    }
    
    return this.performanceMetrics[this.performanceMetrics.length - 1];
  }

  public getDeviceProfile(): DeviceProfile {
    return { ...this.deviceProfile };
  }

  public getCurrentMode(): PerformanceMode {
    return { ...this.currentMode };
  }

  public getAvailableModes(): PerformanceMode[] {
    return [...this.availableModes];
  }

  public setMode(modeName: string): boolean {
    const mode = this.availableModes.find(m => m.name === modeName);
    if (mode) {
      this.switchToMode(mode);
      return true;
    }
    return false;
  }

  public registerAdaptationCallback(id: string, callback: Function): void {
    this.adaptationCallbacks.set(id, callback);
  }

  public unregisterAdaptationCallback(id: string): void {
    this.adaptationCallbacks.delete(id);
  }

  public getCacheStatistics(): any {
    return {
      totalSize: this.adaptiveCache.currentSize,
      maxSize: this.adaptiveCache.maxSize,
      profileCount: this.adaptiveCache.profiles.size,
      assetCount: this.adaptiveCache.assets.size,
      hitRate: this.adaptiveCache.hits / (this.adaptiveCache.hits + this.adaptiveCache.misses),
      efficiency: this.adaptiveCache.currentSize / this.adaptiveCache.maxSize
    };
  }

  public getPerformanceAnalytics(): any {
    const recentMetrics = this.performanceMetrics.slice(-100);
    
    if (recentMetrics.length === 0) {
      return {
        avgFPS: 60,
        avgFrameTime: 16.67,
        avgMemoryUsage: 0.5,
        stability: 1.0,
        efficiency: 1.0,
        adaptationCount: 0
      };
    }
    
    return {
      avgFPS: recentMetrics.reduce((sum, m) => sum + m.fps, 0) / recentMetrics.length,
      avgFrameTime: recentMetrics.reduce((sum, m) => sum + m.frameTime, 0) / recentMetrics.length,
      avgMemoryUsage: recentMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / recentMetrics.length,
      stability: recentMetrics.reduce((sum, m) => sum + m.stability, 0) / recentMetrics.length,
      efficiency: recentMetrics.reduce((sum, m) => sum + m.efficiency, 0) / recentMetrics.length,
      adaptationCount: this.adaptationCallbacks.size,
      predictiveConfidence: this.predictiveModel.confidence
    };
  }

  public optimizeForPlatform(platform?: string): void {
    const targetPlatform = platform || this.deviceProfile.platform;
    
    let optimizations: any = {};
    
    switch (targetPlatform) {
      case 'mobile':
        optimizations = {
          maxParticles: Math.floor(this.currentMode.settings.maxParticles * 0.6),
          animationQuality: this.currentMode.settings.animationQuality * 0.7,
          frameTarget: Math.min(this.currentMode.settings.frameTarget, 30),
          enableShadows: false,
          enablePostProcessing: false
        };
        break;
        
      case 'tablet':
        optimizations = {
          maxParticles: Math.floor(this.currentMode.settings.maxParticles * 0.8),
          animationQuality: this.currentMode.settings.animationQuality * 0.9,
          frameTarget: Math.min(this.currentMode.settings.frameTarget, 45)
        };
        break;
        
      case 'desktop':
        // Aucune restriction particulière
        break;
    }
    
    // Appliquer les optimizations
    Object.assign(this.currentMode.settings, optimizations);
  }

  public forceRecalibration(): void {
    // Recalibrage forcé du profil de l'appareil
    this.initializeDeviceProfile();
    this.selectOptimalMode();
    
    // Vider le cache prédictif
    this.predictiveModel.usagePatterns.clear();
    this.predictiveModel.contextPredictions.clear();
    this.predictiveModel.confidence = 0.5;
  }

  public stopMonitoring(): void {
    this.monitoringActive = false;
  }

  public destroy(): void {
    this.stopMonitoring();
    this.adaptationCallbacks.clear();
    this.adaptiveCache.profiles.clear();
    this.adaptiveCache.assets.clear();
    this.adaptiveCache.computations.clear();
  }
}

export default PerformanceAdaptiveEngine;
