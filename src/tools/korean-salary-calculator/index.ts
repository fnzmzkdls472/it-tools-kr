import CashMultiple from '~icons/mdi/cash-multiple';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '연봉 실수령액 계산기',
  path: '/korean-salary-calculator',
  description: '연봉을 입력하면 4대보험·소득세를 공제한 월/연 실수령액을 계산합니다. 2025년 요율·세율 기준(연말정산 기준 추정).',
  keywords: ['korean', 'salary', 'net', 'calculator', '연봉', '실수령액', '실수령', '월급 계산기', '세후', '4대보험'],
  component: () => import('./korean-salary-calculator.vue'),
  icon: CashMultiple,
  createdAt: new Date('2026-06-16'),
});
