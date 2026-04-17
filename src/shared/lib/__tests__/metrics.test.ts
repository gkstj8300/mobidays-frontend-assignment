import { describe, it, expect } from 'vitest';

import { calcCTR, calcCPC, calcROAS } from '../metrics';

describe('calcCTR', () => {
  it('(클릭수 / 노출수) × 100을 반환한다', () => {
    expect(calcCTR(150, 10000)).toBeCloseTo(1.5, 2);
  });

  it('노출수가 0이면 0을 반환한다', () => {
    expect(calcCTR(100, 0)).toBe(0);
  });

  it('클릭수가 0이면 0을 반환한다', () => {
    expect(calcCTR(0, 10000)).toBe(0);
  });

  it('노출수와 클릭수 모두 0이면 0을 반환한다', () => {
    expect(calcCTR(0, 0)).toBe(0);
  });
});

describe('calcCPC', () => {
  it('(집행비용 / 클릭수)를 반환한다', () => {
    expect(calcCPC(500000, 500)).toBe(1000);
  });

  it('클릭수가 0이면 0을 반환한다', () => {
    expect(calcCPC(500000, 0)).toBe(0);
  });

  it('비용이 0이면 0을 반환한다', () => {
    expect(calcCPC(0, 500)).toBe(0);
  });
});

describe('calcROAS', () => {
  it('(전환가치 / 집행비용) × 100을 반환한다', () => {
    expect(calcROAS(3000000, 1000000)).toBeCloseTo(300, 2);
  });

  it('집행비용이 0이면 0을 반환한다', () => {
    expect(calcROAS(3000000, 0)).toBe(0);
  });

  it('전환가치가 0이면 0을 반환한다', () => {
    expect(calcROAS(0, 1000000)).toBe(0);
  });

  it('전환가치와 집행비용 모두 0이면 0을 반환한다', () => {
    expect(calcROAS(0, 0)).toBe(0);
  });
});
