const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mokaOverlay', {
  loadComps: () => ipcRenderer.invoke('comps:load'),
  hide: () => ipcRenderer.send('overlay:hide'),
  minimize: () => ipcRenderer.send('overlay:minimize'),
  toggleMaximize: () => ipcRenderer.send('overlay:toggle-maximize'),
  checkForUpdates: () => ipcRenderer.send('update:check'),
  downloadUpdate: () => ipcRenderer.send('update:download'),
  installUpdate: () => ipcRenderer.send('update:install'),
  onUpdate: (cb) => ipcRenderer.on('overlay:update', (_e, data) => cb(data)),
  onVersion: (cb) => ipcRenderer.on('overlay:version', (_e, data) => cb(data)),
  onWindowState: (cb) => ipcRenderer.on('overlay:window-state', (_e, data) => cb(data))
});
