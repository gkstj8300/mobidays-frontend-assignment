/**
 * 캠페인 랭킹 Top3 데이터 훅 — 필터 적용 + 메트릭 기준 상위 3개
 */

'use client';

import { useMemo } from 'react';

import type { Campaign, DailyStat, Platform } from '@/types/entities';

import { useCampaigns } from '@/entities/campaign/hooks/useCampaigns';
import { useDailyStats } from '@/entities/campaign/hooks/useDailyStats';
import { useFilterStore } from '@/features/filter/store/useFilterStore';
import { isCampaignInDateRange, isDateInRange } from '@/shared/lib/date';
import { calcCTR, calcCPC, calcROAS } from '@/shared/lib/metrics';

export type RankingMetric = 'roas' | 'ctr' | 'cpc';

export interface RankingDataPoint {
  id: string;
  name: string;
  platform: Platform;
  value: number;
  maxValue: number;
}

const filterCampaigns = (
  campaigns: Campaign[],
  dateRange: { start: string; end: string },
  statuses: string[],
  platforms: string[],
): Campaign[] => {
  return campaigns.filter((campaign) => {
    if (!isCampaignInDateRange(campaign.startDate, campaign.endDate, dateRange.start, dateRange.end)) {
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

export const useRankingData = (metric: RankingMetric) => {
  const { data: campaigns, isLoading: isCampaignsLoading } = useCampaigns();
  const { data: dailyStats, isLoading: isStatsLoading } = useDailyStats();

  const dateRange = useFilterStore((state) => state.dateRange);
  const statuses = useFilterStore((state) => state.statuses);
  const platforms = useFilterStore((state) => state.platforms);

  const data = useMemo(() => {
    if (!campaigns || !dailyStats) {
      return [];
    }

    const filtered = filterCampaigns(campaigns, dateRange, statuses, platforms);

    const campaignMetrics = filtered.map((campaign) => {
      const stats = dailyStats.filter(
        (s: DailyStat) =>
          s.campaignId === campaign.id &&
          isDateInRange(s.date, dateRange.start, dateRange.end),
      );

      const totalImpressions = stats.reduce((sum, s) => sum + s.impressions, 0);
      const totalClicks = stats.reduce((sum, s) => sum + s.clicks, 0);
      const totalCost = stats.reduce((sum, s) => sum + s.cost, 0);
      const totalConversionsValue = stats.reduce((sum, s) => sum + s.conversionsValue, 0);

      let value: number;
      switch (metric) {
        case 'roas':
          value = calcROAS(totalConversionsValue, totalCost);
          break;
        case 'ctr':
          value = calcCTR(totalClicks, totalImpressions);
          break;
        case 'cpc':
          value = calcCPC(totalCost, totalClicks);
          break;
      }

      return {
        id: campaign.id,
        name: campaign.name,
        platform: campaign.platform,
        value,
        totalImpressions,
        totalClicks,
        totalCost,
      };
    });

    // 메트릭 분모가 0이면 계산값이 정의 불가(Division by Zero 방어의 0)이므로 랭킹에서 제외
    const rankable = campaignMetrics.filter((item) => {
      if (metric === 'cpc') {
        return item.totalClicks > 0;
      }
      if (metric === 'ctr') {
        return item.totalImpressions > 0;
      }
      return item.totalCost > 0;
    });

    // ROAS/CTR: 높을수록 상위, CPC: 낮을수록 상위
    const sorted = [...rankable].sort((a, b) =>
      metric === 'cpc' ? a.value - b.value : b.value - a.value,
    );

    const top3 = sorted.slice(0, 3);
    const maxValue = top3.length > 0 ? Math.max(...top3.map((d) => d.value)) : 0;

    return top3.map((item) => ({
      ...item,
      maxValue,
    }));
  }, [campaigns, dailyStats, dateRange, statuses, platforms, metric]);

  return {
    data,
    isLoading: isCampaignsLoading || isStatsLoading,
  };
};
