/**
 * TanStack Query Key 팩토리 — 중앙 관리
 */

export const campaignKeys = {
  all: ['campaigns'] as const,
  list: () => [...campaignKeys.all, 'list'] as const,
};

export const dailyStatKeys = {
  all: ['dailyStats'] as const,
  list: () => [...dailyStatKeys.all, 'list'] as const,
};
