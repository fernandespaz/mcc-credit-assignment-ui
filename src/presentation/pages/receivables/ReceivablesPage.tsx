import { useState } from 'react';
import { OperatorPanel } from './components/OperatorPanel';
import { ReceivablesTable } from './components/ReceivablesTable';
import { useReceivables } from '@/application/receivables/useReceivables';

export function ReceivablesPage() {
  const { receivables, isLoading } = useReceivables();
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col lg:flex-row lg:h-full">
      {/* ── Grid de Transações ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">Recebíveis</h1>
          <p className="text-sm text-gray-500 mt-0.5">Grid de transações</p>
        </div>
        <ReceivablesTable
          receivables={receivables}
          isLoading={isLoading}
          highlightId={lastCreatedId}
        />
      </div>

      {/* ── Painel do Operador ───────────────────────────────────────────── */}
      <aside className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white overflow-y-auto p-4 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-900">Painel do Operador</h2>
          <p className="text-xs text-gray-400 mt-0.5">Nova operação de cessão</p>
        </div>
        <OperatorPanel onReceivableCreated={(id) => setLastCreatedId(id)} />
      </aside>
    </div>
  );
}
