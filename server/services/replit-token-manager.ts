interface TokenCache {
  token: string;
  fetchedAt: number;
  expiresAt: number;
  userId?: string;
}

export class ReplitTokenManager {
  private lastToken: string | null = null;
  private lastFetch: number = 0;
  private tokenCacheTime = 300000; // 5 minutes
  private tokenCache: TokenCache | null = null;
  private fetchAttempts = 0;
  private maxRetries = 3;
  private isValidatingToken = false;

  constructor() {
    this.validateEnvironment();
    this.setupCleanupInterval();
  }

  private setupCleanupInterval(): void {
    // Nettoyer le cache périodiquement
    setInterval(() => {
      if (this.tokenCache && Date.now() > this.tokenCache.expiresAt) {
        console.log('[TokenManager] Cache token expiré, nettoyage automatique');
        this.tokenCache = null;
        this.lastToken = null;
      }
    }, 60000); // Vérification chaque minute
  }

  private validateEnvironment(): void {
    if (!process.env.REPL_ID) {
      console.warn('[TokenManager] Environnement Replit non détecté. Certaines fonctionnalités pourraient être limitées.');
    }
  }

  private getCookieString(): string {
    // Fonction de simulation pour obtenir les cookies Replit
    // Dans une vraie application, vous auriez besoin d'une méthode pour récupérer les cookies de session
    // Par exemple, en lisant un fichier de session ou en utilisant un mécanisme d'authentification
    // Pour l'instant, nous utiliserons une valeur fictive ou essaierons de trouver un token dans les variables d'environnement
    const token = process.env.REPLIT_AI_TOKEN || process.env.REPL_TOKEN || process.env.REPLIT_TOKEN;
    if (token) {
      // Si un token est trouvé dans les variables d'environnement, on pourrait l'utiliser pour simuler une authentification
      // Cependant, l'API 'replit.com/api/account' attend des cookies pour l'authentification.
      // Il est donc préférable d'utiliser une approche qui gère les cookies si possible.
      // Pour cet exemple, si un token est présent, nous retournons une chaîne qui pourrait *potentiellement* fonctionner
      // si Replit utilise un schéma de cookie simple basé sur un token (ce qui n'est pas garanti).
      // Une meilleure approche serait d'avoir un moyen de gérer la session active.
      console.log('[TokenManager] Tentative d\'utilisation d\'un token d\'environnement pour les cookies.');
      // Ceci est une supposition, l'API Replit peut nécessiter des cookies spécifiques de session
      return `__session=${token};`; 
    }
    console.warn('[TokenManager] Aucun cookie de session trouvé. L\'authentification pourrait échouer.');
    return '';
  }

  private extractOrGenerateToken(userData: any): string {
    // Dans le contexte de Replit, le "token" pourrait être lié à l'ID utilisateur ou à des identifiants de session.
    // Si l'API retourne des informations utilisateur, nous pouvons essayer d'en déduire un token.
    // Une approche courante pour les sessions web est d'utiliser des identifiants uniques de session.
    // Pour cet exemple, nous allons simuler la création d'un token basé sur l'ID utilisateur et un timestamp.
    // Dans une implémentation réelle, vous devriez utiliser la logique fournie par Replit ou un mécanisme de gestion de session robuste.

    // Si `userData.token` existe, c'est l'idéal
    if (userData.token) {
      return userData.token;
    }

    // Sinon, nous générons un token basé sur l'ID utilisateur et un timestamp.
    // C'est une simplification pour démontrer le fonctionnement du cache.
    const generatedToken = `replit_user_${userData.id}_${Date.now()}`;
    console.log('[TokenManager] Token généré à partir des données utilisateur.');
    return generatedToken;
  }

  async getValidToken(): Promise<string> {
    const now = Date.now();

    // Éviter les appels concurrents
    if (this.isValidatingToken) {
      console.log('[TokenManager] Validation déjà en cours, attente...');
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.getValidToken();
    }

    try {
      this.isValidatingToken = true;

      // Return cached token if still valid
      if (this.tokenCache && now < this.tokenCache.expiresAt) {
        console.log('[TokenManager] Using cached token');
        return this.tokenCache.token;
      }

      console.log('[TokenManager] Fetching new token from Replit API');

      // Reset fetch attempts if enough time has passed
      if (now - this.lastFetch > this.tokenCacheTime) {
        this.fetchAttempts = 0;
      }

      if (this.fetchAttempts >= this.maxRetries) {
        throw new Error('Maximum de tentatives d\'obtention de token atteint');
      }

      this.fetchAttempts++;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      try {
        const response = await fetch('https://replit.com/api/account', {
          headers: {
            'Cookie': this.getCookieString(),
            'User-Agent': 'Mozilla/5.0 (compatible; ReplitAI/1.0)',
            'Accept': 'application/json'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.user || !data.user.id) {
          throw new Error('Invalid user data received');
        }

        // Extract token from user ID or generate based on session
        const token = this.extractOrGenerateToken(data.user);

        // Cache with expiration
        this.tokenCache = {
          token,
          fetchedAt: now,
          expiresAt: now + this.tokenCacheTime,
          userId: data.user.id.toString()
        };

        this.lastToken = token;
        this.lastFetch = now;
        this.fetchAttempts = 0; // Reset sur succès

        console.log(`[TokenManager] Token fetched and cached successfully (User: ${data.user.id})`);
        return token;

      } catch (fetchError) {
        clearTimeout(timeoutId);

        if (fetchError.name === 'AbortError') {
          throw new Error('Timeout lors de la récupération du token');
        }

        throw fetchError;
      }

    } catch (error) {
      console.error('[TokenManager] Failed to fetch token:', error);

      // Try to use old cached token if available as fallback
      if (this.tokenCache && this.tokenCache.token) {
        console.log('[TokenManager] Using expired cached token as fallback');
        return this.tokenCache.token;
      }

      if (this.lastToken) {
        console.log('[TokenManager] Using last known token as fallback');
        return this.lastToken;
      }

      throw new Error(`Token fetch failed: ${error.message}`);

    } finally {
      this.isValidatingToken = false;
    }
  }

  // Méthode pour rafraîchir le token manuellement
  async refreshToken(): Promise<void> {
    this.tokenCache = null;
    this.lastToken = null;
    this.lastFetch = 0;
    this.fetchAttempts = 0;
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
    
    // Ajouter une vérification de l'état du cache
    if (this.tokenCache) {
        issues.push(`📊 Cache Token: Valide jusqu'à ${new Date(this.tokenCache.expiresAt).toLocaleString()}`);
    } else {
        issues.push('📊 Cache Token: Vide');
    }

    // Essayer d'obtenir un token pour vérifier la validité
    try {
        await this.getValidToken();
        issues.push('✅ La récupération du token a réussi.');
    } catch (error) {
        issues.push(`❌ La récupération du token a échoué: ${error.message}`);
    }

    return issues;
  }
}

export const replitTokenManager = new ReplitTokenManager();