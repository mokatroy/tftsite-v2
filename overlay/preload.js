const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mokaOverlay', {
  loadComps: () => ipcRenderer.invoke('comps:load'),
  hide: () => ipcRenderer.send('overlay:hide'),
  minimize: () => ipcRenderer.send('overlay:minimize'),
  toggleMaximize: () => ipcRenderer.send('overlay:toggle-maximize'),
  onWindowState: (callback) => ipcRenderer.on('overlay:window-state', (_, state) => callback(state))
});