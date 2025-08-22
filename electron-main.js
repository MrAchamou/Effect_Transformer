
const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

class VisualEffectsTransformerDesktop {
  constructor() {
    this.mainWindow = null;
    this.server = null;
    this.serverPort = 5000;
  }

  async createWindow() {
    // Fenêtre principale
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1000,
      minHeight: 700,
      icon: path.join(__dirname, 'assets', 'icon.png'),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
      titleBarStyle: 'default',
      show: false
    });

    // Menu de l'application
    this.createAppMenu();

    // Démarrage du serveur intégré
    await this.startIntegratedServer();

    // Chargement de l'interface
    this.mainWindow.loadURL(`http://localhost:${this.serverPort}`);

    // Affichage quand prêt
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
      this.showWelcomeNotification();
    });

    // Gestion de la fermeture
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
      this.stopIntegratedServer();
    });
  }

  async startIntegratedServer() {
    console.log('🚀 Démarrage serveur intégré...');
    
    try {
      // Import dynamique de votre serveur existant
      const serverPath = path.join(__dirname, 'server', 'ultimate-server.js');
      this.server = spawn('node', [serverPath], {
        stdio: 'pipe',
        env: { ...process.env, PORT: this.serverPort }
      });

      this.server.stdout.on('data', (data) => {
        console.log(`Server: ${data}`);
      });

      this.server.stderr.on('data', (data) => {
        console.error(`Server Error: ${data}`);
      });

      // Attendre que le serveur soit prêt
      await this.waitForServer();
      
    } catch (error) {
      console.error('❌ Erreur démarrage serveur:', error);
      this.showErrorDialog('Erreur de démarrage', 'Impossible de démarrer le moteur de transformation');
    }
  }

  async waitForServer() {
    return new Promise((resolve) => {
      const checkServer = () => {
        const http = require('http');
        const req = http.get(`http://localhost:${this.serverPort}/api/health`, (res) => {
          resolve();
        });
        
        req.on('error', () => {
          setTimeout(checkServer, 100);
        });
      };
      
      setTimeout(checkServer, 500);
    });
  }

  stopIntegratedServer() {
    if (this.server) {
      this.server.kill();
      this.server = null;
    }
  }

  createAppMenu() {
    const template = [
      {
        label: 'Fichier',
        submenu: [
          {
            label: 'Ouvrir Effet...',
            accelerator: 'CmdOrCtrl+O',
            click: () => this.openEffectFile()
          },
          {
            label: 'Sauvegarder Projet',
            accelerator: 'CmdOrCtrl+S',
            click: () => this.saveProject()
          },
          { type: 'separator' },
          {
            label: 'Quitter',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => app.quit()
          }
        ]
      },
      {
        label: 'Transformation',
        submenu: [
          {
            label: 'Niveau Standard',
            click: () => this.setTransformationLevel(1)
          },
          {
            label: 'Niveau Professionnel',
            click: () => this.setTransformationLevel(2)
          },
          {
            label: 'Niveau Premium',
            click: () => this.setTransformationLevel(3)
          }
        ]
      },
      {
        label: 'Aide',
        submenu: [
          {
            label: 'À propos',
            click: () => this.showAboutDialog()
          },
          {
            label: 'Documentation',
            click: () => this.openDocumentation()
          }
        ]
      }
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }

  async openEffectFile() {
    const result = await dialog.showOpenDialog(this.mainWindow, {
      title: 'Sélectionner un effet JavaScript',
      filters: [
        { name: 'Fichiers JavaScript', extensions: ['js', 'mjs'] },
        { name: 'Tous les fichiers', extensions: ['*'] }
      ],
      properties: ['openFile']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      // Envoyer le fichier à l'interface web
      this.mainWindow.webContents.send('file-selected', filePath);
    }
  }

  showWelcomeNotification() {
    new Notification('Visual Effects Transformer', {
      body: '🎨 Transformateur d\'effets visuels prêt !',
      icon: path.join(__dirname, 'assets', 'icon.png')
    });
  }

  showErrorDialog(title, message) {
    dialog.showErrorBox(title, message);
  }

  showAboutDialog() {
    dialog.showMessageBox(this.mainWindow, {
      type: 'info',
      title: 'À propos',
      message: 'Visual Effects Transformer',
      detail: '🎨 Transformateur révolutionnaire d\'effets JavaScript\nVersion 2.0 - Desktop Edition\n\n✨ 24 modules créatifs intégrés\n🚀 Génération autonome\n💎 Qualité professionnelle'
    });
  }
}

// Initialisation de l'application
const desktopApp = new VisualEffectsTransformerDesktop();

app.whenReady().then(() => {
  desktopApp.createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      desktopApp.createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers pour communication avec le renderer
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('show-save-dialog', async () => {
  const result = await dialog.showSaveDialog(desktopApp.mainWindow, {
    title: 'Sauvegarder l\'effet transformé',
    filters: [
      { name: 'Fichiers JavaScript', extensions: ['js'] }
    ]
  });
  return result;
});
