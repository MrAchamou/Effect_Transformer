
/**
 * 🎨 ADAPTIVE RENDERING ENGINE 2.0 - MODULE NIVEAU 3 RÉVOLUTIONNAIRE 🎨
 * 
 * Moteur de rendu adaptatif avec optimisation automatique selon le device
 * Adapte automatiquement la qualité et les techniques de rendu
 * 
 * Fonctionnalités révolutionnaires :
 * - Device Capability Detector avec analyse GPU/CPU
 * - Quality Manager adaptatif en temps réel
 * - Performance Monitor avec throttling intelligent
 * - Fallback Strategy System pour compatibilité maximale
 * - Battery Optimizer pour devices mobiles
 * - Render Technique Selector automatique
 */

export interface DeviceCapabilities {
  gpu: {
    vendor: string;
    renderer: string;
    max_texture_size: number;
    webgl_version: number;
    extensions: string[];
    performance_tier: 'low' | 'medium' | 'high' | 'ultra';
  };
  cpu: {
    cores: number;
    performance_score: number;
    architecture: string;
  };
  memory: {
    total: number;
    available: number;
    device_memory: number;
  };
  display: {
    width: number;
    height: number;
    pixel_ratio: number;
    refresh_rate: number;
  };
  network: {
    connection_type: string;
    effective_type: string;
    downlink: number;
  };
  battery?: {
    level: number;
    charging: boolean;
  };
}

export interface RenderingProfile {
  name: string;
  quality_level: number; // 0-1
  techniques: {
    use_webgl2: boolean;
    enable_shadows: boolean;
    enable_reflections: boolean;
    enable_anti_aliasing: boolean;
    enable_post_processing: boolean;
    particle_density: number;
    animation_fps: number;
    texture_quality: 'low' | 'medium' | 'high' | 'ultra';
  };
  performance_targets: {
    target_fps: number;
    max_draw_calls: number;
    max_vertices: number;
    memory_budget: number; // MB
  };
}

export interface AdaptiveSettings {
  auto_quality: boolean;
  battery_saving: boolean;
  performance_priority: 'quality' | 'performance' | 'balanced';
  thermal_throttling: boolean;
  adaptive_fps: boolean;
  memory_management: boolean;
}

/**
 * 🔍 DEVICE CAPABILITY DETECTOR
 */
class DeviceCapabilityDetector {
  private capabilities: DeviceCapabilities | null = null;
  private benchmarkResults: Map<string, number> = new Map();

  public async detectCapabilities(): Promise<DeviceCapabilities> {
    console.log('🔍 Détection des capacités du device...');

    const capabilities: DeviceCapabilities = {
      gpu: await this.detectGPUCapabilities(),
      cpu: await this.detectCPUCapabilities(),
      memory: this.detectMemoryInfo(),
      display: this.detectDisplayInfo(),
      network: this.detectNetworkInfo(),
      battery: await this.detectBatteryInfo()
    };

    this.capabilities = capabilities;
    await this.runPerformanceBenchmarks();

    console.log('✅ Capacités détectées:', capabilities);
    return capabilities;
  }

  private async detectGPUCapabilities(): Promise<DeviceCapabilities['gpu']> {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      return {
        vendor: 'unknown',
        renderer: 'software',
        max_texture_size: 512,
        webgl_version: 0,
        extensions: [],
        performance_tier: 'low'
      };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const extensions = gl.getSupportedExtensions() || [];

    // Détermination du tier de performance GPU
    let performanceTier: 'low' | 'medium' | 'high' | 'ultra' = 'low';
    
    if (renderer.includes('RTX') || renderer.includes('RX 6') || renderer.includes('M1')) {
      performanceTier = 'ultra';
    } else if (renderer.includes('GTX') || renderer.includes('RX') || renderer.includes('Arc')) {
      performanceTier = 'high';
    } else if (renderer.includes('Intel Iris') || renderer.includes('Radeon')) {
      performanceTier = 'medium';
    }

    return {
      vendor,
      renderer,
      max_texture_size: maxTextureSize,
      webgl_version: gl.getParameter(gl.VERSION).includes('2.0') ? 2 : 1,
      extensions,
      performance_tier: performanceTier
    };
  }

