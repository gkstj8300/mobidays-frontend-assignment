/**
 * 데이터 정규화 함수 — API raw 데이터 → UI 엔티티 변환
 */

import type { ApiCampaign, ApiDailyStat } from '@/types/api';
import type { Campaign, DailyStat } from '@/types/entities';

import { normalizeDate } from '@/shared/lib/date';
import {
  PLATFORM_NORMALIZE_MAP,
  STATUS_NORMALIZE_MAP,
} from '@/shared/lib/constants';

export const normalizeCampaign = (raw: ApiCampaign): Campaign => {
  const platform = PLATFORM_NORMALIZE_MAP[raw.platform];
  if (!platform) {
    console.warn(`Unknown platform: "${raw.platform}" (campaign: ${raw.id})`);
  }

  const status = STATUS_NORMALIZE_MAP[raw.status];
  if (!status) {
    console.warn(`Unknown status: "${raw.status}" (campaign: ${raw.id})`);
  }

  return {
    id: raw.id,
    name: raw.name ?? `(이름 없음)`,
    platform: platform ?? (raw.platform as Campaign['platform']),
    status: status ?? (raw.status as Campaign['status']),
    budget: raw.budget ?? 0,
    startDate: normalizeDate(raw.startDate) || '1970-01-01',
    endDate: raw.endDate ? normalizeDate(raw.endDate) : null,
  };
};

export const normalizeDailyStat = (raw: ApiDailyStat): DailyStat => {
  return {
    id: raw.id,
    campaignId: raw.campaignId,
    date: normalizeDate(raw.date),
    impressions: raw.impressions,
    clicks: raw.clicks,
    conversions: raw.conversions,
    cost: raw.cost,
    conversionsValue: raw.conversionsValue ?? 0,
  };
};
