/**
 * 집행 기간 필터 — DatePicker 공통 컴포넌트 사용
 */

'use client';

import type { DateRange } from '@/types/common';

import DatePicker from '@/shared/ui/DatePicker';

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
      <DatePicker
        value={startDate}
        onChange={(date) => onChange({ start: date, end: endDate })}
        placeholder="시작일"
      />
      <span className="text-sm text-[#6D7882]">~</span>
      <DatePicker
        value={endDate}
        onChange={(date) => onChange({ start: startDate, end: date })}
        placeholder="종료일"
      />
    </div>
  );
}
