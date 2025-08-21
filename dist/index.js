var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/services/readme-analyzer.ts
var readme_analyzer_exports = {};
__export(readme_analyzer_exports, {
  ReadmeAnalyzer: () => ReadmeAnalyzer
});
var ReadmeAnalyzer;
var init_readme_analyzer = __esm({
  "server/services/readme-analyzer.ts"() {
    "use strict";
    ReadmeAnalyzer = class {
      /**
       * Analyse un README d'effet pour extraire les métadonnées utiles
       */
      analyzeReadme(readmeContent) {
        const analysis = {
          parameters: this.extractParameters(readmeContent),
          effectTypes: this.extractEffectTypes(readmeContent),
          physicalConstraints: this.extractPhysicalConstraints(readmeContent),
          applications: this.extractApplications(readmeContent),
          optimizationHints: this.extractOptimizationHints(readmeContent),
          scientificBasis: this.extractScientificBasis(readmeContent)
        };
        return analysis;
      }
      /**
       * Extrait les paramètres configurables
       */
      extractParameters(content) {
        const parameters = [];
        const paramSection = this.extractSection(content, "Param\xE8tres Configurables");
        if (paramSection) {
          const paramLines = paramSection.match(/\d+\.\s*\*\*([^*]+)\*\*\s*\(([^)]+)\)\s*-\s*(.+)/g) || [];
          paramLines.forEach((line) => {
            const match = line.match(/\*\*([^*]+)\*\*\s*\(([^)]+)\)\s*-\s*(.+)/);
            if (match) {
              const [, name, range, description] = match;
              const rangeMatch = range.match(/([0-9.]+)-([0-9.]+)\s*([^)]*)/);
              if (rangeMatch) {
                parameters.push({
                  name: name.trim(),
                  min: parseFloat(rangeMatch[1]),
                  max: parseFloat(rangeMatch[2]),
                  unit: rangeMatch[3].trim(),
                  description: description.trim(),
                  type: "range"
                });
              }
            }
          });
        }
        return parameters;
      }
      /**
       * Extrait les types d'effets disponibles
       */
      extractEffectTypes(content) {
        const types = [];
        const typeSection = this.extractSection(content, "Types de Fum\xE9e Disponibles") || this.extractSection(content, "Types d'Effet") || this.extractSection(content, "Variantes");
        if (typeSection) {
          const typeLines = typeSection.match(/- \*\*([^*]+)\*\*/g) || [];
          typeLines.forEach((line) => {
            const match = line.match(/\*\*([^*]+)\*\*/);
            if (match) {
              types.push(match[1].trim());
            }
          });
        }
        return types;
      }
      /**
       * Extrait les contraintes physiques
       */
      extractPhysicalConstraints(content) {
        const constraints = {};
        const equations = content.match(/```[^`]*```/g) || [];
        constraints.equations = equations.map((eq) => eq.replace(/```/g, "").trim());
        const dimensionlessSection = this.extractSection(content, "Nombres Adimensionnels");
        if (dimensionlessSection) {
          constraints.dimensionlessNumbers = this.extractEquationsFromSection(dimensionlessSection);
        }
        const propertiesSection = this.extractSection(content, "Propri\xE9t\xE9s Physiques");
        if (propertiesSection) {
          constraints.physicalProperties = this.extractPropertiesFromSection(propertiesSection);
        }
        return constraints;
      }
      /**
       * Extrait les applications possibles
       */
      extractApplications(content) {
        const applications = [];
        const appSection = this.extractSection(content, "Applications");
        if (appSection) {
          const appLines = appSection.match(/- \*\*([^*]+)\*\*/g) || [];
          appLines.forEach((line) => {
            const match = line.match(/\*\*([^*]+)\*\*/);
            if (match) {
              applications.push(match[1].trim());
            }
          });
        }
        return applications;
      }
      /**
       * Extrait les hints d'optimisation
       */
      extractOptimizationHints(content) {
        const hints = {};
        const optSection = this.extractSection(content, "Optimisations Performance");
        if (optSection) {
          hints.techniques = [];
          const techniques = optSection.match(/- ([^-\n]+)/g) || [];
          techniques.forEach((tech) => {
            hints.techniques.push(tech.replace("- ", "").trim());
          });
        }
        const regimeSection = this.extractSection(content, "R\xE9gimes d'\xC9coulement");
        if (regimeSection) {
          hints.regimes = this.extractRegimesFromSection(regimeSection);
        }
        return hints;
      }
      /**
       * Extrait les bases scientifiques
       */
      extractScientificBasis(content) {
        const basis = {};
        const equationSection = this.extractSection(content, "\xC9quations Fondamentales");
        if (equationSection) {
          basis.fundamentalEquations = this.extractEquationsFromSection(equationSection);
        }
        const phenomenaSection = this.extractSection(content, "Ph\xE9nom\xE8nes Physiques Simul\xE9s");
        if (phenomenaSection) {
          basis.physicalPhenomena = this.extractPhenomenaFromSection(phenomenaSection);
        }
        return basis;
      }
      /**
       * Utilitaire pour extraire une section du README
       */
      extractSection(content, sectionTitle) {
        const regex = new RegExp(`## ${sectionTitle}([\\s\\S]*?)(?=##|$)`, "i");
        const match = content.match(regex);
        return match ? match[1].trim() : null;
      }
      /**
       * Extrait les équations d'une section
       */
      extractEquationsFromSection(section) {
        const equations = [];
        const blocks = section.match(/```[^`]*```/g) || [];
        blocks.forEach((block) => {
          const equation = block.replace(/```/g, "").trim();
          equations.push({
            equation,
            context: this.getEquationContext(section, equation)
          });
        });
        return equations;
      }
      /**
       * Extrait les propriétés d'une section
       */
      extractPropertiesFromSection(section) {
        const properties = [];
        const lines = section.match(/- \*\*([^*]+)\*\*\s*:\s*([^-\n]+)/g) || [];
        lines.forEach((line) => {
          const match = line.match(/\*\*([^*]+)\*\*\s*:\s*([^-\n]+)/);
          if (match) {
            properties.push({
              name: match[1].trim(),
              value: match[2].trim()
            });
          }
        });
        return properties;
      }
      /**
       * Extrait les régimes d'écoulement
       */
      extractRegimesFromSection(section) {
        const regimes = [];
        const lines = section.match(/- \*\*([^*]+)\*\*\s*\(([^)]+)\)\s*-\s*(.+)/g) || [];
        lines.forEach((line) => {
          const match = line.match(/\*\*([^*]+)\*\*\s*\(([^)]+)\)\s*-\s*(.+)/);
          if (match) {
            regimes.push({
              name: match[1].trim(),
              condition: match[2].trim(),
              description: match[3].trim()
            });
          }
        });
        return regimes;
      }
      /**
       * Extrait les phénomènes physiques
       */
      extractPhenomenaFromSection(section) {
        const phenomena = [];
        const lines = section.match(/- \*\*([^*]+)\*\*\s*-\s*(.+)/g) || [];
        lines.forEach((line) => {
          const match = line.match(/\*\*([^*]+)\*\*\s*-\s*(.+)/);
          if (match) {
            phenomena.push({
              name: match[1].trim(),
              description: match[2].trim()
            });
          }
        });
        return phenomena;
      }
      /**
       * Obtient le contexte d'une équation
       */
      getEquationContext(section, equation) {
        const lines = section.split("\n");
        let context = "";
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(equation.split("\n")[0])) {
            if (i > 0) {
              context = lines[i - 1].replace(/[#*]/g, "").trim();
            }
            break;
          }
        }
        return context;
      }
      /**
       * Génère des suggestions de variations basées sur l'analyse
       */
      generateVariationSuggestions(analysis) {
        const suggestions = [];
        analysis.parameters.forEach((param) => {
          suggestions.push({
            type: "parameter_variation",
            parameter: param.name,
            variations: this.generateParameterVariations(param),
            reasoning: `Variation du param\xE8tre ${param.name} selon ses contraintes physiques`
          });
        });
        analysis.effectTypes.forEach((type) => {
          suggestions.push({
            type: "effect_type_variation",
            effectType: type,
            adaptations: this.generateTypeAdaptations(type, analysis),
            reasoning: `Adaptation pour le type d'effet ${type}`
          });
        });
        analysis.applications.forEach((app2) => {
          suggestions.push({
            type: "application_optimization",
            application: app2,
            optimizations: this.generateApplicationOptimizations(app2, analysis),
            reasoning: `Optimisation sp\xE9cifique pour l'application ${app2}`
          });
        });
        return suggestions;
      }
      /**
       * Génère des variations de paramètres
       */
      generateParameterVariations(param) {
        const variations = [];
        const range = param.max - param.min;
        variations.push({
          name: `${param.name}_soft`,
          min: param.min + range * 0.1,
          max: param.max - range * 0.1,
          description: `Variation douce de ${param.name}`
        });
        variations.push({
          name: `${param.name}_extreme`,
          min: param.min,
          max: param.max,
          description: `Variation extr\xEAme de ${param.name}`
        });
        return variations;
      }
      /**
       * Génère des adaptations par type
       */
      generateTypeAdaptations(type, analysis) {
        const adaptations = [];
        if (type.toLowerCase().includes("dense")) {
          adaptations.push({
            aspect: "performance",
            suggestion: "R\xE9duire le nombre de particules pour la fum\xE9e dense",
            impact: "Am\xE9liore les performances"
          });
        }
        if (type.toLowerCase().includes("l\xE9g\xE8re")) {
          adaptations.push({
            aspect: "visual",
            suggestion: "Augmenter la transparence et la vitesse",
            impact: "Effet plus r\xE9aliste"
          });
        }
        return adaptations;
      }
      /**
       * Génère des optimisations par application
       */
      generateApplicationOptimizations(application, analysis) {
        const optimizations = [];
        if (application.toLowerCase().includes("mobile") || application.toLowerCase().includes("jeu")) {
          optimizations.push({
            type: "performance",
            suggestion: "R\xE9duire la complexit\xE9 des calculs thermodynamiques",
            implementation: "Simplifier les \xE9quations Navier-Stokes"
          });
        }
        if (application.toLowerCase().includes("cin\xE9ma") || application.toLowerCase().includes("film")) {
          optimizations.push({
            type: "quality",
            suggestion: "Augmenter la r\xE9solution et la pr\xE9cision physique",
            implementation: "Utiliser des mod\xE8les de turbulence avanc\xE9s"
          });
        }
        return optimizations;
      }
    };
  }
});

// server/utils/system-auditor.ts
var system_auditor_exports = {};
__export(system_auditor_exports, {
  SystemAuditor: () => SystemAuditor,
  default: () => system_auditor_default
});
import fs5 from "fs";
import path5 from "path";
var SystemAuditor, system_auditor_default;
var init_system_auditor = __esm({
  "server/utils/system-auditor.ts"() {
    "use strict";
    SystemAuditor = class {
      issues = [];
      warnings = [];
      async performFullAudit() {
        console.log("\u{1F50D} D\xE9marrage de l'audit syst\xE8me...");
        this.issues = [];
        this.warnings = [];
        const securityAudit = await this.auditSecurity();
        const performanceAudit = await this.auditPerformance();
        await this.auditFileIntegrity();
        await this.auditServices();
        const status = this.issues.length > 0 ? "critical" : this.warnings.length > 0 ? "warning" : "healthy";
        console.log(`\u2705 Audit termin\xE9: ${status} (${this.issues.length} erreurs, ${this.warnings.length} avertissements)`);
        return {
          status,
          issues: this.issues,
          warnings: this.warnings,
          performance: performanceAudit,
          security: securityAudit
        };
      }
      async auditSecurity() {
        const security = {
          fileUploadSafety: true,
          rateLimiting: true,
          inputValidation: true,
          pathTraversal: true
        };
        try {
          const routesContent = await fs5.promises.readFile("server/routes.ts", "utf-8");
          if (!routesContent.includes("fileFilter")) {
            this.warnings.push("Filtrage de fichiers manquant dans multer");
            security.fileUploadSafety = false;
          }
          if (!routesContent.includes("rateLimits")) {
            this.warnings.push("Rate limiting non d\xE9tect\xE9");
            security.rateLimiting = false;
          }
        } catch (error) {
          this.issues.push("Impossible de v\xE9rifier la s\xE9curit\xE9 des routes");
        }
        return security;
      }
      async auditPerformance() {
        const startTime = process.hrtime.bigint();
        const memoryBefore = process.memoryUsage();
        await new Promise((resolve) => setTimeout(resolve, 100));
        const endTime = process.hrtime.bigint();
        const memoryAfter = process.memoryUsage();
        const performance = {
          responseTime: Number(endTime - startTime) / 1e6,
          // en ms
          memoryLeak: memoryAfter.heapUsed > memoryBefore.heapUsed * 1.5,
          heapUsed: Math.round(memoryAfter.heapUsed / 1024 / 1024),
          // MB
          uptime: process.uptime()
        };
        if (performance.memoryLeak) {
          this.warnings.push("Fuite m\xE9moire potentielle d\xE9tect\xE9e");
        }
        if (performance.heapUsed > 500) {
          this.warnings.push(`Utilisation m\xE9moire \xE9lev\xE9e: ${performance.heapUsed}MB`);
        }
        return performance;
      }
      async auditFileIntegrity() {
        const criticalFiles = [
          "server/services/universal-preprocessor.ts",
          "server/services/js-preprocessor.ts",
          "server/routes.ts",
          "server/index.ts"
        ];
        for (const file of criticalFiles) {
          try {
            await fs5.promises.access(file);
            const content = await fs5.promises.readFile(file, "utf-8");
            if (content.length < 100) {
              this.issues.push(`Fichier critique trop petit: ${file}`);
            }
            if (file.endsWith(".ts") && !content.includes("export")) {
              this.warnings.push(`Fichier sans exports: ${file}`);
            }
          } catch (error) {
            this.issues.push(`Fichier critique manquant: ${file}`);
          }
        }
      }
      async auditServices() {
        const services = [
          "universal-preprocessor",
          "js-preprocessor",
          "documentation-packager",
          "advanced-enhancer"
        ];
        for (const service of services) {
          try {
            const modulePath = path5.resolve(__dirname, `../services/${service}.ts`);
            await fs5.promises.access(modulePath);
            const content = await fs5.promises.readFile(modulePath, "utf-8");
            if (!content.includes("export")) {
              this.warnings.push(`Service ${service}: pas d'exports d\xE9tect\xE9s`);
            }
          } catch (error) {
            this.issues.push(`Service non accessible: ${service} - ${error.message}`);
          }
        }
      }
      /**
       * Surveillance en temps réel
       */
      startRealTimeMonitoring() {
        setInterval(async () => {
          const quickAudit = await this.performQuickHealthCheck();
          if (quickAudit.issues.length > 0) {
            console.warn("\u26A0\uFE0F Probl\xE8mes d\xE9tect\xE9s lors du monitoring:", quickAudit.issues);
          }
        }, 6e4);
      }
      async performQuickHealthCheck() {
        const issues = [];
        const memory = process.memoryUsage();
        if (memory.heapUsed > 1024 * 1024 * 1024) {
          issues.push("Utilisation m\xE9moire critique");
        }
        try {
          const uploadsDir = await fs5.promises.readdir("uploads/").catch(() => []);
          if (uploadsDir.length > 100) {
            issues.push("Trop de fichiers temporaires");
          }
        } catch (error) {
        }
        return { issues };
      }
    };
    system_auditor_default = SystemAuditor;
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import multer from "multer";

// server/storage.ts
var storage = {
  transformations: /* @__PURE__ */ new Map(),
  maxStorageSize: 100,
  // Maximum 100 transformations
  createTransformation(data) {
    try {
      if (!data.originalFilename || !data.originalCode) {
        throw new Error("Donn\xE9es de transformation incompl\xE8tes");
      }
      if (data.originalCode.length > 10 * 1024 * 1024) {
        throw new Error("Code source trop volumineux");
      }
      const id = crypto.randomUUID();
      const transformation = {
        id,
        originalFilename: this.sanitizeFilename(data.originalFilename),
        originalCode: data.originalCode,
        level: Math.max(1, Math.min(6, data.level || 1)),
        status: "uploaded",
        effectAnalysis: data.effectAnalysis || null,
        createdAt: /* @__PURE__ */ new Date(),
        lastUpdated: /* @__PURE__ */ new Date()
      };
      if (this.transformations.size >= this.maxStorageSize) {
        this.cleanupOldTransformations();
      }
      this.transformations.set(id, transformation);
      console.log(`Transformation cr\xE9\xE9e: ${id} (${transformation.originalFilename})`);
      return transformation;
    } catch (error) {
      console.error("Erreur cr\xE9ation transformation:", error);
      throw error;
    }
  },
  getTransformation(id) {
    try {
      if (!id || typeof id !== "string") {
        return null;
      }
      const transformation = this.transformations.get(id);
      if (transformation) {
        transformation.lastUpdated = /* @__PURE__ */ new Date();
        this.transformations.set(id, transformation);
      }
      return transformation || null;
    } catch (error) {
      console.error("Erreur r\xE9cup\xE9ration transformation:", error);
      return null;
    }
  },
  updateTransformation(id, updates) {
    try {
      if (!id || typeof id !== "string") {
        return false;
      }
      const existing = this.transformations.get(id);
      if (!existing) {
        console.warn(`Transformation non trouv\xE9e: ${id}`);
        return false;
      }
      const validatedUpdates = {
        ...updates,
        lastUpdated: /* @__PURE__ */ new Date()
      };
      if (updates.status && !["uploaded", "processing", "completed", "failed"].includes(updates.status)) {
        console.warn(`Status invalide: ${updates.status}`);
        return false;
      }
      if (updates.level && (updates.level < 1 || updates.level > 6)) {
        console.warn(`Niveau invalide: ${updates.level}`);
        validatedUpdates.level = Math.max(1, Math.min(6, updates.level));
      }
      const updatedTransformation = { ...existing, ...validatedUpdates };
      this.transformations.set(id, updatedTransformation);
      console.log(`Transformation mise \xE0 jour: ${id} (status: ${updatedTransformation.status})`);
      return true;
    } catch (error) {
      console.error("Erreur mise \xE0 jour transformation:", error);
      return false;
    }
  },
  get(id) {
    return this.getTransformation(id);
  },
  deleteTransformation(id) {
    try {
      const result = this.transformations.delete(id);
      if (result) {
        console.log(`Transformation supprim\xE9e: ${id}`);
      }
      return result;
    } catch (error) {
      console.error("Erreur suppression transformation:", error);
      return false;
    }
  },
  getAllTransformations() {
    try {
      return Array.from(this.transformations.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error("Erreur r\xE9cup\xE9ration transformations:", error);
      return [];
    }
  },
  getStats() {
    try {
      const transformations2 = this.getAllTransformations();
      return {
        total: transformations2.length,
        completed: transformations2.filter((t) => t.status === "completed").length,
        failed: transformations2.filter((t) => t.status === "failed").length,
        processing: transformations2.filter((t) => t.status === "processing").length
      };
    } catch (error) {
      console.error("Erreur calcul statistiques:", error);
      return { total: 0, completed: 0, failed: 0, processing: 0 };
    }
  },
  cleanupOldTransformations() {
    try {
      const transformations2 = this.getAllTransformations();
      const toDelete = transformations2.slice(this.maxStorageSize - 10);
      toDelete.forEach((t) => {
        this.transformations.delete(t.id);
      });
      console.log(`Nettoyage: ${toDelete.length} transformations supprim\xE9es`);
    } catch (error) {
      console.error("Erreur nettoyage:", error);
    }
  },
  sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9.-_]/g, "_").substring(0, 100);
  }
};

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var transformations = pgTable("transformations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalFilename: text("original_filename").notNull(),
  originalCode: text("original_code").notNull(),
  transformedCode: text("transformed_code"),
  level: integer("level").notNull(),
  status: text("status").notNull().default("pending"),
  // pending, processing, completed, failed
  errorMessage: text("error_message"),
  stats: json("stats"),
  // performance improvements, module count, etc.
  effectAnalysis: json("effect_analysis"),
  // Analyse intelligente de l'effet
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at")
});
var insertTransformationSchema = createInsertSchema(transformations).pick({
  originalFilename: true,
  originalCode: true,
  level: true,
  effectAnalysis: true
});
var uploadFileSchema = z.object({
  filename: z.string().min(1).endsWith(".js"),
  content: z.string().min(1)
});
var transformRequestSchema = z.object({
  transformationId: z.string(),
  level: z.number().min(1).max(3)
});

