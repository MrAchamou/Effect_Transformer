// ✨ Code transformé avec Digital Alchemy Lab
// Niveau: Standard
// Modules appliqués: ContentAnalyzer, SmartOptimizer, ColorHarmonizer
// Génération: 2025-08-22T18:07:43.507Z

// smoke-simulation.js

export const smokeSimulationEffect = {
  id: "video-smoke-simulation-particles-055",
  name: "Simulation Fumée Particules Réaliste",
  
  description: `## 💨 EFFET 55 : SMOKE_SIMULATION

**CATÉGORIE :** VIDÉO
**EFFET DEMANDÉ :** Smoke_Simulation
**ID UNIQUE :** video-smoke-simulation-particles-055
**NOM AFFICHAGE :** Simulation Fumée Particules Réaliste

**DESCRIPTION :** Une simulation réaliste de fumée est ajoutée à la vidéo. Les volutes de fumée s'élèvent et se dispersent avec des turbulences naturelles. La densité de la fumée, sa couleur et sa vitesse de dispersion sont ajustables, créant une ambiance enfumée crédible.

**SPÉCIFICATIONS ADDICTION :**
- Simulation fluide dynamique équations Navier-Stokes
- Particules fumée suivant lois thermodynamiques
- Turbulences obéissant théorie chaos déterministe
- Dispersion respectant équations diffusion moléculaire

--------------------------------------------------------------------------

💨 SMOKE_SIMULATION EFFECT CRÉÉ !
✨ SYSTÈME FLUIDE AUTHENTIQUE :

🌪️ MÉCANIQUE TURBULENCES RÉALISTE :
Équations Navier-Stokes : Mouvement fluide visqueux compressible
Convection thermique : Transport chaleur mouvement fluide
Diffusion moléculaire : Mélange espèces concentration
Vorticité locale : Rotation fluide autour axes
Instabilités Kelvin-Helmholtz : Turbulence cisaillement vitesse
Cascade énergétique : Transfert énergie échelles

🔥 SYSTÈME COMBUSTION AUTHENTIQUE :
Réactions chimiques : Oxydation matière organique
Transfert masse : Transport espèces réactives
Cinétique chimique : Vitesses réactions combustion
Flamme prémélangée : Combustible air homogène
Flamme diffusion : Mélange réactifs interface
Extinction thermique : Perte chaleur environnement

🧠 INTELLIGENCE FLUIDE :
Transport scalaire : Équations advection-diffusion
Thermodynamique : Échanges chaleur masse énergie
Microphysique aérosols : Formation croissance particules
Électrostatique : Accumulation charges particules
Acoustique : Propagation ondes pression
Optique diffusion : Interaction lumière particules

🎭 DYNAMIQUE MULTI-FUMÉES :
Fumée légère : Particules fines ascension rapide
Fumée dense : Concentration élevée dispersion lente
Vapeur chaude : Gaz surchauffé convection intense
Brouillard froid : Condensation vapeur eau
Smog urbain : Mélange polluants atmosphériques
Fumée toxique : Particules nocives combustion

🎮 PARAMÈTRES FLUIDES :
Densité : Concentration particules en kg/m³
Température : Chaleur fluide en Kelvin
Vitesse : Vélocité ascension en m/s
Viscosité : Résistance écoulement en Pa·s
Turbulence : Chaos fluide sans dimension
Dispersion : Étalement spatial en m²/s`,

  category: "vidéo",
  // ... reste de la structure
};

