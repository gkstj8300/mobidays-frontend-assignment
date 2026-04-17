/**
 * 캠페인 목록 쿼리 훅 — 정규화 포함
 */

'use client';

import { useQuery } from '@tanstack/react-query';

import type { Campaign } from '@/types/entities';

import { fetchCampaigns } from '../api/campaignApi';
import { campaignKeys } from '../api/queryKeys';
import { normalizeCampaign } from '../model/normalizers';

export const useCampaigns = () => {
  return useQuery({
    queryKey: campaignKeys.list(),
    queryFn: fetchCampaigns,
    select: (data): Campaign[] => data.map(normalizeCampaign),
  });
};
