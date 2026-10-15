const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mokaOverlay', {
  loadComps: () => ipcRenderer.invoke('comps:load'),
  hide: () => ipcRenderer.send('overlay:hide'),
  minimize: () => ipcRenderer.send('overlay:minimize'),
  toggleMaximize: () => ipcRenderer.send('overlay:toggle-maximize'),
  downloadUpdate: () => ipcRenderer.send('update:download'),
  installUpdate: () => ipcRenderer.send('update:install'),
  onWindowState: (callback) => ipcRenderer.on('overlay:window-state', (_, state) => callback(state)),
  onUpdate: (callback) => ipcRenderer.on('overlay:update', (_, update) => callback(update))
});