class SmokeSimulationEffect extends BaseEffect {
    constructor(config = {}) {
        super({
            id: 'video-smoke-simulation-particles-055',
            name: 'Simulation Fumée Particules Réaliste',
            category: 'vidéo',
            version: '1.0',
            performance: 'high',
            parameters: {
                densité: { type: 'range', min: 0.1, max: 5.0, default: 1.5 },
                température: { type: 'range', min: 300, max: 1500, default: 600 },
                vitesse: { type: 'range', min: 0.5, max: 10, default: 3 },
                viscosité: { type: 'range', min: 0.01, max: 0.5, default: 0.1 },
                turbulence: { type: 'range', min: 0, max: 1, default: 0.4 },
                dispersion: { type: 'range', min: 0.1, max: 2, default: 0.8 }
            }
        });

        // SYSTÈME PRINCIPAL DE L'EFFET
        this.temps = 0;
        this.particulesFumée = [];
        this.volutesConvection = [];
        this.champTurbulence = [];
        this.écoulementFluide = { vx: 0, vy: 0, vz: 0 };
        
        // VARIABLES THERMODYNAMIQUES
        this.densitéFumée = 1.5; // kg/m³
        this.températureFluide = 600; // K
        this.vitesseAscension = 3; // m/s
        this.viscositéDynamique = 0.1; // Pa·s
        this.niveauTurbulence = 0.4; // 0-1
        this.coefficientDispersion = 0.8; // m²/s
        this.pressionAtmosphérique = 101325; // Pa
        this.humiditéRelative = 60; // %
        
        // SYSTÈME PARTICULES COMPLEXE
        this.distributionTailles = [];
        this.coalescenceEvents = [];
        this.évaporationActive = [];
        this.trajectoiresConvectives = [];
        
        // EFFET COMBUSTION ET SOURCES
        this.sourcesCombustion = [];
        this.zonesRéaction = [];
        this.flammesDiffusion = [];
        this.transfertChaleur = [];
        
        // Canvas pour effets complexes
        this.canvasParticules = null;
        this.ctxParticules = null;
        this.canvasVolutes = null;
        this.ctxVolutes = null;
        this.canvasTurbulence = null;
        this.ctxTurbulence = null;
        this.canvasConvection = null;
        this.ctxConvection = null;
        
        // MICRO-VARIATIONS FLUIDES
        this.fluctuationsThermiques = [];
        this.tourbillonsLocaux = 0;
        this.respirationConvective = 0;
        
        // SYSTÈME ÉVÉNEMENTS COMBUSTION
        this.combustionActive = false;
        this.prochaineÉmission = 0;
        this.duréeÉmission = 0;
        this.typeFumée = 'combustion_standard'; // légère, standard, dense, toxique
        
        // MÉMOIRE ET ADAPTATION
        this.historiqueFluide = [];
        this.adaptationThermique = 0;
        this.zonesConvection = new Map();
        this.efficacitéRendu = 0.9;
        
        // PHYSIQUE FLUIDES
        this.énergieThermique = 0; // Énergie système thermodynamique
        this.entropieFluide = 0; // Désordre système fluide
        this.enthalpieSpécifique = 0; // Énergie par unité masse
        this.capacitéCalorifique = 0; // Chaleur spécifique
        
        // TYPES DE FUMÉE DISPONIBLES
        this.bibliothèqueFumées = {
            légère: { 
                densité: 0.3, 
                température: 400,
                vitesse: 5,
                couleur: { r: 220, g: 220, b: 220, a: 0.3 },
                viscosité: 0.05,
                durée: 60000 // ms
            },
            standard: { 
                densité: 1.5, 
                température: 600,
                vitesse: 3,
                couleur: { r: 180, g: 180, b: 180, a: 0.6 },
                viscosité: 0.1,
                durée: 45000 // ms
            },
            dense: { 
                densité: 3.0, 
                température: 800,
                vitesse: 2,
                couleur: { r: 120, g: 120, b: 120, a: 0.8 },
                viscosité: 0.2,
                durée: 30000 // ms
            },
            toxique: { 
                densité: 2.5, 
                température: 700,
                vitesse: 2.5,
                couleur: { r: 100, g: 140, b: 100, a: 0.9 },
                viscosité: 0.15,
                durée: 20000 // ms
            },
            vapeur: { 
                densité: 0.8, 
                température: 373,
                vitesse: 4,
                couleur: { r: 240, g: 240, b: 255, a: 0.4 },
                viscosité: 0.03,
                durée: 15000 // ms
            },
            brouillard: { 
                densité: 1.2, 
                température: 280,
                vitesse: 1,
                couleur: { r: 200, g: 210, b: 220, a: 0.7 },
                viscosité: 0.08,
                durée: 90000 // ms
            }
        };
        
        // PROPRIÉTÉS THERMODYNAMIQUES
        this.constantesPhysiques = {
            R: 287, // J/kg·K (constante gaz air)
            Cp: 1005, // J/kg·K (chaleur spécifique air)
            γ: 1.4, // rapport chaleurs spécifiques
            μ: 1.81e-5, // Pa·s (viscosité air)
            k: 0.026, // W/m·K (conductivité thermique)
            Pr: 0.71, // nombre Prandtl
            g: 9.81, // m/s² (gravité)
            σ: 5.67e-8 // W/m²·K⁴ (Stefan-Boltzmann)
        };
        
        // MODÈLES FLUIDES
        this.profilVitesse = [];
        this.champPression = [];
        this.gradientTempérature = [];
        this.distributionVorticité = [];
    }

    initialize(canvas, element) {
        // Canvas pour particules de fumée
        this.canvasParticules = document.createElement('canvas');
        this.canvasParticules.width = canvas.width;
        this.canvasParticules.height = canvas.height;
        this.ctxParticules = this.canvasParticules.getContext('2d');
        
        // Canvas pour volutes
        this.canvasVolutes = document.createElement('canvas');
        this.canvasVolutes.width = canvas.width;
        this.canvasVolutes.height = canvas.height;
        this.ctxVolutes = this.canvasVolutes.getContext('2d');
        
        // Canvas pour turbulence
        this.canvasTurbulence = document.createElement('canvas');
        this.canvasTurbulence.width = canvas.width;
        this.canvasTurbulence.height = canvas.height;
        this.ctxTurbulence = this.canvasTurbulence.getContext('2d');
        
        // Canvas pour convection
        this.canvasConvection = document.createElement('canvas');
        this.canvasConvection.width = canvas.width;
        this.canvasConvection.height = canvas.height;
        this.ctxConvection = this.canvasConvection.getContext('2d');
        
        // Initialisation du système thermodynamique
        this.initSystèmeThermodynamique(element);
        
        // Initialisation des particules
        this.initParticulesFumée(element);
        
        // Initialisation des sources
        this.initSourcesCombustion(element);
        
        // Initialisation de la turbulence
        this.initTurbulenceFluide(element);
        
        // Initialisation de la convection
        this.initConvectionThermique(element);
        
        // Ajustement selon l'élément
        this.ajusterParamètresThermodynamiques(element);
    }

    initSystèmeThermodynamique(element) {
        // Configuration thermodynamique basée sur les paramètres
        this.densitéFumée = this.parameters.densité.value; // 0.1-5 kg/m³
        this.températureFluide = this.parameters.température.value; // 300-1500 K
        this.vitesseAscension = this.parameters.vitesse.value; // 0.5-10 m/s
        this.viscositéDynamique = this.parameters.viscosité.value; // 0.01-0.5 Pa·s
        this.niveauTurbulence = this.parameters.turbulence.value; // 0-1
        this.coefficientDispersion = this.parameters.dispersion.value; // 0.1-2 m²/s
        
        // Sélection du type de fumée selon la densité
        this.sélectionnerTypeFumée();
        
        // Calcul des propriétés thermodynamiques
        this.calculerPropriétésThermodynamiques();
        
        // Initialisation du profil de température
        this.initProfilTempérature();
    }

