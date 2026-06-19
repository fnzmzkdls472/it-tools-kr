// Oracle NUMBER 내부 바이너리 포맷(hex) → 10진수 변환
// 양수: 지수 = b0 - 193, mantissa 바이트 - 1 (base-100 자릿수)
// 음수: 지수 = 62 - b0, mantissa 101 - 바이트 (종료바이트 0x66 제외)
// 0   : 0x80
// 값 = base-100 자릿수들을 BigInt로 모은 뒤 100^(지수-위치)만큼 자리 이동 → 정밀

export interface OracleNumberResult {
  value: string;
  sign: '+' | '-' | '0';
  exponentBase100: number;
  bytes: number[];
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

// base-100 자릿수(d[0]이 최상위) + 지수 → 정확한 10진수 문자열
function buildDecimalString(digits: number[], exponent: number, negative: boolean): string {
  if (digits.length === 0) {
    return '0';
  }

  // base-100 자릿수를 하나의 정수(BigInt)로
  let n = 0n;
  for (const d of digits) {
    n = n * 100n + BigInt(d);
  }

  // 실제 값 = n × 100^shift
  const shift = exponent - (digits.length - 1);

  let intPart: string;
  let fracPart = '';

  if (shift >= 0) {
    intPart = n.toString() + '00'.repeat(shift);
  }
  else {
    const decShift = 2 * -shift;
    let s = n.toString();
    if (s.length <= decShift) {
      s = s.padStart(decShift + 1, '0');
    }
    intPart = s.slice(0, s.length - decShift);
    fracPart = s.slice(s.length - decShift).replace(/0+$/, '');
  }

  intPart = intPart.replace(/^0+(?=\d)/, '');
  const result = fracPart ? `${intPart}.${fracPart}` : intPart;

  if (result === '0') {
    return '0';
  }
  return (negative ? '-' : '') + result;
}

export function decodeOracleNumber(input: string): OracleNumberResult | null {
  const bytes = parseHexBytes(input);
  if (bytes.length === 0) {
    return null;
  }

  const b0 = bytes[0];

  if (b0 === 0x80) {
    return { value: '0', sign: '0', exponentBase100: 0, bytes };
  }

  const positive = (b0 & 0x80) !== 0;
  let exponent: number;
  let digits: number[];

  if (positive) {
    exponent = b0 - 193;
    digits = bytes.slice(1).map(b => b - 1);
  }
  else {
    exponent = 62 - b0;
    digits = bytes.slice(1).filter(b => b !== 0x66).map(b => 101 - b);
  }

  return {
    value: buildDecimalString(digits, exponent, !positive),
    sign: positive ? '+' : '-',
    exponentBase100: exponent,
    bytes,
  };
}
