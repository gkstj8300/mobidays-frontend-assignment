/**
 * 집행 기간 필터 — Figma `input` 컴포넌트 스타일 적용
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
          text-[#131416]
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
          h-9
          px-3
          py-1.5
          bg-[rgba(255,255,255,0.8)]
          border
          border-[#CED5DB]
          rounded-lg
          text-sm
          font-medium
          text-[#131416]
          outline-none
          transition-colors
          focus:border-[#6096E6]
          cursor-pointer
        `}
      />
      <span className="text-sm text-[#6D7882]">~</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onChange({ start: startDate, end: e.target.value })}
        className={`
          h-9
          px-3
          py-1.5
          bg-[rgba(255,255,255,0.8)]
          border
          border-[#CED5DB]
          rounded-lg
          text-sm
          font-medium
          text-[#131416]
          outline-none
          transition-colors
          focus:border-[#6096E6]
          cursor-pointer
        `}
      />
    </div>
  );
}
