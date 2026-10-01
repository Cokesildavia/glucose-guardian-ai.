import type { RepairApi } from '../../shared/contracts';

declare global {
  interface Window {
    repairApi: RepairApi;
  }
}

export {};
