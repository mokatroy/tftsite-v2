const { app, BrowserWindow, globalShortcut, ipcMain, screen, dialog, shell, net } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

const DATA_SOURCES = [
  'https://tftsite-v2.mokatroymonk.workers.dev/data/v2_comps_extra.json',
  'https://tftsite-v2.mokatroymonk.workers.dev/data/v2_comps_extra2.json',
  'https://tftsite-v2.mokatroymonk.workers.dev/data/v2_comps_extra3.json',
  'https://tftsite-v2.mokatroymonk.workers.dev/data/v2_comps_extra4.json',
  'https://tftsite-v2.mokatroymonk.workers.dev/data/v2_comps_extra5.json',
  'https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@main/data/v2_comps_extra.json',
  'https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@main/data/v2_comps_extra2.json',
  'https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@main/data/v2_comps_extra3.json',
  'https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@main/data/v2_comps_extra4.json',
  'https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@main/data/v2_comps_extra5.json'
];

let overlayWindow;
let isInstallingUpdate = false;

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  // Second instance: show message then exit
  app.whenReady().then(() => {
    try {
      dialog.showMessageBoxSync({
        type: 'info',
        title: 'MokaTroy TFT Overlay',
        message: 'البرنامج شغال بالفعل',
        detail: 'نسخة واحدة فقط يمكن فتحها في نفس الوقت.\nلو النافذة مختفية استخدم Ctrl+Shift+Space أو أيقونة شريط المهام.',
        buttons: ['حسنًا']
      });
    } catch (_) {}
    app.exit(0);
  });
}



function sendUpdate(state, payload = {}) {
  overlayWindow?.webContents.send('overlay:update', { state, ...payload });
}

function notifyWindowState() {
  overlayWindow?.webContents.send('overlay:window-state', {
    maximized: overlayWindow.isMaximized()
  });
}

function pinOverlayOnTop() {
  if (!overlayWindow || overlayWindow.isDestroyed()) return;
  try {
    // Highest practical level on Windows so other apps don't cover the overlay
    overlayWindow.setAlwaysOnTop(true, 'screen-saver');
    overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    if (overlayWindow.isVisible()) overlayWindow.moveTop();
  } catch (_) {
    try { overlayWindow.setAlwaysOnTop(true); } catch (__) {}
  }
}

function createOverlayWindow() {
  const { workArea } = screen.getPrimaryDisplay();
  const width = Math.min(620, workArea.width - 48);
  const height = Math.min(860, workArea.height - 48);

  overlayWindow = new BrowserWindow({
    width, height,
    x: workArea.x + workArea.width - width - 24,
    y: workArea.y + Math.max(24, Math.round((workArea.height - height) / 2)),
    minWidth: 440, minHeight: 560, show: false, frame: false, transparent: true,
    alwaysOnTop: true, skipTaskbar: false, resizable: true,
    icon: path.join(__dirname, 'build', 'icon.png'),
    backgroundColor: '#00000000', title: 'MokaTroy TFT Overlay',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, nodeIntegration: false, sandbox: true
    }
  });

  pinOverlayOnTop();
  try { overlayWindow.setIcon(path.join(__dirname, 'build', 'icon.png')); } catch (_) {}
  overlayWindow.setMenuBarVisibility(false);
  overlayWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  overlayWindow.once('ready-to-show', () => {
    overlayWindow.show();
    pinOverlayOnTop();
    try {
      overlayWindow.webContents.send('overlay:version', { version: app.getVersion(), packaged: app.isPackaged });
    } catch (_) {}
    setTimeout(checkForUpdates, 4000);
  });
  overlayWindow.webContents.on('did-fail-load', (_e, code, desc) => {
    console.error('did-fail-load', code, desc);
  });
  overlayWindow.webContents.on('render-process-gone', (_e, details) => {
    console.error('render-process-gone', details);
  });
  overlayWindow.on('maximize', notifyWindowState);
  overlayWindow.on('unmaximize', notifyWindowState);
  overlayWindow.on('blur', () => pinOverlayOnTop());
  overlayWindow.on('show', () => pinOverlayOnTop());
  overlayWindow.on('focus', () => pinOverlayOnTop());
  overlayWindow.on('close', (event) => {
    if (isInstallingUpdate) return;
    // Closing the window exits the app completely (hide is only via shortcut)
  });
  overlayWindow.on('closed', () => { overlayWindow = null; });
  overlayWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}

