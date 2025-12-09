import { contextBridge, ipcRenderer } from 'electron';

// Secure bridge for IPC communication
// Future: add LLM communication, state persistence, etc.
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel: string, data: unknown) => {
    if (['to-main'].includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, func: (args: unknown) => void) => {
    if (['from-main'].includes(channel)) {
      ipcRenderer.on(channel, (_event, args) => func(args));
    }
  },
});
