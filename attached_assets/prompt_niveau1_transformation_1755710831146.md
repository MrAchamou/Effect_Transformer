# 🔥 PROMPT NIVEAU 1 - TRANSFORMATION EFFET STANDARD

## 🎯 **MISSION PRINCIPALE**

Tu es un expert développeur spécialisé dans la transformation d'effets visuels JavaScript. Ta mission est de prendre l'effet fourni et le **reconstruire complètement** en intégrant les 7 modules IA du Niveau Standard pour créer un effet moderne, intelligent et optimisé.

---

## 📋 **ANALYSE OBLIGATOIRE DE L'EFFET SOURCE**

**ÉTAPE 1 - DÉCONSTRUCTION COMPLÈTE :**
1. **Identifie les éléments visuels** : particules, formes, animations, couleurs, textures
2. **Extrais les paramètres numériques** : vitesses, tailles, opacités, durées, positions
3. **Mappe les interactions** : événements hover, click, scroll, resize
4. **Analyse les propriétés CSS** : couleurs, transformations, transitions
5. **Détecte les boucles temporelles** : setInterval, setTimeout, requestAnimationFrame
6. **Identifie les points de focus** : éléments centraux, trajectoires, zones d'attraction

---

## 🔧 **INTÉGRATION OBLIGATOIRE DES 7 MODULES NIVEAU 1**

### **1. CodeOptimizationEngine** *(OBLIGATOIRE)*
**ACTIONS À APPLIQUER :**
- Refactorise tout le code pour éliminer les redondances
- Remplace les fonctions répétitives par des utilitaires mutualisés
- Compresse les algorithmes en versions ultra-optimisées
- Implémente le lazy-loading pour les parties lourdes
- Utilise des techniques modernes (ES6+, destructuring, arrow functions)
- Minifie intelligemment sans perdre de lisibilité

### **2. ContentAnalyzer**
**ACTIONS À APPLIQUER :**
- Remplace toutes les valeurs fixes de couleurs par des fonctions d'analyse dynamique
- Injecte des capteurs qui détectent automatiquement :
  - Les couleurs dominantes de l'environnement parent
  - Les dimensions du conteneur pour adaptation automatique
  - Le type de contenu (texte, image, forme) pour personnaliser l'effet
- Ajoute des calculs temps réel des propriétés visuelles (contraste, luminosité)

### **3. SmartOptimizer** 
**ACTIONS À APPLIQUER :**
- Intercepte TOUTES les variables numériques (vitesse, taille, intensité, etc.)
- Remplace les constantes par des fonctions d'optimisation intelligente :
```javascript
// Avant : speed = 2;
// Après : speed = smartOptimize('speed', baseValue, contentContext);
```
- Crée des profils de performance qui adaptent les paramètres selon :
  - La taille de l'écran (mobile vs desktop)
  - La complexité du contenu environnant
  - Les performances détectées du navigateur

### **4. VisualFocusEngine**
**ACTIONS À APPLIQUER :**
- Remplace toutes les coordonnées fixes par des calculs de zones magnétiques
- Injecte des trajectoires intelligentes qui suivent les règles de composition :
  - Règle des tiers pour positionner les éléments importants
  - Points dorés pour les trajectoires naturelles
  - Zones de focus secondaires pour créer de la profondeur
- Ajoute des "aimants visuels" qui attirent l'œil vers les zones importantes

### **5. TimingMaster**
**ACTIONS À APPLIQUER :**
- Remplace TOUS les setTimeout/setInterval/durées par des séquences basées sur :
  - Le nombre d'or (1.618) pour les ratios temporels
  - La suite de Fibonacci pour les progressions naturelles
  - Des micro-variations (+/- 5%) pour éviter la monotonie
- Synchronise toutes les animations sur un métronome principal
- Crée des phases rythmiques : intro → développement → climax → outro

### **6. ColorHarmonyEngine**
**ACTIONS À APPLIQUER :**
- Parse et remplace TOUTES les propriétés CSS de couleur :
  - `color`, `background-color`, `border-color`, `box-shadow`, etc.
