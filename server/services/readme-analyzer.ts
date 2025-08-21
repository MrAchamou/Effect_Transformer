
/**
 * Service d'analyse de README pour améliorer VariationEngine 2.0
 * Extrait les métadonnées riches des README d'effets pour optimiser les variations
 */

export class ReadmeAnalyzer {
  
  /**
   * Analyse un README d'effet pour extraire les métadonnées utiles
   */
  analyzeReadme(readmeContent: string): {
    parameters: any[];
    effectTypes: string[];
    physicalConstraints: any;
    applications: string[];
    optimizationHints: any;
    scientificBasis: any;
  } {
    const analysis = {
      parameters: this.extractParameters(readmeContent),
      effectTypes: this.extractEffectTypes(readmeContent),
      physicalConstraints: this.extractPhysicalConstraints(readmeContent),
      applications: this.extractApplications(readmeContent),
      optimizationHints: this.extractOptimizationHints(readmeContent),
      scientificBasis: this.extractScientificBasis(readmeContent)
    };

    return analysis;
  }

  /**
   * Extrait les paramètres configurables
   */
  private extractParameters(content: string): any[] {
    const parameters = [];
    const paramSection = this.extractSection(content, 'Paramètres Configurables');
    
    if (paramSection) {
      const paramLines = paramSection.match(/\d+\.\s*\*\*([^*]+)\*\*\s*\(([^)]+)\)\s*-\s*(.+)/g) || [];
      
      paramLines.forEach(line => {
        const match = line.match(/\*\*([^*]+)\*\*\s*\(([^)]+)\)\s*-\s*(.+)/);
        if (match) {
          const [, name, range, description] = match;
          const rangeMatch = range.match(/([0-9.]+)-([0-9.]+)\s*([^)]*)/);
          
          if (rangeMatch) {
            parameters.push({
              name: name.trim(),
              min: parseFloat(rangeMatch[1]),
              max: parseFloat(rangeMatch[2]),
              unit: rangeMatch[3].trim(),
              description: description.trim(),
              type: 'range'
            });
          }
        }
      });
    }

    return parameters;
  }

  /**
   * Extrait les types d'effets disponibles
   */
  private extractEffectTypes(content: string): string[] {
    const types = [];
    const typeSection = this.extractSection(content, 'Types de Fumée Disponibles') ||
                       this.extractSection(content, 'Types d\'Effet') ||
                       this.extractSection(content, 'Variantes');
    
    if (typeSection) {
      const typeLines = typeSection.match(/- \*\*([^*]+)\*\*/g) || [];
      typeLines.forEach(line => {
        const match = line.match(/\*\*([^*]+)\*\*/);
        if (match) {
          types.push(match[1].trim());
        }
      });
    }

    return types;
  }

  /**
   * Extrait les contraintes physiques
   */
  private extractPhysicalConstraints(content: string): any {
    const constraints = {};
    
    // Extraction des équations
    const equations = content.match(/```[^`]*```/g) || [];
    constraints.equations = equations.map(eq => eq.replace(/```/g, '').trim());
    
    // Extraction des nombres adimensionnels
    const dimensionlessSection = this.extractSection(content, 'Nombres Adimensionnels');
    if (dimensionlessSection) {
      constraints.dimensionlessNumbers = this.extractEquationsFromSection(dimensionlessSection);
    }

    // Extraction des propriétés physiques
    const propertiesSection = this.extractSection(content, 'Propriétés Physiques');
    if (propertiesSection) {
      constraints.physicalProperties = this.extractPropertiesFromSection(propertiesSection);
    }

    return constraints;
  }

  /**
   * Extrait les applications possibles
   */
  private extractApplications(content: string): string[] {
    const applications = [];
    const appSection = this.extractSection(content, 'Applications');
    
    if (appSection) {
      const appLines = appSection.match(/- \*\*([^*]+)\*\*/g) || [];
      appLines.forEach(line => {
        const match = line.match(/\*\*([^*]+)\*\*/);
        if (match) {
          applications.push(match[1].trim());
        }
      });
    }

    return applications;
  }

  /**
   * Extrait les hints d'optimisation
   */
  private extractOptimizationHints(content: string): any {
    const hints = {};
    const optSection = this.extractSection(content, 'Optimisations Performance');
    
    if (optSection) {
      hints.techniques = [];
      const techniques = optSection.match(/- ([^-\n]+)/g) || [];
      techniques.forEach(tech => {
        hints.techniques.push(tech.replace('- ', '').trim());
      });
    }

    // Extraction des régimes d'écoulement
    const regimeSection = this.extractSection(content, 'Régimes d\'Écoulement');
    if (regimeSection) {
      hints.regimes = this.extractRegimesFromSection(regimeSection);
    }

    return hints;
  }

  /**
   * Extrait les bases scientifiques
   */
  private extractScientificBasis(content: string): any {
    const basis = {};
    
    // Extraction des équations fondamentales
    const equationSection = this.extractSection(content, 'Équations Fondamentales');
    if (equationSection) {
      basis.fundamentalEquations = this.extractEquationsFromSection(equationSection);
    }

    // Extraction des phénomènes physiques
    const phenomenaSection = this.extractSection(content, 'Phénomènes Physiques Simulés');
    if (phenomenaSection) {
      basis.physicalPhenomena = this.extractPhenomenaFromSection(phenomenaSection);
    }

    return basis;
  }

  /**
   * Utilitaire pour extraire une section du README
   */
  private extractSection(content: string, sectionTitle: string): string | null {
    const regex = new RegExp(`## ${sectionTitle}([\\s\\S]*?)(?=##|$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  }

  /**
   * Extrait les équations d'une section
   */
  private extractEquationsFromSection(section: string): any[] {
    const equations = [];
    const blocks = section.match(/```[^`]*```/g) || [];
    
    blocks.forEach(block => {
      const equation = block.replace(/```/g, '').trim();
      equations.push({
        equation,
        context: this.getEquationContext(section, equation)
      });
    });

    return equations;
  }

  /**
   * Extrait les propriétés d'une section
   */
  private extractPropertiesFromSection(section: string): any[] {
    const properties = [];
    const lines = section.match(/- \*\*([^*]+)\*\*\s*:\s*([^-\n]+)/g) || [];
    
    lines.forEach(line => {
      const match = line.match(/\*\*([^*]+)\*\*\s*:\s*([^-\n]+)/);
      if (match) {
        properties.push({
          name: match[1].trim(),
          value: match[2].trim()
        });
      }
    });

    return properties;
  }

  /**
   * Extrait les régimes d'écoulement
   */
  private extractRegimesFromSection(section: string): any[] {
    const regimes = [];
    const lines = section.match(/- \*\*([^*]+)\*\*\s*\(([^)]+)\)\s*-\s*(.+)/g) || [];
    
    lines.forEach(line => {
      const match = line.match(/\*\*([^*]+)\*\*\s*\(([^)]+)\)\s*-\s*(.+)/);
      if (match) {
        regimes.push({
          name: match[1].trim(),
          condition: match[2].trim(),
          description: match[3].trim()
        });
      }
    });

    return regimes;
  }

  /**
   * Extrait les phénomènes physiques
   */
  private extractPhenomenaFromSection(section: string): any[] {
    const phenomena = [];
    const lines = section.match(/- \*\*([^*]+)\*\*\s*-\s*(.+)/g) || [];
    
    lines.forEach(line => {
      const match = line.match(/\*\*([^*]+)\*\*\s*-\s*(.+)/);
      if (match) {
        phenomena.push({
          name: match[1].trim(),
          description: match[2].trim()
        });
      }
    });

    return phenomena;
  }

  /**
   * Obtient le contexte d'une équation
   */
  private getEquationContext(section: string, equation: string): string {
    const lines = section.split('\n');
    let context = '';
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(equation.split('\n')[0])) {
        // Prendre la ligne précédente comme contexte
        if (i > 0) {
          context = lines[i - 1].replace(/[#*]/g, '').trim();
        }
        break;
      }
    }

    return context;
  }

  /**
   * Génère des suggestions de variations basées sur l'analyse
   */
  generateVariationSuggestions(analysis: any): any[] {
    const suggestions = [];

    // Suggestions basées sur les paramètres
    analysis.parameters.forEach(param => {
      suggestions.push({
        type: 'parameter_variation',
        parameter: param.name,
        variations: this.generateParameterVariations(param),
        reasoning: `Variation du paramètre ${param.name} selon ses contraintes physiques`
      });
    });

    // Suggestions basées sur les types d'effet
    analysis.effectTypes.forEach(type => {
      suggestions.push({
        type: 'effect_type_variation',
        effectType: type,
        adaptations: this.generateTypeAdaptations(type, analysis),
        reasoning: `Adaptation pour le type d'effet ${type}`
      });
    });

    // Suggestions basées sur les applications
    analysis.applications.forEach(app => {
      suggestions.push({
        type: 'application_optimization',
        application: app,
        optimizations: this.generateApplicationOptimizations(app, analysis),
        reasoning: `Optimisation spécifique pour l'application ${app}`
      });
    });

    return suggestions;
  }

  /**
   * Génère des variations de paramètres
   */
  private generateParameterVariations(param: any): any[] {
    const variations = [];
    const range = param.max - param.min;
    
    // Variation douce (±10%)
    variations.push({
      name: `${param.name}_soft`,
      min: param.min + range * 0.1,
      max: param.max - range * 0.1,
      description: `Variation douce de ${param.name}`
    });

    // Variation extrême (pleine étendue)
    variations.push({
      name: `${param.name}_extreme`,
      min: param.min,
      max: param.max,
      description: `Variation extrême de ${param.name}`
    });

    return variations;
  }

  /**
   * Génère des adaptations par type
   */
  private generateTypeAdaptations(type: string, analysis: any): any[] {
    const adaptations = [];
    
    // Basé sur le type, suggérer des adaptations
    if (type.toLowerCase().includes('dense')) {
      adaptations.push({
        aspect: 'performance',
        suggestion: 'Réduire le nombre de particules pour la fumée dense',
        impact: 'Améliore les performances'
      });
    }

    if (type.toLowerCase().includes('légère')) {
      adaptations.push({
        aspect: 'visual',
        suggestion: 'Augmenter la transparence et la vitesse',
        impact: 'Effet plus réaliste'
      });
    }

    return adaptations;
  }

  /**
   * Génère des optimisations par application
   */
  private generateApplicationOptimizations(application: string, analysis: any): any[] {
    const optimizations = [];

    if (application.toLowerCase().includes('mobile') || application.toLowerCase().includes('jeu')) {
      optimizations.push({
        type: 'performance',
        suggestion: 'Réduire la complexité des calculs thermodynamiques',
        implementation: 'Simplifier les équations Navier-Stokes'
      });
    }

    if (application.toLowerCase().includes('cinéma') || application.toLowerCase().includes('film')) {
      optimizations.push({
        type: 'quality',
        suggestion: 'Augmenter la résolution et la précision physique',
        implementation: 'Utiliser des modèles de turbulence avancés'
      });
    }

    return optimizations;
  }
}
