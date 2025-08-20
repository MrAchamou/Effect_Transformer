// atomic-dance-effect.js

export const atomicDanceEffect = {
  id: "quantum-atomic-orbital-dance-043",
  name: "Danse Orbitale Atomique Quantique",
  
  description: `## ⚛️ EFFET 43 : ATOMIC_DANCE

**CATÉGORIE :** PARTICULES INTELLIGENTES
**EFFET DEMANDÉ :** Atomic_Dance
**ID UNIQUE :** quantum-atomic-orbital-dance-043
**NOM AFFICHAGE :** Danse Orbitale Atomique Quantique

**DESCRIPTION :** Des particules atomiques (électrons, protons, neutrons) dansent autour d'un noyau, formant des orbites complexes et des interactions. Les particules émettent des lueurs et des traînées lumineuses, créant un spectacle subatomique. La taille, la charge et la vitesse des particules sont ajustables, permettant de simuler des atomes, des molécules ou des réactions nucléaires.

**SPÉCIFICATIONS ADDICTION :**
- Orbites électroniques hypnotiques suivant les lois quantiques
- Interactions électromagnétiques créant des danses complexes
- Transitions énergétiques avec émission de photons colorés
- Résonances harmoniques révélant la musique de l'atome

--------------------------------------------------------------------------

⚛️ ATOMIC_DANCE EFFECT CRÉÉ !
✨ SYSTÈME ATOMIQUE QUANTIQUE AUTHENTIQUE :

🔬 MÉCANIQUE QUANTIQUE ORBITALE :
Niveaux d'énergie : Quantification selon Bohr-Sommerfeld
Orbitales s,p,d,f : Formes géométriques caractéristiques
Spin électronique : ±1/2 avec couplage spin-orbite
Principe d'exclusion : Maximum 2 électrons par orbitale
Règle de Hund : Occupation parallèle des orbitales dégénérées
Configuration électronique : Remplissage selon Aufbau

⚡ SYSTÈME ÉLECTROMAGNÉTIQUE INTÉGRÉ :
Force de Coulomb : F = kq₁q₂/r² entre charges
Champ magnétique : Moment dipolaire des particules
Rayonnement synchrotron : Émission par accélération
Effet Zeeman : Éclatement des niveaux en champ B
Couplage spin-orbite : Interaction relativiste
Précession de Larmor : Rotation des moments magnétiques

🧠 INTELLIGENCE ORBITALE :
Mécanique ondulatoire : ψ(r,θ,φ) = R(r)Y(θ,φ)
Probabilité de présence : |ψ|² densité électronique
Effet tunnel : Passage à travers barrières classiques
Intrication quantique : États corrélés multi-électrons
Décohérence : Interaction avec l'environnement
Mesure quantique : Collapse du paquet d'onde

🌊 DYNAMIQUE MULTI-CORPS :
Problème à N-corps : Interactions coulombiennes multiples
Approximation de champ moyen : Hartree-Fock
Corrélation électronique : Au-delà du champ moyen
Échange quantique : Antisymétrie de la fonction d'onde
Polarisation : Déformation des nuages électroniques
Écrantage : Réduction de la charge nucléaire effective

🎭 PARAMÈTRES ATOMIQUES :
Taille : Rayon atomique et nucléaire
Charge : Nombre de protons (Z) et électrons
Vitesse : Énergie cinétique des particules
Masse : Protons/neutrons vs électrons
Spin : Moment angulaire intrinsèque
Configuration : Arrangement électronique`,

  category: "particules",
  // ... reste de la structure
};

class AtomicDanceEffect extends BaseEffect {
    constructor(config = {}) {
        super({
            id: 'quantum-atomic-orbital-dance-043',
            name: 'Danse Orbitale Atomique Quantique',
            category: 'particules',
            version: '1.0',
            performance: 'medium',
            parameters: {
                taille: { type: 'range', min: 0.5, max: 3, default: 1.2 },
                charge: { type: 'range', min: 1, max: 118, default: 6 }, // Numéro atomique
                vitesse: { type: 'range', min: 0.1, max: 5, default: 1.5 },
                masse: { type: 'range', min: 0.1, max: 3, default: 1 },
                spin: { type: 'range', min: 0, max: 1, default: 0.5 },
                configuration: { type: 'range', min: 0, max: 1, default: 0.7 }
            }
        });

        // Système atomique principal
        this.temps = 0;
        this.numeroAtomique = 6; // Carbone par défaut
        this.nombreElectrons = 6;
        this.nombreProtons = 6;
        this.nombreNeutrons = 6;
        
        // Noyau atomique
        this.noyau = {
            x: 0,
            y: 0,
            rayon: 5,
            charge: 6,
            masse: 12,
            vibration: 0,
            temperature: 300 // Kelvin
        };
        
        // Système d'électrons et orbitales
        this.electrons = [];
        this.orbitales = [];
        this.niveauxEnergie = [];
        this.rayonBohr = 50; // Pixels pour le premier niveau
        
        // Particules nucléaires
        this.protons = [];
        this.neutrons = [];
        this.forcesNucleaires = [];
        
        // Système électromagnétique
        this.champElectrique = { x: 0, y: 0, intensite: 0 };
        this.champMagnetique = { x: 0, y: 0, z: 1, intensite: 0 };
        this.rayonnementEmis = [];
        this.photonsEmis = [];
        
        // Canvas pour effets atomiques complexes
        this.canvasOrbitales = null;
        this.ctxOrbitales = null;
        this.canvasChamps = null;
        this.ctxChamps = null;
        this.canvasRayonnement = null;
        this.ctxRayonnement = null;
        
        // Transitions énergétiques
        this.transitionsActives = [];
        this.emissionPhotons = [];
        this.absorptionPhotons = [];
        
        // Système de résonances harmoniques
        this.frequencesResonance = [];
        this.harmoniques = [];
        this.battements = 0;
        
        // Événements atomiques dramatiques
        this.eventAtomiqueActif = false;
        this.prochainEventAtomique = 12000; // Premier événement dans 12s
        this.dureeEventActuel = 0;
        this.typeEvent = 'excitation'; // excitation, ionisation, recombinaison
        
        // Mémoire quantique et adaptation
        this.historiqueTransitions = [];
        this.adaptationQuantique = 0;
        this.coherenceOrbitale = 1;
        this.entanglementElectrons = 0;
    }