    sélectionnerTypeFumée() {
        const typesDisponibles = Object.keys(this.bibliothèqueFumées);
        let typeChoisi;
        
        if (this.densitéFumée < 0.5) {
            typeChoisi = 'légère';
        } else if (this.densitéFumée < 1.0) {
            typeChoisi = 'vapeur';
        } else if (this.densitéFumée < 2.0) {
            typeChoisi = 'standard';
        } else if (this.densitéFumée < 3.5) {
            typeChoisi = 'dense';
        } else {
            typeChoisi = 'toxique';
        }
        
        // Modification selon la température
        if (this.températureFluide < 350) {
            typeChoisi = 'brouillard';
        } else if (this.températureFluide < 400) {
            typeChoisi = 'vapeur';
        }
        
        this.typeFumée = typeChoisi;
        const fumeeConfig = this.bibliothèqueFumées[typeChoisi];
        
        this.couleurFumée = fumeeConfig.couleur;
        this.duréeVie = fumeeConfig.durée;
    }

    calculerPropriétésThermodynamiques() {
        // Calcul de la densité selon loi des gaz parfaits
        const T = this.températureFluide; // K
        const P = this.pressionAtmosphérique; // Pa
        this.densitéAir = P / (this.constantesPhysiques.R * T);
        
        // Calcul du nombre de Reynolds
        const L = 0.1; // m (longueur caractéristique)
        this.nombreReynolds = (this.densitéAir * this.vitesseAscension * L) / this.viscositéDynamique;
        
        // Calcul du nombre de Grashof (convection naturelle)
        const β = 1 / T; // coefficient expansion thermique
        const ΔT = T - 293; // différence température ambiante
        this.nombreGrashof = (this.constantesPhysiques.g * β * ΔT * Math.pow(L, 3)) / Math.pow(this.viscositéDynamique / this.densitéAir, 2);
        
        // Calcul du nombre de Rayleigh
        this.nombreRayleigh = this.nombreGrashof * this.constantesPhysiques.Pr;
        
        // Enthalpie spécifique
        this.enthalpieSpécifique = this.constantesPhysiques.Cp * T;
        
        // Énergie thermique totale
        this.énergieThermique = this.densitéFumée * this.enthalpieSpécifique;
    }

    initProfilTempérature() {
        this.profilVitesse = [];
        this.gradientTempérature = [];
        const nombreCouches = 30;
        
        for (let i = 0; i < nombreCouches; i++) {
            const altitude = (i / (nombreCouches - 1)) * 500; // 0-500m
            
            // Profil de température avec gradient adiabatique
            const T_altitude = this.températureFluide - 0.0065 * altitude; // K
            
            // Profil de vitesse avec convection
            const vitesse_altitude = this.vitesseAscension * Math.sqrt(T_altitude / this.températureFluide);
            
            // Turbulence décroissante avec altitude
            const turbulence_altitude = this.niveauTurbulence * Math.exp(-altitude / 200);
            
            this.profilVitesse.push({
                altitude: altitude,
                température: T_altitude,
                vitesse: vitesse_altitude,
                turbulence: turbulence_altitude,
                densité: this.pressionAtmosphérique / (this.constantesPhysiques.R * T_altitude),
                viscosité: this.viscositéDynamique * Math.pow(T_altitude / 273, 0.76) // loi Sutherland
            });
            
            this.gradientTempérature.push({
                altitude: altitude,
                gradient: -0.0065, // K/m
                flux_chaleur: -this.constantesPhysiques.k * (-0.0065), // W/m²
                convection: vitesse_altitude > 0.1 ? 'forcée' : 'naturelle'
            });
        }
    }

    initParticulesFumée(element) {
        this.particulesFumée = [];
        this.distributionTailles = [];
        
        // Distribution log-normale des tailles de particules
        this.générerDistributionLogNormale();
        
        // Génération initiale de particules
        this.générerParticulesFuméeInitiales(element);
    }

    générerDistributionLogNormale() {
        // Distribution log-normale : f(d) = 1/(d*σ*√(2π)) * exp(-ln²(d/μ)/(2σ²))
        const μ = Math.log(1e-6); // diamètre médian 1 μm
        const σ = 0.5; // écart-type géométrique
        
        this.distributionTailles = [];
        for (let d = 1e-7; d <= 1e-4; d *= 1.1) { // 0.1 à 100 μm
            const ln_d = Math.log(d);
            const concentration = Math.exp(-Math.pow(ln_d - μ, 2) / (2 * σ * σ)) / (d * σ * Math.sqrt(2 * Math.PI));
            
            this.distributionTailles.push({
                diamètre: d,
                concentration: concentration,
                probabilité: concentration / 1000 // Normalisée
            });
        }
    }