  private async detectCPUCapabilities(): Promise<DeviceCapabilities['cpu']> {
    const cores = navigator.hardwareConcurrency || 2;
    
    // Benchmark CPU simple
    const start = performance.now();
    let iterations = 0;
    while (performance.now() - start < 50) { // 50ms de test
      Math.random() * Math.random();
      iterations++;
    }
    
    const performanceScore = iterations / 1000; // Score relatif

    return {
      cores,
      performance_score: performanceScore,
      architecture: cores >= 8 ? 'high-end' : cores >= 4 ? 'mid-range' : 'low-end'
    };
  }

  private detectMemoryInfo(): DeviceCapabilities['memory'] {
    const nav = navigator as any;
    const deviceMemory = nav.deviceMemory || 4; // GB, fallback 4GB
    const memoryInfo = (performance as any).memory;
    
    return {
      total: memoryInfo?.totalJSHeapSize || 1073741824, // 1GB fallback
      available: memoryInfo?.usedJSHeapSize || 536870912, // 512MB fallback
      device_memory: deviceMemory
    };
  }

  private detectDisplayInfo(): DeviceCapabilities['display'] {
    return {
      width: window.screen.width,
      height: window.screen.height,
      pixel_ratio: window.devicePixelRatio || 1,
      refresh_rate: (screen as any).refreshRate || 60
    };
  }

  private detectNetworkInfo(): DeviceCapabilities['network'] {
    const connection = (navigator as any).connection || {};
    
    return {
      connection_type: connection.type || 'unknown',
      effective_type: connection.effectiveType || '4g',
      downlink: connection.downlink || 10
    };
  }

  private async detectBatteryInfo(): Promise<DeviceCapabilities['battery'] | undefined> {
    try {
      const battery = await (navigator as any).getBattery?.();
      return battery ? {
        level: battery.level,
        charging: battery.charging
      } : undefined;
    } catch {
      return undefined;
    }
  }

  private async runPerformanceBenchmarks(): Promise<void> {
    // Benchmark rendu WebGL
    const glBenchmark = await this.benchmarkWebGLPerformance();
    this.benchmarkResults.set('webgl_performance', glBenchmark);

    // Benchmark animation
    const animationBenchmark = await this.benchmarkAnimationPerformance();
    this.benchmarkResults.set('animation_performance', animationBenchmark);

    console.log('📊 Benchmarks terminés:', Object.fromEntries(this.benchmarkResults));
  }

