
/**
 * 🧠 MODULE D'APPRENTISSAGE COMPORTEMENTAL 2.0
 * 
 * Intelligence artificielle autonome pour l'apprentissage des patterns utilisateur
 * - Réseaux de neurones légers intégrés (zéro dépendance)
 * - Apprentissage en temps réel des préférences
 * - Prédiction comportementale avancée
 * - Auto-optimisation continue
 * - Performance ultra-haute avec cache neural
 * 
 * @version 2.0.0
 * @autonomous true
 * @dependencies none
 * @intelligence_level advanced
 */

interface BehavioralPattern {
  id: string;
  type: 'preference' | 'interaction' | 'timing' | 'choice' | 'navigation';
  frequency: number;
  confidence: number;
  context: Record<string, any>;
  timestamp: number;
  success_rate: number;
  impact_score: number;
}

interface UserProfile {
  user_id: string;
  preferences: Map<string, number>;
  behavioral_patterns: BehavioralPattern[];
  interaction_history: Array<{
    action: string;
    timestamp: number;
    context: any;
    outcome: 'positive' | 'negative' | 'neutral';
  }>;
  learning_metadata: {
    sessions_count: number;
    total_interactions: number;
    accuracy_score: number;
    last_updated: number;
  };
}

interface NeuralNetwork {
  weights: number[][];
  biases: number[];
  activation_function: 'sigmoid' | 'relu' | 'tanh';
  learning_rate: number;
  accuracy: number;
}

interface PredictionResult {
  predicted_action: string;
  confidence: number;
  alternatives: Array<{
    action: string;
    probability: number;
  }>;
  reasoning: string[];
  execution_time: number;
}

export class BehavioralLearningModule {
  private isActive: boolean = false;
  private userProfiles: Map<string, UserProfile> = new Map();
  private globalPatterns: Map<string, BehavioralPattern> = new Map();
  private neuralNetwork: NeuralNetwork;
  private learningCache: Map<string, any> = new Map();
  private autonomousMode: boolean = true;
  private performanceMetrics: Map<string, number> = new Map();
  
  // Configuration de l'apprentissage
  private readonly learningConfig = {
    max_patterns_per_user: 1000,
    pattern_decay_rate: 0.001,
    confidence_threshold: 0.7,
    learning_rate: 0.01,
    network_update_interval: 100, // interactions
    cache_ttl: 300000, // 5 minutes
    min_pattern_frequency: 3
  };

  // Banque de patterns comportementaux communs
  private readonly commonBehavioralPatterns = {
    ui_preferences: [
      'prefers_dark_mode',
      'prefers_animations',
      'prefers_minimal_interface',
      'prefers_detailed_feedback',
      'prefers_fast_transitions'
    ],
    interaction_styles: [
      'click_heavy_user',
      'keyboard_navigator',
      'touch_user',
      'precision_user',
      'quick_browser'
    ],
    content_preferences: [
      'visual_learner',
      'text_focused',
      'example_driven',
      'exploration_oriented',
      'efficiency_focused'
    ],
    timing_patterns: [
      'morning_user',
      'evening_user',
      'weekend_user',
      'quick_session',
      'extended_session'
    ]
  };

  constructor(config: Partial<typeof BehavioralLearningModule.prototype.learningConfig> = {}) {
    this.learningConfig = { ...this.learningConfig, ...config };
    this.initializeNeuralNetwork();
    this.setupPerformanceTracking();
    this.activate();
  }

  /**
   * 🧠 Initialisation du réseau de neurones léger
   */
  private initializeNeuralNetwork(): void {
    // Architecture simple mais efficace: 10 inputs -> 6 hidden -> 3 outputs
    this.neuralNetwork = {
      weights: [
        // Couche input vers hidden (10x6)
        Array(6).fill(0).map(() => Array(10).fill(0).map(() => Math.random() * 2 - 1)),
        // Couche hidden vers output (6x3)
        Array(3).fill(0).map(() => Array(6).fill(0).map(() => Math.random() * 2 - 1))
      ],
      biases: [
        Array(6).fill(0).map(() => Math.random() * 2 - 1), // Hidden layer
        Array(3).fill(0).map(() => Math.random() * 2 - 1)  // Output layer
      ],
      activation_function: 'relu',
      learning_rate: this.learningConfig.learning_rate,
      accuracy: 0.5
    };

    console.log('🧠 Réseau de neurones comportemental initialisé');
  }

  /**
   * 📊 Configuration du suivi des performances
   */
  private setupPerformanceTracking(): void {
    this.performanceMetrics.set('predictions_made', 0);
    this.performanceMetrics.set('accurate_predictions', 0);
    this.performanceMetrics.set('learning_iterations', 0);
    this.performanceMetrics.set('cache_hits', 0);
    this.performanceMetrics.set('processing_time_avg', 0);
    this.performanceMetrics.set('neural_network_updates', 0);
  }

