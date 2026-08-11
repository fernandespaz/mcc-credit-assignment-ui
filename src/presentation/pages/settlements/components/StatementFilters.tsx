import { Input } from '@/presentation/components/ui/Input';
import { Select } from '@/presentation/components/ui/Select';
import { Button } from '@/presentation/components/ui/Button';
import { CURRENCY_LABELS, Currency } from '@/domain/value-objects/enums';
import type { Assignor } from '@/domain/entities/Assignor';

export interface StatementFilterValues {
  startDate: string;
  endDate: string;
  assignorId: string;
  paymentCurrency: string;
}

interface Props {
  filters: StatementFilterValues;
  assignors: Assignor[];
  onChange: (filters: StatementFilterValues) => void;
  onClear: () => void;
}

const currencyOptions = [
  { value: '', label: 'Todas as moedas' },
  ...Object.values(Currency).map((c) => ({ value: c, label: CURRENCY_LABELS[c] })),
];

export function StatementFilters({ filters, assignors, onChange, onClear }: Props) {
  const assignorOptions = [
    { value: '', label: 'Todos os cedentes' },
    ...assignors.map((a) => ({ value: a.id, label: a.name })),
  ];

  function update(partial: Partial<StatementFilterValues>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 items-end p-4 bg-white rounded-xl border border-gray-200">
      <Input
        label="Data inicial"
        type="date"
        value={filters.startDate}
        onChange={(e) => update({ startDate: e.target.value })}
        className="lg:w-40"
      />
      <Input
        label="Data final"
        type="date"
        value={filters.endDate}
        onChange={(e) => update({ endDate: e.target.value })}
        className="lg:w-40"
      />
      <Select
        label="Cedente"
        options={assignorOptions}
        value={filters.assignorId}
        onChange={(e) => update({ assignorId: e.target.value })}
        className="lg:w-52"
      />
      <Select
        label="Moeda"
        options={currencyOptions}
        value={filters.paymentCurrency}
        onChange={(e) => update({ paymentCurrency: e.target.value })}
        className="lg:w-44"
      />
      <Button variant="secondary" size="md" onClick={onClear} className="self-end w-full sm:w-auto">
        Limpar
      </Button>
    </div>
  );
}
