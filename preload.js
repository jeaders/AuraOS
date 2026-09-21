const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('auraOSNative', {
  openFile: () => ipcRenderer.invoke('open-file-dialog'),
  saveFile: (defaultName) => ipcRenderer.invoke('save-file-dialog', defaultName),
  readFile: (path) => ipcRenderer.invoke('read-file', path),
  writeFile: (path, content) => ipcRenderer.invoke('write-file', path, content),
  onNewWindow: (callback) => ipcRenderer.on('new-window', callback),
  onOpenFile: (callback) => ipcRenderer.on('open-file', callback),
  onSaveFile: (callback) => ipcRenderer.on('save-file', callback),
  onGuide: (callback) => ipcRenderer.on('open-guide', callback),
  platform: process.platform,
});
