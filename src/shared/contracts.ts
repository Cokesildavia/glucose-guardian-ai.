import type { CreateRepairInput } from './validation';

export type RepairStatus =
  | 'received'
  | 'diagnosing'
  | 'awaiting_parts'
  | 'in_progress'
  | 'ready'
  | 'delivered';

export interface RepairSummary {
  id: string;
  customerName: string;
  deviceLabel: string;
  issue: string;
  status: RepairStatus;
  receivedAt: string;
}

export interface DashboardStats {
  totalRepairs: number;
  inProgress: number;
  awaitingParts: number;
  readyForPickup: number;
}

export interface DashboardSummary {
  stats: DashboardStats;
  recentRepairs: RepairSummary[];
}

export interface HardwareAvailability {
  available: boolean;
  reason?: string;
}

export interface RepairApi {
  getDashboardSummary(): Promise<DashboardSummary>;
  createRepair(input: CreateRepairInput): Promise<RepairSummary>;
}
