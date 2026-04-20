/**
 * 캠페인 랭킹 Top3 — 수평 바 + 메트릭 토글
 */

'use client';

import { useState } from 'react';

import Badge from '@/shared/ui/Badge';
import ToggleChip from '@/shared/ui/ToggleChip';
import StateMessage from '@/shared/ui/StateMessage';

import { useRankingData } from '../hooks/useRankingData';
import type { RankingMetric } from '../hooks/useRankingData';

const METRIC_OPTIONS: { key: RankingMetric; label: string }[] = [
  { key: 'roas', label: 'ROAS' },
  { key: 'ctr', label: 'CTR' },
  { key: 'cpc', label: 'CPC' },
];

const PLATFORM_BADGE_MAP: Record<string, 'info' | 'active' | 'paused'> = {
  Google: 'info',
  Meta: 'info',
  Naver: 'active',
};

export default function CampaignRankingTop3() {
  const [activeMetric, setActiveMetric] = useState<RankingMetric>('roas');

  const { data, isLoading } = useRankingData(activeMetric);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#CED5DB] p-6">
        <StateMessage type="loading" height="h-[240px]" />
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white
        rounded-xl
        border
        border-[#CED5DB]
        p-6
      `}
    >
      <div
        className={`
          flex
          items-center
          justify-between
          mb-4
        `}
      >
        <h2 className="text-lg font-bold text-[#131416]">캠페인 랭킹 Top 3</h2>
        <div className="flex items-center gap-1">
          {METRIC_OPTIONS.map(({ key, label }) => (
            <ToggleChip
              key={key}
              label={label}
              isActive={activeMetric === key}
              onClick={() => setActiveMetric(key)}
              size="sm"
            />
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <StateMessage type="empty" height="h-[200px]" />
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((item, index) => {
            const barWidth = item.maxValue > 0
              ? (item.value / item.maxValue) * 100
              : 0;

            return (
              <div
                key={item.id}
                className={`
                  flex
                  items-center
                  gap-4
                  px-4
                  py-3
                  bg-[#F7FAFF]
                  rounded-lg
                `}
              >
                <span
                  className={`
                    w-7
                    h-7
                    flex
                    items-center
                    justify-center
                    rounded-full
                    bg-[#6096E6]
                    text-white
                    text-xs
                    font-bold
                    shrink-0
                  `}
                >
                  {index + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium text-[#131416] truncate">
                      {item.name}
                    </span>
                    <Badge status={PLATFORM_BADGE_MAP[item.platform] ?? 'info'} size="sm">
                      {item.platform}
                    </Badge>
                  </div>
                  <div className="w-full h-1.5 bg-[#E0E5EA] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6096E6] rounded-full transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>

                <span className="text-sm font-bold text-[#131416] shrink-0 w-20 text-right">
                  {item.value.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
