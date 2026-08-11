import type { Currency, ReceivableType } from '@/domain/value-objects/enums';

export interface Settlement {
  id: string;
  receivableId: string;
  receivableType: ReceivableType;
  assignorId: string;
  assignorName: string;
  faceValue: number;
  baseRate: number;
  spread: number;
  presentValue: number;
  assetCurrency: Currency;
  exchangeRateUsed: number | null;
  presentValueConverted: number | null;
  paymentCurrency: Currency;
  settledAt: string;
}

export interface ExecuteSettlementPayload {
  receivableId: string;
  baseRate: number;
}

export interface SettlementStatement {
  settlementId: string;
  settledAt: string;
  assignorId: string;
  assignorName: string;
  assignorDocument: string;
  receivableId: string;
  receivableType: ReceivableType;
  faceValue: number;
  assetCurrency: Currency;
  baseRate: number;
  presentValue: number;
  exchangeRateUsed: number | null;
  presentValueConverted: number | null;
  paymentCurrency: Currency;
}

export interface SettlementStatementFilters {
  startDate?: string;
  endDate?: string;
  assignorId?: string;
  paymentCurrency?: Currency;
  page: number;
  size: number;
}
