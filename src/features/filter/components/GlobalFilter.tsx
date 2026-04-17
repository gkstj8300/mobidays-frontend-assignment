/**
 * 글로벌 필터 — 집행기간 + 상태 + 매체 + 초기화
 */

'use client';

import Button from '@/shared/ui/Button';
import Icon from '@/shared/ui/Icon';

import { useFilterStore } from '../store/useFilterStore';
import DateRangePicker from './DateRangePicker';
import StatusFilter from './StatusFilter';
import PlatformFilter from './PlatformFilter';

export default function GlobalFilter() {
  const dateRange = useFilterStore((state) => state.dateRange);
  const statuses = useFilterStore((state) => state.statuses);
  const platforms = useFilterStore((state) => state.platforms);
  const setDateRange = useFilterStore((state) => state.setDateRange);
  const toggleStatus = useFilterStore((state) => state.toggleStatus);
  const togglePlatform = useFilterStore((state) => state.togglePlatform);
  const reset = useFilterStore((state) => state.reset);

  return (
    <div
      className={`
        flex
        flex-wrap
        items-center
        gap-6
        px-6
        py-4
        bg-white
        border
        border-[#CED5DB]
        rounded-xl
      `}
    >
      <DateRangePicker
        startDate={dateRange.start}
        endDate={dateRange.end}
        onChange={setDateRange}
      />

      <div className="w-px h-6 bg-[#CED5DB]" />

      <StatusFilter
        selected={statuses}
        onToggle={toggleStatus}
      />

      <div className="w-px h-6 bg-[#CED5DB]" />

      <PlatformFilter
        selected={platforms}
        onToggle={togglePlatform}
      />

      <div className="w-px h-6 bg-[#CED5DB]" />

      <Button
        variant="tertiary"
        size="small"
        onClick={reset}
      >
        <Icon name="refresh" size={16} />
        초기화
      </Button>
    </div>
  );
}
