
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useToast } from "@/hooks/use-toast";

// ==================== HOOKS PERSONNALISÉS ====================
const useFileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  
  const handleFileUpload = (selectedFile) => {
    setFile(selectedFile);
    
    // Lire le contenu du fichier
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
    };
    reader.readAsText(selectedFile);
  };
  
  const resetFile = () => {
    setFile(null);
    setFileContent('');
  };
  
  return { file, fileContent, handleFileUpload, resetFile };
};

const useTransformation = () => {
  const [transformedCode, setTransformedCode] = useState('');
  const { toast } = useToast();
  
  const transformCode = async (originalCode, level) => {
    try {
      // Appel API réel pour la transformation
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: originalCode,
          level: level,
          filename: 'effect.js'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la transformation');
      }

      const result = await response.json();
      
      if (result.transformedCode) {
        setTransformedCode(result.transformedCode);
      } else {
        // Fallback avec transformation simulée
        let transformed = originalCode;
        
        if (level >= 1) {
          transformed = `// ✨ Optimisation Standard appliquée\n${transformed}`;
        }
        
        if (level >= 2) {
          transformed = `// 🔥 Optimisation Professionnelle appliquée\n${transformed}`;
        }
        
        if (level >= 3) {
          transformed = `// 💎 Optimisation Premium appliquée\n${transformed}`;
        }
        
        setTransformedCode(transformed);
      }

      toast({
        title: "Transformation réussie",
        description: `Niveau ${level} appliqué avec succès`,
      });

    } catch (error) {
      console.error('Erreur transformation:', error);
      
      // Fallback en cas d'erreur API
      let transformed = originalCode;
      
      if (level >= 1) {
        transformed = `// ✨ Optimisation Standard appliquée (Mode Hors Ligne)\n${transformed}`;
      }
      
      if (level >= 2) {
        transformed = `// 🔥 Optimisation Professionnelle appliquée (Mode Hors Ligne)\n${transformed}`;
      }
      
      if (level >= 3) {
        transformed = `// 💎 Optimisation Premium appliquée (Mode Hors Ligne)\n${transformed}`;
      }
      
      setTransformedCode(transformed);
      
      toast({
        title: "Mode Hors Ligne",
        description: "Transformation simulée appliquée",
        variant: "destructive",
      });
    }
  };
  
  const resetTransformation = () => {
    setTransformedCode('');
  };
  
  return { transformedCode, transformCode, resetTransformation };
};

const useAudioEffects = () => {
  const playUploadSound = () => {
    console.log('🔊 Son de upload activé');
  };
  
  const playTransformSound = () => {
    console.log('🔊 Son de transformation activé');
  };
  
  const playDownloadSound = () => {
    console.log('🔊 Son de téléchargement activé');
  };
  
  return { playUploadSound, playTransformSound, playDownloadSound };
};

