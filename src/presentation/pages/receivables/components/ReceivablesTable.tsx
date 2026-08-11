import { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { Spinner } from '@/presentation/components/ui/Spinner';
import { Select } from '@/presentation/components/ui/Select';
import { SimulateModal } from './SimulateModal';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { RECEIVABLE_TYPE_LABELS, ReceivableStatus } from '@/domain/value-objects/enums';
import type { Receivable } from '@/domain/entities/Receivable';
import { cn } from '@/lib/cn';

interface Props {
  receivables: Receivable[];
  isLoading: boolean;
  highlightId?: string | null;
}

const statusConfig: Record<ReceivableStatus, { dot: string; pill: string; label: string }> = {
  PENDING: {
    dot: 'bg-amber-400',
    pill: 'bg-amber-50 text-amber-700 border border-amber-200',
    label: 'Pendente',
  },
  SETTLED: {
    dot: 'bg-emerald-500',
    pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    label: 'Liquidado',
  },
  CANCELLED: {
    dot: 'bg-red-400',
    pill: 'bg-red-50 text-red-700 border border-red-200',
    label: 'Cancelado',
  },
};

const avatarPalette = [
  'bg-violet-100 text-violet-700',
  'bg-blue-100 text-blue-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function avatarColor(name: string): string {
  const code = (name.charCodeAt(0) ?? 0) + (name.charCodeAt(1) ?? 0);
  return avatarPalette[code % avatarPalette.length];
}

const statusFilterOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'PENDING', label: 'Pendente' },
  { value: 'SETTLED', label: 'Liquidado' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

export function ReceivablesTable({ receivables, isLoading, highlightId }: Props) {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selected, setSelected] = useState<Receivable | null>(null);

  const filtered = statusFilter
    ? receivables.filter((r) => r.status === statusFilter)
    : receivables;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">{filtered.length}</span>
          <span className="text-sm text-gray-500">
            recebível{filtered.length !== 1 ? 'is' : ''}
          </span>
          {statusFilter && (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 border border-brand-100">
              filtrado
            </span>
          )}
        </div>
        <Select
          options={statusFilterOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-44 py-1.5"
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-44 rounded-xl border border-dashed border-gray-200 bg-white text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <PlayCircle className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Nenhum recebível encontrado</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Use o painel ao lado para registrar uma operação
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Cedente
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Tipo
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Valor de Face
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Vencimento
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className={cn(
                    'transition-colors',
                    highlightId === r.id
                      ? 'bg-brand-50 ring-1 ring-inset ring-brand-200'
                      : 'hover:bg-gray-50/70',
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                          avatarColor(r.assignorName),
                        )}
                      >
                        {getInitials(r.assignorName)}
                      </span>
                      <span className="font-medium text-gray-900">{r.assignorName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{RECEIVABLE_TYPE_LABELS[r.type]}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-gray-900">
                    {formatCurrency(r.faceValue, r.assetCurrency)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(r.maturityDate)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                        statusConfig[r.status].pill,
                      )}
                    >
                      <span
                        className={cn('h-1.5 w-1.5 rounded-full', statusConfig[r.status].dot)}
                      />
                      {statusConfig[r.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === 'PENDING' && (
                      <button
                        onClick={() => setSelected(r)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100 border border-brand-100 transition-colors"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        Simular
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <SimulateModal receivable={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
