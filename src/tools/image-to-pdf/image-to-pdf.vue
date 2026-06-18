<script setup lang="ts">
import { imagesToPdf } from './image-to-pdf.service';

const files = ref<File[]>([]);
const isConverting = ref(false);
const errorMsg = ref('');

function onFilesUpload(uploaded: File[]) {
  const images = uploaded.filter(f => f.type.startsWith('image/'));
  files.value = [...files.value, ...images];
}

function removeFile(index: number) {
  files.value.splice(index, 1);
}

function clearAll() {
  files.value = [];
}

function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function convertAndDownload() {
  if (files.value.length === 0) {
    return;
  }
  isConverting.value = true;
  errorMsg.value = '';
  try {
    const bytes = await imagesToPdf(files.value);
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'images.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }
  catch (e) {
    errorMsg.value = '변환 중 오류가 발생했습니다. 이미지 파일이 맞는지 확인해주세요.';
  }
  finally {
    isConverting.value = false;
  }
}

const description = `
## 이미지 PDF 변환기 (JPG/PNG → PDF)

JPG, PNG 등 이미지 파일을 PDF로 변환합니다. 여러 장을 한 번에 올리면 **하나의 PDF로 합쳐**지며, 업로드한 순서대로 페이지가 만들어집니다.

## 사용 방법

1. 이미지 파일을 드래그하거나 클릭해서 선택합니다 (여러 장 가능).
2. "PDF로 변환" 버튼을 누르면 PDF가 바로 다운로드됩니다.

## 특징

- **브라우저 안에서만 처리** — 이미지가 서버로 전송되지 않아 안전합니다.
- 가입·설치 없이 무료로 사용할 수 있습니다.
- JPG·PNG는 물론 WebP 등 다른 이미지 형식도 지원합니다.
`;
</script>

<template>
  <div>
    <c-file-upload
      multiple
      accept="image/*"
      title="이미지를 드래그하거나 클릭해서 선택하세요 (여러 장 가능)"
      @files-upload="onFilesUpload"
    />

    <c-card v-if="files.length > 0" mt-4 :title="`선택한 이미지 (${files.length}장)`">
      <div v-for="(file, index) in files" :key="index" class="file-row">
        <span class="file-name">{{ index + 1 }}. {{ file.name }}</span>
        <span class="file-size">{{ formatSize(file.size) }}</span>
        <c-button variant="text" size="small" @click="removeFile(index)">
          삭제
        </c-button>
      </div>

      <div mt-4 flex gap-3>
        <c-button :loading="isConverting" :disabled="isConverting" @click="convertAndDownload">
          PDF로 변환 및 다운로드
        </c-button>
        <c-button variant="text" :disabled="isConverting" @click="clearAll">
          전체 지우기
        </c-button>
      </div>
    </c-card>

    <c-alert v-if="errorMsg" type="warning" mt-4>
      {{ errorMsg }}
    </c-alert>

    <c-markdown :markdown="description" mt-8 />
  </div>
</template>

<style lang="less" scoped>
.file-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(128, 128, 128, 0.12);

  .file-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-size {
    font-size: 12px;
    opacity: 0.6;
  }
}
</style>
