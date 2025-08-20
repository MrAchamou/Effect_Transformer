/**
 * Module de préprocessing automatique pour standardiser les fichiers JavaScript
 * Convertit automatiquement les effets en format compatible avec le système
 */

export class JSPreprocessor {
  private baseEffectTemplate = `
// Classe de base générée automatiquement
class BaseEffect {
  constructor(config = {}) {
    this.id = config.id || 'effect-' + Date.now();
    this.name = config.name || 'Effect';
    this.category = config.category || 'general';
    this.version = config.version || '1.0';
    this.performance = config.performance || 'medium';
    this.parameters = config.parameters || {};
  }
  
  initialize(canvas, element) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.element = element;
  }
  
  animate(deltaTime) {
    // Méthode à surcharger
  }
  
  destroy() {
    // Nettoyage
  }
}
`;

  /**
   * Préprocess un fichier JavaScript pour le rendre compatible
   */
  async preprocessJS(originalCode: string, filename: string): Promise<{
    processedCode: string;
    changes: string[];
    isValid: boolean;
    error?: string;
  }> {
    const changes: string[] = [];
    let processedCode = originalCode;

    try {
      // 1. Détection de fichiers incomplets ou de métadonnées seulement
      const metadataConversion = this.convertMetadataToEffect(processedCode, filename);
      if (metadataConversion.converted) {
        processedCode = metadataConversion.code;
        changes.push(...metadataConversion.changes);
      }

      // 2. Détection et conversion des formats de modules
      const moduleConversion = this.convertModuleFormat(processedCode);
      if (moduleConversion.converted) {
        processedCode = moduleConversion.code;
        changes.push(...moduleConversion.changes);
      }

      // 3. Extraction et conversion des exports d'objets
      const objectConversion = this.convertObjectExports(processedCode);
      if (objectConversion.converted) {
        processedCode = objectConversion.code;
        changes.push(...objectConversion.changes);
      }

      // 4. Ajouter BaseEffect si nécessaire
      if (this.needsBaseEffect(processedCode)) {
        processedCode = this.baseEffectTemplate + '\n' + processedCode;
        changes.push('Classe BaseEffect ajoutée automatiquement');
      }

      // 4. Corriger les dépendances manquantes
      processedCode = this.fixMissingDependencies(processedCode);
      if (processedCode !== originalCode) {
        changes.push('Dépendances manquantes corrigées');
      }

      // 3. Standardiser la structure de classe
      processedCode = this.standardizeClassStructure(processedCode);
      changes.push('Structure de classe standardisée');

      // 4. Ajouter les méthodes d'export/utilisation
      processedCode = this.addExportMethods(processedCode);
      changes.push('Méthodes d\'export ajoutées');

      // 5. Valider la syntaxe JavaScript
      const validationResult = this.validateJavaScript(processedCode);
      if (!validationResult.isValid) {
        // Tenter une correction automatique
        const corrected = this.autoCorrectSyntax(processedCode);
        if (corrected.isValid) {
          processedCode = corrected.code;
          changes.push('Erreurs de syntaxe corrigées automatiquement');
        } else {
          return {
            processedCode: originalCode,
            changes: [],
            isValid: false,
            error: validationResult.error
          };
        }
      }

      // 6. Optimiser les performances
      processedCode = this.optimizePerformance(processedCode);
      changes.push('Optimisations de performance appliquées');

      return {
        processedCode,
        changes,
        isValid: true
      };

    } catch (error) {
      return {
        processedCode: originalCode,
        changes: [],
        isValid: false,
        error: `Erreur de preprocessing: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Convertit les fichiers de métadonnées en effet JavaScript complet
   */
  private convertMetadataToEffect(code: string, filename: string): { 
    converted: boolean; 
    code: string; 
    changes: string[];
  } {
    const changes: string[] = [];
    
    // Détecter si c'est uniquement des métadonnées (export const avec description template)
    const metadataPattern = /export\s+const\s+(\w+)\s*=\s*{\s*id:\s*["']([^"']+)["'],?\s*name:\s*["']([^"']+)["'],?\s*description:\s*`([^`]+)`\s*}\s*;?\s*$/s;
    const match = metadataPattern.exec(code.trim());
    
    if (match) {
      const [, objectName, effectId, effectName, description] = match;
      
      // Extraire les informations de l'effet depuis la description
      const categoryMatch = description.match(/\*\*CATÉGORIE\s*:\*\*\s*([^\n]+)/i);
      const effectTypeMatch = description.match(/\*\*EFFET DEMANDÉ\s*:\*\*\s*([^\n]+)/i);
      
      const category = categoryMatch ? categoryMatch[1].trim() : 'particules';
      const effectType = effectTypeMatch ? effectTypeMatch[1].trim() : 'AtomicDance';
      
      // Générer une classe d'effet complète basée sur les métadonnées
      const generatedEffect = this.generateEffectFromMetadata(objectName, effectId, effectName, category, effectType, description);
      
      changes.push(`Fichier de métadonnées converti en effet JavaScript complet pour "${effectName}"`);
      changes.push(`Classe ${this.capitalize(effectType)}Effect générée automatiquement`);
      changes.push('Système d\'animation et de rendu ajouté');
      
      return { converted: true, code: generatedEffect, changes };
    }
    
    // Détecter d'autres formats incomplets
    if (code.trim().length < 100 && !code.includes('class') && !code.includes('function')) {
      // Fichier probablement incomplet, générer un effet de base
      const baseName = filename.replace(/\.js$/, '').replace(/[-_]/g, ' ');
      const generatedEffect = this.generateBasicEffect(baseName);
      
      changes.push(`Fichier incomplet détecté, effet de base généré pour "${baseName}"`);
      return { converted: true, code: generatedEffect, changes };
    }
    
    return { converted: false, code, changes: [] };
  }

  /**
   * Génère un effet complet à partir des métadonnées
   */
  private generateEffectFromMetadata(objectName: string, effectId: string, effectName: string, category: string, effectType: string, description: string): string {
    const className = this.capitalize(effectType.replace(/[^a-zA-Z0-9]/g, '')) + 'Effect';
    
    return `${this.baseEffectTemplate}

// Effet généré automatiquement à partir des métadonnées
class ${className} extends BaseEffect {
  constructor(config = {}) {
    super({
      id: '${effectId}',
      name: '${effectName}',
      category: '${category.toLowerCase()}',
      version: '1.0',
      performance: 'medium',
      parameters: {
        taille: { type: 'range', min: 0.5, max: 3, default: 1.2 },
        charge: { type: 'range', min: 1, max: 118, default: 6 },
        vitesse: { type: 'range', min: 0.1, max: 5, default: 1.5 },
        masse: { type: 'range', min: 0.1, max: 3, default: 1 },
        spin: { type: 'range', min: 0, max: 1, default: 0.5 },
        configuration: { type: 'range', min: 0, max: 1, default: 0.7 },
        ...config.parameters
      }
    });
    
    this.particles = [];
    this.nucleus = { x: 0, y: 0, charge: this.parameters.charge.default };
    this.orbits = [];
    this.time = 0;
  }
  
  initialize(canvas, element) {
    super.initialize(canvas, element);
    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
    this.nucleus.x = this.centerX;
    this.nucleus.y = this.centerY;
    
    this.initializeParticles();
    this.initializeOrbits();
  }
  
  initializeParticles() {
    const numElectrons = Math.floor(this.parameters.charge.default);
    this.particles = [];
    
    for (let i = 0; i < numElectrons; i++) {
      this.particles.push({
        type: 'electron',
        charge: -1,
        mass: this.parameters.masse.default,
        orbitRadius: 50 + i * 30,
        angle: (Math.PI * 2 * i) / numElectrons,
        speed: this.parameters.vitesse.default,
        x: 0,
        y: 0,
        spin: this.parameters.spin.default
      });
    }
  }
  
  initializeOrbits() {
    this.orbits = [];
    for (let i = 0; i < 3; i++) {
      this.orbits.push({
        radius: 60 + i * 40,
        opacity: 0.3 - i * 0.1
      });
    }
  }
  
  animate(deltaTime = 16) {
    if (!this.ctx || !this.canvas) return;
    
    this.time += deltaTime * 0.001;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Dessiner les orbites
    this.drawOrbits();
    
    // Dessiner le noyau
    this.drawNucleus();
    
    // Mettre à jour et dessiner les particules
    this.updateParticles(deltaTime);
    this.drawParticles();
    
    // Effets visuels avancés
    this.drawQuantumEffects();
  }
  
  drawOrbits() {
    this.orbits.forEach(orbit => {
      this.ctx.beginPath();
      this.ctx.arc(this.nucleus.x, this.nucleus.y, orbit.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = \`rgba(100, 200, 255, \${orbit.opacity})\`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });
  }
  
  drawNucleus() {
    const radius = 8 * this.parameters.taille.default;
    
    // Gradient radial pour le noyau
    const gradient = this.ctx.createRadialGradient(
      this.nucleus.x, this.nucleus.y, 0,
      this.nucleus.x, this.nucleus.y, radius
    );
    gradient.addColorStop(0, '#ff4444');
    gradient.addColorStop(0.7, '#cc2222');
    gradient.addColorStop(1, '#881111');
    
    this.ctx.beginPath();
    this.ctx.arc(this.nucleus.x, this.nucleus.y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Lueur du noyau
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = '#ff4444';
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }
  
  updateParticles(deltaTime) {
    this.particles.forEach(particle => {
      // Mouvement orbital
      particle.angle += particle.speed * deltaTime * 0.001;
      particle.x = this.nucleus.x + Math.cos(particle.angle) * particle.orbitRadius;
      particle.y = this.nucleus.y + Math.sin(particle.angle) * particle.orbitRadius;
      
      // Oscillation quantique
      const quantumOffset = Math.sin(this.time * 10 + particle.angle) * 5;
      particle.x += quantumOffset;
      particle.y += quantumOffset;
    });
  }
  
  drawParticles() {
    this.particles.forEach(particle => {
      const radius = 4 * this.parameters.taille.default;
      
      // Gradient pour l'électron
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, radius
      );
      gradient.addColorStop(0, '#4488ff');
      gradient.addColorStop(0.7, '#2266cc');
      gradient.addColorStop(1, '#114488');
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      
      // Traînée lumineuse
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, radius * 2, 0, Math.PI * 2);
      this.ctx.fillStyle = \`rgba(68, 136, 255, 0.1)\`;
      this.ctx.fill();
    });
  }
  
  drawQuantumEffects() {
    // Ondulations quantiques
    const numWaves = 5;
    for (let i = 0; i < numWaves; i++) {
      const radius = 100 + i * 50 + Math.sin(this.time * 2 + i) * 10;
      const opacity = 0.05 * Math.sin(this.time + i);
      
      if (opacity > 0) {
        this.ctx.beginPath();
        this.ctx.arc(this.nucleus.x, this.nucleus.y, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = \`rgba(100, 255, 200, \${opacity})\`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
    }
  }
  
  destroy() {
    // Nettoyage
    this.particles = [];
    this.orbits = [];
  }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ${className};
}

// Usage autonome si chargé directement  
if (typeof window !== 'undefined') {
  window.${className} = ${className};
  
  // Fonction utilitaire pour démarrage rapide
  window.start${className} = function(canvasId, config = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error('Canvas non trouvé:', canvasId);
      return null;
    }
    
    const effect = new ${className}(config);
    effect.initialize(canvas, { 
      width: canvas.width, 
      height: canvas.height 
    });
    
    let lastTime = 0;
    const animationLoop = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      effect.animate(deltaTime);
      requestAnimationFrame(animationLoop);
    };
    
    requestAnimationFrame(animationLoop);
    return effect;
  };
}`;
  }

  /**
   * Génère un effet de base pour les fichiers incomplets
   */
  private generateBasicEffect(baseName: string): string {
    const className = this.capitalize(baseName.replace(/[^a-zA-Z0-9]/g, '')) + 'Effect';
    
    return `${this.baseEffectTemplate}

// Effet de base généré automatiquement
class ${className} extends BaseEffect {
  constructor(config = {}) {
    super({
      id: 'effect-' + Date.now(),
      name: '${baseName}',
      category: 'general',
      version: '1.0',
      performance: 'medium',
      parameters: config.parameters || {}
    });
  }
  
  initialize(canvas, element) {
    super.initialize(canvas, element);
    // Initialisation personnalisée ici
  }
  
  animate(deltaTime = 16) {
    if (!this.ctx || !this.canvas) return;
    
    // Animation de base
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Dessiner un effet de base
    const time = Date.now() * 0.001;
    this.ctx.beginPath();
    this.ctx.arc(
      this.canvas.width / 2 + Math.sin(time) * 50,
      this.canvas.height / 2 + Math.cos(time) * 50,
      20,
      0,
      Math.PI * 2
    );
    this.ctx.fillStyle = 'rgba(100, 150, 255, 0.8)';
    this.ctx.fill();
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ${className};
}
if (typeof window !== 'undefined') {
  window.${className} = ${className};
}`;
  }

  /**
   * Capitalize first letter
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Convertit les différents formats de modules en format compatible
   */
  private convertModuleFormat(code: string): { 
    converted: boolean; 
    code: string; 
    changes: string[];
  } {
    const changes: string[] = [];
    let convertedCode = code;
    let hasChanges = false;

    // 1. Conversion des exports ES6
    if (/export\s+(const|let|var|class|function|default)\s+/g.test(code)) {
      // Export par défaut de classe
      convertedCode = convertedCode.replace(
        /export\s+default\s+class\s+(\w+)/g, 
        'class $1'
      );
      
      // Export de classe nommée
      convertedCode = convertedCode.replace(
        /export\s+class\s+(\w+)/g, 
        'class $1'
      );
      
      // Export de fonction
      convertedCode = convertedCode.replace(
        /export\s+function\s+(\w+)/g, 
        'function $1'
      );
      
      // Export de constante/variable
      convertedCode = convertedCode.replace(
        /export\s+(const|let|var)\s+(\w+)/g, 
        '$1 $2'
      );
      
      // Export par défaut d'objet
      convertedCode = convertedCode.replace(
        /export\s+default\s+(\w+)/g, 
        '// Export: $1'
      );
      
      // Export nommé
      convertedCode = convertedCode.replace(
        /export\s*{\s*([^}]+)\s*}/g, 
        '// Export: {$1}'
      );

      hasChanges = true;
      changes.push('Syntaxe ES6 modules convertie');
    }

    // 2. Conversion des imports ES6
    if (/import\s+.*\s+from\s+['"]/g.test(convertedCode)) {
      // Import par défaut
      convertedCode = convertedCode.replace(
        /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g, 
        '// Import: $1 from $2'
      );
      
      // Import nommé
      convertedCode = convertedCode.replace(
        /import\s*{\s*([^}]+)\s*}\s*from\s+['"]([^'"]+)['"]/g, 
        '// Import: {$1} from $2'
      );
      
      // Import namespace
      convertedCode = convertedCode.replace(
        /import\s*\*\s*as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g, 
        '// Import: * as $1 from $2'
      );

      hasChanges = true;
      changes.push('Imports ES6 convertis en commentaires');
    }

    return { converted: hasChanges, code: convertedCode, changes };
  }

  /**
   * Convertit les exports d'objets en classes utilisables
   */
  private convertObjectExports(code: string): {
    converted: boolean;
    code: string;
    changes: string[];
  } {
    const changes: string[] = [];
    let convertedCode = code;
    let hasChanges = false;

    // Recherche des exports d'objets effet
    const objectExportRegex = /export\s+const\s+(\w+)\s*=\s*{([^}]+description:\s*`([^`]+)`[^}]*)}/gs;
    const match = objectExportRegex.exec(code);
    
    if (match) {
      const objectName = match[1];
      const objectContent = match[2];
      const description = match[3];
      
      // Extraction des propriétés importantes
      const idMatch = objectContent.match(/id:\s*["']([^"']+)["']/);
      const nameMatch = objectContent.match(/name:\s*["']([^"']+)["']/);
      const categoryMatch = objectContent.match(/category:\s*["']([^"']+)["']/);
      
      const effectId = idMatch ? idMatch[1] : 'effect-' + Date.now();
      const effectName = nameMatch ? nameMatch[1] : 'Effect';
      const effectCategory = categoryMatch ? categoryMatch[1] : 'general';

      // Recherche de la classe associée
      const classRegex = new RegExp(`class\\s+(\\w*${objectName.replace(/Effect$/, '')}\\w*Effect)\\s+extends\\s+BaseEffect`, 'i');
      const classMatch = classRegex.exec(code);
      
      if (classMatch) {
        const className = classMatch[1];
        
        // Suppression de l'export d'objet
        convertedCode = convertedCode.replace(objectExportRegex, '');
        
        // Mise à jour du constructor de la classe avec les bonnes métadonnées
        convertedCode = convertedCode.replace(
          /constructor\s*\(\s*config\s*=\s*{}\s*\)\s*{[\s\S]*?super\s*\(\s*{[\s\S]*?}\s*\);/,
          `constructor(config = {}) {
        super({
            id: '${effectId}',
            name: '${effectName}',
            category: '${effectCategory}',
            version: '1.0',
            performance: 'medium',
            parameters: config.parameters || {
                taille: { type: 'range', min: 0.5, max: 3, default: 1.2 },
                charge: { type: 'range', min: 1, max: 118, default: 6 },
                vitesse: { type: 'range', min: 0.1, max: 5, default: 1.5 },
                masse: { type: 'range', min: 0.1, max: 3, default: 1 },
                spin: { type: 'range', min: 0, max: 1, default: 0.5 },
                configuration: { type: 'range', min: 0, max: 1, default: 0.7 }
            }
        });`
        );

        hasChanges = true;
        changes.push(`Objet ${objectName} converti et intégré dans la classe ${className}`);
      }
    }

    return { converted: hasChanges, code: convertedCode, changes };
  }

  /**
   * Vérifie si le code a besoin de la classe BaseEffect
   */
  private needsBaseEffect(code: string): boolean {
    return code.includes('extends BaseEffect') && !code.includes('class BaseEffect');
  }

  /**
   * Corrige les dépendances manquantes communes
   */
  private fixMissingDependencies(code: string): string {
    let fixed = code;

    // Ajouter Math si utilisé mais non défini
    if (fixed.includes('Math.') && !fixed.includes('const Math')) {
      // Math est global, pas besoin de correction
    }

    // Ajouter requestAnimationFrame si utilisé
    if (fixed.includes('requestAnimationFrame')) {
      fixed = `
// Polyfill pour requestAnimationFrame
const requestAnimationFrame = (callback) => {
  return setTimeout(callback, 1000 / 60);
};

${fixed}`;
    }

    // Ajouter document si utilisé côté serveur
    if (fixed.includes('document.')) {
      fixed = `
// Mock document pour compatibilité serveur
const document = {
  createElement: (tag) => ({
    width: 800, height: 600,
    getContext: () => ({
      clearRect: () => {}, fillStyle: '', strokeStyle: '',
      beginPath: () => {}, moveTo: () => {}, lineTo: () => {},
      arc: () => {}, fill: () => {}, stroke: () => {}
    })
  }),
  getElementById: (id) => null
};

${fixed}`;
    }

    return fixed;
  }

  /**
   * Standardise la structure des classes d'effet
   */
  private standardizeClassStructure(code: string): string {
    // Assurer que la classe a les méthodes essentielles
    let standardized = code;

    // Vérifier et ajouter initialize si manquante
    if (!standardized.includes('initialize(') && standardized.includes('class ')) {
      const classMatch = standardized.match(/class\s+\w+[^{]*{/);
      if (classMatch) {
        const insertPos = standardized.indexOf(classMatch[0]) + classMatch[0].length;
        const initializeMethod = `
  initialize(canvas, element) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.element = element || { width: canvas.width, height: canvas.height };
  }
`;
        standardized = standardized.slice(0, insertPos) + initializeMethod + standardized.slice(insertPos);
      }
    }

    // Vérifier et ajouter animate si manquante
    if (!standardized.includes('animate(') && standardized.includes('class ')) {
      const classMatch = standardized.match(/class\s+\w+[^{]*{/);
      if (classMatch) {
        const insertPos = standardized.indexOf(classMatch[0]) + classMatch[0].length;
        const animateMethod = `
  animate(deltaTime = 16) {
    if (!this.ctx || !this.canvas) return;
    // Animation par défaut
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
`;
        standardized = standardized.slice(0, insertPos) + animateMethod + standardized.slice(insertPos);
      }
    }

    return standardized;
  }

  /**
   * Ajoute les méthodes d'export et d'utilisation
   */
  private addExportMethods(code: string): string {
    // Détecter le nom de la classe principale
    const classMatch = code.match(/class\s+(\w+)/);
    const className = classMatch ? classMatch[1] : 'Effect';

    const exportCode = `

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ${className};
}

// Usage autonome si chargé directement  
if (typeof window !== 'undefined') {
  window.${className} = ${className};
  
  // Fonction utilitaire pour démarrage rapide
  window.start${className} = function(canvasId, config = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error('Canvas non trouvé:', canvasId);
      return null;
    }
    
    const effect = new ${className}(config);
    effect.initialize(canvas, { 
      width: canvas.width, 
      height: canvas.height 
    });
    
    let lastTime = 0;
    const animationLoop = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      effect.animate(deltaTime);
      requestAnimationFrame(animationLoop);
    };
    
    requestAnimationFrame(animationLoop);
    return effect;
  };
}`;

    return code + exportCode;
  }

  /**
   * Valide la syntaxe JavaScript
   */
  private validateJavaScript(code: string): { isValid: boolean; error?: string } {
    try {
      // Préparation du code pour validation
      let validationCode = code;
      
      // Remplacement temporaire des template literals complexes
      validationCode = validationCode.replace(/`[\s\S]*?`/g, '"TEMPLATE_LITERAL"');
      
      // Remplacement temporaire des regex complexes
      validationCode = validationCode.replace(/\/[^\/\n]+\/[gimuy]*/g, '/REGEX/');
      
      // Validation basique avec Function constructor
      new Function(validationCode);
      return { isValid: true };
    } catch (error) {
      // Tentative de validation plus permissive
      try {
        // Suppression des exports/imports résiduels pour la validation
        let permissiveCode = code
          .replace(/export\s+/g, '')
          .replace(/import\s+.*from\s+['"][^'"]+['"];?/g, '')
          .replace(/`[\s\S]*?`/g, '"TEMPLATE"');
        
        new Function(permissiveCode);
        return { isValid: true };
      } catch (secondError) {
        return { 
          isValid: false, 
          error: `Erreur de syntaxe: ${error instanceof Error ? error.message : String(error)}` 
        };
      }
    }
  }

  /**
   * Tente de corriger automatiquement les erreurs de syntaxe courantes
   */
  private autoCorrectSyntax(code: string): { isValid: boolean; code: string } {
    let corrected = code;

    // 1. Nettoyage des exports/imports résiduels
    corrected = corrected.replace(/export\s+(?!class|function|const|let|var)/g, '');
    corrected = corrected.replace(/import\s+.*from\s+['"][^'"]*['"];\s*/g, '');

    // 2. Correction des template literals mal formés
    corrected = corrected.replace(/`([^`]*?)(?:\$\{[^}]*?\}[^`]*?)*`/g, (match, content) => {
      // Simplification des template literals complexes
      return '"' + content.replace(/\$\{[^}]*\}/g, 'INTERPOLATION') + '"';
    });

    // 3. Correction des regex complexes
    corrected = corrected.replace(/\/[^\/\n]*\/[gimuy]*/g, '/REGEX/g');

    // 4. Corriger les points-virgules manquants
    corrected = corrected.replace(/([^;\s}])\s*\n\s*([a-zA-Z])/g, '$1;\n$2');

    // 5. Corriger les accolades manquantes
    const openBraces = (corrected.match(/{/g) || []).length;
    const closeBraces = (corrected.match(/}/g) || []).length;
    if (openBraces > closeBraces) {
      corrected += '\n' + '}'.repeat(openBraces - closeBraces);
    }

    // 6. Corriger les parenthèses manquantes
    const openParens = (corrected.match(/\(/g) || []).length;
    const closeParens = (corrected.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      corrected += ')'.repeat(openParens - closeParens);
    }

    // 7. Correction des erreurs de nommage de méthodes
    corrected = corrected.replace(/reconfigurer Atome\(\)/g, 'reconfigurerAtome()');
    corrected = corrected.replace(/(\w+)\s+(\w+)\(/g, '$1$2('); // espaces dans noms de méthodes

    try {
      // Test de validation avec le code simplifié
      const testCode = corrected.replace(/`[\s\S]*?`/g, '"TEMPLATE"');
      new Function(testCode);
      return { isValid: true, code: corrected };
    } catch (error) {
      // Tentative de récupération plus agressive
      try {
        const aggressiveCorrection = corrected
          .replace(/\/\*[\s\S]*?\*\//g, '') // Suppression des commentaires blocs
          .replace(/\/\/.*$/gm, '') // Suppression des commentaires lignes
          .replace(/^\s*[\r\n]/gm, ''); // Suppression des lignes vides
        
        new Function(aggressiveCorrection);
        return { isValid: true, code: aggressiveCorrection };
      } catch (finalError) {
        return { isValid: false, code: corrected };
      }
    }
  }

  /**
   * Applique des optimisations de performance
   */
  private optimizePerformance(code: string): string {
    let optimized = code;

    // Optimiser les boucles
    optimized = optimized.replace(
      /for\s*\(\s*let\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*([^;]+)\.length\s*;\s*\1\+\+\s*\)/g,
      'for (let $1 = 0, len = $2.length; $1 < len; $1++)'
    );

    // Optimiser les accès répétés au DOM
    if (optimized.includes('document.getElementById')) {
      optimized = `// Cache des éléments DOM pour performance
const domCache = new Map();
const getElementById = (id) => {
  if (!domCache.has(id)) {
    domCache.set(id, document.getElementById(id));
  }
  return domCache.get(id);
};

` + optimized.replace(/document\.getElementById/g, 'getElementById');
    }

    return optimized;
  }
}