function toggleOverlay() {
  if (!overlayWindow) return;
  if (overlayWindow.isVisible()) overlayWindow.hide();
  else {
    overlayWindow.showInactive();
    pinOverlayOnTop();
  }
}

function configureUpdater() {
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  try {
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'mokatroy',
      repo: 'tftsite-v2'
    });
  } catch (_) {}
  autoUpdater.on('checking-for-update', () => sendUpdate('checking'));
  autoUpdater.on('update-available', (info) => {
    sendUpdate('available', { version: info.version });
    // autoDownload=true already starts download; keep UI in sync
  });
  autoUpdater.on('update-not-available', () => sendUpdate('current'));
  autoUpdater.on('download-progress', (progress) => sendUpdate('downloading', { percent: Math.round(progress.percent || 0) }));
  autoUpdater.on('update-downloaded', (info) => {
    sendUpdate('ready', { version: info.version });
    setTimeout(() => installUpdateNow(), 1500);
  });
  autoUpdater.on('error', (err) => sendUpdate('error', { message: String(err && err.message || err || 'unknown') }));
}

function installUpdateNow() {
  isInstallingUpdate = true;
  // App is designed to stay alive with no windows; temporarily allow a real quit
  // so NSIS can replace files and relaunch silently.
  try { app.removeAllListeners('window-all-closed'); } catch (_) {}
  try {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      overlayWindow.removeAllListeners('closed');
      overlayWindow.destroy();
    }
  } catch (_) {}
  overlayWindow = null;
  setImmediate(() => {
    try {
      // isSilent=true, isForceRunAfter=true → no wizard, reopen app
      autoUpdater.quitAndInstall(true, true);
    } catch (_) {
      try { autoUpdater.quitAndInstall(); } catch (e) {
        sendUpdate('error', { message: String(e && e.message || e) });
      }
    }
  });
}

function checkForUpdates() {
  if (!app.isPackaged) {
    sendUpdate('dev');
    return;
  }
  sendUpdate('checking');
  let settled = false;
  const finish = (state, payload) => {
    if (settled) return;
    settled = true;
    sendUpdate(state, payload || {});
  };
  const timer = setTimeout(() => finish('error', { message: 'انتهت مهلة البحث عن التحديث' }), 15000);
  autoUpdater.checkForUpdates()
    .then((result) => {
      clearTimeout(timer);
      if (settled) return;
      if (!result || !result.updateInfo) finish('current');
      // events will also fire; mark settled lightly after a tick
      setTimeout(() => { settled = true; }, 2000);
    })
    .catch((err) => {
      clearTimeout(timer);
      finish('error', { message: String(err && err.message || err || 'unknown') });
    });
}

async function loadComps() {
  const responses = await Promise.allSettled(DATA_SOURCES.map(async (url) => {
    let response;
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    } catch (e) {
      response = await fetch(url);
    }
    
    if (!response.ok) throw new Error('Unable to load ' + url);
    return response.json();
  }));
  const seen = new Set();
  return responses.flatMap((result) => {
    if (result.status !== 'fulfilled') return [];
    const list = Array.isArray(result.value) ? result.value : result.value?.comps || [];
    return list.filter((comp) => comp?.slug && !seen.has(comp.slug) && seen.add(comp.slug));
  });
}