  /**
   * 📝 Enregistrement d'une interaction utilisateur
   */
  public recordInteraction(
    userId: string,
    interaction: {
      action: string;
      context: Record<string, any>;
      timestamp?: number;
      outcome?: 'positive' | 'negative' | 'neutral';
    }
  ): void {
    if (!this.isActive) return;

    const startTime = performance.now();

    // Obtenir ou créer le profil utilisateur
    let profile = this.userProfiles.get(userId);
    if (!profile) {
      profile = this.createUserProfile(userId);
      this.userProfiles.set(userId, profile);
    }

    // Enregistrer l'interaction
    const interactionRecord = {
      action: interaction.action,
      timestamp: interaction.timestamp || Date.now(),
      context: interaction.context,
      outcome: interaction.outcome || 'neutral'
    };

    profile.interaction_history.push(interactionRecord);

    // Maintenir la taille de l'historique
    if (profile.interaction_history.length > 500) {
      profile.interaction_history.shift();
    }

    // Analyser et extraire des patterns
    this.extractBehavioralPatterns(profile, interactionRecord);

    // Mise à jour des métadonnées
    profile.learning_metadata.total_interactions++;
    profile.learning_metadata.last_updated = Date.now();

    // Apprentissage autonome si activé
    if (this.autonomousMode) {
      this.performAutonomousLearning(profile);
    }

    // Métriques de performance
    const executionTime = performance.now() - startTime;
    this.updatePerformanceMetrics('interaction_processing', executionTime);

    console.log(`📝 Interaction enregistrée pour ${userId}: ${interaction.action}`);
  }

  /**
   * 👤 Création d'un nouveau profil utilisateur
   */
  private createUserProfile(userId: string): UserProfile {
    return {
      user_id: userId,
      preferences: new Map(),
      behavioral_patterns: [],
      interaction_history: [],
      learning_metadata: {
        sessions_count: 1,
        total_interactions: 0,
        accuracy_score: 0.5,
        last_updated: Date.now()
      }
    };
  }

  /**
   * 🔍 Extraction de patterns comportementaux
   */
  private extractBehavioralPatterns(profile: UserProfile, interaction: any): void {
    // Analyse de fréquence d'actions
    this.analyzeActionFrequency(profile, interaction);
    
    // Analyse de timing
    this.analyzeTimingPatterns(profile, interaction);
    
    // Analyse de contexte
    this.analyzeContextualPatterns(profile, interaction);
    
    // Analyse de séquences
    this.analyzeSequencePatterns(profile, interaction);
  }

  /**
   * 📈 Analyse de fréquence des actions
   */
  private analyzeActionFrequency(profile: UserProfile, interaction: any): void {
    const actionType = interaction.action;
    let pattern = profile.behavioral_patterns.find(p => 
      p.type === 'interaction' && p.context.action === actionType
    );

    if (pattern) {
      pattern.frequency++;
      pattern.confidence = Math.min(1.0, pattern.confidence + 0.05);
      pattern.timestamp = Date.now();
    } else {
      pattern = {
        id: `freq_${actionType}_${Date.now()}`,
        type: 'interaction',
        frequency: 1,
        confidence: 0.1,
        context: { action: actionType },
        timestamp: Date.now(),
        success_rate: 0.5,
        impact_score: this.calculateImpactScore(interaction)
      };
      profile.behavioral_patterns.push(pattern);
    }

    // Mise à jour des préférences
    const currentPreference = profile.preferences.get(actionType) || 0;
    profile.preferences.set(actionType, currentPreference + 0.1);
  }

  /**
   * ⏰ Analyse des patterns temporels
   */
  private analyzeTimingPatterns(profile: UserProfile, interaction: any): void {
    const hour = new Date(interaction.timestamp).getHours();
    const dayOfWeek = new Date(interaction.timestamp).getDay();
    
    // Pattern horaire
    const hourPattern = this.getOrCreatePattern(
      profile, 
      'timing', 
      { hour_range: this.getHourRange(hour) }
    );
    hourPattern.frequency++;
    
    // Pattern jour de semaine
    const dayPattern = this.getOrCreatePattern(
      profile, 
      'timing', 
      { day_type: dayOfWeek >= 5 ? 'weekend' : 'weekday' }
    );
    dayPattern.frequency++;
  }

  /**
   * 🎯 Analyse des patterns contextuels
   */
  private analyzeContextualPatterns(profile: UserProfile, interaction: any): void {
    for (const [contextKey, contextValue] of Object.entries(interaction.context)) {
      if (typeof contextValue === 'string' || typeof contextValue === 'number') {
        const pattern = this.getOrCreatePattern(
          profile,
          'preference',
          { context_key: contextKey, context_value: contextValue }
        );
        pattern.frequency++;
        pattern.confidence = Math.min(1.0, pattern.confidence + 0.03);
      }
    }
  }

