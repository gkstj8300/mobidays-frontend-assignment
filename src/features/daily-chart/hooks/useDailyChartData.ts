/**
 * 일별 추이 차트 데이터 훅 — 필터 적용 + 일별 합산
 */

'use client';

import { useMemo } from 'react';

import type { Campaign, DailyStat } from '@/types/entities';

import { useCampaigns } from '@/entities/campaign/hooks/useCampaigns';
import { useDailyStats } from '@/entities/campaign/hooks/useDailyStats';
import { useFilterStore } from '@/features/filter/store/useFilterStore';
import { isCampaignInDateRange, isDateInRange } from '@/shared/lib/date';

export interface DailyChartDataPoint {
  date: string;
  impressions: number;
  clicks: number;
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

export const useDailyChartData = () => {
  const { data: campaigns, isLoading: isCampaignsLoading } = useCampaigns();
  const { data: dailyStats, isLoading: isStatsLoading } = useDailyStats();

  const dateRange = useFilterStore((state) => state.dateRange);
  const statuses = useFilterStore((state) => state.statuses);
  const platforms = useFilterStore((state) => state.platforms);

  const chartData = useMemo(() => {
    if (!campaigns || !dailyStats) {
      return [];
    }

    const filteredCampaigns = filterCampaigns(campaigns, dateRange, statuses, platforms);
    const filteredCampaignIds = new Set(filteredCampaigns.map((c) => c.id));

    const dailyMap = new Map<string, DailyChartDataPoint>();

    dailyStats.forEach((stat: DailyStat) => {
      if (!filteredCampaignIds.has(stat.campaignId)) {
        return;
      }

      if (!isDateInRange(stat.date, dateRange.start, dateRange.end)) {
        return;
      }

      const existing = dailyMap.get(stat.date);
      if (existing) {
        existing.impressions += stat.impressions;
        existing.clicks += stat.clicks;
      } else {
        dailyMap.set(stat.date, {
          date: stat.date,
          impressions: stat.impressions,
          clicks: stat.clicks,
        });
      }
    });

    return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [campaigns, dailyStats, dateRange, statuses, platforms]);

  return {
    data: chartData,
    isLoading: isCampaignsLoading || isStatsLoading,
  };
};
