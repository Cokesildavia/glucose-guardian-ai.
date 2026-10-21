import { contextBridge, ipcRenderer } from 'electron';
import type { RepairApi, RepairSummary, DashboardSummary } from '../shared/contracts';
import type { CreateRepairInput } from '../shared/validation';

const repairApi: RepairApi = {
  getDashboardSummary: () =>
    ipcRenderer.invoke('dashboard:get-summary') as Promise<DashboardSummary>,
  createRepair: (input: CreateRepairInput) =>
    ipcRenderer.invoke('repairs:create', input) as Promise<RepairSummary>,
};

contextBridge.exposeInMainWorld('repairApi', repairApi);
