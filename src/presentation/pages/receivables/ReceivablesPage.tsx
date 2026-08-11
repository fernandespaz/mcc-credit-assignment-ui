import { useState } from 'react';
import { LayoutGrid, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { OperatorPanel } from './components/OperatorPanel';
import { ReceivablesTable } from './components/ReceivablesTable';
import { useReceivables } from '@/application/receivables/useReceivables';

export function ReceivablesPage() {
  const { receivables, isLoading } = useReceivables();
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  const pending = receivables.filter((r) => r.status === 'PENDING').length;
  const settled = receivables.filter((r) => r.status === 'SETTLED').length;

  const stats = [
    {
      label: 'Total',
      value: receivables.length,
      icon: TrendingUp,
      iconBg: 'bg-brand-50',
      iconColor: 'text-brand-600',
      cardBorder: 'border-brand-100',
    },
    {
      label: 'Pendentes',
      value: pending,
      icon: Clock,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      cardBorder: 'border-amber-100',
    },
    {
      label: 'Liquidados',
      value: settled,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      cardBorder: 'border-emerald-100',
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:h-full">
      {/* ── Grid de Transações ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-100 px-6 pt-6 pb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-sm">
              <LayoutGrid className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Recebíveis</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Gestão de operações de cessão de crédito
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map(({ label, value, icon: Icon, iconBg, iconColor, cardBorder }) => (
              <div
                key={label}
                className={`flex items-center gap-3 rounded-xl border ${cardBorder} bg-gray-50/60 px-3.5 py-3`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
                >
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-gray-900 leading-none">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          <ReceivablesTable
            receivables={receivables}
            isLoading={isLoading}
            highlightId={lastCreatedId}
          />
        </div>
      </div>

      {/* ── Painel do Operador ───────────────────────────────────────────── */}
      <aside className="w-full lg:w-[320px] shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white flex flex-col overflow-hidden">
        {/* Gradient header */}
        <div className="shrink-0 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 px-5 py-4">
          <h2 className="text-sm font-semibold text-white">Painel do Operador</h2>
          <p className="text-xs text-brand-200 mt-0.5">Nova operação de cessão</p>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <OperatorPanel onReceivableCreated={(id) => setLastCreatedId(id)} />
        </div>
      </aside>
    </div>
  );
}