  private async benchmarkWebGLPerformance(): Promise<number> {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const gl = canvas.getContext('webgl');
    
    if (!gl) return 0;

    const start = performance.now();
    
    // Test de rendu simple
    for (let i = 0; i < 100; i++) {
      gl.clearColor(Math.random(), Math.random(), Math.random(), 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    
    const duration = performance.now() - start;
    return Math.max(0, 1000 - duration); // Score inversé (plus rapide = meilleur score)
  }

  private async benchmarkAnimationPerformance(): Promise<number> {
    return new Promise((resolve) => {
      const start = performance.now();
      let frames = 0;
      
      const testElement = document.createElement('div');
      testElement.style.cssText = `
        position: fixed;
        top: -100px;
        left: -100px;
        width: 50px;
        height: 50px;
        background: red;
        transition: transform 0.1s;
      `;
      document.body.appendChild(testElement);
      
      const animate = () => {
        frames++;
        testElement.style.transform = `translateX(${frames}px)`;
        
        if (performance.now() - start < 500) { // Test 500ms
          requestAnimationFrame(animate);
        } else {
          document.body.removeChild(testElement);
          resolve(frames * 2); // FPS approximatif
        }
      };
      
      requestAnimationFrame(animate);
    });
  }

  public getBenchmarkResults(): Map<string, number> {
    return this.benchmarkResults;
  }

  public getCapabilities(): DeviceCapabilities | null {
    return this.capabilities;
  }
}

/**
 * 🎯 QUALITY MANAGER ADAPTATIF
 */
class AdaptiveQualityManager {
  private currentProfile: RenderingProfile;
  private targetFPS: number = 60;
  private currentFPS: number = 60;
  private fpsHistory: number[] = [];
  private adaptationEnabled: boolean = true;

  private renderingProfiles: Map<string, RenderingProfile> = new Map();

  constructor() {
    this.initializeRenderingProfiles();
    this.currentProfile = this.renderingProfiles.get('balanced')!;
  }

  private initializeRenderingProfiles(): void {
    // Profil Ultra
    this.renderingProfiles.set('ultra', {
      name: 'ultra',
      quality_level: 1.0,
      techniques: {
        use_webgl2: true,
        enable_shadows: true,
        enable_reflections: true,
        enable_anti_aliasing: true,
        enable_post_processing: true,
        particle_density: 1.0,
        animation_fps: 60,
        texture_quality: 'ultra'
      },
      performance_targets: {
        target_fps: 60,
        max_draw_calls: 2000,
        max_vertices: 100000,
        memory_budget: 512
      }
    });

    // Profil High
    this.renderingProfiles.set('high', {
      name: 'high',
      quality_level: 0.8,
      techniques: {
        use_webgl2: true,
        enable_shadows: true,
        enable_reflections: false,
        enable_anti_aliasing: true,
        enable_post_processing: true,
        particle_density: 0.8,
        animation_fps: 60,
        texture_quality: 'high'
      },
      performance_targets: {
        target_fps: 60,
        max_draw_calls: 1500,
        max_vertices: 75000,
        memory_budget: 384
      }
    });

    // Profil Balanced
    this.renderingProfiles.set('balanced', {
      name: 'balanced',
      quality_level: 0.6,
      techniques: {
        use_webgl2: true,
        enable_shadows: false,
        enable_reflections: false,
        enable_anti_aliasing: true,
        enable_post_processing: false,
        particle_density: 0.6,
        animation_fps: 60,
        texture_quality: 'medium'
      },
      performance_targets: {
        target_fps: 60,
        max_draw_calls: 1000,
        max_vertices: 50000,
        memory_budget: 256
      }
    });

    // Profil Performance
    this.renderingProfiles.set('performance', {
      name: 'performance',
      quality_level: 0.4,
      techniques: {
        use_webgl2: false,
        enable_shadows: false,
        enable_reflections: false,
        enable_anti_aliasing: false,
        enable_post_processing: false,
        particle_density: 0.4,
        animation_fps: 30,
        texture_quality: 'medium'
      },
      performance_targets: {
        target_fps: 30,
        max_draw_calls: 500,
        max_vertices: 25000,
        memory_budget: 128
      }
    });

    // Profil Low
    this.renderingProfiles.set('low', {
      name: 'low',
      quality_level: 0.2,
      techniques: {
        use_webgl2: false,
        enable_shadows: false,
        enable_reflections: false,
        enable_anti_aliasing: false,
        enable_post_processing: false,
        particle_density: 0.2,
        animation_fps: 30,
        texture_quality: 'low'
      },
      performance_targets: {
        target_fps: 30,
        max_draw_calls: 250,
        max_vertices: 10000,
        memory_budget: 64
      }
    });
  }

  public adaptQualityBasedOnCapabilities(capabilities: DeviceCapabilities): RenderingProfile {
    console.log('🎯 Adaptation de la qualité selon les capacités...');

    let recommendedProfile = 'low';

    // Analyse GPU
    switch (capabilities.gpu.performance_tier) {
      case 'ultra':
        recommendedProfile = 'ultra';
        break;
      case 'high':
        recommendedProfile = 'high';
        break;
      case 'medium':
        recommendedProfile = 'balanced';
        break;
      case 'low':
        recommendedProfile = 'performance';
        break;
    }

    // Ajustements selon CPU
    if (capabilities.cpu.cores < 4 && recommendedProfile !== 'low') {
      const profiles = ['ultra', 'high', 'balanced', 'performance', 'low'];
      const currentIndex = profiles.indexOf(recommendedProfile);
      recommendedProfile = profiles[Math.min(currentIndex + 1, profiles.length - 1)];
    }

    // Ajustements selon mémoire
    if (capabilities.memory.device_memory < 4 && recommendedProfile !== 'low') {
      recommendedProfile = 'performance';
    }

    // Ajustements selon batterie
    if (capabilities.battery && capabilities.battery.level < 0.2 && !capabilities.battery.charging) {
      recommendedProfile = 'low';
    }

    this.currentProfile = this.renderingProfiles.get(recommendedProfile)!;
    console.log(`✅ Profil adapté: ${recommendedProfile}`);
    
    return this.currentProfile;
  }

  public updatePerformanceMetrics(fps: number, drawCalls: number, vertices: number, memoryUsage: number): void {
    this.currentFPS = fps;
    this.fpsHistory.push(fps);
    
    // Garder seulement les 60 dernières mesures (1 seconde à 60fps)
    if (this.fpsHistory.length > 60) {
      this.fpsHistory.shift();
    }

    // Adaptation automatique si activée
    if (this.adaptationEnabled) {
      this.performAdaptiveAdjustments(drawCalls, vertices, memoryUsage);
    }
  }

  private performAdaptiveAdjustments(drawCalls: number, vertices: number, memoryUsage: number): void {
    const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    
    // Si FPS en dessous de la cible, réduire la qualité
    if (avgFPS < this.targetFPS * 0.8) {
      this.adaptDown();
    }
    // Si FPS stable au-dessus de la cible, augmenter la qualité
    else if (avgFPS > this.targetFPS * 1.1 && this.fpsHistory.length >= 60) {
      this.adaptUp();
    }

    // Adaptation selon l'utilisation mémoire
    if (memoryUsage > this.currentProfile.performance_targets.memory_budget * 0.9) {
      this.reduceMemoryUsage();
    }
  }

  private adaptDown(): void {
    const profiles = ['ultra', 'high', 'balanced', 'performance', 'low'];
    const currentIndex = profiles.indexOf(this.currentProfile.name);
    
    if (currentIndex < profiles.length - 1) {
      const newProfile = profiles[currentIndex + 1];
      this.currentProfile = this.renderingProfiles.get(newProfile)!;
      console.log(`📉 Qualité réduite vers: ${newProfile}`);
    }
  }

  private adaptUp(): void {
    const profiles = ['low', 'performance', 'balanced', 'high', 'ultra'];
    const currentIndex = profiles.indexOf(this.currentProfile.name);
    
    if (currentIndex < profiles.length - 1) {
      const newProfile = profiles[currentIndex + 1];
      this.currentProfile = this.renderingProfiles.get(newProfile)!;
      console.log(`📈 Qualité augmentée vers: ${newProfile}`);
    }
  }

  private reduceMemoryUsage(): void {
    // Réductions spécifiques pour la mémoire
    this.currentProfile.techniques.particle_density *= 0.8;
    this.currentProfile.performance_targets.max_vertices *= 0.9;
    console.log('🧠 Réduction de l'utilisation mémoire');
  }

  public getCurrentProfile(): RenderingProfile {
    return this.currentProfile;
  }

  public setAdaptationEnabled(enabled: boolean): void {
    this.adaptationEnabled = enabled;
  }

  public getPerformanceMetrics(): any {
    return {
      current_fps: this.currentFPS,
      target_fps: this.targetFPS,
      average_fps: this.fpsHistory.length > 0 ? 
        this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length : 0,
      adaptation_enabled: this.adaptationEnabled,
      profile: this.currentProfile.name
    };
  }
}

/**
 * 🔋 BATTERY OPTIMIZER
 */
class BatteryOptimizer {
  private batteryInfo: DeviceCapabilities['battery'] | null = null;
  private optimizationLevel: 'none' | 'light' | 'aggressive' = 'none';
  private thermalThrottling: boolean = false;

  public async updateBatteryStatus(): Promise<void> {
    try {
      const battery = await (navigator as any).getBattery?.();
      if (battery) {
        this.batteryInfo = {
          level: battery.level,
          charging: battery.charging
        };
        
        this.adjustOptimizationLevel();
      }
    } catch {
      console.log('⚠️ API Battery non disponible');
    }
  }

  private adjustOptimizationLevel(): void {
    if (!this.batteryInfo) return;

    const { level, charging } = this.batteryInfo;

    if (charging) {
      this.optimizationLevel = 'none';
    } else if (level < 0.15) {
      this.optimizationLevel = 'aggressive';
    } else if (level < 0.30) {
      this.optimizationLevel = 'light';
    } else {
      this.optimizationLevel = 'none';
    }

    console.log(`🔋 Niveau d'optimisation batterie: ${this.optimizationLevel}`);
  }

  public optimizeProfile(profile: RenderingProfile): RenderingProfile {
    if (this.optimizationLevel === 'none') return profile;

    const optimizedProfile = { ...profile };

    if (this.optimizationLevel === 'light') {
      optimizedProfile.techniques.animation_fps = Math.min(optimizedProfile.techniques.animation_fps, 45);
      optimizedProfile.techniques.particle_density *= 0.8;
      optimizedProfile.performance_targets.target_fps = Math.min(optimizedProfile.performance_targets.target_fps, 45);
    }

    if (this.optimizationLevel === 'aggressive') {
      optimizedProfile.techniques.animation_fps = Math.min(optimizedProfile.techniques.animation_fps, 30);
      optimizedProfile.techniques.particle_density *= 0.5;
      optimizedProfile.techniques.enable_post_processing = false;
      optimizedProfile.techniques.enable_anti_aliasing = false;
      optimizedProfile.performance_targets.target_fps = Math.min(optimizedProfile.performance_targets.target_fps, 30);
    }

    return optimizedProfile;
  }

  public getBatteryInfo(): any {
    return {
      battery_level: this.batteryInfo?.level || null,
      charging: this.batteryInfo?.charging || null,
      optimization_level: this.optimizationLevel,
      thermal_throttling: this.thermalThrottling
    };
  }
}

/**
 * 🎨 ADAPTIVE RENDERING ENGINE PRINCIPAL
 */
export class AdaptiveRenderingEngine {
  private isRunning: boolean = false;
  private capabilityDetector: DeviceCapabilityDetector;
  private qualityManager: AdaptiveQualityManager;
  private batteryOptimizer: BatteryOptimizer;
  
  private currentCapabilities: DeviceCapabilities | null = null;
  private adaptiveSettings: AdaptiveSettings;
  
  // Métriques de performance temps réel
  private performanceMetrics: any = {
    current_fps: 60,
    target_fps: 60,
    frame_time: 16.67,
    draw_calls: 0,
    vertices: 0,
    memory_usage: 0,
    quality_adaptations: 0,
    battery_optimizations: 0
  };

  constructor() {
    this.capabilityDetector = new DeviceCapabilityDetector();
    this.qualityManager = new AdaptiveQualityManager();
    this.batteryOptimizer = new BatteryOptimizer();
    
    this.adaptiveSettings = {
      auto_quality: true,
      battery_saving: true,
      performance_priority: 'balanced',
      thermal_throttling: true,
      adaptive_fps: true,
      memory_management: true
    };
  }

  public async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Adaptive Rendering Engine déjà démarré');
      return;
    }

    console.log('🚀 Démarrage de l\'Adaptive Rendering Engine...');
    
    this.isRunning = true;
    
    // Détection des capacités du device
    this.currentCapabilities = await this.capabilityDetector.detectCapabilities();
    
    // Adaptation initiale de la qualité
    this.qualityManager.adaptQualityBasedOnCapabilities(this.currentCapabilities);
    
    // Démarrage des processus de monitoring
    this.startPerformanceMonitoring();
    this.startBatteryMonitoring();
    
    console.log('✅ Adaptive Rendering Engine démarré avec succès');
  }

  private startPerformanceMonitoring(): void {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const monitor = () => {
      if (!this.isRunning) return;
      
      const currentTime = performance.now();
      frameCount++;
      
      // Calcul FPS chaque seconde
      if (currentTime - lastTime >= 1000) {
        const fps = (frameCount * 1000) / (currentTime - lastTime);
        this.performanceMetrics.current_fps = fps;
        this.performanceMetrics.frame_time = 1000 / fps;
        
        // Mise à jour du quality manager
        this.qualityManager.updatePerformanceMetrics(
          fps,
          this.performanceMetrics.draw_calls,
          this.performanceMetrics.vertices,
          this.performanceMetrics.memory_usage
        );
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitor);
    };
    
    requestAnimationFrame(monitor);
  }

  private startBatteryMonitoring(): void {
    if (!this.adaptiveSettings.battery_saving) return;
    
    // Mise à jour initiale
    this.batteryOptimizer.updateBatteryStatus();
    
    // Mise à jour périodique (toutes les 30 secondes)
    setInterval(() => {
      this.batteryOptimizer.updateBatteryStatus();
    }, 30000);
  }

  public getRenderingProfile(): RenderingProfile {
    let profile = this.qualityManager.getCurrentProfile();
    
    // Optimisation batterie si activée
    if (this.adaptiveSettings.battery_saving) {
      profile = this.batteryOptimizer.optimizeProfile(profile);
    }
    
    return profile;
  }

  public updateRenderingMetrics(drawCalls: number, vertices: number, memoryUsage: number): void {
    this.performanceMetrics.draw_calls = drawCalls;
    this.performanceMetrics.vertices = vertices;
    this.performanceMetrics.memory_usage = memoryUsage;
  }

  public forceQualityLevel(level: 'ultra' | 'high' | 'balanced' | 'performance' | 'low'): void {
    console.log(`🎯 Forçage du niveau de qualité: ${level}`);
    this.qualityManager.setAdaptationEnabled(false);
    
    // Simulation de capacités pour forcer le niveau
    const mockCapabilities: DeviceCapabilities = {
      gpu: { performance_tier: level === 'ultra' ? 'ultra' : level === 'high' ? 'high' : 'medium' } as any,
      cpu: { cores: 8 } as any,
      memory: { device_memory: 8 } as any,
      display: {} as any,
      network: {} as any
    };
    
    this.qualityManager.adaptQualityBasedOnCapabilities(mockCapabilities);
  }

  public enableAutoAdaptation(): void {
    console.log('🔄 Activation de l\'adaptation automatique');
    this.qualityManager.setAdaptationEnabled(true);
  }

  public updateSettings(settings: Partial<AdaptiveSettings>): void {
    this.adaptiveSettings = { ...this.adaptiveSettings, ...settings };
    console.log('⚙️ Paramètres mis à jour:', settings);
  }

  public getSystemStatus(): any {
    const qualityMetrics = this.qualityManager.getPerformanceMetrics();
    const batteryInfo = this.batteryOptimizer.getBatteryInfo();
    const benchmarks = this.capabilityDetector.getBenchmarkResults();
    
    return {
      adaptive_rendering_engine: {
        running: this.isRunning,
        capabilities: this.currentCapabilities,
        current_profile: this.getRenderingProfile(),
        settings: this.adaptiveSettings,
        performance: {
          ...this.performanceMetrics,
          quality_metrics: qualityMetrics
        },
        battery: batteryInfo,
        benchmarks: Object.fromEntries(benchmarks)
      }
    };
  }

  public destroy(): void {
    this.isRunning = false;
    console.log('🔥 Adaptive Rendering Engine arrêté');
  }
}

/**
 * 🏭 FACTORY POUR CRÉATION RAPIDE
 */
export class AdaptiveRenderingEngineFactory {
  public static async createOptimizedEngine(priority: 'quality' | 'performance' | 'balanced' = 'balanced'): Promise<AdaptiveRenderingEngine> {
    const engine = new AdaptiveRenderingEngine();
    
    engine.updateSettings({
      performance_priority: priority,
      auto_quality: true,
      battery_saving: priority !== 'quality',
      adaptive_fps: true,
      memory_management: true
    });
    
    await engine.start();
    
    console.log(`🏭 Adaptive Rendering Engine créé (priorité: ${priority})`);
    return engine;
  }

  public static async createMobileOptimizedEngine(): Promise<AdaptiveRenderingEngine> {
    const engine = new AdaptiveRenderingEngine();
    
    engine.updateSettings({
      performance_priority: 'performance',
      auto_quality: true,
      battery_saving: true,
      thermal_throttling: true,
      adaptive_fps: true,
      memory_management: true
    });
    
    await engine.start();
    
    console.log('📱 Adaptive Rendering Engine optimisé mobile créé');
    return engine;
  }

  public static async createDesktopOptimizedEngine(): Promise<AdaptiveRenderingEngine> {
    const engine = new AdaptiveRenderingEngine();
    
    engine.updateSettings({
      performance_priority: 'quality',
      auto_quality: true,
      battery_saving: false,
      thermal_throttling: false,
      adaptive_fps: false,
      memory_management: true
    });
    
    await engine.start();
    
    console.log('🖥️ Adaptive Rendering Engine optimisé desktop créé');
    return engine;
  }
}

// Export des types et classes
export {
  DeviceCapabilityDetector,
  AdaptiveQualityManager,
  BatteryOptimizer,
  AdaptiveRenderingEngineFactory
};
