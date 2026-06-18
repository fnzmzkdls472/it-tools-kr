import { defineTool } from '../tool';
import FilePdfBox from '~icons/mdi/file-pdf-box';

export const tool = defineTool({
  name: '이미지 PDF 변환기',
  path: '/image-to-pdf',
  description: 'JPG, PNG 등 이미지 파일을 PDF로 변환합니다. 여러 장을 하나의 PDF로 합칠 수 있고, 브라우저에서만 처리되어 안전합니다.',
  keywords: ['image', 'pdf', 'converter', 'jpg', 'png', 'jpg pdf 변환', '이미지 pdf', '사진 pdf', 'png pdf', 'pdf 변환'],
  component: () => import('./image-to-pdf.vue'),
  icon: FilePdfBox,
  createdAt: new Date('2026-06-17'),
});
