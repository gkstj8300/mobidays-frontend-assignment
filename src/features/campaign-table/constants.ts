/**
 * 캠페인 테이블 도메인 상수
 */

export const SORTABLE_COLUMNS = ['period', 'totalCost', 'ctr', 'cpc', 'roas'] as const;

export type SortableColumn = (typeof SORTABLE_COLUMNS)[number];

export const COLUMN_LABELS: Record<string, string> = {
  name: '캠페인명',
  status: '상태',
  platform: '매체',
  period: '집행기간',
  totalCost: '집행금액',
  ctr: 'CTR (%)',
  cpc: 'CPC (원)',
  roas: 'ROAS (%)',
};
