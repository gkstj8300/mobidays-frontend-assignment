/**
 * 전역 상수
 */

import type { CampaignStatus, Platform } from '@/types/entities';

export const ROWS_PER_PAGE = 10;

export const DATE_FORMAT = 'YYYY.MM.DD';

export const PLATFORMS: Platform[] = ['Google', 'Meta', 'Naver'];

export const STATUSES: CampaignStatus[] = ['active', 'paused', 'ended'];

export const STATUS_LABEL_MAP: Record<CampaignStatus, string> = {
  active: '진행중',
  paused: '일시중지',
  ended: '종료',
};

export const PLATFORM_NORMALIZE_MAP: Record<string, Platform> = {
  Google: 'Google',
  Meta: 'Meta',
  Naver: 'Naver',
  Facebook: 'Meta',
  facebook: 'Meta',
  네이버: 'Naver',
};

export const STATUS_NORMALIZE_MAP: Record<string, CampaignStatus> = {
  active: 'active',
  paused: 'paused',
  ended: 'ended',
  running: 'active',
  stopped: 'ended',
};
