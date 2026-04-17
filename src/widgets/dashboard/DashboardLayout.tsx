/**
 * 대시보드 전체 레이아웃 — features 조합
 */

'use client';

import GlobalFilter from '@/features/filter/components/GlobalFilter';
import DailyTrendChart from '@/features/daily-chart/components/DailyTrendChart';
import CampaignTable from '@/features/campaign-table/components/CampaignTable';

export default function DashboardLayout() {

  return (
    <div
      className={`
        flex
        flex-col
        gap-6
        w-full
        max-w-[1400px]
        mx-auto
        px-6
        py-8
      `}
    >
      <h1
        className={`
          text-2xl
          font-bold
          text-[#131416]
        `}
      >
        마케팅 캠페인 성과 대시보드
      </h1>

      <GlobalFilter />

      <DailyTrendChart />

      <CampaignTable onOpenModal={() => {/* Phase 5에서 모달 연동 */}} />

      {/* Phase 5에서 CampaignFormModal 추가 예정 */}
      {/* Phase 6~7에서 플랫폼 차트, 랭킹 차트 추가 예정 */}
    </div>
  );
}
