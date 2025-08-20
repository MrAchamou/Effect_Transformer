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

export const storage = new MemStorage();
