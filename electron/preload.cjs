const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('zoiApi', {
  lire: () => ipcRenderer.invoke('donnees:lire'),
  ecrire: (contenu) => ipcRenderer.invoke('donnees:ecrire', contenu),
  exporter: (contenu) => ipcRenderer.invoke('donnees:exporter', contenu),
  importer: () => ipcRenderer.invoke('donnees:importer'),
})
