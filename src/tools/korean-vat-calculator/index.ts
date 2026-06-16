import { defineTool } from '../tool';
import Calculator from '~icons/mdi/calculator';

export const tool = defineTool({
  name: '부가가치세 계산기',
  path: '/korean-vat-calculator',
  description: '공급가액 → 부가세·합계금액 계산, 또는 합계금액 → 공급가액 역산. 한국 부가세율 10% 기준.',
  keywords: ['korean', 'vat', 'tax', 'calculator', '부가세', '부가가치세', '공급가액', '계산기', '역산'],
  component: () => import('./korean-vat-calculator.vue'),
  icon: Calculator,
  createdAt: new Date('2026-06-15'),
});
