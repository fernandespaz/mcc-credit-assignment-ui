// ─── Currency ─────────────────────────────────────────────────────────────────
export const Currency = {
  BRL: 'BRL',
  USD: 'USD',
  EUR: 'EUR',
} as const;
export type Currency = (typeof Currency)[keyof typeof Currency];

// ─── Receivable Type ──────────────────────────────────────────────────────────
export const ReceivableType = {
  DUPLICATA: 'DUPLICATA',
  POST_DATED_CHECK: 'POST_DATED_CHECK',
} as const;
export type ReceivableType = (typeof ReceivableType)[keyof typeof ReceivableType];

// ─── Receivable Status ────────────────────────────────────────────────────────
export const ReceivableStatus = {
  PENDING: 'PENDING',
  SETTLED: 'SETTLED',
  CANCELLED: 'CANCELLED',
} as const;
export type ReceivableStatus = (typeof ReceivableStatus)[keyof typeof ReceivableStatus];

// ─── Spread (business constants) ─────────────────────────────────────────────
export const SPREAD_BY_TYPE: Record<ReceivableType, number> = {
  DUPLICATA: 0.015,
  POST_DATED_CHECK: 0.025,
};

// ─── Labels ───────────────────────────────────────────────────────────────────
export const RECEIVABLE_TYPE_LABELS: Record<ReceivableType, string> = {
  DUPLICATA: 'Duplicata Mercantil',
  POST_DATED_CHECK: 'Cheque Pré-datado',
};

export const RECEIVABLE_STATUS_LABELS: Record<ReceivableStatus, string> = {
  PENDING: 'Pendente',
  SETTLED: 'Liquidado',
  CANCELLED: 'Cancelado',
};

export const CURRENCY_LABELS: Record<Currency, string> = {
  BRL: 'BRL — Real Brasileiro',
  USD: 'USD — Dólar Americano',
  EUR: 'EUR — Euro',
};
