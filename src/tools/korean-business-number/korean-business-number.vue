<script setup lang="ts">
import { formatBusinessNumber, getBusinessType, getDigits, validateBusinessNumber } from './korean-business-number.service';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const rawNumber = ref('');

const info = computed<CKeyValueListItems>(() => {
  const digits = getDigits(rawNumber.value);

  if (digits.length === 0) {
    return [];
  }

  const isComplete = digits.length === 10;
  const isValid = validateBusinessNumber(rawNumber.value);

  return [
    {
      label: '유효성',
      value: isComplete ? (isValid ? '✅ 유효한 사업자등록번호' : '❌ 유효하지 않은 번호') : `⏳ 10자리 입력 필요 (현재 ${digits.length}자리)`,
      showCopyButton: false,
    },
    {
      label: '사업자 구분',
      value: isComplete ? getBusinessType(rawNumber.value) : undefined,
      hideOnNil: true,
      showCopyButton: false,
    },
    {
      label: '표준 형식',
      value: isComplete ? formatBusinessNumber(rawNumber.value) : undefined,
      hideOnNil: true,
    },
  ];
});

const examples = ['220-81-62517', '101-81-43223', '124-81-00998'];
</script>

<template>
  <div>
    <c-input-text
      v-model:value="rawNumber"
      placeholder="사업자등록번호를 입력하세요 (예: 123-45-67890)"
      test-id="biz-number-input"
    />

    <c-card v-if="info.length > 0" mt-5>
      <c-key-value-list :items="info" data-test-id="biz-number-info" />
    </c-card>

    <c-card title="예시 번호" mt-5>
      <div v-for="example in examples" :key="example">
        <c-text-copyable :value="example" font-mono />
      </div>
    </c-card>
  </div>
</template>
