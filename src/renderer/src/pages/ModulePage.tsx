import { ArrowLeft, Wrench } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';

const sectionNames: Record<string, string> = {
  repairs: 'Reparaciones',
  customers: 'Clientes',
  devices: 'Dispositivos',
  inventory: 'Herramientas',
  suppliers: 'Proveedores',
  reports: 'Informes',
  settings: 'Ajustes',
};

export function ModulePage() {
  const { section = '' } = useParams();
  const title = sectionNames[section] ?? 'Sección';

  return (
    <AppShell>
      <div className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center text-center">
        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <Wrench size={27} />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">En preparación</span>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
          Esta sección se añadirá en una siguiente etapa. Por ahora ya puedes registrar reparaciones desde el panel.
        </p>
        <Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
          <ArrowLeft size={16} />
          Volver al panel
        </Link>
      </div>
    </AppShell>
  );
}