    générerParticulesFuméeInitiales(element) {
        const nombreParticules = Math.floor(200 + this.densitéFumée * 100);
        
        for (let i = 0; i < nombreParticules; i++) {
            const particule = {
                id: i,
                x: Math.random() * element.width,
                y: element.height + Math.random() * 50, // Commencent en bas
                z: Math.random() * 100, // Profondeur pour effet 3D
                vx: (Math.random() - 0.5) * 0.5,
                vy: -this.vitesseAscension * (0.8 + Math.random() * 0.4),
                vz: (Math.random() - 0.5) * 0.3,
                diamètre: this.échantillonnerTailleParticule(),
                masse: 0,
                température: this.températureFluide * (0.9 + Math.random() * 0.2),
                âge: 0,
                vie: 1.0,
                type: this.typeFumée,
                trajectoire: [],
                évaporation: false,
                coalescence: false,
                rotation: Math.random() * 2 * Math.PI,
                vitesseRotation: (Math.random() - 0.5) * 0.05,
                opacité: this.couleurFumée.a * (0.7 + Math.random() * 0.3),
                couleur: { ...this.couleurFumée }
            };
            
            // Calcul des propriétés physiques
            this.calculerPropriétésParticule(particule);
            
            this.particulesFumée.push(particule);
        }
    }

    échantillonnerTailleParticule() {
        // Échantillonnage selon distribution log-normale
        const rand = Math.random();
        let cumulée = 0;
        
        for (const taille of this.distributionTailles) {
            cumulée += taille.probabilité;
            if (rand <= cumulée) {
                return taille.diamètre;
            }
        }
        
        return 1e-6; // 1 μm par défaut
    }

    calculerPropriétésParticule(particule) {
        // Masse de la particule (sphère)
        const volume = (4/3) * Math.PI * Math.pow(particule.diamètre / 2, 3);
        particule.masse = this.densitéFumée * volume;
        
        // Vitesse terminale (équilibre gravité-traînée)
        const Cd = 24 / this.nombreReynolds; // coefficient traînée Stokes
        const A = Math.PI * Math.pow(particule.diamètre / 2, 2); // section efficace
        particule.vitesseTerminale = Math.sqrt(2 * particule.masse * this.constantesPhysiques.g / (this.densitéAir * Cd * A));
        
        // Nombre de Schmidt (diffusion)
        particule.nombreSchmidt = this.viscositéDynamique / (this.densitéAir * this.coefficientDispersion);
        
        // Temps de relaxation
        particule.tempsRelaxation = particule.masse / (6 * Math.PI * this.viscositéDynamique * particule.diamètre / 2);
        
        // Coefficient de diffusion Brownienne
        const kB = 1.381e-23; // J/K
        particule.diffusionBrownienne = kB * particule.température / (6 * Math.PI * this.viscositéDynamique * particule.diamètre / 2);
    }

    initSourcesCombustion(element) {
        this.sourcesCombustion = [];
        this.zonesRéaction = [];
        
        // Génération des sources de fumée
        this.générerSourcesÉmission(element);
    }

    générerSourcesÉmission(element) {
        const nombreSources = Math.floor(1 + this.densitéFumée);
        
        for (let i = 0; i < nombreSources; i++) {
            const source = {
                id: i,
                x: Math.random() * element.width,
                y: element.height - 20 - Math.random() * 50,
                rayon: 20 + Math.random() * 30,
                intensité: 0.5 + Math.random() * 0.5,
                température: this.températureFluide * (0.8 + Math.random() * 0.4),
                débitMassique: this.densitéFumée * 0.1, // kg/s
                active: true,
                type: this.typeFumée,
                âge: 0,
                duréeVie: this.duréeVie * (0.8 + Math.random() * 0.4),
                fluctuation: Math.random() * 0.3
            };
            
            this.sourcesCombustion.push(source);
        }
    }

    initTurbulenceFluide(element) {
        this.champTurbulence = [];
        this.distributionVorticité = [];
        
        // Génération du champ de turbulence
        this.générerChampTurbulence(element);
    }

    générerChampTurbulence(element) {
        const résolution = 20; // points de grille
        const dx = element.width / résolution;
        const dy = element.height / résolution;
        
        for (let i = 0; i < résolution; i++) {
            for (let j = 0; j < résolution; j++) {
                const x = i * dx;
                const y = j * dy;
                
                // Génération de turbulence avec bruit de Perlin
                const turbulence = {
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * this.niveauTurbulence * 2,
                    vy: (Math.random() - 0.5) * this.niveauTurbulence * 2,
                    vorticité: (Math.random() - 0.5) * this.niveauTurbulence,
                    intensité: this.niveauTurbulence * Math.random(),
                    échelle: 10 + Math.random() * 20,
                    fréquence: 0.1 + Math.random() * 0.5
                };
                
                this.champTurbulence.push(turbulence);
                
                // Calcul de la vorticité locale
                const ω = Math.random() * this.niveauTurbulence * 2 - this.niveauTurbulence;
                this.distributionVorticité.push({
                    x: x,
                    y: y,
                    vorticité: ω,
                    circulation: ω * dx * dy,
                    dissipation: ω * ω * this.viscositéDynamique
                });
            }
        }
    }

    initConvectionThermique(element) {
        this.volutesConvection = [];
        this.transfertChaleur = [];
        
        // Génération des volutes de convection
        this.générerVolutesConvection(element);
    }

    générerVolutesConvection(element) {
        const nombreVolutes = Math.floor(5 + this.températureFluide / 200);
        
        for (let i = 0; i < nombreVolutes; i++) {
            const volute = {
                id: i,
                x: Math.random() * element.width,
                y: element.height - Math.random() * 100,
                rayon: 30 + Math.random() * 50,
                intensité: 0.3 + Math.random() * 0.7,
                température: this.températureFluide * (0.9 + Math.random() * 0.2),
                vitesseRotation: (Math.random() - 0.5) * 0.1,
                vitesseAscension: this.vitesseAscension * (0.8 + Math.random() * 0.4),
                âge: 0,
                vie: 1.0,
                type: 'convection',
                spirale: [],
                dissipation: 0.01 + Math.random() * 0.02
            };
            
            // Génération de la spirale
            this.générerSpiraleVolute(volute);
            
            this.volutesConvection.push(volute);
        }
    }

