import { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { Badge } from '@/presentation/components/ui/Badge';
import { Button } from '@/presentation/components/ui/Button';
import { Spinner } from '@/presentation/components/ui/Spinner';
import { Select } from '@/presentation/components/ui/Select';
import { SimulateModal } from './SimulateModal';
import { formatCurrency, formatDate } from '@/lib/formatters';
import {
  RECEIVABLE_TYPE_LABELS,
  RECEIVABLE_STATUS_LABELS,
  ReceivableStatus,
} from '@/domain/value-objects/enums';
import type { Receivable } from '@/domain/entities/Receivable';

interface Props {
  receivables: Receivable[];
  isLoading: boolean;
  highlightId?: string | null;
}

const statusBadge: Record<ReceivableStatus, 'warning' | 'success' | 'error'> = {
  PENDING: 'warning',
  SETTLED: 'success',
  CANCELLED: 'error',
};

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
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">
          {filtered.length} recebível{filtered.length !== 1 ? 'is' : ''}
        </p>
        <Select
          options={statusFilterOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-44 py-1.5"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm gap-2">
          <PlayCircle className="h-8 w-8 opacity-40" />
          <p>Nenhum recebível encontrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Cedente</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Tipo</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Valor de Face</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Vencimento</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className={
                    highlightId === r.id
                      ? 'bg-brand-50 ring-1 ring-brand-200'
                      : 'hover:bg-gray-50 transition-colors'
                  }
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{r.assignorName}</td>
                  <td className="px-4 py-3 text-gray-600">{RECEIVABLE_TYPE_LABELS[r.type]}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-900">
                    {formatCurrency(r.faceValue, r.assetCurrency)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(r.maturityDate)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadge[r.status]}>
                      {RECEIVABLE_STATUS_LABELS[r.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === 'PENDING' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelected(r)}
                        className="text-brand-600 hover:text-brand-800"
                      >
                        Simular
                      </Button>
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
