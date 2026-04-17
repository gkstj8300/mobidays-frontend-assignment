/**
 * 범용 유틸리티 함수
 */

export const safeDivide = (numerator: number, denominator: number): number => {
  if (denominator === 0) {
    return 0;
  }
  return numerator / denominator;
};
