/**
 * 캠페인 등록/상태 변경 뮤테이션 훅
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ApiCampaign } from '@/types/api';
import type { CampaignStatus } from '@/types/entities';

import {
  createCampaign,
  createDailyStat,
  updateCampaignStatus,
} from '../api/campaignApi';
import { campaignKeys, dailyStatKeys } from '../api/queryKeys';

interface CreateCampaignInput {
  campaign: Omit<ApiCampaign, 'id'> & { id: string };
  /** 등록 시점의 집행금액. > 0이면 초기 DailyStat을 함께 생성한다. */
  initialCost?: number;
}

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaign, initialCost }: CreateCampaignInput) => {
      const created = await createCampaign(campaign);

      if (initialCost !== undefined && initialCost > 0 && created.startDate) {
        await createDailyStat({
          id: `NEW-STAT-${Date.now()}`,
          campaignId: created.id,
          date: created.startDate,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          cost: initialCost,
          conversionsValue: 0,
        });
      }

      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
      queryClient.invalidateQueries({ queryKey: dailyStatKeys.all });
    },
  });
};

export const useUpdateCampaignStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: CampaignStatus }) =>
      Promise.all(ids.map((id) => updateCampaignStatus(id, status))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });
};
