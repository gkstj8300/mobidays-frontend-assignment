/**
 * 집행 기간 필터 — 날짜 범위 선택
 */

'use client';

import type { DateRange } from '@/types/common';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (range: DateRange) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  return (
    <div
      className={`
        flex
        items-center
        gap-2
      `}
    >
      <span
        className={`
          text-sm
          font-semibold
          text-[var(--color-text-primary)]
          whitespace-nowrap
        `}
      >
        집행기간
      </span>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onChange({ start: e.target.value, end: endDate })}
        className={`
          px-3
          py-1.5
          text-sm
          border
          border-[var(--color-border)]
          rounded-lg
          outline-none
          focus:border-[var(--color-stroke-focused)]
        `}
      />
      <span className="text-sm text-[var(--color-text-disabled)]">~</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onChange({ start: startDate, end: e.target.value })}
        className={`
          px-3
          py-1.5
          text-sm
          border
          border-[var(--color-border)]
          rounded-lg
          outline-none
          focus:border-[var(--color-stroke-focused)]
        `}
      />
    </div>
  );
}
