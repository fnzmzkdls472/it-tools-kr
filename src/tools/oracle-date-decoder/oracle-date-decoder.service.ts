// Oracle DATE 타입은 항상 7바이트: [세기, 년, 월, 일, 시, 분, 초]
// 년도 = (b0-100)*100 + (b1-100), 월=b2, 일=b3, 시=b4-1, 분=b5-1, 초=b6-1

export interface OracleDateResult {
  formatted: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  bytes: number[];
  valid: boolean;
}

export function parseHexBytes(input: string): number[] {
  const clean = input.replace(/0x/gi, '').replace(/[^0-9a-f]/gi, '');
  const even = clean.slice(0, clean.length - (clean.length % 2));
  const bytes: number[] = [];
  for (let i = 0; i < even.length; i += 2) {
    bytes.push(Number.parseInt(even.slice(i, i + 2), 16));
  }
  return bytes;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function decodeOracleDate(input: string): OracleDateResult | { error: string } | null {
  const bytes = parseHexBytes(input);
  if (bytes.length === 0) {
    return null;
  }
  if (bytes.length !== 7) {
    return { error: `Oracle DATE는 7바이트여야 합니다 (현재 ${bytes.length}바이트)` };
  }

  const [b0, b1, b2, b3, b4, b5, b6] = bytes;
  const year = (b0 - 100) * 100 + (b1 - 100);
  const month = b2;
  const day = b3;
  const hour = b4 - 1;
  const minute = b5 - 1;
  const second = b6 - 1;

  const valid
    = month >= 1 && month <= 12
    && day >= 1 && day <= 31
    && hour >= 0 && hour <= 23
    && minute >= 0 && minute <= 59
    && second >= 0 && second <= 59;

  return {
    formatted: `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`,
    year,
    month,
    day,
    hour,
    minute,
    second,
    bytes,
    valid,
  };
}
