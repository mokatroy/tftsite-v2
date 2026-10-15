const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mokaOverlay', {
  loadComps: () => ipcRenderer.invoke('comps:load'),
  hide: () => ipcRenderer.send('overlay:hide'),
  minimize: () => ipcRenderer.send('overlay:minimize')
});