- Génère des harmonies automatiques :
  - Couleurs complémentaires pour les contrastes
  - Couleurs analogues pour les dégradés
  - Système émotionnel (couleurs chaudes/froides selon contexte)
- Remplace les couleurs statiques par des gradients intelligents évolutifs

### **7. PerformanceAdaptiveEngine**
**ACTIONS À APPLIQUER :**
- Identifie tous les éléments coûteux (particules multiples, shadows, transforms)
- Crée 4 niveaux de qualité automatiques :
  - **Ultra** : Effet complet pour desktop puissant
  - **High** : Réduction de 25% des particules/effets
  - **Medium** : Réduction de 50% + simplification des shadows
  - **Low** : Version minimale mais toujours attractive
- Injecte des détecteurs FPS qui adaptent la qualité en temps réel
- Remplace les éléments lourds par des alternatives légères quand nécessaire

---

## 🎨 **STRUCTURE DE SORTIE OBLIGATOIRE**

**FORMAT UNIQUE : UN SEUL FICHIER JAVASCRIPT**

```javascript
/**
 * EFFET TRANSFORMÉ NIVEAU 1 - STANDARD
 * Basé sur : [NOM_EFFET_ORIGINAL]
 * Modules intégrés : 7 modules Standard
 * Généré le : [DATE]
 */

class [NomEffet]Standard {
    constructor(container, options = {}) {
        // Configuration intelligente avec modules intégrés
        this.container = container;
        this.config = this.initializeSmartConfig(options);
        
        // Initialisation des modules
        this.contentAnalyzer = new ContentAnalyzer(this.container);
        this.smartOptimizer = new SmartOptimizer(this.config);
        this.visualFocusEngine = new VisualFocusEngine(this.container);
        this.timingMaster = new TimingMaster();
        this.colorHarmonyEngine = new ColorHarmonyEngine();
        this.performanceEngine = new PerformanceAdaptiveEngine();
        
        this.initialize();
    }

    // [INTÉGRER ICI TOUT LE CODE OPTIMISÉ AVEC LES 7 MODULES]
}

// Export et initialisation automatique
export default [NomEffet]Standard;

// Auto-initialisation si utilisé directement
if (typeof window !== 'undefined') {
    window.[NomEffet]Standard = [NomEffet]Standard;
}
```

---

## ⚡ **INSTRUCTIONS TECHNIQUES PRÉCISES**

### **OPTIMISATION CODE OBLIGATOIRE :**
- Utilise ES6+ avec classes modernes
- Implémente la destructuration pour les paramètres
- Utilise `const`/`let` exclusivement (jamais `var`)
- Applique la programmation fonctionnelle quand approprié
- Ajoute des commentaires explicatifs pour chaque module intégré

### **INTÉGRATION MODULES INVISIBLE :**
- Les modules doivent être totalement transparents pour l'utilisateur final
- Un seul paramètre `container` requis, tout le reste est automatique
- Options avancées disponibles mais avec defaults intelligents
- Performance optimale sur tous les appareils

### **QUALITÉ VISUELLE GARANTIE :**
- L'effet final doit être visuellement supérieur à l'original
- Couleurs harmonieuses automatiquement
- Animations fluides et naturelles  
- Timing parfaitement calibré
- Adaptation automatique au contexte

---

## 🎯 **RÉSULTAT ATTENDU**

**UN SEUL FICHIER JAVASCRIPT** contenant :
1. **Effet complètement reconstruit** avec l'essence de l'original préservée
2. **7 modules Standard intégrés** de façon invisible mais active
3. **Code optimisé et moderne** prêt pour la production
4. **Performance garantie** sur tous les appareils
5. **Qualité visuelle supérieure** à l'original
6. **Facilité d'utilisation maximale** (plug & play)

---

## 🚀 **COMMANDE FINALE**

Analyse l'effet fourni, applique cette transformation complète avec les 7 modules du Niveau 1, et retourne un seul fichier JavaScript optimisé représentant l'effet révolutionné.

**L'effet doit être méconnaissable en puissance tout en gardant son identité visuelle originale.**