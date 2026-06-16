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
  </div>
</template>
