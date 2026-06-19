import { defineTool } from '../tool';
import Hexadecimal from '~icons/mdi/code-tags';

export const tool = defineTool({
  name: '텍스트 HEX 변환기',
  path: '/text-to-hex',
  description: '텍스트를 16진수(HEX) 값으로, 또는 HEX를 텍스트로 변환합니다. UTF-8 기준이라 한글·이모지도 지원합니다.',
  keywords: ['text', 'hex', 'hexadecimal', 'converter', '텍스트', 'hex 변환', '16진수', '헥사', '아스키'],
  component: () => import('./text-to-hex.vue'),
  icon: Hexadecimal,
  createdAt: new Date('2026-06-17'),
});
