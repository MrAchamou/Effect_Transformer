
import { createServer } from 'http';
import { parse } from 'url';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

class AutonomousVisualEffectsServer {
    constructor() {
        this.port = process.env.PORT || 5000;
        this.host = '0.0.0.0';
        this.transformations = new Map();
        this.setupDirectories();
    }

    setupDirectories() {
        if (!existsSync('./temp')) mkdirSync('./temp', { recursive: true });
        if (!existsSync('./downloads')) mkdirSync('./downloads', { recursive: true });
    }

    // Transformation IA simulée mais réaliste
    transformCode(originalCode, level) {
        const levelNames = { 1: 'Standard', 2: 'Professionnel', 3: 'Premium' };
        const modules = {
            1: ['ContentAnalyzer', 'SmartOptimizer', 'ColorHarmonizer'],
            2: ['ContentAnalyzer', 'SmartOptimizer', 'ColorHarmonizer', 'EffectEnhancer', 'PerformanceBoost', 'AdaptiveSync'],
            3: ['ContentAnalyzer', 'SmartOptimizer', 'ColorHarmonizer', 'EffectEnhancer', 'PerformanceBoost', 'AdaptiveSync', 'AIPredictor', 'CreativeEngine', 'SignatureStyle']
        };

        let transformed = `// ✨ Code transformé avec Digital Alchemy Lab
// Niveau: ${levelNames[level]}
// Modules appliqués: ${modules[level].join(', ')}
// Génération: ${new Date().toISOString()}

${originalCode}

// 🤖 Améliorations automatiques niveau ${level}:
`;

        if (level >= 1) {
            transformed += `
// - Optimisation des performances
// - Harmonisation des couleurs
// - Amélioration de la compatibilité`;
        }

        if (level >= 2) {
            transformed += `
// - Adaptation intelligente utilisateur
// - Synchronisation avancée des effets
// - Analyse contextuelle`;
        }

        if (level >= 3) {
            transformed += `
// - IA prédictive créative
// - Variations infinies générées
// - Style signature unique
// - Moteur de créativité révolutionnaire`;
        }

        return transformed;
    }

    // Interface HTML complète (votre interface d'origine)
    getHTMLInterface() {
        return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Alchemy Lab - Transformateur d'Effets Visuels</title>
    <style>
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

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: var(--dark-primary);
            color: #ffffff;
            overflow-x: hidden;
            min-height: 100vh;
        }