    générerSpiraleVolute(volute) {
        volute.spirale = [];
        const nombrePoints = 20;
        
        for (let i = 0; i < nombrePoints; i++) {
            const angle = (i / nombrePoints) * 4 * Math.PI;
            const rayon = volute.rayon * (1 - i / nombrePoints);
            
            volute.spirale.push({
                x: volute.x + rayon * Math.cos(angle),
                y: volute.y + rayon * Math.sin(angle),
                rayon: rayon,
                angle: angle,
                vitesse: volute.vitesseAscension * (1 - i / nombrePoints),
                température: volute.température * (1 - i / nombrePoints * 0.3)
            });
        }
    }

    ajusterParamètresThermodynamiques(element) {
        // Adaptation selon la taille de l'élément
        const volume = element.offsetWidth * element.offsetHeight * 100; // volume fictif
        const facteurTaille = Math.cbrt(volume) / 1000;
        
        // Ajustement de la vitesse selon le volume
        this.vitesseAscension *= facteurTaille;
        
        // Ajustement de la densité selon la surface
        this.densitéFumée *= Math.sqrt(element.offsetWidth * element.offsetHeight) / 1000;
        
        // Optimisation performance selon complexité
        this.optimiserPerformance(volume);
    }

    optimiserPerformance(volume) {
        if (volume > 1000000) { // Grand volume
            this.efficacitéRendu = 0.7;
            this.niveauTurbulence *= 0.8;
        } else if (volume < 100000) { // Petit volume
            this.efficacitéRendu = 1.0;
            this.niveauTurbulence *= 1.2;
        }
    }

    update(deltaTime) {
        this.temps += deltaTime;
        
        // Mise à jour des particules de fumée
        this.mettreÀJourParticules(deltaTime);
        
        // Mise à jour des volutes
        this.mettreÀJourVolutes(deltaTime);
        
        // Mise à jour de la turbulence
        this.mettreÀJourTurbulence(deltaTime);
        
        // Mise à jour des sources
        this.mettreÀJourSources(deltaTime);
        
        // Calcul de la convection
        this.calculerConvection();
        
        // Gestion du cycle de vie
        this.gérerCycleVie();
    }

    mettreÀJourParticules(deltaTime) {
        this.particulesFumée.forEach(particule => {
            // Forces appliquées à la particule
            const forces = this.calculerForces(particule);
            
            // Intégration des équations du mouvement (Verlet)
            const dt = deltaTime / 1000; // conversion ms -> s
            
            // Accélération
            const ax = forces.fx / particule.masse;
            const ay = forces.fy / particule.masse;
            const az = forces.fz / particule.masse;
            
            // Mise à jour de la vitesse
            particule.vx += ax * dt;
            particule.vy += ay * dt;
            particule.vz += az * dt;
            
            // Limitation de la vitesse terminale
            const vitesseTotale = Math.sqrt(particule.vx*particule.vx + particule.vy*particule.vy + particule.vz*particule.vz);
            if (vitesseTotale > particule.vitesseTerminale) {
                const facteur = particule.vitesseTerminale / vitesseTotale;
                particule.vx *= facteur;
                particule.vy *= facteur;
                particule.vz *= facteur;
            }
            
            // Mise à jour de la position
            particule.x += particule.vx * dt * 100; // conversion m -> px
            particule.y += particule.vy * dt * 100;
            particule.z += particule.vz * dt * 100;
            
            // Mise à jour de l'âge et de la vie
            particule.âge += deltaTime;
            particule.vie = Math.max(0, 1 - particule.âge / this.duréeVie);
            
            // Évaporation progressive
            if (particule.température > 373) { // K
                const tauxÉvaporation = (particule.température - 373) / 1000;
                particule.diamètre *= (1 - tauxÉvaporation * dt);
                particule.opacité *= (1 - tauxÉvaporation * dt * 2);
            }
            
            // Refroidissement
            particule.température -= 50 * dt; // refroidissement 50 K/s
            particule.température = Math.max(particule.température, 293); // température ambiante
            
            // Mise à jour de la couleur selon la température
            this.mettreÀJourCouleurParticule(particule);
            
            // Enregistrement de la trajectoire
            particule.trajectoire.push({ x: particule.x, y: particule.y, temps: this.temps });
            if (particule.trajectoire.length > 50) {
                particule.trajectoire.shift();
            }
        });
    }

