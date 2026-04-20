/**
 * API 응답 원본 타입 — json-server 응답과 1:1 대응
 * db.json의 raw 데이터 스키마. null, 비표준 값 포함 가능.
 */

export interface ApiCampaign {
  id: string;
  name: string | null;
  platform: string;
  status: string;
  budget: number | null;
  startDate: string | null;
  endDate: string | null;
}

export interface ApiDailyStat {
  id: string;
  campaignId: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  conversionsValue: number | null;
}
