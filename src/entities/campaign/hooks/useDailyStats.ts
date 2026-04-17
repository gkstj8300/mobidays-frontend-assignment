/**
 * 일별 통계 쿼리 훅 — 정규화 포함
 */

'use client';

import { useQuery } from '@tanstack/react-query';

import type { DailyStat } from '@/types/entities';

import { fetchDailyStats } from '../api/campaignApi';
import { dailyStatKeys } from '../api/queryKeys';
import { normalizeDailyStat } from '../model/normalizers';

export const useDailyStats = () => {
  return useQuery({
    queryKey: dailyStatKeys.list(),
    queryFn: fetchDailyStats,
    select: (data): DailyStat[] => data.map(normalizeDailyStat),
  });
};
