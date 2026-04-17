/**
 * Icon — Figma 아이콘 시스템 기반 (18px 기본, stroke 기반)
 */

'use client';

type IconName =
  | 'search'
  | 'close'
  | 'calendar'
  | 'arrow-down'
  | 'arrow-up'
  | 'arrow-left'
  | 'arrow-right'
  | 'filter'
  | 'chart'
  | 'check'
  | 'refresh'
  | 'plus'
  | 'sort-asc'
  | 'sort-desc';

type IconSize = 16 | 18 | 20 | 24;

interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
}

const paths: Record<IconName, string> = {
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  close: 'M6 18L18 6M6 6l12 12',
  calendar:
    'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  'arrow-down': 'M19 9l-7 7-7-7',
  'arrow-up': 'M5 15l7-7 7 7',
  'arrow-left': 'M15 19l-7-7 7-7',
  'arrow-right': 'M9 5l7 7-7 7',
  filter: 'M3 4h18M7 9h10M10 14h4',
  chart: 'M9 19V13M5 19V16M13 19V9M17 19V4',
  check: 'M5 13l4 4L19 7',
  refresh:
    'M4 4v5h5M20 20v-5h-5M20.49 9A9 9 0 005.64 5.64L4 4m16 16l-1.64-1.64A9 9 0 014.51 15',
  plus: 'M12 4v16m8-8H4',
  'sort-asc': 'M5 15l7-7 7 7',
  'sort-desc': 'M19 9l-7 7-7-7',
};

export default function Icon({
  name,
  size = 18,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  );
}
