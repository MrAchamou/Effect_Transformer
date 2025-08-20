import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transformations = pgTable("transformations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalFilename: text("original_filename").notNull(),
  originalCode: text("original_code").notNull(),
  transformedCode: text("transformed_code"),
  level: integer("level").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  errorMessage: text("error_message"),
  stats: json("stats"), // performance improvements, module count, etc.
  effectAnalysis: json("effect_analysis"), // Analyse intelligente de l'effet
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertTransformationSchema = createInsertSchema(transformations).pick({
  originalFilename: true,
  originalCode: true,
  level: true,
  effectAnalysis: true,
});

export type InsertTransformation = z.infer<typeof insertTransformationSchema>;
export type Transformation = typeof transformations.$inferSelect;

// Validation schemas
export const uploadFileSchema = z.object({
  filename: z.string().min(1).endsWith('.js'),
  content: z.string().min(1),
});

export const transformRequestSchema = z.object({
  transformationId: z.string(),
  level: z.number().min(1).max(3),
});
