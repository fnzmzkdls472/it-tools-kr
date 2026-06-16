<script setup lang="ts">
import { calcBetween, calcDday, parseDate } from './korean-dday-calculator.service';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const mode = ref<'dday' | 'between'>('dday');
const targetDate = ref('');
const startDate = ref('');
const endDate = ref('');

const result = computed<CKeyValueListItems>(() => {
  if (mode.value === 'dday') {
    if (targetDate.value.replace(/[^0-9]/g, '').length === 0) {
      return [];
    }
    const target = parseDate(targetDate.value);
    if (!target) {
      return [{ label: '상태', value: '⏳ 날짜 8자리 입력 (예: 2026-12-25)', showCopyButton: false }];
    }
    const r = calcDday(target);
    return [
      { label: '디데이', value: r.label },
      {
        label: '설명',
        value: r.daysFromToday > 0
          ? `${r.daysFromToday}일 남음`
          : r.daysFromToday === 0 ? '오늘이에요!' : `${-r.daysFromToday}일 지남`,
        showCopyButton: false,
      },
    ];
  }

  // between
  if (startDate.value.replace(/[^0-9]/g, '').length === 0 || endDate.value.replace(/[^0-9]/g, '').length === 0) {
    return [];
  }
  const start = parseDate(startDate.value);
  const end = parseDate(endDate.value);
  if (!start || !end) {
    return [{ label: '상태', value: '⏳ 시작·종료 날짜를 모두 입력하세요', showCopyButton: false }];
  }
  const r = calcBetween(start, end);
  return [
    { label: '사이 일수', value: `${r.exclusive.toLocaleString('ko-KR')}일` },
    { label: '양 끝 포함', value: `${r.inclusive.toLocaleString('ko-KR')}일`, showCopyButton: false },
  ];
});

const description = `
## D-Day(디데이) 계산기

목표한 날짜까지 며칠 남았는지(D-day), 또는 두 날짜 사이가 며칠인지 계산합니다. 시험일, 기념일, 전역일, 출산 예정일 등 다양한 디데이에 활용하세요.

## 사용 방법

- **디데이 모드**: 목표 날짜를 입력하면 오늘 기준 D-day(예: D-30)와 남은 일수를 보여줍니다. 이미 지난 날짜는 D+로 표시됩니다.
- **사이 일수 모드**: 시작일과 종료일을 입력하면 두 날짜 사이의 일수와 '양 끝 포함' 일수를 함께 계산합니다.

## 자주 묻는 질문

**'사이 일수'와 '양 끝 포함'의 차이는?** 사이 일수는 종료일 − 시작일이고, 양 끝 포함은 시작일과 종료일을 모두 세는 값(+1)입니다. 근무일·숙박일 계산 등 목적에 따라 선택하세요.
`;
</script>

<template>
  <div>
    <c-select
      v-model:value="mode"
      mb-4
      label="계산 방식"
      :options="[
        { label: '디데이 (목표 날짜까지 D-day)', value: 'dday' },
        { label: '두 날짜 사이 일수', value: 'between' },
      ]"
    />

    <c-input-text
      v-if="mode === 'dday'"
      v-model:value="targetDate"
      placeholder="목표 날짜 (예: 2026-12-25)"
      test-id="target-input"
    />

    <template v-else>
      <c-input-text v-model:value="startDate" placeholder="시작 날짜 (예: 2026-01-01)" mb-3 />
      <c-input-text v-model:value="endDate" placeholder="종료 날짜 (예: 2026-12-31)" />
    </template>

    <c-card v-if="result.length > 0" mt-5>
      <c-key-value-list :items="result" data-test-id="dday-result" />
    </c-card>

    <c-markdown :markdown="description" mt-8 />
  </div>
</template>