app.whenReady().then(() => {
  if (!gotSingleInstanceLock) return;
  app.on('second-instance', () => {
    if (!overlayWindow || overlayWindow.isDestroyed()) return;
    if (overlayWindow.isMinimized()) overlayWindow.restore();
    if (!overlayWindow.isVisible()) overlayWindow.show();
    pinOverlayOnTop();
    try {
      dialog.showMessageBox(overlayWindow, {
        type: 'info',
        title: 'MokaTroy TFT Overlay',
        message: 'البرنامج شغال بالفعل',
        detail: 'تم إظهار النافذة المفتوحة.',
        buttons: ['حسنًا']
      });
    } catch (_) {}
  });

  configureUpdater();
  createOverlayWindow();
  try { globalShortcut.register('CommandOrControl+Shift+Space', toggleOverlay); } catch (_) {}

  ipcMain.handle('comps:load', loadComps);
  ipcMain.on('overlay:hide', () => overlayWindow?.hide());
  
  ipcMain.handle('feedback:send', async (_e, payload) => {
    const text = String(payload?.message || '').trim();
    const version = String(payload?.version || app.getVersion());
    const email = String(payload?.email || 'mokatroy@gmail.com');
    const endpoint = String(payload?.endpoint || '').trim();
    if (!text) return { ok: false, error: 'empty' };

    const subject = 'MokaTroy Overlay Feedback v' + version;
    const formBody = new URLSearchParams({
      message: text,
      version,
      subject,
      name: 'Overlay User',
      email: 'overlay@mokatroy.app',
      _subject: subject
    }).toString();

    async function postFollow(url, body, contentType) {
      const res = await net.fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': 'MokaTroyOverlay/1.0'
        },
        body,
        redirect: 'manual'
      });
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get('location');
        if (loc) {
          return net.fetch(loc, {
            method: 'POST',
            headers: {
              'Content-Type': contentType,
              'Accept': 'application/json, text/plain, */*',
              'User-Agent': 'MokaTroyOverlay/1.0'
            },
            body,
            redirect: 'manual'
          });
        }
      }
      return res;
    }

    const targets = [];
    if (endpoint) {
      targets.push({ url: endpoint, body: formBody, type: 'application/x-www-form-urlencoded' });
      targets.push({
        url: endpoint,
        body: JSON.stringify({ message: text, version, subject }),
        type: 'application/json'
      });
    }
    targets.push({
      url: 'https://formsubmit.co/ajax/' + email,
      body: JSON.stringify({
        name: 'Overlay User',
        email: 'overlay@mokatroy.app',
        _subject: subject,
        message: text,
        _captcha: 'false'
      }),
      type: 'application/json'
    });

    const errors = [];
    for (const t of targets) {
      try {
        const result = await postFollow(t.url, t.body, t.type);
        const status = result.status;
        let raw = '';
        try { raw = await result.text(); } catch (_) {}
        // Google Apps Script often emails successfully then answers with 302/echo HTML/405.
        const isGas = /script\.google\.com|script\.googleusercontent\.com/i.test(t.url);
        if (isGas && status >= 200 && status < 500 && !/Script function not found/i.test(raw)) {
          return { ok: true, status, via: t.url, note: 'gas' };
        }
        if (status >= 200 && status < 400 && !/unable to open the file|Script function not found/i.test(raw)) {
          return { ok: true, status, via: t.url, raw: raw.slice(0, 200) };
        }
        if (status === 200 && /"ok"\s*:\s*true/i.test(raw)) {
          return { ok: true, status, via: t.url };
        }
        errors.push(t.url + ' -> ' + status);
      } catch (err) {
        errors.push(t.url + ' -> ' + String(err && err.message || err));
      }
    }
    return { ok: false, error: errors.join(' | ') || 'send failed' };
  });


  ipcMain.handle('shell:openExternal', async (_e, url) => {
    const safe = String(url || '');
    if (!/^https?:\/\//i.test(safe) && !/^mailto:/i.test(safe)) return false;
    await shell.openExternal(safe);
    return true;
  });
  ipcMain.handle('app:getVersion', () => app.getVersion());
  ipcMain.on('overlay:close', () => {
    if (isInstallingUpdate) return;
    try { globalShortcut.unregisterAll(); } catch (_) {}
    app.quit();
  });
  ipcMain.on('overlay:minimize', () => overlayWindow?.minimize());
  ipcMain.on('overlay:toggle-maximize', () => {
    if (!overlayWindow) return;
    if (overlayWindow.isMaximized()) overlayWindow.unmaximize();
    else overlayWindow.maximize();
  });
  ipcMain.on('update:check', () => {
    if (!app.isPackaged) {
      sendUpdate('dev');
      return;
    }
    checkForUpdates();
  });
  ipcMain.on('update:download', () => autoUpdater.downloadUpdate().catch(() => sendUpdate('error')));
  ipcMain.on('update:install', () => installUpdateNow());

  app.on('activate', () => {
    if (!overlayWindow) createOverlayWindow();
    else overlayWindow.showInactive();
  });
});

app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => {
  if (isInstallingUpdate) return;
  app.quit();
});