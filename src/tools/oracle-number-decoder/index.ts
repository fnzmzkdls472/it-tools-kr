import { defineTool } from '../tool';
import Database from '~icons/mdi/database';

export const tool = defineTool({
  name: 'Oracle NUMBER 디코더',
  path: '/oracle-number-decoder',
  description: 'Oracle NUMBER 타입의 내부 16진수 바이너리(DUMP 결과)를 실제 10진수 값으로 변환합니다. 양수·음수·소수·큰 수를 정밀하게 처리합니다.',
  keywords: ['oracle', 'number', 'decoder', 'dump', 'hex', 'binary', '오라클', '넘버', 'raw', 'database', 'db'],
  component: () => import('./oracle-number-decoder.vue'),
  icon: Database,
  createdAt: new Date('2026-06-17'),
});