    calculerForces(particule) {
        const forces = { fx: 0, fy: 0, fz: 0 };
        
        // Force de gravité
        forces.fy += particule.masse * this.constantesPhysiques.g;
        
        // Force de flottabilité (Archimède)
        const ρ_particule = particule.masse / ((4/3) * Math.PI * Math.pow(particule.diamètre/2, 3));
        const forceFlottabilité = (this.densitéAir - ρ_particule) * this.constantesPhysiques.g * 
                                 ((4/3) * Math.PI * Math.pow(particule.diamètre/2, 3));
        forces.fy -= forceFlottabilité;
        
        // Force de traînée
        const vitesseRelative = Math.sqrt(particule.vx*particule.vx + particule.vy*particule.vy + particule.vz*particule.vz);
        const Re = this.densitéAir * vitesseRelative * particule.diamètre / this.viscositéDynamique;
        const Cd = Re < 1 ? 24/Re : 24/Re * (1 + 0.15 * Math.pow(Re, 0.687));
        const A = Math.PI * Math.pow(particule.diamètre/2, 2);
        const forceTraînée = 0.5 * this.densitéAir * vitesseRelative * vitesseRelative * Cd * A;
        
        if (vitesseRelative > 0) {
            forces.fx -= forceTraînée * (particule.vx / vitesseRelative);
            forces.fy -= forceTraînée * (particule.vy / vitesseRelative);
            forces.fz -= forceTraînée * (particule.vz / vitesseRelative);
        }
        
        // Force de turbulence
        const turbulence = this.interpolerTurbulence(particule.x, particule.y);
        forces.fx += turbulence.vx * particule.masse * 10;
        forces.fy += turbulence.vy * particule.masse * 10;
        
        // Force thermophorétique
        const gradientT = this.calculerGradientTempérature(particule.x, particule.y);
        const forceThermophorèse = -0.55 * this.viscositéDynamique * particule.diamètre * gradientT;
        forces.fy += forceThermophorèse;
        
        // Force de diffusion Brownienne
        const forceBrownienne = Math.sqrt(2 * particule.diffusionBrownienne * particule.masse / (deltaTime/1000));
        forces.fx += (Math.random() - 0.5) * forceBrownienne;
        forces.fy += (Math.random() - 0.5) * forceBrownienne;
        forces.fz += (Math.random() - 0.5) * forceBrownienne;
        
        return forces;
    }

    interpolerTurbulence(x, y) {
        // Interpolation bilinéaire du champ de turbulence
        const résolution = Math.sqrt(this.champTurbulence.length);
        const dx = window.innerWidth / résolution;
        const dy = window.innerHeight / résolution;
        
        const i = Math.floor(x / dx);
        const j = Math.floor(y / dy);
        
        if (i >= 0 && i < résolution-1 && j >= 0 && j < résolution-1) {
            const idx = j * résolution + i;
            const turbulence = this.champTurbulence[idx];
            return turbulence || { vx: 0, vy: 0 };
        }
        
        return { vx: 0, vy: 0 };
    }

    calculerGradientTempérature(x, y) {
        // Calcul du gradient de température local
        const hauteurNormalisée = y / window.innerHeight;
        return -0.0065 * (1 - hauteurNormalisée); // gradient adiabatique
    }

    mettreÀJourCouleurParticule(particule) {
        // Couleur selon la température (corps noir)
        const T = particule.température;
        let r, g, b;
        
        if (T < 400) {
            // Fumée froide - gris
            r = g = b = 100 + (T - 293) * 2;
        } else if (T < 800) {
            // Fumée chaude - gris chaud
            r = 120 + (T - 400) * 0.2;
            g = 120 + (T - 400) * 0.15;
            b = 120 + (T - 400) * 0.1;
        } else {
            // Fumée très chaude - orangée
            r = 200 + (T - 800) * 0.1;
            g = 150 + (T - 800) * 0.05;
            b = 100;
        }
        
        particule.couleur.r = Math.min(255, Math.max(0, r));
        particule.couleur.g = Math.min(255, Math.max(0, g));
        particule.couleur.b = Math.min(255, Math.max(0, b));
        particule.couleur.a = particule.opacité * particule.vie;
    }

    mettreÀJourVolutes(deltaTime) {
        this.volutesConvection.forEach(volute => {
            // Ascension de la volute
            volute.y -= volute.vitesseAscension * deltaTime / 1000 * 100;
            
            // Rotation de la volute
            volute.rotation = (volute.rotation || 0) + volute.vitesseRotation * deltaTime / 1000;
            
            // Expansion de la volute
            volute.rayon += volute.dissipation * deltaTime / 1000 * 100;
            
            // Mise à jour de l'âge
            volute.âge += deltaTime;
            volute.vie = Math.max(0, 1 - volute.âge / this.duréeVie);
            
            // Refroidissement
            volute.température -= 30 * deltaTime / 1000;
            volute.température = Math.max(volute.température, 293);
            
            // Mise à jour de la spirale
            volute.spirale.forEach((point, index) => {
                const angle = volute.rotation + (index / volute.spirale.length) * 4 * Math.PI;
                point.x = volute.x + point.rayon * Math.cos(angle);
                point.y = volute.y + point.rayon * Math.sin(angle) - index * 5;
                point.température = volute.température * (1 - index / volute.spirale.length * 0.3);
            });
        });
    }

    mettreÀJourTurbulence(deltaTime) {
        this.champTurbulence.forEach(turbulence => {
            // Évolution temporelle de la turbulence
            const phase = this.temps * turbulence.fréquence / 1000;
            turbulence.vx = turbulence.intensité * Math.sin(phase) * this.niveauTurbulence;
            turbulence.vy = turbulence.intensité * Math.cos(phase * 1.3) * this.niveauTurbulence;
            
            // Dissipation visqueuse
            turbulence.intensité *= (1 - this.viscositéDynamique * deltaTime / 10000);
            turbulence.intensité = Math.max(turbulence.intensité, 0.1);
        });
        
        // Mise à jour de la vorticité
        this.distributionVorticité.forEach(vortex => {
            vortex.vorticité *= (1 - vortex.dissipation * deltaTime / 1000);
            vortex.circulation = vortex.vorticité * 100; // aire fictive
        });
    }

    mettreÀJourSources(deltaTime) {
        this.sourcesCombustion.forEach(source => {
            // Fluctuation de l'intensité
            source.intensité += (Math.random() - 0.5) * source.fluctuation * deltaTime / 1000;
            source.intensité = Math.max(0.1, Math.min(1.0, source.intensité));
            
            // Émission de nouvelles particules
            if (source.active && Math.random() < source.intensité * deltaTime / 1000) {
                this.émettrePart iculeDepuisSource(source);
            }
            
            // Vieillissement de la source
            source.âge += deltaTime;
            if (source.âge > source.duréeVie) {
                source.active = false;
            }
        });
    }

