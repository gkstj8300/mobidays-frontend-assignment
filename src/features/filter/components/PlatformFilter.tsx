/**
 * 매체 필터 — 다중 토글 (Google/Meta/Naver)
 */

'use client';

import type { Platform } from '@/types/entities';

import { PLATFORM_OPTIONS } from '../constants';

interface PlatformFilterProps {
  selected: Platform[];
  onToggle: (platform: Platform) => void;
}

export default function PlatformFilter({ selected, onToggle }: PlatformFilterProps) {
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
        매체
      </span>
      {PLATFORM_OPTIONS.map(({ key, label }) => {
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
