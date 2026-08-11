import { Spinner } from '@/presentation/components/ui/Spinner';
import { formatCurrency, formatDateTimeLocal, formatPercent } from '@/lib/formatters';
import { RECEIVABLE_TYPE_LABELS } from '@/domain/value-objects/enums';
import type { SettlementStatement } from '@/domain/entities/Settlement';

interface Props {
  statements: SettlementStatement[];
  isLoading: boolean;
}

export function StatementTable({ statements, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner size="lg" />
      </div>
    );
  }

  if (statements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm gap-2">
        <p>Nenhuma liquidação encontrada para os filtros selecionados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm min-w-[900px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Data/Hora</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Cedente</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Tipo</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Valor de Face</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Taxa Base</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Valor Líquido</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Moeda Pgto.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {statements.map((s) => (
            <tr key={s.settlementId} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                {formatDateTimeLocal(s.settledAt)}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{s.assignorName}</div>
                <div className="text-xs text-gray-400">{s.assignorDocument}</div>
              </td>
              <td className="px-4 py-3 text-gray-600">{RECEIVABLE_TYPE_LABELS[s.receivableType]}</td>
              <td className="px-4 py-3 text-right tabular-nums text-gray-900">
                {formatCurrency(s.faceValue, s.assetCurrency)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-gray-600">
                {formatPercent(s.baseRate)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums font-semibold text-brand-700">
                {s.presentValueConverted
                  ? formatCurrency(s.presentValueConverted, s.paymentCurrency)
                  : formatCurrency(s.presentValue, s.assetCurrency)}
              </td>
              <td className="px-4 py-3 text-right text-gray-600">{s.paymentCurrency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
