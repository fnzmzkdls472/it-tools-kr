import { defineTool } from '../tool';
import OfficeBuilding from '~icons/mdi/office-building';

export const tool = defineTool({
  name: '사업자등록번호 검증',
  path: '/korean-business-number',
  description: '한국 사업자등록번호(10자리)의 유효성을 체크섬으로 검증하고, 사업자 구분(개인/법인/과세/면세)을 확인합니다.',
  keywords: ['korean', 'business', 'registration', 'number', 'validator', '사업자등록번호', '사업자', '검증', '유효성'],
  component: () => import('./korean-business-number.vue'),
  icon: OfficeBuilding,
  createdAt: new Date('2026-06-15'),
});
