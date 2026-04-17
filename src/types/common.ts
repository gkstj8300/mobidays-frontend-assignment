/**
 * 공통 유틸리티 타입 — 필터, 페이지네이션 등
 */

import type { CampaignStatus, Platform } from './entities';

export interface DateRange {
  start: string;
  end: string;
}

export interface FilterState {
  dateRange: DateRange;
  statuses: CampaignStatus[];
  platforms: Platform[];
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
