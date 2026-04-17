/**
 * 상태 필터 — 다중 토글 (진행중/일시중지/종료)
 */

'use client';

import type { CampaignStatus } from '@/types/entities';

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
          text-[var(--color-text-primary)]
          whitespace-nowrap
        `}
      >
        상태
      </span>
      {STATUS_OPTIONS.map(({ key, label }) => {
        const isActive = isAllSelected || selected.includes(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className={`
              px-3
              py-1.5
              text-sm
              rounded-full
              border
              transition-colors
              ${
                isActive
                  ? 'bg-[var(--color-primary-light)] border-[var(--color-primary-accent)] text-[var(--color-primary)]'
                  : 'bg-white border-[var(--color-border)] text-[var(--color-text-disabled)]'
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
