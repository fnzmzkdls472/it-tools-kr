const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function parseDate(raw: string): Date | null {
  const digits = raw.replace(/[^0-9]/g, '');
  if (digits.length !== 8) {
    return null;
  }
  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function diffInDays(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY);
}

export interface DdayResult {
  label: string; // D-7, D-Day, D+3
  daysFromToday: number;
}

export function calcDday(target: Date, today: Date = new Date()): DdayResult {
  const diff = diffInDays(today, target);
  let label: string;
  if (diff > 0) {
    label = `D-${diff}`;
  }
  else if (diff === 0) {
    label = 'D-Day';
  }
  else {
    label = `D+${-diff}`;
  }
  return { label, daysFromToday: diff };
}

export interface BetweenResult {
  exclusive: number; // 끝 - 시작 (사이 일수)
  inclusive: number; // 양 끝 포함
}

export function calcBetween(start: Date, end: Date): BetweenResult {
  const exclusive = Math.abs(diffInDays(start, end));
  return { exclusive, inclusive: exclusive + 1 };
}