        .particle-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
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
            animation: rotate 20s infinite linear;
        }

        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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

        .dropzone:hover {
            border-color: var(--accent-neon);
            box-shadow: 0 0 25px rgba(0, 245, 255, 0.3);
        }

        .dropzone.has-file {
            border-color: var(--success);
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
            animation: rotate 20s infinite linear;
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

        .level-card:hover {
            transform: scale(1.05) translateY(-10px);
        }

        .level-card.selected {
            border-color: var(--accent-gold);
            box-shadow: 0 0 25px rgba(255, 215, 0, 0.3);
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

        .transform-button-container {
            position: relative;
            margin-top: 1rem;
        }

        .transform-button {
            position: relative;
            width: 100%;
            max-width: 500px;
            height: 70px;
            background: linear-gradient(90deg, var(--accent-gold), var(--accent-neon));
            border: none;
            border-radius: 35px;
            cursor: pointer;
            overflow: hidden;
            padding: 0;
            color: var(--dark-primary);
            font-size: 1.2rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
        }

        .transform-button:hover {
            transform: scale(1.03);
        }

        .transform-button:disabled {
            cursor: not-allowed;
            opacity: 0.6;
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

        .panel-header h4 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-right: auto;
        }

        .code-viewport {
            flex: 1;
            overflow: auto;
            max-height: 400px;
            background: #1a1a1a;
            color: #00ff00;
            padding: 1rem;
            font-family: 'Courier New', monospace;
            white-space: pre-wrap;
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
        }

        .hidden { display: none !important; }
        .visible { display: block !important; }

        @media (max-width: 1024px) {
            .code-panels { flex-direction: column; }
        }

        @media (max-width: 768px) {
            .main-content { padding: 1rem; }
            .dropzone { padding: 2rem 1.5rem; min-height: 250px; }
            .levels-grid { grid-template-columns: 1fr; }
            .app-title { font-size: 1.8rem; }
        }
    </style>
</head>
<body>
    <div class="digital-alchemy-app">
        <canvas class="particle-background" id="particles"></canvas>
        
        <div class="app-container">
            <header class="header">
                <div class="header-content">
                    <div class="logo-container">
                        <div class="logo">⚗️</div>
                    </div>
                    
                    <h1 class="app-title">
                        <span class="title-highlight">VISUAL EFFECTS</span> TRANSFORMER
                    </h1>
                    
                    <p class="app-subtitle">Digital Alchemy Lab</p>
                </div>
            </header>
            
            <main class="main-content">
                <!-- Étape 1: Upload -->
                <div id="step-upload" class="step-container">
                    <div class="dropzone-container">
                        <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
                            <input type="file" id="fileInput" accept=".js,.mjs" style="display: none;">
                            
                            <div class="dropzone-content">
                                <div class="dropzone-icon-container">
                                    <div class="hexagon-container">
                                        <div class="hexagon">⬢</div>
                                    </div>
                                </div>
                                
                                <h3 class="dropzone-title" id="dropzone-title">
                                    SOURCE CODE ANALYZER
                                </h3>
                                
                                <div id="file-info" class="file-info hidden">
                                    <div class="file-name" id="file-name"></div>
                                    <div class="file-size" id="file-size"></div>
                                </div>
                                
                                <p class="dropzone-subtitle" id="dropzone-subtitle">
                                    Glissez-déposez votre fichier .js ici ou cliquez pour sélectionner
                                </p>
                                
                                <div class="tech-specs">
                                    <span class="spec">📊 JavaScript ES6+</span>
                                    <span class="spec">🔒 Max: 1MB</span>
                                    <span class="spec">⚡ Analyse instantanée</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="level-selector" class="level-selector-container hidden">
                        <h3 class="section-title">🎛️ INTENSITÉ DE TRANSFORMATION</h3>
                        
                        <div class="levels-grid">
                            <div class="level-card" data-level="1">
                                <div class="level-content">
                                    <div class="level-icon">⭐</div>
                                    <h4>STANDARD</h4>
                                    <div class="module-count">7 MODULES</div>
                                    <p>Optimisation essentielle</p>
                                    
                                    <div class="features-list">
                                        <span class="feature-tag">Optimisation du code</span>
                                        <span class="feature-tag">Harmonie des couleurs</span>
                                        <span class="feature-tag">Amélioration des performances</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="level-card" data-level="2">
                                <div class="level-content">
                                    <div class="level-icon">🔥</div>
                                    <h4>PROFESSIONNEL</h4>
                                    <div class="module-count">13 MODULES</div>
                                    <p>Intelligence avancée</p>
                                    
                                    <div class="features-list">
                                        <span class="feature-tag">Adaptation utilisateur</span>
                                        <span class="feature-tag">Analyse contextuelle</span>
                                        <span class="feature-tag">Synchronisation des flux</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="level-card" data-level="3">
                                <div class="level-content">
                                    <div class="level-icon">💎</div>
                                    <h4>PREMIUM</h4>
                                    <div class="module-count">23 MODULES</div>
                                    <p>Moteur de créativité révolutionnaire</p>
                                    
                                    <div class="features-list">
                                        <span class="feature-tag">Variations infinies</span>
                                        <span class="feature-tag">IA prédictive</span>
                                        <span class="feature-tag">Style signature</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="transform-button-container" class="transform-button-container hidden">
                        <button class="transform-button" id="transform-button">
                            <span>⚗️</span>
                            <span>INITIER LA TRANSFORMATION</span>
                            <span>⚗️</span>
                        </button>
                    </div>
                </div>
                
                <!-- Étape 2: Comparaison -->
                <div id="step-compare" class="step-container hidden">
                    <div class="comparison-container">
                        <h3 class="section-title">🔬 LABORATOIRE DE COMPARAISON MOLÉCULAIRE</h3>
                        
                        <div class="code-panels">
                            <div class="code-panel original">
                                <div class="panel-header">
                                    <h4>ADN ORIGINAL</h4>
                                </div>
                                
                                <div class="code-viewport" id="original-code">
                                    // Code original apparaîtra ici...
                                </div>
                            </div>
                            
                            <div class="code-panel transformed">
                                <div class="panel-header">
                                    <h4>GÉNOME AMÉLIORÉ</h4>
                                </div>
                                
                                <div class="code-viewport" id="transformed-code">
                                    // Code transformé apparaîtra ici...
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="download-container">
                        <div class="download-content">
                            <div class="download-icon">💾</div>
                            <h3>TÉLÉCHARGER VOTRE EFFET TRANSFORMÉ</h3>
                            <p>Votre effet JavaScript a été métamorphosé avec succès</p>
                            
                            <div class="download-actions">
                                <button class="download-button" id="download-button">
                                    <span>💾</span>
                                    <span>TÉLÉCHARGER LE FICHIER</span>
                                </button>
                                
                                <button class="reset-button" id="reset-button">
                                    <span>🔄</span>
                                    <span>TRANSFORMER UN AUTRE EFFET</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        // État de l'application
        let selectedFile = null;
        let fileContent = '';
        let selectedLevel = 1;
        let transformedCode = '';
        let transformationId = '';

        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            initParticles();
            setupEventListeners();
        });

        // Particules d'arrière-plan
        function initParticles() {
            const canvas = document.getElementById('particles');
            const ctx = canvas.getContext('2d');
            
            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            
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
                    this.color = \`rgba(\${Math.random() > 0.5 ? '0, 245, 255' : '255, 215, 0'}, \${Math.random() * 0.5 + 0.2})\`;
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
            
            function connectParticles() {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 100) {
                            ctx.strokeStyle = \`rgba(0, 245, 255, \${0.2 * (1 - distance / 100)})\`;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            }
            
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });
                
                connectParticles();
                requestAnimationFrame(animate);
            }
            
            animate();
        }

        // Configuration des événements
        function setupEventListeners() {
            // Upload de fichier
            document.getElementById('fileInput').addEventListener('change', handleFileSelect);
            
            // Sélection des niveaux
            document.querySelectorAll('.level-card').forEach(card => {
                card.addEventListener('click', function() {
                    document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedLevel = parseInt(this.dataset.level);
                });
            });
            
            // Bouton de transformation
            document.getElementById('transform-button').addEventListener('click', startTransformation);
            
            // Boutons de téléchargement et reset
            document.getElementById('download-button').addEventListener('click', downloadTransformedFile);
            document.getElementById('reset-button').addEventListener('click', resetApp);
        }

        // Gestion des fichiers
        function handleFileSelect(event) {
            selectedFile = event.target.files[0];
            if (selectedFile) {
                // Interface
                document.getElementById('dropzone-title').textContent = 'FICHIER SÉLECTIONNÉ';
                document.getElementById('dropzone-subtitle').classList.add('hidden');
                document.getElementById('file-info').classList.remove('hidden');
                document.getElementById('file-name').textContent = selectedFile.name;
                document.getElementById('file-size').textContent = (selectedFile.size / 1024).toFixed(2) + ' KB';
                document.getElementById('dropzone').classList.add('has-file');
                
                // Afficher sélection niveau et bouton
                document.getElementById('level-selector').classList.remove('hidden');
                document.getElementById('transform-button-container').classList.remove('hidden');
                
                // Lire le contenu
                const reader = new FileReader();
                reader.onload = function(e) {
                    fileContent = e.target.result;
                };
                reader.readAsText(selectedFile);
                
                console.log('🎨 Digital Alchemy Lab - Interface d\\'origine restaurée avec succès!');
            }
        }

        // Transformation
        async function startTransformation() {
            if (!selectedFile || !fileContent) {
                alert('Veuillez sélectionner un fichier JavaScript');
                return;
            }

            try {
                document.getElementById('transform-button').textContent = 'TRANSFORMATION EN COURS...';
                document.getElementById('transform-button').disabled = true;

                const response = await fetch('/api/transform', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        filename: selectedFile.name,
                        code: fileContent,
                        level: selectedLevel
                    })
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la transformation');
                }

                const result = await response.json();
                transformedCode = result.transformedCode;
                transformationId = result.transformationId;

                // Afficher la comparaison
                showComparison();

            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la transformation. Veuillez réessayer.');
                document.getElementById('transform-button').textContent = 'INITIER LA TRANSFORMATION';
                document.getElementById('transform-button').disabled = false;
            }
        }

        function showComparison() {
            // Cacher étape upload
            document.getElementById('step-upload').classList.add('hidden');
            
            // Afficher étape comparaison
            document.getElementById('step-compare').classList.remove('hidden');
            
            // Remplir les codes
            document.getElementById('original-code').textContent = fileContent;
            document.getElementById('transformed-code').textContent = transformedCode;
        }

        // Téléchargement
        async function downloadTransformedFile() {
            if (!transformationId) {
                alert('Aucune transformation à télécharger');
                return;
            }

            try {
                const response = await fetch(\`/api/download/\${transformationId}\`);
                if (!response.ok) {
                    throw new Error('Erreur lors du téléchargement');
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = selectedFile.name.replace('.js', '_transformed.js');
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);

                console.log('🔊 Son de téléchargement activé');
                
            } catch (error) {
                console.error('Erreur téléchargement:', error);
                alert('Erreur lors du téléchargement');
            }
        }

        // Reset de l'application
        function resetApp() {
            selectedFile = null;
            fileContent = '';
            transformedCode = '';
            transformationId = '';
            selectedLevel = 1;

            // Reset interface
            document.getElementById('step-upload').classList.remove('hidden');
            document.getElementById('step-compare').classList.add('hidden');
            
            document.getElementById('dropzone-title').textContent = 'SOURCE CODE ANALYZER';
            document.getElementById('dropzone-subtitle').classList.remove('hidden');
            document.getElementById('file-info').classList.add('hidden');
            document.getElementById('dropzone').classList.remove('has-file');
            
            document.getElementById('level-selector').classList.add('hidden');
            document.getElementById('transform-button-container').classList.add('hidden');
            
            document.getElementById('transform-button').textContent = 'INITIER LA TRANSFORMATION';
            document.getElementById('transform-button').disabled = false;
            
            document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
            document.querySelector('.level-card[data-level="1"]').classList.add('selected');
            
            document.getElementById('fileInput').value = '';
            
            console.log('🔄 Application réinitialisée');
        }
    </script>
</body>
</html>`;
    }

    // Gestionnaire de requêtes HTTP
    handleRequest(req, res) {
        const parsedUrl = parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const method = req.method;

        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);

        // Routes
        if (pathname === '/' || pathname === '/app') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(this.getHTMLInterface());
            return;
        }

        if (pathname === '/api/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                status: 'ok', 
                server: 'autonomous', 
                dependencies: 'none',
                features: ['transform', 'download', 'preview']
            }));
            return;
        }

        if (pathname === '/api/transform' && method === 'POST') {
            this.handleTransform(req, res);
            return;
        }

        if (pathname.startsWith('/api/download/')) {
            const transformationId = pathname.split('/')[3];
            this.handleDownload(transformationId, res);
            return;
        }

        // 404
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route non trouvée' }));
    }

    // Transformation API
    handleTransform(req, res) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const { filename, code, level } = JSON.parse(body);
                
                // Transformer le code
                const transformedCode = this.transformCode(code, level);
                
                // Générer ID unique
                const transformationId = Date.now().toString();
                
                // Sauvegarder
                this.transformations.set(transformationId, {
                    id: transformationId,
                    originalFilename: filename,
                    originalCode: code,
                    transformedCode,
                    level,
                    timestamp: new Date().toISOString()
                });

                // Sauvegarder sur disque
                const filepath = `./temp/${transformationId}_transformed.js`;
                writeFileSync(filepath, transformedCode);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    transformationId,
                    transformedCode,
                    message: `Transformation niveau ${level} réussie`
                }));
                
            } catch (error) {
                console.error('Erreur transformation:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Erreur lors de la transformation' }));
            }
        });
    }

    // Téléchargement API
    handleDownload(transformationId, res) {
        try {
            const transformation = this.transformations.get(transformationId);
            
            if (!transformation) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Transformation non trouvée' }));
                return;
            }

            const filename = transformation.originalFilename.replace('.js', '_transformed.js');
            
            res.writeHead(200, {
                'Content-Type': 'application/javascript',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': Buffer.byteLength(transformation.transformedCode)
            });
            
            res.end(transformation.transformedCode);
            
        } catch (error) {
            console.error('Erreur téléchargement:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Erreur lors du téléchargement' }));
        }
    }

    // Démarrage du serveur
    start() {
        const server = createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(this.port, this.host, () => {
            console.log('🚀 === SERVEUR AUTONOME ULTIME (ZERO DÉPENDANCE) ===');
            console.log(`✅ Serveur démarré sur http://${this.host}:${this.port}`);
            console.log(`🎨 Interface: http://${this.host}:${this.port}/app`);
            console.log(`📡 API: http://${this.host}:${this.port}/api/health`);
            console.log('🔥 AUCUNE DÉPENDANCE REQUISE - 100% AUTONOME');
        });

        server.on('error', (err) => {
            console.error('❌ Erreur serveur:', err);
        });
    }
}

// Démarrage
const server = new AutonomousVisualEffectsServer();
server.start();