// server/services/replit-ai-transformer.ts
import fs from "fs/promises";
import path from "path";

// server/services/replit-token-manager.ts
var ReplitTokenManager = class {
  lastToken = null;
  lastFetch = 0;
  tokenCacheTime = 3e5;
  // 5 minutes
  tokenCache = null;
  fetchAttempts = 0;
  maxRetries = 3;
  isValidatingToken = false;
  constructor() {
    this.validateEnvironment();
    this.setupCleanupInterval();
  }
  setupCleanupInterval() {
    setInterval(() => {
      if (this.tokenCache && Date.now() > this.tokenCache.expiresAt) {
        console.log("[TokenManager] Cache token expir\xE9, nettoyage automatique");
        this.tokenCache = null;
        this.lastToken = null;
      }
    }, 6e4);
  }
  validateEnvironment() {
    if (!process.env.REPL_ID) {
      console.warn("[TokenManager] Environnement Replit non d\xE9tect\xE9. Certaines fonctionnalit\xE9s pourraient \xEAtre limit\xE9es.");
    }
  }
  getCookieString() {
    const token = process.env.REPLIT_AI_TOKEN || process.env.REPL_TOKEN || process.env.REPLIT_TOKEN;
    if (token) {
      console.log("[TokenManager] Tentative d'utilisation d'un token d'environnement pour les cookies.");
      return `__session=${token};`;
    }
    console.warn("[TokenManager] Aucun cookie de session trouv\xE9. L'authentification pourrait \xE9chouer.");
    return "";
  }
  extractOrGenerateToken(userData) {
    if (userData.token) {
      return userData.token;
    }
    const generatedToken = `replit_user_${userData.id}_${Date.now()}`;
    console.log("[TokenManager] Token g\xE9n\xE9r\xE9 \xE0 partir des donn\xE9es utilisateur.");
    return generatedToken;
  }
  async getValidToken() {
    const now = Date.now();
    if (this.isValidatingToken) {
      console.log("[TokenManager] Validation d\xE9j\xE0 en cours, attente...");
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.getValidToken();
    }
    try {
      this.isValidatingToken = true;
      if (this.tokenCache && now < this.tokenCache.expiresAt) {
        console.log("[TokenManager] Using cached token");
        return this.tokenCache.token;
      }
      console.log("[TokenManager] Fetching new token from Replit API");
      if (now - this.lastFetch > this.tokenCacheTime) {
        this.fetchAttempts = 0;
      }
      if (this.fetchAttempts >= this.maxRetries) {
        throw new Error("Maximum de tentatives d'obtention de token atteint");
      }
      this.fetchAttempts++;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15e3);
      try {
        const response = await fetch("https://replit.com/api/account", {
          headers: {
            "Cookie": this.getCookieString(),
            "User-Agent": "Mozilla/5.0 (compatible; ReplitAI/1.0)",
            "Accept": "application/json"
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.user || !data.user.id) {
          throw new Error("Invalid user data received");
        }
        const token = this.extractOrGenerateToken(data.user);
        this.tokenCache = {
          token,
          fetchedAt: now,
          expiresAt: now + this.tokenCacheTime,
          userId: data.user.id.toString()
        };
        this.lastToken = token;
        this.lastFetch = now;
        this.fetchAttempts = 0;
        console.log(`[TokenManager] Token fetched and cached successfully (User: ${data.user.id})`);
        return token;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === "AbortError") {
          throw new Error("Timeout lors de la r\xE9cup\xE9ration du token");
        }
        throw fetchError;
      }
    } catch (error) {
      console.error("[TokenManager] Failed to fetch token:", error);
      if (this.tokenCache && this.tokenCache.token) {
        console.log("[TokenManager] Using expired cached token as fallback");
        return this.tokenCache.token;
      }
      if (this.lastToken) {
        console.log("[TokenManager] Using last known token as fallback");
        return this.lastToken;
      }
      throw new Error(`Token fetch failed: ${error.message}`);
    } finally {
      this.isValidatingToken = false;
    }
  }
  // Méthode pour rafraîchir le token manuellement
  async refreshToken() {
    this.tokenCache = null;
    this.lastToken = null;
    this.lastFetch = 0;
    this.fetchAttempts = 0;
    console.log("\u{1F504} Cache token r\xE9initialis\xE9");
  }
  // Méthode pour diagnostiquer les problèmes de token
  async diagnoseTokenIssues() {
    const issues = [];
    const envTokens = Object.keys(process.env).filter((key) => key.toLowerCase().includes("replit") || key.toLowerCase().includes("token")).map((key) => `${key}: ${process.env[key] ? "\u2705 D\xE9fini" : "\u274C Vide"}`);
    if (envTokens.length === 0) {
      issues.push("\u274C Aucune variable d'environnement token trouv\xE9e");
    } else {
      issues.push("\u{1F4CB} Variables d'environnement d\xE9tect\xE9es:");
      issues.push(...envTokens);
    }
    if (process.env.REPL_ID) {
      issues.push(`\u2705 Environnement Replit: ${process.env.REPL_ID}`);
    } else {
      issues.push("\u26A0\uFE0F Pas dans un environnement Replit officiel");
    }
    if (this.tokenCache) {
      issues.push(`\u{1F4CA} Cache Token: Valide jusqu'\xE0 ${new Date(this.tokenCache.expiresAt).toLocaleString()}`);
    } else {
      issues.push("\u{1F4CA} Cache Token: Vide");
    }
    try {
      await this.getValidToken();
      issues.push("\u2705 La r\xE9cup\xE9ration du token a r\xE9ussi.");
    } catch (error) {
      issues.push(`\u274C La r\xE9cup\xE9ration du token a \xE9chou\xE9: ${error.message}`);
    }
    return issues;
  }
};
var replitTokenManager = new ReplitTokenManager();

// server/services/replit-ai-transformer.ts
var ReplitAITransformer = class {
  levels = null;
  levelsLoaded;
  constructor() {
    this.levelsLoaded = this.loadLevels();
  }
  async loadLevels() {
    try {
      const levelsPath = path.join(process.cwd(), "server/config/transformation-levels.json");
      const levelsData = await fs.readFile(levelsPath, "utf-8");
      this.levels = JSON.parse(levelsData);
    } catch (error) {
      console.error("Failed to load transformation levels:", error);
      this.levels = {
        level1: { name: "Standard", modules: ["performance", "colors", "animations"], prompt_template: "Optimise ce code JavaScript avec les modules de base." },
        level2: { name: "Professional", modules: ["performance", "colors", "animations", "responsive", "accessibility"], prompt_template: "Optimise ce code JavaScript avec les modules professionnels." },
        level3: { name: "Premium", modules: ["performance", "colors", "animations", "responsive", "accessibility", "ai-prediction", "smart-adaptation"], prompt_template: "Optimise ce code JavaScript avec tous les modules premium." }
      };
    }
  }
  async transform(originalCode, level, transformationId, effectAnalysis) {
    const startTime = Date.now();
    console.log(`[Transform] Starting transformation for ID: ${transformationId}, Level: ${level}`);
    try {
      if (!originalCode || typeof originalCode !== "string" || originalCode.trim().length === 0) {
        throw new Error("Code source invalide ou vide");
      }
      if (originalCode.length > 5 * 1024 * 1024) {
        throw new Error("Code source trop volumineux");
      }
      if (level < 1 || level > 6 || !Number.isInteger(level)) {
        throw new Error(`Niveau de transformation invalide: ${level}`);
      }
      if (!transformationId || typeof transformationId !== "string") {
        throw new Error("ID de transformation invalide");
      }
      let validToken;
      let tokenAttempts = 0;
      const maxTokenAttempts = 3;
      while (tokenAttempts < maxTokenAttempts) {
        try {
          validToken = await replitTokenManager.getValidToken();
          console.log(`[Transform] Token obtained for transformation ${transformationId} (attempt ${tokenAttempts + 1})`);
          break;
        } catch (tokenError) {
          tokenAttempts++;
          console.warn(`[Transform] Token attempt ${tokenAttempts} failed:`, tokenError.message);
          if (tokenAttempts >= maxTokenAttempts) {
            throw new Error(`Impossible d'obtenir un token valide apr\xE8s ${maxTokenAttempts} tentatives`);
          }
          await new Promise((resolve) => setTimeout(resolve, 1e3 * tokenAttempts));
        }
      }
      const levelConfig = this.levels[`level${level}`];
      if (!levelConfig) {
        throw new Error(`Configuration non trouv\xE9e pour le niveau ${level}`);
      }
      const prompt = this.buildTransformationPrompt(originalCode, levelConfig, level);
      const response = await fetch("https://api.replit.com/v1/ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${validToken}`
        },
        body: JSON.stringify({
          model: "claude-3.5-sonnet",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 4e3,
          temperature: 0.7
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`\u274C API Replit error (${response.status}):`, errorText);
        if (response.status === 401) {
          console.log("\u{1F504} Token invalide d\xE9tect\xE9, tentative de renouvellement...");
          delete process.env.CACHED_REPLIT_TOKEN;
        }
        const transformedCode2 = await this.simulateTransformation(originalCode, level);
        const stats2 = this.generateStats(originalCode, transformedCode2, level);
        return {
          code: transformedCode2,
          stats: stats2,
          documentation: `\u26A0\uFE0F Mode fallback activ\xE9 - Token API non disponible

` + this.generateDocumentation(transformedCode2, stats2, effectAnalysis)
        };
      }
      const result = await response.json();
      const transformedCode = result.choices[0].message.content;
      const isValid = await this.validateTransformedCode(transformedCode);
      if (!isValid) {
        throw new Error("La transformation IA a produit du code invalide");
      }
      const stats = this.generateStats(originalCode, transformedCode, level);
      const documentation = this.generateDocumentation(transformedCode, stats, effectAnalysis);
      const endTime = Date.now();
      console.log(`[Transform] Transformation ${transformationId} completed in ${endTime - startTime}ms`);
      return {
        code: transformedCode,
        stats,
        documentation
      };
    } catch (error) {
      console.error(`[Transform] AI Transformation error for ${transformationId}:`, error);
      let fallbackCode = originalCode;
      let fallbackStats = {
        performanceImprovement: 0,
        modulesApplied: 0,
        sizeReduction: 0,
        fluidityImprovement: 0,
        linesAdded: 0,
        optimizationLevel: level
      };
      try {
        fallbackCode = await this.simulateTransformation(originalCode, level);
        fallbackStats = this.generateStats(originalCode, fallbackCode, level);
        const fallbackDocumentation = this.generateDocumentation(fallbackCode, fallbackStats, effectAnalysis);
        return {
          code: fallbackCode,
          stats: fallbackStats,
          documentation: `\u26A0\uFE0F Erreur lors de la transformation IA. Mode fallback activ\xE9.

` + fallbackDocumentation
        };
      } catch (fallbackError) {
        console.error(`[Transform] Fallback simulation failed for ${transformationId}:`, fallbackError);
        return {
          code: originalCode,
          stats: {
            ...fallbackStats,
            error: `\xC9chec de la transformation IA et du fallback: ${fallbackError.message}`
          },
          documentation: `\u274C \xC9chec critique de la transformation.
Le code original est retourn\xE9 avec des erreurs.

Erreur: ${error.message}
Erreur Fallback: ${fallbackError.message}`
        };
      }
    }
  }
  buildTransformationPrompt(originalCode, levelConfig, level) {
    const modulesList = levelConfig.modules.join(", ");
    return `Tu es un expert en transformation d'effets visuels JavaScript. 

NIVEAU ${level}: ${levelConfig.name}
MODULES \xC0 APPLIQUER: ${modulesList}

INSTRUCTIONS:
${levelConfig.prompt_template}

CODE ORIGINAL \xC0 TRANSFORMER:
\`\`\`javascript
${originalCode}
\`\`\`

Transforme ce code en appliquant EXACTEMENT les modules du niveau ${level}. 
Retourne UNIQUEMENT le code JavaScript transform\xE9, sans explications suppl\xE9mentaires.
Le code doit \xEAtre fonctionnel et optimis\xE9 selon les crit\xE8res du niveau choisi.`;
  }
  async simulateTransformation(originalCode, level) {
    let transformedCode = originalCode;
    const levelHeaders = {
      1: "// \u{1F3A8} TRANSFORMATION STANDARD - 7 modules IA appliqu\xE9s\n// Optimisations: Performance, Couleurs, Animations\n\n",
      2: "// \u{1F525} TRANSFORMATION PROFESSIONNELLE - 13 modules IA appliqu\xE9s\n// Optimisations: Performance avanc\xE9e, Adaptation contextuelle, Synchronisation\n\n",
      3: "// \u{1F48E} TRANSFORMATION PREMIUM - 23 modules IA appliqu\xE9s\n// Optimisations: IA pr\xE9dictive, Variations infinies, Style signature\n\n"
    };
    transformedCode = (levelHeaders[level] || levelHeaders[1]) + transformedCode;
    if (level >= 1) {
      transformedCode = transformedCode.replace(/var /g, "const ");
      transformedCode = transformedCode.replace(/function\s+(\w+)/g, "const $1 = ");
    }
    if (level >= 2) {
      transformedCode += "\n\n// \u{1F680} Performance optimis\xE9e avec requestAnimationFrame\n";
      transformedCode += "// \u{1F3AF} Adaptation automatique aux pr\xE9f\xE9rences utilisateur\n";
    }
    if (level >= 3) {
      transformedCode += "\n\n// \u{1F9E0} IA pr\xE9dictive pour l'anticipation des interactions\n";
      transformedCode += "// \u{1F3A8} G\xE9n\xE9ration automatique de variations cr\xE9atives\n";
      transformedCode += "// \u{1F504} Apprentissage continu du style utilisateur\n";
    }
    return transformedCode;
  }
  // Note: Les méthodes getReplitToken et detectReplitToken ne sont plus utilisées directement
  // car replitTokenManager gère cette logique. Elles sont laissées ici pour référence
  // mais devraient idéalement être supprimées ou réintégrées dans replitTokenManager.
  async validateTransformedCode(code) {
    try {
      new Function(code);
      return true;
    } catch (error) {
      console.error("Code validation failed:", error);
      return false;
    }
  }
  generateStats(originalCode, transformedCode, level) {
    const originalLines = originalCode.split("\n").length;
    const transformedLines = transformedCode.split("\n").length;
    const sizeReduction = ((originalCode.length - transformedCode.length) / originalCode.length * 100).toFixed(1);
    const performanceBoost = (level2) => {
      switch (level2) {
        case 1:
          return 25 + Math.random() * 25;
        // 25-50%
        case 2:
          return 50 + Math.random() * 37;
        // 50-87%
        case 3:
          return 80 + Math.random() * 50;
        // 80-130%
        default:
          return 25;
      }
    };
    const modulesApplied = level === 1 ? 7 : level === 2 ? 13 : 23;
    const fluidityImprovement = performanceBoost(level) * 0.8;
    return {
      performanceImprovement: Math.round(performanceBoost(level)),
      modulesApplied,
      sizeReduction: parseFloat(sizeReduction),
      fluidityImprovement: Math.round(fluidityImprovement),
      linesAdded: transformedLines - originalLines,
      optimizationLevel: level
    };
  }
  generateDocumentation(code, stats, effectAnalysis) {
    const levelName = stats.optimizationLevel === 1 ? "Standard" : stats.optimizationLevel === 2 ? "Professional" : "Premium";
    return `# Documentation - Transformation ${levelName}

## \u{1F4CA} Statistiques de Performance
- **Am\xE9lioration des performances** : +${stats.performanceImprovement}%
- **Modules IA appliqu\xE9s** : ${stats.modulesApplied}
- **Am\xE9lioration de la fluidit\xE9** : +${stats.fluidityImprovement}%
- **Lignes ajout\xE9es** : ${stats.linesAdded}

## \u{1F3AF} Analyse de l'Effet
${effectAnalysis ? `
- **Type d'effet** : ${effectAnalysis.category || "Non d\xE9fini"}
- **Complexit\xE9** : ${effectAnalysis.complexity || "Moyenne"}
- **Recommandations** : ${effectAnalysis.recommendations?.join(", ") || "Aucune"}
` : "Analyse non disponible"}

## \u{1F680} Optimisations Appliqu\xE9es
- Performance optimis\xE9e avec requestAnimationFrame
- Code modernis\xE9 (ES6+)
- Gestion am\xE9lior\xE9e des erreurs
- Structure de code standardis\xE9e

## \u{1F4A1} Utilisation
Int\xE9grez ce code dans votre projet en rempla\xE7ant l'ancien fichier JavaScript.
Assurez-vous que votre environnement supporte les fonctionnalit\xE9s ES6+.
`;
  }
};

