/**
 * 캠페인 등록/상태 변경 뮤테이션 훅
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CampaignStatus } from '@/types/entities';

import { createCampaign, updateCampaignStatus } from '../api/campaignApi';
import { campaignKeys } from '../api/queryKeys';

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
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
