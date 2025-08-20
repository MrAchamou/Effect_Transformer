// Version simplifiée et autonome du logo 3D rotatif
class LogoSpin3DEffect {
    constructor(config = {}) {
        this.id = 'logo-3d-spin-rotation-012';
        this.name = 'Rotation 3D Logo Dynamique';
        this.category = '3d';
        this.version = '1.0';
        this.performance = 'medium';
        
        // Paramètres par défaut
        this.parameters = {
            vitesse: 1,
            intensite: 0.8,
            axeRotationX: 0.3,
            axeRotationY: 1,
            axeRotationZ: 0.2,
            profondeur3D: 0.8,
            intensiteReflets: 0.7,
            metallicite: 0.6,
            rugosite: 0.3,
            couleurMateriau: '#2563eb',
            couleurReflet: '#ffffff',
            eclairageAmbiant: 0.4
        };

        // Variables principales de rotation 3D
        this.temps = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.vitesseRotation = { x: 0, y: 0, z: 0 };
        
        // Géométrie 3D
        this.matriceTransformation = this.createIdentityMatrix();
        this.vertices3D = [];
        this.facesLogo = [];
        this.normalesFaces = [];
        
        // Système d'éclairage
        this.lumierePrincipale = { x: 1, y: 1, z: 1, intensite: 1 };
        this.lumiereSecondaire = { x: -0.5, y: 0.5, z: 0.8, intensite: 0.6 };
        
        // Canvas et contexte
        this.canvas = null;
        this.ctx = null;
        this.element = null;
    }

    // Création d'une matrice identité 4x4
    createIdentityMatrix() {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    // Initialisation de l'effet
    initialize(canvas, element) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.element = element || { width: canvas.width, height: canvas.height, content: 'LOGO' };
        
        this.initializeLogoGeometry();
        this.setupLightingSystems();
        
        // Reset des variables
        this.temps = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
    }

    initializeLogoGeometry() {
        const centerX = this.element.width / 2;
        const centerY = this.element.height / 2;
        const logoSize = Math.min(this.element.width, this.element.height) * 0.6;
        
        this.vertices3D = [];
        this.facesLogo = [];
        
        const text = this.element.content || 'LOGO';
        this.generateTextGeometry3D(text, centerX, centerY, logoSize);
        this.calculateFaceNormals();
    }

    generateTextGeometry3D(text, centerX, centerY, size) {
        const letterSpacing = size / text.length * 1.2;
        const depth = size * this.parameters.profondeur3D;
        
        for (let i = 0; i < text.length; i++) {
            const x = centerX - (text.length - 1) * letterSpacing / 2 + i * letterSpacing;
            const letterVertices = this.generateLetterVertices(x, centerY, size * 0.8, depth);
            this.vertices3D.push(...letterVertices);
        }
    }

    generateLetterVertices(x, y, size, depth) {
        const halfSize = size / 2;
        const halfDepth = depth / 2;
        
        return [
            // Face avant
            { x: x - halfSize, y: y - halfSize, z: halfDepth },
            { x: x + halfSize, y: y - halfSize, z: halfDepth },
            { x: x + halfSize, y: y + halfSize, z: halfDepth },
            { x: x - halfSize, y: y + halfSize, z: halfDepth },
            // Face arrière
            { x: x - halfSize, y: y - halfSize, z: -halfDepth },
            { x: x + halfSize, y: y - halfSize, z: -halfDepth },
            { x: x + halfSize, y: y + halfSize, z: -halfDepth },
            { x: x - halfSize, y: y + halfSize, z: -halfDepth }
        ];
    }

    calculateFaceNormals() {
        // Calcul des normales pour l'éclairage
        this.normalesFaces = [];
        // Implémentation simplifiée
        for (let i = 0; i < this.vertices3D.length / 8; i++) {
            this.normalesFaces.push({ x: 0, y: 0, z: 1 });
        }
    }

