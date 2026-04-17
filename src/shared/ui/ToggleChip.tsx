/**
 * ToggleChip — Figma `Tap-BK` 컴포넌트 기반
 * pill shape (9999px), 토글 선택 상태
 * size: sm (24) / lg (32)
 */

'use client';

type ToggleChipSize = 'sm' | 'lg';

interface ToggleChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  size?: ToggleChipSize;
}

const sizeStyles: Record<ToggleChipSize, string> = {
  sm: 'px-2 py-[5px] text-xs w-24',
  lg: 'px-2 py-[5px] text-sm h-8 min-w-[100px]',
};

export default function ToggleChip({
  label,
  isActive,
  onClick,
  size = 'lg',
}: ToggleChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        font-medium
        transition-colors
        cursor-pointer
        ${sizeStyles[size]}
        ${
          isActive
            ? 'bg-[#33363D] text-white'
            : 'bg-transparent text-[#464C53] hover:bg-[rgba(51,54,61,0.1)]'
        }
      `}
    >
      {label}
    </button>
  );
}
