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

const description = `
## 부가가치세(VAT) 계산기

한국의 부가가치세율은 10%입니다. 공급가액(부가세 제외 금액)에 10%를 더하면 합계금액(부가세 포함)이 됩니다. 이 계산기는 양방향으로 계산해 줍니다.

## 사용 방법

- **공급가액 → 합계**: 부가세 별도 금액을 입력하면 부가세와 합계금액을 계산합니다.
- **합계금액 → 공급가액**: 부가세가 포함된 총액을 입력하면 공급가액과 부가세를 역산합니다.

## 계산 공식

- 부가세 = 공급가액 × 10%
- 합계금액 = 공급가액 × 1.1
- 공급가액 = 합계금액 ÷ 1.1 (역산 시)

## 자주 묻는 질문

**영수증 총액에서 부가세만 분리하고 싶어요.** '합계금액 입력' 모드를 선택하고 총액을 넣으면 공급가액과 부가세가 분리되어 표시됩니다.
`;
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

    <c-markdown :markdown="description" mt-8 />
  </div>
</template>
