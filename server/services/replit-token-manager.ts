
export class ReplitTokenManager {
  private cachedToken: string | null = null;
  private tokenExpiry: number = 0;

  async getValidToken(): Promise<string> {
    // Vérifier si le token en cache est encore valide
    if (this.cachedToken && Date.now() < this.tokenExpiry) {
      return this.cachedToken;
    }

    // Essayer de trouver un token valide
    const token = await this.findValidToken();
    if (token) {
      this.cachedToken = token;
      this.tokenExpiry = Date.now() + (60 * 60 * 1000); // Cache 1h
      return token;
    }

    throw new Error('Aucun token API Replit valide trouvé');
  }

  private async findValidToken(): Promise<string | null> {
    const possibleSources = [
      // Variables d'environnement communes
      'REPLIT_AI_TOKEN',
      'REPL_TOKEN', 
      'REPLIT_TOKEN',
      'REPL_API_KEY',
      'REPLIT_API_KEY',
      // Headers potentiels
      'X_REPLIT_TOKEN',
      'AUTHORIZATION'
    ];

    for (const envVar of possibleSources) {
      const token = process.env[envVar];
      if (token && await this.validateToken(token)) {
        console.log(`✅ Token valide trouvé: ${envVar}`);
        return token;
      }
    }

    // Essayer de détecter automatiquement selon le contexte Replit
    return await this.autoDetectToken();
  }

  private async validateToken(token: string): Promise<boolean> {
    if (!token || token === 'replit_ai_default' || token.length < 10) {
      return false;
    }

    try {
      const response = await fetch('https://api.replit.com/v1/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      return response.ok;
    } catch (error) {
      console.warn(`Token validation failed: ${error.message}`);
      return false;
    }
  }

  private async autoDetectToken(): Promise<string | null> {
    try {
      // Dans un environnement Replit, le token peut être accessible différemment
      if (process.env.REPL_ID) {
        console.log('🔍 Environnement Replit détecté, recherche de token...');
        
        // Essayer de lire depuis les métadonnées système
        if (process.env.REPL_OWNER && process.env.REPL_SLUG) {
          const replInfo = {
            id: process.env.REPL_ID,
            owner: process.env.REPL_OWNER,
            slug: process.env.REPL_SLUG
          };
          
          console.log(`📝 Repl détecté: @${replInfo.owner}/${replInfo.slug}`);
        }
      }

      return null;
    } catch (error) {
      console.error('Erreur auto-détection token:', error);
      return null;
    }
  }

  // Méthode pour rafraîchir le token manuellement
  async refreshToken(): Promise<void> {
    this.cachedToken = null;
    this.tokenExpiry = 0;
    console.log('🔄 Cache token réinitialisé');
  }

  // Méthode pour diagnostiquer les problèmes de token
  async diagnoseTokenIssues(): Promise<string[]> {
    const issues: string[] = [];
    
    const envTokens = Object.keys(process.env)
      .filter(key => key.toLowerCase().includes('replit') || key.toLowerCase().includes('token'))
      .map(key => `${key}: ${process.env[key] ? '✅ Défini' : '❌ Vide'}`);

    if (envTokens.length === 0) {
      issues.push('❌ Aucune variable d\'environnement token trouvée');
    } else {
      issues.push('📋 Variables d\'environnement détectées:');
      issues.push(...envTokens);
    }

    if (process.env.REPL_ID) {
      issues.push(`✅ Environnement Replit: ${process.env.REPL_ID}`);
    } else {
      issues.push('⚠️ Pas dans un environnement Replit officiel');
    }

    return issues;
  }
}

export const replitTokenManager = new ReplitTokenManager();
