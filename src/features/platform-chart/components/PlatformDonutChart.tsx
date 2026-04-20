/**
 * 플랫폼별 성과 Donut 차트 — 메트릭 토글 + 양방향 필터 연동
 */

'use client';

import { useState, useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import type { Platform } from '@/types/entities';

import ToggleChip from '@/shared/ui/ToggleChip';
import StateMessage from '@/shared/ui/StateMessage';
import { useFilterStore } from '@/features/filter/store/useFilterStore';

import {
  usePlatformChartData,
} from '../hooks/usePlatformChartData';
import type { PlatformMetric } from '../hooks/usePlatformChartData';

const METRIC_OPTIONS: { key: PlatformMetric; label: string }[] = [
  { key: 'cost', label: '비용' },
  { key: 'impressions', label: '노출수' },
  { key: 'clicks', label: '클릭수' },
  { key: 'conversions', label: '전환수' },
];

const formatValue = (value: number, metric: PlatformMetric): string => {
  if (metric === 'cost') {
    return `₩${value.toLocaleString('ko-KR')}`;
  }
  return value.toLocaleString('ko-KR');
};

export default function PlatformDonutChart() {
  const [activeMetric, setActiveMetric] = useState<PlatformMetric>('cost');

  const { data, colors, isLoading } = usePlatformChartData(activeMetric);
  const platforms = useFilterStore((state) => state.platforms);
  const togglePlatform = useFilterStore((state) => state.togglePlatform);

  const handleSliceClick = useCallback(
    (platform: Platform) => {
      togglePlatform(platform);
    },
    [togglePlatform],
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#CED5DB] p-6">
        <StateMessage type="loading" height="h-[280px]" />
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
        <h2 className="text-lg font-bold text-[#131416]">플랫폼별 성과</h2>
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
        <StateMessage type="empty" height="h-[240px]" />
      ) : (
        <div className="flex items-center gap-6">
          <div className="w-[200px] h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="platform"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  cursor="pointer"
                  onClick={(_, index) => handleSliceClick(data[index].platform)}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.platform}
                      fill={colors[index]}
                      opacity={
                        platforms.length === 0 || platforms.includes(entry.platform)
                          ? 1
                          : 0.3
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    formatValue(Number(value), activeMetric),
                  ]}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #CED5DB',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {data.map((entry, index) => {
              const isSelected = platforms.length === 0 || platforms.includes(entry.platform);
              return (
                <button
                  key={entry.platform}
                  type="button"
                  onClick={() => handleSliceClick(entry.platform)}
                  className={`
                    flex
                    items-center
                    gap-3
                    px-3
                    py-2
                    rounded-lg
                    transition-colors
                    cursor-pointer
                    ${isSelected ? 'bg-[#F7FAFF]' : 'bg-white opacity-50'}
                  `}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="text-sm text-[#464C53] w-14">{entry.platform}</span>
                  <span
                    className={`
                      text-sm
                      font-semibold
                      ${isSelected ? 'text-[#3C79D7]' : 'text-[#6D7882]'}
                    `}
                  >
                    {formatValue(entry.value, activeMetric)}
                  </span>
                  <span className="text-xs text-[#6D7882]">
                    ({entry.percentage.toFixed(1)}%)
                  </span>
                </button>
              );
            })}

            {platforms.length > 0 && (
              <p className="text-xs text-[#6D7882] mt-1">
                선택: {platforms.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
