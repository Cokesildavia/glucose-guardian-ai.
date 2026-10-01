import { app, BrowserWindow } from 'electron';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDatabase } from './database';
import { registerIpcHandlers } from './ipc';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));
let mainWindow: BrowserWindow | null = null;
let closeDatabase: (() => void) | undefined;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#f6f7f9',
    title: 'Taller Repair',
    webPreferences: {
      preload: join(currentDirectory, '../preload/index.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event) => event.preventDefault());
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void mainWindow.loadFile(join(currentDirectory, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  const context = openDatabase();
  closeDatabase = context.close;
  registerIpcHandlers(context.database, () => mainWindow);
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
}).catch((error: unknown) => {
  console.error('No se pudo iniciar Taller Repair:', error);
  app.quit();
});

app.on('before-quit', () => {
  closeDatabase?.();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
