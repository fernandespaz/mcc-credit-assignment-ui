import type { SettlementStatement, SettlementStatementFilters } from '@/domain/entities/Settlement';

export interface IReportRepository {
  getSettlementStatement(filters: SettlementStatementFilters): Promise<SettlementStatement[]>;
}