  /**
   * 🔗 Analyse des patterns de séquence
   */
  private analyzeSequencePatterns(profile: UserProfile, interaction: any): void {
    if (profile.interaction_history.length >= 2) {
      const previousAction = profile.interaction_history[profile.interaction_history.length - 2].action;
      const currentAction = interaction.action;
      
      const sequencePattern = this.getOrCreatePattern(
        profile,
        'choice',
        { sequence: `${previousAction}->${currentAction}` }
      );
      sequencePattern.frequency++;
      sequencePattern.confidence = Math.min(1.0, sequencePattern.confidence + 0.1);
    }
  }

  /**
   * 🔍 Obtention ou création d'un pattern
   */
  private getOrCreatePattern(
    profile: UserProfile, 
    type: BehavioralPattern['type'], 
    context: Record<string, any>
  ): BehavioralPattern {
    const contextKey = JSON.stringify(context);
    let pattern = profile.behavioral_patterns.find(p => 
      p.type === type && JSON.stringify(p.context) === contextKey
    );

    if (!pattern) {
      pattern = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        frequency: 0,
        confidence: 0.1,
        context,
        timestamp: Date.now(),
        success_rate: 0.5,
        impact_score: 0.5
      };
      profile.behavioral_patterns.push(pattern);
    }

    return pattern;
  }

  /**
   * ⚡ Apprentissage autonome
   */
  private performAutonomousLearning(profile: UserProfile): void {
    // Nettoyage des patterns obsolètes
    this.cleanupObsoletePatterns(profile);
    
    // Mise à jour du réseau de neurones
    if (profile.learning_metadata.total_interactions % this.learningConfig.network_update_interval === 0) {
      this.updateNeuralNetwork(profile);
    }

    // Calcul du score de précision
    this.calculateAccuracyScore(profile);
  }

  /**
   * 🧹 Nettoyage des patterns obsolètes
   */
  private cleanupObsoletePatterns(profile: UserProfile): void {
    const now = Date.now();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 jours

    profile.behavioral_patterns = profile.behavioral_patterns.filter(pattern => {
      // Supprimer les patterns trop vieux et peu fréquents
      if (now - pattern.timestamp > maxAge && pattern.frequency < this.learningConfig.min_pattern_frequency) {
        return false;
      }

      // Décroissance naturelle de la confiance
      pattern.confidence *= (1 - this.learningConfig.pattern_decay_rate);
      return pattern.confidence > 0.05;
    });

    // Limiter le nombre de patterns
    if (profile.behavioral_patterns.length > this.learningConfig.max_patterns_per_user) {
      profile.behavioral_patterns = profile.behavioral_patterns
        .sort((a, b) => (b.confidence * b.frequency) - (a.confidence * a.frequency))
        .slice(0, this.learningConfig.max_patterns_per_user);
    }
  }

  /**
   * 🧠 Mise à jour du réseau de neurones
   */
  private updateNeuralNetwork(profile: UserProfile): void {
    const trainingData = this.prepareTrainingData(profile);
    
    if (trainingData.length < 10) return; // Pas assez de données

    for (const data of trainingData) {
      const prediction = this.feedForward(data.input);
      this.backpropagate(data.input, data.expected, prediction);
    }

    this.performanceMetrics.set('neural_network_updates', 
      (this.performanceMetrics.get('neural_network_updates') || 0) + 1
    );

    console.log('🧠 Réseau de neurones mis à jour');
  }

  /**
   * 📚 Préparation des données d'entraînement
   */
  private prepareTrainingData(profile: UserProfile): Array<{
    input: number[];
    expected: number[];
  }> {
    const trainingData: Array<{ input: number[]; expected: number[] }> = [];
    
    const interactions = profile.interaction_history.slice(-50); // 50 dernières
    
    for (let i = 1; i < interactions.length; i++) {
      const current = interactions[i];
      const previous = interactions[i - 1];
      
      // Input: contexte précédent normalisé (10 dimensions)
      const input = [
        this.normalizeValue(new Date(previous.timestamp).getHours(), 0, 23),
        this.normalizeValue(new Date(previous.timestamp).getDay(), 0, 6),
        this.encodeAction(previous.action),
        this.encodeOutcome(previous.outcome),
        this.normalizeValue(Object.keys(previous.context).length, 0, 10),
        Math.random(), // Noise pour robustesse
        this.normalizeValue(i, 0, interactions.length),
        profile.preferences.get(previous.action) || 0,
        profile.behavioral_patterns.filter(p => p.context.action === previous.action).length / 10,
        this.calculateContextSimilarity(previous.context, current.context)
      ];

      // Output attendu: action suivante (3 classes)
      const expected = [
        current.action === previous.action ? 1 : 0, // Répétition
        this.isNewAction(current.action, interactions.slice(0, i)) ? 1 : 0, // Exploration
        current.outcome === 'positive' ? 1 : 0 // Succès
      ];

      trainingData.push({ input, expected });
    }

    return trainingData;
  }

  /**
   * ➡️ Propagation avant dans le réseau
   */
  private feedForward(input: number[]): number[] {
    let activation = input;

    for (let layer = 0; layer < this.neuralNetwork.weights.length; layer++) {
      const newActivation: number[] = [];
      
      for (let j = 0; j < this.neuralNetwork.weights[layer].length; j++) {
        let sum = this.neuralNetwork.biases[layer][j];
        
        for (let k = 0; k < activation.length; k++) {
          sum += activation[k] * this.neuralNetwork.weights[layer][j][k];
        }
        
        newActivation.push(this.activationFunction(sum));
      }
      
      activation = newActivation;
    }

    return activation;
  }

  /**
   * ⬅️ Rétropropagation pour l'apprentissage
   */
  private backpropagate(input: number[], expected: number[], predicted: number[]): void {
    // Calcul de l'erreur de sortie
    const outputError: number[] = [];
    for (let i = 0; i < expected.length; i++) {
      outputError.push(expected[i] - predicted[i]);
    }

    // Mise à jour simplifiée des poids (gradient descent basique)
    const lr = this.neuralNetwork.learning_rate;
    
    // Mise à jour couche de sortie
    for (let i = 0; i < this.neuralNetwork.weights[1].length; i++) {
      for (let j = 0; j < this.neuralNetwork.weights[1][i].length; j++) {
        this.neuralNetwork.weights[1][i][j] += lr * outputError[i] * predicted[j];
      }
      this.neuralNetwork.biases[1][i] += lr * outputError[i];
    }

    this.performanceMetrics.set('learning_iterations',
      (this.performanceMetrics.get('learning_iterations') || 0) + 1
    );
  }

  /**
   * 🎯 Fonction d'activation
   */
  private activationFunction(x: number): number {
    switch (this.neuralNetwork.activation_function) {
      case 'sigmoid':
        return 1 / (1 + Math.exp(-x));
      case 'relu':
        return Math.max(0, x);
      case 'tanh':
        return Math.tanh(x);
      default:
        return Math.max(0, x); // ReLU par défaut
    }
  }

  /**
   * 🔮 MÉTHODE PRINCIPALE - Prédiction comportementale
   */
  public async predictBehavior(
    userId: string,
    context: Record<string, any> = {}
  ): Promise<PredictionResult> {
    if (!this.isActive) {
      throw new Error('Module d\'apprentissage comportemental non actif');
    }

    const startTime = performance.now();
    
    // Vérification du cache
    const cacheKey = `${userId}_${JSON.stringify(context)}`;
    if (this.learningCache.has(cacheKey)) {
      const cached = this.learningCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.learningConfig.cache_ttl) {
        this.performanceMetrics.set('cache_hits',
          (this.performanceMetrics.get('cache_hits') || 0) + 1
        );
        return cached.result;
      }
    }

    const profile = this.userProfiles.get(userId);
    if (!profile) {
      // Prédiction basique pour nouvel utilisateur
      return this.generateBasicPrediction(context);
    }

    // Préparation des données d'entrée
    const inputVector = this.contextToVector(context, profile);
    
    // Prédiction par réseau de neurones
    const neuralPrediction = this.feedForward(inputVector);
    
    // Analyse des patterns comportementaux
    const patternPredictions = this.analyzePatternMatches(profile, context);
    
    // Combinaison des prédictions
    const finalPrediction = this.combinePredictions(neuralPrediction, patternPredictions, profile);
    
    // Génération des alternatives
    const alternatives = this.generateAlternatives(finalPrediction, profile, context);
    
    // Construction du résultat
    const executionTime = performance.now() - startTime;
    const result: PredictionResult = {
      predicted_action: finalPrediction.action,
      confidence: finalPrediction.confidence,
      alternatives: alternatives,
      reasoning: finalPrediction.reasoning,
      execution_time: executionTime
    };

    // Mise en cache
    this.learningCache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });

    // Métriques
    this.performanceMetrics.set('predictions_made',
      (this.performanceMetrics.get('predictions_made') || 0) + 1
    );
    this.updatePerformanceMetrics('prediction_processing', executionTime);

    console.log(`🔮 Prédiction générée pour ${userId}: ${result.predicted_action} (${(result.confidence * 100).toFixed(1)}%)`);

    return result;
  }

  /**
   * 🎯 Conversion du contexte en vecteur d'entrée
   */
  private contextToVector(context: Record<string, any>, profile: UserProfile): number[] {
    const vector: number[] = [];
    
    // Dimension 1-2: Timing
    const now = new Date();
    vector.push(this.normalizeValue(now.getHours(), 0, 23));
    vector.push(this.normalizeValue(now.getDay(), 0, 6));
    
    // Dimension 3: Action récente
    const lastAction = profile.interaction_history[profile.interaction_history.length - 1]?.action || '';
    vector.push(this.encodeAction(lastAction));
    
    // Dimension 4: Historique de succès
    const recentOutcomes = profile.interaction_history.slice(-10);
    const successRate = recentOutcomes.filter(i => i.outcome === 'positive').length / Math.max(recentOutcomes.length, 1);
    vector.push(successRate);
    
    // Dimension 5-7: Contexte actuel
    vector.push(this.normalizeValue(Object.keys(context).length, 0, 10));
    vector.push(context.complexity ? this.normalizeValue(context.complexity, 0, 100) : 0.5);
    vector.push(context.priority ? this.normalizeValue(context.priority, 0, 10) : 0.5);
    
    // Dimension 8-9: Profil utilisateur
    vector.push(this.normalizeValue(profile.learning_metadata.total_interactions, 0, 1000));
    vector.push(profile.learning_metadata.accuracy_score);
    
    // Dimension 10: Similarité avec patterns existants
    vector.push(this.calculatePatternSimilarity(context, profile));
    
    return vector;
  }

  /**
   * 🔍 Analyse des correspondances de patterns
   */
  private analyzePatternMatches(profile: UserProfile, context: Record<string, any>): Array<{
    action: string;
    confidence: number;
    pattern: BehavioralPattern;
  }> {
    const matches: Array<{
      action: string;
      confidence: number;
      pattern: BehavioralPattern;
    }> = [];

    for (const pattern of profile.behavioral_patterns) {
      if (pattern.confidence < this.learningConfig.confidence_threshold) continue;
      
      const similarity = this.calculateContextSimilarity(pattern.context, context);
      if (similarity > 0.5) {
        const action = this.extractActionFromPattern(pattern);
        if (action) {
          matches.push({
            action,
            confidence: pattern.confidence * similarity,
            pattern
          });
        }
      }
    }

    // Tri par confiance
    return matches.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  /**
   * 🔀 Combinaison des prédictions
   */
  private combinePredictions(
    neuralPrediction: number[], 
    patternPredictions: any[], 
    profile: UserProfile
  ): {
    action: string;
    confidence: number;
    reasoning: string[];
  } {
    const reasoning: string[] = [];
    
    // Analyse de la prédiction neuronale
    const neuralAction = this.interpretNeuralOutput(neuralPrediction);
    const neuralConfidence = Math.max(...neuralPrediction);
    reasoning.push(`Réseau de neurones suggère: ${neuralAction} (${(neuralConfidence * 100).toFixed(1)}%)`);
    
    // Meilleure prédiction par patterns
    const bestPattern = patternPredictions[0];
    if (bestPattern) {
      reasoning.push(`Pattern comportemental: ${bestPattern.action} (${(bestPattern.confidence * 100).toFixed(1)}%)`);
    }

    // Logique de combinaison
    let finalAction: string;
    let finalConfidence: number;

    if (bestPattern && bestPattern.confidence > neuralConfidence) {
      finalAction = bestPattern.action;
      finalConfidence = bestPattern.confidence;
      reasoning.push('Décision: Pattern comportemental prioritaire');
    } else {
      finalAction = neuralAction;
      finalConfidence = neuralConfidence;
      reasoning.push('Décision: Réseau de neurones prioritaire');
    }

    // Ajustement selon l'expérience utilisateur
    if (profile.learning_metadata.accuracy_score > 0.8) {
      finalConfidence *= 1.1; // Boost pour utilisateurs bien appris
      reasoning.push('Bonus confiance: Profil bien appris');
    }

    return {
      action: finalAction,
      confidence: Math.min(1.0, finalConfidence),
      reasoning
    };
  }

  /**
   * 🎯 Génération d'alternatives
   */
  private generateAlternatives(
    prediction: any, 
    profile: UserProfile, 
    context: Record<string, any>
  ): Array<{
    action: string;
    probability: number;
  }> {
    const alternatives: Array<{ action: string; probability: number }> = [];
    
    // Alternatives basées sur les préférences
    const sortedPreferences = Array.from(profile.preferences.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    for (const [action, preference] of sortedPreferences) {
      if (action !== prediction.action) {
        alternatives.push({
          action,
          probability: preference * 0.8
        });
      }
    }

    // Alternatives exploratoires
    const exploratoryActions = this.generateExploratoryActions(context);
    for (const action of exploratoryActions.slice(0, 2)) {
      alternatives.push({
        action,
        probability: 0.3 + Math.random() * 0.2
      });
    }

    return alternatives
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);
  }

  /**
   * 🔍 Actions exploratoires
   */
  private generateExploratoryActions(context: Record<string, any>): string[] {
    const actions: string[] = [];
    
    // Actions basées sur le contexte
    if (context.type === 'effect') {
      actions.push('modify_parameters', 'try_variation', 'save_favorite');
    }
    
    if (context.complexity && context.complexity > 5) {
      actions.push('simplify', 'get_help', 'use_template');
    }

    // Actions génériques utiles
    actions.push('preview', 'compare', 'share', 'bookmark');
    
    return [...new Set(actions)]; // Dédoublonnage
  }

  /**
   * 🎯 Prédiction basique pour nouveaux utilisateurs
   */
  private generateBasicPrediction(context: Record<string, any>): PredictionResult {
    const commonActions = ['preview', 'modify', 'save', 'share'];
    const action = commonActions[Math.floor(Math.random() * commonActions.length)];
    
    return {
      predicted_action: action,
      confidence: 0.4,
      alternatives: commonActions
        .filter(a => a !== action)
        .map(a => ({ action: a, probability: 0.25 + Math.random() * 0.2 })),
      reasoning: ['Utilisateur nouveau: prédiction basique'],
      execution_time: 1.0
    };
  }

  /**
   * 📊 Validation d'une prédiction
   */
  public validatePrediction(
    userId: string,
    predictedAction: string,
    actualAction: string,
    outcome: 'positive' | 'negative' | 'neutral'
  ): void {
    const profile = this.userProfiles.get(userId);
    if (!profile) return;

    // Mise à jour de la précision
    const wasAccurate = predictedAction === actualAction;
    if (wasAccurate) {
      this.performanceMetrics.set('accurate_predictions',
        (this.performanceMetrics.get('accurate_predictions') || 0) + 1
      );
    }

    // Mise à jour du score de précision du profil
    const currentAccuracy = profile.learning_metadata.accuracy_score;
    const newAccuracy = currentAccuracy * 0.9 + (wasAccurate ? 0.1 : 0);
    profile.learning_metadata.accuracy_score = newAccuracy;

    // Renforcement des patterns réussis
    if (wasAccurate && outcome === 'positive') {
      this.reinforceSuccessfulPatterns(profile, actualAction);
    }

    console.log(`📊 Validation: ${wasAccurate ? '✅' : '❌'} ${predictedAction} -> ${actualAction}`);
  }

  /**
   * 💪 Renforcement des patterns réussis
   */
  private reinforceSuccessfulPatterns(profile: UserProfile, action: string): void {
    for (const pattern of profile.behavioral_patterns) {
      if (pattern.context.action === action || 
          pattern.context.sequence?.includes(action)) {
        pattern.success_rate = Math.min(1.0, pattern.success_rate + 0.1);
        pattern.confidence = Math.min(1.0, pattern.confidence + 0.05);
      }
    }
  }

  // ===== MÉTHODES UTILITAIRES =====

  /**
   * 📏 Normalisation de valeur
   */
  private normalizeValue(value: number, min: number, max: number): number {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }

  /**
   * 🔤 Encodage d'action en nombre
   */
  private encodeAction(action: string): number {
    const hash = action.split('').reduce((hash, char) => {
      return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff;
    }, 0);
    return Math.abs(hash) / 0xffffffff;
  }

  /**
   * 📈 Encodage de résultat
   */
  private encodeOutcome(outcome: string): number {
    switch (outcome) {
      case 'positive': return 1.0;
      case 'negative': return 0.0;
      case 'neutral': return 0.5;
      default: return 0.5;
    }
  }

  /**
   * 🎲 Calcul du score d'impact
   */
  private calculateImpactScore(interaction: any): number {
    let score = 0.5;
    
    if (interaction.outcome === 'positive') score += 0.3;
    if (interaction.context.priority > 5) score += 0.2;
    if (interaction.context.duration > 1000) score += 0.1;
    
    return Math.min(1.0, score);
  }

  /**
   * 🕐 Obtention de la tranche horaire
   */
  private getHourRange(hour: number): string {
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  /**
   * 🔍 Similarité contextuelle
   */
  private calculateContextSimilarity(context1: Record<string, any>, context2: Record<string, any>): number {
    const keys1 = Object.keys(context1);
    const keys2 = Object.keys(context2);
    const allKeys = [...new Set([...keys1, ...keys2])];
    
    if (allKeys.length === 0) return 1.0;
    
    let matches = 0;
    for (const key of allKeys) {
      if (context1[key] === context2[key]) {
        matches++;
      }
    }
    
    return matches / allKeys.length;
  }

  /**
   * 🎯 Similarité avec patterns
   */
  private calculatePatternSimilarity(context: Record<string, any>, profile: UserProfile): number {
    if (profile.behavioral_patterns.length === 0) return 0.5;
    
    const similarities = profile.behavioral_patterns.map(pattern =>
      this.calculateContextSimilarity(pattern.context, context)
    );
    
    return similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;
  }

  /**
   * ⚗️ Extraction d'action depuis pattern
   */
  private extractActionFromPattern(pattern: BehavioralPattern): string | null {
    if (pattern.context.action) return pattern.context.action;
    if (pattern.context.sequence) {
      const parts = pattern.context.sequence.split('->');
      return parts[parts.length - 1];
    }
    return null;
  }

  /**
   * 🧠 Interprétation de sortie neuronale
   */
  private interpretNeuralOutput(output: number[]): string {
    const maxIndex = output.indexOf(Math.max(...output));
    const actions = ['repeat_action', 'explore_new', 'optimize_current'];
    return actions[maxIndex] || 'preview';
  }

  /**
   * 🆕 Vérification si action nouvelle
   */
  private isNewAction(action: string, previousInteractions: any[]): boolean {
    return !previousInteractions.some(interaction => interaction.action === action);
  }

  /**
   * 📊 Calcul du score de précision
   */
  private calculateAccuracyScore(profile: UserProfile): void {
    const recentInteractions = profile.interaction_history.slice(-20);
    if (recentInteractions.length < 5) return;

    const positiveOutcomes = recentInteractions.filter(i => i.outcome === 'positive').length;
    const accuracy = positiveOutcomes / recentInteractions.length;
    
    profile.learning_metadata.accuracy_score = (profile.learning_metadata.accuracy_score + accuracy) / 2;
  }

  /**
   * ⚡ Mise à jour des métriques de performance
   */
  private updatePerformanceMetrics(operation: string, executionTime: number): void {
    const currentAvg = this.performanceMetrics.get('processing_time_avg') || 0;
    const newAvg = (currentAvg + executionTime) / 2;
    this.performanceMetrics.set('processing_time_avg', newAvg);
  }

  // ===== MÉTHODES PUBLIQUES DE GESTION =====

  /**
   * 📊 Obtention des statistiques d'apprentissage
   */
  public getLearningStats(userId?: string): {
    global_stats: Record<string, number>;
    user_stats?: {
      total_interactions: number;
      behavioral_patterns: number;
      accuracy_score: number;
      top_preferences: Array<{action: string; score: number}>;
    };
    neural_network_stats: {
      accuracy: number;
      updates: number;
      learning_rate: number;
    };
  } {
    const globalStats = Object.fromEntries(this.performanceMetrics);
    
    // Calcul de la précision globale
    const totalPredictions = globalStats.predictions_made || 1;
    const accuratePredictions = globalStats.accurate_predictions || 0;
    globalStats.global_accuracy = accuratePredictions / totalPredictions;

    const result: any = {
      global_stats: globalStats,
      neural_network_stats: {
        accuracy: this.neuralNetwork.accuracy,
        updates: globalStats.neural_network_updates || 0,
        learning_rate: this.neuralNetwork.learning_rate
      }
    };

    if (userId) {
      const profile = this.userProfiles.get(userId);
      if (profile) {
        const topPreferences = Array.from(profile.preferences.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([action, score]) => ({ action, score }));

        result.user_stats = {
          total_interactions: profile.learning_metadata.total_interactions,
          behavioral_patterns: profile.behavioral_patterns.length,
          accuracy_score: profile.learning_metadata.accuracy_score,
          top_preferences: topPreferences
        };
      }
    }

    return result;
  }

  /**
   * 🎯 Configuration du profil d'apprentissage
   */
  public configureLearning(config: Partial<typeof BehavioralLearningModule.prototype.learningConfig>): void {
    this.learningConfig = { ...this.learningConfig, ...config };
    
    if (config.learning_rate) {
      this.neuralNetwork.learning_rate = config.learning_rate;
    }

    console.log('🎯 Configuration d\'apprentissage mise à jour');
  }

  /**
   * 🔄 Réinitialisation d'un profil utilisateur
   */
  public resetUserProfile(userId: string): void {
    if (this.userProfiles.has(userId)) {
      this.userProfiles.delete(userId);
      console.log(`🔄 Profil utilisateur ${userId} réinitialisé`);
    }
  }

  /**
   * 💾 Export des données d'apprentissage
   */
  public exportLearningData(userId?: string): string {
    const data: any = {
      neural_network: this.neuralNetwork,
      global_patterns: Object.fromEntries(this.globalPatterns),
      performance_metrics: Object.fromEntries(this.performanceMetrics),
      export_timestamp: Date.now()
    };

    if (userId) {
      const profile = this.userProfiles.get(userId);
      if (profile) {
        data.user_profile = {
          ...profile,
          preferences: Object.fromEntries(profile.preferences)
        };
      }
    } else {
      data.all_user_profiles = Array.from(this.userProfiles.entries()).map(([id, profile]) => ({
        user_id: id,
        ...profile,
        preferences: Object.fromEntries(profile.preferences)
      }));
    }

    return JSON.stringify(data, null, 2);
  }

  /**
   * 📥 Import des données d'apprentissage
   */
  public importLearningData(dataJson: string): void {
    try {
      const data = JSON.parse(dataJson);
      
      if (data.neural_network) {
        this.neuralNetwork = { ...this.neuralNetwork, ...data.neural_network };
      }
      
      if (data.global_patterns) {
        this.globalPatterns = new Map(Object.entries(data.global_patterns));
      }
      
      if (data.user_profile) {
        const profile = data.user_profile;
        profile.preferences = new Map(Object.entries(profile.preferences));
        this.userProfiles.set(profile.user_id, profile);
      }
      
      if (data.all_user_profiles) {
        for (const profile of data.all_user_profiles) {
          profile.preferences = new Map(Object.entries(profile.preferences));
          this.userProfiles.set(profile.user_id, profile);
        }
      }

      console.log('📥 Données d\'apprentissage importées avec succès');
    } catch (error) {
      console.error('❌ Erreur import données:', error);
    }
  }

  /**
   * 🧹 Nettoyage et optimisation
   */
  public cleanup(): void {
    // Nettoyage du cache
    const now = Date.now();
    for (const [key, value] of this.learningCache.entries()) {
      if (now - value.timestamp > this.learningConfig.cache_ttl) {
        this.learningCache.delete(key);
      }
    }

    // Optimisation des profils utilisateurs
    for (const [userId, profile] of this.userProfiles.entries()) {
      this.cleanupObsoletePatterns(profile);
      
      // Suppression des profils inactifs (> 90 jours)
      if (now - profile.learning_metadata.last_updated > 90 * 24 * 60 * 60 * 1000) {
        this.userProfiles.delete(userId);
      }
    }

    console.log('🧹 Nettoyage du module d\'apprentissage effectué');
  }

  /**
   * ✅ Activation du module
   */
  public activate(): void {
    this.isActive = true;
    console.log('🧠 Module d\'Apprentissage Comportemental 2.0 activé');
  }

  /**
   * ⏸️ Désactivation du module
   */
  public deactivate(): void {
    this.isActive = false;
    console.log('⏸️ Module d\'Apprentissage Comportemental désactivé');
  }

  /**
   * 💥 Destruction complète
   */
  public destroy(): void {
    this.deactivate();
    this.userProfiles.clear();
    this.globalPatterns.clear();
    this.learningCache.clear();
    this.performanceMetrics.clear();
    console.log('💥 Module d\'Apprentissage Comportemental détruit');
  }
}

/**
 * 🌟 FACTORY POUR CRÉER LE MODULE D'APPRENTISSAGE
 */
export function createBehavioralLearningModule(
  config?: Partial<typeof BehavioralLearningModule.prototype.learningConfig>
): BehavioralLearningModule {
  return new BehavioralLearningModule(config);
}

/**
 * 🎮 EXEMPLE D'UTILISATION
 */
export const behavioralLearningExample = `
// === UTILISATION DU MODULE D'APPRENTISSAGE COMPORTEMENTAL ===

import { createBehavioralLearningModule } from './behavioral-learning-module';

// Création du module avec configuration personnalisée
const learningModule = createBehavioralLearningModule({
  learning_rate: 0.02,
  confidence_threshold: 0.75,
  max_patterns_per_user: 800
});

// Enregistrement d'interactions utilisateur
learningModule.recordInteraction('user123', {
  action: 'modify_effect',
  context: { 
    effect_type: 'particle', 
    complexity: 7,
    duration: 2000 
  },
  outcome: 'positive'
});

// Prédiction comportementale
const prediction = await learningModule.predictBehavior('user123', {
  effect_type: 'animation',
  complexity: 5
});

console.log('🔮 Prédiction:', prediction.predicted_action);
console.log('📊 Confiance:', (prediction.confidence * 100).toFixed(1) + '%');
console.log('🎯 Alternatives:', prediction.alternatives);

// Validation de la prédiction
learningModule.validatePrediction(
  'user123', 
  prediction.predicted_action, 
  'apply_variation', 
  'positive'
);

// Statistiques d'apprentissage
const stats = learningModule.getLearningStats('user123');
console.log('📈 Précision globale:', (stats.global_stats.global_accuracy * 100).toFixed(1) + '%');
console.log('🧠 Patterns appris:', stats.user_stats?.behavioral_patterns);
`;

export default BehavioralLearningModule;
