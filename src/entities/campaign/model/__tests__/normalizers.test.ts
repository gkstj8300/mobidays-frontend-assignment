import { describe, it, expect } from 'vitest';

import type { ApiCampaign, ApiDailyStat } from '@/types/api';

import { normalizeCampaign, normalizeDailyStat } from '../normalizers';

const createRawCampaign = (overrides: Partial<ApiCampaign> = {}): ApiCampaign => ({
  id: 'TEST-001',
  name: '테스트 캠페인',
  platform: 'Google',
  status: 'active',
  budget: 10000000,
  startDate: '2026-03-01',
  endDate: '2026-03-31',
  ...overrides,
});

const createRawDailyStat = (overrides: Partial<ApiDailyStat> = {}): ApiDailyStat => ({
  id: 'STAT-TEST-001',
  campaignId: 'TEST-001',
  date: '2026-03-01',
  impressions: 50000,
  clicks: 1500,
  conversions: 50,
  cost: 1500000,
  conversionsValue: 5000000,
  ...overrides,
});

describe('normalizeCampaign', () => {
  it('표준 캠페인 데이터를 그대로 반환한다', () => {
    const raw = createRawCampaign();
    const result = normalizeCampaign(raw);

    expect(result.id).toBe('TEST-001');
    expect(result.name).toBe('테스트 캠페인');
    expect(result.platform).toBe('Google');
    expect(result.status).toBe('active');
    expect(result.budget).toBe(10000000);
    expect(result.startDate).toBe('2026-03-01');
    expect(result.endDate).toBe('2026-03-31');
  });

  it('platform "Facebook" → "Meta"로 정규화한다', () => {
    const result = normalizeCampaign(createRawCampaign({ platform: 'Facebook' }));
    expect(result.platform).toBe('Meta');
  });

  it('platform "facebook" → "Meta"로 정규화한다', () => {
    const result = normalizeCampaign(createRawCampaign({ platform: 'facebook' }));
    expect(result.platform).toBe('Meta');
  });

  it('platform "네이버" → "Naver"로 정규화한다', () => {
    const result = normalizeCampaign(createRawCampaign({ platform: '네이버' }));
    expect(result.platform).toBe('Naver');
  });

  it('status "running" → "active"로 정규화한다', () => {
    const result = normalizeCampaign(createRawCampaign({ status: 'running' }));
    expect(result.status).toBe('active');
  });

  it('status "stopped" → "ended"로 정규화한다', () => {
    const result = normalizeCampaign(createRawCampaign({ status: 'stopped' }));
    expect(result.status).toBe('ended');
  });

  it('startDate "2026/04/12" → "2026-04-12"로 정규화한다', () => {
    const result = normalizeCampaign(createRawCampaign({ startDate: '2026/04/12' }));
    expect(result.startDate).toBe('2026-04-12');
  });

  it('name이 null이면 "(이름 없음)"으로 대체한다', () => {
    const result = normalizeCampaign(createRawCampaign({ name: null }));
    expect(result.name).toBe('(이름 없음)');
  });

  it('budget이 null이면 0으로 처리한다', () => {
    const result = normalizeCampaign(createRawCampaign({ budget: null }));
    expect(result.budget).toBe(0);
  });

  it('endDate가 null이면 null을 유지한다', () => {
    const result = normalizeCampaign(createRawCampaign({ endDate: null }));
    expect(result.endDate).toBeNull();
  });
});

describe('normalizeDailyStat', () => {
  it('표준 데이터를 그대로 반환한다', () => {
    const raw = createRawDailyStat();
    const result = normalizeDailyStat(raw);

    expect(result.id).toBe('STAT-TEST-001');
    expect(result.campaignId).toBe('TEST-001');
    expect(result.impressions).toBe(50000);
    expect(result.conversionsValue).toBe(5000000);
  });

  it('conversionsValue가 null이면 0으로 처리한다', () => {
    const result = normalizeDailyStat(createRawDailyStat({ conversionsValue: null }));
    expect(result.conversionsValue).toBe(0);
  });
});
