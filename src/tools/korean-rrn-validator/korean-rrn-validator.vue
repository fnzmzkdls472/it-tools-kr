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

const description = `
## 주민등록번호 검증·분석

주민등록번호는 13자리(생년월일 6자리 + 뒤 7자리)로 이루어집니다. 이 도구는 체크섬으로 형식 유효성을 확인하고, 앞부분에서 생년월일·성별·내외국인 여부를 분석합니다.

## 사용 방법

입력칸에 주민등록번호 13자리를 입력하면 체크섬 통과 여부와 생년월일, 만 나이, 성별이 자동으로 표시됩니다.

## 주의: 2020년 10월 이후 발급 번호

2020년 10월부터 발급된 주민등록번호는 뒷자리가 무작위로 부여되어, 기존 체크섬 규칙을 통과하지 않을 수 있습니다. 따라서 '체크섬 불일치'가 곧 '잘못된 번호'를 의미하지는 않습니다.

## 개인정보 안내

입력값은 서버로 전송·저장되지 않고 브라우저 안에서만 처리됩니다. 본 도구는 번호 생성 기능을 제공하지 않으며, 형식 검증·학습 용도로만 사용하세요.
`;
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

    <c-markdown :markdown="description" mt-8 />
  </div>
</template>