    setupLightingSystems() {
        this.lumierePrincipale = {
            x: 1, y: 1, z: 1,
            intensite: this.parameters.eclairageAmbiant,
            couleur: { r: 255, g: 255, b: 255 }
        };
        
        this.lumiereSecondaire = {
            x: -0.5, y: 0.5, z: 0.8,
            intensite: this.parameters.eclairageAmbiant * 0.6,
            couleur: { r: 200, g: 220, b: 255 }
        };
    }

    // Fonction principale d'animation
    animate(deltaTime) {
        this.temps += deltaTime * 0.001; // Conversion en secondes
        
        // Mise à jour des rotations
        this.rotationX += this.parameters.axeRotationX * this.parameters.vitesse * deltaTime * 0.001;
        this.rotationY += this.parameters.axeRotationY * this.parameters.vitesse * deltaTime * 0.001;
        this.rotationZ += this.parameters.axeRotationZ * this.parameters.vitesse * deltaTime * 0.001;
        
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Rendu du logo 3D
        this.render3DLogo();
    }

    render3DLogo() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Application des transformations 3D simplifiées
        const transformedVertices = this.vertices3D.map(vertex => {
            return this.transformVertex(vertex, this.rotationX, this.rotationY, this.rotationZ);
        });
        
        // Projection et rendu
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        
        // Rendu des faces avec éclairage basique
        for (let i = 0; i < transformedVertices.length; i += 8) {
            this.renderLetterFace(transformedVertices.slice(i, i + 8));
        }
        
        this.ctx.restore();
    }

    transformVertex(vertex, rotX, rotY, rotZ) {
        // Rotation X
        let y = vertex.y * Math.cos(rotX) - vertex.z * Math.sin(rotX);
        let z = vertex.y * Math.sin(rotX) + vertex.z * Math.cos(rotX);
        
        // Rotation Y
        let x = vertex.x * Math.cos(rotY) + z * Math.sin(rotY);
        z = -vertex.x * Math.sin(rotY) + z * Math.cos(rotY);
        
        // Rotation Z
        let newX = x * Math.cos(rotZ) - y * Math.sin(rotZ);
        y = x * Math.sin(rotZ) + y * Math.cos(rotZ);
        
        return { x: newX, y: y, z: z };
    }

    renderLetterFace(vertices) {
        if (vertices.length < 4) return;
        
        // Calcul de la profondeur moyenne pour le tri
        const avgZ = vertices.reduce((sum, v) => sum + v.z, 0) / vertices.length;
        
        // Éclairage basique basé sur la profondeur
        const brightness = Math.max(0.3, 1 - (avgZ + 50) / 100);
        
        // Couleur du matériau avec éclairage
        const color = this.hexToRgb(this.parameters.couleurMateriau);
        const finalColor = `rgba(${Math.floor(color.r * brightness)}, ${Math.floor(color.g * brightness)}, ${Math.floor(color.b * brightness)}, ${this.parameters.intensite})`;
        
        // Dessiner la face avant (simplifié)
        this.ctx.fillStyle = finalColor;
        this.ctx.strokeStyle = this.parameters.couleurReflet;
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < 4; i++) {
            this.ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        
        if (this.parameters.intensiteReflets > 0.5) {
            this.ctx.stroke();
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 37, g: 99, b: 235};
    }

    // Fonction de démarrage pour usage autonome
    start(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error('Canvas non trouvé:', canvasId);
            return;
        }
        
        this.initialize(canvas, { 
            width: canvas.width, 
            height: canvas.height, 
            content: 'LOGO' 
        });
        
        let lastTime = 0;
        const animationLoop = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            this.animate(deltaTime);
            requestAnimationFrame(animationLoop);
        };
        
        requestAnimationFrame(animationLoop);
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LogoSpin3DEffect;
}

// Usage autonome si chargé directement
if (typeof window !== 'undefined') {
    window.LogoSpin3DEffect = LogoSpin3DEffect;
}