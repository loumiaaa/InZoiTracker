const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('node:path')
const fs = require('node:fs')

const fichierDonnees = () => path.join(app.getPath('userData'), 'zoi-tracker.json')

function creerFenetre() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    title: 'Zoi Tracker',
    backgroundColor: '#ECECF0',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  win.setMenuBarVisibility(false)
  if (process.env.VITE_DEV_SERVER_URL) win.loadURL(process.env.VITE_DEV_SERVER_URL)
  else win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
}

ipcMain.handle('donnees:lire', () => {
  const f = fichierDonnees()
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null
})

ipcMain.handle('donnees:ecrire', (_e, contenu) => {
  const f = fichierDonnees()
  // Écriture atomique + copie de secours de la version précédente
  if (fs.existsSync(f)) fs.copyFileSync(f, f + '.bak')
  fs.writeFileSync(f + '.tmp', contenu, 'utf8')
  fs.renameSync(f + '.tmp', f)
  return true
})

ipcMain.handle('donnees:exporter', async (_e, contenu) => {
  const date = new Date().toISOString().slice(0, 10)
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Exporter mes données',
    defaultPath: `zoi-tracker-${date}.json`,
    filters: [{ name: 'JSON', extensions: ['json'] }],
  })
  if (canceled || !filePath) return false
  fs.writeFileSync(filePath, contenu, 'utf8')
  return true
})

ipcMain.handle('donnees:importer', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Importer une sauvegarde',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile'],
  })
  if (canceled || !filePaths[0]) return null
  return fs.readFileSync(filePaths[0], 'utf8')
})

app.whenReady().then(() => {
  creerFenetre()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) creerFenetre()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
