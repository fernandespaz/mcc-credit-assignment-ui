import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import { Button } from '@/presentation/components/ui/Button';
import { Spinner } from '@/presentation/components/ui/Spinner';
import { useSimulateReceivable } from '@/application/receivables/useSimulateReceivable';
import { useExecuteSettlement } from '@/application/settlements/useExecuteSettlement';
import { useDebounce } from '@/lib/useDebounce';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import type { Receivable } from '@/domain/entities/Receivable';

interface Props {
  receivable: Receivable;
  onClose: () => void;
}

export function SimulateModal({ receivable, onClose }: Props) {
  const [baseRateInput, setBaseRateInput] = useState('');
  const debouncedInput = useDebounce(baseRateInput, 600);

  const numericRate =
    debouncedInput !== '' && !isNaN(parseFloat(debouncedInput)) && parseFloat(debouncedInput) >= 0
      ? parseFloat(debouncedInput) / 100
      : null;

  const { simulation, isFetching: simulating } = useSimulateReceivable(receivable.id, numericRate);
  const { executeSettlement, isPending: settling } = useExecuteSettlement();

  async function handleSettle() {
    if (!simulation || numericRate === null) return;
    await executeSettlement({ receivableId: receivable.id, baseRate: numericRate });
    onClose();
  }

  return (
    <Modal open title={`Simular — ${receivable.assignorName}`} onClose={onClose} className="max-w-md">
      <div className="flex flex-col gap-4">
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Tipo:</span>{' '}
            {receivable.type === 'DUPLICATA' ? 'Duplicata Mercantil' : 'Cheque Pré-datado'}
          </p>
          <p>
            <span className="font-medium">Valor de Face:</span>{' '}
            {formatCurrency(receivable.faceValue, receivable.assetCurrency)}
          </p>
          <p>
            <span className="font-medium">Vencimento:</span>{' '}
            {new Date(receivable.maturityDate).toLocaleDateString('pt-BR')}
          </p>
          <p>
            <span className="font-medium">Prazo:</span> {receivable.termMonths} meses
          </p>
        </div>

        <hr className="border-gray-100" />

        <div className="flex flex-col gap-1">
          <label htmlFor="base-rate" className="text-sm font-medium text-gray-700">
            Taxa Base (% a.a.)
          </label>
          <input
            id="base-rate"
            type="number"
            step="0.01"
            min="0"
            placeholder="ex: 13.25"
            value={baseRateInput}
            onChange={(e) => setBaseRateInput(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {(simulating || simulation) && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2.5">
            {simulating ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Spinner size="sm" />
                Calculando…
              </div>
            ) : simulation ? (
              <>
                <Row label="Taxa Base" value={formatPercent(simulation.baseRate)} />
                <Row label="Spread" value={formatPercent(simulation.spread)} />
                {simulation.exchangeRateUsed && (
                  <Row label="Câmbio" value={simulation.exchangeRateUsed.toFixed(4)} />
                )}
                <div className="border-t border-gray-200 pt-2.5 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Valor Líquido</span>
                  <span className="text-lg font-bold text-brand-700">
                    {simulation.presentValueConverted
                      ? formatCurrency(simulation.presentValueConverted, simulation.paymentCurrency)
                      : formatCurrency(simulation.presentValue, simulation.assetCurrency)}
                  </span>
                </div>
              </>
            ) : null}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleSettle}
            loading={settling}
            disabled={!simulation || simulating || settling}
            className="flex-1"
          >
            {settling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Liquidando…
              </>
            ) : (
              'Liquidar'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
