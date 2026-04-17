/**
 * 일별 추이 차트 — Recharts LineChart, 듀얼 Y축
 */

'use client';

import { useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { useFilterStore } from '@/features/filter/store/useFilterStore';

import { useDailyChartData } from '../hooks/useDailyChartData';
import MetricToggle from './MetricToggle';

const METRIC_OPTIONS = [
  { key: 'impressions', label: '노출수' },
  { key: 'clicks', label: '클릭수' },
];

const formatNumber = (value: number): string => {
  return value.toLocaleString('ko-KR');
};

const formatDateAxis = (dateStr: string): string => {
  const parts = dateStr.split('-');
  return `${parts[1]}-${parts[2]}`;
};

export default function DailyTrendChart() {
  const [activeMetrics, setActiveMetrics] = useState<string[]>([
    'impressions',
    'clicks',
  ]);

  const { data, isLoading } = useDailyChartData();
  const dateRange = useFilterStore((state) => state.dateRange);

  const handleToggle = useCallback((key: string) => {
    setActiveMetrics((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key],
    );
  }, []);

  const showImpressions = activeMetrics.includes('impressions');
  const showClicks = activeMetrics.includes('clicks');

  if (isLoading) {
    return (
      <div
        className={`
          bg-white
          rounded-xl
          border
          border-[#CED5DB]
          p-6
          h-[400px]
          flex
          items-center
          justify-center
          text-sm
          text-[#6D7882]
        `}
      >
        데이터를 불러오는 중...
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
          mb-1
        `}
      >
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-[#131416]">일별 추이</h2>
          <div className="flex items-center gap-3 text-xs text-[#6D7882]">
            {showImpressions && (
              <span className="flex items-center gap-1">
                <span
                  className={`
                    inline-block
                    w-2
                    h-2
                    rounded-full
                    bg-[#6096E6]
                  `}
                />
                노출수 (좌)
              </span>
            )}
            {showClicks && (
              <span className="flex items-center gap-1">
                <span
                  className={`
                    inline-block
                    w-2
                    h-2
                    rounded-full
                    bg-[#AEB9C2]
                  `}
                />
                클릭수 (우)
              </span>
            )}
          </div>
        </div>

        <MetricToggle
          options={METRIC_OPTIONS}
          active={activeMetrics}
          onToggle={handleToggle}
        />
      </div>

      <p className="text-xs text-[#6D7882] mb-4">
        {dateRange.start} ~ {dateRange.end}
      </p>

      {data.length === 0 ? (
        <div
          className={`
            h-[300px]
            flex
            items-center
            justify-center
            text-sm
            text-[#AEB9C2]
          `}
        >
          해당 기간에 데이터가 없습니다
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E0E4E8"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateAxis}
              tick={{ fontSize: 12, fill: '#6D7882' }}
              axisLine={{ stroke: '#E0E4E8' }}
              tickLine={false}
            />
            {showImpressions && (
              <YAxis
                yAxisId="left"
                orientation="left"
                tickFormatter={formatNumber}
                tick={{ fontSize: 12, fill: '#6D7882' }}
                axisLine={false}
                tickLine={false}
              />
            )}
            {showClicks && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={formatNumber}
                tick={{ fontSize: 12, fill: '#6D7882' }}
                axisLine={false}
                tickLine={false}
              />
            )}
            <Tooltip
              formatter={(value, name) => [
                formatNumber(Number(value)),
                name === 'impressions' ? '노출수' : '클릭수',
              ]}
              labelFormatter={(label) => String(label)}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #CED5DB',
                fontSize: '12px',
              }}
            />
            {showImpressions && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="impressions"
                stroke="#6096E6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#6096E6' }}
              />
            )}
            {showClicks && (
              <Line
                yAxisId={showImpressions ? 'right' : 'left'}
                type="monotone"
                dataKey="clicks"
                stroke="#AEB9C2"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#AEB9C2' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