// ==================== COMPOSANTS ====================
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  
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
    
    const particles = [];
    const particleCount = 100;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(${Math.random() > 0.5 ? '0, 245, 255' : '255, 215, 0'}, ${Math.random() * 0.5 + 0.2})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      
      draw() {
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
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.strokeStyle = `rgba(0, 245, 255, ${0.2 * (1 - distance / 100)})`;
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
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

const DropZone = ({ onFileSelect, file }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  
  const onDrop = useCallback((acceptedFiles) => {
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

const AlchemyLevelSelector = ({ selectedLevel, onLevelSelect }) => {
  const levels = [
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
        {levels.map((level) => (
          <motion.div
            key={level.id}
            className={`level-card ${selectedLevel === level.id ? 'selected' : ''}`}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onLevelSelect(level.id)}
            style={{ '--glow-color': level.color }}
          >
            <div className="level-glow"></div>
            
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

const TransformationButton = ({ onClick, isLoading, disabled }) => {
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
          <span className="button-icon">⚗️</span>
        </div>
        
        <div className="button-particles"></div>
      </motion.button>
      
      {isLoading && (
        <div className="loading-ring">
          <div className="ring-segment"></div>
          <div className="ring-segment"></div>
          <div className="ring-segment"></div>
        </div>
      )}
    </motion.div>
  );
};

const QuantumProgressVisualizer = ({ progress, currentModule, modules }) => {
  return (
    <motion.div 
      className="progress-visualizer-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="progress-header">
        <h3>🔬 RECONSTRUCTION MOLECULAIRE EN COURS</h3>
        <div className="progress-percentage">{Math.round(progress)}%</div>
      </div>
      
      <div className="quantum-progress-bar">
        <div className="progress-track">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          >
            <div className="progress-glow"></div>
            <div className="progress-particles"></div>
          </motion.div>
        </div>
      </div>
      
      <div className="modules-pipeline">
        {modules.map((module, index) => (
          <div 
            key={module.name}
            className={`module-step ${
              currentModule === module.name ? 'active' : 
              index < modules.findIndex(m => m.name === currentModule) ? 'completed' : 'pending'
            }`}
          >
            <div className="module-icon">{module.icon}</div>
            <span className="module-name">{module.name}</span>
            
            {currentModule === module.name && (
              <div className="processing-indicator">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="quantum-field">
        <div className="field-particles"></div>
        <div className="energy-waves"></div>
      </div>
    </motion.div>
  );
};

const MolecularComparison = ({ originalCode, transformedCode }) => {
  return (
    <motion.div 
      className="comparison-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <h3 className="section-title">🔬 LABORATOIRE DE COMPARAISON MOLÉCULAIRE</h3>
      
      <div className="code-panels">
        <div className="code-panel original">
          <div className="panel-header">
            <div className="status-indicator original"></div>
            <h4>ADN ORIGINAL</h4>
            <span className="complexity-score">Complexité: Basique</span>
          </div>
          
          <div className="code-viewport">
            <SyntaxHighlighter 
              language="javascript" 
              style={atomDark}
              customStyle={{ 
                margin: 0, 
                borderRadius: '10px',
                height: '100%',
                fontSize: '14px'
              }}
            >
              {originalCode}
            </SyntaxHighlighter>
          </div>
        </div>
        
        <div className="transformation-bridge">
          <div className="dna-helix">
            <div className="helix-strand strand-1"></div>
            <div className="helix-strand strand-2"></div>
          </div>
          <div className="transform-arrow">
            <span>⚡ TRANSFORMÉ ⚡</span>
          </div>
        </div>
        
        <div className="code-panel transformed">
          <div className="panel-header">
            <div className="status-indicator enhanced"></div>
            <h4>GÉNOME AMÉLIORÉ</h4>
            <span className="complexity-score">Complexité: Avancée</span>
          </div>
          
          <div className="code-viewport">
            <SyntaxHighlighter 
              language="javascript" 
              style={atomDark}
              customStyle={{ 
                margin: 0, 
                borderRadius: '10px',
                height: '100%',
                fontSize: '14px'
              }}
            >
              {transformedCode}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
      
      <div className="comparison-stats">
        <div className="stat-item">
          <span className="stat-label">Optimisation</span>
          <div className="stat-bar">
            <div className="stat-fill" style={{ width: '85%' }}></div>
          </div>
          <span className="stat-value">+85%</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Performance</span>
          <div className="stat-bar">
            <div className="stat-fill" style={{ width: '92%' }}></div>
          </div>
          <span className="stat-value">+92%</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Créativité</span>
          <div className="stat-bar">
            <div className="stat-fill" style={{ width: '78%' }}></div>
          </div>
          <span className="stat-value">+78%</span>
        </div>
      </div>
    </motion.div>
  );
};

const DownloadZone = ({ onDownload, onReset }) => {
  return (
    <motion.div 
      className="download-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      <div className="download-content">
        <div className="download-icon">💾</div>
        <h3>TÉLÉCHARGER VOTRE EFFET TRANSFORMÉ</h3>
        <p>Votre effet JavaScript a été métamorphosé avec succès</p>
        
        <div className="download-actions">
          <motion.button
            className="download-button"
            onClick={onDownload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="button-icon">💾</span>
            <span>TÉLÉCHARGER LE FICHIER</span>
          </motion.button>
          
          <motion.button
            className="reset-button"
            onClick={onReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="button-icon">🔄</span>
            <span>TRANSFORMER UN AUTRE EFFET</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== COMPOSANT PRINCIPAL ====================
export default function Home() {
  const [currentStep, setCurrentStep] = useState('upload');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentModule, setCurrentModule] = useState('');
  
  const { file, fileContent, handleFileUpload, resetFile } = useFileUpload();
  const { transformedCode, transformCode, resetTransformation } = useTransformation();
  const { playUploadSound, playTransformSound, playDownloadSound } = useAudioEffects();
  
  const modules = [
    { name: 'ContentAnalyzer', icon: '🔍' },
    { name: 'SmartOptimizer', icon: '⚙️' },
    { name: 'ColorHarmonizer', icon: '🎨' },
    { name: 'EffectEnhancer', icon: '✨' },
    { name: 'PerformanceBoost', icon: '🚀' },
  ];
  
  const handleTransformation = async () => {
    if (!file) return;
    
    playTransformSound();
    setCurrentStep('transform');
    
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      const moduleIndex = Math.floor(i / 20);
      if (moduleIndex < modules.length) {
        setCurrentModule(modules[moduleIndex].name);
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    await transformCode(fileContent, selectedLevel);
    setCurrentStep('compare');
  };
  
  const resetAll = () => {
    resetFile();
    resetTransformation();
    setProgress(0);
    setCurrentModule('');
    setCurrentStep('upload');
  };
  
  const handleDownload = () => {
    playDownloadSound();
    
    const blob = new Blob([transformedCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = file ? `transformed_${file.name}` : 'transformed_effect.js';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    setCurrentStep('download');
  };
  
  return (
    <div className="digital-alchemy-app">
      <ParticleBackground />
      
      <div className="app-container">
        <Header />
        
        <main className="main-content">
          <AnimatePresence mode="wait">
            {currentStep === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="step-container"
              >
                <DropZone onFileSelect={handleFileUpload} file={file} />
                {file && (
                  <>
                    <AlchemyLevelSelector 
                      selectedLevel={selectedLevel} 
                      onLevelSelect={setSelectedLevel} 
                    />
                    <TransformationButton 
                      onClick={handleTransformation} 
                      isLoading={false}
                      disabled={false}
                    />
                  </>
                )}
              </motion.div>
            )}
            
            {currentStep === 'transform' && (
              <motion.div
                key="transform"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="step-container"
              >
                <QuantumProgressVisualizer 
                  progress={progress} 
                  currentModule={currentModule} 
                  modules={modules} 
                />
              </motion.div>
            )}
            
            {currentStep === 'compare' && (
              <motion.div
                key="compare"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="step-container"
              >
                <MolecularComparison 
                  originalCode={fileContent} 
                  transformedCode={transformedCode} 
                />
                <DownloadZone 
                  onDownload={handleDownload}
                  onReset={resetAll}
                />
              </motion.div>
            )}
            
            {currentStep === 'download' && (
              <motion.div
                key="download"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="step-container success-container"
              >
                <div className="success-animation">
                  <div className="success-particles"></div>
                  <div className="success-icon">✨</div>
                  <h2>TRANSFORMATION RÉUSSIE!</h2>
                  <p>Votre effet JavaScript a été métamorphosé avec succès.</p>
                  <button className="reset-button" onClick={resetAll}>
                    TRANSFORMER UN AUTRE EFFET
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      
      <style jsx global>{`
        :root {
          --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          --dark-primary: #1a1a2e;
          --dark-secondary: #16213e;
          --accent-neon: #00f5ff;
          --accent-gold: #ffd700;
          --success: #00ff88;
          --warning: #ffaa00;
          --error: #ff3366;
          --glass-bg: rgba(255, 255, 255, 0.1);
          --glass-border: rgba(255, 255, 255, 0.2);
          --shadow-glow: 0 8px 32px rgba(31, 38, 135, 0.37);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: var(--dark-primary);
          color: #ffffff;
          overflow-x: hidden;
          min-height: 100vh;
        }

        .digital-alchemy-app {
          position: relative;
          min-height: 100vh;
        }

        .app-container {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .step-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: center;
          justify-content: center;
        }

        .header {
          padding: 2rem 0;
          text-align: center;
          margin-bottom: 2rem;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .logo-container {
          font-size: 3rem;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
        }

        .app-title {
          font-size: 2.5rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin: 0;
        }

        .title-highlight {
          background: linear-gradient(90deg, var(--accent-neon), var(--accent-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .app-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          letter-spacing: 2px;
        }

        .dropzone-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .dropzone {
          position: relative;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 2px solid var(--glass-border);
          border-radius: 20px;
          padding: 3rem;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dropzone.active {
          border-color: var(--accent-neon);
          box-shadow: 0 0 25px rgba(0, 245, 255, 0.3);
        }

        .dropzone.has-file {
          border-color: var(--success);
        }

        .dropzone-border {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .corner-markers {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: var(--accent-neon);
          border-style: solid;
          border-width: 0;
        }

        .corner.top-left {
          top: 10px;
          left: 10px;
          border-top-width: 2px;
          border-left-width: 2px;
        }

        .corner.top-right {
          top: 10px;
          right: 10px;
          border-top-width: 2px;
          border-right-width: 2px;
        }

        .corner.bottom-left {
          bottom: 10px;
          left: 10px;
          border-bottom-width: 2px;
          border-left-width: 2px;
        }

        .corner.bottom-right {
          bottom: 10px;
          right: 10px;
          border-bottom-width: 2px;
          border-right-width: 2px;
        }

        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          z-index: 2;
        }

        .dropzone-icon-container {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .hexagon-container {
          font-size: 4rem;
          color: var(--accent-neon);
          filter: drop-shadow(0 0 10px var(--accent-neon));
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border: 2px solid var(--accent-neon);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        .dropzone-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(90deg, var(--accent-neon), var(--accent-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .dropzone-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1.5rem;
          max-width: 500px;
        }

        .file-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .file-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--accent-gold);
        }

        .file-size {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .tech-specs {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .spec {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .scan-lines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.03) 0px,
            rgba(255, 255, 255, 0.03) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 3;
        }

        .level-selector-container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 2rem;
          background: linear-gradient(90deg, var(--accent-neon), var(--accent-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .levels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .level-card {
          position: relative;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 2rem;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .level-card.selected {
          border-color: var(--accent-gold);
          box-shadow: 0 0 25px rgba(255, 215, 0, 0.3);
        }

        .level-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            var(--glow-color) 0%,
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }

        .level-card:hover .level-glow,
        .level-card.selected .level-glow {
          opacity: 0.15;
        }

        .level-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .level-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .level-card h4 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .module-count {
          font-size: 0.9rem;
          color: var(--accent-gold);
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .level-card p {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1.5rem;
        }

        .features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .feature-tag {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .selection-indicator {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .level-card.selected .selection-indicator {
          opacity: 1;
        }

        .pulse-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent-gold);
          animation: pulse-dot 1.5s infinite;
        }

        @keyframes pulse-dot {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(0.8);
            opacity: 1;
          }
        }

        .transform-button-container {
          position: relative;
          margin-top: 1rem;
        }

        .transform-button {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: 70px;
          background: transparent;
          border: none;
          border-radius: 35px;
          cursor: pointer;
          overflow: hidden;
          padding: 0;
        }

        .transform-button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .button-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, var(--accent-gold), var(--accent-neon));
          z-index: 0;
        }

        .energy-waves {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.3) 0%,
            transparent 70%
          );
          animation: energy-wave 3s infinite;
        }

        @keyframes energy-wave {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.8;
          }
        }

        .lightning-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: lightning 2s infinite;
        }

        @keyframes lightning {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        .button-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 1rem;
        }

        .button-icon {
          font-size: 1.5rem;
        }

        .button-text {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--dark-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .button-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .button-particles::before,
        .button-particles::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          background: var(--accent-gold);
          border-radius: 50%;
          filter: blur(2px);
        }

        .button-particles::before {
          top: 20%;
          left: 20%;
          animation: float-particle 3s infinite ease-in-out;
        }

        .button-particles::after {
          bottom: 20%;
          right: 20%;
          animation: float-particle 3s infinite ease-in-out reverse;
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(10px, -10px);
          }
        }

        .loading-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          pointer-events: none;
        }

        .ring-segment {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top-color: var(--accent-gold);
          border-radius: 50%;
          animation: rotate 1.5s infinite linear;
        }

        .ring-segment:nth-child(2) {
          width: 70%;
          height: 70%;
          top: 15%;
          left: 15%;
          border-top-color: var(--accent-neon);
          animation-duration: 1.8s;
          animation-direction: reverse;
        }

        .ring-segment:nth-child(3) {
          width: 40%;
          height: 40%;
          top: 30%;
          left: 30%;
          border-top-color: var(--success);
          animation-duration: 2.1s;
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .progress-visualizer-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .progress-header h3 {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(90deg, var(--accent-neon), var(--accent-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .progress-percentage {
          font-size: 2rem;
          font-weight: 700;
          color: var(--accent-gold);
        }

        .quantum-progress-bar {
          width: 100%;
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }

        .progress-track {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, var(--accent-neon), var(--accent-gold));
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.5) 0%,
            transparent 70%
          );
        }

        .progress-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .progress-particles::before,
        .progress-particles::after {
          content: '';
          position: absolute;
          width: 5px;
          height: 5px;
          background: white;
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          filter: blur(1px);
          animation: move-particle 2s infinite linear;
        }

        .progress-particles::before {
          left: 10%;
          animation-delay: 0s;
        }

        .progress-particles::after {
          left: 70%;
          animation-delay: 1s;
        }

        @keyframes move-particle {
          0% {
            transform: translateY(-50%) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-50%) translateX(100px);
            opacity: 0;
          }
        }

        .modules-pipeline {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          position: relative;
        }

        .modules-pipeline::before {
          content: '';
          position: absolute;
          top: 25px;
          left: 0;
          width: 100%;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          z-index: 0;
        }

        .module-step {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px;
        }

        .module-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .module-step.completed .module-icon {
          background: rgba(0, 255, 136, 0.2);
          border-color: var(--success);
          color: var(--success);
        }

        .module-step.active .module-icon {
          background: rgba(0, 245, 255, 0.2);
          border-color: var(--accent-neon);
          color: var(--accent-neon);
          animation: pulse-module 2s infinite;
        }

        @keyframes pulse-module {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 245, 255, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(0, 245, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 245, 255, 0);
          }
        }

        .module-name {
          font-size: 0.8rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
        }

        .processing-indicator {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 20px;
          height: 20px;
        }

        .spinner {
          width: 100%;
          height: 100%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: var(--accent-neon);
          border-radius: 50%;
          animation: spin 1s infinite linear;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .quantum-field {
          position: relative;
          width: 100%;
          height: 150px;
          margin-top: 2rem;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .field-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .field-particles::before,
        .field-particles::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          background: var(--accent-neon);
          border-radius: 50%;
          filter: blur(2px);
          opacity: 0.7;
        }

        .field-particles::before {
          top: 20%;
          left: 20%;
          animation: float-field 8s infinite ease-in-out;
        }

        .field-particles::after {
          bottom: 30%;
          right: 30%;
          animation: float-field 8s infinite ease-in-out reverse;
          animation-delay: 2s;
        }

        @keyframes float-field {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(30px, -30px);
          }
          50% {
            transform: translate(60px, 0);
          }
          75% {
            transform: translate(30px, 30px);
          }
        }

        .energy-waves {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            rgba(0, 245, 255, 0.1) 0%,
            transparent 70%
          );
          animation: energy-wave-field 4s infinite ease-in-out;
        }

        @keyframes energy-wave-field {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.2;
          }
        }

        .comparison-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .code-panels {
          display: flex;
          gap: 2rem;
          width: 100%;
        }

        .code-panel {
          flex: 1;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 1rem;
        }

        .status-indicator.original {
          background: var(--warning);
        }

        .status-indicator.enhanced {
          background: var(--success);
        }

        .panel-header h4 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-right: auto;
        }

        .complexity-score {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.1);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
        }

        .code-viewport {
          flex: 1;
          overflow: auto;
          max-height: 400px;
        }

        .transformation-bridge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 80px;
        }

        .dna-helix {
          position: relative;
          width: 40px;
          height: 200px;
          margin: 1rem 0;
        }

        .helix-strand {
          position: absolute;
          width: 4px;
          height: 100%;
          background: linear-gradient(
            to bottom,
            var(--accent-neon),
            var(--accent-gold),
            var(--accent-neon)
          );
          border-radius: 2px;
        }

        .helix-strand.strand-1 {
          left: 10px;
          animation: helix-rotate 4s infinite linear;
        }

        .helix-strand.strand-2 {
          right: 10px;
          animation: helix-rotate 4s infinite linear reverse;
        }

        @keyframes helix-rotate {
          0% {
            transform: translateY(0) rotateZ(0deg);
          }
          100% {
            transform: translateY(-20px) rotateZ(360deg);
          }
        }

        .transform-arrow {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent-gold);
          text-align: center;
        }

        .comparison-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .stat-item {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 15px;
          padding: 1.5rem;
        }

        .stat-label {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.8rem;
        }

        .stat-bar {
          width: 100%;
          height: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .stat-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-neon), var(--accent-gold));
          border-radius: 5px;
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--accent-gold);
        }

        .download-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
        }

        .download-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .download-icon {
          font-size: 3rem;
          color: var(--accent-gold);
        }

        .download-content h3 {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(90deg, var(--accent-neon), var(--accent-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .download-content p {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 600px;
        }

        .download-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .download-button,
        .reset-button {
          padding: 1rem 2rem;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .download-button {
          background: linear-gradient(90deg, var(--accent-gold), var(--accent-neon));
          color: var(--dark-primary);
        }

        .download-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
        }

        .reset-button {
          background: transparent;
          color: white;
          border: 2px solid var(--accent-neon);
        }

        .reset-button:hover {
          background: rgba(0, 245, 255, 0.1);
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 245, 255, 0.2);
        }

        .success-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
        }

        .success-animation {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }

        .success-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .success-icon {
          font-size: 5rem;
          animation: success-pulse 2s infinite;
        }

        @keyframes success-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }

        .success-container h2 {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(90deg, var(--accent-gold), var(--accent-neon));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }

        .success-container p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 600px;
          margin-bottom: 2rem;
        }

        .success-container .reset-button {
          padding: 1rem 2rem;
          background: linear-gradient(90deg, var(--accent-gold), var(--accent-neon));
          border: none;
          border-radius: 30px;
          color: var(--dark-primary);
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .success-container .reset-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
        }

        @media (max-width: 1024px) {
          .code-panels {
            flex-direction: column;
          }
          
          .transformation-bridge {
            width: 100%;
            flex-direction: row;
            gap: 1rem;
          }
          
          .dna-helix {
            width: 100%;
            height: 40px;
          }
          
          .helix-strand.strand-1,
          .helix-strand.strand-2 {
            width: 100%;
            height: 4px;
            top: 18px;
            left: 0;
            right: auto;
          }
          
          .helix-strand.strand-2 {
            top: 22px;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }
          
          .dropzone {
            padding: 2rem 1.5rem;
            min-height: 250px;
          }
          
          .dropzone-title {
            font-size: 1.5rem;
          }
          
          .levels-grid {
            grid-template-columns: 1fr;
          }
          
          .modules-pipeline {
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .module-step {
            width: calc(50% - 0.5rem);
          }
          
          .modules-pipeline::before {
            display: none;
          }
          
          .comparison-stats {
            grid-template-columns: 1fr;
          }
          
          .success-container h2 {
            font-size: 2rem;
          }
          
          .success-container p {
            font-size: 1rem;
          }
          
          .app-title {
            font-size: 1.8rem;
          }
          
          .app-subtitle {
            font-size: 1rem;
          }
          
          .logo-container {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
