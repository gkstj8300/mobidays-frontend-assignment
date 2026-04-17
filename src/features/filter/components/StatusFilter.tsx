/**
 * 상태 필터 — 다중 토글 (진행중/일시중지/종료)
 */

'use client';

import type { CampaignStatus } from '@/types/entities';

import ToggleChip from '@/shared/ui/ToggleChip';

import { STATUS_OPTIONS } from '../constants';

interface StatusFilterProps {
  selected: CampaignStatus[];
  onToggle: (status: CampaignStatus) => void;
}

export default function StatusFilter({ selected, onToggle }: StatusFilterProps) {
  const isAllSelected = selected.length === 0;

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
        상태
      </span>
      {STATUS_OPTIONS.map(({ key, label }) => (
        <ToggleChip
          key={key}
          label={label}
          isActive={isAllSelected || selected.includes(key)}
          onClick={() => onToggle(key)}
          size="lg"
        />
      ))}
    </div>
  );
}
