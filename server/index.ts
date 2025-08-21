
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

// Middleware de base
app.use(cors({
  origin: (origin, callback) => {
    // Permettre les requêtes sans origin (comme les requêtes directes depuis Postman/curl)
    if (!origin) return callback(null, true);
    
    // Patterns autorisés
    const allowedPatterns = [
      /^https?:\/\/localhost(:\d+)?$/,
      /^https?:\/\/.*\.replit\.dev$/,
      /^https?:\/\/.*\.replit\.app$/,
      /^https?:\/\/.*\.replit\.co$/,
      /^https?:\/\/.*-00-.*\.riker\.replit\.dev$/,
      /^https?:\/\/.*-00-.*\..*\.replit\.dev$/
    ];
    
    const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`⚠️ CORS: Origin refusée: ${origin}`);
      callback(null, true); // Permettre quand même en développement
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

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

// Middleware de logging avec debug CORS
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  
  // Debug CORS
  if (req.headers.origin) {
    console.log(`📍 Origin: ${req.headers.origin}`);
  }
  
  // Headers CORS pour toutes les réponses
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Routes de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
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
    timestamp: new Date().toISOString()
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
    const transformedCode = `// Code transformé (niveau ${level})\n${content}`;

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
  const clientPath = path.join(__dirname, '..', 'client');
  app.use(express.static(clientPath));
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

// Démarrage du serveur
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 === SERVEUR DÉMARRÉ AVEC SUCCÈS ===');
  console.log(`📡 Port: ${PORT} (sur toutes les interfaces)`);
  console.log(`🌐 URL locale: http://0.0.0.0:${PORT}`);
  console.log(`🔗 URL Replit: https://${process.env.REPL_SLUG || process.env.REPL_ID || 'repl'}-${PORT}.${process.env.REPL_OWNER || 'user'}.replit.dev`);
  console.log(`⚙️ Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ CORS configuré pour accepter les domaines Replit`);
  console.log('✅ Prêt à recevoir des requêtes\n');
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
