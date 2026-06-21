import { defineTool } from '../tool';
import CalendarClock from '~icons/mdi/calendar-clock';

export const tool = defineTool({
  name: 'Oracle DATE 디코더',
  path: '/oracle-date-decoder',
  description: 'Oracle DATE 타입의 7바이트 16진수(DUMP 결과)를 실제 날짜·시간으로 변환합니다. 세기·년·월·일·시·분·초 오프셋을 자동 계산합니다.',
  keywords: ['oracle', 'date', 'decoder', 'dump', 'hex', '오라클', '날짜', 'raw', 'database', 'db', '7byte'],
  component: () => import('./oracle-date-decoder.vue'),
  icon: CalendarClock,
  createdAt: new Date('2026-06-17'),
});
