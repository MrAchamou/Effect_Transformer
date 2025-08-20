import { type Transformation, type InsertTransformation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createTransformation(transformation: InsertTransformation): Promise<Transformation>;
  getTransformation(id: string): Promise<Transformation | undefined>;
  updateTransformation(id: string, updates: Partial<Transformation>): Promise<Transformation>;
  deleteTransformation(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private transformations: Map<string, Transformation>;

  constructor() {
    this.transformations = new Map();
  }

  async createTransformation(insertTransformation: InsertTransformation): Promise<Transformation> {
    const id = randomUUID();
    const transformation: Transformation = {
      ...insertTransformation,
      id,
      status: "pending",
      errorMessage: null,
      transformedCode: null,
      stats: null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.transformations.set(id, transformation);
    return transformation;
  }

  async getTransformation(id: string): Promise<Transformation | undefined> {
    return this.transformations.get(id);
  }

  async updateTransformation(id: string, updates: Partial<Transformation>): Promise<Transformation> {
    const existing = this.transformations.get(id);
    if (!existing) {
      throw new Error(`Transformation ${id} not found`);
    }

    const updated = { ...existing, ...updates };
    this.transformations.set(id, updated);
    return updated;
  }

  async deleteTransformation(id: string): Promise<void> {
    this.transformations.delete(id);
  }
}

// New implementation based on the provided changes
interface Transformation {
  id: string;
  originalFilename: string;
  originalCode: string;
  transformedCode?: string;
  level: number;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  stats?: any;
  documentation?: any;
  packagePath?: string;
  errorMessage?: string;
  effectAnalysis?: any;
  createdAt: Date;
  completedAt?: Date;
  lastUpdated: Date;
}

export const storage = {
  transformations: new Map<string, Transformation>(),
  maxStorageSize: 100, // Maximum 100 transformations

  createTransformation(data: Partial<Transformation>): Transformation {
    try {
      // Validation des données requises
      if (!data.originalFilename || !data.originalCode) {
        throw new Error('Données de transformation incomplètes');
      }

      if (data.originalCode.length > 10 * 1024 * 1024) { // 10MB max
        throw new Error('Code source trop volumineux');
      }

      const id = crypto.randomUUID();
      const transformation: Transformation = {
        id,
        originalFilename: this.sanitizeFilename(data.originalFilename),
        originalCode: data.originalCode,
        level: Math.max(1, Math.min(6, data.level || 1)),
        status: 'uploaded',
        effectAnalysis: data.effectAnalysis || null,
        createdAt: new Date(),
        lastUpdated: new Date()
      };

      // Nettoyage automatique si limite atteinte
      if (this.transformations.size >= this.maxStorageSize) {
        this.cleanupOldTransformations();
      }

      this.transformations.set(id, transformation);
      console.log(`Transformation créée: ${id} (${transformation.originalFilename})`);
      return transformation;

    } catch (error) {
      console.error('Erreur création transformation:', error);
      throw error;
    }
  },

  getTransformation(id: string): Transformation | null {
    try {
      if (!id || typeof id !== 'string') {
        return null;
      }

      const transformation = this.transformations.get(id);
      if (transformation) {
        // Mise à jour du timestamp d'accès
        transformation.lastUpdated = new Date();
        this.transformations.set(id, transformation);
      }

      return transformation || null;
    } catch (error) {
      console.error('Erreur récupération transformation:', error);
      return null;
    }
  },

  updateTransformation(id: string, updates: Partial<Transformation>): boolean {
    try {
      if (!id || typeof id !== 'string') {
        return false;
      }

      const existing = this.transformations.get(id);
      if (!existing) {
        console.warn(`Transformation non trouvée: ${id}`);
        return false;
      }

      // Validation des mises à jour
      const validatedUpdates: Partial<Transformation> = {
        ...updates,
        lastUpdated: new Date()
      };

      if (updates.status && !['uploaded', 'processing', 'completed', 'failed'].includes(updates.status)) {
        console.warn(`Status invalide: ${updates.status}`);
        return false;
      }

      if (updates.level && (updates.level < 1 || updates.level > 6)) {
        console.warn(`Niveau invalide: ${updates.level}`);
        validatedUpdates.level = Math.max(1, Math.min(6, updates.level));
      }

      const updatedTransformation = { ...existing, ...validatedUpdates };
      this.transformations.set(id, updatedTransformation);

      console.log(`Transformation mise à jour: ${id} (status: ${updatedTransformation.status})`);
      return true;

    } catch (error) {
      console.error('Erreur mise à jour transformation:', error);
      return false;
    }
  },

  get(id: string): Transformation | null {
    return this.getTransformation(id);
  },

  deleteTransformation(id: string): boolean {
    try {
      const result = this.transformations.delete(id);
      if (result) {
        console.log(`Transformation supprimée: ${id}`);
      }
      return result;
    } catch (error) {
      console.error('Erreur suppression transformation:', error);
      return false;
    }
  },

  getAllTransformations(): Transformation[] {
    try {
      return Array.from(this.transformations.values())
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Erreur récupération transformations:', error);
      return [];
    }
  },

  getStats(): { total: number; completed: number; failed: number; processing: number } {
    try {
      const transformations = this.getAllTransformations();
      return {
        total: transformations.length,
        completed: transformations.filter(t => t.status === 'completed').length,
        failed: transformations.filter(t => t.status === 'failed').length,
        processing: transformations.filter(t => t.status === 'processing').length
      };
    } catch (error) {
      console.error('Erreur calcul statistiques:', error);
      return { total: 0, completed: 0, failed: 0, processing: 0 };
    }
  },

  private cleanupOldTransformations(): void {
    try {
      const transformations = this.getAllTransformations();
      const toDelete = transformations.slice(this.maxStorageSize - 10); // Garder les 90 plus récentes

      toDelete.forEach(t => {
        this.transformations.delete(t.id);
      });

      console.log(`Nettoyage: ${toDelete.length} transformations supprimées`);
    } catch (error) {
      console.error('Erreur nettoyage:', error);
    }
  },

  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-_]/g, '_')
      .substring(0, 100);
  }
};