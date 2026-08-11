import { useQuery } from '@tanstack/react-query';
import type { SettlementStatementFilters } from '@/domain/entities/Settlement';
import { reportRepository } from '@/infrastructure/repositories/ReportHttpRepository';

export const SETTLEMENT_STATEMENT_QUERY_KEY = ['settlement-statement'] as const;

export function useSettlementStatement(filters: SettlementStatementFilters) {
  const { data: statements = [], isLoading, error } = useQuery({
    queryKey: [...SETTLEMENT_STATEMENT_QUERY_KEY, filters],
    queryFn: () => reportRepository.getSettlementStatement(filters),
  });

  return { statements, isLoading, error };
}
