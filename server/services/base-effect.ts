
/**
 * Classe de base pour tous les effets
 * Fournit la structure standard et les méthodes communes
 */

export interface EffectConfig {
  id: string;
  name: string;
  category: string;
  version: string;
  performance?: string;
  parameters?: Record<string, any>;
}

export class BaseEffect {
  protected config: EffectConfig;
  protected isInitialized: boolean = false;
  protected lastUpdate: number = 0;
  protected _cache: Map<string, any> = new Map();
  protected _perfMonitor = { updates: 0, renders: 0 };

  constructor(config: EffectConfig) {
    this.config = this.sanitizeConfig(config);
  }

  protected sanitizeConfig(config: any): EffectConfig {
    if (typeof config !== 'object' || config === null) {
      throw new Error('Configuration invalide');
    }

    // Nettoyer les propriétés dangereuses
    const clean = { ...config };
    delete clean.__proto__;
    delete clean.constructor;

    // Valider les propriétés requises
    if (!clean.id || !clean.name) {
      throw new Error('ID et nom requis');
    }

    return clean;
  }

  init(): this {
    this.isInitialized = true;
    this.lastUpdate = performance.now();
    return this;
  }

  update(deltaTime: number, context?: any): this {
    if (!this.isInitialized) return this;
    
    try {
      this._perfMonitor.updates++;
      this.performUpdate(deltaTime, context);
      this.lastUpdate = performance.now();
    } catch (error) {
      console.warn(`Erreur update effet ${this.config.id}:`, error);
    }
    
    return this;
  }

  render(context?: any): this {
    if (!this.isInitialized) return this;
    
    try {
      this._perfMonitor.renders++;
      return this.performRender(context);
    } catch (error) {
      console.warn(`Erreur render effet ${this.config.id}:`, error);
      return this;
    }
  }

  protected performUpdate(deltaTime: number, context?: any): void {
    // À implémenter par les classes filles
  }

  protected performRender(context?: any): this {
    // À implémenter par les classes filles
    return this;
  }

  getConfig(): EffectConfig {
    return { ...this.config };
  }

  getPerformanceStats() {
    return { ...this._perfMonitor };
  }

  dispose(): void {
    this.isInitialized = false;
    this._cache.clear();
    this._perfMonitor = { updates: 0, renders: 0 };
  }
}

export default BaseEffect;
