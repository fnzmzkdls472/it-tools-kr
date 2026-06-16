<script setup lang="ts">
import { calculateAge, parseDate } from './korean-age-calculator.service';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const rawBirth = ref('');

const result = computed<CKeyValueListItems>(() => {
  const digits = rawBirth.value.replace(/[^0-9]/g, '');
  if (digits.length === 0) {
    return [];
  }

  const birth = parseDate(rawBirth.value);
  if (!birth) {
    return [
      {
        label: '상태',
        value: digits.length < 8 ? `⏳ 생년월일 8자리 입력 (현재 ${digits.length}자리)` : '❌ 존재하지 않는 날짜',
        showCopyButton: false,
      },
    ];
  }

  const r = calculateAge(birth);
  return [
    { label: '만 나이', value: `만 ${r.internationalAge}세` },
    { label: '연 나이', value: `${r.yearAge}세 (올해 - 출생연도)`, showCopyButton: false },
    { label: '세는 나이 (참고)', value: `${r.countingAge}세`, showCopyButton: false },
    { label: '띠', value: `${r.zodiac}띠`, showCopyButton: false },
    { label: '다음 생일까지', value: r.daysUntilBirthday === 0 ? '오늘이 생일이에요! 🎂' : `${r.daysUntilBirthday}일 남음`, showCopyButton: false },
    { label: '태어난 지', value: `${r.daysAlive.toLocaleString('ko-KR')}일`, showCopyButton: false },
  ];
});

const description = `
## 만 나이 계산기

2023년 6월 28일부터 법적·행정상 나이가 '만 나이'로 통일되었습니다. 이 계산기는 생년월일로 만 나이를 비롯해 연 나이, 세는 나이, 띠, 다음 생일까지 남은 날을 한 번에 알려줍니다.

## 만 나이 계산법

- **만 나이** = 올해 연도 − 출생 연도. 단, 올해 생일이 아직 지나지 않았으면 1을 뺍니다.
- **연 나이** = 올해 연도 − 출생 연도 (생일과 무관).
- **세는 나이(옛 한국식)** = 올해 연도 − 출생 연도 + 1.

## 사용 방법

생년월일을 입력하면 모든 나이와 띠가 자동으로 계산됩니다. (예: 1990-01-01)

## 자주 묻는 질문

**어떤 나이를 써야 하나요?** 2023년 6월부터는 법령·계약·문서에서 별도 표기가 없으면 모두 만 나이를 사용합니다.
`;
</script>

<template>
  <div>
    <c-input-text
      v-model:value="rawBirth"
      placeholder="생년월일을 입력하세요 (예: 1990-01-01)"
      test-id="birth-input"
    />

    <c-card v-if="result.length > 0" mt-5>
      <c-key-value-list :items="result" data-test-id="age-result" />
    </c-card>

    <c-alert type="warning" mt-5>
      2023년 6월부터 법적·행정상 나이가 <b>만 나이</b>로 통일되었습니다. 별도 표기가 없으면 만 나이를 사용하세요.
    </c-alert>

    <c-markdown :markdown="description" mt-8 />
  </div>
</template>
