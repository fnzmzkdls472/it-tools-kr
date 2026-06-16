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

const description = `
## 사업자등록번호 검증이란?

사업자등록번호는 10자리 숫자(XXX-XX-XXXXX)로 이루어지며, 마지막 자리는 앞 9자리로 계산되는 검증용 숫자(체크섬)입니다. 이 도구는 그 체크섬 규칙으로 번호가 형식상 올바른지 즉시 확인합니다.

## 사용 방법

1. 입력칸에 사업자등록번호 10자리를 입력하세요. (하이픈은 있어도 없어도 됩니다)
2. 유효성, 사업자 구분(개인/법인·과세/면세), 표준 형식이 자동으로 표시됩니다.

## 사업자 구분 보는 법

번호의 4~5번째 자리로 사업자 유형을 알 수 있습니다. 01~79는 개인 과세사업자, 90~99는 개인 면세사업자, 81·86·87·88은 영리법인 본점, 85는 영리법인 지점입니다.

## 자주 묻는 질문

**실제로 등록된 사업자인지도 확인되나요?** 아니요. 이 도구는 번호의 형식·체크섬만 검증합니다. 실제 등록·휴폐업 여부는 국세청 홈택스의 '사업자등록 상태 조회'에서 확인하세요.

**입력한 번호가 저장되나요?** 아니요. 모든 계산은 브라우저 안에서만 이루어지며 서버로 전송되지 않습니다.
`;
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

    <c-markdown :markdown="description" mt-8 />
  </div>
</template>
