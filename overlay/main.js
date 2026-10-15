const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('path');

const DATA_SOURCES = [
  'https://tftsite-v2.mokatroymonk.workers.dev/data/v2_comps.json',
  'https://tftsite-v2.mokatroymonk.workers.dev/data/v2_comps_extra.json',
  'https://tftsite-v2.mokatroymonk.workers.dev/data/v2_comps_extra2.json',
  'https://tftsite-v2.mokatroymonk.workers.dev/data/v2_comps_extra3.json',
  'https://tftsite-v2.mokatroymonk.workers.dev/data/v2_comps_extra4.json'
];

let overlayWindow;

function createOverlayWindow() {
  const { workArea } = screen.getPrimaryDisplay();
  const width = 430;
  const height = Math.min(760, workArea.height - 80);

  overlayWindow = new BrowserWindow({
    width,
    height,
    x: workArea.x + workArea.width - width - 24,
    y: workArea.y + Math.max(32, Math.round((workArea.height - height) / 2)),
    minWidth: 360,
    minHeight: 480,
    show: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    backgroundColor: '#00000000',
    title: 'MokaTroy TFT Overlay',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  overlayWindow.setAlwaysOnTop(true, 'floating');
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayWindow.setMenuBarVisibility(false);
  overlayWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  overlayWindow.once('ready-to-show', () => overlayWindow.showInactive());
  overlayWindow.on('closed', () => { overlayWindow = null; });
  overlayWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}

function toggleOverlay() {
  if (!overlayWindow) return;
  if (overlayWindow.isVisible()) overlayWindow.hide();
  else {
    overlayWindow.showInactive();
    overlayWindow.moveTop();
  }
}

async function loadComps() {
  const responses = await Promise.allSettled(
    DATA_SOURCES.map(async (url) => {
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw new Error('Unable to load ' + url);
      return response.json();
    })
  );

  const seen = new Set();
  return responses.flatMap((result) => {
    if (result.status !== 'fulfilled') return [];
    const list = Array.isArray(result.value) ? result.value : result.value?.comps || [];
    return list.filter((comp) => comp?.slug && !seen.has(comp.slug) && seen.add(comp.slug));
  });
}

app.whenReady().then(() => {
  createOverlayWindow();

  globalShortcut.register('CommandOrControl+Shift+Space', toggleOverlay);

  ipcMain.handle('comps:load', loadComps);
  ipcMain.on('overlay:hide', () => overlayWindow?.hide());
  ipcMain.on('overlay:minimize', () => overlayWindow?.minimize());
  ipcMain.on('overlay:move', () => overlayWindow?.startDrag?.());

  app.on('activate', () => {
    if (!overlayWindow) createOverlayWindow();
    else overlayWindow.showInactive();
  });
});

app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', (event) => event.preventDefault());