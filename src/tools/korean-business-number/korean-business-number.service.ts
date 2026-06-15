const WEIGHTS = [1, 3, 7, 1, 3, 7, 1, 3, 5];

export function getDigits(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 10);
}

export function formatBusinessNumber(raw: string): string {
  const d = getDigits(raw);
  const parts = [d.slice(0, 3), d.slice(3, 5), d.slice(5, 10)].filter(Boolean);
  return parts.join('-');
}

export function validateBusinessNumber(raw: string): boolean {
  const d = getDigits(raw);
  if (d.length !== 10) {
    return false;
  }

  const n = d.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += n[i] * WEIGHTS[i];
  }
  // 9번째 자리(index 8)에 5를 곱한 값의 10의 자리를 더한다
  sum += Math.floor((n[8] * 5) / 10);

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === n[9];
}

export function getBusinessType(raw: string): string {
  const d = getDigits(raw);
  if (d.length !== 10) {
    return '';
  }

  const code = Number(d.slice(3, 5));
  if (code >= 1 && code <= 79) {
    return '개인 과세사업자';
  }
  if (code === 80) {
    return '다단계판매원';
  }
  if (code >= 90 && code <= 99) {
    return '개인 면세사업자';
  }
  if (code === 89) {
    return '법인이 아닌 종교단체 등';
  }
  if ([81, 86, 87, 88].includes(code)) {
    return '영리법인의 본점';
  }
  if (code === 85) {
    return '영리법인의 지점';
  }
  if (code === 82) {
    return '비영리법인의 본·지점';
  }
  if (code === 83) {
    return '국가·지방자치단체·지방자치단체조합';
  }
  if (code === 84) {
    return '외국법인의 본·지점';
  }
  return '기타/미지정';
}
