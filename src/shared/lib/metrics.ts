/**
 * 파생 지표 계산 함수
 */

import { safeDivide } from './utils';

/** CTR (%) = (클릭수 / 노출수) × 100 */
export const calcCTR = (clicks: number, impressions: number): number => {
  return safeDivide(clicks, impressions) * 100;
};

/** CPC (원) = 집행비용 / 클릭수 */
export const calcCPC = (cost: number, clicks: number): number => {
  return safeDivide(cost, clicks);
};

/** ROAS (%) = (전환가치 / 집행비용) × 100 */
export const calcROAS = (conversionsValue: number, cost: number): number => {
  return safeDivide(conversionsValue, cost) * 100;
};
