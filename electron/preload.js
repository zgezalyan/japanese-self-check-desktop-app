const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadLearned: () => ipcRenderer.invoke('load-learned'),
  saveLearned: (data) => ipcRenderer.invoke('save-learned', data),
});
