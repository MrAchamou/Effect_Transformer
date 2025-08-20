import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import InteractivePreview from "@/components/InteractivePreview";

// Types
interface Transformation {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  level?: number;
  originalCode?: string;
  transformedCode?: string;
  originalFilename?: string;
  errorMessage?: string;
  stats?: {
    performanceImprovement: number;
    modulesApplied: number;
    sizeReduction: number;
    fluidityImprovement: number;
  };
}

interface Level {
  name: string;
  description: string;
  modules: string[];
}

// ==================== COMPOSANTS ====================
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Particle[] = [];
    const particleCount = 50;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * (canvas?.width || 800);
        this.y = Math.random() * (canvas?.height || 600);
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(${Math.random() > 0.5 ? '0, 245, 255' : '255, 215, 0'}, ${Math.random() * 0.5 + 0.2})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (canvas) {
          if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
          if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const connectParticles = () => {
      if (!ctx) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx.strokeStyle = `rgba(0, 245, 255, ${0.2 * (1 - distance / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas?.width || 800, canvas?.height || 600);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      connectParticles();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="particle-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

const Header = () => {
  return (
    <header className="header">
      <motion.div 
        className="header-content"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div 
          className="logo-container"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="logo">⚗️</div>
        </motion.div>

        <h1 className="app-title">
          <span className="title-highlight">VISUAL EFFECTS</span> TRANSFORMER
        </h1>

        <p className="app-subtitle">Digital Alchemy Lab</p>
      </motion.div>
    </header>
  );
};

const DropZone = ({ onFileSelect, file }: { 
  onFileSelect: (file: File) => void; 
  file: File | null; 
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 
      'text/javascript': ['.js'],
      'application/javascript': ['.js'],
      'application/x-javascript': ['.js']
    },
    maxFiles: 1,
    maxSize: 1024 * 1024,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <motion.div 
      className="dropzone-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
      >
        <input {...getInputProps()} />

        <div className="dropzone-border">
          <div className="corner-markers">
            <div className="corner top-left"></div>
            <div className="corner top-right"></div>
            <div className="corner bottom-left"></div>
            <div className="corner bottom-right"></div>
          </div>

          <div className="dropzone-content">
            <div className="dropzone-icon-container">
              <motion.div 
                className="hexagon-container"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="hexagon">⬢</div>
              </motion.div>
              <div className="pulse-ring"></div>
            </div>

            <h3 className="dropzone-title">
              {file ? "FICHIER SÉLECTIONNÉ" : "SOURCE CODE ANALYZER"}
            </h3>

            {file ? (
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-size">{(file.size / 1024).toFixed(2)} KB</div>
              </div>
            ) : (
              <p className="dropzone-subtitle">
                Glissez-déposez votre fichier .js ici ou cliquez pour sélectionner
              </p>
            )}

            <div className="tech-specs">
              <span className="spec">📊 JavaScript ES6+</span>
              <span className="spec">🔒 Max: 1MB</span>
              <span className="spec">⚡ Analyse instantanée</span>
            </div>
          </div>
        </div>

        <div className="scan-lines"></div>
      </div>
    </motion.div>
  );
};

const AlchemyLevelSelector = ({ 
  selectedLevel, 
  onLevelSelect, 
  levels 
}: { 
  selectedLevel: number; 
  onLevelSelect: (level: number) => void; 
  levels?: Record<string, Level>;
}) => {
  const levelConfigs = [
    {
      id: 1,
      name: "STANDARD",
      icon: "⭐",
      modules: 7,
      color: "#4facfe",
      description: "Optimisation essentielle",
      features: ["Optimisation du code", "Harmonie des couleurs", "Amélioration des performances"]
    },
    {
      id: 2, 
      name: "PROFESSIONNEL",
      icon: "🔥",
      modules: 13,
      color: "#f093fb",
      description: "Intelligence avancée",
      features: ["Adaptation utilisateur", "Analyse contextuelle", "Synchronisation des flux"]
    },
    {
      id: 3,
      name: "PREMIUM",
      icon: "💎", 
      modules: 23,
      color: "#00f2fe",
      description: "Moteur de créativité révolutionnaire",
      features: ["Variations infinies", "IA prédictive", "Style signature"]
    }
  ];

  return (
    <motion.div 
      className="level-selector-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <h3 className="section-title">🎛️ INTENSITÉ DE TRANSFORMATION</h3>

      <div className="levels-grid">
        {levelConfigs.map((level) => (
          <motion.div
            key={level.id}
            className={`level-card ${selectedLevel === level.id ? 'selected' : ''}`}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onLevelSelect(level.id)}
          >
            <div className="level-glow" style={{ '--glow-color': level.color } as React.CSSProperties}></div>

            <div className="level-content">
              <div className="level-icon">{level.icon}</div>
              <h4>{level.name}</h4>
              <div className="module-count">{level.modules} MODULES</div>
              <p>{level.description}</p>

              <div className="features-list">
                {level.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">{feature}</span>
                ))}
              </div>
            </div>

            <div className="selection-indicator">
              <div className="pulse-dot"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const TransformationButton = ({ 
  onClick, 
  isLoading, 
  disabled 
}: { 
  onClick: () => void; 
  isLoading: boolean; 
  disabled: boolean; 
}) => {
  return (
    <motion.div 
      className="transform-button-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
    >
      <motion.button
        className={`transform-button ${isLoading ? 'loading' : ''}`}
        onClick={onClick}
        disabled={disabled || isLoading}
        whileHover={{ 
          scale: disabled || isLoading ? 1 : 1.03,
        }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      >
        <div className="button-background">
          <div className="energy-waves"></div>
          <div className="lightning-effect"></div>
        </div>

        <div className="button-content">
          <span className="button-icon">⚗️</span>
          <span className="button-text">
            {isLoading ? 'TRANSFORMATION EN COURS...' : 'INITIER LA TRANSFORMATION'}
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
};

const ProcessingScreen = ({ transformation }: { transformation: Transformation }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 10, 85));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="processing-screen"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="processing-content">
        <div className="processing-header">
          <div className="processing-icon">🧬</div>
          <h3>TRANSFORMATION QUANTIQUE EN COURS</h3>
          <p>Niveau {transformation.level} • {transformation.level === 1 ? '7' : transformation.level === 2 ? '13' : '23'} modules IA activés</p>
        </div>

        <div className="progress-section">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            <div className="progress-glow" style={{ left: `${progress}%` }}></div>
          </div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>

        <div className="processing-steps">
          <div className="step active">
            <span className="step-icon">🔍</span>
            <span>Analyse du code source</span>
          </div>
          <div className={`step ${progress > 30 ? 'active' : ''}`}>
            <span className="step-icon">⚡</span>
            <span>Application des modules IA</span>
          </div>
          <div className={`step ${progress > 70 ? 'active' : ''}`}>
            <span className="step-icon">✨</span>
            <span>Optimisation finale</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ResultsSection = ({ transformation }: { transformation: Transformation }) => {
  const [showFullCode, setShowFullCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'stats'>('preview');
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/download/${transformation.id}`);
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = transformation.originalFilename?.replace('.js', '_transformed.js') || 'transformed.js';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Téléchargement réussi",
        description: "Votre effet transformé a été téléchargé",
      });
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le fichier",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      className="results-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="results-header">
        <div className="success-icon">✅</div>
        <h3>TRANSFORMATION RÉUSSIE</h3>
        <p>Votre effet a été optimisé avec {transformation.stats?.modulesApplied || 0} modules IA</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">+{transformation.stats?.performanceImprovement || 0}%</div>
          <div className="stat-label">Performance</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{transformation.stats?.modulesApplied || 0}</div>
          <div className="stat-label">Modules IA</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{transformation.stats?.sizeReduction || 0}%</div>
          <div className="stat-label">Taille</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">+{transformation.stats?.fluidityImprovement || 0}%</div>
          <div className="stat-label">Fluidité</div>
        </div>
      </div>

      {/* Onglets de navigation */}
      <div className="results-tabs">
        <div className="tabs-navigation">
          <button 
            className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            🎮 Prévisualisation Interactive
          </button>
          <button 
            className={`tab-button ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            💻 Comparaison de Code
          </button>
          <button 
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Statistiques Détaillées
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'preview' && (
            <InteractivePreview
              transformedCode={transformation.transformedCode || ''}
              originalCode={transformation.originalCode || ''}
              effectName={transformation.originalFilename?.replace('.js', '') || 'VisualEffect'}
            />
          )}

          {activeTab === 'code' && (
            <div className="code-comparison">
              <div className="code-panel">
                <h4>Code Original</h4>
                <SyntaxHighlighter 
                  language="javascript" 
                  style={atomDark}
                  className="code-display"
                >
                  {showFullCode ? transformation.originalCode || '' : 
                   (transformation.originalCode || '').split('\n').slice(0, 10).join('\n') + '\n// ...'}
                </SyntaxHighlighter>
              </div>

              <div className="code-panel enhanced">
                <h4>Code Transformé</h4>
                <SyntaxHighlighter 
                  language="javascript" 
                  style={atomDark}
                  className="code-display"
                >
                  {showFullCode ? transformation.transformedCode || '' : 
                   (transformation.transformedCode || '').split('\n').slice(0, 10).join('\n') + '\n// ...'}
                </SyntaxHighlighter>
              </div>

              <div className="code-actions">
                <button 
                  className="toggle-code-btn"
                  onClick={() => setShowFullCode(!showFullCode)}
                >
                  {showFullCode ? 'Masquer le code complet' : 'Afficher le code complet'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="detailed-stats">
              <div className="stats-panels">
                <div className="stat-panel">
                  <h4>📈 Métriques de Performance</h4>
                  <div className="metrics-list">
                    <div className="metric-item">
                      <span className="metric-label">Amélioration performance:</span>
                      <span className="metric-value">+{transformation.stats?.performanceImprovement || 0}%</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Amélioration fluidité:</span>
                      <span className="metric-value">+{transformation.stats?.fluidityImprovement || 0}%</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Réduction de taille:</span>
                      <span className="metric-value">{transformation.stats?.sizeReduction || 0}%</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Modules appliqués:</span>
                      <span className="metric-value">{transformation.stats?.modulesApplied || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="stat-panel">
                  <h4>🎯 Analyse de l'Effet</h4>
                  <div className="analysis-info">
                    <p><strong>Nom du fichier:</strong> {transformation.originalFilename}</p>
                    <p><strong>Niveau de transformation:</strong> {transformation.level}</p>
                    <p><strong>Date de transformation:</strong> {new Date().toLocaleDateString('fr-FR')}</p>
                    <p><strong>Statut:</strong> <span className="status-success">Complété avec succès</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="results-actions">
        <button 
          className="download-btn primary"
          onClick={handleDownload}
        >
          <span className="btn-icon">💾</span>
          Télécharger l'effet transformé
        </button>
      </div>
    </motion.div>
  );
};

// Main Component
export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transformationId, setTransformationId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(2);
  const [effectAnalysis, setEffectAnalysis] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get transformation levels
  const { data: levels } = useQuery({
    queryKey: ['/api/levels'],
  }) as { data: Record<string, Level> | undefined };

  // Get transformation status
  const { data: transformation } = useQuery({
    queryKey: ['/api/transformation', transformationId],
    enabled: !!transformationId,
    refetchInterval: (query) => {
      return query?.state?.data && (query.state.data as Transformation).status === 'processing' ? 2000 : false;
    },
  }) as { data: Transformation | undefined };

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      console.log('Creating FormData for file:', file.name, file.type);
      const formData = new FormData();
      formData.append('file', file);

      // Log FormData content
      console.log('FormData has file:', formData.has('file'));
      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log('FormData entry:', key, value);
      });

      const response = await apiRequest('POST', '/api/upload', formData);
      console.log('Upload response status:', response.status);
      return response.json();
    },
    onSuccess: (data) => {
      setTransformationId(data.transformationId);
      setEffectAnalysis(data.effectAnalysis);
      toast({
        title: "Fichier uploadé avec succès",
        description: `${data.filename} est prêt pour la transformation`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur d'upload",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Transform mutation
  const transformMutation = useMutation({
    mutationFn: async ({ transformationId, level }: { transformationId: string; level: number }) => {
      const response = await apiRequest('POST', '/api/transform', { transformationId, level });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transformation', transformationId] });
      toast({
        title: "Transformation démarrée",
        description: "Votre effet est en cours de transformation par l'IA",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur de transformation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (file: File) => {
    console.log('Uploading file:', file.name, file.type, file.size);
    setSelectedFile(file);
    uploadMutation.mutate(file);
  };

  const handleTransform = () => {
    if (transformationId) {
      transformMutation.mutate({ transformationId, level: selectedLevel });
    }
  };

  const handleNewTransformation = () => {
    setSelectedFile(null);
    setTransformationId(null);
    setSelectedLevel(2);
    setEffectAnalysis(null);
  };

  const isProcessing = transformation?.status === 'processing';
  const isCompleted = transformation?.status === 'completed';
  const hasFailed = transformation?.status === 'failed';

  return (
    <div className="digital-alchemy-app">
      <ParticleBackground />

      <div className="app-container">
        <Header />

        <main className="main-content">
          <AnimatePresence mode="wait">
            {!selectedFile && (
              <motion.div key="upload" className="upload-section">
                <DropZone onFileSelect={handleFileUpload} file={selectedFile} />
              </motion.div>
            )}

            {selectedFile && !isProcessing && !isCompleted && !hasFailed && (
              <motion.div key="config" className="config-section">
                <DropZone onFileSelect={handleFileUpload} file={selectedFile} />
                <AlchemyLevelSelector 
                  selectedLevel={selectedLevel}
                  onLevelSelect={setSelectedLevel}
                  levels={levels}
                />

                {/* Analyse intelligente de l'effet uploadé */}
                {effectAnalysis && (
                  <motion.div 
                    className="effect-analysis-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3>🧠 Analyse Intelligente de l'Effet</h3>
                    <div className="analysis-content">
                      <div className="effect-category">
                        <strong>{effectAnalysis.icon || '📂'} Catégorie:</strong> {effectAnalysis.category}
                        {effectAnalysis.subcategory && (
                          <span className="subcategory"> → {effectAnalysis.subcategory}</span>
                        )}
                      </div>

                      <div className="category-type-indicator">
                        {effectAnalysis.category_type === 'complete' && (
                          <span className="type-badge complete">🟢 Effet Complet - Niveau Standard Parfait</span>
                        )}
                        {effectAnalysis.category_type === 'moderate' && (
                          <span className="type-badge moderate">🟡 Potentiel Modéré - Niveaux 1-2</span>
                        )}
                        {effectAnalysis.category_type === 'revolutionary' && (
                          <span className="type-badge revolutionary">🔴 Potentiel Révolutionnaire - Tous Niveaux</span>
                        )}
                      </div>

                      <div className="available-levels">
                        <strong>🎯 Niveaux Disponibles:</strong>
                        <div className="levels-badges">
                          {effectAnalysis.availableLevels.map((level: number) => (
                            <span key={level} className={`level-badge level-${level}`}>
                              {level <= 3 ? `Niveau ${level}` : `Pro ${level}`}
                              {level === 1 && ' (Standard)'}
                              {level === 2 && ' (Pro)'}
                              {level === 3 && ' (Premium)'}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="analysis-reason">
                        <strong>💡 Analyse:</strong> {effectAnalysis.reason}
                      </div>

                      {effectAnalysis.recommendations && (
                        <div className="recommendations">
                          <strong>🚀 Recommandations:</strong>
                          <ul>
                            {effectAnalysis.recommendations.map((rec: string, index: number) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="confidence-meter">
                        <strong>🎯 Confiance:</strong>
                        <div className="confidence-bar">
                          <div 
                            className="confidence-fill" 
                            style={{ width: `${(effectAnalysis.confidence * 100)}%` }}
                          ></div>
                        </div>
                        <span className="confidence-text">
                          {Math.round(effectAnalysis.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <TransformationButton 
                  onClick={handleTransform}
                  isLoading={transformMutation.isPending}
                  disabled={!transformationId}
                />
              </motion.div>
            )}

            {isProcessing && transformation && (
              <motion.div key="processing" className="processing-section">
                <ProcessingScreen transformation={transformation} />
              </motion.div>
            )}

            {isCompleted && transformation && (
              <motion.div key="results" className="results-section-container">
                <ResultsSection transformation={transformation} />
                <button 
                  className="new-transformation-btn"
                  onClick={handleNewTransformation}
                >
                  Transformer un autre effet
                </button>
              </motion.div>
            )}

            {hasFailed && transformation && (
              <motion.div key="error" className="error-section">
                <div className="error-content">
                  <div className="error-icon">❌</div>
                  <h3>Transformation échouée</h3>
                  <p>{transformation.errorMessage || "Une erreur inattendue s'est produite"}</p>
                  <button 
                    className="retry-btn"
                    onClick={handleNewTransformation}
                  >
                    Réessayer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}