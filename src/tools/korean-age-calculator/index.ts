import CakeVariant from '~icons/mdi/cake-variant';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '만 나이 계산기',
  path: '/korean-age-calculator',
  description: '생년월일로 만 나이, 연 나이, 세는 나이, 띠, 다음 생일까지 남은 일수를 계산합니다. 2023년 만 나이 통일 기준.',
  keywords: ['korean', 'age', 'calculator', 'manage', '만나이', '만 나이', '나이 계산기', '띠', '세는나이'],
  component: () => import('./korean-age-calculator.vue'),
  icon: CakeVariant,
  createdAt: new Date('2026-06-16'),
});
