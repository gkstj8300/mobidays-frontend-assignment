/**
 * Badge — Figma `tag_state` 컴포넌트 기반
 * status: active / paused / ended / error / info
 * size: sm (18px) / lg (20px)
 */

'use client';

type BadgeStatus = 'active' | 'paused' | 'ended' | 'error' | 'info';
type BadgeSize = 'sm' | 'lg';

interface BadgeProps {
  status: BadgeStatus;
  size?: BadgeSize;
  children: React.ReactNode;
}

const statusStyles: Record<BadgeStatus, string> = {
  active: 'bg-[#DDFFD3] text-[#1C9E34]',
  paused: 'bg-[#FFEFDE] text-[#FF9030]',
  ended: 'bg-[#EBEBEB] text-[#7D7D7D]',
  error: 'bg-[#FFEBEA] text-[#FF6161]',
  info: 'bg-[#E4EFFF] text-[#4586FF]',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'h-[18px] px-1.5 text-[10px] gap-0.5',
  lg: 'h-5 px-2 text-xs gap-1',
};

export default function Badge({
  status,
  size = 'sm',
  children,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-[20px]
        font-medium
        whitespace-nowrap
        ${statusStyles[status]}
        ${sizeStyles[size]}
      `}
    >
      {children}
    </span>
  );
}
