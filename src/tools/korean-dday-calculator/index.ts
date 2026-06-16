import CalendarClock from '~icons/mdi/calendar-clock';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'D-Day 계산기',
  path: '/korean-dday-calculator',
  description: '목표 날짜까지 남은 디데이(D-day)를 계산하거나, 두 날짜 사이의 일수를 계산합니다.',
  keywords: ['korean', 'dday', 'd-day', 'date', 'calculator', '디데이', '디데이 계산기', '날짜 계산', '날짜 계산기'],
  component: () => import('./korean-dday-calculator.vue'),
  icon: CalendarClock,
  createdAt: new Date('2026-06-16'),
});