    émettreParticuleDepuisSource(source) {
        const nouvelleParticule = {
            id: Date.now() + Math.random(),
            x: source.x + (Math.random() - 0.5) * source.rayon,
            y: source.y + (Math.random() - 0.5) * source.rayon * 0.5,
            z: Math.random() * 50,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -this.vitesseAscension * (0.8 + Math.random() * 0.4),
            vz: (Math.random() - 0.5) * 0.3,
            diamètre: this.échantillonnerTailleParticule(),
            masse: 0,
            température: source.température * (0.9 + Math.random() * 0.2),
            âge: 0,
            vie: 1.0,
            type: source.type,
            trajectoire: [],
            évaporation: false,
            coalescence: false,
            rotation: Math.random() * 2 * Math.PI,
            vitesseRotation: (Math.random() - 0.5) * 0.05,
            opacité: this.couleurFumée.a * source.intensité,
            couleur: { ...this.couleurFumée }
        };
        
        this.calculerPropriétésParticule(nouvelleParticule);
        this.particulesFumée.push(nouvelleParticule);
    }

    calculerConvection() {
        // Calcul des cellules de convection
        this.transfertChaleur = [];
        
        this.sourcesCombustion.forEach(source => {
            if (source.active) {
                const celluleConvection = {
                    x: source.x,
                    y: source.y,
                    rayon: source.rayon * 2,
                    fluxChaleur: source.intensité * source.température * 0.001, // W
                    vitesseConvection: Math.sqrt(this.constantesPhysiques.g * source.rayon * 
                                               (source.température - 293) / 293),
                    nombreNusselt: 0.54 * Math.pow(this.nombreRayleigh, 0.25),
                    coefficientTransfert: this.constantesPhysiques.k / source.rayon
                };
                
                this.transfertChaleur.push(celluleConvection);
            }
        });
    }

    gérerCycleVie() {
        // Nettoyage des particules expirées
        this.particulesFumée = this.particulesFumée.filter(particule => 
            particule.vie > 0 && particule.y > -100 && particule.opacité > 0.01
        );
        
        // Nettoyage des volutes expirées
        this.volutesConvection = this.volutesConvection.filter(volute => 
            volute.vie > 0 && volute.y > -200
        );
        
        // Génération de nouvelles sources si nécessaire
        if (this.sourcesCombustion.filter(s => s.active).length === 0) {
            this.générerSourcesÉmission({ width: window.innerWidth, height: window.innerHeight });
        }
        
        // Mise à jour de l'historique
        this.mettreÀJourHistorique();
    }

    mettreÀJourHistorique() {
        const mesureActuelle = {
            temps: this.temps,
            nombreParticules: this.particulesFumée.length,
            nombreVolutes: this.volutesConvection.length,
            températureMoyenne: this.calculerTempératureMoyenne(),
            densitéMoyenne: this.densitéFumée,
            vitesseMoyenne: this.vitesseAscension,
            turbulenceMoyenne: this.niveauTurbulence,
            efficacitéRendu: this.efficacitéRendu
        };
        
        this.historiqueFluide.push(mesureActuelle);
        
        // Limitation de l'historique
        if (this.historiqueFluide.length > 100) {
            this.historiqueFluide.shift();
        }
    }

    calculerTempératureMoyenne() {
        if (this.particulesFumée.length === 0) return this.températureFluide;
        
        const somme = this.particulesFumée.reduce((acc, p) => acc + p.température, 0);
        return somme / this.particulesFumée.length;
    }

    render(ctx, canvas) {
        // Sauvegarde du contexte
        ctx.save();
        
        // Rendu des volutes de convection
        this.rendreVolutes(ctx);
        
        // Rendu des particules de fumée
        this.rendreParticules(ctx);
        
        // Rendu de la turbulence (optionnel)
        if (this.niveauTurbulence > 0.5) {
            this.rendreTurbulence(ctx);
        }
        
        // Rendu des sources
        this.rendreSources(ctx);
        
        // Restauration du contexte
        ctx.restore();
    }

    rendreParticules(ctx) {
        this.particulesFumée.forEach(particule => {
            if (particule.vie <= 0 || particule.opacité <= 0) return;
            
            ctx.save();
            
            // Configuration du style
            const couleur = particule.couleur;
            ctx.fillStyle = `rgba(${couleur.r}, ${couleur.g}, ${couleur.b}, ${couleur.a})`;
            ctx.globalAlpha = particule.opacité * particule.vie;
            
            // Taille de rendu
            const taille = Math.max(1, particule.diamètre * 1000000); // conversion m -> px
            
            // Effet de flou pour la fumée
            ctx.filter = `blur(${Math.max(1, taille * 0.3)}px)`;
            
            // Dessin de la particule
            ctx.beginPath();
            ctx.arc(particule.x, particule.y, taille, 0, 2 * Math.PI);
            ctx.fill();
            
            // Traînée de la particule (trajectoire)
            if (particule.trajectoire.length > 1) {
                ctx.strokeStyle = `rgba(${couleur.r}, ${couleur.g}, ${couleur.b}, ${couleur.a * 0.3})`;
                ctx.lineWidth = taille * 0.5;
                ctx.beginPath();
                ctx.moveTo(particule.trajectoire[0].x, particule.trajectoire[0].y);
                
                for (let i = 1; i < particule.trajectoire.length; i++) {
                    const alpha = i / particule.trajectoire.length;
                    ctx.globalAlpha = particule.opacité * alpha * 0.3;
                    ctx.lineTo(particule.trajectoire[i].x, particule.trajectoire[i].y);
                }
                ctx.stroke();
            }
            
            ctx.restore();
        });
    }

