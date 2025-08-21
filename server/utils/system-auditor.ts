
/**
 * Auditeur système pour vérifier l'intégrité et les performances
 */

export class SystemAuditor {
  private issues: string[] = [];
  private warnings: string[] = [];

  async performFullAudit(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    warnings: string[];
    performance: any;
    security: any;
  }> {
    console.log('🔍 Démarrage de l\'audit système...');
    
    this.issues = [];
    this.warnings = [];
    
    // Tests de sécurité
    const securityAudit = await this.auditSecurity();
    
    // Tests de performance
    const performanceAudit = await this.auditPerformance();
    
    // Tests d'intégrité des fichiers
    await this.auditFileIntegrity();
    
    // Tests des services
    await this.auditServices();
    
    const status = this.issues.length > 0 ? 'critical' : 
                  this.warnings.length > 0 ? 'warning' : 'healthy';
    
    console.log(`✅ Audit terminé: ${status} (${this.issues.length} erreurs, ${this.warnings.length} avertissements)`);
    
    return {
      status,
      issues: this.issues,
      warnings: this.warnings,
      performance: performanceAudit,
      security: securityAudit
    };
  }

  private async auditSecurity(): Promise<any> {
    const security = {
      fileUploadSafety: true,
      rateLimiting: true,
      inputValidation: true,
      pathTraversal: true
    };

    // Vérifier les uploads sécurisés
    try {
      const routesContent = await import('fs').then(fs => 
        fs.promises.readFile('server/routes.ts', 'utf-8')
      );
      
      if (!routesContent.includes('fileFilter')) {
        this.warnings.push('Filtrage de fichiers manquant dans multer');
        security.fileUploadSafety = false;
      }
      
      if (!routesContent.includes('rateLimits')) {
        this.warnings.push('Rate limiting non détecté');
        security.rateLimiting = false;
      }
      
    } catch (error) {
      this.issues.push('Impossible de vérifier la sécurité des routes');
    }

    return security;
  }

  private async auditPerformance(): Promise<any> {
    const startTime = process.hrtime.bigint();
    const memoryBefore = process.memoryUsage();
    
    // Simulation d'opérations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const endTime = process.hrtime.bigint();
    const memoryAfter = process.memoryUsage();
    
    const performance = {
      responseTime: Number(endTime - startTime) / 1000000, // en ms
      memoryLeak: memoryAfter.heapUsed > memoryBefore.heapUsed * 1.5,
      heapUsed: Math.round(memoryAfter.heapUsed / 1024 / 1024), // MB
      uptime: process.uptime()
    };

    if (performance.memoryLeak) {
      this.warnings.push('Fuite mémoire potentielle détectée');
    }

    if (performance.heapUsed > 500) {
      this.warnings.push(`Utilisation mémoire élevée: ${performance.heapUsed}MB`);
    }

    return performance;
  }

  private async auditFileIntegrity(): Promise<void> {
    const criticalFiles = [
      'server/services/universal-preprocessor.ts',
      'server/services/js-preprocessor.ts',
      'server/routes.ts',
      'server/index.ts'
    ];

    for (const file of criticalFiles) {
      try {
        const fs = await import('fs');
        await fs.promises.access(file);
        
        // Vérifier que le fichier n'est pas vide
        const content = await fs.promises.readFile(file, 'utf-8');
        if (content.length < 100) {
          this.issues.push(`Fichier critique trop petit: ${file}`);
        }
        
        // Vérifier la syntaxe basique
        if (file.endsWith('.ts') && !content.includes('export')) {
          this.warnings.push(`Fichier sans exports: ${file}`);
        }
        
      } catch (error) {
        this.issues.push(`Fichier critique manquant: ${file}`);
      }
    }
  }

  private async auditServices(): Promise<void> {
    const services = [
      'UniversalPreprocessor',
      'JSPreprocessor', 
      'DocumentationPackager',
      'AdvancedEnhancer'
    ];

    for (const service of services) {
      try {
        // Test d'importation
        const modulePath = `../services/${service.toLowerCase().replace(/([A-Z])/g, '-$1').substring(1)}`;
        await import(modulePath);
        
      } catch (error) {
        this.issues.push(`Service non fonctionnel: ${service}`);
      }
    }
  }

  /**
   * Surveillance en temps réel
   */
  startRealTimeMonitoring(): void {
    setInterval(async () => {
      const quickAudit = await this.performQuickHealthCheck();
      if (quickAudit.issues.length > 0) {
        console.warn('⚠️ Problèmes détectés lors du monitoring:', quickAudit.issues);
      }
    }, 60000); // Toutes les minutes
  }

  private async performQuickHealthCheck(): Promise<{ issues: string[] }> {
    const issues: string[] = [];
    
    // Vérifier la mémoire
    const memory = process.memoryUsage();
    if (memory.heapUsed > 1024 * 1024 * 1024) { // > 1GB
      issues.push('Utilisation mémoire critique');
    }
    
    // Vérifier les fichiers temporaires
    try {
      const fs = await import('fs');
      const uploadsDir = await fs.promises.readdir('uploads/').catch(() => []);
      if (uploadsDir.length > 100) {
        issues.push('Trop de fichiers temporaires');
      }
    } catch (error) {
      // Ignorer si le dossier n'existe pas
    }
    
    return { issues };
  }
}
