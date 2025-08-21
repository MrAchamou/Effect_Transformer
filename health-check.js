
const http = require('http');

async function checkHealth() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          console.log('✅ Serveur en bonne santé:', health.status);
          resolve(health);
        } catch (error) {
          reject(new Error('Réponse invalide du serveur'));
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Serveur inaccessible:', error.message);
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout - serveur ne répond pas'));
    });
    
    req.end();
  });
}

async function monitorHealth() {
  console.log('🔍 Vérification de santé du système...');
  
  try {
    await checkHealth();
    console.log('✅ Système opérationnel');
  } catch (error) {
    console.log('❌ Problème détecté:', error.message);
    console.log('🔧 Tentative de redémarrage...');
    
    // Tenter un redémarrage automatique
    const { spawn } = require('child_process');
    spawn('node', ['start-server.js'], { 
      detached: true, 
      stdio: 'ignore' 
    }).unref();
  }
}

if (require.main === module) {
  monitorHealth();
}

module.exports = { checkHealth, monitorHealth };
