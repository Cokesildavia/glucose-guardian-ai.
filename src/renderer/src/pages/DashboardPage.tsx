import { useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Plus,
  RefreshCw,
  Wrench,
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import type { RepairStatus } from '../../shared/contracts';
import type { CreateRepairInput } from '../../shared/validation';
import { AppShell } from '../components/AppShell';
import { NewRepairDialog } from '../components/NewRepairDialog';
import { useDashboardStore } from '../store/dashboard-store';

const statusLabels: Record<RepairStatus, string> = {
  received: 'Recibido',
  diagnosing: 'En diagnóstico',
  awaiting_parts: 'Esperando pieza',
  in_progress: 'En reparación',
  ready: 'Listo para entregar',
  delivered: 'Entregado',
};

const statusStyles: Record<RepairStatus, string> = {
  received: 'bg-slate-100 text-slate-600',
  diagnosing: 'bg-blue-50 text-blue-700',
  awaiting_parts: 'bg-amber-50 text-amber-700',
  in_progress: 'bg-indigo-50 text-indigo-700',
  ready: 'bg-emerald-50 text-emerald-700',
  delivered: 'bg-slate-100 text-slate-500',
};

function StatCard({
  label,
  value,
  description,
  tone,
  direction,
}: {
  label: string;
  value: number;
  description: string;
  tone: string;
  direction?: 'up' | 'down';
}) {
  const Icon = direction === 'down' ? ArrowDownRight : ArrowUpRight;
  return (
    <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-slate-500">{label}</p>
        <span className={`flex size-8 items-center justify-center rounded-lg ${tone}`}>
          {direction ? <Icon size={16} /> : <Wrench size={16} />}
        </span>
      </div>
      <p className="mt-4 text-[30px] font-bold leading-none tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-[11px] text-slate-400">{description}</p>
    </article>
  );
}

function formatReceivedAt(value: string): string {
  try {
    return formatDistanceToNow(parseISO(value), { addSuffix: true, locale: es });
  } catch {
    return 'Fecha no disponible';
  }
}

export function DashboardPage() {
  const { summary, loading, error, load, addRepair } = useDashboardStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    void load();
  }, [load]);

  async function submitRepair(input: CreateRepairInput) {
    await addRepair(input);
  }

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700">Resumen del negocio</p>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight text-slate-900">Panel de control</h1>
          <p className="mt-1.5 text-sm text-slate-500">Vista general de la actividad de tu taller.</p>
        </div>
        <button onClick={() => setDialogOpen(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-[13px] font-semibold text-white shadow-sm shadow-blue-700/15 transition hover:bg-blue-800">
          <Plus size={17} />
          Nueva reparación
        </button>
      </div>

      {error && (
        <div role="alert" className="mt-6 flex items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={() => void load()} className="inline-flex items-center gap-2 font-semibold hover:text-red-900">
            <RefreshCw size={14} /> Reintentar
          </button>
        </div>
      )}

      <section aria-label="Indicadores" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Órdenes totales" value={summary?.stats.totalRepairs ?? 0} description="Total de órdenes registradas" tone="bg-blue-50 text-blue-700" />
        <StatCard label="En reparación" value={summary?.stats.inProgress ?? 0} description="En diagnóstico o reparación" tone="bg-indigo-50 text-indigo-700" />
        <StatCard label="Esperando piezas" value={summary?.stats.awaitingParts ?? 0} description="Pendientes de material" tone="bg-amber-50 text-amber-700" direction="down" />
        <StatCard label="Listos para entregar" value={summary?.stats.readyForPickup ?? 0} description="Esperando al cliente" tone="bg-emerald-50 text-emerald-700" direction="up" />
      </section>

      <section className="mt-7 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.02]">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Reparaciones recientes</h2>
            <p className="mt-1 text-xs text-slate-400">Últimos equipos registrados en el taller</p>
          </div>
          <Link to="/repairs" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900">
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>

        {loading && !summary ? (
          <div className="space-y-4 p-6" aria-label="Cargando reparaciones">
            {[0, 1, 2].map((row) => <div key={row} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}
          </div>
        ) : summary?.recentRepairs.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                <tr>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Dispositivo</th>
                  <th className="px-6 py-3">Avería</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Recibido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary.recentRepairs.map((repair) => (
                  <tr key={repair.id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-4 text-[13px] font-semibold text-slate-800">{repair.customerName}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-600">{repair.deviceLabel}</td>
                    <td className="max-w-[250px] truncate px-6 py-4 text-[13px] text-slate-500">{repair.issue}</td>
                    <td className="px-6 py-4">
                      <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[repair.status]}`}>
                        {statusLabels[repair.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{formatReceivedAt(repair.receivedAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Wrench size={21} />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-800">Todavía no hay reparaciones</h3>
            <p className="mt-1.5 max-w-xs text-xs leading-5 text-slate-400">Cuando registres un equipo, su información aparecerá aquí.</p>
            <button onClick={() => setDialogOpen(true)} className="mt-4 text-xs font-bold text-blue-700 hover:text-blue-900">
              Registrar la primera reparación
            </button>
          </div>
        )}
      </section>

      <p className="mt-5 text-center text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500" /> Los datos se guardan localmente en este equipo.</span>
      </p>

      {dialogOpen && <NewRepairDialog onClose={() => setDialogOpen(false)} onSubmit={submitRepair} />}
    </AppShell>
  );
}