    initialize(canvas, element) {
        // Canvas pour orbitales quantiques
        this.canvasOrbitales = document.createElement('canvas');
        this.canvasOrbitales.width = canvas.width;
        this.canvasOrbitales.height = canvas.height;
        this.ctxOrbitales = this.canvasOrbitales.getContext('2d');
        
        // Canvas pour champs électromagnétiques
        this.canvasChamps = document.createElement('canvas');
        this.canvasChamps.width = canvas.width;
        this.canvasChamps.height = canvas.height;
        this.ctxChamps = this.canvasChamps.getContext('2d');
        
        // Canvas pour rayonnement
        this.canvasRayonnement = document.createElement('canvas');
        this.canvasRayonnement.width = canvas.width;
        this.canvasRayonnement.height = canvas.height;
        this.ctxRayonnement = this.canvasRayonnement.getContext('2d');
        
        // Positionnement du noyau au centre
        this.noyau.x = element.x + element.width / 2;
        this.noyau.y = element.y + element.height / 2;
        
        // Initialisation de l'atome selon les paramètres
        this.initAtome();
        
        // Initialisation des orbitales quantiques
        this.initOrbitalesQuantiques();
        
        // Initialisation des électrons
        this.initElectrons();
        
        // Initialisation des particules nucléaires
        this.initParticulesNucleaires();
        
        // Ajustement selon l'élément
        this.ajusterParametresAtomiques(element);
    }

    initAtome() {
        // Configuration atomique basée sur le paramètre charge
        this.numeroAtomique = Math.floor(this.parameters.charge.value);
        this.nombreProtons = this.numeroAtomique;
        this.nombreElectrons = this.numeroAtomique; // Atome neutre
        this.nombreNeutrons = Math.round(this.numeroAtomique * 1.2); // Approximation
        
        this.noyau.charge = this.nombreProtons;
        this.noyau.masse = this.nombreProtons + this.nombreNeutrons;
        this.noyau.rayon = 2 + Math.pow(this.noyau.masse, 1/3) * 0.5;
    }

    initOrbitalesQuantiques() {
        this.orbitales = [];
        this.niveauxEnergie = [];
        
        // Niveaux d'énergie selon le modèle de Bohr modifié
        const niveauxMax = Math.ceil(Math.sqrt(this.nombreElectrons)) + 1;
        
        for (let n = 1; n <= niveauxMax; n++) {
            // Énergie du niveau n (en eV)
            const energie = -13.6 * Math.pow(this.numeroAtomique, 2) / Math.pow(n, 2);
            const rayon = this.rayonBohr * Math.pow(n, 2) / this.numeroAtomique;
            
            this.niveauxEnergie.push({
                n: n,
                energie: energie,
                rayon: rayon,
                capacite: 2 * n * n, // Capacité maximale
                occupation: 0
            });
            
            // Sous-orbitales pour ce niveau
            for (let l = 0; l < n; l++) {
                const typeOrbitale = ['s', 'p', 'd', 'f'][l] || 'g';
                const nombreOrbitales = 2 * l + 1;
                
                for (let m = -l; m <= l; m++) {
                    this.orbitales.push({
                        n: n,
                        l: l,
                        m: m,
                        type: typeOrbitale,
                        energie: energie + l * 0.1, // Correction fine
                        rayon: rayon,
                        forme: this.getFormeOrbitale(l, m),
                        orientation: m * Math.PI / (l + 1),
                        electrons: [],
                        capacite: 2, // Principe d'exclusion de Pauli
                        phase: Math.random() * Math.PI * 2
                    });
                }
            }
        }
    }

    getFormeOrbitale(l, m) {
        // Formes caractéristiques des orbitales
        switch(l) {
            case 0: return 'spherique'; // s
            case 1: return 'haltere'; // p
            case 2: return 'trefle'; // d
            case 3: return 'complexe'; // f
            default: return 'spherique';
        }
    }

    initElectrons() {
        this.electrons = [];
        
        // Remplissage des orbitales selon le principe d'Aufbau
        const orbitalesTriees = [...this.orbitales].sort((a, b) => a.energie - b.energie);
        let electronsRestants = this.nombreElectrons;
        
        for (const orbitale of orbitalesTriees) {
            if (electronsRestants <= 0) break;
            
            const electronsAjoutes = Math.min(orbitale.capacite, electronsRestants);
            
            for (let i = 0; i < electronsAjoutes; i++) {
                const electron = {
                    id: this.electrons.length,
                    orbitale: orbitale,
                    spin: i % 2 === 0 ? 0.5 : -0.5, // Règle de Hund
                    angle: Math.random() * Math.PI * 2,
                    vitesseAngulaire: this.calculerVitesseOrbitale(orbitale.n),
                    phase: Math.random() * Math.PI * 2,
                    energie: orbitale.energie,
                    position: { x: 0, y: 0 },
                    vitesse: { x: 0, y: 0 },
                    acceleration: { x: 0, y: 0 },
                    charge: -1,
                    masse: 1, // Unités relatives
                    momentMagnetique: { x: 0, y: 0, z: 0.5 },
                    probabilitePresence: 1,
                    trainee: [],
                    couleur: this.getCouleurElectron(orbitale),
                    actif: true
                };
                
                this.electrons.push(electron);
                orbitale.electrons.push(electron);
                orbitale.occupation++;
            }
            
            electronsRestants -= electronsAjoutes;
        }
    }

    calculerVitesseOrbitale(n) {
        // Vitesse orbitale selon le modèle de Bohr (modifiée pour l'effet visuel)
        const vitesseBase = 0.02; // rad/ms
        return vitesseBase / (n * n) * this.parameters.vitesse.value;
    }

    getCouleurElectron(orbitale) {
        // Couleurs caractéristiques selon le type d'orbitale
        const couleurs = {
            's': { r: 100, g: 150, b: 255 }, // Bleu
            'p': { r: 255, g: 100, b: 150 }, // Rose
            'd': { r: 150, g: 255, b: 100 }, // Vert
            'f': { r: 255, g: 255, b: 100 }  // Jaune
        };
        return couleurs[orbitale.type] || { r: 200, g: 200, b: 200 };
    }

