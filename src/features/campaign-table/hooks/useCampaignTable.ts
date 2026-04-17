/**
 * 캠페인 테이블 데이터 훅 — 필터 + 검색 + 정렬 + 파생지표 계산 + 페이지네이션
 */

'use client';

import { useMemo } from 'react';

import type { Campaign, CampaignWithMetrics, DailyStat } from '@/types/entities';
import type { SortConfig } from '@/types/common';

import { useCampaigns } from '@/entities/campaign/hooks/useCampaigns';
import { useDailyStats } from '@/entities/campaign/hooks/useDailyStats';
import { useFilterStore } from '@/features/filter/store/useFilterStore';
import { isCampaignInDateRange, isDateInRange } from '@/shared/lib/date';
import { calcCTR, calcCPC, calcROAS } from '@/shared/lib/metrics';
import { ROWS_PER_PAGE } from '@/shared/lib/constants';

interface UseCampaignTableParams {
  searchKeyword: string;
  sortConfig: SortConfig | null;
  currentPage: number;
}

const filterCampaigns = (
  campaigns: Campaign[],
  dateRange: { start: string; end: string },
  statuses: string[],
  platforms: string[],
): Campaign[] => {
  return campaigns.filter((campaign) => {
    const inDateRange = isCampaignInDateRange(
      campaign.startDate,
      campaign.endDate,
      dateRange.start,
      dateRange.end,
    );
    if (!inDateRange) {
      return false;
    }

    if (statuses.length > 0 && !statuses.includes(campaign.status)) {
      return false;
    }

    if (platforms.length > 0 && !platforms.includes(campaign.platform)) {
      return false;
    }

    return true;
  });
};

const calcCampaignMetrics = (
  campaign: Campaign,
  dailyStats: DailyStat[],
  dateRange: { start: string; end: string },
): CampaignWithMetrics => {
  const stats = dailyStats.filter(
    (s) =>
      s.campaignId === campaign.id &&
      isDateInRange(s.date, dateRange.start, dateRange.end),
  );

  const totalCost = stats.reduce((sum, s) => sum + s.cost, 0);
  const totalImpressions = stats.reduce((sum, s) => sum + s.impressions, 0);
  const totalClicks = stats.reduce((sum, s) => sum + s.clicks, 0);
  const totalConversionsValue = stats.reduce((sum, s) => sum + s.conversionsValue, 0);

  return {
    ...campaign,
    totalCost,
    ctr: calcCTR(totalClicks, totalImpressions),
    cpc: calcCPC(totalCost, totalClicks),
    roas: calcROAS(totalConversionsValue, totalCost),
  };
};

const sortCampaigns = (
  campaigns: CampaignWithMetrics[],
  sortConfig: SortConfig | null,
): CampaignWithMetrics[] => {
  if (!sortConfig) {
    return campaigns;
  }

  const { key, direction } = sortConfig;
  const multiplier = direction === 'asc' ? 1 : -1;

  return [...campaigns].sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    if (key === 'period') {
      aVal = a.startDate;
      bVal = b.startDate;
    } else {
      aVal = a[key as keyof CampaignWithMetrics] as string | number;
      bVal = b[key as keyof CampaignWithMetrics] as string | number;
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * multiplier;
    }

    return ((aVal as number) - (bVal as number)) * multiplier;
  });
};

export const useCampaignTable = ({
  searchKeyword,
  sortConfig,
  currentPage,
}: UseCampaignTableParams) => {
  const { data: campaigns, isLoading: isCampaignsLoading } = useCampaigns();
  const { data: dailyStats, isLoading: isStatsLoading } = useDailyStats();

  const dateRange = useFilterStore((state) => state.dateRange);
  const statuses = useFilterStore((state) => state.statuses);
  const platforms = useFilterStore((state) => state.platforms);

  const result = useMemo(() => {
    if (!campaigns || !dailyStats) {
      return {
        data: [],
        totalFiltered: 0,
        totalAll: 0,
        totalPages: 0,
      };
    }

    // 1. 글로벌 필터 적용
    const filtered = filterCampaigns(campaigns, dateRange, statuses, platforms);

    // 2. 파생 지표 계산
    const withMetrics = filtered.map((c) =>
      calcCampaignMetrics(c, dailyStats, dateRange),
    );

    // 3. 검색 필터 (테이블에만 적용)
    const searched = searchKeyword
      ? withMetrics.filter((c) =>
          c.name.toLowerCase().includes(searchKeyword.toLowerCase()),
        )
      : withMetrics;

    // 4. 정렬
    const sorted = sortCampaigns(searched, sortConfig);

    // 5. 페이지네이션
    const totalPages = Math.ceil(sorted.length / ROWS_PER_PAGE);
    const startIdx = (currentPage - 1) * ROWS_PER_PAGE;
    const paged = sorted.slice(startIdx, startIdx + ROWS_PER_PAGE);

    return {
      data: paged,
      totalFiltered: searched.length,
      totalAll: filtered.length,
      totalPages,
    };
  }, [campaigns, dailyStats, dateRange, statuses, platforms, searchKeyword, sortConfig, currentPage]);

  return {
    ...result,
    isLoading: isCampaignsLoading || isStatsLoading,
  };
};
