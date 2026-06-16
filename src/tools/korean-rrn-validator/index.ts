import { defineTool } from '../tool';
import CardAccountDetails from '~icons/mdi/card-account-details';

export const tool = defineTool({
  name: '주민등록번호 검증',
  path: '/korean-rrn-validator',
  description: '주민등록번호(13자리)의 체크섬을 검증하고 생년월일·성별·내외국인 여부를 분석합니다. 입력값은 브라우저에서만 처리되며 번호 생성 기능은 없습니다.',
  keywords: ['korean', 'rrn', 'resident', 'registration', 'number', 'validator', '주민등록번호', '주민번호', '검증', '유효성', '생년월일'],
  component: () => import('./korean-rrn-validator.vue'),
  icon: CardAccountDetails,
  createdAt: new Date('2026-06-15'),
});
