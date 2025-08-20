import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { uploadFileSchema, transformRequestSchema } from "@shared/schema";
import { ReplitAITransformer } from "./services/replit-ai-transformer";
import { FileProcessor } from "./services/file-processor";
import { CodeValidator } from "./services/code-validator";
import { JSPreprocessor } from "./services/js-preprocessor";
import { AdvancedEnhancer } from "./services/advanced-enhancer";
import { IntelligentCategorizer } from "./services/intelligent-categorizer";
import { DocumentationPackager } from "./services/documentation-packager";
import fs from "fs/promises";
import path from "path";

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

export async function registerRoutes(app: Express): Promise<Server> {
  const aiTransformer = new ReplitAITransformer();
  const fileProcessor = new FileProcessor();
  const codeValidator = new CodeValidator();
  const jsPreprocessor = new JSPreprocessor();
  const advancedEnhancer = new AdvancedEnhancer();
  const intelligentCategorizer = new IntelligentCategorizer();
  const docPackager = new DocumentationPackager();

  // Upload JavaScript file
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      console.log('Upload request received:', req.file, req.body);

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Read file content
      const filePath = req.file.path;
      const content = await fs.readFile(filePath, 'utf-8');

      // Validate file
      const validation = uploadFileSchema.safeParse({
        filename: req.file.originalname,
        content
      });

      if (!validation.success) {
        await fs.unlink(filePath); // Clean up
        return res.status(400).json({ 
          message: "Invalid file", 
          errors: validation.error.errors 
        });
      }

      // Préprocesser le JavaScript pour le standardiser
      const preprocessResult = await jsPreprocessor.preprocessJS(content, req.file.originalname);

      let finalContent = content;
      let preprocessingChanges: string[] = [];

      if (preprocessResult.isValid) {
        finalContent = preprocessResult.processedCode;
        preprocessingChanges = preprocessResult.changes;
        console.log('Preprocessing réussi:', preprocessingChanges);
      } else {
        console.log('Preprocessing échoué, tentative avec code original:', preprocessResult.error);
        // Continuer avec le code original si le preprocessing échoue
      }

      // Valider le JavaScript final
      const codeValidation = await codeValidator.validateCode(finalContent);
      if (!codeValidation.valid) {
        await fs.unlink(filePath); // Clean up
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
        effectAnalysis: effectAnalysis // Stocker l'analyse
      });

      // Clean up uploaded file
      await fs.unlink(filePath);

      res.json({ 
        success: true, 
        transformationId: transformation.id,
        filename: transformation.originalFilename,
        preprocessingChanges,
        effectAnalysis // Retourner l'analyse au client
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: "Upload failed" });
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

  // Get transformation levels configuration
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

  const httpServer = createServer(app);
  return httpServer;
}