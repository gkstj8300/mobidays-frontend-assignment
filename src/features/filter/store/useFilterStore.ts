/**
 * 글로벌 필터 Zustand 스토어
 */

'use client';

import { create } from 'zustand';

import type { CampaignStatus, Platform } from '@/types/entities';
import type { DateRange } from '@/types/common';

import { getFirstDayOfMonth, getLastDayOfMonth } from '@/shared/lib/date';

interface FilterState {
  dateRange: DateRange;
  statuses: CampaignStatus[];
  platforms: Platform[];

  setDateRange: (range: DateRange) => void;
  toggleStatus: (status: CampaignStatus) => void;
  togglePlatform: (platform: Platform) => void;
  reset: () => void;
}

const getInitialDateRange = (): DateRange => ({
  start: getFirstDayOfMonth(),
  end: getLastDayOfMonth(),
});

export const useFilterStore = create<FilterState>((set) => ({
  dateRange: getInitialDateRange(),
  statuses: [],
  platforms: [],

  setDateRange: (range) => {
    set({ dateRange: range });
  },

  toggleStatus: (status) => {
    set((state) => {
      const exists = state.statuses.includes(status);
      return {
        statuses: exists
          ? state.statuses.filter((s) => s !== status)
          : [...state.statuses, status],
      };
    });
  },

  togglePlatform: (platform) => {
    set((state) => {
      const exists = state.platforms.includes(platform);
      return {
        platforms: exists
          ? state.platforms.filter((p) => p !== platform)
          : [...state.platforms, platform],
      };
    });
  },

  reset: () => {
    set({
      dateRange: getInitialDateRange(),
      statuses: [],
      platforms: [],
    });
  },
}));
