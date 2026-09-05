import type { SettlementStatement, SettlementStatementFilters } from '@/domain/entities/Settlement';
import type { IReportRepository } from '@/domain/ports/IReportRepository';
import { apiClient } from '@/infrastructure/http/apiClient';

export class ReportHttpRepository implements IReportRepository {
  async getSettlementStatement(filters: SettlementStatementFilters): Promise<SettlementStatement[]> {
    const { startDate, endDate, assignorId, paymentCurrency, page, size } = filters;

    const params: Record<string, string | number> = { page, size };
    if (startDate) params['startDate'] = `${startDate}T00:00:00`;
    if (endDate) params['endDate'] = `${endDate}T23:59:59`;
    if (assignorId) params['assignorId'] = assignorId;
    if (paymentCurrency) params['paymentCurrency'] = paymentCurrency;

    const { data } = await apiClient.get<SettlementStatement[]>(
      '/api/v1/reports/settlement-statement',
      { params },
    );
    return data;
  }
}

export const reportRepository = new ReportHttpRepository();
