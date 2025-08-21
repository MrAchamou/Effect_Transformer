
import { Router } from 'express';
import type { Application } from 'express';

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
      '/api/levels'
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
