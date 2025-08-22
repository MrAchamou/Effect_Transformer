import { Router } from 'express';
import type { Application } from 'express';
import { UniversalPreprocessor } from './services/universal-preprocessor';
import { IntelligentCategorizer } from './services/intelligent-categorizer';
import { DocumentationGenerator } from './services/documentation-generator';
import { ModuleAuditSystem } from './services/module-audit-system';

const router = Router();

// Route de base
router.get('/api', (req, res) => {
  res.json({
    message: 'API Visual Effects Transformer',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/system-status',
      '/api/transform',
      '/api/levels',
      '/api/audit-modules'
    ]
  });
});

// Route des niveaux de transformation
router.get('/api/levels', (req, res) => {
  res.json({
    levels: {
      1: {
        name: 'Standard',
        description: 'Optimisations de base',
        modules: 7,
        price: 'Gratuit'
      },
      2: {
        name: 'Professionnel',
        description: 'Amélioration avancée avec IA',
        modules: 15,
        price: 'Premium'
      },
      3: {
        name: 'Enterprise',
        description: 'Transformation complète avec apprentissage',
        modules: 23,
        price: 'Enterprise'
      }
    }
  });
});

// Endpoint pour auditer les modules
router.get('/api/audit-modules', async (req, res) => {
  try {
    const auditResults = await moduleAuditSystem.runAudit();
    res.json({
      message: 'Audit des modules terminé avec succès',
      results: auditResults
    });
  } catch (error) {
    console.error('Erreur lors de l\'audit des modules:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur lors de l\'audit des modules',
      details: error.message
    });
  }
});

// Configuration des routes
export async function setupRoutes(app: Application): Promise<void> {
  app.use(router);

  // Middleware pour capturer les routes non trouvées
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      res.status(404).json({
        error: 'Route non trouvée',
        path: req.path,
        method: req.method
      });
    } else {
      next();
    }
  });
}

export default router;