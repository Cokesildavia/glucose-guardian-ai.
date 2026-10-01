import { useState } from 'react';
import { createRepairSchema } from '../../shared/validation';
import type { CreateRepairInput } from '../../shared/validation';

interface NewRepairDialogProps {
  onClose: () => void;
  onSubmit: (input: CreateRepairInput) => Promise<void>;
}

const inputClassName =
  'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export function NewRepairDialog({ onClose, onSubmit }: NewRepairDialogProps) {
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);
    const result = createRepairSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Revisa los datos del formulario.');
      return;
    }

    setSaving(true);
    try {
      await onSubmit(result.data);
      onClose();
    } catch {
      setError('No se pudo guardar la reparación. Vuelve a intentarlo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-repair-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-blue-700">Recepción de equipo</p>
            <h2 id="new-repair-title" className="mt-1 text-xl font-bold text-slate-900">Nueva reparación</h2>
          </div>
          <button type="button" onClick={onClose} disabled={saving} className="rounded-lg px-2 py-1 text-xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Cerrar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-600">
              Nombre del cliente *
              <input name="customerName" autoFocus maxLength={120} required className={inputClassName} placeholder="Ej. Ana García" />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Teléfono
              <input name="customerPhone" maxLength={40} className={inputClassName} placeholder="Ej. 600 123 456" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-xs font-semibold text-slate-600">
              Tipo de dispositivo *
              <select name="deviceCategory" className={inputClassName} defaultValue="smartphone">
                <option value="smartphone">Móvil</option>
                <option value="tablet">Tablet</option>
                <option value="computer">Ordenador</option>
                <option value="console">Consola</option>
                <option value="other">Otro</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Marca *
              <input name="deviceBrand" maxLength={80} required className={inputClassName} placeholder="Apple" />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Modelo *
              <input name="deviceModel" maxLength={120} required className={inputClassName} placeholder="iPhone 13" />
            </label>
          </div>
          <label className="block text-xs font-semibold text-slate-600">
            Avería descrita por el cliente *
            <textarea name="issue" rows={3} maxLength={2000} required className={`${inputClassName} resize-y`} placeholder="Describe brevemente el problema…" />
          </label>

          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
            <button type="button" onClick={onClose} disabled={saving} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60">
              {saving ? 'Guardando…' : 'Registrar reparación'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
