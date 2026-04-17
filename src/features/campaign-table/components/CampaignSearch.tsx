/**
 * 캠페인명 검색 — 실시간 검색 + 건수 표시
 */

'use client';

import Input from '@/shared/ui/Input';

interface CampaignSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}

export default function CampaignSearch({
  value,
  onChange,
  resultCount,
  totalCount,
}: CampaignSearchProps) {
  return (
    <div
      className={`
        flex
        items-center
        gap-3
      `}
    >
      <div className="w-80">
        <Input
          inputType="search"
          placeholder="캠페인명 검색"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <span className="text-sm text-[#6D7882]">
        {value ? `${resultCount}건` : `${totalCount}건`}
      </span>
    </div>
  );
}
