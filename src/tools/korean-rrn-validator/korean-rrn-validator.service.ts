const CHECK_WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];

interface GenderCenturyInfo {
  century: number
  gender: string
  foreigner: boolean
}

const GENDER_CODE_MAP: Record<string, GenderCenturyInfo> = {
  0: { century: 1800, gender: '여성', foreigner: false },
  9: { century: 1800, gender: '남성', foreigner: false },
  1: { century: 1900, gender: '남성', foreigner: false },
  2: { century: 1900, gender: '여성', foreigner: false },
  3: { century: 2000, gender: '남성', foreigner: false },
  4: { century: 2000, gender: '여성', foreigner: false },
  5: { century: 1900, gender: '남성', foreigner: true },
  6: { century: 1900, gender: '여성', foreigner: true },
  7: { century: 2000, gender: '남성', foreigner: true },
  8: { century: 2000, gender: '여성', foreigner: true },
};

export function getDigits(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 13);
}

export function formatRrn(raw: string): string {
  const d = getDigits(raw);
  return [d.slice(0, 6), d.slice(6, 13)].filter(Boolean).join('-');
}

export interface RrnInfo {
  birthDate?: string
  age?: number
  gender?: string
  foreigner?: boolean
  checksumValid: boolean
}

function parseBirthDate(digits: string): { iso: string; date: Date } | null {
  const info = GENDER_CODE_MAP[digits[6]];
  if (!info) {
    return null;
  }
  const year = info.century + Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const day = Number(digits.slice(4, 6));

  const date = new Date(year, month - 1, day);
  // 실제로 존재하는 날짜인지 확인 (예: 2월 30일 거름)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return { iso, date };
}

function calcKoreanAge(birth: Date): number {
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const beforeBirthday
    = now.getMonth() < birth.getMonth()
    || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthday) {
    age -= 1;
  }
  return age;
}

export function validateChecksum(digits: string): boolean {
  if (digits.length !== 13) {
    return false;
  }
  const n = digits.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += n[i] * CHECK_WEIGHTS[i];
  }
  const check = (11 - (sum % 11)) % 10;
  return check === n[12];
}

export function analyzeRrn(raw: string): RrnInfo | null {
  const digits = getDigits(raw);
  if (digits.length !== 13) {
    return null;
  }

  const info = GENDER_CODE_MAP[digits[6]];
  const parsed = parseBirthDate(digits);

  return {
    birthDate: parsed?.iso,
    age: parsed ? calcKoreanAge(parsed.date) : undefined,
    gender: info?.gender,
    foreigner: info?.foreigner,
    checksumValid: validateChecksum(digits),
  };
}
