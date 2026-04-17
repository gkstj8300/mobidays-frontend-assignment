import { describe, it, expect } from 'vitest';

import { safeDivide } from '../utils';

describe('safeDivide', () => {
  it('정상 나눗셈 결과를 반환한다', () => {
    expect(safeDivide(100, 50)).toBe(2);
  });

  it('소수점 나눗셈 결과를 반환한다', () => {
    expect(safeDivide(10, 3)).toBeCloseTo(3.3333, 3);
  });

  it('분모가 0이면 0을 반환한다', () => {
    expect(safeDivide(100, 0)).toBe(0);
  });

  it('분자가 0이면 0을 반환한다', () => {
    expect(safeDivide(0, 100)).toBe(0);
  });

  it('분자와 분모 모두 0이면 0을 반환한다', () => {
    expect(safeDivide(0, 0)).toBe(0);
  });
});
