/**
 * MSW 핸들러 — json-server API와 동일한 시그니처로 응답
 *
 * 로컬 개발에서는 json-server가 실제 HTTP 서버로 동작하므로 MSW를 사용하지 않는다.
 * 프로덕션(Vercel 등) 배포 환경에서만 브라우저 내에서 fetch를 가로채 동일한 API를 흉내낸다.
 *
 * 핸들러는 와일드카드 경로 패턴을 사용하여 로컬·프로덕션 URL 양쪽 모두에 매칭된다.
 * MAIN.md §2.2 "비동기 통신 필수"의 msw 옵션에 해당하며, 컴포넌트가 db.json을 직접 import
 * 하지 않고 fetch 경로를 유지하므로 명세와 정합한다.
 */

import { http, HttpResponse } from 'msw';

import dbJson from '../../db.json';

import type { ApiCampaign, ApiDailyStat } from '@/types/api';

// 세션 내 가변 상태 — db.json 원본은 변경하지 않고 복사본을 조작한다.
// db.json은 의도적으로 비표준 값(예: "2000000원" 문자열 budget)을 포함하므로
// 경계 계층에서 ApiCampaign/ApiDailyStat 타입으로 캐스팅한다.
// 비표준 값은 이후 normalizers에서 안전하게 처리된다.
const campaigns = dbJson.campaigns.map((c) => ({ ...c })) as unknown as ApiCampaign[];
const dailyStats = dbJson.daily_stats.map((s) => ({ ...s })) as unknown as ApiDailyStat[];

export const handlers = [
  http.get('*/campaigns', () => HttpResponse.json(campaigns)),

  http.get('*/daily_stats', () => HttpResponse.json(dailyStats)),

  http.post('*/campaigns', async ({ request }) => {
    const body = (await request.json()) as ApiCampaign;
    campaigns.push(body);
    return HttpResponse.json(body, { status: 201 });
  }),

  http.post('*/daily_stats', async ({ request }) => {
    const body = (await request.json()) as ApiDailyStat;
    dailyStats.push(body);
    return HttpResponse.json(body, { status: 201 });
  }),

  http.patch('*/campaigns/:id', async ({ params, request }) => {
    const id = String(params.id);
    const patch = (await request.json()) as Partial<ApiCampaign>;
    const idx = campaigns.findIndex((c) => c.id === id);
    if (idx === -1) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }
    campaigns[idx] = { ...campaigns[idx], ...patch };
    return HttpResponse.json(campaigns[idx]);
  }),
];
