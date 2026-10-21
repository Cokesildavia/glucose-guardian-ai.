import { create } from 'zustand';
import type { CreateRepairInput } from '../../../shared/validation';
import type { DashboardSummary } from '../../../shared/contracts';

interface DashboardState {
  summary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  addRepair: (input: CreateRepairInput) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  loading: true,
  error: null,
  load: async () => {
    set({ loading: true, error: null });
    try {
      const summary = await window.repairApi.getDashboardSummary();
      set({ summary, loading: false });
    } catch {
      set({ error: 'No se pudo cargar el panel. Reinicia la aplicación e inténtalo de nuevo.', loading: false });
    }
  },
  addRepair: async (input) => {
    await window.repairApi.createRepair(input);
    const summary = await window.repairApi.getDashboardSummary();
    set({ summary, error: null });
  },
}));