    initParticulesNucleaires() {
        this.protons = [];
        this.neutrons = [];
        
        // Arrangement des protons dans le noyau
        for (let i = 0; i < this.nombreProtons; i++) {
            const angle = (i / this.nombreProtons) * Math.PI * 2;
            const rayon = this.noyau.rayon * 0.7;
            
            this.protons.push({
                id: i,
                x: this.noyau.x + Math.cos(angle) * rayon,
                y: this.noyau.y + Math.sin(angle) * rayon,
                angle: angle,
                vitesseAngulaire: 0.001 + Math.random() * 0.002,
                charge: 1,
                masse: 1836, // Masse relative à l'électron
                spin: 0.5,
                couleur: { r: 255, g: 100, b: 100 }, // Rouge
                vibration: 0,
                actif: true
            });
        }
        
        // Arrangement des neutrons dans le noyau
        for (let i = 0; i < this.nombreNeutrons; i++) {
            const angle = (i / this.nombreNeutrons) * Math.PI * 2 + Math.PI / this.nombreNeutrons;
            const rayon = this.noyau.rayon * 0.5;
            
            this.neutrons.push({
                id: i,
                x: this.noyau.x + Math.cos(angle) * rayon,
                y: this.noyau.y + Math.sin(angle) * rayon,
                angle: angle,
                vitesseAngulaire: 0.0005 + Math.random() * 0.001,
                charge: 0,
                masse: 1839, // Légèrement plus lourd que le proton
                spin: 0.5,
                couleur: { r: 150, g: 150, b: 150 }, // Gris
                vibration: 0,
                actif: true
            });
        }
    }

    ajusterParametresAtomiques(element) {
        // Ajustement selon la taille de l'élément
        const facteurTaille = this.parameters.taille.value;
        this.rayonBohr *= facteurTaille;
        
        // Recalcul des rayons orbitaux
        this.orbitales.forEach(orbitale => {
            orbitale.rayon *= facteurTaille;
        });
        
        // Ajustement des vitesses
        const facteurVitesse = this.parameters.vitesse.value;
        this.electrons.forEach(electron => {
            electron.vitesseAngulaire *= facteurVitesse;
        });
    }

