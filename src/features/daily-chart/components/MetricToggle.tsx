/**
 * 메트릭 토글 — 노출수/클릭수 on/off (최소 1개 유지)
 */

'use client';

import ToggleChip from '@/shared/ui/ToggleChip';

interface MetricOption {
  key: string;
  label: string;
}

interface MetricToggleProps {
  options: MetricOption[];
  active: string[];
  onToggle: (key: string) => void;
  minActive?: number;
}

export default function MetricToggle({
  options,
  active,
  onToggle,
  minActive = 1,
}: MetricToggleProps) {
  const handleToggle = (key: string) => {
    if (active.includes(key) && active.length <= minActive) {
      return;
    }
    onToggle(key);
  };

  return (
    <div
      className={`
        flex
        items-center
        gap-1
      `}
    >
      {options.map(({ key, label }) => (
        <ToggleChip
          key={key}
          label={label}
          isActive={active.includes(key)}
          onClick={() => handleToggle(key)}
          size="sm"
        />
      ))}
    </div>
  );
}
