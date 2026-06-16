const ZODIAC = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

export interface AgeResult {
  internationalAge: number; // 만 나이
  countingAge: number; // 세는 나이 (참고)
  yearAge: number; // 연 나이
  zodiac: string; // 띠
  daysUntilBirthday: number; // 다음 생일까지 남은 일수
  daysAlive: number; // 태어난 지 며칠
}

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

export function calculateAge(birth: Date, reference: Date = new Date()): AgeResult {
  const ref = startOfDay(reference);
  const b = startOfDay(birth);

  let internationalAge = ref.getFullYear() - b.getFullYear();
  const hadBirthdayThisYear
    = ref.getMonth() > b.getMonth()
    || (ref.getMonth() === b.getMonth() && ref.getDate() >= b.getDate());
  if (!hadBirthdayThisYear) {
    internationalAge -= 1;
  }

  // 다음 생일
  let nextBirthday = new Date(ref.getFullYear(), b.getMonth(), b.getDate());
  if (nextBirthday < ref) {
    nextBirthday = new Date(ref.getFullYear() + 1, b.getMonth(), b.getDate());
  }
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilBirthday = Math.round((nextBirthday.getTime() - ref.getTime()) / msPerDay);
  const daysAlive = Math.round((ref.getTime() - b.getTime()) / msPerDay);

  const zodiacIndex = (((b.getFullYear() - 2020) % 12) + 12) % 12;

  return {
    internationalAge,
    countingAge: ref.getFullYear() - b.getFullYear() + 1,
    yearAge: ref.getFullYear() - b.getFullYear(),
    zodiac: ZODIAC[zodiacIndex],
    daysUntilBirthday,
    daysAlive,
  };
}