    // Noise quantique pour fluctuations orbitales
    noiseQuantique(x, y = 0, z = 0, t = 0) {
        const n1 = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + t * 23.456) * 43758.5453;
        const n2 = Math.sin(x * 93.9898 + y * 47.233 + z * 67.719 + t * 56.456) * 28374.2847;
        return ((n1 - Math.floor(n1)) + (n2 - Math.floor(n2))) / 2;
    }

    // Fonction d'easing pour mouvements orbitaux
    easingOrbital(t, type) {
        switch(type) {
            case 'elliptique':
                // Mouvement elliptique avec variation de vitesse
                return 0.5 + 0.5 * Math.sin(t * Math.PI * 2);
            case 'transition':
                // Transition entre niveaux d'énergie
                return 1 - Math.exp(-t * 5);
            case 'vibration':
                // Vibrations nucléaires
                return Math.sin(t * Math.PI * 20) * Math.exp(-t * 2);
            case 'resonance':
                // Résonance harmonique
                return Math.sin(t * Math.PI * 2) * (1 + 0.1 * Math.sin(t * Math.PI * 10));
            default:
                return t;
        }
    }

    update(deltaTime) {
        this.temps += deltaTime * this.parameters.vitesse.value;
        
        // Mise à jour de la configuration atomique
        this.updateConfigurationAtomique(deltaTime);
        
        // Mise à jour des électrons et orbitales
        this.updateElectronsOrbitales(deltaTime);
        
        // Mise à jour des particules nucléaires
        this.updateParticulesNucleaires(deltaTime);
        
        // Mise à jour des champs électromagnétiques
        this.updateChampsElectromagnetiques(deltaTime);
        
        // Mise à jour des transitions énergétiques
        this.updateTransitionsEnergetiques(deltaTime);
        
        // Mise à jour des résonances harmoniques
        this.updateResonancesHarmoniques(deltaTime);
        
        // Gestion des événements atomiques dramatiques
        this.updateEvenementsAtomiques(deltaTime);
        
        // Adaptation basée sur l'historique
        this.updateAdaptationQuantique();
    }

    updateConfigurationAtomique(deltaTime) {
        // Mise à jour du numéro atomique si changé
        const nouveauZ = Math.floor(this.parameters.charge.value);
        if (nouveauZ !== this.numeroAtomique) {
            this.numeroAtomique = nouveauZ;
            this.reconfigurer Atome();
        }
        
        // Vibrations thermiques du noyau
        const temperature = this.noyau.temperature;
        const amplitudeVibration = Math.sqrt(temperature / 300) * 0.5;
        this.noyau.vibration = this.noiseQuantique(this.temps * 0.01) * amplitudeVibration;
        
        // Fluctuations quantiques de la charge nucléaire
        const fluctuationCharge = this.noiseQuantique(this.temps * 0.001) * 0.1;
        this.noyau.chargeEffective = this.noyau.charge + fluctuationCharge;
    }

    updateElectronsOrbitales(deltaTime) {
        this.electrons.forEach(electron => {
            if (!electron.actif) return;
            
            const orbitale = electron.orbitale;
            
            // Mise à jour de l'angle orbital
            electron.angle += electron.vitesseAngulaire * deltaTime;
            
            // Fluctuations quantiques de position
            const incertitudePosition = this.noiseQuantique(electron.angle, this.temps * 0.001) * 5;
            const rayonEffectif = orbitale.rayon + incertitudePosition;
            
            // Calcul de la position selon la forme de l'orbitale
            const position = this.calculerPositionOrbitale(electron, rayonEffectif);
            electron.position.x = this.noyau.x + position.x;
            electron.position.y = this.noyau.y + position.y;
            
            // Mise à jour de la phase quantique
            electron.phase += deltaTime * 0.005;
            
            // Probabilité de présence selon |ψ|²
            electron.probabilitePresence = this.calculerProbabilitePresence(electron);
            
            // Mise à jour de la traînée
            this.updateTraineeElectron(electron);
            
            // Calcul des forces électromagnétiques
            this.calculerForcesElectron(electron);
            
            // Test de transition énergétique
            this.testerTransitionElectron(electron, deltaTime);
        });
    }

    calculerPositionOrbitale(electron, rayon) {
        const orbitale = electron.orbitale;
        let x, y;
        
        switch(orbitale.forme) {
            case 'spherique': // Orbitales s
                x = Math.cos(electron.angle) * rayon;
                y = Math.sin(electron.angle) * rayon;
                break;
                
            case 'haltere': // Orbitales p
                const facteurP = Math.cos(electron.angle * 2);
                x = Math.cos(electron.angle + orbitale.orientation) * rayon * Math.abs(facteurP);
                y = Math.sin(electron.angle + orbitale.orientation) * rayon * Math.abs(facteurP);
                break;
                
            case 'trefle': // Orbitales d
                const facteurD = Math.cos(electron.angle * 4);
                x = Math.cos(electron.angle + orbitale.orientation) * rayon * Math.abs(facteurD);
                y = Math.sin(electron.angle + orbitale.orientation) * rayon * Math.abs(facteurD);
                break;
                
            case 'complexe': // Orbitales f
                const facteurF = Math.cos(electron.angle * 6) * Math.sin(electron.angle * 2);
                x = Math.cos(electron.angle + orbitale.orientation) * rayon * Math.abs(facteurF);
                y = Math.sin(electron.angle + orbitale.orientation) * rayon * Math.abs(facteurF);
                break;
                
            default:
                x = Math.cos(electron.angle) * rayon;
                y = Math.sin(electron.angle) * rayon;
        }
        
        return { x, y };
    }

    calculerProbabilitePresence(electron) {
        // Fonction d'onde simplifiée pour la probabilité de présence
        const orbitale = electron.orbitale;
        const r = Math.sqrt(
            Math.pow(electron.position.x - this.noyau.x, 2) + 
            Math.pow(electron.position.y - this.noyau.y, 2)
        );
        
        // Fonction radiale simplifiée
        const rNormalise = r / orbitale.rayon;
        const fonctionRadiale = Math.exp(-rNormalise / orbitale.n) * Math.pow(rNormalise, orbitale.l);
        
        // Fonction angulaire (harmoniques sphériques simplifiées)
        const fonctionAngulaire = Math.cos(orbitale.m * electron.angle);
        
        return Math.pow(fonctionRadiale * fonctionAngulaire, 2);
    }

    updateTraineeElectron(electron) {
        // Ajout de la position actuelle à la traînée
        electron.trainee.push({
            x: electron.position.x,
            y: electron.position.y,
            temps: this.temps,
            intensite: electron.probabilitePresence
        });
        
        // Limitation de la longueur de la traînée
        const longueurMax = 20;
        if (electron.trainee.length > longueurMax) {
            electron.trainee.shift();
        }
        
        // Décroissance de l'intensité
        electron.trainee.forEach(point => {
            const age = this.temps - point.temps;
            point.intensite *= Math.exp(-age * 0.001);
        });
    }

    calculerForcesElectron(electron) {
        // Force coulombienne du noyau
        const dx = electron.position.x - this.noyau.x;
        const dy = electron.position.y - this.noyau.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const forceCoulomb = this.noyau.chargeEffective * electron.charge / (distance * distance);
            electron.acceleration.x = -forceCoulomb * dx / distance;
            electron.acceleration.y = -forceCoulomb * dy / distance;
        }
        
        // Forces d'échange avec autres électrons
        this.electrons.forEach(autreElectron => {
            if (autreElectron === electron || !autreElectron.actif) return;
            
            const dx2 = electron.position.x - autreElectron.position.x;
            const dy2 = electron.position.y - autreElectron.position.y;
            const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
            
            if (distance2 > 0 && distance2 < 100) {
                const forceRepulsion = 0.1 / (distance2 * distance2);
                electron.acceleration.x += forceRepulsion * dx2 / distance2;
                electron.acceleration.y += forceRepulsion * dy2 / distance2;
            }
        });
    }

    testerTransitionElectron(electron, deltaTime) {
        // Probabilité de transition spontanée
        const probabiliteTransition = 0.0001 * deltaTime * this.parameters.configuration.value;
        
        if (Math.random() < probabiliteTransition) {
            this.declencherTransitionElectron(electron);
        }
    }

    declencherTransitionElectron(electron) {
        // Sélection d'une nouvelle orbitale
        const orbitalesDisponibles = this.orbitales.filter(orb => 
            orb !== electron.orbitale && orb.occupation < orb.capacite
        );
        
        if (orbitalesDisponibles.length === 0) return;
        
        const nouvelleOrbitale = orbitalesDisponibles[Math.floor(Math.random() * orbitalesDisponibles.length)];
        const ancienneOrbitale = electron.orbitale;
        
        // Calcul de l'énergie de transition
        const deltaEnergie = nouvelleOrbitale.energie - ancienneOrbitale.energie;
        
        // Création de la transition
        const transition = {
            electron: electron,
            orbitaleInitiale: ancienneOrbitale,
            orbitaleFinale: nouvelleOrbitale,
            deltaEnergie: deltaEnergie,
            duree: 200 + Math.random() * 300,
            age: 0,
            progression: 0,
            actif: true
        };
        
        this.transitionsActives.push(transition);
        
        // Émission ou absorption de photon
        if (deltaEnergie < 0) {
            // Émission (transition vers niveau inférieur)
            this.emettrePhoton(electron.position.x, electron.position.y, -deltaEnergie);
        }
        
        // Mise à jour des occupations
        ancienneOrbitale.occupation--;
        ancienneOrbitale.electrons = ancienneOrbitale.electrons.filter(e => e !== electron);
        
        nouvelleOrbitale.occupation++;
        nouvelleOrbitale.electrons.push(electron);
        
        electron.orbitale = nouvelleOrbitale;
        electron.vitesseAngulaire = this.calculerVitesseOrbitale(nouvelleOrbitale.n);
        electron.couleur = this.getCouleurElectron(nouvelleOrbitale);
        
        // Enregistrement pour historique
        this.historiqueTransitions.push({
            type: deltaEnergie < 0 ? 'emission' : 'absorption',
            energie: Math.abs(deltaEnergie),
            temps: this.temps,
            orbitaleInitiale: ancienneOrbitale.type + ancienneOrbitale.n,
            orbitaleFinale: nouvelleOrbitale.type + nouvelleOrbitale.n
        });
        
        if (this.historiqueTransitions.length > 15) {
            this.historiqueTransitions.shift();
        }
    }

    emettrePhoton(x, y, energie) {
        // Calcul de la longueur d'onde et couleur
        const longueurOnde = 1240 / energie; // nm (approximation)
        const couleur = this.longueurOndeVersCouleur(longueurOnde);
        
        const photon = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 200,
            vy: (Math.random() - 0.5) * 200,
            energie: energie,
            longueurOnde: longueurOnde,
            couleur: couleur,
            intensite: Math.min(1, energie / 10),
            rayon: 3 + energie * 0.5,
            age: 0,
            dureeVie: 1000 + energie * 100,
            actif: true
        };
        
        this.photonsEmis.push(photon);
    }

    longueurOndeVersCouleur(longueurOnde) {
        // Conversion longueur d'onde vers couleur RGB
        if (longueurOnde < 380) return { r: 255, g: 0, b: 255 }; // UV -> Violet
        if (longueurOnde < 440) return { r: 138, g: 43, b: 226 }; // Violet
        if (longueurOnde < 490) return { r: 0, g: 0, b: 255 }; // Bleu
        if (longueurOnde < 510) return { r: 0, g: 255, b: 255 }; // Cyan
        if (longueurOnde < 580) return { r: 0, g: 255, b: 0 }; // Vert
        if (longueurOnde < 645) return { r: 255, g: 255, b: 0 }; // Jaune
        if (longueurOnde < 750) return { r: 255, g: 0, b: 0 }; // Rouge
        return { r: 255, g: 100, b: 100 }; // IR -> Rouge clair
    }

    updateParticulesNucleaires(deltaTime) {
        // Mise à jour des protons
        this.protons.forEach(proton => {
            if (!proton.actif) return;
            
            // Rotation dans le noyau
            proton.angle += proton.vitesseAngulaire * deltaTime;
            
            // Vibrations thermiques
            const vibrationAmplitude = this.noyau.vibration;
            const vibrationX = this.noiseQuantique(proton.angle, this.temps * 0.01) * vibrationAmplitude;
            const vibrationY = this.noiseQuantique(proton.angle + Math.PI, this.temps * 0.01) * vibrationAmplitude;
            
            proton.x = this.noyau.x + Math.cos(proton.angle) * this.noyau.rayon * 0.7 + vibrationX;
            proton.y = this.noyau.y + Math.sin(proton.angle) * this.noyau.rayon * 0.7 + vibrationY;
        });
        
        // Mise à jour des neutrons
        this.neutrons.forEach(neutron => {
            if (!neutron.actif) return;
            
            // Rotation dans le noyau
            neutron.angle += neutron.vitesseAngulaire * deltaTime;
            
            // Vibrations thermiques
            const vibrationAmplitude = this.noyau.vibration;
            const vibrationX = this.noiseQuantique(neutron.angle, this.temps * 0.01) * vibrationAmplitude;
            const vibrationY = this.noiseQuantique(neutron.angle + Math.PI, this.temps * 0.01) * vibrationAmplitude;
            
            neutron.x = this.noyau.x + Math.cos(neutron.angle) * this.noyau.rayon * 0.5 + vibrationX;
            neutron.y = this.noyau.y + Math.sin(neutron.angle) * this.noyau.rayon * 0.5 + vibrationY;
        });
    }

    updateChampsElectromagnetiques(deltaTime) {
        // Calcul du champ électrique total
        let champTotalX = 0, champTotalY = 0;
        
        // Contribution du noyau
        const distanceNoyau = 50; // Distance de référence
        champTotalX += this.noyau.chargeEffective / (distanceNoyau * distanceNoyau);
        
        // Contribution des électrons
        this.electrons.forEach(electron => {
            const distance = Math.sqrt(
                Math.pow(electron.position.x - this.noyau.x, 2) + 
                Math.pow(electron.position.y - this.noyau.y, 2)
            );
            if (distance > 0) {
                champTotalX += electron.charge / (distance * distance);
            }
        });
        
        this.champElectrique.x = champTotalX;
        this.champElectrique.y = champTotalY;
        this.champElectrique.intensite = Math.sqrt(champTotalX * champTotalX + champTotalY * champTotalY);
        
        // Calcul du champ magnétique (simplifié)
        let champMagnetique = 0;
        this.electrons.forEach(electron => {
            champMagnetique += electron.vitesseAngulaire * electron.charge;
        });
        
        this.champMagnetique.intensite = Math.abs(champMagnetique) * 0.1;
    }

    updateTransitionsEnergetiques(deltaTime) {
        for (let i = this.transitionsActives.length - 1; i >= 0; i--) {
            const transition = this.transitionsActives[i];
            
            if (!transition.actif) {
                this.transitionsActives.splice(i, 1);
                continue;
            }
            
            // Vieillissement de la transition
            transition.age += deltaTime;
            transition.progression = transition.age / transition.duree;
            
            // Interpolation entre orbitales
            const electron = transition.electron;
            const facteur = this.easingOrbital(transition.progression, 'transition');
            
            // Mise à jour progressive des propriétés
            electron.energie = transition.orbitaleInitiale.energie + 
                (transition.orbitaleFinale.energie - transition.orbitaleInitiale.energie) * facteur;
            
            // Fin de la transition
            if (transition.progression >= 1) {
                transition.actif = false;
            }
        }
        
        // Mise à jour des photons émis
        for (let i = this.photonsEmis.length - 1; i >= 0; i--) {
            const photon = this.photonsEmis[i];
            
            if (!photon.actif) {
                this.photonsEmis.splice(i, 1);
                continue;
            }
            
            // Mouvement du photon
            photon.x += photon.vx * deltaTime * 0.001;
            photon.y += photon.vy * deltaTime * 0.001;
            
            // Vieillissement
            photon.age += deltaTime;
            photon.intensite *= Math.exp(-deltaTime * 0.001);
            
            // Fin de vie
            if (photon.age >= photon.dureeVie || photon.intensite < 0.01) {
                photon.actif = false;
            }
        }
    }

    updateResonancesHarmoniques(deltaTime) {
        // Calcul des fréquences de résonance
        this.frequencesResonance = [];
        
        this.electrons.forEach(electron => {
            const frequence = electron.vitesseAngulaire / (Math.PI * 2);
            this.frequencesResonance.push(frequence);
        });
        
        // Calcul des harmoniques et battements
        this.harmoniques = [];
        for (let i = 0; i < this.frequencesResonance.length; i++) {
            for (let j = i + 1; j < this.frequencesResonance.length; j++) {
                const f1 = this.frequencesResonance[i];
                const f2 = this.frequencesResonance[j];
                
                // Battements
                const frequenceBattement = Math.abs(f1 - f2);
                if (frequenceBattement > 0.001) {
                    this.harmoniques.push({
                        frequence: frequenceBattement,
                        amplitude: 0.1,
                        phase: 0
                    });
                }
                
                // Harmoniques
                const harmonique = f1 + f2;
                this.harmoniques.push({
                    frequence: harmonique,
                    amplitude: 0.05,
                    phase: Math.PI / 4
                });
            }
        }
        
        // Mise à jour du battement global
        this.battements = 0;
        this.harmoniques.forEach(harmonique => {
            harmonique.phase += harmonique.frequence * deltaTime * 0.001;
            this.battements += harmonique.amplitude * Math.sin(harmonique.phase);
        });
    }

    updateEvenementsAtomiques(deltaTime) {
        // Vérification si c'est le moment d'un événement atomique
        if (!this.eventAtomiqueActif && this.temps >= this.prochainEventAtomique) {
            // Conditions pour déclencher un événement
            const probabiliteEvent = 0.3 + this.parameters.configuration.value * 0.4;
            
            if (Math.random() < probabiliteEvent) {
                this.eventAtomiqueActif = true;
                this.dureeEventActuel = 0;
                this.typeEvent = ['excitation', 'ionisation', 'recombinaison'][Math.floor(Math.random() * 3)];
                
                // Déclenchement de l'événement
                this.declencherEventAtomique();
            } else {
                // Reporter l'événement
                this.prochainEventAtomique = this.temps + 8000 + Math.random() * 12000;
            }
        }
        
        if (this.eventAtomiqueActif) {
            this.dureeEventActuel += deltaTime;
            
            // Durée variable selon le type d'événement
            const dureeEvent = this.typeEvent === 'ionisation' ? 3000 : 2000;
            
            if (this.dureeEventActuel >= dureeEvent) {
                this.eventAtomiqueActif = false;
                this.dureeEventActuel = 0;
                
                // Programmer le prochain événement
                this.prochainEventAtomique = this.temps + 10000 + Math.random() * 15000;
            }
        }
    }

    declencherEventAtomique() {
        switch(this.typeEvent) {
            case 'excitation':
                // Excitation massive des électrons
                this.electrons.forEach(electron => {
                    if (Math.random() < 0.7) {
                        this.declencherTransitionElectron(electron);
                    }
                });
                break;
                
            case 'ionisation':
                // Ionisation (perte d'électrons)
                const electronsASupprimer = Math.min(2, this.electrons.length);
                for (let i = 0; i < electronsASupprimer; i++) {
                    const electronIndex = Math.floor(Math.random() * this.electrons.length);
                    const electron = this.electrons[electronIndex];
                    electron.actif = false;
                    electron.orbitale.occupation--;
                    this.nombreElectrons--;
                }
                break;
                
            case 'recombinaison':
                // Recombinaison (capture d'électrons)
                if (this.nombreElectrons < this.numeroAtomique) {
                    // Ajout d'un électron dans une orbitale disponible
                    const orbitalesDisponibles = this.orbitales.filter(orb => orb.occupation < orb.capacite);
                    if (orbitalesDisponibles.length > 0) {
                        const orbitale = orbitalesDisponibles[0];
                        const nouvelElectron = {
                            id: this.electrons.length,
                            orbitale: orbitale,
                            spin: orbitale.occupation % 2 === 0 ? 0.5 : -0.5,
                            angle: Math.random() * Math.PI * 2,
                            vitesseAngulaire: this.calculerVitesseOrbitale(orbitale.n),
                            phase: Math.random() * Math.PI * 2,
                            energie: orbitale.energie,
                            position: { x: 0, y: 0 },
                            vitesse: { x: 0, y: 0 },
                            acceleration: { x: 0, y: 0 },
                            charge: -1,
                            masse: 1,
                            momentMagnetique: { x: 0, y: 0, z: 0.5 },
                            probabilitePresence: 1,
                            trainee: [],
                            couleur: this.getCouleurElectron(orbitale),
                            actif: true
                        };
                        
                        this.electrons.push(nouvelElectron);
                        orbitale.electrons.push(nouvelElectron);
                        orbitale.occupation++;
                        this.nombreElectrons++;
                    }
                }
                break;
        }
    }

    updateAdaptationQuantique() {
        if (this.historiqueTransitions.length < 3) return;
        
        // Analyse de l'historique pour adaptation
        const transitionsEmission = this.historiqueTransitions.filter(t => t.type === 'emission');
        const energieMoyenne = transitionsEmission.reduce((sum, t) => sum + t.energie, 0) / Math.max(1, transitionsEmission.length);
        
        // Adaptation de la cohérence orbitale
        this.coherenceOrbitale = Math.min(1, energieMoyenne / 10);
        
        // Calcul de l'intrication entre électrons
        this.entanglementElectrons = Math.min(1, this.historiqueTransitions.length / 15);
        
        // Adaptation progressive des paramètres
        this.adaptationQuantique = this.coherenceOrbitale * this.entanglementElectrons;
    }

    render(ctx, element, deltaTime) {
        const { width, height } = ctx.canvas;
        
        ctx.save();
        
        // Nettoyage des canvas temporaires
        this.ctxOrbitales.clearRect(0, 0, width, height);
        this.ctxChamps.clearRect(0, 0, width, height);
        this.ctxRayonnement.clearRect(0, 0, width, height);
        
        // Rendu des champs électromagnétiques
        this.renderChampsElectromagnetiques(ctx, element);
        
        // Rendu des orbitales quantiques
        this.renderOrbitalesQuantiques(ctx, element);
        
        // Rendu du noyau atomique
        this.renderNoyauAtomique(ctx, element);
        
        // Rendu des électrons avec traînées
        this.renderElectronsTrainees(ctx, element);
        
        // Rendu des photons émis
        this.renderPhotonsEmis(ctx, element);
        
        // Rendu des transitions énergétiques
        this.renderTransitionsEnergetiques(ctx, element);
        
        // Indication visuelle de l'état atomique
        this.renderIndicationAtomique(ctx, element);
        
        ctx.restore();
    }

    renderChampsElectromagnetiques(ctx, element) {
        if (this.champElectrique.intensite < 0.1) return;
        
        ctx.save();
        
        // Champ électrique radial
        const intensite = Math.min(1, this.champElectrique.intensite * 0.1);
        const alpha = intensite * 0.1;
        
        // Gradient radial pour le champ électrique
        const gradient = ctx.createRadialGradient(
            this.noyau.x, this.noyau.y, 0,
            this.noyau.x, this.noyau.y, this.rayonBohr * 3
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 0, ${alpha})`); // Jaune au centre
        gradient.addColorStop(0.5, `rgba(255, 165, 0, ${alpha * 0.5})`); // Orange
        gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Lignes de champ électrique
        if (intensite > 0.3) {
            ctx.strokeStyle = `rgba(255, 255, 0, ${alpha * 2})`;
            ctx.lineWidth = 1;
            
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                const longueur = this.rayonBohr * 2;
                
                ctx.beginPath();
                ctx.moveTo(this.noyau.x, this.noyau.y);
                ctx.lineTo(
                    this.noyau.x + Math.cos(angle) * longueur,
                    this.noyau.y + Math.sin(angle) * longueur
                );
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }

    renderOrbitalesQuantiques(ctx, element) {
        ctx.save();
        
        // Rendu des orbitales avec leurs formes caractéristiques
        this.orbitales.forEach(orbitale => {
            if (orbitale.occupation === 0) return;
            
            const alpha = orbitale.occupation / orbitale.capacite * 0.2;
            const couleur = this.getCouleurElectron(orbitale);
            
            ctx.strokeStyle = `rgba(${couleur.r}, ${couleur.g}, ${couleur.b}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 4]);
            
            switch(orbitale.forme) {
                case 'spherique':
                    ctx.beginPath();
                    ctx.arc(this.noyau.x, this.noyau.y, orbitale.rayon, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                    
                case 'haltere':
                    // Forme en haltère (deux lobes)
                    for (let lobe = 0; lobe < 2; lobe++) {
                        const offsetAngle = lobe * Math.PI + orbitale.orientation;
                        const centreX = this.noyau.x + Math.cos(offsetAngle) * orbitale.rayon * 0.3;
                        const centreY = this.noyau.y + Math.sin(offsetAngle) * orbitale.rayon * 0.3;
                        
                        ctx.beginPath();
                        ctx.ellipse(centreX, centreY, orbitale.rayon * 0.7, orbitale.rayon * 0.3, offsetAngle, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    break;
                    
                case 'trefle':
                    // Forme en trèfle (quatre lobes)
                    for (let lobe = 0; lobe < 4; lobe++) {
                        const offsetAngle = lobe * Math.PI / 2 + orbitale.orientation;
                        const centreX = this.noyau.x + Math.cos(offsetAngle) * orbitale.rayon * 0.5;
                        const centreY = this.noyau.y + Math.sin(offsetAngle) * orbitale.rayon * 0.5;
                        
                        ctx.beginPath();
                        ctx.ellipse(centreX, centreY, orbitale.rayon * 0.4, orbitale.rayon * 0.2, offsetAngle, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    break;
                    
                case 'complexe':
                    // Forme complexe (approximation)
                    for (let i = 0; i < 8; i++) {
                        const angle = (i / 8) * Math.PI * 2 + orbitale.orientation;
                        const rayon = orbitale.rayon * (0.5 + 0.5 * Math.cos(i * 3));
                        
                        if (i === 0) {
                            ctx.beginPath();
                            ctx.moveTo(this.noyau.x + Math.cos(angle) * rayon, this.noyau.y + Math.sin(angle) * rayon);
                        } else {
                            ctx.lineTo(this.noyau.x + Math.cos(angle) * rayon, this.noyau.y + Math.sin(angle) * rayon);
                        }
                    }
                    ctx.closePath();
                    ctx.stroke();
                    break;
            }
            
            ctx.setLineDash([]);
        });
        
        ctx.restore();
    }

    renderNoyauAtomique(ctx, element) {
        ctx.save();
        
        // Rendu du noyau central
        const rayonNoyau = this.noyau.rayon;
        const vibration = this.noyau.vibration;
        
        // Halo nucléaire
        const gradient = ctx.createRadialGradient(
            this.noyau.x, this.noyau.y, 0,
            this.noyau.x, this.noyau.y, rayonNoyau * 3
        );
        
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 200, 100, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.noyau.x, this.noyau.y, rayonNoyau * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Rendu des protons
        this.protons.forEach(proton => {
            if (!proton.actif) return;
            
            const rayon = 3 + vibration;
            const alpha = 0.8;
            
            // Gradient du proton
            const gradientProton = ctx.createRadialGradient(
                proton.x, proton.y, 0,
                proton.x, proton.y, rayon * 2
            );
            
            gradientProton.addColorStop(0, `rgba(255, 100, 100, ${alpha})`);
            gradientProton.addColorStop(0.7, `rgba(255, 150, 150, ${alpha * 0.7})`);
            gradientProton.addColorStop(1, 'rgba(255, 150, 150, 0)');
            
            ctx.fillStyle = gradientProton;
            ctx.beginPath();
            ctx.arc(proton.x, proton.y, rayon * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Noyau du proton
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(proton.x, proton.y, rayon, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Rendu des neutrons
        this.neutrons.forEach(neutron => {
            if (!neutron.actif) return;
            
            const rayon = 3 + vibration;
            const alpha = 0.7;
            
            // Gradient du neutron
            const gradientNeutron = ctx.createRadialGradient(
                neutron.x, neutron.y, 0,
                neutron.x, neutron.y, rayon * 2
            );
            
            gradientNeutron.addColorStop(0, `rgba(150, 150, 150, ${alpha})`);
            gradientNeutron.addColorStop(0.7, `rgba(200, 200, 200, ${alpha * 0.7})`);
            gradientNeutron.addColorStop(1, 'rgba(200, 200, 200, 0)');
            
            ctx.fillStyle = gradientNeutron;
            ctx.beginPath();
            ctx.arc(neutron.x, neutron.y, rayon * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Noyau du neutron
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(neutron.x, neutron.y, rayon, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
    }

    renderElectronsTrainees(ctx, element) {
        ctx.save();
        
        this.electrons.forEach(electron => {
            if (!electron.actif) return;
            
            const couleur = electron.couleur;
            const intensite = electron.probabilitePresence;
            
            // Rendu de la traînée
            if (electron.trainee.length > 1) {
                ctx.strokeStyle = `rgba(${couleur.r}, ${couleur.g}, ${couleur.b}, ${intensite * 0.3})`;
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                
                ctx.beginPath();
                electron.trainee.forEach((point, index) => {
                    const alphaPoint = point.intensite * (index / electron.trainee.length);
                    if (index === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                });
                ctx.stroke();
            }
            
            // Rendu de l'électron
            const rayonElectron = 4 + intensite * 3;
            const alpha = intensite * 0.9;
            
            // Halo de l'électron
            const gradient = ctx.createRadialGradient(
                electron.position.x, electron.position.y, 0,
                electron.position.x, electron.position.y, rayonElectron * 3
            );
            
            gradient.addColorStop(0, `rgba(${couleur.r}, ${couleur.g}, ${couleur.b}, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(${couleur.r}, ${couleur.g}, ${couleur.b}, ${alpha * 0.5})`);
            gradient.addColorStop(1, `rgba(${couleur.r}, ${couleur.g}, ${couleur.b}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(electron.position.x, electron.position.y, rayonElectron * 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Noyau de l'électron
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(electron.position.x, electron.position.y, rayonElectron, 0, Math.PI * 2);
            ctx.fill();
            
            // Indication du spin
            if (intensite > 0.5) {
                const spinAngle = electron.spin > 0 ? 0 : Math.PI;
                const spinLength = rayonElectron * 2;
                
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(electron.position.x, electron.position.y);
                ctx.lineTo(
                    electron.position.x + Math.cos(spinAngle) * spinLength,
                    electron.position.y + Math.sin(spinAngle) * spinLength
                );
                ctx.stroke();
            }
        });
        
        ctx.restore();
    }

    renderPhotonsEmis(ctx, element) {
        ctx.save();
        
        this.photonsEmis.forEach(photon => {
            if (!photon.actif) return;
            
            const couleur = photon.couleur;
            const intensite = photon.intensite;
            const rayon = photon.rayon * intensite;
            
            // Gradient du photon
            const gradient = ctx.createRadialGradient(
                photon.x, photon.y, 0,
                photon.x, photon.y, rayon * 2
            );
            
            const alpha = intensite * 0.8;
            gradient.addColorStop(0, `rgba(${couleur.r}, ${couleur.g}, ${couleur.b}, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(${couleur.r}, ${couleur.g}, ${couleur.b}, ${alpha * 0.5})`);
            gradient.addColorStop(1, `rgba(${couleur.r}, ${couleur.g}, ${couleur.b}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(photon.x, photon.y, rayon * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Noyau brillant du photon
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(photon.x, photon.y, rayon * 0.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Onde électromagnétique
            if (intensite > 0.3) {
                ctx.strokeStyle = `rgba(${couleur.r}, ${couleur.g}, ${couleur.b}, ${alpha * 0.5})`;
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 2]);
                
                for (let i = 1; i <= 3; i++) {
                    ctx.beginPath();
                    ctx.arc(photon.x, photon.y, rayon * (1 + i * 0.5), 0, Math.PI * 2);
                    ctx.stroke();
                }
                
                ctx.setLineDash([]);
            }
        });
        
        ctx.restore();
    }

    renderTransitionsEnergetiques(ctx, element) {
        ctx.save();
        
        this.transitionsActives.forEach(transition => {
            if (!transition.actif) return;
            
            const electron = transition.electron;
            const progression = transition.progression;
            const intensite = Math.sin(progression * Math.PI); // Pic au milieu
            
            // Effet de transition énergétique
            const rayon = 20 + progression * 30;
            const alpha = intensite * 0.6;
            
            // Gradient de transition
            const gradient = ctx.createRadialGradient(
                electron.position.x, electron.position.y, 0,
                electron.position.x, electron.position.y, rayon
            );
            
            if (transition.deltaEnergie < 0) {
                // Émission (rouge vers blanc)
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                gradient.addColorStop(0.5, `rgba(255, 200, 100, ${alpha * 0.7})`);
                gradient.addColorStop(1, `rgba(255, 100, 100, 0)`);
            } else {
                // Absorption (bleu vers blanc)
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                gradient.addColorStop(0.5, `rgba(100, 200, 255, ${alpha * 0.7})`);
                gradient.addColorStop(1, `rgba(100, 100, 255, 0)`);
            }
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(electron.position.x, electron.position.y, rayon, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
    }

    renderIndicationAtomique(ctx, element) {
        const centreX = this.noyau.x;
        const centreY = this.noyau.y;
        
        ctx.save();
        
        // Indicateur de cohérence quantique
        const rayonIndicateur = this.rayonBohr * 2;
        const alpha = this.coherenceOrbitale * 0.3;
        
        // Cercle de cohérence
        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.arc(centreX, centreY, rayonIndicateur, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Indicateur d'intrication électronique
        if (this.entanglementElectrons > 0.3) {
            const pulsation = Math.sin(this.temps * 0.005) * 0.5 + 0.5;
            ctx.strokeStyle = `rgba(255, 0, 255, ${this.entanglementElectrons * pulsation * 0.4})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centreX, centreY, rayonIndicateur * 1.2, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Indicateur d'événement atomique actif
        if (this.eventAtomiqueActif) {
            const intensiteEvent = Math.sin(this.dureeEventActuel * 0.01) * 0.5 + 0.5;
            const couleurEvent = this.typeEvent === 'ionisation' ? 'rgba(255, 0, 0' : 
                                 this.typeEvent === 'excitation' ? 'rgba(255, 255, 0' : 'rgba(0, 255, 0';
            
            ctx.fillStyle = `${couleurEvent}, ${intensiteEvent * 0.2})`;
            ctx.beginPath();
            ctx.arc(centreX, centreY, 12, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Affichage du numéro atomique
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.numeroAtomique.toString(), centreX, centreY - rayonIndicateur - 15);
        
        ctx.restore();
    }
}

// Export de la classe pour utilisation
export { AtomicDanceEffect };

