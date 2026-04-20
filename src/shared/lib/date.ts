/**
 * 날짜 유틸리티 함수
 */

/** "2026/04/12" → "2026-04-12" 정규화, null/빈값 안전 처리 */
export const normalizeDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) {
    return '';
  }
  return dateStr.replace(/\//g, '-');
};

/** 당월 1일 반환 (YYYY-MM-DD) */
export const getFirstDayOfMonth = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
};

/** 당월 말일 반환 (YYYY-MM-DD) */
export const getLastDayOfMonth = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
};

/** 날짜가 범위 내에 있는지 확인 */
export const isDateInRange = (
  date: string,
  start: string,
  end: string,
): boolean => {
  return date >= start && date <= end;
};

/** 캠페인 집행 기간이 필터 기간과 겹치는지 확인 */
export const isCampaignInDateRange = (
  campaignStart: string,
  campaignEnd: string | null,
  filterStart: string,
  filterEnd: string,
): boolean => {
  const cStart = normalizeDate(campaignStart);
  const cEnd = campaignEnd ? normalizeDate(campaignEnd) : '9999-12-31';
  return cStart <= filterEnd && cEnd >= filterStart;
};
