<script setup lang="ts">
import { analyzeRrn, getDigits } from './korean-rrn-validator.service';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const rawRrn = ref('');

const info = computed<CKeyValueListItems>(() => {
  const digits = getDigits(rawRrn.value);
  if (digits.length === 0) {
    return [];
  }

  const result = analyzeRrn(rawRrn.value);
  if (!result) {
    return [
      {
        label: '상태',
        value: `⏳ 13자리 입력 필요 (현재 ${digits.length}자리)`,
        showCopyButton: false,
      },
    ];
  }

  const birthValid = Boolean(result.birthDate);

  return [
    {
      label: '체크섬',
      value: result.checksumValid ? '✅ 통과' : '❌ 불일치 (2020.10 이후 발급분은 무작위화되어 통과 안 될 수 있음)',
      showCopyButton: false,
    },
    {
      label: '생년월일',
      value: birthValid ? result.birthDate : '❌ 존재하지 않는 날짜',
      showCopyButton: false,
    },
    {
      label: '만 나이',
      value: birthValid ? `만 ${result.age}세` : undefined,
      hideOnNil: true,
      showCopyButton: false,
    },
    {
      label: '성별',
      value: result.gender,
      hideOnNil: true,
      showCopyButton: false,
    },
    {
      label: '내/외국인',
      value: result.foreigner === undefined ? undefined : (result.foreigner ? '외국인' : '내국인'),
      hideOnNil: true,
      showCopyButton: false,
    },
  ];
});
</script>

<template>
  <div>
    <c-alert type="warning" mb-4>
      입력값은 서버로 전송되지 않고 <b>브라우저 안에서만</b> 처리됩니다. 본 도구는 형식·체크섬 검증과 분석용이며, 번호 생성 기능은 제공하지 않습니다.
    </c-alert>

    <c-input-text
      v-model:value="rawRrn"
      placeholder="주민등록번호 13자리를 입력하세요 (예: 900101-1234567)"
      test-id="rrn-input"
    />

    <c-card v-if="info.length > 0" mt-5>
      <c-key-value-list :items="info" data-test-id="rrn-info" />
    </c-card>
  </div>
</template>
