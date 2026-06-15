<script setup lang="ts">
import { calcFromSupply, calcFromTotal, formatWon, parseAmount } from './korean-vat-calculator.service';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const mode = ref<'supply' | 'total'>('supply');
const rawAmount = ref('');

const result = computed<CKeyValueListItems>(() => {
  const amount = parseAmount(rawAmount.value);

  if (amount <= 0) {
    return [];
  }

  const { supply, vat, total } = mode.value === 'supply' ? calcFromSupply(amount) : calcFromTotal(amount);

  return [
    { label: '공급가액', value: formatWon(supply) },
    { label: '부가세 (10%)', value: formatWon(vat) },
    { label: '합계금액', value: formatWon(total) },
  ];
});
</script>

<template>
  <div>
    <c-select
      v-model:value="mode"
      mb-4
      label="입력 기준"
      :options="[
        { label: '공급가액 입력 → 부가세·합계 계산', value: 'supply' },
        { label: '합계금액 입력 → 공급가액·부가세 역산', value: 'total' },
      ]"
    />

    <c-input-text
      v-model:value="rawAmount"
      :placeholder="mode === 'supply' ? '공급가액을 입력하세요 (예: 1000000)' : '합계금액을 입력하세요 (예: 1100000)'"
      test-id="vat-input"
    />

    <c-card v-if="result.length > 0" mt-5>
      <c-key-value-list :items="result" data-test-id="vat-result" />
    </c-card>
  </div>
</template>
