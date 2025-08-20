class LogoSpin3DEffect extends BaseEffect {
    constructor(config = {}) {
        super({
            id: 'logo-3d-spin-rotation-012',
            name: 'Rotation 3D Logo Dynamique',
            category: '3d',
            version: '1.0',
            performance: 'medium',
            parameters: {
                vitesse: { type: 'range', min: 0.1, max: 3, default: 1 },
                intensite: { type: 'range', min: 0.3, max: 1, default: 0.8 },
                axeRotationX: { type: 'range', min: -1, max: 1, default: 0.3 },
                axeRotationY: { type: 'range', min: -1, max: 1, default: 1 },
                axeRotationZ: { type: 'range', min: -1, max: 1, default: 0.2 },
                profondeur3D: { type: 'range', min: 0.1, max: 2, default: 0.8 },
                intensiteReflets: { type: 'range', min: 0, max: 1, default: 0.7 },
                metallicite: { type: 'range', min: 0, max: 1, default: 0.6 },
                rugosite: { type: 'range', min: 0, max: 1, default: 0.3 },
                couleurMateriau: { type: 'color', default: '#2563eb' },
                couleurReflet: { type: 'color', default: '#ffffff' },
                eclairageAmbiant: { type: 'range', min: 0.1, max: 1, default: 0.4 }
            }
        });

        // SYSTÈME PRINCIPAL DE ROTATION 3D
        this.temps = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.vitesseRotation = { x: 0, y: 0, z: 0 };
        
        // VARIABLES GÉOMÉTRIQUES 3D
        this.matriceTransformation = this.createIdentityMatrix();
        this.matriceProjection = this.createIdentityMatrix();
        this.vertices3D = [];
        this.facesLogo = [];
        this.normalesFaces = [];
        
        // SYSTÈME DE DÉFORMATION COMPLEXE
        this.pointsControle = [];
        this.nombreVertices = 16; // Points de contrôle pour déformation
        this.rayonInfluence = 50;
        this.deformationAmplitude = 0;
        
        // ÉCLAIRAGE ET MATÉRIAUX DYNAMIQUES
        this.lumierePrincipale = { x: 1, y: 1, z: 1, intensite: 1 };
        this.lumiereSecondaire = { x: -0.5, y: 0.5, z: 0.8, intensite: 0.6 };
        this.materiauProprietes = {
            diffuse: { r: 37, g: 99, b: 235 },
            speculaire: { r: 255, g: 255, b: 255 },
            emission: { r: 0, g: 0, b: 0 },
            shininess: 32
        };
        
        // Canvas pour effets complexes
        this.canvasNormales = null;
        this.ctxNormales = null;
        this.canvasReflets = null;
        this.ctxReflets = null;
        this.canvasOmbres = null;
        this.ctxOmbres = null;
        
        // MICRO-VARIATIONS MÉCANIQUES
        this.microOscillations = [];
        this.tensionMecanique = 0;
        this.inertieMouvement = { x: 0, y: 0, z: 0 };
        
        // SYSTÈME ÉVÉNEMENTS DRAMATIQUES
        this.accelerationActive = false;
        this.prochainAcceleration = 5000; // 5 secondes
        this.dureeAcceleration = 0;
        this.facteurAcceleration = 1;
        
        // MÉMOIRE ET ADAPTATION CINÉTIQUE
        this.historiqueRotations = [];
        this.adaptationCinetique = 0;
        this.momentumAccumule = { x: 0, y: 0, z: 0 };
        
        // SYSTÈME DE REFLETS ENVIRONNEMENTAUX
        this.refletsEnvironnement = [];
        this.cartesEnvironnement = [];
        this.intensiteRefletsGlobale = 0;
        
        // DÉFORMATIONS DYNAMIQUES LOGO
        this.morphingActif = false;
        this.cibleMorphing = null;
        this.progressMorphing = 0;
        
        // PARTICULES DE BRILLANCE
        this.particulesEclat = [];
        this.poolParticules = [];
        this.maxParticules = 60;
        
        // SYSTÈME PHYSIQUE GYROSCOPIQUE
        this.gyroscope = {
            momentAngulaire: { x: 0, y: 0, z: 0 },
            precession: { x: 0, y: 0, z: 0 },
            stabilisation: 0.95
        };
    }

    initialize(canvas, element) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.element = element;
        
        // Configuration des canvas multiples pour effets complexes
        this.setupMultipleCanvas();
        
        // Initialisation de la géométrie 3D du logo
        this.initializeLogoGeometry();
        
        // Configuration des systèmes d'éclairage
        this.setupLightingSystems();
        
        // Initialisation des micro-oscillations mécaniques
        this.initializeMechanicalOscillations();
        
        // Configuration du pool de particules
        this.initializeParticlePool();
        
        // Setup des cartes d'environnement pour reflets
        this.setupEnvironmentMaps();
        
        // Configuration du système gyroscopique
        this.setupGyroscopicSystem();
        
        // Reset des timers et états
        this.temps = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
    }

    setupMultipleCanvas() {
        // Canvas pour calcul des normales
        this.canvasNormales = document.createElement('canvas');
        this.canvasNormales.width = this.element.width;
        this.canvasNormales.height = this.element.height;
        this.ctxNormales = this.canvasNormales.getContext('2d');
        
        // Canvas pour reflets dynamiques
        this.canvasReflets = document.createElement('canvas');
        this.canvasReflets.width = this.element.width;
        this.canvasReflets.height = this.element.height;
        this.ctxReflets = this.canvasReflets.getContext('2d');
        
        // Canvas pour ombres portées
        this.canvasOmbres = document.createElement('canvas');
        this.canvasOmbres.width = this.element.width;
        this.canvasOmbres.height = this.element.height;
        this.ctxOmbres = this.canvasOmbres.getContext('2d');
    }

    initializeLogoGeometry() {
        const centerX = this.element.width / 2;
        const centerY = this.element.height / 2;
        const logoSize = Math.min(this.element.width, this.element.height) * 0.6;
        
        // Création des vertices 3D pour un logo complexe
        this.vertices3D = [];
        this.facesLogo = [];
        
        // Génération d'un logo 3D basé sur le texte
        const text = this.element.content || 'LOGO';
        this.generateTextGeometry3D(text, centerX, centerY, logoSize);
        
        // Calcul des normales pour chaque face
        this.calculateFaceNormals();
        
        // Initialisation des points de contrôle pour déformations
        this.initializeControlPoints();
    }

    generateTextGeometry3D(text, centerX, centerY, size) {
        const letterSpacing = size / text.length * 1.2;
        const depth = size * this.config.parameters.profondeur3D.default;
        
        for (let i = 0; i < text.length; i++) {
            const letter = text[i];
            const x = centerX - (text.length - 1) * letterSpacing / 2 + i * letterSpacing;
            
            // Génération des vertices pour chaque lettre en 3D
            const letterVertices = this.generateLetterVertices(letter, x, centerY, size * 0.8, depth);
            this.vertices3D.push(...letterVertices);
            
            // Génération des faces pour chaque lettre
            const letterFaces = this.generateLetterFaces(letterVertices.length / 8); // 8 vertices par lettre
            this.facesLogo.push(...letterFaces);
        }
    }

    generateLetterVertices(letter, x, y, size, depth) {
        // Génération simplifiée d'un cube 3D pour chaque lettre
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

    generateLetterFaces(vertexOffset) {
        const offset = vertexOffset * 8;
        return [
            // Face avant
            [offset + 0, offset + 1, offset + 2, offset + 3],
            // Face arrière
            [offset + 4, offset + 7, offset + 6, offset + 5],
            // Face droite
            [offset + 1, offset + 5, offset + 6, offset + 2],
            // Face gauche
            [offset + 4, offset + 0, offset + 3, offset + 7],
            // Face haut
            [offset + 3, offset + 2, offset + 6, offset + 7],
            // Face bas
            [offset + 4, offset + 5, offset + 1, offset + 0]
        ];
    }

    calculateFaceNormals() {
        this.normalesFaces = [];
        
        for (let face of this.facesLogo) {
            if (face.length >= 3) {
                const v1 = this.vertices3D[face[0]];
                const v2 = this.vertices3D[face[1]];
                const v3 = this.vertices3D[face[2]];
                
                // Calcul du produit vectoriel pour la normale
                const normal = this.calculateCrossProduct(
                    { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z },
                    { x: v3.x - v1.x, y: v3.y - v1.y, z: v3.z - v1.z }
                );
                
                // Normalisation
                const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
                if (length > 0) {
                    normal.x /= length;
                    normal.y /= length;
                    normal.z /= length;
                }
                
                this.normalesFaces.push(normal);
            }
        }
    }

    calculateCrossProduct(v1, v2) {
        return {
            x: v1.y * v2.z - v1.z * v2.y,
            y: v1.z * v2.x - v1.x * v2.z,
            z: v1.x * v2.y - v1.y * v2.x
        };
    }

    initializeControlPoints() {
        this.pointsControle = [];
        for (let i = 0; i < this.nombreVertices; i++) {
            this.pointsControle.push({
                x: Math.random() * this.element.width,
                y: Math.random() * this.element.height,
                z: (Math.random() - 0.5) * 100,
                influence: Math.random() * this.rayonInfluence,
                phase: Math.random() * Math.PI * 2,
                frequency: 0.5 + Math.random() * 2
            });
        }
    }

    setupLightingSystems() {
        // Configuration de l'éclairage principal
        this.lumierePrincipale = {
            x: 1, y: 1, z: 1,
            intensite: this.config.parameters.eclairageAmbiant.default,
            couleur: { r: 255, g: 255, b: 255 }
        };
        
        // Configuration de l'éclairage secondaire
        this.lumiereSecondaire = {
            x: -0.5, y: 0.5, z: 0.8,
            intensite: this.config.parameters.eclairageAmbiant.default * 0.6,
            couleur: { r: 200, g: 220, b: 255 }
        };
        
        // Normalisation des vecteurs de lumière
        this.normalizeLightVector(this.lumierePrincipale);
        this.normalizeLightVector(this.lumiereSecondaire);
    }

    normalizeLightVector(light) {
        const length = Math.sqrt(light.x * light.x + light.y * light.y + light.z * light.z);
        if (length > 0) {
            light.x /= length;
            light.y /= length;
            light.z /= length;
        }
    }

    initializeMechanicalOscillations() {
        this.microOscillations = [];
        
        // Génération de 6 oscillations mécaniques pour réalisme
        for (let i = 0; i < 6; i++) {
            this.microOscillations.push({
                frequency: 0.1 + Math.random() * 0.5, // Fréquences variées
                amplitude: 0.02 + Math.random() * 0.08, // Amplitudes subtiles
                phase: Math.random() * Math.PI * 2,
                type: ['rotation_x', 'rotation_y', 'rotation_z', 'translation_x', 'translation_y', 'scale'][i % 6],
                damping: 0.98 + Math.random() * 0.02 // Amortissement léger
            });
        }
    }

    initializeParticlePool() {
        this.poolParticules = [];
        for (let i = 0; i < this.maxParticules; i++) {
            this.poolParticules.push(this.createBrillianceParticle());
        }
    }

    createBrillianceParticle() {
        return {
            active: false,
            x: 0, y: 0, z: 0,
            vx: 0, vy: 0, vz: 0,
            
            // Propriétés visuelles
            size: 1,
            opacity: 1,
            couleur: '#ffffff',
            intensiteBrillance: 1,
            
            // Propriétés de mouvement orbital
            orbiteRadius: 0,
            orbiteAngle: 0,
            orbiteSpeed: 0,
            orbiteInclinaison: 0,
            
            // Synchronisation avec rotation
            syncWithRotation: true,
            phaseOffset: 0,
            
            // Vie de la particule
            life: 0,
            maxLife: 0,
            
            // Type de brillance
            type: 'reflet', // reflet, eclat, etincelle
            
            // Propriétés physiques
            masse: 1,
            friction: 0.98
        };
    }

    setupEnvironmentMaps() {
        // Cartes d'environnement simplifiées pour reflets
        this.cartesEnvironnement = [
            { direction: 'top', couleur: { r: 135, g: 206, b: 235 }, intensite: 0.8 },
            { direction: 'bottom', couleur: { r: 64, g: 64, b: 64 }, intensite: 0.4 },
            { direction: 'left', couleur: { r: 255, g: 255, b: 255 }, intensite: 0.6 },
            { direction: 'right', couleur: { r: 200, g: 200, b: 255 }, intensite: 0.5 },
            { direction: 'front', couleur: { r: 255, g: 248, b: 220 }, intensite: 0.7 },
            { direction: 'back', couleur: { r: 100, g: 100, b: 120 }, intensite: 0.3 }
        ];
    }

    setupGyroscopicSystem() {
        // Initialisation du système gyroscopique pour stabilisation
        this.gyroscope = {
            momentAngulaire: { x: 0, y: 0, z: 0 },
            precession: { x: 0, y: 0, z: 0 },
            stabilisation: 0.95,
            inertie: { x: 1, y: 1, z: 1 },
            couple: { x: 0, y: 0, z: 0 }
        };
    }

    // Fonction de bruit organique pour variations
    noise(x, y = 0, z = 0) {
        // Implémentation simplifiée de bruit de Perlin
        const p = Math.floor;
        const f = (t) => t * t * t * (t * (t * 6 - 15) + 10);
        const mix = (a, b, t) => a + t * (b - a);
        
        const X = p(x) & 255;
        const Y = p(y) & 255;
        const Z = p(z) & 255;
        
        x -= p(x);
        y -= p(y);
        z -= p(z);
        
        const u = f(x);
        const v = f(y);
        const w = f(z);
        
        // Simplification pour performance
        return mix(mix(mix(X, X + 1, u), mix(Y, Y + 1, v), v), 
                  mix(mix(Z, Z + 1, w), mix(X + Y, X + Y + 1, u), v), w) / 255;
    }

    // Fonctions d'easing mécaniques
    easingMecanique(t, type) {
        switch (type) {
            case 'gyroscope':
                // Easing gyroscopique avec stabilisation
                return t * t * (3 - 2 * t) * (1 - 0.1 * Math.sin(t * Math.PI * 4));
                
            case 'inertie':
                // Easing avec inertie mécanique
                return 1 - Math.pow(1 - t, 3) * (1 + 0.2 * Math.sin(t * Math.PI * 2));
                
            case 'acceleration':
                // Easing d'accélération progressive
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                
            case 'oscillation':
                // Easing oscillatoire amorti
                return Math.sin(t * Math.PI) * Math.exp(-t * 3);
                
            default:
                return t;
        }
    }

    createIdentityMatrix() {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    multiplyMatrices(a, b) {
        const result = this.createIdentityMatrix();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result[i][j] = 0;
                for (let k = 0; k < 4; k++) {
                    result[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return result;
    }

    createRotationMatrix(rx, ry, rz) {
        const cos = Math.cos;
        const sin = Math.sin;
        
        const rotX = [
            [1, 0, 0, 0],
            [0, cos(rx), -sin(rx), 0],
            [0, sin(rx), cos(rx), 0],
            [0, 0, 0, 1]
        ];
        
        const rotY = [
            [cos(ry), 0, sin(ry), 0],
            [0, 1, 0, 0],
            [-sin(ry), 0, cos(ry), 0],
            [0, 0, 0, 1]
        ];
        
        const rotZ = [
            [cos(rz), -sin(rz), 0, 0],
            [sin(rz), cos(rz), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        
        return this.multiplyMatrices(this.multiplyMatrices(rotX, rotY), rotZ);
    }

    transformVertex(vertex, matrix) {
        const x = vertex.x * matrix[0][0] + vertex.y * matrix[0][1] + vertex.z * matrix[0][2] + matrix[0][3];
        const y = vertex.x * matrix[1][0] + vertex.y * matrix[1][1] + vertex.z * matrix[1][2] + matrix[1][3];
        const z = vertex.x * matrix[2][0] + vertex.y * matrix[2][1] + vertex.z * matrix[2][2] + matrix[2][3];
        
        return { x, y, z };
    }

    projectVertex(vertex) {
        // Projection perspective simple
        const distance = 500;
        const scale = distance / (distance + vertex.z);
        
        return {
            x: vertex.x * scale,
            y: vertex.y * scale,
            scale: scale
        };
    }

    getParticleFromPool() {
        for (let particle of this.poolParticules) {
            if (!particle.active) {
                particle.active = true;
                return particle;
            }
        }
        return this.createBrillianceParticle();
    }

    update(deltaTime) {
        this.temps += deltaTime * this.config.parameters.vitesse.default;
        
        // Mise à jour des 8 systèmes principaux
        this.updateRotationSystem(deltaTime);
        this.updateGyroscopicStabilization(deltaTime);
        this.updateDeformationsComplexes(deltaTime);
        this.updateLightingDynamics(deltaTime);
        this.updateMicroOscillations(deltaTime);
        this.updateAccelerationEvents(deltaTime);
        this.updateKineticAdaptation(deltaTime);
        this.updateBrillianceParticles(deltaTime);
    }

    updateRotationSystem(deltaTime) {
        const vitesse = this.config.parameters.vitesse.default;
        const intensite = this.config.parameters.intensite.default;
        
        // Calcul des vitesses de rotation selon les axes configurés
        this.vitesseRotation.x = this.config.parameters.axeRotationX.default * vitesse * intensite;
        this.vitesseRotation.y = this.config.parameters.axeRotationY.default * vitesse * intensite;
        this.vitesseRotation.z = this.config.parameters.axeRotationZ.default * vitesse * intensite;
        
        // Application de l'accélération si active
        if (this.accelerationActive) {
            this.vitesseRotation.x *= this.facteurAcceleration;
            this.vitesseRotation.y *= this.facteurAcceleration;
            this.vitesseRotation.z *= this.facteurAcceleration;
        }
        
        // Mise à jour des rotations
        this.rotationX += this.vitesseRotation.x * deltaTime * 0.001;
        this.rotationY += this.vitesseRotation.y * deltaTime * 0.001;
        this.rotationZ += this.vitesseRotation.z * deltaTime * 0.001;
        
        // Calcul de la matrice de transformation
        this.matriceTransformation = this.createRotationMatrix(this.rotationX, this.rotationY, this.rotationZ);
    }

    updateGyroscopicStabilization(deltaTime) {
        // Simulation d'effets gyroscopiques pour réalisme
        const dt = deltaTime * 0.001;
        
        // Calcul du moment angulaire
        this.gyroscope.momentAngulaire.x += this.vitesseRotation.x * dt;
        this.gyroscope.momentAngulaire.y += this.vitesseRotation.y * dt;
        this.gyroscope.momentAngulaire.z += this.vitesseRotation.z * dt;
        
        // Application de la stabilisation gyroscopique
        this.gyroscope.momentAngulaire.x *= this.gyroscope.stabilisation;
        this.gyroscope.momentAngulaire.y *= this.gyroscope.stabilisation;
        this.gyroscope.momentAngulaire.z *= this.gyroscope.stabilisation;
        
        // Calcul de la précession
        this.gyroscope.precession.x = this.gyroscope.momentAngulaire.y * this.gyroscope.momentAngulaire.z * 0.01;
        this.gyroscope.precession.y = this.gyroscope.momentAngulaire.z * this.gyroscope.momentAngulaire.x * 0.01;
        this.gyroscope.precession.z = this.gyroscope.momentAngulaire.x * this.gyroscope.momentAngulaire.y * 0.01;
        
        // Application de la précession aux rotations
        this.rotationX += this.gyroscope.precession.x * dt;
        this.rotationY += this.gyroscope.precession.y * dt;
        this.rotationZ += this.gyroscope.precession.z * dt;
    }

    updateDeformationsComplexes(deltaTime) {
        // Mise à jour des points de contrôle pour déformations organiques
        for (let point of this.pointsControle) {
            point.phase += deltaTime * 0.001 * point.frequency;
            
            // Déformation basée sur le bruit et les oscillations
            const noiseValue = this.noise(point.x * 0.01, point.y * 0.01, this.temps * 0.0001);
            const oscillation = Math.sin(point.phase) * point.influence;
            
            point.currentInfluence = (noiseValue + oscillation * 0.5) * this.config.parameters.intensite.default;
        }
        
        // Calcul de l'amplitude de déformation globale
        this.deformationAmplitude = 0;
        for (let point of this.pointsControle) {
            this.deformationAmplitude += Math.abs(point.currentInfluence);
        }
        this.deformationAmplitude /= this.pointsControle.length;
    }

    updateLightingDynamics(deltaTime) {
        const temps = this.temps * 0.001;
        
        // Rotation dynamique de l'éclairage principal
        this.lumierePrincipale.x = Math.cos(temps * 0.3) * Math.sin(temps * 0.2);
        this.lumierePrincipale.y = Math.sin(temps * 0.4) * Math.cos(temps * 0.15);
        this.lumierePrincipale.z = Math.cos(temps * 0.25) * Math.sin(temps * 0.35);
        this.normalizeLightVector(this.lumierePrincipale);
        
        // Variation de l'intensité lumineuse
        this.lumierePrincipale.intensite = this.config.parameters.eclairageAmbiant.default * 
                                          (0.8 + 0.2 * Math.sin(temps * 0.5));
        
        // Mise à jour de l'éclairage secondaire
        this.lumiereSecondaire.x = -this.lumierePrincipale.x * 0.6;
        this.lumiereSecondaire.y = this.lumierePrincipale.y * 0.4;
        this.lumiereSecondaire.z = this.lumierePrincipale.z * 0.8;
        this.normalizeLightVector(this.lumiereSecondaire);
        
        // Mise à jour des propriétés matériau
        this.updateMaterialProperties(deltaTime);
    }

    updateMaterialProperties(deltaTime) {
        const metallicite = this.config.parameters.metallicite.default;
        const rugosite = this.config.parameters.rugosite.default;
        
        // Variation dynamique de la métallicité
        this.materiauProprietes.shininess = 32 * (1 - rugosite) * (1 + metallicite);
        
        // Mise à jour des couleurs matériau
        const couleurBase = this.hexToRgb(this.config.parameters.couleurMateriau.default);
        this.materiauProprietes.diffuse = couleurBase;
        
        // Couleur spéculaire influencée par la métallicité
        const couleurReflet = this.hexToRgb(this.config.parameters.couleurReflet.default);
        this.materiauProprietes.speculaire = {
            r: couleurReflet.r * (0.5 + metallicite * 0.5),
            g: couleurReflet.g * (0.5 + metallicite * 0.5),
            b: couleurReflet.b * (0.5 + metallicite * 0.5)
        };
    }

    updateMicroOscillations(deltaTime) {
        for (let oscillation of this.microOscillations) {
            oscillation.phase += deltaTime * 0.001 * oscillation.frequency;
            
            const amplitude = oscillation.amplitude * this.config.parameters.intensite.default;
            const value = Math.sin(oscillation.phase) * amplitude;
            
            // Application selon le type d'oscillation
            switch (oscillation.type) {
                case 'rotation_x':
                    this.rotationX += value * 0.1;
                    break;
                case 'rotation_y':
                    this.rotationY += value * 0.1;
                    break;
                case 'rotation_z':
                    this.rotationZ += value * 0.1;
                    break;
                case 'translation_x':
                    this.inertieMouvement.x = value * 2;
                    break;
                case 'translation_y':
                    this.inertieMouvement.y = value * 2;
                    break;
                case 'scale':
                    this.tensionMecanique = value * 0.05;
                    break;
            }
            
            // Application de l'amortissement
            oscillation.amplitude *= oscillation.damping;
        }
    }

    updateAccelerationEvents(deltaTime) {
        // Gestion des événements d'accélération dramatiques
        if (this.accelerationActive) {
            this.dureeAcceleration += deltaTime;
            
            // Courbe d'accélération progressive
            const progress = this.dureeAcceleration / 2000; // 2 secondes d'accélération
            this.facteurAcceleration = 1 + this.easingMecanique(Math.min(progress, 1), 'acceleration') * 3;
            
            if (this.dureeAcceleration >= 2000) {
                this.accelerationActive = false;
                this.dureeAcceleration = 0;
                this.facteurAcceleration = 1;
                this.prochainAcceleration = 3000 + Math.random() * 7000; // 3-10 secondes
            }
        } else {
            this.prochainAcceleration -= deltaTime;
            if (this.prochainAcceleration <= 0) {
                this.accelerationActive = true;
                this.dureeAcceleration = 0;
            }
        }
    }

    updateKineticAdaptation(deltaTime) {
        // Accumulation du momentum pour adaptation cinétique
        this.momentumAccumule.x += this.vitesseRotation.x * deltaTime * 0.001;
        this.momentumAccumule.y += this.vitesseRotation.y * deltaTime * 0.001;
        this.momentumAccumule.z += this.vitesseRotation.z * deltaTime * 0.001;
        
        // Stockage de l'historique des rotations
        this.historiqueRotations.push({
            temps: this.temps,
            rotationX: this.rotationX,
            rotationY: this.rotationY,
            rotationZ: this.rotationZ,
            vitesseX: this.vitesseRotation.x,
            vitesseY: this.vitesseRotation.y,
            vitesseZ: this.vitesseRotation.z
        });
        
        // Limitation de l'historique pour performance
        if (this.historiqueRotations.length > 100) {
            this.historiqueRotations.shift();
        }
        
        // Calcul de l'adaptation cinétique
        if (this.historiqueRotations.length > 10) {
            const recent = this.historiqueRotations.slice(-10);
            let varianceVitesse = 0;
            
            for (let i = 1; i < recent.length; i++) {
                const deltaVx = recent[i].vitesseX - recent[i-1].vitesseX;
                const deltaVy = recent[i].vitesseY - recent[i-1].vitesseY;
                const deltaVz = recent[i].vitesseZ - recent[i-1].vitesseZ;
                varianceVitesse += deltaVx * deltaVx + deltaVy * deltaVy + deltaVz * deltaVz;
            }
            
            this.adaptationCinetique = Math.min(varianceVitesse / recent.length, 1);
        }
    }

    updateBrillianceParticles(deltaTime) {
        // Mise à jour des particules de brillance existantes
        for (let particle of this.particulesEclat) {
            if (!particle.active) continue;
            
            particle.life += deltaTime;
            
            if (particle.life >= particle.maxLife) {
                particle.active = false;
                continue;
            }
            
            // Synchronisation avec la rotation si activée
            if (particle.syncWithRotation) {
                particle.orbiteAngle += (this.vitesseRotation.y + particle.phaseOffset) * deltaTime * 0.001;
            } else {
                particle.orbiteAngle += particle.orbiteSpeed * deltaTime * 0.001;
            }
            
            // Position orbitale 3D
            const cosAngle = Math.cos(particle.orbiteAngle);
            const sinAngle = Math.sin(particle.orbiteAngle);
            const cosIncl = Math.cos(particle.orbiteInclinaison);
            const sinIncl = Math.sin(particle.orbiteInclinaison);
            
            particle.x = cosAngle * particle.orbiteRadius;
            particle.y = sinAngle * particle.orbiteRadius * cosIncl;
            particle.z = sinAngle * particle.orbiteRadius * sinIncl;
            
            // Transformation 3D
            const transformed = this.transformVertex(particle, this.matriceTransformation);
            particle.screenX = transformed.x + this.element.width / 2;
            particle.screenY = transformed.y + this.element.height / 2;
            particle.screenZ = transformed.z;
            
            // Opacité basée sur la distance et l'âge
            const lifeRatio = particle.life / particle.maxLife;
            const distanceFactor = Math.max(0, 1 - Math.abs(particle.screenZ) / 200);
            particle.opacity = (1 - lifeRatio) * distanceFactor * this.config.parameters.intensiteReflets.default;
            
            // Taille variable avec la distance
            particle.currentSize = particle.size * distanceFactor * (0.5 + 0.5 * Math.sin(particle.life * 0.01));
            
            // Application de la friction
            particle.vx *= particle.friction;
            particle.vy *= particle.friction;
            particle.vz *= particle.friction;
        }
        
        // Génération de nouvelles particules
        this.generateBrillianceParticles(deltaTime);
    }

    generateBrillianceParticles(deltaTime) {
        const shouldGenerate = Math.random() < 0.05 * this.config.parameters.intensiteReflets.default;
        
        if (shouldGenerate) {
            const particle = this.getParticleFromPool();
            if (particle) {
                // Position initiale aléatoire autour du logo
                const angle = Math.random() * Math.PI * 2;
                const radius = 50 + Math.random() * 100;
                const inclinaison = (Math.random() - 0.5) * Math.PI;
                
                particle.x = Math.cos(angle) * radius;
                particle.y = Math.sin(angle) * radius * 0.5;
                particle.z = Math.sin(inclinaison) * radius * 0.3;
                
                // Propriétés orbitales
                particle.orbiteRadius = radius;
                particle.orbiteAngle = angle;
                particle.orbiteSpeed = 0.5 + Math.random() * 2;
                particle.orbiteInclinaison = inclinaison;
                
                // Propriétés visuelles
                particle.size = 1 + Math.random() * 3;
                particle.opacity = 1;
                particle.couleur = this.config.parameters.couleurReflet.default;
                particle.intensiteBrillance = 0.5 + Math.random() * 0.5;
                
                // Durée de vie
                particle.life = 0;
                particle.maxLife = 2000 + Math.random() * 3000;
                
                // Type de particule
                particle.type = ['reflet', 'eclat', 'etincelle'][Math.floor(Math.random() * 3)];
                
                // Synchronisation
                particle.syncWithRotation = Math.random() < 0.7;
                particle.phaseOffset = (Math.random() - 0.5) * 0.5;
                
                // Propriétés physiques
                particle.masse = 0.5 + Math.random() * 1.5;
                particle.friction = 0.95 + Math.random() * 0.04;
                
                this.particulesEclat.push(particle);
            }
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }

    calculateLighting(normal, vertex) {
        // Calcul de l'éclairage Phong simplifié
        const lightDir = this.lumierePrincipale;
        const viewDir = { x: 0, y: 0, z: 1 }; // Direction de vue fixe
        
        // Produit scalaire pour éclairage diffus
        const dotProduct = normal.x * lightDir.x + normal.y * lightDir.y + normal.z * lightDir.z;
        const diffuse = Math.max(0, dotProduct) * this.lumierePrincipale.intensite;
        
        // Calcul de la réflexion spéculaire
        const reflectX = 2 * dotProduct * normal.x - lightDir.x;
        const reflectY = 2 * dotProduct * normal.y - lightDir.y;
        const reflectZ = 2 * dotProduct * normal.z - lightDir.z;
        
        const specDot = reflectX * viewDir.x + reflectY * viewDir.y + reflectZ * viewDir.z;
        const specular = Math.pow(Math.max(0, specDot), this.materiauProprietes.shininess) * 
                        this.config.parameters.intensiteReflets.default;
        
        return {
            diffuse: diffuse,
            specular: specular,
            ambient: this.config.parameters.eclairageAmbiant.default * 0.3
        };
    }

    render(ctx, element, deltaTime) {
        ctx.save();
        
        // Rendu des ombres portées (couche arrière)
        this.renderProjectedShadows(ctx);
        
        // Rendu des particules de brillance (arrière-plan)
        this.renderBrillianceParticles(ctx);
        
        // Rendu du logo 3D principal
        this.renderLogo3D(ctx);
        
        // Rendu des reflets environnementaux
        this.renderEnvironmentalReflections(ctx);
        
        // Rendu des effets de surface
        this.renderSurfaceEffects(ctx);
        
        // Rendu des indications subtiles (debug/info)
        this.renderSubtleIndicators(ctx);
        
        ctx.restore();
    }

    renderProjectedShadows(ctx) {
        // Rendu des ombres portées sur le canvas dédié
        this.ctxOmbres.clearRect(0, 0, this.element.width, this.element.height);
        
        const shadowOffset = { x: 20, y: 20 };
        const shadowBlur = 15;
        const shadowOpacity = 0.3 * this.config.parameters.intensite.default;
        
        this.ctxOmbres.globalAlpha = shadowOpacity;
        this.ctxOmbres.fillStyle = '#000000';
        this.ctxOmbres.filter = `blur(${shadowBlur}px)`;
        
        // Projection des faces pour l'ombre
        for (let i = 0; i < this.facesLogo.length; i++) {
            const face = this.facesLogo[i];
            if (face.length < 3) continue;
            
            this.ctxOmbres.beginPath();
            
            for (let j = 0; j < face.length; j++) {
                const vertex = this.vertices3D[face[j]];
                const transformed = this.transformVertex(vertex, this.matriceTransformation);
                const projected = this.projectVertex(transformed);
                
                const x = projected.x + this.element.width / 2 + shadowOffset.x;
                const y = projected.y + this.element.height / 2 + shadowOffset.y;
                
                if (j === 0) {
                    this.ctxOmbres.moveTo(x, y);
                } else {
                    this.ctxOmbres.lineTo(x, y);
                }
            }
            
            this.ctxOmbres.closePath();
            this.ctxOmbres.fill();
        }
        
        this.ctxOmbres.filter = 'none';
        this.ctxOmbres.globalAlpha = 1;
        
        // Composition de l'ombre sur le canvas principal
        ctx.globalAlpha = 1;
        ctx.drawImage(this.canvasOmbres, 0, 0);
    }

    renderBrillianceParticles(ctx) {
        for (let particle of this.particulesEclat) {
            if (!particle.active || particle.opacity <= 0) continue;
            
            ctx.globalAlpha = particle.opacity;
            
            // Couleur selon le type de particule
            let couleur = particle.couleur;
            switch (particle.type) {
                case 'reflet':
                    couleur = this.config.parameters.couleurReflet.default;
                    break;
                case 'eclat':
                    couleur = '#ffffff';
                    break;
                case 'etincelle':
                    couleur = '#ffff88';
                    break;
            }
            
            ctx.fillStyle = couleur;
            ctx.shadowColor = couleur;
            ctx.shadowBlur = particle.currentSize * 4 * particle.intensiteBrillance;
            
            // Rendu de la particule
            ctx.beginPath();
            ctx.arc(particle.screenX, particle.screenY, particle.currentSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Effet d'étoile pour les étincelles
            if (particle.type === 'etincelle') {
                ctx.strokeStyle = couleur;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.screenX - particle.currentSize * 2, particle.screenY);
                ctx.lineTo(particle.screenX + particle.currentSize * 2, particle.screenY);
                ctx.moveTo(particle.screenX, particle.screenY - particle.currentSize * 2);
                ctx.lineTo(particle.screenX, particle.screenY + particle.currentSize * 2);
                ctx.stroke();
            }
            
            ctx.shadowBlur = 0;
        }
        
        ctx.globalAlpha = 1;
    }

    renderLogo3D(ctx) {
        // Tri des faces par profondeur (Z-buffer simplifié)
        const facesAvecProfondeur = [];
        
        for (let i = 0; i < this.facesLogo.length; i++) {
            const face = this.facesLogo[i];
            if (face.length < 3) continue;
            
            // Calcul de la profondeur moyenne de la face
            let profondeurMoyenne = 0;
            const verticesTransformes = [];
            
            for (let vertexIndex of face) {
                const vertex = this.vertices3D[vertexIndex];
                const transformed = this.transformVertex(vertex, this.matriceTransformation);
                verticesTransformes.push(transformed);
                profondeurMoyenne += transformed.z;
            }
            
            profondeurMoyenne /= face.length;
            
            facesAvecProfondeur.push({
                face: face,
                vertices: verticesTransformes,
                profondeur: profondeurMoyenne,
                normale: this.normalesFaces[i] || { x: 0, y: 0, z: 1 }
            });
        }
        
        // Tri par profondeur (faces les plus éloignées en premier)
        facesAvecProfondeur.sort((a, b) => a.profondeur - b.profondeur);
        
        // Rendu des faces triées
        for (let faceData of facesAvecProfondeur) {
            this.renderFace3D(ctx, faceData);
        }
    }

    renderFace3D(ctx, faceData) {
        const vertices = faceData.vertices;
        const normale = faceData.normale;
        
        // Test de visibilité (back-face culling)
        if (normale.z <= 0) return; // Face arrière, ne pas rendre
        
        // Calcul de l'éclairage pour cette face
        const lighting = this.calculateLighting(normale, vertices[0]);
        
        // Projection des vertices
        const projectedVertices = vertices.map(v => {
            const projected = this.projectVertex(v);
            return {
                x: projected.x + this.element.width / 2,
                y: projected.y + this.element.height / 2,
                scale: projected.scale
            };
        });
        
        // Calcul de la couleur finale
        const couleurBase = this.materiauProprietes.diffuse;
        const couleurSpeculaire = this.materiauProprietes.speculaire;
        
        const r = Math.min(255, Math.max(0, 
            couleurBase.r * (lighting.ambient + lighting.diffuse) + 
            couleurSpeculaire.r * lighting.specular));
        const g = Math.min(255, Math.max(0, 
            couleurBase.g * (lighting.ambient + lighting.diffuse) + 
            couleurSpeculaire.g * lighting.specular));
        const b = Math.min(255, Math.max(0, 
            couleurBase.b * (lighting.ambient + lighting.diffuse) + 
            couleurSpeculaire.b * lighting.specular));
        
        // Rendu de la face
        ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
        ctx.strokeStyle = `rgb(${Math.floor(r * 0.8)}, ${Math.floor(g * 0.8)}, ${Math.floor(b * 0.8)})`;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        for (let i = 0; i < projectedVertices.length; i++) {
            const vertex = projectedVertices[i];
            if (i === 0) {
                ctx.moveTo(vertex.x, vertex.y);
            } else {
                ctx.lineTo(vertex.x, vertex.y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Ajout de reflets spéculaires intenses
        if (lighting.specular > 0.5) {
            ctx.globalAlpha = lighting.specular * this.config.parameters.intensiteReflets.default;
            ctx.fillStyle = this.config.parameters.couleurReflet.default;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    renderEnvironmentalReflections(ctx) {
        // Rendu des reflets environnementaux sur le canvas dédié
        this.ctxReflets.clearRect(0, 0, this.element.width, this.element.height);
        
        const intensiteReflets = this.config.parameters.intensiteReflets.default;
        if (intensiteReflets <= 0) return;
        
        // Simulation de reflets environnementaux
        for (let carte of this.cartesEnvironnement) {
            const couleur = carte.couleur;
            const intensite = carte.intensite * intensiteReflets * 0.3;
            
            this.ctxReflets.globalAlpha = intensite;
            
            // Gradient selon la direction
            let gradient;
            switch (carte.direction) {
                case 'top':
                    gradient = this.ctxReflets.createLinearGradient(0, 0, 0, this.element.height / 3);
                    break;
                case 'bottom':
                    gradient = this.ctxReflets.createLinearGradient(0, this.element.height, 0, this.element.height * 2/3);
                    break;
                case 'left':
                    gradient = this.ctxReflets.createLinearGradient(0, 0, this.element.width / 3, 0);
                    break;
                case 'right':
                    gradient = this.ctxReflets.createLinearGradient(this.element.width, 0, this.element.width * 2/3, 0);
                    break;
                default:
                    continue;
            }
            
            gradient.addColorStop(0, `rgba(${couleur.r}, ${couleur.g}, ${couleur.b}, ${intensite})`);
            gradient.addColorStop(1, `rgba(${couleur.r}, ${couleur.g}, ${couleur.b}, 0)`);
            
            this.ctxReflets.fillStyle = gradient;
            this.ctxReflets.fillRect(0, 0, this.element.width, this.element.height);
        }
        
        this.ctxReflets.globalAlpha = 1;
        
        // Composition des reflets sur le canvas principal
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.6;
        ctx.drawImage(this.canvasReflets, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    renderSurfaceEffects(ctx) {
        // Effets de surface : rayures, texture métallique, etc.
        const metallicite = this.config.parameters.metallicite.default;
        const rugosite = this.config.parameters.rugosite.default;
        
        if (metallicite > 0.3) {
            // Effet de texture métallique
            ctx.globalAlpha = metallicite * 0.2;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.5;
            
            // Rayures métalliques
            for (let i = 0; i < 20; i++) {
                const angle = this.rotationY + i * 0.1;
                const x1 = this.element.width / 2 + Math.cos(angle) * 100;
                const y1 = this.element.height / 2 + Math.sin(angle) * 100;
                const x2 = this.element.width / 2 + Math.cos(angle + Math.PI) * 100;
                const y2 = this.element.height / 2 + Math.sin(angle + Math.PI) * 100;
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
            
            ctx.globalAlpha = 1;
        }
        
        if (rugosite > 0.5) {
            // Effet de rugosité avec bruit
            ctx.globalAlpha = rugosite * 0.1;
            ctx.fillStyle = '#000000';
            
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * this.element.width;
                const y = Math.random() * this.element.height;
                const size = Math.random() * 2;
                
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1;
        }
    }

    renderSubtleIndicators(ctx) {
        // Indicateurs subtils pour debug/info (optionnel)
        if (this.config.debug) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            
            // Affichage des informations de rotation
            ctx.fillText(`RX: ${this.rotationX.toFixed(2)}`, 10, 20);
            ctx.fillText(`RY: ${this.rotationY.toFixed(2)}`, 10, 35);
            ctx.fillText(`RZ: ${this.rotationZ.toFixed(2)}`, 10, 50);
            
            // Affichage du facteur d'accélération
            if (this.accelerationActive) {
                ctx.fillStyle = '#ff0000';
                ctx.fillText(`ACCELERATION: ${this.facteurAcceleration.toFixed(2)}x`, 10, 70);
            }
            
            ctx.globalAlpha = 1;
        }
    }

    destroy() {
        // Nettoyage des particules
        this.particulesEclat.length = 0;
        this.poolParticules.forEach(p => p.active = false);
        
        // Nettoyage des systèmes
        this.microOscillations.length = 0;
        this.pointsControle.length = 0;
        this.cartesEnvironnement.length = 0;
        this.historiqueRotations.length = 0;
        
        // Nettoyage des canvas
        if (this.canvasNormales) this.canvasNormales = null;
        if (this.canvasReflets) this.canvasReflets = null;
        if (this.canvasOmbres) this.canvasOmbres = null;
        
        // Reset des variables
        this.temps = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        
        // Reset des matrices
        this.matriceTransformation = this.createIdentityMatrix();
        this.matriceProjection = this.createIdentityMatrix();
        
        // Reset des systèmes
        this.gyroscope = {
            momentAngulaire: { x: 0, y: 0, z: 0 },
            precession: { x: 0, y: 0, z: 0 },
            stabilisation: 0.95
        };
        
        this.inertieMouvement = { x: 0, y: 0, z: 0 };
        this.momentumAccumule = { x: 0, y: 0, z: 0 };
        this.tensionMecanique = 0;
        this.adaptationCinetique = 0;
        
        // Reset des états
        this.accelerationActive = false;
        this.facteurAcceleration = 1;
        this.morphingActif = false;
        this.progressMorphing = 0;
    }
}

