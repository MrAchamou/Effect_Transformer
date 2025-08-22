
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS ultra-permissive pour Replit
app.use((req, res, next) => {
  // Autoriser TOUS les hôtes Replit automatiquement
  const origin = req.headers.origin;
  const host = req.get('host');
  
  // Toujours autoriser en développement
  if (process.env.NODE_ENV !== 'production') {
    res.header('Access-Control-Allow-Origin', origin || '*');
  } else {
    // En production, autoriser tous les domaines Replit
    if (origin && (origin.includes('.replit.dev') || origin.includes('.replit.app'))) {
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
  }
  
  // Headers permissifs
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, X-Forwarded-For, X-Replit-User-Id, X-Replit-User-Name');
  res.header('Access-Control-Max-Age', '86400');
  
  // Autoriser les hôtes Replit dynamiques
  if (host && host.includes('.replit.dev')) {
    res.header('Access-Control-Allow-Origin', `https://${host}`);
  }
  
  // Gestion preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  next();
});

// Configuration Express standard
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configuration multer pour les uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
      cb(null, uploadsDir);
    } catch (error) {
      cb(error, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/javascript' || 
        file.mimetype === 'text/javascript' ||
        file.originalname.endsWith('.js')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers JavaScript sont acceptés'));
    }
  }
});

// Middleware de logging simplifié
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Routes de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    cors: 'enabled-permissive'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Route principale
app.get('/', (req, res) => {
  res.json({ 
    message: 'Code Enhancement Server', 
    status: 'Running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    cors: 'Fully configured for Replit'
  });
});

// Route API de base
app.get('/api', (req, res) => {
  res.json({
    message: 'API Visual Effects Transformer',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/transform',
      '/api/levels'
    ]
  });
});

// Route des niveaux
app.get('/api/levels', (req, res) => {
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

// Route de transformation principale
app.post('/api/transform', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const { level = '1' } = req.body;
    const filePath = req.file.path;

    console.log(`🔄 Transformation niveau ${level} demandée pour: ${req.file.originalname}`);

    // Lecture du fichier
    const content = await fs.readFile(filePath, 'utf-8');

    // Transformation basique (à remplacer par votre logique)
    const transformedCode = `// Code transformé (niveau ${level})\n// Timestamp: ${new Date().toISOString()}\n${content}`;

    // Nettoyage du fichier temporaire
    await fs.unlink(filePath).catch(console.error);

    res.json({
      success: true,
      result: transformedCode,
      originalSize: content.length,
      newSize: transformedCode.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur de transformation:', error);
    res.status(500).json({
      error: 'Erreur de transformation',
      message: error.message
    });
  }
});

// Servir les fichiers statiques
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist', 'public');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // En développement, servir les fichiers clients si disponibles
  const clientPath = path.join(__dirname, '..', 'client');
  try {
    app.use(express.static(clientPath));
  } catch (e) {
    console.log('Pas de fichiers clients statiques trouvés');
  }
}

// Gestionnaire d'erreurs global
app.use((error, req, res, next) => {
  console.error('❌ Erreur serveur:', error);
  
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue',
    timestamp: new Date().toISOString()
  });
});

// Démarrage du serveur sur toutes les interfaces
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 === SERVEUR DÉMARRÉ AVEC SUCCÈS ===');
  console.log(`📡 Port: ${PORT} (écoute sur 0.0.0.0 - toutes interfaces)`);
  console.log(`🌐 URL locale: http://0.0.0.0:${PORT}`);
  console.log(`🔗 URL Replit: Accessible via l'interface preview`);
  console.log(`⚙️ Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ CORS: Configuration ultra-permissive pour Replit`);
  console.log(`✅ Toutes les origines autorisées en développement`);
  console.log('🎯 Serveur prêt à recevoir des requêtes\n');
});

// Gestion de l'arrêt propre
process.on('SIGTERM', () => {
  console.log('🛑 Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Interruption reçue, arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

export default app;
