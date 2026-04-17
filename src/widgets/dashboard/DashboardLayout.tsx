/**
 * 대시보드 전체 레이아웃 — features 조합
 */

'use client';

import GlobalFilter from '@/features/filter/components/GlobalFilter';

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
          text-[var(--color-text-primary)]
        `}
      >
        마케팅 캠페인 성과 대시보드
      </h1>

      <GlobalFilter />

      {/* Phase 3~7에서 차트, 테이블 등 위젯 추가 예정 */}
    </div>
  );
}
