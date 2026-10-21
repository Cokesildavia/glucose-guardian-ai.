import { ipcMain } from 'electron';
import type { BrowserWindow, IpcMainInvokeEvent } from 'electron';
import { createRepair, getDashboardSummary } from './database/repairs';
import type { openDatabase } from './database';
import { createRepairSchema } from '../shared/validation';

type DatabaseContext = ReturnType<typeof openDatabase>;

function assertTrustedRenderer(
  event: IpcMainInvokeEvent,
  getWindow: () => BrowserWindow | null,
): void {
  const window = getWindow();
  const frame = event.senderFrame;
  if (!window || event.sender !== window.webContents || frame !== window.webContents.mainFrame) {
    throw new Error('Solicitud IPC no autorizada');
  }

  const expectedUrl = process.env.ELECTRON_RENDERER_URL;
  const trusted = expectedUrl
    ? new URL(frame.url).origin === new URL(expectedUrl).origin
    : new URL(frame.url).protocol === 'file:';

  if (!trusted) {
    throw new Error('Origen IPC no autorizado');
  }
}

export function registerIpcHandlers(
  database: DatabaseContext['database'],
  getWindow: () => BrowserWindow | null,
): void {
  ipcMain.handle('dashboard:get-summary', (event) => {
    assertTrustedRenderer(event, getWindow);
    return getDashboardSummary(database);
  });

  ipcMain.handle('repairs:create', (event, rawInput: unknown) => {
    assertTrustedRenderer(event, getWindow);
    const input = createRepairSchema.parse(rawInput);
    return createRepair(database, input);
  });
}
