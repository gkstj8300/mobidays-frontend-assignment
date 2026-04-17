/**
 * 필터 도메인 상수
 */

import type { CampaignStatus, Platform } from '@/types/entities';

export const STATUS_OPTIONS: { key: CampaignStatus; label: string }[] = [
  { key: 'active', label: '진행중' },
  { key: 'paused', label: '일시중지' },
  { key: 'ended', label: '종료' },
];

export const PLATFORM_OPTIONS: { key: Platform; label: string }[] = [
  { key: 'Google', label: 'Google' },
  { key: 'Meta', label: 'Meta' },
  { key: 'Naver', label: 'Naver' },
];
