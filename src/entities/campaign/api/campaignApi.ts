/**
 * 캠페인 API 호출 함수
 */

import type { ApiCampaign, ApiDailyStat } from '@/types/api';

import { apiClient } from '@/shared/api/apiClient';

export const fetchCampaigns = (): Promise<ApiCampaign[]> => {
  return apiClient<ApiCampaign[]>('/campaigns');
};

export const fetchDailyStats = (): Promise<ApiDailyStat[]> => {
  return apiClient<ApiDailyStat[]>('/daily_stats');
};

export const createCampaign = (
  campaign: Omit<ApiCampaign, 'id'> & { id: string },
): Promise<ApiCampaign> => {
  return apiClient<ApiCampaign>('/campaigns', {
    method: 'POST',
    body: JSON.stringify(campaign),
  });
};

export const updateCampaignStatus = (
  id: string,
  status: string,
): Promise<ApiCampaign> => {
  return apiClient<ApiCampaign>(`/campaigns/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};
