<script setup lang="ts">
import { decodeOracleDate } from './oracle-date-decoder.service';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const rawHex = ref('');

const info = computed<CKeyValueListItems>(() => {
  if (rawHex.value.trim() === '') {
    return [];
  }

  const result = decodeOracleDate(rawHex.value);
  if (!result) {
    return [{ label: '상태', value: '⏳ 16진수 7바이트를 입력하세요 (예: 78 7e 06 12 0f 08 33)', showCopyButton: false }];
  }
  if ('error' in result) {
    return [{ label: '오류', value: `❌ ${result.error}`, showCopyButton: false }];
  }

  return [
    { label: '날짜/시간', value: result.formatted },
    { label: '유효성', value: result.valid ? '✅ 정상 범위' : '⚠️ 범위를 벗어난 값 (잘못된 DATE일 수 있음)', showCopyButton: false },
    { label: '분해', value: `${result.year}년 ${result.month}월 ${result.day}일 ${result.hour}시 ${result.minute}분 ${result.second}초`, showCopyButton: false },
    {
      label: '바이트',
      value: result.bytes.map(b => b.toString(16).padStart(2, '0')).join(' '),
      showCopyButton: false,
    },
  ];
});

const examples = ['78 7e 06 12 0f 08 33', '787e06120f0833'];

const description = `
## Oracle DATE 디코더

Oracle의 \`DATE\` 타입은 항상 **7바이트**로 저장되며, 각 바이트가 [세기, 년, 월, 일, 시, 분, 초]를 의미합니다. \`DUMP()\` 결과의 16진수를 입력하면 실제 날짜·시간으로 변환합니다.

## 바이트 의미

- **세기·년도**: \`(1번째 - 100) × 100 + (2번째 - 100)\`. 예) \`78 7e\` → \`(120-100)×100 + (126-100)\` = **2026년**
- **월·일**: 오프셋 없이 그대로. 예) \`06 12\` → 6월 18일
- **시·분·초**: 각 바이트에서 **1을 뺌**. 예) \`0f 08 33\` → 14시 7분 50초

종합 예) \`78 7e 06 12 0f 08 33\` → **2026-06-18 14:07:50**

## 사용 방법

\`DUMP(날짜컬럼)\` 결과의 16진수 7바이트를 붙여넣으세요. 공백·\`0x\` 접두사는 자동 무시됩니다.
`;
</script>

<template>
  <div>
    <c-input-text
      v-model:value="rawHex"
      placeholder="Oracle DATE 16진수 7바이트 (예: 78 7e 06 12 0f 08 33)"
      test-id="oracle-date-input"
    />

    <c-card v-if="info.length > 0" mt-5>
      <c-key-value-list :items="info" data-test-id="oracle-date-info" />
    </c-card>

    <c-card title="예시 (눌러서 복사)" mt-5>
      <div v-for="example in examples" :key="example">
        <c-text-copyable :value="example" font-mono />
      </div>
    </c-card>

    <c-markdown :markdown="description" mt-8 />
  </div>
</template>
