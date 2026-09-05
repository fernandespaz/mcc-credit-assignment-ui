import { useState } from 'react';
import { StatementFilters, type StatementFilterValues } from './components/StatementFilters';
import { StatementTable } from './components/StatementTable';
import { Pagination } from '@/presentation/components/ui/Pagination';
import { useSettlementStatement } from '@/application/settlements/useSettlementStatement';
import { useAssignors } from '@/application/assignors/useAssignors';
import type { Currency } from '@/domain/value-objects/enums';

const PAGE_SIZE = 20;

const DEFAULT_FILTERS: StatementFilterValues = {
  startDate: '',
  endDate: '',
  assignorId: '',
  paymentCurrency: '',
};

export function SettlementStatementPage() {
  const [filters, setFilters] = useState<StatementFilterValues>(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);

  const { assignors } = useAssignors();
  const { statements, isLoading } = useSettlementStatement({
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    assignorId: filters.assignorId || undefined,
    paymentCurrency: (filters.paymentCurrency as Currency) || undefined,
    page,
    size: PAGE_SIZE,
  });

  function handleFiltersChange(updated: StatementFilterValues) {
    setFilters(updated);
    setPage(0);
  }

  function handleClear() {
    setFilters(DEFAULT_FILTERS);
    setPage(0);
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500 mt-0.5">Extrato de liquidações — relatório consolidado de cessões liquidadas</p>
      </div>

      <StatementFilters
        filters={filters}
        assignors={assignors}
        onChange={handleFiltersChange}
        onClear={handleClear}
      />

      <StatementTable statements={statements} isLoading={isLoading} />

      {!isLoading && (
        <Pagination
          page={page}
          hasNextPage={statements.length === PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
