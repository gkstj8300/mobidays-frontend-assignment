/**
 * 플랫폼별 성과 차트 데이터 훅 — 필터 적용 + 플랫폼별 집계
 */

'use client';

import { useMemo } from 'react';

import type { Campaign, DailyStat, Platform } from '@/types/entities';

import { useCampaigns } from '@/entities/campaign/hooks/useCampaigns';
import { useDailyStats } from '@/entities/campaign/hooks/useDailyStats';
import { useFilterStore } from '@/features/filter/store/useFilterStore';
import { isCampaignInDateRange, isDateInRange } from '@/shared/lib/date';
import { PLATFORMS } from '@/shared/lib/constants';

export type PlatformMetric = 'cost' | 'impressions' | 'clicks' | 'conversions';

export interface PlatformChartDataPoint {
  platform: Platform;
  value: number;
  percentage: number;
}

const PLATFORM_COLORS: Record<Platform, string> = {
  Google: '#6096E6',
  Meta: '#AEB9C2',
  Naver: '#1C9E34',
};

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

export const usePlatformChartData = (metric: PlatformMetric) => {
  const { data: campaigns, isLoading: isCampaignsLoading } = useCampaigns();
  const { data: dailyStats, isLoading: isStatsLoading } = useDailyStats();

  const dateRange = useFilterStore((state) => state.dateRange);
  const statuses = useFilterStore((state) => state.statuses);
  const platforms = useFilterStore((state) => state.platforms);

  const chartData = useMemo(() => {
    if (!campaigns || !dailyStats) {
      return { data: [], colors: [] as string[] };
    }

    const filtered = filterCampaigns(campaigns, dateRange, statuses, platforms);
    const filteredIds = new Set(filtered.map((c) => c.id));

    const campaignPlatformMap = new Map<string, Platform>();
    filtered.forEach((c) => campaignPlatformMap.set(c.id, c.platform));

    const platformTotals = new Map<Platform, number>();
    PLATFORMS.forEach((p) => platformTotals.set(p, 0));

    dailyStats.forEach((stat: DailyStat) => {
      if (!filteredIds.has(stat.campaignId)) {
        return;
      }
      if (!isDateInRange(stat.date, dateRange.start, dateRange.end)) {
        return;
      }

      const platform = campaignPlatformMap.get(stat.campaignId);
      if (!platform) {
        return;
      }

      const current = platformTotals.get(platform) ?? 0;
      platformTotals.set(platform, current + stat[metric]);
    });

    const total = Array.from(platformTotals.values()).reduce((sum, v) => sum + v, 0);

    const data: PlatformChartDataPoint[] = PLATFORMS
      .map((platform) => {
        const value = platformTotals.get(platform) ?? 0;
        return {
          platform,
          value,
          percentage: total > 0 ? (value / total) * 100 : 0,
        };
      })
      .filter((d) => d.value > 0);

    const colors = data.map((d) => PLATFORM_COLORS[d.platform]);

    return { data, colors };
  }, [campaigns, dailyStats, dateRange, statuses, platforms, metric]);

  return {
    ...chartData,
    isLoading: isCampaignsLoading || isStatsLoading,
  };
};
