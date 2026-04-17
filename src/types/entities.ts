/**
 * UI 계층 비즈니스 모델 — 정규화 후 타입
 * 컴포넌트는 이 타입만 의존한다.
 */

export type Platform = 'Google' | 'Meta' | 'Naver';

export type CampaignStatus = 'active' | 'paused' | 'ended';

export interface Campaign {
  id: string;
  name: string;
  platform: Platform;
  status: CampaignStatus;
  budget: number;
  startDate: string;
  endDate: string | null;
}

export interface DailyStat {
  id: string;
  campaignId: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  conversionsValue: number;
}

export interface CampaignWithMetrics extends Campaign {
  totalCost: number;
  ctr: number;
  cpc: number;
  roas: number;
}
