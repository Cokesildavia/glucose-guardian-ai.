import {
  Archive,
  BarChart3,
  Boxes,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Users,
  Wrench,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { label: 'Panel', path: '/', icon: LayoutDashboard, end: true },
  { label: 'Reparaciones', path: '/repairs', icon: ClipboardList },
  { label: 'Clientes', path: '/customers', icon: Users },
  { label: 'Dispositivos', path: '/devices', icon: Wrench },
  { label: 'Herramientas', path: '/inventory', icon: Boxes },
  { label: 'Proveedores', path: '/suppliers', icon: Archive },
  { label: 'Informes', path: '/reports', icon: BarChart3 },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-700 text-white">
            <Wrench size={19} strokeWidth={2.3} />
          </div>
          <div>
            <p className="text-[15px] font-extrabold tracking-tight text-slate-900">Taller Repair</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Gestión de taller</p>
          </div>
        </div>

        <div className="px-4 pt-7">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Espacio de trabajo</p>
          <nav className="space-y-1">
            {navigation.map(({ label, path, icon: Icon, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-800'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={17} strokeWidth={1.9} />
                {label}
                {label === 'Reparaciones' && (
                  <span className="ml-auto rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">—</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto px-4 pb-4">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium ${
                isActive ? 'bg-blue-50 text-blue-800' : 'text-slate-500 hover:bg-slate-50'
              }`
            }
          >
            <Settings size={17} />
            Ajustes
          </NavLink>
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="size-2 rounded-full bg-emerald-500" />
              Modo local activo
            </div>
            <p className="mt-1.5 pl-4 text-[11px] leading-4 text-slate-400">Tus datos permanecen en este equipo.</p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-[5] flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Taller Repair</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-slate-700">Gestión</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden size-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 sm:flex" aria-label="Ayuda">
              <CircleHelp size={18} />
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5">
              <div className="flex size-7 items-center justify-center rounded-md bg-slate-900 text-[10px] font-bold text-white">TR</div>
              <span className="hidden text-xs font-semibold text-slate-700 sm:inline">Mi taller</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9">{children}</main>
      </div>
    </div>
  );
}
