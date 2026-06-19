<script setup lang="ts">
import { hexToText, textToHex } from './text-to-hex.service';
import { useCopy } from '@/composable/copy';

const inputText = ref('');
const hexFromText = computed(() => inputText.value === '' ? '' : textToHex(inputText.value));
const { copy: copyHex } = useCopy({ source: hexFromText });

const inputHex = ref('');
const textFromHex = computed(() => inputHex.value.trim() === '' ? '' : hexToText(inputHex.value));
const { copy: copyText } = useCopy({ source: textFromHex });

const description = `
## 텍스트 ↔ HEX 변환기

텍스트를 16진수(HEX) 값으로, 또는 HEX를 텍스트로 변환합니다. **UTF-8** 인코딩 기준이라 한글·이모지도 정확히 변환됩니다.

## 사용 방법

- **텍스트 → HEX**: 텍스트를 입력하면 각 바이트가 2자리 16진수로 표시됩니다 (예: \`A\` → \`41\`, \`가\` → \`ea b0 80\`).
- **HEX → 텍스트**: 16진수를 입력하면 원래 텍스트로 복원합니다. 공백·줄바꿈·\`0x\` 접두사는 자동으로 무시됩니다.

## 특징

- 브라우저 안에서만 처리되어 안전하며, 가입·설치 없이 무료로 사용할 수 있습니다.
`;
</script>

<template>
  <div>
    <c-card title="텍스트 → HEX">
      <c-input-text
        v-model:value="inputText"
        multiline
        autosize
        autofocus
        raw-text
        label="변환할 텍스트"
        placeholder="예: Hello 안녕하세요"
        test-id="text-to-hex-input"
      />
      <c-input-text
        v-model:value="hexFromText"
        label="HEX 값 (UTF-8)"
        multiline
        raw-text
        readonly
        mt-2
        placeholder="변환된 16진수 값이 여기에 표시됩니다"
        test-id="text-to-hex-output"
      />
      <div mt-2 flex justify-center>
        <c-button :disabled="!hexFromText" @click="copyHex()">
          HEX 복사
        </c-button>
      </div>
    </c-card>

    <c-card title="HEX → 텍스트" mt-5>
      <c-input-text
        v-model:value="inputHex"
        multiline
        autosize
        raw-text
        label="변환할 HEX 값"
        placeholder="예: 48 65 6c 6c 6f"
        test-id="hex-to-text-input"
      />
      <c-input-text
        v-model:value="textFromHex"
        label="텍스트"
        multiline
        raw-text
        readonly
        mt-2
        placeholder="복원된 텍스트가 여기에 표시됩니다"
        test-id="hex-to-text-output"
      />
      <div mt-2 flex justify-center>
        <c-button :disabled="!textFromHex" @click="copyText()">
          텍스트 복사
        </c-button>
      </div>
    </c-card>

    <c-markdown :markdown="description" mt-8 />
  </div>
</template>
