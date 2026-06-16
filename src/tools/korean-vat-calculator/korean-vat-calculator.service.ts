const VAT_RATE = 0.1;

export interface VatResult {
  supply: number // 공급가액
  vat: number // 부가세
  total: number // 합계금액 (공급가액 + 부가세)
}

export function parseAmount(raw: string): number {
  const n = Number(String(raw).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function calcFromSupply(supply: number): VatResult {
  const vat = Math.round(supply * VAT_RATE);
  return { supply: Math.round(supply), vat, total: Math.round(supply) + vat };
}

export function calcFromTotal(total: number): VatResult {
  const supply = Math.round(total / (1 + VAT_RATE));
  return { supply, vat: Math.round(total) - supply, total: Math.round(total) };
}

export function formatWon(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`;
}
