import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { uploadFileSchema, transformRequestSchema } from "@shared/schema";
import { ReplitAITransformer } from "./services/replit-ai-transformer";
import { FileProcessor } from "./services/file-processor";
import { CodeValidator } from "./services/code-validator";
import { JSPreprocessor } from "./services/js-preprocessor";
import { UniversalPreprocessor } from "./services/universal-preprocessor";
import { AdvancedEnhancer } from "./services/advanced-enhancer";
import { IntelligentCategorizer } from "./services/intelligent-categorizer";
import { DocumentationPackager } from "./services/documentation-packager";
import fs from "fs/promises";
import path from "path";
import { ReplitTokenManager } from "./services/replit-token-manager"; // Import the ReplitTokenManager

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 1024 * 1024 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/javascript',
      'text/javascript',
      'application/x-javascript',
      'text/plain'
    ];

    if (allowedMimes.includes(file.mimetype) || file.originalname.endsWith('.js')) {
      cb(null, true);
    } else {
      cb(new Error('Only JavaScript files are allowed'));
    }
  }
});

// Initialize the ReplitTokenManager
const replitTokenManager = new ReplitTokenManager();

export async function registerRoutes(app: Express): Promise<Server> {
  const aiTransformer = new ReplitAITransformer();
  const fileProcessor = new FileProcessor();
  const codeValidator = new CodeValidator();
  const jsPreprocessor = new JSPreprocessor();
  const advancedEnhancer = new AdvancedEnhancer();
  const intelligentCategorizer = new IntelligentCategorizer();
  const docPackager = new DocumentationPackager();

  // Middleware de sécurité pour les uploads
  const uploadSecurity = (req: any, res: any, next: any) => {
    // Rate limiting basique
    const clientId = req.ip;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 10;

    if (!req.app.locals.rateLimits) {
      req.app.locals.rateLimits = new Map();
    }

    const clientRequests = req.app.locals.rateLimits.get(clientId) || [];
    const recentRequests = clientRequests.filter((time: number) => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ message: "Trop de requêtes, veuillez patienter" });
    }

    recentRequests.push(now);
    req.app.locals.rateLimits.set(clientId, recentRequests);
    next();
  };

  // Upload JavaScript file
  app.post("/api/upload", uploadSecurity, upload.single('file'), async (req, res) => {
    const startTime = Date.now();
    let uploadedFilePath: string | null = null;

    try {
      console.log('Upload request received:', {
        filename: req.file?.originalname,
        size: req.file?.size,
        mimetype: req.file?.mimetype
      });

      if (!req.file) {
        return res.status(400).json({
          message: "Aucun fichier uploadé",
          error: "FILE_MISSING"
        });
      }

      uploadedFilePath = req.file.path;

      // Validation de la taille du fichier
      if (req.file.size > 2 * 1024 * 1024) { // 2MB max
        await fs.unlink(uploadedFilePath);
        return res.status(400).json({
          message: "Fichier trop volumineux (max 2MB)",
          error: "FILE_TOO_LARGE"
        });
      }

      // Read file content avec timeout
      let content: string;
      try {
        const readPromise = fs.readFile(uploadedFilePath, 'utf-8');
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout lecture fichier')), 10000)
        );

        content = await Promise.race([readPromise, timeoutPromise]);
      } catch (readError) {
        await fs.unlink(uploadedFilePath);
        return res.status(400).json({
          message: "Erreur de lecture du fichier",
          error: "FILE_READ_ERROR"
        });
      }

      // Validate file avec gestion d'erreurs robuste
      const validation = uploadFileSchema.safeParse({
        filename: req.file.originalname,
        content
      });

      if (!validation.success) {
        await fs.unlink(uploadedFilePath);
        return res.status(400).json({
          message: "Fichier invalide",
          errors: validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          })),
          error: "VALIDATION_FAILED"
        });
      }

      // Preprocessing automatique du JavaScript avec module universel
      console.log('🔧 Démarrage du preprocessing universel...');
      const preprocessingResult = await jsPreprocessor.preprocessJS(content, req.file.originalname);
      const finalContent = preprocessingResult.processedCode;
      const preprocessingChanges = preprocessingResult.changes;
      const extractedMetadata = preprocessingResult.metadata;

      // Valider le JavaScript final
      const codeValidation = await codeValidator.validateCode(finalContent);
      if (!codeValidation.valid) {
        await fs.unlink(uploadedFilePath); // Clean up
        return res.status(400).json({
          message: "Code JavaScript invalide",
          error: codeValidation.error,
          preprocessingChanges
        });
      }

      // Analyse intelligente de l'effet
      const effectAnalysis = intelligentCategorizer.analyzeEffect(req.file.originalname, finalContent);
      console.log('Analyse intelligente:', effectAnalysis);

      // Create transformation record
      const transformation = await storage.createTransformation({
        originalFilename: req.file.originalname,
        originalCode: finalContent, // Utiliser le code préprocessé
        level: 1, // Default level
        effectAnalysis: effectAnalysis, // Stocker l'analyse
        metadata: extractedMetadata // Stocker les métadonnées extraites
      });

      // Clean up uploaded file
      await fs.unlink(uploadedFilePath);

      const processingTime = Date.now() - startTime;
      console.log(`Upload terminé en ${processingTime}ms pour ${transformation.originalFilename}`);

      res.json({
        success: true,
        transformationId: transformation.id,
        filename: transformation.originalFilename,
        fileSize: req.file.size,
        processingTime,
        preprocessingChanges,
        effectAnalysis,
        metadata: extractedMetadata // Retourner les métadonnées
      });

    } catch (error) {
      console.error('Upload error:', error);

      // Nettoyage en cas d'erreur
      if (uploadedFilePath) {
        try {
          await fs.unlink(uploadedFilePath);
        } catch (unlinkError) {
          console.error('Erreur nettoyage fichier:', unlinkError);
        }
      }

      res.status(500).json({
        message: "Échec de l'upload",
        error: error instanceof Error ? error.message : "Erreur inconnue"
      });
    }
  });

  // Start transformation
  app.post("/api/transform", async (req, res) => {
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

      // Update status to processing
      await storage.updateTransformation(transformationId, {
        status: "processing",
        level
      });

      // Start transformation in background
      aiTransformer.transform(transformation.originalCode, level, transformationId, transformation.effectAnalysis)
        .then(async (result) => {
          // Generate filename for the transformed code
          const filename = transformation.originalFilename.replace('.js', `_level${level}_transformed.js`);

          // Save the result and package documentation
          await fileProcessor.saveFile(result.code, filename);

          // Create complete package with documentation
          const packagePath = await docPackager.packageEffect(
            result.code,
            result.documentation || '',
            transformation.originalFilename.replace('.js', ''),
            transformationId
          );

          // Update storage with the result
          await storage.updateTransformation(transformationId, {
            transformedCode: result.code,
            stats: result.stats,
            documentation: result.documentation || '',
            packagePath: packagePath,
            status: 'completed',
            completedAt: new Date()
          });
        })
        .catch(async (error) => {
          console.error('Transformation error:', error);
          await storage.updateTransformation(transformationId, {
            status: "failed",
            errorMessage: error.message
          });
        });

      res.json({ success: true, message: "Transformation started" });
    } catch (error) {
      console.error('Transform error:', error);
      res.status(500).json({ message: "Transformation failed to start" });
    }
  });

  // Get transformation status
  app.get("/api/transformation/:id", async (req, res) => {
    try {
      const transformation = await storage.getTransformation(req.params.id);
      if (!transformation) {
        return res.status(404).json({ message: "Transformation not found" });
      }

      res.json(transformation);
    } catch (error) {
      console.error('Get transformation error:', error);
      res.status(500).json({ message: "Failed to get transformation" });
    }
  });

  // Download transformed file with complete documentation package
  app.get("/api/download/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { type = 'package' } = req.query;
      const transformation = storage.get(id);

      if (!transformation || transformation.status !== 'completed') {
        return res.status(404).json({ error: 'File not found' });
      }

      if (type === 'code-only') {
        // Télécharger uniquement le code JavaScript
        const filename = fileProcessor.generateFilename(transformation.originalFilename, transformation.level);
        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(transformation.transformedCode);
      } else if (type === 'package' && transformation.packagePath) {
        // Télécharger le package complet avec documentation
        const packageName = path.basename(transformation.packagePath);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${packageName}"`);

        const fileBuffer = await fs.readFile(transformation.packagePath);
        res.send(fileBuffer);
      } else {
        return res.status(400).json({ error: 'Invalid download type' });
      }
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Download failed' });
    }
  });

  // Token diagnostics endpoint
  app.get("/api/token-status", async (req, res) => {
    try {
      const diagnosis = await replitTokenManager.diagnoseTokenIssues();
      let tokenStatus = 'unknown';

      try {
        const token = await replitTokenManager.getValidToken();
        tokenStatus = token ? 'valid' : 'invalid';
      } catch (error) {
        tokenStatus = 'invalid';
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
        status: 'error',
        message: error.message
      });
    }
  });

  // Get available transformation levels
  app.get("/api/levels", async (req, res) => {
    try {
      const levels = await fs.readFile(
        path.join(process.cwd(), 'server/config/transformation-levels.json'),
        'utf-8'
      );
      res.json(JSON.parse(levels));
    } catch (error) {
      console.error('Get levels error:', error);
      res.status(500).json({ message: "Failed to get levels" });
    }
  });

  // Get AI suggestions API endpoint
  app.post("/api/analyze-suggestions", async (req, res) => {
    try {
      const { transformationId, currentLevel } = req.body;

      if (!transformationId) {
        return res.status(400).json({ error: 'transformationId requis' });
      }

      const transformation = await storage.getTransformation(transformationId);
      if (!transformation) {
        return res.status(404).json({ error: 'Transformation not found' });
      }

      // Analyser le code et suggérer des améliorations
      const suggestions = await advancedEnhancer.analyzeAndSuggestImprovements(
        transformation.originalCode,
        parseInt(currentLevel) || 1
      );

      res.json(suggestions);
    } catch (error) {
      console.error('Error analyzing suggestions:', error);
      res.status(500).json({ error: 'Failed to analyze suggestions' });
    }
  });

  // Health check et diagnostics
  app.get("/api/health", async (req, res) => {
    try {
      const stats = storage.getStats();
      const memoryUsage = process.memoryUsage();
      const uptime = process.uptime();

      // Test des services critiques
      let tokenStatus = 'unknown';
      try {
        const token = await replitTokenManager.getValidToken();
        tokenStatus = token ? 'valid' : 'invalid';
      } catch (error) {
        tokenStatus = 'error';
      }

      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(uptime),
        version: '1.0.0',
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
      console.error('Health check error:', error);
      res.status(500).json({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Audit système complet
  app.get("/api/audit", async (req, res) => {
    try {
      const { SystemAuditor } = await import('./utils/system-auditor');
      const auditor = new SystemAuditor();
      const auditResult = await auditor.performFullAudit();
      
      res.json(auditResult);
    } catch (error) {
      console.error('Audit system error:', error);
      res.status(500).json({ error: 'Audit system failed' });
    }
  });

  // Diagnostics avancés (endpoint sécurisé)
  app.get("/api/diagnostics", async (req, res) => {
    try {
      const { includeDetails } = req.query;

      const diagnostics = {
        storage: {
          stats: storage.getStats(),
          transformations: includeDetails === 'true' ? storage.getAllTransformations() : undefined
        },
        tokenManager: await replitTokenManager.diagnoseTokenIssues(),
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
      console.error('Diagnostics error:', error);
      res.status(500).json({ error: 'Diagnostics failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}