/**
 * 매체 필터 — 다중 토글 (Google/Meta/Naver)
 */

'use client';

import type { Platform } from '@/types/entities';

import ToggleChip from '@/shared/ui/ToggleChip';

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
          text-[#131416]
          whitespace-nowrap
        `}
      >
        매체
      </span>
      {PLATFORM_OPTIONS.map(({ key, label }) => (
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