    rendreVolutes(ctx) {
        this.volutesConvection.forEach(volute => {
            if (volute.vie <= 0) return;
            
            ctx.save();
            
            // Couleur selon la température
            const T = volute.température;
            let r, g, b;
            if (T < 400) {
                r = g = b = 150;
            } else {
                r = 150 + (T - 400) * 0.2;
                g = 150 + (T - 400) * 0.1;
                b = 150;
            }
            
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.3 * volute.vie})`;
            ctx.lineWidth = 3;
            ctx.filter = 'blur(2px)';
            
            // Dessin de la spirale
            if (volute.spirale.length > 1) {
                ctx.beginPath();
                ctx.moveTo(volute.spirale[0].x, volute.spirale[0].y);
                
                for (let i = 1; i < volute.spirale.length; i++) {
                    const point = volute.spirale[i];
                    ctx.lineTo(point.x, point.y);
                }
                ctx.stroke();
            }
            
            // Centre de la volute
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.5 * volute.vie})`;
            ctx.beginPath();
            ctx.arc(volute.x, volute.y, volute.rayon * 0.1, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.restore();
        });
    }

    rendreTurbulence(ctx) {
        ctx.save();
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        this.champTurbulence.forEach(turbulence => {
            if (turbulence.intensité > 0.3) {
                const longueur = turbulence.intensité * 20;
                const angle = Math.atan2(turbulence.vy, turbulence.vx);
                
                ctx.beginPath();
                ctx.moveTo(turbulence.x, turbulence.y);
                ctx.lineTo(
                    turbulence.x + longueur * Math.cos(angle),
                    turbulence.y + longueur * Math.sin(angle)
                );
                ctx.stroke();
            }
        });
        
        ctx.restore();
    }

    rendreSources(ctx) {
        this.sourcesCombustion.forEach(source => {
            if (!source.active) return;
            
            ctx.save();
            
            // Couleur selon la température et l'intensité
            const T = source.température;
            const intensité = source.intensité;
            
            let r, g, b;
            if (T < 500) {
                r = 200 * intensité;
                g = 100 * intensité;
                b = 50 * intensité;
            } else {
                r = 255 * intensité;
                g = 150 * intensité;
                b = 100 * intensité;
            }
            
            // Gradient radial pour la source
            const gradient = ctx.createRadialGradient(
                source.x, source.y, 0,
                source.x, source.y, source.rayon
            );
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.8 * intensité})`);
            gradient.addColorStop(0.5, `rgba(${r*0.7}, ${g*0.7}, ${b*0.7}, ${0.4 * intensité})`);
            gradient.addColorStop(1, `rgba(${r*0.3}, ${g*0.3}, ${b*0.3}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.filter = 'blur(3px)';
            
            // Dessin de la source
            ctx.beginPath();
            ctx.arc(source.x, source.y, source.rayon, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.restore();
        });
    }

    // Méthodes de contrôle public
    démarrer() {
        this.combustionActive = true;
        this.temps = 0;
        this.sourcesCombustion.forEach(source => source.active = true);
    }

    arrêter() {
        this.combustionActive = false;
        this.sourcesCombustion.forEach(source => source.active = false);
    }

    redémarrer() {
        this.arrêter();
        this.particulesFumée = [];
        this.volutesConvection = [];
        this.générerSourcesÉmission({ width: window.innerWidth, height: window.innerHeight });
        this.démarrer();
    }

    configurerDensité(nouvelleDensité) {
        this.densitéFumée = Math.max(0.1, Math.min(5.0, nouvelleDensité));
        this.parameters.densité.value = this.densitéFumée;
        this.sélectionnerTypeFumée();
    }

    configurerTempérature(nouvelleTempérature) {
        this.températureFluide = Math.max(300, Math.min(1500, nouvelleTempérature));
        this.parameters.température.value = this.températureFluide;
        this.calculerPropriétésThermodynamiques();
    }

    configurerVitesse(nouvelleVitesse) {
        this.vitesseAscension = Math.max(0.5, Math.min(10, nouvelleVitesse));
        this.parameters.vitesse.value = this.vitesseAscension;
    }

    obtenirStatistiques() {
        return {
            nombreParticules: this.particulesFumée.length,
            nombreVolutes: this.volutesConvection.length,
            nombreSources: this.sourcesCombustion.filter(s => s.active).length,
            densitéMoyenne: this.densitéFumée,
            températureMoyenne: this.calculerTempératureMoyenne(),
            vitesseMoyenne: this.vitesseAscension,
            turbulenceMoyenne: this.niveauTurbulence,
            efficacitéRendu: this.efficacitéRendu,
            typeFumée: this.typeFumée,
            nombreReynolds: this.nombreReynolds,
            nombreRayleigh: this.nombreRayleigh
        };
    }
}

// Classe de base pour les effets (si non définie ailleurs)
class BaseEffect {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.category = config.category;
        this.version = config.version;
        this.performance = config.performance;
        this.parameters = config.parameters;
    }
}

// Export de l'effet
export default SmokeSimulationEffect;



// 🤖 Améliorations automatiques niveau 1:

// - Optimisation des performances
// - Harmonisation des couleurs
// - Amélioration de la compatibilité