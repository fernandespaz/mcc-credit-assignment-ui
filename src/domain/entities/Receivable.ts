import type { Currency, ReceivableStatus, ReceivableType } from '@/domain/value-objects/enums';

export interface Receivable {
  id: string;
  assignorId: string;
  assignorName: string;
  type: ReceivableType;
  faceValue: number;
  assetCurrency: Currency;
  paymentCurrency: Currency;
  crossCurrency: boolean;
  maturityDate: string;
  termMonths: number;
  status: ReceivableStatus;
  createdAt: string;
}

export interface CreateReceivablePayload {
  assignorId: string;
  type: ReceivableType;
  faceValue: number;
  assetCurrency: Currency;
  paymentCurrency: Currency;
  maturityDate: string;
  termMonths: number;
}

export interface PresentValueResult {
  receivableType: ReceivableType;
  faceValue: number;
  assetCurrency: Currency;
  baseRate: number;
  spread: number;
  termMonths: number;
  presentValue: number;
  exchangeRateUsed: number | null;
  presentValueConverted: number | null;
  paymentCurrency: Currency;
}