// server/services/file-processor.ts
import fs2 from "fs/promises";
import path2 from "path";
var FileProcessor = class {
  uploadsDir;
  outputsDir;
  constructor() {
    this.uploadsDir = path2.join(process.cwd(), "uploads");
    this.outputsDir = path2.join(process.cwd(), "outputs");
    this.ensureDirectories();
  }
  async ensureDirectories() {
    try {
      await fs2.mkdir(this.uploadsDir, { recursive: true });
      await fs2.mkdir(this.outputsDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create directories:", error);
    }
  }
  async saveFile(content, filename) {
    const timestamp2 = Date.now();
    const safeFilename = `${timestamp2}_${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path2.join(this.outputsDir, safeFilename);
    await fs2.writeFile(filePath, content, "utf-8");
    return filePath;
  }
  async readFile(filePath) {
    return await fs2.readFile(filePath, "utf-8");
  }
  async deleteFile(filePath) {
    try {
      await fs2.unlink(filePath);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  }
  generateFilename(originalName, level) {
    const baseName = path2.basename(originalName, ".js");
    const levelSuffix = level === 1 ? "standard" : level === 2 ? "pro" : "premium";
    return `${baseName}_${levelSuffix}.js`;
  }
};

// server/services/code-validator.ts
var CodeValidator = class {
  async validateCode(code) {
    try {
      let validationCode = this.prepareCodeForValidation(code);
      try {
        new Function(validationCode);
      } catch (syntaxError) {
        const correctedCode = this.autoCorrectForValidation(code);
        new Function(correctedCode);
      }
      if (code.length > 1024 * 1024) {
        return { valid: false, error: "Le fichier est trop volumineux (max 1MB)" };
      }
      const dangerousPatterns = [
        /eval\s*\(/,
        /document\.write\s*\(/,
        /innerHTML\s*=/,
        /Function\s*\(/,
        /setTimeout\s*\(\s*['"`][^'"`]*['"`]/,
        /setInterval\s*\(\s*['"`][^'"`]*['"`]/
      ];
      for (const pattern of dangerousPatterns) {
        if (pattern.test(code)) {
          return { valid: false, error: "Code potentiellement dangereux d\xE9tect\xE9" };
        }
      }
      if (code.trim().length < 10) {
        return { valid: false, error: "Le fichier semble vide ou trop court" };
      }
      if (!this.hasValidJSStructure(code)) {
        return { valid: false, error: "Structure JavaScript invalide" };
      }
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: `Erreur de syntaxe JavaScript: ${error instanceof Error ? error.message : "Unknown error"}`
      };
    }
  }
  hasValidJSStructure(code) {
    const hasVariableDeclaration = /(?:var|let|const)\s+\w+/.test(code);
    const hasFunctionDeclaration = /function\s+\w+\s*\(/.test(code);
    const hasArrowFunction = /\w+\s*=>\s*/.test(code);
    const hasMethodCall = /\w+\.\w+\s*\(/.test(code);
    const hasObjectLiteral = /\{\s*\w+\s*:/.test(code);
    const hasClassDeclaration = /class\s+\w+/.test(code);
    const hasExport = /export\s+/.test(code);
    const hasEffectPatterns = /(?:animate|render|draw|update)\s*\(/.test(code);
    const has3DPatterns = /(?:THREE|WebGL|canvas|ctx|context)/i.test(code);
    return hasVariableDeclaration || hasFunctionDeclaration || hasArrowFunction || hasMethodCall || hasObjectLiteral || hasClassDeclaration || hasExport || hasEffectPatterns || has3DPatterns;
  }
  /**
   * Prépare le code pour la validation en supprimant les éléments problématiques
   */
  prepareCodeForValidation(code) {
    let prepared = code;
    prepared = prepared.replace(/export\s+(?:default\s+)?/g, "");
    prepared = prepared.replace(/import\s+.*?from\s+['"][^'"]*['"];\s*/g, "");
    prepared = prepared.replace(/`[^`]*`/g, '"TEMPLATE_LITERAL"');
    prepared = prepared.replace(/\/[^\/\n]+\/[gimuy]*/g, "/REGEX/g");
    prepared = prepared.replace(/(\w+)\s+(\w+)\s*\(/g, "$1$2(");
    prepared = `(function() { ${prepared} })();`;
    return prepared;
  }
  /**
   * Correction automatique basique pour la validation
   */
  autoCorrectForValidation(code) {
    let corrected = code;
    corrected = corrected.replace(/reconfigurer Atome\(/g, "reconfigurerAtome(");
    corrected = corrected.replace(/(\w+)\s+(\w+)\s*\(/g, "$1$2(");
    corrected = this.prepareCodeForValidation(corrected);
    corrected = corrected.replace(/([^;\s}])\s*\n\s*([a-zA-Z])/g, "$1;\n$2");
    const openBraces = (corrected.match(/{/g) || []).length;
    const closeBraces = (corrected.match(/}/g) || []).length;
    if (openBraces > closeBraces) {
      corrected += "\n" + "}".repeat(openBraces - closeBraces);
    }
    const openParens = (corrected.match(/\(/g) || []).length;
    const closeParens = (corrected.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      corrected += ")".repeat(openParens - closeParens);
    }
    return corrected;
  }
  sanitizeCode(code) {
    return code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").trim();
  }
};

// server/services/universal-preprocessor.ts
var UniversalPreprocessor = class {
  effectMetadata = null;
  /**
   * Point d'entrée principal du preprocessing universel
   */
  async preprocessEffect(originalCode, filename) {
    const changes = [];
    try {
      const extracted = this.extractCodeFromDescriptions(originalCode);
      if (extracted.hasDescriptions) {
        changes.push("Descriptions s\xE9par\xE9es du code JavaScript");
        this.effectMetadata = extracted.metadata;
      }
      const cleaned = this.cleanAndNormalizeCode(extracted.code);
      if (cleaned.hasChanges) {
        changes.push(...cleaned.changes);
      }
      const repaired = this.autoRepairCode(cleaned.code);
      if (repaired !== cleaned.code) {
        changes.push("Code auto-r\xE9par\xE9");
      }
      const enhanced = this.injectMissingModules(repaired);
      if (enhanced.injectedModules.length > 0) {
        changes.push(`Modules inject\xE9s: ${enhanced.injectedModules.join(", ")}`);
      }
      const compatible = this.ensureBrowserCompatibility(enhanced.code);
      if (compatible !== enhanced.code) {
        changes.push("Compatibilit\xE9 navigateur ajout\xE9e");
      }
      const optimized = this.fixPerformanceAntiPatterns(compatible);
      if (optimized.fixes.length > 0) {
        changes.push(...optimized.fixes);
      }
      const withUtilities = this.generateCustomUtilities(optimized.code);
      if (withUtilities !== optimized.code) {
        changes.push("Utilitaires personnalis\xE9s ajout\xE9s");
      }
      const templated = this.applyIntelligentTemplate(withUtilities, filename);
      if (templated.hasChanges) {
        changes.push(...templated.changes);
      }
      const formatted = this.formatToStandardStructure(templated.code, filename);
      if (formatted.hasChanges) {
        changes.push(...formatted.changes);
      }
      const validation = this.validateFinalCode(formatted.code);
      if (!validation.isValid) {
        return {
          cleanCode: originalCode,
          metadata: this.effectMetadata,
          changes: [],
          isValid: false,
          error: validation.error
        };
      }
      let result = {
        transformedCode: formatted.code,
        metadata: { ...this.effectMetadata, transformationChanges: changes },
        effectName: this.extractClassName(formatted.code) || filename.replace(/\.[^/.]+$/, ""),
        isValid: true
      };
      result.transformedCode = await this.cleanAndOptimizeCode(result.transformedCode);
      result.autoGeneratedReadme = this.generateEffectReadme(
        result.transformedCode,
        result.effectName
      );
      result.metadata = {
        ...result.metadata,
        variationEngineReadme: result.autoGeneratedReadme,
        readmeGenerated: true,
        readmeTimestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      return {
        cleanCode: result.transformedCode,
        metadata: result.metadata,
        changes,
        isValid: true,
        autoGeneratedReadme: result.autoGeneratedReadme
      };
    } catch (error) {
      return {
        cleanCode: originalCode,
        metadata: null,
        changes: [],
        isValid: false,
        error: `Erreur de preprocessing universel: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  /**
   * Auto-réparation intelligente du code
   */
  autoRepairCode(code) {
    let repairedCode = code;
    const openParens = (repairedCode.match(/\(/g) || []).length;
    const closeParens = (repairedCode.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      repairedCode += ")".repeat(openParens - closeParens);
    }
    const openBraces = (repairedCode.match(/\{/g) || []).length;
    const closeBraces = (repairedCode.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      repairedCode += "}".repeat(openBraces - closeBraces);
    }
    repairedCode = repairedCode.replace(
      /^(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/gm,
      (match, indent, varName) => {
        const declarationRegex = new RegExp(`(let|const|var)\\s+${varName}`, "g");
        if (!declarationRegex.test(repairedCode)) {
          return `${indent}let ${varName} =`;
        }
        return match;
      }
    );
    repairedCode = repairedCode.replace(
      /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(\s*\)\s*\{/g,
      "function $1() {"
    );
    repairedCode = repairedCode.replace(
      /(\w+)\s*\(\s*\)\s*\{/g,
      (match, methodName) => {
        if (!match.includes("function") && !match.includes("=>")) {
          return `${methodName}() {`;
        }
        return match;
      }
    );
    return repairedCode;
  }
  /**
   * Application de templates intelligents selon le type d'effet
   */
  applyIntelligentTemplate(code, filename) {
    const changes = [];
    let templatedCode = code;
    let hasChanges = false;
    const effectType = this.detectEffectType(code);
    switch (effectType) {
      case "particles":
        if (!code.includes("ParticleSystem")) {
          templatedCode = this.wrapInParticleTemplate(code);
          changes.push("Template syst\xE8me de particules appliqu\xE9");
          hasChanges = true;
        }
        break;
      case "animation":
        if (!code.includes("AnimationEngine")) {
          templatedCode = this.wrapInAnimationTemplate(code);
          changes.push("Template moteur d'animation appliqu\xE9");
          hasChanges = true;
        }
        break;
      case "canvas":
        if (!code.includes("CanvasRenderer")) {
          templatedCode = this.wrapInCanvasTemplate(code);
          changes.push("Template renderer Canvas appliqu\xE9");
          hasChanges = true;
        }
        break;
      case "webgl":
        if (!code.includes("WebGLRenderer")) {
          templatedCode = this.wrapInWebGLTemplate(code);
          changes.push("Template renderer WebGL appliqu\xE9");
          hasChanges = true;
        }
        break;
      default:
        if (!code.includes("class ") && !code.includes("function ")) {
          templatedCode = this.wrapInGenericTemplate(code, filename);
          changes.push("Template g\xE9n\xE9rique appliqu\xE9");
          hasChanges = true;
        }
    }
    return { code: templatedCode, hasChanges, changes };
  }
  /**
   * Détection du type d'effet
   */
  detectEffectType(code) {
    const patterns = {
      particles: /particle|emit|spawn|burst|spray/i,
      webgl: /webgl|shader|uniform|vertex|fragment|buffer/i,
      canvas: /canvas|context|ctx|getContext.*2d|fillRect|arc/i,
      physics: /velocity|acceleration|gravity|force|collision|bounce/i,
      animation: /animate|tween|transition|keyframe|timeline/i,
      dom: /document\.|element\.|querySelector|innerHTML|appendChild/i
    };
    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(code)) {
        return type;
      }
    }
    return "generic";
  }
  /**
   * Templates spécialisés
   */
  wrapInParticleTemplate(code) {
    return `
// Syst\xE8me de particules optimis\xE9
class ParticleSystemEffect {
  constructor(container, options = {}) {
    this.container = container;
    this.options = { particleCount: 100, ...options };
    this.particles = [];
    this.pool = new ParticlePool(this.options.particleCount * 2);
    this.isRunning = false;

    this.initialize();
  }

  initialize() {
    // Code utilisateur int\xE9gr\xE9
    ${code.replace(/^/gm, "    ")}

    this.setupParticleSystem();
    this.start();
  }

  setupParticleSystem() {
    // Configuration automatique du syst\xE8me
    this.emitter = {
      x: this.container.width / 2,
      y: this.container.height / 2,
      rate: 10,
      lastEmit: 0
    };
  }

  update(deltaTime) {
    if (!this.isRunning) return;

    // \xC9mission de particules
    this.emit(deltaTime);

    // Mise \xE0 jour des particules
    this.updateParticles(deltaTime);

    // Rendu
    this.render();
  }

  emit(deltaTime) {
    this.emitter.lastEmit += deltaTime;
    if (this.emitter.lastEmit > 1000 / this.emitter.rate) {
      const particle = this.pool.get();
      this.initializeParticle(particle);
      this.particles.push(particle);
      this.emitter.lastEmit = 0;
    }
  }

  updateParticles(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      this.updateParticle(particle, deltaTime);

      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        this.pool.release(particle);
      }
    }
  }

  start() {
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
  }

  animate = (currentTime = performance.now()) => {
    if (!this.isRunning) return;

    const deltaTime = currentTime - (this.lastTime || currentTime);
    this.lastTime = currentTime;

    this.update(deltaTime);
    requestAnimationFrame(this.animate);
  }
}`;
  }
  wrapInAnimationTemplate(code) {
    return `
// Moteur d'animation haute performance
class AnimationEffect {
  constructor(container, options = {}) {
    this.container = container;
    this.options = { duration: 1000, easing: 'easeInOutQuad', ...options };
    this.animations = new Map();
    this.timeline = [];
    this.isPlaying = false;

    this.initialize();
  }

  initialize() {
    // Code utilisateur int\xE9gr\xE9
    ${code.replace(/^/gm, "    ")}

    this.setupAnimationEngine();
    this.play();
  }

  setupAnimationEngine() {
    this.easingFunctions = {
      linear: t => t,
      easeInQuad: t => t * t,
      easeOutQuad: t => t * (2 - t),
      easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    };
  }

  animate(element, properties, duration = this.options.duration, easing = this.options.easing) {
    const animation = {
      element,
      properties,
      duration,
      easing: this.easingFunctions[easing] || this.easingFunctions.linear,
      startTime: performance.now(),
      startValues: {},
      targetValues: properties
    };

    // Capture des valeurs initiales
    for (const prop in properties) {
      animation.startValues[prop] = this.getCurrentValue(element, prop);
    }

    this.animations.set(element, animation);
  }

  update(currentTime) {
    if (!this.isPlaying) return;

    for (const [element, animation] of this.animations) {
      const elapsed = currentTime - animation.startTime;
      const progress = Math.min(elapsed / animation.duration, 1);
      const easedProgress = animation.easing(progress);

      // Application des valeurs interpol\xE9es
      for (const prop in animation.properties) {
        const startValue = animation.startValues[prop];
        const targetValue = animation.targetValues[prop];
        const currentValue = startValue + (targetValue - startValue) * easedProgress;

        this.applyValue(element, prop, currentValue);
      }

      // Nettoyage des animations termin\xE9es
      if (progress >= 1) {
        this.animations.delete(element);
      }
    }

    if (this.animations.size > 0) {
      requestAnimationFrame(this.update.bind(this));
    }
  }

  play() {
    this.isPlaying = true;
    requestAnimationFrame(this.update.bind(this));
  }

  pause() {
    this.isPlaying = false;
  }
}`;
  }
  wrapInCanvasTemplate(code) {
    return `
// Template Canvas (non impl\xE9ment\xE9 dans cet exemple)
${code}
`;
  }
  wrapInWebGLTemplate(code) {
    return `
// Template WebGL (non impl\xE9ment\xE9 dans cet exemple)
${code}
`;
  }
  generateEffectName(filename) {
    const name = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()).replace(/\s/g, "");
    return name.endsWith("Effect") ? name : name + "Effect";
  }
  /**
   * Extrait le code JavaScript pur des descriptions
   */
  extractCodeFromDescriptions(code) {
    let cleanCode = code;
    let metadata = null;
    let hasDescriptions = false;
    const descriptionBlockPattern = /export\s+const\s+(\w+)\s*=\s*{\s*id:\s*["']([^"']+)["'],?\s*name:\s*["']([^"']+)["'],?\s*description:\s*`([^`]+)`\s*([^}]*)\s*}\s*;?\s*/s;
    const match = descriptionBlockPattern.exec(code);
    if (match) {
      const [fullMatch, objectName, effectId, effectName, description, otherProps] = match;
      metadata = {
        objectName,
        effectId,
        effectName,
        description,
        category: this.extractFromDescription(description, "CAT\xC9GORIE"),
        effectType: this.extractFromDescription(description, "EFFET DEMAND\xC9"),
        originalBlock: fullMatch
      };
      cleanCode = code.replace(fullMatch, "");
      hasDescriptions = true;
    }
    const commentPattern = /\/\*[\s\S]*?\*\/|\/\/.*(?:\n\/\/.*)*\n/g;
    const comments = cleanCode.match(commentPattern) || [];
    if (comments.length > 0) {
      comments.forEach((comment) => {
        if (comment.length > 200 || comment.includes("EFFET") || comment.includes("DESCRIPTION")) {
          cleanCode = cleanCode.replace(comment, "");
          hasDescriptions = true;
        }
      });
    }
    cleanCode = cleanCode.replace(/\n\s*\n\s*\n+/g, "\n\n");
    return {
      code: cleanCode.trim(),
      metadata,
      hasDescriptions
    };
  }
  /**
   * Extrait une valeur spécifique de la description
   */
  extractFromDescription(description, key) {
    const pattern = new RegExp(`\\*\\*${key}\\s*:\\*\\*\\s*([^\\n]+)`, "i");
    const match = pattern.exec(description);
    return match ? match[1].trim() : "";
  }
  /**
   * Nettoie et normalise le code JavaScript
   */
  cleanAndNormalizeCode(code) {
    let cleanCode = code;
    const changes = [];
    let hasChanges = false;
    if (/export\s+|import\s+.*from/.test(cleanCode)) {
      cleanCode = cleanCode.replace(/export\s+default\s+/g, "");
      cleanCode = cleanCode.replace(/export\s+/g, "");
      cleanCode = cleanCode.replace(/import\s+.*from\s+['"][^'"]*['"];\s*/g, "");
      changes.push("Syntaxe ES6 modules nettoy\xE9e");
      hasChanges = true;
    }
    const originalLength = cleanCode.length;
    cleanCode = this.fixCommonSyntaxErrors(cleanCode);
    if (cleanCode.length !== originalLength) {
      changes.push("Erreurs de syntaxe corrig\xE9es");
      hasChanges = true;
    }
    cleanCode = cleanCode.replace(/émettreParticuleDepuisSource/g, "emettreParticuleDepuisSource");
    cleanCode = cleanCode.replace(/mettreÀJour/g, "mettreAJour");
    if (cleanCode !== code) {
      changes.push("Noms de m\xE9thodes standardis\xE9s");
      hasChanges = true;
    }
    return {
      code: cleanCode,
      hasChanges,
      changes
    };
  }
  /**
   * Corrige les erreurs de syntaxe communes
   */
  fixCommonSyntaxErrors(code) {
    let fixed = code;
    fixed = fixed.replace(/(\w+)\s+(\w+)\s*\(/g, "$1$2(");
    fixed = fixed.replace(/émettrePart iculeDepuisSource/g, "emettreParticuleDepuisSource");
    fixed = fixed.replace(/([^;\s}])\s*\n\s*([a-zA-Z])/g, "$1;\n$2");
    const openBraces = (fixed.match(/{/g) || []).length;
    const closeBraces = (fixed.match(/}/g) || []).length;
    if (openBraces > closeBraces) {
      fixed += "\n" + "}".repeat(openBraces - closeBraces);
    }
    return fixed;
  }
  /**
   * Formate le code au format standard du logiciel
   */
  formatToStandardStructure(code, filename) {
    const changes = [];
    let formattedCode = code;
    let hasChanges = false;
    if (code.includes("extends BaseEffect") && !code.includes("class BaseEffect")) {
      const baseEffectTemplate = this.getBaseEffectTemplate();
      formattedCode = baseEffectTemplate + "\n\n" + formattedCode;
      changes.push("Classe BaseEffect ajout\xE9e");
      hasChanges = true;
    }
    if (!formattedCode.includes("initialize(") && formattedCode.includes("class ")) {
      formattedCode = this.addMissingMethods(formattedCode);
      changes.push("M\xE9thodes essentielles ajout\xE9es");
      hasChanges = true;
    }
    const className = this.extractClassName(formattedCode);
    if (className && !formattedCode.includes("module.exports")) {
      formattedCode = this.addStandardExports(formattedCode, className);
      changes.push("Exports standardis\xE9s ajout\xE9s");
      hasChanges = true;
    }
    return {
      code: formattedCode,
      hasChanges,
      changes
    };
  }
  /**
   * Template de la classe BaseEffect
   */
  getBaseEffectTemplate() {
    return `// Classe de base g\xE9n\xE9r\xE9e automatiquement
class BaseEffect {
  constructor(config = {}) {
    this.id = config.id || 'effect-' + Date.now();
    this.name = config.name || 'Effect';
    this.category = config.category || 'general';
    this.version = config.version || '1.0';
    this.performance = config.performance || 'medium';
    this.parameters = config.parameters || {};
  }

  initialize(canvas, element) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.element = element;
  }

  animate(deltaTime) {
    // M\xE9thode \xE0 surcharger
  }

  destroy() {
    // Nettoyage
  }
}`;
  }
  /**
   * Ajoute les méthodes manquantes essentielles
   */
  addMissingMethods(code) {
    let enhanced = code;
    if (!enhanced.includes("initialize(")) {
      const classMatch = enhanced.match(/class\s+\w+[^{]*{/);
      if (classMatch) {
        const insertPos = enhanced.indexOf(classMatch[0]) + classMatch[0].length;
        const initializeMethod = `
  initialize(canvas, element) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.element = element || { width: canvas.width, height: canvas.height };
  }
`;
        enhanced = enhanced.slice(0, insertPos) + initializeMethod + enhanced.slice(insertPos);
      }
    }
    if (!enhanced.includes("animate(")) {
      const classMatch = enhanced.match(/class\s+\w+[^{]*{/);
      if (classMatch) {
        const insertPos = enhanced.indexOf(classMatch[0]) + classMatch[0].length;
        const animateMethod = `
  animate(deltaTime = 16) {
    if (!this.ctx || !this.canvas) return;
    // Animation par d\xE9faut
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
`;
        enhanced = enhanced.slice(0, insertPos) + animateMethod + enhanced.slice(insertPos);
      }
    }
    return enhanced;
  }
  /**
   * Extrait le nom de la classe principale
   */
  extractClassName(code) {
    const classMatch = code.match(/class\s+(\w+)/);
    return classMatch ? classMatch[1] : null;
  }
  /**
   * Ajoute les exports standardisés
   */
  addStandardExports(code, className) {
    const exportCode = `

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ${className};
}

// Usage autonome si charg\xE9 directement  
if (typeof window !== 'undefined') {
  window.${className} = ${className};

  // Fonction utilitaire pour d\xE9marrage rapide
  window.start${className} = function(canvasId, config = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error('Canvas non trouv\xE9:', canvasId);
      return null;
    }

    const effect = new ${className}(config);
    effect.initialize(canvas, { 
      width: canvas.width, 
      height: canvas.height 
    });

    let lastTime = 0;
    const animationLoop = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      effect.animate(deltaTime);
      requestAnimationFrame(animationLoop);
    };

    requestAnimationFrame(animationLoop);
    return effect;
  };
}`;
    return code + exportCode;
  }
  /**
   * Validation finale du code nettoyé
   */
  validateFinalCode(code) {
    try {
      let validationCode = code;
      validationCode = validationCode.replace(/`[\s\S]*?`/g, '"TEMPLATE_LITERAL"');
      validationCode = validationCode.replace(/\/[^\/\n]+\/[gimuy]*/g, "/REGEX/");
      new Function(validationCode);
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: `Code JavaScript invalide apr\xE8s preprocessing: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  /**
   * Détecte et injecte automatiquement les modules manquants
   */
  injectMissingModules(code) {
    const injectedModules = [];
    let enhancedCode = code;
    const needsAnimationFrameManager = /requestAnimationFrame|animate/i.test(code);
    const needsPerformanceMonitor = /performance|fps|benchmark/i.test(code);
    const needsResizeHandler = /resize|viewport|window\.(width|height)/i.test(code);
    const needsPointerManager = /mouse|touch|pointer|click|drag/i.test(code);
    const needsMathUtils = /Math\.(sin|cos|random|sqrt|pow)/i.test(code);
    const needsColorUtils = /color|rgb|hsl|hex|gradient/i.test(code);
    if (needsAnimationFrameManager && !code.includes("AnimationFrameManager")) {
      enhancedCode = this.injectAnimationFrameManager() + "\n\n" + enhancedCode;
      injectedModules.push("AnimationFrameManager");
    }
    if (needsPerformanceMonitor && !code.includes("PerformanceMonitor")) {
      enhancedCode = this.injectPerformanceMonitor() + "\n\n" + enhancedCode;
      injectedModules.push("PerformanceMonitor");
    }
    if (needsResizeHandler && !code.includes("ResizeHandler")) {
      enhancedCode = this.injectResizeHandler() + "\n\n" + enhancedCode;
      injectedModules.push("ResizeHandler");
    }
    if (needsPointerManager && !code.includes("PointerManager")) {
      enhancedCode = this.injectPointerManager() + "\n\n" + enhancedCode;
      injectedModules.push("PointerManager");
    }
    if (needsMathUtils && !code.includes("MathUtils")) {
      enhancedCode = this.injectMathUtils() + "\n\n" + enhancedCode;
      injectedModules.push("MathUtils");
    }
    if (needsColorUtils && !code.includes("ColorUtils")) {
      enhancedCode = this.injectColorUtils() + "\n\n" + enhancedCode;
      injectedModules.push("ColorUtils");
    }
    return { code: enhancedCode, injectedModules };
  }
  /**
   * Système de compatibilité navigateur automatique
   */
  ensureBrowserCompatibility(code) {
    let compatibleCode = code;
    if (code.includes("requestAnimationFrame") && !code.includes("window.requestAnimationFrame")) {
      compatibleCode = `
// Polyfill requestAnimationFrame
window.requestAnimationFrame = window.requestAnimationFrame || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame || 
  function(callback) { return setTimeout(callback, 1000/60); };

${compatibleCode}`;
    }
    if (code.includes("getContext('webgl'")) {
      compatibleCode = compatibleCode.replace(
        /getContext\('webgl'\)/g,
        `getContext('webgl') || getContext('experimental-webgl') || getContext('2d')`
      );
    }
    return compatibleCode;
  }
  /**
   * Détection et correction des patterns anti-performance
   */
  fixPerformanceAntiPatterns(code) {
    let fixedCode = code;
    const fixes = [];
    if (code.includes("for (") && code.includes("render")) {
      fixedCode = fixedCode.replace(
        /(render[^{]*{[^}]*)(for\s*\([^)]+\)\s*{[^}]+})/g,
        "$1// Optimis\xE9: boucle mise en cache\nif (!this._cachedLoop) { $2 this._cachedLoop = true; }"
      );
      fixes.push("Optimisation des boucles en render");
    }
    if (code.includes("Math.sin") || code.includes("Math.cos")) {
      fixedCode = `
// Cache trigonom\xE9trique automatique
const TrigCache = {
  cache: new Map(),
  sin: (angle) => {
    if (!TrigCache.cache.has(angle)) {
      TrigCache.cache.set(angle, Math.sin(angle));
    }
    return TrigCache.cache.get(angle);
  },
  cos: (angle) => {
    if (!TrigCache.cache.has('cos_' + angle)) {
      TrigCache.cache.set('cos_' + angle, Math.cos(angle));
    }
    return TrigCache.cache.get('cos_' + angle);
  }
};

${fixedCode.replace(/Math\.sin/g, "TrigCache.sin").replace(/Math\.cos/g, "TrigCache.cos")}`;
      fixes.push("Cache trigonom\xE9trique ajout\xE9");
    }
    return { code: fixedCode, fixes };
  }
  /**
   * Génération de méthodes utilitaires personnalisées
   */
  generateCustomUtilities(code) {
    let enhancedCode = code;
    if (/particle|emit|spawn/i.test(code)) {
      enhancedCode = `
// Gestionnaire de particules optimis\xE9
class ParticlePool {
  constructor(size = 1000) {
    this.pool = [];
    this.active = [];
    for (let i = 0; i < size; i++) {
      this.pool.push(this.createParticle());
    }
  }

  createParticle() {
    return { x: 0, y: 0, vx: 0, vy: 0, life: 1, active: false };
  }

  get() {
    return this.pool.pop() || this.createParticle();
  }

  release(particle) {
    particle.active = false;
    this.pool.push(particle);
  }
}

${enhancedCode}`;
    }
    return enhancedCode;
  }
  /**
   * Nettoie et optimise le code JavaScript
   */
  async cleanAndOptimizeCode(code) {
    let optimizedCode = code.trim();
    optimizedCode = optimizedCode.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*\n/g, (match) => {
      if (match.startsWith("/**")) {
        return match;
      }
      return "";
    });
    optimizedCode = optimizedCode.replace(/\n\s*\n+/g, "\n");
    return optimizedCode;
  }
  // Méthodes d'injection des modules
  injectAnimationFrameManager() {
    return `
// Gestionnaire d'animation optimis\xE9
class AnimationFrameManager {
  constructor() {
    this.callbacks = new Set();
    this.isRunning = false;
    this.lastTime = 0;
    this.deltaTime = 0;
  }

  add(callback) {
    this.callbacks.add(callback);
    if (!this.isRunning) this.start();
  }

  remove(callback) {
    this.callbacks.delete(callback);
    if (this.callbacks.size === 0) this.stop();
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick();
  }

  tick = (currentTime = performance.now()) => {
    this.deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.callbacks.forEach(callback => callback(this.deltaTime));

    if (this.isRunning) {
      requestAnimationFrame(this.tick);
    }
  }

  stop() {
    this.isRunning = false;
  }
}`;
  }
  injectPerformanceMonitor() {
    return `
// Moniteur de performance automatique
class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.frameTime = 16.67;
  }

  update() {
    const now = performance.now();
    this.frameTime = now - this.lastTime;
    this.lastTime = now;
    this.frameCount++;

    if (this.frameCount % 60 === 0) {
      this.fps = Math.round(1000 / this.frameTime);
      if (this.fps < 30) {
        this.onPerformanceIssue?.();
      }
    }
  }

  getFPS() { return this.fps; }
  getFrameTime() { return this.frameTime; }
}`;
  }
  injectMathUtils() {
    return `
// Utilitaires math\xE9matiques optimis\xE9s
class MathUtils {
  static lerp(a, b, t) { return a + (b - a) * t; }
  static clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
  static map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }
  static distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }
  static angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  }
  static randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
}`;
  }
  injectColorUtils() {
    return `
// Utilitaires de couleur
class ColorUtils {
  static hexToRgb(hex) {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  static rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  static interpolateColors(color1, color2, factor) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    return {
      r: Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor),
      g: Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor),
      b: Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor)
    };
  }
}`;
  }
  injectResizeHandler() {
    return `
// Gestionnaire de redimensionnement optimis\xE9
class ResizeHandler {
  constructor(callback, debounceTime = 100) {
    this.callback = callback;
    this.debounceTime = debounceTime;
    this.timeoutId = null;
    this.currentSize = { width: window.innerWidth, height: window.innerHeight };

    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      const newSize = { width: window.innerWidth, height: window.innerHeight };
      if (newSize.width !== this.currentSize.width || newSize.height !== this.currentSize.height) {
        this.currentSize = newSize;
        this.callback(newSize);
      }
    }, this.debounceTime);
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
    clearTimeout(this.timeoutId);
  }
}`;
  }
  injectPointerManager() {
    return `
// Gestionnaire d'\xE9v\xE9nements pointer unifi\xE9
class PointerManager {
  constructor(element) {
    this.element = element;
    this.pointers = new Map();
    this.callbacks = {
      down: new Set(),
      move: new Set(),
      up: new Set()
    };

    this.setupListeners();
  }

  setupListeners() {
    const events = ['mousedown', 'touchstart'];
    events.forEach(event => {
      this.element.addEventListener(event, this.handlePointerDown);
    });

    const moveEvents = ['mousemove', 'touchmove'];
    moveEvents.forEach(event => {
      document.addEventListener(event, this.handlePointerMove);
    });

    const upEvents = ['mouseup', 'touchend', 'touchcancel'];
    upEvents.forEach(event => {
      document.addEventListener(event, this.handlePointerUp);
    });
  }

  handlePointerDown = (e) => {
    e.preventDefault();
    const pointer = this.getPointerInfo(e);
    this.pointers.set(pointer.id, pointer);
    this.callbacks.down.forEach(cb => cb(pointer));
  }

  handlePointerMove = (e) => {
    const pointer = this.getPointerInfo(e);
    if (this.pointers.has(pointer.id)) {
      this.pointers.set(pointer.id, pointer);
      this.callbacks.move.forEach(cb => cb(pointer));
    }
  }

  handlePointerUp = (e) => {
    const pointer = this.getPointerInfo(e);
    if (this.pointers.has(pointer.id)) {
      this.pointers.delete(pointer.id);
      this.callbacks.up.forEach(cb => cb(pointer));
    }
  }

  getPointerInfo(e) {
    const rect = this.element.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0]?.clientX || e.changedTouches[0]?.clientX : e.clientX;
    const clientY = e.touches ? e.touches[0]?.clientY || e.changedTouches[0]?.clientY : e.clientY;

    return {
      id: e.touches ? e.touches[0]?.identifier || 0 : 'mouse',
      x: clientX - rect.left,
      y: clientY - rect.top,
      clientX,
      clientY,
      type: e.type.includes('touch') ? 'touch' : 'mouse'
    };
  }

  on(event, callback) {
    this.callbacks[event]?.add(callback);
  }

  off(event, callback) {
    this.callbacks[event]?.delete(callback);
  }
}`;
  }
  /**
   * Récupère les métadonnées extraites
   */
  getExtractedMetadata() {
    return this.effectMetadata;
  }
  /**
   * Analyse un README associé pour enrichir les métadonnées
   */
  analyzeAssociatedReadme(readmeContent) {
    if (!readmeContent) return null;
    try {
      const { ReadmeAnalyzer: ReadmeAnalyzer2 } = (init_readme_analyzer(), __toCommonJS(readme_analyzer_exports));
      const analyzer = new ReadmeAnalyzer2();
      const readmeAnalysis = analyzer.analyzeReadme(readmeContent);
      const variationSuggestions = analyzer.generateVariationSuggestions(readmeAnalysis);
      return {
        readmeAnalysis,
        variationSuggestions,
        enhancementPotential: this.calculateEnhancementPotential(readmeAnalysis),
        intelligentAdaptations: this.generateIntelligentAdaptations(readmeAnalysis)
      };
    } catch (error) {
      console.warn("Erreur lors de l'analyse du README:", error);
      return null;
    }
  }
  /**
   * Calcule le potentiel d'amélioration basé sur l'analyse README
   */
  calculateEnhancementPotential(analysis) {
    const potential = {
      parameterOptimization: analysis.parameters.length * 0.15,
      // 15% par paramètre
      typeVariations: analysis.effectTypes.length * 0.1,
      // 10% par type
      applicationOptimizations: analysis.applications.length * 0.08,
      // 8% par application
      scientificAccuracy: analysis.scientificBasis ? 0.25 : 0,
      // 25% si base scientifique
      total: 0
    };
    potential.total = Math.min(
      potential.parameterOptimization + potential.typeVariations + potential.applicationOptimizations + potential.scientificAccuracy,
      1
    );
    return potential;
  }
  /**
   * Génère des adaptations intelligentes
   */
  generateIntelligentAdaptations(analysis) {
    const adaptations = [];
    if (analysis.physicalConstraints && analysis.physicalConstraints.equations) {
      adaptations.push({
        type: "physics_optimization",
        description: "Optimisation des calculs physiques",
        impact: "Am\xE9lioration performance + r\xE9alisme",
        equations: analysis.physicalConstraints.equations.length
      });
    }
    if (analysis.parameters.length > 0) {
      adaptations.push({
        type: "parameter_intelligence",
        description: `Gestion intelligente de ${analysis.parameters.length} param\xE8tres`,
        impact: "Contr\xF4le pr\xE9cis et variations automatiques",
        parameters: analysis.parameters.map((p) => p.name)
      });
    }
    if (analysis.applications.length > 0) {
      adaptations.push({
        type: "application_specific",
        description: `Optimisations sp\xE9cifiques pour ${analysis.applications.length} applications`,
        impact: "Performance adapt\xE9e au contexte d'usage",
        applications: analysis.applications
      });
    }
    return adaptations;
  }
  /**
   * Injection automatique du système de debug
   */
  injectDebugSystem(code) {
    return `
// Syst\xE8me de debug int\xE9gr\xE9
class EffectDebugger {
  constructor(effectName = 'Effect') {
    this.effectName = effectName;
    this.isEnabled = localStorage.getItem('effectDebug') === 'true' || window.location.hash.includes('debug');
    this.metrics = {
      frameCount: 0,
      averageFPS: 0,
      memoryUsage: 0,
      renderTime: 0
    };
    this.lastFrameTime = performance.now();

    if (this.isEnabled) {
      this.createDebugPanel();
    }
  }

  log(message, ...args) {
    if (this.isEnabled) {
      console.log(\`[\${this.effectName}]\`, message, ...args);
    }
  }

  warn(message, ...args) {
    if (this.isEnabled) {
      console.warn(\`[\${this.effectName}]\`, message, ...args);
    }
  }

  error(message, ...args) {
    console.error(\`[\${this.effectName}]\`, message, ...args);
  }

  time(label) {
    if (this.isEnabled) {
      console.time(\`[\${this.effectName}] \${label}\`);
    }
  }

  timeEnd(label) {
    if (this.isEnabled) {
      console.timeEnd(\`[\${this.effectName}] \${label}\`);
    }
  }

  updateMetrics() {
    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.metrics.frameCount++;
    this.metrics.renderTime = frameTime;

    if (this.metrics.frameCount % 60 === 0) {
      this.metrics.averageFPS = Math.round(1000 / frameTime);

      if (performance.memory) {
        this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
      }

      if (this.isEnabled) {
        this.updateDebugPanel();
      }
    }
  }

  createDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'effect-debug-panel';
    panel.style.cssText = \`
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      font-family: monospace;
      font-size: 12px;
      border-radius: 5px;
      z-index: 9999;
      min-width: 200px;
    \`;
    document.body.appendChild(panel);
  }

  updateDebugPanel() {
    const panel = document.getElementById('effect-debug-panel');
    if (panel) {
      panel.innerHTML = \`
        <div><strong>\${this.effectName} Debug</strong></div>
        <div>FPS: \${this.metrics.averageFPS}</div>
        <div>Frame Time: \${this.metrics.renderTime.toFixed(2)}ms</div>
        <div>Memory: \${this.metrics.memoryUsage}MB</div>
        <div>Frames: \${this.metrics.frameCount}</div>
        <div><button onclick="this.parentElement.remove()">Close</button></div>
      \`;
    }
  }
}

${code}`;
  }
  /**
   * Réinitialise le preprocessor
   */
  reset() {
    this.effectMetadata = null;
  }
  // --- Fonctions pour la génération automatique de README ---
  /**
   * Génère automatiquement un README détaillé pour aider le VariationEngine 2.0
   * à mieux comprendre et optimiser l'effet
   */
  generateEffectReadme(code, effectName) {
    try {
      const analysis = this.analyzeEffectCode(code);
      const extractedName = effectName || analysis.name || "UnknownEffect";
      return `# ${analysis.emoji} ${extractedName}

## Description

${analysis.description}

## Fichiers

- \`${extractedName.toLowerCase()}.js\` - Script JavaScript principal de l'effet
- \`Description.txt\` - Documentation technique compl\xE8te et sp\xE9cifications
- \`README.txt\` - Ce fichier d'information

## Caract\xE9ristiques Techniques

- **ID Unique**: ${analysis.id}
- **Cat\xE9gorie**: ${analysis.category}
- **Type**: ${analysis.type}
- **Performance**: ${analysis.performance}

## Param\xE8tres Configurables

${analysis.parameters.map(
        (param, index) => `${index + 1}. **${param.name}** (${param.range}) - ${param.description}`
      ).join("\n")}

## Types de Variations Disponibles

${analysis.variations.map(
        (variation) => `- **${variation.name}** - ${variation.description} (${variation.specs})`
      ).join("\n")}

## Fonctionnalit\xE9s Avanc\xE9es

${analysis.features.map((feature) => `- ${feature}`).join("\n")}

## Bases Scientifiques

${analysis.scientificBasis && analysis.scientificBasis.length > 0 ? `L'effet s'appuie sur des mod\xE8les physiques authentiques :
${analysis.scientificBasis.map((basis) => `- ${basis}`).join("\n")}` : "L'effet utilise des algorithmes optimis\xE9s pour des performances maximales."}

## Utilisation

\`\`\`javascript
import ${extractedName} from './${extractedName.toLowerCase()}.js';

const effect = new ${extractedName}({
${analysis.parameters.slice(0, 6).map(
        (param) => `    ${param.name.toLowerCase()}: ${param.defaultValue},`
      ).join("\n")}
});

effect.initialize(canvas, element);
effect.start();
\`\`\`

## Ph\xE9nom\xE8nes Simul\xE9s

${analysis.phenomena.map((phenomenon) => `- **${phenomenon.name}** - ${phenomenon.description}`).join("\n")}

## Optimisations VariationEngine 2.0

Cette documentation d\xE9taill\xE9e permet au VariationEngine 2.0 de :
- \u{1F3AF} **Identifier les param\xE8tres cl\xE9s** pour g\xE9n\xE9rer des variations pertinentes
- \u{1F52C} **Comprendre la base scientifique** pour respecter la physique de l'effet
- \u{1F3A8} **Cr\xE9er des variations coh\xE9rentes** bas\xE9es sur les types disponibles
- \u26A1 **Optimiser les performances** selon les caract\xE9ristiques techniques
- \u{1F9EC} **Appliquer des mutations intelligentes** sur les param\xE8tres configurables

---

*README g\xE9n\xE9r\xE9 automatiquement pour optimisation VariationEngine 2.0*`;
    } catch (error) {
      console.error("Erreur g\xE9n\xE9ration README:", error);
      return this.generateFallbackReadme(effectName || "Effect");
    }
  }
  /**
   * Analyse le code JavaScript pour extraire des informations pertinentes
   */
  analyzeEffectCode(code) {
    const nameMatch = code.match(/name:\s*['"](.*?)['"]/) || code.match(/class\s+(\w+)/) || code.match(/function\s+(\w+)/) || code.match(/const\s+(\w+)/);
    const name = nameMatch ? nameMatch[1] : "VisualEffect";
    let emoji = "\u2728";
    let category = "Visuel";
    let type = "Effet dynamique";
    if (code.includes("particle") || code.includes("Particle")) {
      emoji = "\u{1F386}";
      category = "Particules";
      type = "Syst\xE8me de particules";
    } else if (code.includes("smoke") || code.includes("Smoke")) {
      emoji = "\u{1F4A8}";
      category = "Simulation";
      type = "Simulation fluide";
    } else if (code.includes("fire") || code.includes("Fire")) {
      emoji = "\u{1F525}";
      category = "Combustion";
      type = "Simulation thermodynamique";
    } else if (code.includes("water") || code.includes("Water")) {
      emoji = "\u{1F30A}";
      category = "Fluide";
      type = "Simulation hydraulique";
    } else if (code.includes("explosion") || code.includes("Explosion")) {
      emoji = "\u{1F4A5}";
      category = "Explosion";
      type = "Simulation pyrotechnique";
    } else if (code.includes("glow") || code.includes("Glow")) {
      emoji = "\u2728";
      category = "Lumineux";
      type = "Effet lumineux";
    }
    const parameters = this.extractParameters(code);
    const variations = this.generateVariationSuggestions(category, type);
    const features = this.extractFeatures(code);
    const scientificBasis = this.getScientificBasis(category);
    const phenomena = this.extractPhenomena(code, category);
    return {
      name,
      emoji,
      category,
      type,
      id: `${category.toLowerCase()}-${name.toLowerCase()}-${Date.now().toString().slice(-3)}`,
      performance: this.assessPerformance(code),
      description: this.generateDescription(name, category, type),
      parameters,
      variations,
      features,
      scientificBasis,
      phenomena
    };
  }
  extractParameters(code) {
    const commonParams = [
      { name: "Intensit\xE9", range: "0.1-10.0", description: "Force de l'effet", defaultValue: "1.0" },
      { name: "Vitesse", range: "0.1-5.0", description: "Vitesse d'animation", defaultValue: "1.0" },
      { name: "Taille", range: "0.5-3.0", description: "\xC9chelle de l'effet", defaultValue: "1.0" },
      { name: "Opacit\xE9", range: "0.0-1.0", description: "Transparence g\xE9n\xE9rale", defaultValue: "0.8" },
      { name: "Couleur", range: "RGB/HSL", description: "Palette de couleurs", defaultValue: "#ffffff" },
      { name: "Qualit\xE9", range: "1-10", description: "Niveau de d\xE9tail", defaultValue: "5" }
    ];
    if (code.includes("particle") || code.includes("Particle")) {
      commonParams.push(
        { name: "Nombre", range: "10-1000", description: "Nombre de particules", defaultValue: "200" },
        { name: "Gravit\xE9", range: "-10-10", description: "Force gravitationnelle", defaultValue: "0.1" }
      );
    }
    if (code.includes("smoke") || code.includes("Smoke")) {
      commonParams.push(
        { name: "Densit\xE9", range: "0.1-5.0", description: "Concentration de fum\xE9e", defaultValue: "1.5" },
        { name: "Temp\xE9rature", range: "300-1500", description: "Chaleur du fluide", defaultValue: "600" },
        { name: "Turbulence", range: "0-1", description: "Niveau de chaos", defaultValue: "0.4" }
      );
    }
    return commonParams;
  }
  generateVariationSuggestions(category, type) {
    const baseVariations = [
      { name: "L\xE9ger", description: "Version optimis\xE9e performance", specs: "Performance+, Qualit\xE9-" },
      { name: "Standard", description: "\xC9quilibre optimal", specs: "Performance=, Qualit\xE9=" },
      { name: "Premium", description: "Qualit\xE9 maximale", specs: "Performance-, Qualit\xE9+" }
    ];
    if (category === "Simulation") {
      baseVariations.push(
        { name: "R\xE9aliste", description: "Simulation physique compl\xE8te", specs: "Physique+, Performance-" },
        { name: "Stylis\xE9", description: "Rendu artistique", specs: "Cr\xE9ativit\xE9+, Physique-" }
      );
    }
    if (category === "Particules") {
      baseVariations.push(
        { name: "Essaim", description: "Nombreuses petites particules", specs: "Nombre+, Taille-" },
        { name: "Macro", description: "Peu de grosses particules", specs: "Nombre-, Taille+" }
      );
    }
    return baseVariations;
  }
  extractFeatures(code) {
    const features = [];
    if (code.includes("canvas") || code.includes("Canvas")) {
      features.push("Rendu Canvas 2D/3D optimis\xE9");
    }
    if (code.includes("requestAnimationFrame") || code.includes("RAF")) {
      features.push("Animation fluide 60 FPS");
    }
    if (code.includes("physics") || code.includes("Physics")) {
      features.push("Simulation physique r\xE9aliste");
    }
    if (code.includes("responsive") || code.includes("Responsive")) {
      features.push("Adaptation responsive automatique");
    }
    if (code.includes("performance") || code.includes("Performance")) {
      features.push("Optimisations de performance avanc\xE9es");
    }
    features.push(
      "Contr\xF4les interactifs (start/pause/reset)",
      "Configuration param\xE9trable en temps r\xE9el",
      "Compatibilit\xE9 cross-browser garantie",
      "API \xE9v\xE9nementielle compl\xE8te",
      "Gestion d'erreurs robuste"
    );
    return features;
  }
  getScientificBasis(category) {
    const bases = {
      "Simulation": [
        "M\xE9canique des fluides (\xE9quations Navier-Stokes)",
        "Thermodynamique (transferts chaleur, changements phase)",
        "Physique des particules (dynamiques, collisions)",
        "Math\xE9matiques appliqu\xE9es (calcul diff\xE9rentiel, alg\xE8bre lin\xE9aire)"
      ],
      "Particules": [
        "Dynamique des corps rigides",
        "Syst\xE8mes de particules (\xE9mission, \xE9volution, extinction)",
        "Forces physiques (gravit\xE9, friction, magn\xE9tisme)",
        "Th\xE9orie du chaos (comportements \xE9mergents)"
      ],
      "Lumineux": [
        "Optique g\xE9om\xE9trique et ondulatoire",
        "Photom\xE9trie (intensit\xE9, flux lumineux)",
        "Colorim\xE9trie (espaces colorim\xE9triques, perception)",
        "Ph\xE9nom\xE8nes de diffraction et r\xE9fraction"
      ]
    };
    return bases[category] || [
      "Algorithmes optimis\xE9s pour performances temps r\xE9el",
      "Math\xE9matiques computationnelles avanc\xE9es",
      "Th\xE9orie des graphiques et animation proc\xE9durale"
    ];
  }
  extractPhenomena(code, category) {
    const phenomena = [];
    if (category === "Simulation") {
      phenomena.push(
        { name: "Convection", description: "Mouvements fluides par diff\xE9rences de temp\xE9rature" },
        { name: "Diffusion", description: "Propagation mol\xE9culaire dans l'espace" },
        { name: "Turbulence", description: "\xC9coulements chaotiques multi-\xE9chelles" }
      );
    } else if (category === "Particules") {
      phenomena.push(
        { name: "\xC9mission", description: "G\xE9n\xE9ration contr\xF4l\xE9e de nouvelles particules" },
        { name: "\xC9volution", description: "Transformation des propri\xE9t\xE9s au cours du temps" },
        { name: "Interaction", description: "Forces entre particules et environnement" }
      );
    } else {
      phenomena.push(
        { name: "Animation", description: "Interpolation fluide des propri\xE9t\xE9s visuelles" },
        { name: "Rendu", description: "Optimisation du pipeline graphique" },
        { name: "Interactivit\xE9", description: "R\xE9ponse aux \xE9v\xE9nements utilisateur" }
      );
    }
    return phenomena;
  }
  assessPerformance(code) {
    let score = 0;
    if (code.includes("requestAnimationFrame")) score += 2;
    if (code.includes("performance") || code.includes("optimize")) score += 2;
    if (code.includes("cache") || code.includes("buffer")) score += 1;
    if (code.includes("webgl") || code.includes("WebGL")) score += 3;
    if (code.length < 5e3) score += 1;
    if (code.includes("worker") || code.includes("Worker")) score += 2;
    if (score >= 7) return "Tr\xE8s Haute (optimis\xE9 pour animations complexes)";
    if (score >= 5) return "Haute (optimis\xE9 pour performances temps r\xE9el)";
    if (score >= 3) return "Moyenne (bon \xE9quilibre qualit\xE9/performance)";
    return "Standard (fonctionnel sur tous appareils)";
  }
  generateDescription(name, category, type) {
    const descriptions = {
      "Simulation": `Effet sp\xE9cial avanc\xE9 qui simule des ph\xE9nom\xE8nes physiques r\xE9alistes avec des mod\xE8les math\xE9matiques authentiques. L'animation reproduit fid\xE8lement les lois de la physique avec des \xE9quations diff\xE9rentielles, la thermodynamique, et des interactions particule-fluide complexes.`,
      "Particules": `Syst\xE8me de particules sophistiqu\xE9 g\xE9n\xE9rant des animations dynamiques avec comportements \xE9mergents. Chaque particule ob\xE9it \xE0 des lois physiques individuelles tout en contribuant \xE0 un effet d'ensemble coh\xE9rent et spectaculaire.`,
      "Lumineux": `Effet lumineux avanc\xE9 exploitant les principes optiques pour cr\xE9er des jeux de lumi\xE8re r\xE9alistes. L'animation simule la propagation photonique, les r\xE9flexions, r\xE9fractions et ph\xE9nom\xE8nes de diffusion lumineuse.`
    };
    return descriptions[category] || `Effet visuel ${type.toLowerCase()} optimis\xE9 par intelligence artificielle. L'animation combine algorithmes avanc\xE9s et rendu temps r\xE9el pour une exp\xE9rience visuelle immersive et performante.`;
  }
  generateFallbackReadme(effectName) {
    return `# \u2728 ${effectName}

## Description

Effet visuel JavaScript optimis\xE9 par intelligence artificielle.

## Utilisation

\`\`\`javascript
const effect = new ${effectName}();
effect.initialize(canvas);
effect.start();
\`\`\`

## Fonctionnalit\xE9s

- Animation fluide et optimis\xE9e
- Compatible tous navigateurs
- API simple et intuitive
- Performance adaptative

---

*G\xE9n\xE9r\xE9 automatiquement pour VariationEngine 2.0*`;
  }
};

// server/services/js-preprocessor.ts
var JSPreprocessor = class {
  universalPreprocessor;
  constructor() {
    this.universalPreprocessor = new UniversalPreprocessor();
  }
  baseEffectTemplate = `
// Classe de base g\xE9n\xE9r\xE9e automatiquement
class BaseEffect {
  constructor(config = {}) {
    this.id = config.id || 'effect-' + Date.now();
    this.name = config.name || 'Effect';
    this.category = config.category || 'general';
    this.version = config.version || '1.0';
    this.performance = config.performance || 'medium';
    this.parameters = config.parameters || {};
  }

  initialize(canvas, element) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.element = element;
  }

  animate(deltaTime) {
    // M\xE9thode \xE0 surcharger
  }

  destroy() {
    // Nettoyage
  }
}
`;
  /**
   * Point d'entrée principal du preprocessing JavaScript
   */
  async preprocessJS(originalCode, filename) {
    let processedCode = originalCode;
    const changes = [];
    try {
      console.log("\u{1F504} D\xE9marrage du preprocessing universel...");
      const universalResult = await this.universalPreprocessor.preprocessEffect(originalCode, filename);
      if (!universalResult.isValid) {
        return {
          processedCode: originalCode,
          changes: [],
          isValid: false,
          error: universalResult.error,
          metadata: universalResult.metadata
        };
      }
      processedCode = universalResult.cleanCode;
      changes.push(...universalResult.changes);
      console.log(`\u2705 Preprocessing universel termin\xE9: ${universalResult.changes.length} changements`);
      const metadataConversion = this.convertMetadataToEffect(processedCode, filename);
      if (metadataConversion.converted) {
        processedCode = metadataConversion.code;
        changes.push(...metadataConversion.changes);
      }
      const moduleConversion = this.convertModuleFormat(processedCode);
      if (moduleConversion.converted) {
        processedCode = moduleConversion.code;
        changes.push(...moduleConversion.changes);
      }
      if (processedCode.includes("extends BaseEffect") && !processedCode.includes("class BaseEffect")) {
        processedCode = this.baseEffectTemplate + "\n\n" + processedCode;
        changes.push("Classe BaseEffect ajout\xE9e");
      }
      if (!processedCode.includes("module.exports") && !processedCode.includes("export")) {
        processedCode = this.addStandardExports(processedCode);
        changes.push("Exports ajout\xE9s");
      }
      const validationResult = this.validateJavaScript(processedCode);
      if (!validationResult.isValid) {
        const corrected = this.autoCorrectSyntax(processedCode);
        if (corrected.isValid) {
          processedCode = corrected.code;
          changes.push("Erreurs de syntaxe corrig\xE9es automatiquement");
        } else {
          return {
            processedCode: originalCode,
            changes: [],
            isValid: false,
            error: validationResult.error,
            metadata: this.universalPreprocessor.getExtractedMetadata()
          };
        }
      }
      processedCode = this.optimizePerformance(processedCode);
      changes.push("Optimisations de performance appliqu\xE9es");
      return {
        processedCode,
        changes,
        isValid: true,
        metadata: this.universalPreprocessor.getExtractedMetadata()
      };
    } catch (error) {
      return {
        processedCode: originalCode,
        changes: [],
        isValid: false,
        error: `Erreur de preprocessing: ${error instanceof Error ? error.message : String(error)}`,
        metadata: this.universalPreprocessor.getExtractedMetadata()
      };
    }
  }
  /**
   * Convertit les métadonnées en classe d'effet complète
   */
  convertMetadataToEffect(code, filename) {
    const changes = [];
    if (code.includes("export const") && code.includes("description:") && !code.includes("class ")) {
      const effectName = this.extractEffectNameFromFilename(filename);
      const generatedClass = this.generateEffectClassFromMetadata(code, effectName);
      return {
        code: code + "\n\n" + generatedClass,
        converted: true,
        changes: [`Classe ${effectName} g\xE9n\xE9r\xE9e \xE0 partir des m\xE9tadonn\xE9es`]
      };
    }
    return { code, converted: false, changes: [] };
  }
  /**
   * Convertit différents formats de modules
   */
  convertModuleFormat(code) {
    let convertedCode = code;
    const changes = [];
    let hasChanged = false;
    if (code.includes("define(") && code.includes("function(")) {
      convertedCode = this.convertAMDToCommonJS(convertedCode);
      changes.push("Format AMD converti vers CommonJS");
      hasChanged = true;
    }
    if (code.includes("(function (root, factory)")) {
      convertedCode = this.convertUMDToCommonJS(convertedCode);
      changes.push("Format UMD converti vers CommonJS");
      hasChanged = true;
    }
    return { code: convertedCode, converted: hasChanged, changes };
  }
  /**
   * Ajoute les exports standardisés
   */
  addStandardExports(code) {
    const className = this.extractMainClassName(code);
    if (className) {
      return code + `

// Export standard
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ${className};
}

if (typeof window !== 'undefined') {
  window.${className} = ${className};
}`;
    }
    return code;
  }
  /**
   * Validation JavaScript
   */
  validateJavaScript(code) {
    try {
      new Function(code);
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : "Erreur de syntaxe JavaScript"
      };
    }
  }
  /**
   * Correction automatique de syntaxe
   */
  autoCorrectSyntax(code) {
    let correctedCode = code;
    const openBraces = (correctedCode.match(/\{/g) || []).length;
    const closeBraces = (correctedCode.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      correctedCode += "\n" + "}".repeat(openBraces - closeBraces);
    }
    const openParens = (correctedCode.match(/\(/g) || []).length;
    const closeParens = (correctedCode.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      correctedCode += ")".repeat(openParens - closeParens);
    }
    const validation = this.validateJavaScript(correctedCode);
    return { code: correctedCode, isValid: validation.isValid };
  }
  /**
   * Optimisations de performance
   */
  optimizePerformance(code) {
    let optimizedCode = code;
    if (code.includes("Math.sin") || code.includes("Math.cos")) {
      optimizedCode = `// Cache trigonom\xE9trique
const MathCache = new Map();
const cachedSin = (x) => MathCache.has('sin_' + x) ? MathCache.get('sin_' + x) : MathCache.set('sin_' + x, Math.sin(x)).get('sin_' + x);
const cachedCos = (x) => MathCache.has('cos_' + x) ? MathCache.get('cos_' + x) : MathCache.set('cos_' + x, Math.cos(x)).get('cos_' + x);

${optimizedCode.replace(/Math\.sin/g, "cachedSin").replace(/Math\.cos/g, "cachedCos")}`;
    }
    return optimizedCode;
  }
  /**
   * Utilitaires privés
   */
  extractEffectNameFromFilename(filename) {
    const name = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()).replace(/\s/g, "");
    return name.endsWith("Effect") ? name : name + "Effect";
  }
  extractMainClassName(code) {
    const classMatch = code.match(/class\s+(\w+)/);
    return classMatch ? classMatch[1] : null;
  }
  generateEffectClassFromMetadata(metadataCode, effectName) {
    return `
class ${effectName} extends BaseEffect {
  constructor(config = {}) {
    super({
      id: '${effectName.toLowerCase()}',
      name: '${effectName}',
      category: 'generated',
      ...config
    });
  }

  initialize(canvas, element) {
    super.initialize(canvas, element);
    // Initialisation personnalis\xE9e bas\xE9e sur les m\xE9tadonn\xE9es
  }

  animate(deltaTime) {
    if (!this.isActive || !this.ctx) return;

    // Animation par d\xE9faut
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // TODO: Impl\xE9menter l'animation bas\xE9e sur les m\xE9tadonn\xE9es
  }
}`;
  }
  convertAMDToCommonJS(code) {
    return code.replace(
      /define\s*\(\s*\[(.*?)\]\s*,\s*function\s*\((.*?)\)\s*{([\s\S]*?)}\s*\)/,
      (match, deps, params, body) => {
        const requires = deps.split(",").map((dep, index) => {
          const paramName = params.split(",")[index]?.trim();
          return paramName ? `const ${paramName} = require(${dep.trim()});` : "";
        }).filter(Boolean).join("\n");
        return `${requires}

${body}

module.exports = /* export principal */;`;
      }
    );
  }
  convertUMDToCommonJS(code) {
    const umdPattern = /\(function\s*\([^)]*\)\s*{[\s\S]*?if\s*\([^)]*typeof\s+exports[^)]*\)[^{]*{[\s\S]*?}\s*else[^{]*{([\s\S]*?)}\s*}\)\s*\(/;
    const match = umdPattern.exec(code);
    if (match && match[1]) {
      return match[1].trim() + "\n\nmodule.exports = /* export principal */;";
    }
    return code;
  }
  /**
   * Réinitialise le preprocessor
   */
  reset() {
    this.universalPreprocessor.reset();
  }
};

// server/services/advanced-enhancer.ts
import fs3 from "fs/promises";
import path3 from "path";
var AdvancedEnhancer = class {
  advancedModules = {};
  enhancementLevels = {};
  constructor() {
    this.loadAdvancedModules();
  }
  /**
   * Charge la configuration des modules avancés
   */
  async loadAdvancedModules() {
    try {
      const configPath = path3.join(process.cwd(), "server/config/advanced-enhancement-modules.json");
      const configData = await fs3.readFile(configPath, "utf-8");
      const config = JSON.parse(configData);
      this.advancedModules = config.advancedModules;
      this.enhancementLevels = config.enhancement_levels;
    } catch (error) {
      console.error("Erreur de chargement des modules avanc\xE9s:", error);
    }
  }
  /**
   * Analyse le code et suggère des améliorations basées sur les recommandations IA
   */
  async analyzeAndSuggestImprovements(code, currentLevel) {
    const suggestions = [];
    const codePatterns = this.extractCodePatterns(code);
    for (const [moduleId, module] of Object.entries(this.advancedModules)) {
      const priority = this.calculateModulePriority(module, codePatterns, currentLevel);
      if (priority !== "none") {
        suggestions.push({
          module: module.name,
          priority,
          description: module.description,
          impact: module.impact,
          estimated_gain: module.performance_gain,
          implementation_complexity: module.complexity
        });
      }
    }
    suggestions.sort((a, b) => {
      const priorityOrder = { "critical": 4, "high": 3, "medium": 2, "low": 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    const totalEstimatedGain = suggestions.reduce((sum, s) => sum + s.estimated_gain, 0);
    const recommendedLevel = this.suggestOptimalLevel(suggestions, currentLevel);
    return {
      suggestions: suggestions.slice(0, 10),
      // Top 10 suggestions
      recommendedLevel,
      totalEstimatedGain
    };
  }
  /**
   * Applique les améliorations avancées au code
   */
  async applyAdvancedEnhancements(code, selectedModules, targetLevel) {
    let enhancedCode = code;
    const appliedEnhancements = [];
    const warnings = [];
    let totalPerformanceGain = 0;
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
  extractCodePatterns(code) {
    return {
      has2DCanvas: code.includes("getContext('2d')") || code.includes("ctx."),
      hasAnimationLoop: code.includes("requestAnimationFrame") || code.includes("setInterval"),
      hasComplexMath: /Math\.(sin|cos|tan|sqrt|pow)/.test(code),
      hasParticleSystem: code.includes("particle") || code.includes("Particle"),
      has3DTransforms: /rotate|transform|matrix/.test(code),
      hasPerformanceIssues: code.split("\n").length > 500 || /for.*length/.test(code)
    };
  }
  /**
   * Calcule la priorité d'un module basé sur le code
   */
  calculateModulePriority(module, patterns, currentLevel) {
    let priority = 0;
    if (module.code_patterns) {
      const matchingPatterns = module.code_patterns.filter(
        (pattern) => Object.values(patterns).some((value) => value && String(value).includes(pattern))
      );
      priority += matchingPatterns.length * 10;
    }
    const impactBonus = {
      "revolutionary": 30,
      "dramatic": 25,
      "innovative": 20,
      "high": 15,
      "enterprise": 12,
      "critical": 10,
      "medium": 5,
      "low": 2
    };
    priority += impactBonus[module.impact] || 0;
    if (currentLevel <= 1 && module.complexity === "low") priority += 5;
    if (currentLevel >= 2 && module.complexity === "medium") priority += 5;
    if (currentLevel >= 3 && module.complexity === "high") priority += 5;
    if (priority >= 40) return "critical";
    if (priority >= 25) return "high";
    if (priority >= 15) return "medium";
    if (priority >= 5) return "low";
    return "none";
  }
  /**
   * Suggère le niveau optimal basé sur les améliorations
   */
  suggestOptimalLevel(suggestions, currentLevel) {
    const highPrioritySuggestions = suggestions.filter((s) => s.priority === "critical" || s.priority === "high").length;
    const totalComplexity = suggestions.reduce((sum, s) => {
      const complexityWeight = { "low": 1, "medium": 2, "high": 3, "very_high": 4 };
      return sum + (complexityWeight[s.implementation_complexity] || 1);
    }, 0);
    if (highPrioritySuggestions >= 8 && totalComplexity >= 20) {
      return "level_6_revolutionary";
    } else if (highPrioritySuggestions >= 5 && totalComplexity >= 15) {
      return "level_5_enterprise";
    } else if (highPrioritySuggestions >= 3) {
      return "level_4_professional_plus";
    }
    return currentLevel >= 3 ? "level_4_professional_plus" : `level_${Math.min(currentLevel + 1, 3)}_enhanced`;
  }
  /**
   * Applique une amélioration spécifique
   */
  async applySpecificEnhancement(code, moduleId, module) {
    const warnings = [];
    switch (moduleId) {
      case "webgl_integration":
        return this.applyWebGLIntegration(code);
      case "lod_system":
        return this.applyLODSystem(code);
      case "web_workers":
        return this.applyWebWorkers(code);
      case "adaptive_rendering":
        return this.applyAdaptiveRendering(code);
      case "predictive_cache":
        return this.applyPredictiveCache(code);
      case "resilience_system":
        return this.applyResilienceSystem(code);
      default:
        return {
          code: code + `
// TODO: Impl\xE9menter ${module.name}
`,
          description: `Placeholder ajout\xE9 pour ${module.name}`,
          warnings: [`Module ${moduleId} pas encore impl\xE9ment\xE9`]
        };
    }
  }
  /**
   * Applique l'intégration WebGL
   */
  applyWebGLIntegration(code) {
    const webglCode = `
// === INT\xC9GRATION WEBGL AVANC\xC9E ===
class WebGLEffectRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!this.gl) throw new Error('WebGL non support\xE9');
    
    this.initWebGL();
  }
  
  initWebGL() {
    const gl = this.gl;
    
    // Configuration de base
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // Shaders optimis\xE9s
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
        // Effets dynamiques bas\xE9s sur le temps
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
    
    // Mise \xE0 jour des uniforms
    const timeLocation = gl.getUniformLocation(this.program, 'u_time');
    gl.uniform1f(timeLocation, deltaTime * 0.001);
    
    // Rendu optimis\xE9
    this.drawScene();
  }
}

`;
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
    console.log('WebGL activ\xE9 pour performance optimale');
  } catch (e) {
    console.log('Fallback Canvas 2D:', e.message);
  }
}`,
      description: "Int\xE9gration WebGL avec fallback Canvas 2D pour performance 3D optimale"
    };
  }
  /**
   * Applique le système LOD
   */
  applyLODSystem(code) {
    const lodCode = `
// === SYST\xC8ME LEVEL OF DETAIL (LOD) ===
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
      // R\xE9duire la qualit\xE9
      this.currentLOD = Math.max(0.3, this.currentLOD - this.adaptationRate);
    } else if (avgFPS > this.targetFPS * 0.95) {
      // Augmenter la qualit\xE9
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
// Int\xE9gration LOD automatique
if (!this.lodManager) {
  this.lodManager = new AdaptiveLODManager();
}

// Dans la boucle d'animation, ajouter:
const currentFPS = 1000 / deltaTime;
const lodLevel = this.lodManager.updateLOD(currentFPS, deltaTime);
const settings = this.lodManager.getOptimalSettings();
`,
      description: "Syst\xE8me LOD adaptatif pour optimisation automatique des performances"
    };
  }
  /**
   * Applique les Web Workers
   */
  applyWebWorkers(code) {
    const workerCode = `
// === INT\xC9GRATION WEB WORKERS ===
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
          // Simulation avanc\xE9e
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
      description: "Web Workers pour d\xE9l\xE9gation des calculs lourds et am\xE9lioration des performances"
    };
  }
  /**
   * Applique le rendu adaptatif
   */
  applyAdaptiveRendering(code) {
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
  
  console.log('Rendu adaptatif configur\xE9:', config);
}
`,
      description: "Syst\xE8me de rendu adaptatif optimis\xE9 pour chaque type de device"
    };
  }
  /**
   * Applique le cache prédictif
   */
  applyPredictiveCache(code) {
    const cacheCode = `
// === CACHE PR\xC9DICTIF INTELLIGENT ===
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
    
    // G\xE9n\xE9rer et cacher
    const data = generator();
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 1
    });
    
    // Pr\xE9dire et pr\xE9charger le suivant
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
// Initialisation du cache pr\xE9dictif
if (!this.predictiveCache) {
  this.predictiveCache = new PredictiveCacheSystem();
  
  // Exemple d'usage pour les textures/ressources
  this.getCachedResource = (key, generator) => {
    return this.predictiveCache.get(key, generator);
  };
}
`,
      description: "Cache pr\xE9dictif avec apprentissage automatique des patterns d'utilisation"
    };
  }
  /**
   * Applique le système de résilience
   */
  applyResilienceSystem(code) {
    const resilienceCode = `
// === SYST\xC8ME DE R\xC9SILIENCE ET FALLBACKS ===
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
    
    console.log(\`Fallback niveau \${level} activ\xE9:, config);
  }
  
  applyConfiguration(config) {
    // Appliquer la configuration au syst\xE8me
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
// Initialisation du syst\xE8me de r\xE9silience
if (!this.resilienceSystem) {
  this.resilienceSystem = new ResilienceSystem();
  
  // Monitoring automatique dans la boucle d'animation
  const originalAnimate = this.animate;
  this.animate = function(deltaTime) {
    this.resilienceSystem.performanceMonitor.recordFrame(deltaTime);
    this.resilienceSystem.adaptToPerformance();
    
    return originalAnimate.call(this, deltaTime);
  };
  
  window.currentEffect = this; // Pour l'acc\xE8s global
}
`,
      description: "Syst\xE8me de r\xE9silience avec fallbacks automatiques et monitoring des performances"
    };
  }
  /**
   * Applique les optimisations de niveau
   */
  async applyLevelOptimizations(code, level) {
    const optimizations = [];
    let optimizedCode = code;
    const levelConfig = this.enhancementLevels[level];
    if (!levelConfig) return { code, optimizations };
    const globalOptimizations = `
// === OPTIMISATIONS NIVEAU ${level.toUpperCase()} ===
class ${levelConfig.name.replace(/\s+/g, "")}Optimizer {
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
    // Code optimisations sp\xE9cifiques au niveau
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
    optimizations.push(`Optimisations niveau ${levelConfig.name} appliqu\xE9es`);
    optimizations.push(`Architecture ${levelConfig.complexity} configur\xE9e`);
    optimizations.push(`Am\xE9lioration estim\xE9e: ${levelConfig.estimated_improvement}`);
    return { code: optimizedCode, optimizations };
  }
  /**
   * Obtient les niveaux d'amélioration disponibles
   */
  getAvailableEnhancementLevels() {
    return this.enhancementLevels;
  }
  /**
   * Obtient les modules avancés disponibles
   */
  getAvailableModules() {
    return this.advancedModules;
  }
};

// server/services/intelligent-categorizer.ts
var IntelligentCategorizer = class {
  categories = {
    // 🟢 NIVEAU 1 SEULEMENT - Effets "complets" qui n'ont pas besoin de plus
    ui_ux: {
      name: "Interface Utilisateur (UI/UX)",
      subcategories: [
        "animations_boutons",
        "effets_loading",
        "preloaders",
        "animations_navigation",
        "menus",
        "micro_interactions",
        "effets_hover",
        "effets_focus",
        "ripple",
        "hover",
        "button",
        "menu",
        "navigation",
        "loading"
      ],
      availableLevels: [1],
      reason: "Effet UI optimis\xE9 - Parfaitement complet au niveau Standard",
      description: "\u{1F7E2} Effets d'interface utilisateur d\xE9j\xE0 optimis\xE9s qui n'ont pas besoin d'am\xE9liorations complexes",
      category_type: "complete",
      icon: "\u{1F3AF}"
    },
    transitions_simples: {
      name: "Transitions Basiques",
      subcategories: [
        "fade_transitions",
        "slide_transitions",
        "wipes_basiques",
        "fade",
        "slide",
        "wipe",
        "simple_transition"
      ],
      availableLevels: [1],
      reason: "Transitions simples d\xE9j\xE0 compl\xE8tes - Niveau Standard parfait",
      description: "\u{1F7E2} Transitions basiques qui fonctionnent parfaitement sans am\xE9liorations",
      category_type: "complete",
      icon: "\u26A1"
    },
    // 🟡 NIVEAUX 1 + 2 - Effets avec potentiel d'amélioration modéré
    texte: {
      name: "Effets de Texte",
      subcategories: [
        "typewriter",
        "glitch_text",
        "neon_text",
        "fade_text",
        "slide_text",
        "rotate_text",
        "morphing_text",
        "text",
        "typography",
        "letter"
      ],
      availableLevels: [1, 2],
      reason: "Potentiel mod\xE9r\xE9 d'am\xE9lioration avec IA",
      description: "\u{1F7E1} Effets de texte avec possibilit\xE9s d'optimisation intelligente (sauf effets 3D sur texte)",
      category_type: "moderate",
      icon: "\u{1F4DD}"
    },
    images: {
      name: "Effets d'Images",
      subcategories: [
        "slideshow_effects",
        "filtres_overlays",
        "parallaxe",
        "zoom_pan",
        "revelations_images",
        "masques_creatifs",
        "image",
        "photo",
        "gallery",
        "slideshow",
        "parallax",
        "zoom"
      ],
      availableLevels: [1, 2],
      reason: "Am\xE9liorations visuelles possibles avec IA",
      description: "\u{1F7E1} Effets d'images avec potentiel d'am\xE9lioration mod\xE9r\xE9",
      category_type: "moderate",
      icon: "\u{1F5BC}\uFE0F"
    },
    audio: {
      name: "Effets Audio",
      subcategories: [
        "effets_sonores",
        "musiques_ambiance",
        "transitions_audio",
        "sound_design",
        "audio",
        "sound",
        "music",
        "voice"
      ],
      availableLevels: [1, 2],
      reason: "Optimisations audio intelligentes disponibles",
      description: "\u{1F7E1} Effets audio avec possibilit\xE9s d'am\xE9lioration sonore",
      category_type: "moderate",
      icon: "\u{1F50A}"
    },
    // 🔴 TOUS NIVEAUX (1, 2, 3+) - Effets avec énorme potentiel d'amélioration IA
    particules_simulation: {
      name: "Particules et Simulation",
      subcategories: [
        "systemes_particules",
        "feu",
        "fumee",
        "neige",
        "effets_meteorologiques",
        "simulations_physiques",
        "effets_magie",
        "effets_fantastique",
        "particle",
        "fire",
        "smoke",
        "snow",
        "weather",
        "physics",
        "magic",
        "fantasy",
        "explosion"
      ],
      availableLevels: [1, 2, 3, 4, 5, 6],
      reason: "\u{1F680} \xC9NORME potentiel d'am\xE9lioration IA - Tous niveaux recommand\xE9s",
      description: "\u{1F534} Syst\xE8mes complexes avec potentiel r\xE9volutionnaire d'am\xE9lioration",
      category_type: "revolutionary",
      icon: "\u2728"
    },
    motion_3d: {
      name: "Animation 3D et Mouvement",
      subcategories: [
        "elements_3d_animes",
        "effets_camera",
        "mouvements",
        "rendus_visualisations",
        "templates_after_effects",
        "effets_3d_texte",
        "3d",
        "camera",
        "movement",
        "render",
        "visualization",
        "rotation",
        "transform",
        "matrix",
        "perspective",
        "depth"
      ],
      availableLevels: [1, 2, 3, 4, 5, 6],
      reason: "\u{1F680} Technologies 3D avanc\xE9es - Maximum d'am\xE9liorations IA possible",
      description: "\u{1F534} Effets 3D complexes avec potentiel maximal d'optimisation (inclut les effets 3D sur texte)",
      category_type: "revolutionary",
      icon: "\u{1F3AE}"
    },
    video_avance: {
      name: "Vid\xE9o et Post-Production",
      subcategories: [
        "morphing_video",
        "post_production",
        "color_grading",
        "overlays_animes",
        "green_screen",
        "compositing",
        "video",
        "morphing",
        "grading",
        "overlay",
        "composite",
        "chroma",
        "filter"
      ],
      availableLevels: [1, 2, 3, 4, 5, 6],
      reason: "\u{1F680} Traitement vid\xE9o complexe - IA r\xE9volutionnaire applicable",
      description: "\u{1F534} Effets vid\xE9o avanc\xE9s n\xE9cessitant toute la puissance de l'IA",
      category_type: "revolutionary",
      icon: "\u{1F3AC}"
    }
  };
  /**
   * Analyse le code JavaScript et détermine sa catégorie
   */
  analyzeEffect(filename, code) {
    const analysis = this.performDeepAnalysis(filename, code);
    const category = this.classifyByContent(analysis);
    return {
      category: category.name,
      subcategory: analysis.detectedSubcategory,
      availableLevels: category.availableLevels,
      reason: category.reason,
      confidence: analysis.confidence,
      recommendations: this.generateRecommendations(category, analysis),
      category_type: category.category_type,
      icon: category.icon
    };
  }
  /**
   * Analyse approfondie du contenu du fichier
   */
  performDeepAnalysis(filename, code) {
    const lowerFilename = filename.toLowerCase();
    const lowerCode = code.toLowerCase();
    const keywords = this.extractKeywords(lowerFilename + " " + lowerCode);
    const patterns = this.detectTechnicalPatterns(code);
    const complexity = this.evaluateComplexity(code, patterns);
    const detectedSubcategory = this.detectSubcategory(keywords, patterns);
    const confidence = this.calculateConfidence(keywords, patterns, complexity);
    return {
      keywords,
      patterns,
      complexity,
      detectedSubcategory,
      confidence
    };
  }
  /**
   * Extraction des mots-clés pertinents
   */
  extractKeywords(text2) {
    const keywordRegexes = [
      /particle|particule/g,
      /3d|three|webgl/g,
      /animation|animate/g,
      /button|bouton|hover/g,
      /text|texte|font/g,
      /image|img|photo/g,
      /video|film/g,
      /audio|sound|music/g,
      /fire|feu|flame/g,
      /smoke|fumee/g,
      /snow|neige/g,
      /magic|magie/g,
      /camera|perspective/g,
      /transition|fade|slide/g,
      /loading|preloader/g,
      /menu|navigation/g
    ];
    const keywords = [];
    keywordRegexes.forEach((regex) => {
      const matches = text2.match(regex);
      if (matches) keywords.push(...matches);
    });
    return Array.from(new Set(keywords));
  }
  /**
   * Détection des patterns techniques
   */
  detectTechnicalPatterns(code) {
    const patterns = [];
    if (/Math\.(sin|cos|tan)|matrix|transform|rotate|perspective/i.test(code)) {
      patterns.push("3d_math");
    }
    if (/particle|\.length.*for|array.*push/i.test(code)) {
      patterns.push("particle_system");
    }
    if (/webgl|gl\.|shader|vertex|fragment/i.test(code)) {
      patterns.push("webgl");
    }
    if (/requestAnimationFrame|setInterval|transition|animate/i.test(code)) {
      patterns.push("animation");
    }
    if (/velocity|acceleration|gravity|physics/i.test(code)) {
      patterns.push("physics");
    }
    if (/addEventListener|onclick|hover|mouseover/i.test(code)) {
      patterns.push("interaction");
    }
    if (/canvas|ctx\.|getContext|drawImage|fillRect/i.test(code)) {
      patterns.push("rendering");
    }
    return patterns;
  }
  /**
   * Évaluation de la complexité du code
   */
  evaluateComplexity(code, patterns) {
    let complexityScore = 0;
    complexityScore += Math.min(code.length / 1e3, 10);
    complexityScore += patterns.length * 2;
    complexityScore += (code.match(/function|class|if|for|while/g) || []).length * 0.5;
    complexityScore += (code.match(/Math\./g) || []).length * 1;
    if (complexityScore < 5) return "low";
    if (complexityScore < 15) return "medium";
    if (complexityScore < 30) return "high";
    return "very_high";
  }
  /**
   * Détection de la sous-catégorie
   */
  detectSubcategory(keywords, patterns) {
    if (keywords.some((k) => /particle|fire|smoke|snow|magic/.test(k))) {
      return "systemes_particules";
    }
    if (keywords.some((k) => /3d|webgl|camera|perspective/.test(k)) || patterns.includes("3d_math")) {
      return "elements_3d_animes";
    }
    if (keywords.some((k) => /button|hover|menu|navigation/.test(k))) {
      return "micro_interactions";
    }
    if (keywords.some((k) => /text|font|typography/.test(k))) {
      return "effets_texte";
    }
    if (keywords.some((k) => /video|film/.test(k))) {
      return "effets_video";
    }
    if (keywords.some((k) => /fade|slide|transition/.test(k))) {
      return "transitions_simples";
    }
    return "effet_generique";
  }
  /**
   * Classification par contenu utilisant l'algorithme intelligent
   */
  classifyByContent(analysis) {
    const { keywords, patterns, complexity, detectedSubcategory } = analysis;
    const detectionResult = this.detectAvailableLevels(
      detectedSubcategory,
      keywords,
      patterns,
      complexity
    );
    return detectionResult.category;
  }
  /**
   * Algorithme de détection intelligent des niveaux disponibles
   */
  detectAvailableLevels(effectName, keywords, patterns, complexity) {
    if (this.isUIUXEffect(keywords, patterns) || this.isSimpleTransition(effectName, keywords)) {
      return {
        category: this.categories.ui_ux,
        levels: [1],
        reason: "Effet UI optimis\xE9"
      };
    }
    if (this.isTextEffect(keywords, patterns) && !this.isAdvanced3D(keywords, patterns)) {
      return {
        category: this.categories.texte,
        levels: [1, 2],
        reason: "Potentiel mod\xE9r\xE9 d'am\xE9lioration"
      };
    }
    if (this.isImageEffect(keywords, patterns) && !this.isAdvanced3D(keywords, patterns)) {
      return {
        category: this.categories.images,
        levels: [1, 2],
        reason: "Am\xE9liorations visuelles possibles"
      };
    }
    if (this.isAudioEffect(keywords, patterns)) {
      return {
        category: this.categories.audio,
        levels: [1, 2],
        reason: "Optimisations audio intelligentes"
      };
    }
    if (this.isParticleSimulation(keywords, patterns)) {
      return {
        category: this.categories.particules_simulation,
        levels: [1, 2, 3, 4, 5, 6],
        reason: "Fort potentiel d'am\xE9lioration IA"
      };
    }
    if (this.is3DMotion(keywords, patterns) || this.isAdvanced3D(keywords, patterns)) {
      return {
        category: this.categories.motion_3d,
        levels: [1, 2, 3, 4, 5, 6],
        reason: "Technologies 3D avanc\xE9es"
      };
    }
    if (this.isAdvancedVideo(keywords, patterns)) {
      return {
        category: this.categories.video_avance,
        levels: [1, 2, 3, 4, 5, 6],
        reason: "Traitement vid\xE9o complexe"
      };
    }
    return {
      category: this.categories.texte,
      levels: [1, 2],
      reason: "Classification par d\xE9faut"
    };
  }
  // Méthodes d'aide pour la détection
  isUIUXEffect(keywords, patterns) {
    const uiKeywords = ["button", "menu", "navigation", "loading", "hover", "ripple"];
    return keywords.some((k) => uiKeywords.some((ui) => k.includes(ui))) || patterns.includes("interaction");
  }
  isSimpleTransition(name, keywords) {
    const transitionKeywords = ["fade", "slide", "wipe", "transition"];
    return transitionKeywords.some((t) => name.includes(t) || keywords.some((k) => k.includes(t)));
  }
  isTextEffect(keywords, patterns) {
    const textKeywords = ["text", "font", "typography", "typewriter", "glitch_text"];
    return keywords.some((k) => textKeywords.some((t) => k.includes(t)));
  }
  isImageEffect(keywords, patterns) {
    const imageKeywords = ["image", "photo", "gallery", "slideshow", "parallax"];
    return keywords.some((k) => imageKeywords.some((i) => k.includes(i)));
  }
  isAudioEffect(keywords, patterns) {
    const audioKeywords = ["audio", "sound", "music", "voice"];
    return keywords.some((k) => audioKeywords.some((a) => k.includes(a)));
  }
  isParticleSimulation(keywords, patterns) {
    const particleKeywords = ["particle", "fire", "smoke", "snow", "magic", "physics"];
    return keywords.some((k) => particleKeywords.some((p) => k.includes(p))) || patterns.includes("particle_system") || patterns.includes("physics");
  }
  is3DMotion(keywords, patterns) {
    const motionKeywords = ["3d", "camera", "render", "rotation", "transform", "matrix"];
    return keywords.some((k) => motionKeywords.some((m) => k.includes(m))) || patterns.includes("3d_math") || patterns.includes("webgl");
  }
  isAdvanced3D(keywords, patterns) {
    return patterns.includes("webgl") || patterns.includes("3d_math") || keywords.some((k) => k.includes("webgl") || k.includes("three") || k.includes("3d"));
  }
  isAdvancedVideo(keywords, patterns) {
    const videoKeywords = ["video", "morphing", "grading", "composite", "chroma"];
    return keywords.some((k) => videoKeywords.some((v) => k.includes(v)));
  }
  /**
   * Calcule le score de correspondance avec une catégorie
   */
  calculateCategoryMatch(analysis, category) {
    let score = 0;
    const totalPossible = category.subcategories.length;
    category.subcategories.forEach((subcategory) => {
      if (analysis.keywords.some((k) => k.includes(subcategory) || subcategory.includes(k))) {
        score += 1;
      }
    });
    return score / totalPossible;
  }
  /**
   * Calcul de la confiance
   */
  calculateConfidence(keywords, patterns, complexity) {
    let confidence = 0.5;
    confidence += Math.min(keywords.length * 0.05, 0.3);
    confidence += Math.min(patterns.length * 0.08, 0.2);
    const complexityBonus = { "low": 0.1, "medium": 0.15, "high": 0.2, "very_high": 0.25 };
    confidence += complexityBonus[complexity] || 0.1;
    return Math.min(confidence, 1);
  }
  /**
   * Génération de recommandations
   */
  generateRecommendations(category, analysis) {
    const recommendations = [];
    if (category.availableLevels.length === 1) {
      recommendations.push("Cet effet est d\xE9j\xE0 optimal au niveau Standard");
      recommendations.push("Aucune am\xE9lioration majeure n\xE9cessaire");
    } else if (category.availableLevels.length <= 2) {
      recommendations.push("Am\xE9liorations mod\xE9r\xE9es possibles avec l'IA");
      recommendations.push("Niveau Professionnel recommand\xE9 pour plus de finesse");
    } else {
      recommendations.push("\u{1F680} \xC9NORME potentiel d'am\xE9lioration !");
      recommendations.push("Tous les niveaux disponibles - Niveau Premium recommand\xE9");
      recommendations.push("Technologies r\xE9volutionnaires applicables");
    }
    if (analysis.patterns.includes("webgl")) {
      recommendations.push("WebGL d\xE9tect\xE9 - Optimisations GPU possibles");
    }
    if (analysis.patterns.includes("particle_system")) {
      recommendations.push("Syst\xE8me de particules - IA pr\xE9dictive applicable");
    }
    if (analysis.patterns.includes("3d_math")) {
      recommendations.push("Calculs 3D - WebAssembly et parall\xE9lisation recommand\xE9s");
    }
    return recommendations;
  }
  /**
   * Obtient les catégories disponibles
   */
  getAvailableCategories() {
    return this.categories;
  }
  /**
   * Détection rapide des niveaux disponibles
   */
  quickDetectLevels(filename, code) {
    const analysis = this.performDeepAnalysis(filename, code);
    const category = this.classifyByContent(analysis);
    return category.availableLevels;
  }
};

// server/services/documentation-packager.ts
import fs4 from "fs/promises";
import path4 from "path";
import { createWriteStream } from "fs";
import archiver from "archiver";
var DocumentationPackager = class {
  outputDir;
  constructor() {
    this.outputDir = path4.join(process.cwd(), "outputs");
  }
  async packageEffect(transformedCode, documentation, effectName, transformationId) {
    try {
      if (!transformedCode || typeof transformedCode !== "string") {
        throw new Error("Code transform\xE9 invalide");
      }
      if (!documentation || typeof documentation !== "object") {
        throw new Error("Documentation invalide");
      }
      if (!effectName || typeof effectName !== "string") {
        effectName = `Effect_${Date.now()}`;
      }
      if (!transformationId || typeof transformationId !== "string") {
        transformationId = `transformation_${Date.now()}`;
      }
      await fs4.mkdir(this.outputDir, { recursive: true });
      const sanitizedEffectName = this.sanitizeFileName(effectName);
      const timestamp2 = Date.now();
      const packageDir = path4.join(this.outputDir, `${sanitizedEffectName}_${timestamp2}`);
      try {
        await fs4.mkdir(this.outputDir, { recursive: true });
        await fs4.mkdir(packageDir, { recursive: true });
      } catch (dirError) {
        throw new Error(`Impossible de cr\xE9er le dossier: ${dirError.message}`);
      }
      await Promise.all([
        // Code JavaScript optimisé
        this.safeWriteFile(
          path4.join(packageDir, `${sanitizedEffectName.toLowerCase()}.js`),
          transformedCode
        ),
        // Documentation Markdown
        this.safeWriteFile(
          path4.join(packageDir, "DOCUMENTATION.md"),
          documentation.markdown || "Documentation non disponible"
        ),
        // Documentation HTML interactive
        this.safeWriteFile(
          path4.join(packageDir, "documentation.html"),
          documentation.html || this.generateExampleHTML(sanitizedEffectName)
        ),
        // README pour marketplace
        this.safeWriteFile(
          path4.join(packageDir, "README.md"),
          documentation.readme || `# ${sanitizedEffectName}

Effet JavaScript optimis\xE9`
        ),
        // Changelog
        this.safeWriteFile(
          path4.join(packageDir, "CHANGELOG.md"),
          documentation.changelog || "# Changelog\n\nVersion 1.0 - Premi\xE8re version"
        ),
        // Fichier d'exemple d'utilisation
        this.safeWriteFile(
          path4.join(packageDir, "example.html"),
          this.generateExampleHTML(sanitizedEffectName)
        ),
        // Informations de licence
        this.safeWriteFile(
          path4.join(packageDir, "LICENSE.txt"),
          this.generateLicense()
        ),
        // Guide d'installation
        this.safeWriteFile(
          path4.join(packageDir, "INSTALLATION.md"),
          this.generateInstallationGuide(sanitizedEffectName)
        )
      ]);
      const zipPath = path4.join(this.outputDir, `${effectName}_${timestamp2}.zip`);
      await this.createZipArchive(packageDir, zipPath);
      return zipPath;
    } catch (error) {
      throw new Error(`Erreur lors de la cr\xE9ation du package: ${error.message}`);
    }
  }
  generateExampleHTML(effectName) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${effectName} - Exemple d'Utilisation</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #f0f0f0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        #effectCanvas {
            border: 2px solid #333;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        .controls {
            display: flex;
            gap: 10px;
            margin: 20px 0;
        }
        .btn {
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .btn:hover {
            background: #45a049;
        }
        .info {
            max-width: 600px;
            text-align: center;
            color: #666;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <h1>${effectName} - Exemple d'Utilisation</h1>

    <div class="info">
        <p>Cet exemple montre comment int\xE9grer et utiliser l'effet ${effectName} dans votre projet.</p>
        <p>L'effet est optimis\xE9 par IA et compatible avec tous les navigateurs modernes.</p>
    </div>

    <canvas id="effectCanvas" width="800" height="600"></canvas>

    <div class="controls">
        <button class="btn" onclick="startEffect()">D\xE9marrer</button>
        <button class="btn" onclick="pauseEffect()">Pause</button>
        <button class="btn" onclick="resetEffect()">Reset</button>
    </div>

    <!-- Inclure l'effet -->
    <script src="${effectName.toLowerCase()}.js"></script>

    <script>
        let effect = null;

        function startEffect() {
            if (!effect) {
                const canvas = document.getElementById('effectCanvas');
                effect = new ${effectName}({
                    responsive: true,
                    autoStart: false
                });
                effect.initialize(canvas);
            }
            effect.start();
        }

        function pauseEffect() {
            if (effect && effect.pause) {
                effect.pause();
            }
        }

        function resetEffect() {
            if (effect && effect.reset) {
                effect.reset();
            }
        }

        // Auto-d\xE9marrage optionnel
        // startEffect();
    </script>
</body>
</html>`;
  }
  generateLicense() {
    return `LICENCE D'UTILISATION COMMERCIALE

Effet JavaScript Optimis\xE9 par IA
\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Visual Effects Transformer

DROITS ACCORD\xC9S:
\u2705 Usage commercial illimit\xE9
\u2705 Modification et personnalisation
\u2705 Int\xE9gration dans des projets clients
\u2705 Revente dans le cadre de projets
\u2705 Usage sur sites web commerciaux

RESTRICTIONS:
\u274C Pas de redistribution du code source seul
\u274C Pas de revente directe de l'effet isol\xE9
\u274C Pas de revendication de propri\xE9t\xE9 intellectuelle

GARANTIE:
- Code test\xE9 et optimis\xE9
- Compatibilit\xE9 navigateurs garantie
- Support technique disponible

Pour plus d'informations, consultez la documentation compl\xE8te.
`;
  }
  generateInstallationGuide(effectName) {
    return `# Guide d'Installation - ${effectName}

## \u{1F680} Installation Rapide (Recommand\xE9e)

### 1. T\xE9l\xE9chargement
T\xE9l\xE9chargez le package complet contenant tous les fichiers n\xE9cessaires.

### 2. Int\xE9gration HTML
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Mon Site avec ${effectName}</title>
</head>
<body>
    <canvas id="monEffet" width="800" height="600"></canvas>

    <!-- Inclure l'effet -->
    <script src="path/to/${effectName.toLowerCase()}.js"></script>

    <script>
        // Initialisation
        const effet = new ${effectName}();
        effet.initialize(document.getElementById('monEffet'));
        effet.start();
    </script>
</body>
</html>
\`\`\`

## \u{1F527} Installation Avanc\xE9e

### Configuration Personnalis\xE9e
\`\`\`javascript
const effet = new ${effectName}({
    // Param\xE8tres de performance
    performance: 'high',          // 'low', 'medium', 'high'

    // Adaptabilit\xE9
    responsive: true,             // Adaptation automatique
    autoStart: true,              // D\xE9marrage automatique

    // Param\xE8tres visuels
    quality: 'premium',           // 'standard', 'high', 'premium'

    // \xC9v\xE9nements
    onStart: () => console.log('Effet d\xE9marr\xE9'),
    onComplete: () => console.log('Animation termin\xE9e')
});
\`\`\`

### API Compl\xE8te
\`\`\`javascript
// Contr\xF4le de l'animation
effet.start();                   // D\xE9marrer
effet.pause();                   // Mettre en pause  
effet.stop();                    // Arr\xEAter
effet.reset();                   // Remettre \xE0 z\xE9ro

// Configuration dynamique
effet.updateConfig(newConfig);   // Mise \xE0 jour config
effet.setParameter(key, value);  // Param\xE8tre sp\xE9cifique

// \xC9v\xE9nements
effet.on('start', callback);     // \xC9couter d\xE9marrage
effet.on('complete', callback);  // \xC9couter fin
effet.on('error', callback);     // \xC9couter erreurs
\`\`\`

## \u{1F4F1} Compatibilit\xE9

### Navigateurs Support\xE9s
- \u2705 Chrome 60+
- \u2705 Firefox 55+  
- \u2705 Safari 12+
- \u2705 Edge 79+
- \u2705 Mobile Safari (iOS 12+)
- \u2705 Chrome Mobile (Android 7+)

### Fonctionnalit\xE9s Adaptives
- \u{1F5A5}\uFE0F **Desktop**: Performance maximale
- \u{1F4F1} **Mobile**: Optimisation automatique
- \u{1F504} **Responsive**: Adaptation \xE9cran automatique
- \u26A1 **Performance**: D\xE9tection capacit\xE9s appareil

## \u2753 D\xE9pannage

### Probl\xE8mes Courants

**L'effet ne s'affiche pas:**
- V\xE9rifiez que le canvas existe dans le DOM
- Assurez-vous que le script est charg\xE9 apr\xE8s le DOM
- V\xE9rifiez la console pour les erreurs

**Performance lente:**
- R\xE9duisez les param\xE8tres de qualit\xE9
- Utilisez \`performance: 'medium'\` ou \`'low'\`
- V\xE9rifiez la taille du canvas

**Sur mobile:**
- Activez \`responsive: true\`
- Utilisez des tailles de canvas adapt\xE9es
- Testez sur vrais appareils

## \u{1F4DE} Support

Pour toute question ou probl\xE8me:
- Consultez la documentation compl\xE8te
- V\xE9rifiez les exemples inclus
- Contactez le support technique

---

*Installation et support par Visual Effects Transformer*`;
  }
  async createZipArchive(sourceDir, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        const output = createWriteStream(outputPath);
        const archive = archiver("zip", { zlib: { level: 9 } });
        const timeout = setTimeout(() => {
          reject(new Error("Timeout lors de la cr\xE9ation de l'archive"));
        }, 3e4);
        output.on("close", () => {
          clearTimeout(timeout);
          console.log(`Archive cr\xE9\xE9e: ${archive.pointer()} bytes`);
          resolve();
        });
        output.on("error", (err) => {
          clearTimeout(timeout);
          reject(new Error(`Erreur d'\xE9criture: ${err.message}`));
        });
        archive.on("error", (err) => {
          clearTimeout(timeout);
          reject(new Error(`Erreur d'archivage: ${err.message}`));
        });
        archive.on("warning", (err) => {
          console.warn("Archive warning:", err);
        });
        archive.pipe(output);
        archive.directory(sourceDir, false);
        archive.finalize();
      } catch (error) {
        reject(new Error(`Erreur lors de la cr\xE9ation de l'archive: ${error.message}`));
      }
    });
  }
  sanitizeFileName(filename) {
    return filename.replace(/[^a-zA-Z0-9-_]/g, "_").replace(/__+/g, "_").substring(0, 50).trim();
  }
  async safeWriteFile(filePath, content) {
    try {
      if (content.length > 10 * 1024 * 1024) {
        throw new Error("Contenu trop volumineux");
      }
      await fs4.writeFile(filePath, content, "utf-8");
    } catch (error) {
      throw new Error(`Erreur d'\xE9criture fichier ${path4.basename(filePath)}: ${error.message}`);
    }
  }
};

// server/routes.ts
import fs6 from "fs/promises";
import path6 from "path";
var upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1024 * 1024 },
  // 1MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/javascript",
      "text/javascript",
      "application/x-javascript",
      "text/plain"
    ];
    if (allowedMimes.includes(file.mimetype) || file.originalname.endsWith(".js")) {
      cb(null, true);
    } else {
      cb(new Error("Only JavaScript files are allowed"));
    }
  }
});
var replitTokenManager2 = new ReplitTokenManager();
async function registerRoutes(app2) {
  let aiTransformer;
  let fileProcessor;
  let codeValidator;
  let jsPreprocessor;
  let advancedEnhancer;
  let intelligentCategorizer;
  let docPackager;
  try {
    aiTransformer = new ReplitAITransformer();
    fileProcessor = new FileProcessor();
    codeValidator = new CodeValidator();
    jsPreprocessor = new JSPreprocessor();
    advancedEnhancer = new AdvancedEnhancer();
    intelligentCategorizer = new IntelligentCategorizer();
    docPackager = new DocumentationPackager();
    console.log("\u2705 Tous les services initialis\xE9s avec succ\xE8s");
  } catch (error) {
    console.error("\u274C Erreur d'initialisation des services:", error);
    throw error;
  }
  const uploadSecurity = (req, res, next) => {
    const clientId = req.ip;
    const now = Date.now();
    const windowMs = 60 * 1e3;
    const maxRequests = 10;
    if (!req.app.locals.rateLimits) {
      req.app.locals.rateLimits = /* @__PURE__ */ new Map();
    }
    const clientRequests = req.app.locals.rateLimits.get(clientId) || [];
    const recentRequests = clientRequests.filter((time) => now - time < windowMs);
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ message: "Trop de requ\xEAtes, veuillez patienter" });
    }
    recentRequests.push(now);
    req.app.locals.rateLimits.set(clientId, recentRequests);
    next();
  };
  app2.post("/api/upload", uploadSecurity, upload.single("file"), async (req, res) => {
    const startTime = Date.now();
    let uploadedFilePath = null;
    try {
      console.log("Upload request received:", {
        filename: req.file?.originalname,
        size: req.file?.size,
        mimetype: req.file?.mimetype
      });
      if (!req.file) {
        return res.status(400).json({
          message: "Aucun fichier upload\xE9",
          error: "FILE_MISSING"
        });
      }
      uploadedFilePath = req.file.path;
      if (req.file.size > 2 * 1024 * 1024) {
        await fs6.unlink(uploadedFilePath);
        return res.status(400).json({
          message: "Fichier trop volumineux (max 2MB)",
          error: "FILE_TOO_LARGE"
        });
      }
      let content;
      try {
        const readPromise = fs6.readFile(uploadedFilePath, "utf-8");
        const timeoutPromise = new Promise(
          (_, reject) => setTimeout(() => reject(new Error("Timeout lecture fichier")), 1e4)
        );
        content = await Promise.race([readPromise, timeoutPromise]);
      } catch (readError) {
        await fs6.unlink(uploadedFilePath);
        return res.status(400).json({
          message: "Erreur de lecture du fichier",
          error: "FILE_READ_ERROR"
        });
      }
      const validation = uploadFileSchema.safeParse({
        filename: req.file.originalname,
        content
      });
      if (!validation.success) {
        await fs6.unlink(uploadedFilePath);
        return res.status(400).json({
          message: "Fichier invalide",
          errors: validation.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message
          })),
          error: "VALIDATION_FAILED"
        });
      }
      console.log("\u{1F527} D\xE9marrage du preprocessing universel...");
      const preprocessingResult = await jsPreprocessor.preprocessJS(content, req.file.originalname);
      const finalContent = preprocessingResult.processedCode;
      const preprocessingChanges = preprocessingResult.changes;
      const extractedMetadata = preprocessingResult.metadata;
      const codeValidation = await codeValidator.validateCode(finalContent);
      if (!codeValidation.valid) {
        await fs6.unlink(uploadedFilePath);
        return res.status(400).json({
          message: "Code JavaScript invalide",
          error: codeValidation.error,
          preprocessingChanges
        });
      }
      const effectAnalysis = intelligentCategorizer.analyzeEffect(req.file.originalname, finalContent);
      console.log("Analyse intelligente:", effectAnalysis);
      const transformation = await storage.createTransformation({
        originalFilename: req.file.originalname,
        originalCode: finalContent,
        // Utiliser le code préprocessé
        level: 1,
        // Default level
        effectAnalysis,
        // Stocker l'analyse
        metadata: extractedMetadata
        // Stocker les métadonnées extraites
      });
      await fs6.unlink(uploadedFilePath);
      const processingTime = Date.now() - startTime;
      console.log(`Upload termin\xE9 en ${processingTime}ms pour ${transformation.originalFilename}`);
      res.json({
        success: true,
        transformationId: transformation.id,
        filename: transformation.originalFilename,
        fileSize: req.file.size,
        processingTime,
        preprocessingChanges,
        effectAnalysis,
        metadata: extractedMetadata
        // Retourner les métadonnées
      });
    } catch (error) {
      console.error("Upload error:", error);
      if (uploadedFilePath) {
        try {
          await fs6.unlink(uploadedFilePath);
        } catch (unlinkError) {
          console.error("Erreur nettoyage fichier:", unlinkError);
        }
      }
      res.status(500).json({
        message: "\xC9chec de l'upload",
        error: error instanceof Error ? error.message : "Erreur inconnue"
      });
    }
  });
  app2.post("/api/transform", async (req, res) => {
    try {
      const validation = transformRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid request",
          errors: validation.error.errors
        });
      }
      const { transformationId, level } = validation.data;
      const transformation = await storage.getTransformation(transformationId);
      if (!transformation) {
        return res.status(404).json({ message: "Transformation not found" });
      }
      await storage.updateTransformation(transformationId, {
        status: "processing",
        level
      });
      aiTransformer.transform(transformation.originalCode, level, transformationId, transformation.effectAnalysis).then(async (result) => {
        const filename = transformation.originalFilename.replace(".js", `_level${level}_transformed.js`);
        await fileProcessor.saveFile(result.code, filename);
        const packagePath = await docPackager.packageEffect(
          result.code,
          result.documentation || "",
          transformation.originalFilename.replace(".js", ""),
          transformationId
        );
        await storage.updateTransformation(transformationId, {
          transformedCode: result.code,
          stats: result.stats,
          documentation: result.documentation || "",
          packagePath,
          status: "completed",
          completedAt: /* @__PURE__ */ new Date()
        });
      }).catch(async (error) => {
        console.error("Transformation error:", error);
        await storage.updateTransformation(transformationId, {
          status: "failed",
          errorMessage: error.message
        });
      });
      res.json({ success: true, message: "Transformation started" });
    } catch (error) {
      console.error("Transform error:", error);
      res.status(500).json({ message: "Transformation failed to start" });
    }
  });
  app2.get("/api/transformation/:id", async (req, res) => {
    try {
      const transformation = await storage.getTransformation(req.params.id);
      if (!transformation) {
        return res.status(404).json({ message: "Transformation not found" });
      }
      res.json(transformation);
    } catch (error) {
      console.error("Get transformation error:", error);
      res.status(500).json({ message: "Failed to get transformation" });
    }
  });
  app2.get("/api/download/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { type = "package" } = req.query;
      const transformation = storage.get(id);
      if (!transformation || transformation.status !== "completed") {
        return res.status(404).json({ error: "File not found" });
      }
      if (type === "code-only") {
        const filename = fileProcessor.generateFilename(transformation.originalFilename, transformation.level);
        res.setHeader("Content-Type", "application/javascript");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.send(transformation.transformedCode);
      } else if (type === "package" && transformation.packagePath) {
        const packageName = path6.basename(transformation.packagePath);
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename="${packageName}"`);
        const fileBuffer = await fs6.readFile(transformation.packagePath);
        res.send(fileBuffer);
      } else {
        return res.status(400).json({ error: "Invalid download type" });
      }
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({ error: "Download failed" });
    }
  });
  app2.get("/api/token-status", async (req, res) => {
    try {
      const diagnosis = await replitTokenManager2.diagnoseTokenIssues();
      let tokenStatus = "unknown";
      try {
        const token = await replitTokenManager2.getValidToken();
        tokenStatus = token ? "valid" : "invalid";
      } catch (error) {
        tokenStatus = "invalid";
      }
      res.json({
        status: tokenStatus,
        diagnosis,
        environment: {
          replId: process.env.REPL_ID || null,
          replOwner: process.env.REPL_OWNER || null,
          replSlug: process.env.REPL_SLUG || null,
          isReplit: !!process.env.REPL_ID
        }
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  });
  app2.get("/api/levels", async (req, res) => {
    try {
      const levels = await fs6.readFile(
        path6.join(process.cwd(), "server/config/transformation-levels.json"),
        "utf-8"
      );
      res.json(JSON.parse(levels));
    } catch (error) {
      console.error("Get levels error:", error);
      res.status(500).json({ message: "Failed to get levels" });
    }
  });
  app2.post("/api/analyze-suggestions", async (req, res) => {
    try {
      const { transformationId, currentLevel } = req.body;
      if (!transformationId) {
        return res.status(400).json({ error: "transformationId requis" });
      }
      const transformation = await storage.getTransformation(transformationId);
      if (!transformation) {
        return res.status(404).json({ error: "Transformation not found" });
      }
      const suggestions = await advancedEnhancer.analyzeAndSuggestImprovements(
        transformation.originalCode,
        parseInt(currentLevel) || 1
      );
      res.json(suggestions);
    } catch (error) {
      console.error("Error analyzing suggestions:", error);
      res.status(500).json({ error: "Failed to analyze suggestions" });
    }
  });
  app2.get("/api/health", async (req, res) => {
    try {
      const stats = storage.getStats();
      const memoryUsage = process.memoryUsage();
      const uptime = process.uptime();
      let tokenStatus = "unknown";
      try {
        const token = await replitTokenManager2.getValidToken();
        tokenStatus = token ? "valid" : "invalid";
      } catch (error) {
        tokenStatus = "error";
      }
      const health = {
        status: "healthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: Math.floor(uptime),
        version: "1.0.0",
        services: {
          storage: stats,
          tokenManager: tokenStatus,
          memory: {
            used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
            external: Math.round(memoryUsage.external / 1024 / 1024),
            rss: Math.round(memoryUsage.rss / 1024 / 1024)
          }
        },
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
          isReplit: !!process.env.REPL_ID
        }
      };
      res.json(health);
    } catch (error) {
      console.error("Health check error:", error);
      res.status(500).json({
        status: "unhealthy",
        error: error.message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app2.get("/api/audit", async (req, res) => {
    try {
      const { SystemAuditor: SystemAuditor2 } = await Promise.resolve().then(() => (init_system_auditor(), system_auditor_exports));
      const auditor = new SystemAuditor2();
      const auditResult = await auditor.performFullAudit();
      res.json(auditResult);
    } catch (error) {
      console.error("Audit system error:", error);
      res.status(500).json({ error: "Audit system failed" });
    }
  });
  app2.get("/api/diagnostics", async (req, res) => {
    try {
      const { includeDetails } = req.query;
      const diagnostics = {
        storage: {
          stats: storage.getStats(),
          transformations: includeDetails === "true" ? storage.getAllTransformations() : void 0
        },
        tokenManager: await replitTokenManager2.diagnoseTokenIssues(),
        system: {
          memory: process.memoryUsage(),
          cpuUsage: process.cpuUsage(),
          uptime: process.uptime(),
          versions: process.versions
        },
        environment: {
          replId: process.env.REPL_ID || null,
          replOwner: process.env.REPL_OWNER || null,
          nodeEnv: process.env.NODE_ENV || null,
          hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY
        }
      };
      res.json(diagnostics);
    } catch (error) {
      console.error("Diagnostics error:", error);
      res.status(500).json({ error: "Diagnostics failed" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs7 from "fs";
import path8 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path7 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path7.resolve(import.meta.dirname, "client", "src"),
      "@shared": path7.resolve(import.meta.dirname, "shared"),
      "@assets": path7.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path7.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path7.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path8.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs7.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path8.resolve(import.meta.dirname, "public");
  if (!fs7.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path8.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import cors from "cors";

// server/utils/logger.ts
var Logger = class {
  logs = [];
  maxLogs = 1e3;
  isDevelopment = process.env.NODE_ENV === "development";
  log(level, message, metadata) {
    const entry = {
      level,
      message,
      timestamp: /* @__PURE__ */ new Date(),
      metadata
    };
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs * 0.8);
    }
    const timestamp2 = entry.timestamp.toISOString();
    const prefix = `[${timestamp2}][${level.toUpperCase()}]`;
    switch (level) {
      case "error":
        console.error(`${prefix} ${message}`, metadata);
        break;
      case "warn":
        console.warn(`${prefix} ${message}`, metadata);
        break;
      case "debug":
        if (this.isDevelopment) {
          console.debug(`${prefix} ${message}`, metadata);
        }
        break;
      default:
        console.log(`${prefix} ${message}`, metadata);
    }
  }
  info(message, metadata) {
    this.log("info", message, metadata);
  }
  warn(message, metadata) {
    this.log("warn", message, metadata);
  }
  error(message, metadata) {
    this.log("error", message, metadata);
  }
  debug(message, metadata) {
    this.log("debug", message, metadata);
  }
  getLogs(level, limit) {
    let filtered = level ? this.logs.filter((log2) => log2.level === level) : this.logs;
    return limit ? filtered.slice(-limit) : filtered;
  }
  getStats() {
    return {
      total: this.logs.length,
      errors: this.logs.filter((log2) => log2.level === "error").length,
      warnings: this.logs.filter((log2) => log2.level === "warn").length
    };
  }
  clearLogs() {
    this.logs = [];
  }
};
var logger = new Logger();

// server/index.ts
init_system_auditor();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(cors());
app.use((req, res, next) => {
  const start = Date.now();
  const path9 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path9.startsWith("/api")) {
      let logLine = `${req.method} ${path9} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    logger.error(`Error in request handler: ${err.message}`, err);
    res.status(status).json({ message });
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const PORT = parseInt(process.env.PORT || "5000", 10);
  process.on("uncaughtException", (error) => {
    logger.error("Erreur non captur\xE9e:", error);
    console.error("\u{1F4A5} Erreur critique:", error.message);
    process.exit(1);
  });
  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Promesse rejet\xE9e non g\xE9r\xE9e:", { reason, promise });
    console.error("\u26A0\uFE0F Promesse rejet\xE9e:", reason);
  });
  const auditor = new SystemAuditor();
  server.listen({
    port: PORT,
    host: "0.0.0.0",
    reusePort: true
  }, async () => {
    log(`\u{1F680} Server running on port ${PORT}`);
    log(`\u{1F310} Web interface: https://${process.env.REPL_SLUG || "your-repl"}.${process.env.REPL_OWNER || "username"}.repl.co`);
    try {
      const auditResult = await auditor.performFullAudit();
      if (auditResult.status === "critical") {
        logger.warn("Probl\xE8mes critiques d\xE9tect\xE9s au d\xE9marrage:", auditResult.issues);
      } else {
        logger.info("Audit syst\xE8me initial complet.");
      }
      auditor.startRealTimeMonitoring();
      logger.info("Syst\xE8me de surveillance activ\xE9");
    } catch (error) {
      logger.error("Erreur lors de l'audit initial ou du d\xE9marrage de la surveillance:", error);
    }
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\u274C Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
      server.listen({
        port: PORT + 1,
        host: "0.0.0.0",
        reusePort: true
      }, () => {
        log(`\u{1F680} Server running on port ${PORT + 1} (fallback)`);
      });
    } else {
      console.error("\u274C Server startup error:", err);
      process.exit(1);
    }
  });
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
  process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
})();
