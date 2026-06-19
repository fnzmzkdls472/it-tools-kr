<script setup lang="ts">
import { decodeOracleNumber } from './oracle-number-decoder.service';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const rawHex = ref('');

const info = computed<CKeyValueListItems>(() => {
  if (rawHex.value.trim() === '') {
    return [];
  }

  const result = decodeOracleNumber(rawHex.value);
  if (!result) {
    return [{ label: '상태', value: '⏳ 16진수 바이트를 입력하세요 (예: c1 0d)', showCopyButton: false }];
  }

  const signLabel = result.sign === '0' ? '0 (영)' : result.sign === '+' ? '양수 (+)' : '음수 (−)';

  return [
    { label: '10진수 값', value: result.value },
    { label: '부호', value: signLabel, showCopyButton: false },
    { label: '지수 (base-100)', value: String(result.exponentBase100), showCopyButton: false },
    {
      label: '바이트 분해',
      value: result.bytes.map(b => b.toString(16).padStart(2, '0')).join(' '),
      showCopyButton: false,
    },
  ];
});

const examples = ['c1 0d', 'c2 02 18', 'c1 0d 23', '3e 59 66'];

const description = `
## Oracle NUMBER 디코더

Oracle의 \`NUMBER\` 타입은 내부적으로 독특한 바이너리 포맷(base-100)으로 저장됩니다. \`DUMP()\` 함수나 raw 덤프에서 나온 16진수 바이트를 입력하면 실제 10진수 값으로 변환합니다.

## 포맷 설명

- **첫 바이트** = 지수(부호 포함). 양수면 \`b0 - 193\`, 음수면 \`62 - b0\` 이 base-100 지수입니다.
- **나머지 바이트** = 가수(mantissa). 양수는 \`바이트 - 1\`, 음수는 \`101 - 바이트\` 가 각 base-100 자릿수입니다. (음수는 끝에 종료 바이트 \`0x66\`)
- **0** 은 \`0x80\` 한 바이트로 저장됩니다.

예) \`c1 0d\` → 지수 \`0xc1 - 193 = 0\`, 가수 \`0x0d - 1 = 12\` → **12**

## 사용 방법

\`DUMP(컬럼)\` 결과의 16진수 바이트를 그대로 붙여넣으세요. 공백·쉼표·\`0x\` 접두사는 자동으로 무시됩니다. 큰 수·소수도 정밀하게 변환됩니다.
`;
</script>

<template>
  <div>
    <c-input-text
      v-model:value="rawHex"
      placeholder="Oracle NUMBER 16진수 바이트 (예: c1 0d)"
      test-id="oracle-number-input"
    />

    <c-card v-if="info.length > 0" mt-5>
      <c-key-value-list :items="info" data-test-id="oracle-number-info" />
    </c-card>

    <c-card title="예시 (눌러서 복사)" mt-5>
      <div v-for="example in examples" :key="example">
        <c-text-copyable :value="example" font-mono />
      </div>
    </c-card>

    <c-markdown :markdown="description" mt-8 />
  </div>
</template>
