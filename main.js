const { app, BrowserWindow, Menu, shell, ipcMain, dialog, Tray, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset',
    frame: process.platform === 'darwin' ? true : true,
    show: false,
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  buildMenu();
  createTray();
}

function createTray() {
  const iconPath = path.join(__dirname, 'build', 'icon.png');
  if (fs.existsSync(iconPath)) {
    tray = new Tray(nativeImage.createFromPath(iconPath));
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Mostra AuraOS', click: () => { if (mainWindow) mainWindow.show(); } },
      { label: 'Nuova finestra', click: () => mainWindow.webContents.send('new-window') },
      { type: 'separator' },
      { label: 'Esci', click: () => app.quit() },
    ]);
    tray.setToolTip('AuraOS');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
      if (mainWindow) {
        if (mainWindow.isVisible()) mainWindow.hide();
        else mainWindow.show();
      }
    });
  }
}

function buildMenu() {
  const template = [
    {
      label: 'AuraOS',
      submenu: [
        { role: 'about', label: 'Informazioni su AuraOS' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide', label: 'Nascondi AuraOS' },
        { role: 'hideOthers', label: 'Nascondi altri' },
        { role: 'unhide', label: 'Mostra tutti' },
        { type: 'separator' },
        { role: 'quit', label: 'Esci da AuraOS' },
      ],
    },
    {
      label: 'File',
      submenu: [
        { label: 'Nuova finestra', accelerator: 'CmdOrCtrl+N', click: () => mainWindow.webContents.send('new-window') },
        { type: 'separator' },
        { label: 'Apri file...', accelerator: 'CmdOrCtrl+O', click: () => mainWindow.webContents.send('open-file') },
        { label: 'Salva', accelerator: 'CmdOrCtrl+S', click: () => mainWindow.webContents.send('save-file') },
      ],
    },
    {
      label: 'Modifica',
      submenu: [
        { role: 'undo', label: 'Annulla' },
        { role: 'redo', label: 'Ripeti' },
        { type: 'separator' },
        { role: 'cut', label: 'Taglia' },
        { role: 'copy', label: 'Copia' },
        { role: 'paste', label: 'Incolla' },
        { role: 'selectAll', label: 'Seleziona tutto' },
      ],
    },
    {
      label: 'Finestra',
      submenu: [
        { role: 'minimize', label: 'Minimizza' },
        { role: 'zoom', label: 'Ingrandisci' },
        { type: 'separator' },
        { role: 'front', label: 'Porta in primo piano' },
      ],
    },
    {
      label: 'Aiuto',
      submenu: [
      { label: 'Guida di AuraOS', click: () => mainWindow.webContents.send('open-guide') },
      { label: 'Documentazione', click: () => shell.openExternal('https://github.com/auraos/auraos') },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    title: 'Apri file',
  });
  return result.canceled ? [] : result.filePaths;
});

ipcMain.handle('save-file-dialog', async (event, defaultName) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName || 'file.txt',
    title: 'Salva file',
  });
  return result.canceled ? null : result.filePath;
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-file', async (event, filePath, content) => {
  try {
    await fs.promises.writeFile(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
