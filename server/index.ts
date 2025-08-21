import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes, uploadFile, transformFile, getTransformationStatus, downloadFile, getLevels, analyzeEffect, previewDocumentation } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from 'cors'; // Added cors
import path from 'path'; // Added path
import { fileURLToPath } from 'url'; // Added fileURLToPath
import { logger } from './utils/logger.js'; // Added logger
import { SystemAuditor } from './utils/system-auditor.js'; // Added SystemAuditor

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // Added cors middleware

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the error for debugging purposes
    logger.error(`Error in request handler: ${err.message}`, err);

    res.status(status).json({ message });
    // Removed the re-throw to prevent uncaught exceptions if not handled elsewhere
    // throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const PORT = parseInt(process.env.PORT || '5000', 10);

  // Gestion d'erreurs globales
  process.on('uncaughtException', (error) => {
    logger.error('Erreur non capturée:', error);
    console.error('💥 Erreur critique:', error.message);
    // In a production environment, you might want to attempt a graceful shutdown here.
    // For now, we'll just log and exit.
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Promesse rejetée non gérée:', { reason, promise });
    console.error('⚠️ Promesse rejetée:', reason);
    // Similar to uncaughtException, consider graceful shutdown.
  });

  // Initialisation du système d'audit
  const auditor = new SystemAuditor();

  server.listen({
    port: PORT,
    host: "0.0.0.0",
    reusePort: true,
  }, async () => {
    log(`🚀 Server running on port ${PORT}`);
    log(`🌐 Web interface: https://${process.env.REPL_SLUG || 'your-repl'}.${process.env.REPL_OWNER || 'username'}.repl.co`);

    // Audit initial du système
    try {
      const auditResult = await auditor.performFullAudit();
      if (auditResult.status === 'critical') {
        logger.warn('Problèmes critiques détectés au démarrage:', auditResult.issues);
      } else {
        logger.info('Audit système initial complet.');
      }

      // Démarrer la surveillance temps réel
      auditor.startRealTimeMonitoring();

      logger.info('Système de surveillance activé');
    } catch (error) {
      logger.error('Erreur lors de l\'audit initial ou du démarrage de la surveillance:', error);
    }
  }).on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
      server.listen({
        port: PORT + 1,
        host: "0.0.0.0",
        reusePort: true,
      }, () => {
        log(`🚀 Server running on port ${PORT + 1} (fallback)`);
      });
    } else {
      console.error('❌ Server startup error:', err);
      process.exit(1);
    }
  });

  // Graceful shutdown handler
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Server closed');
      // Optionally stop monitoring here if needed
      // auditor.stopMonitoring();
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Server closed');
      // Optionally stop monitoring here if needed
      // auditor.stopMonitoring();
      process.exit(0);
    });
  });
})();