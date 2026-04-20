/**
 * 대시보드 전체 레이아웃 — features 조합
 */

'use client';

import { useState } from 'react';

import GlobalFilter from '@/features/filter/components/GlobalFilter';
import DailyTrendChart from '@/features/daily-chart/components/DailyTrendChart';
import PlatformDonutChart from '@/features/platform-chart/components/PlatformDonutChart';
import CampaignTable from '@/features/campaign-table/components/CampaignTable';
import CampaignFormModal from '@/features/campaign-form/components/CampaignFormModal';

export default function DashboardLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      <PlatformDonutChart />

      <CampaignTable onOpenModal={() => setIsModalOpen(true)} />

      <CampaignFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Phase 7에서 랭킹 차트 추가 예정 */}
    </div>
  );
}
