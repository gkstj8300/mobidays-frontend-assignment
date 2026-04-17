/**
 * 캠페인 관리 테이블 — 검색 + 정렬 + 페이지네이션 + 일괄변경
 */

'use client';

import { useState, useCallback } from 'react';

import type { CampaignStatus } from '@/types/entities';
import type { SortConfig } from '@/types/common';

import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import Checkbox from '@/shared/ui/Checkbox';
import Icon from '@/shared/ui/Icon';
import { useUpdateCampaignStatus } from '@/entities/campaign/hooks/useCampaignMutation';

import { useCampaignTable } from '../hooks/useCampaignTable';
import { SORTABLE_COLUMNS, COLUMN_LABELS } from '../constants';
import CampaignSearch from './CampaignSearch';
import BulkStatusChange from './BulkStatusChange';
import Pagination from './Pagination';

const formatCurrency = (value: number): string => {
  return `₩${value.toLocaleString('ko-KR')}`;
};

const formatDate = (dateStr: string): string => {
  return dateStr.replace(/-/g, '.');
};

const formatPeriod = (start: string, end: string | null): string => {
  const s = formatDate(start);
  const e = end ? formatDate(end) : '-';
  return `${s} ~ ${e}`;
};

const STATUS_BADGE_MAP: Record<CampaignStatus, 'active' | 'paused' | 'ended'> = {
  active: 'active',
  paused: 'paused',
  ended: 'ended',
};

const STATUS_LABEL_MAP: Record<CampaignStatus, string> = {
  active: '진행중',
  paused: '일시중지',
  ended: '종료',
};

interface CampaignTableProps {
  onOpenModal: () => void;
}

export default function CampaignTable({ onOpenModal }: CampaignTableProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data, totalFiltered, totalAll, totalPages, isLoading } = useCampaignTable({
    searchKeyword,
    sortConfig,
    currentPage,
  });

  const updateStatus = useUpdateCampaignStatus();

  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') {
          return { key, direction: 'desc' };
        }
        return null;
      }
      return { key, direction: 'asc' };
    });
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === data.length && data.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map((c) => c.id)));
    }
  }, [data, selectedIds.size]);

  const handleSelectOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleBulkStatusChange = useCallback(
    (status: CampaignStatus) => {
      if (selectedIds.size === 0) {
        return;
      }
      updateStatus.mutate(
        { ids: Array.from(selectedIds), status },
        {
          onSuccess: () => {
            setSelectedIds(new Set());
          },
        },
      );
    },
    [selectedIds, updateStatus],
  );

  const renderSortIcon = (key: string) => {
    if (sortConfig?.key !== key) {
      return null;
    }
    return (
      <Icon
        name={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'}
        size={16}
        className="inline-block ml-0.5"
      />
    );
  };

  const isSortable = (key: string): boolean => {
    return (SORTABLE_COLUMNS as readonly string[]).includes(key);
  };

  const columns = ['name', 'status', 'platform', 'period', 'totalCost', 'ctr', 'cpc', 'roas'];

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
          mb-4
        `}
      >
        <h2 className="text-lg font-bold text-[#131416]">캠페인 목록</h2>
        <Button variant="tertiary" onClick={onOpenModal}>
          <Icon name="plus" size={16} />
          캠페인 등록
        </Button>
      </div>

      <div
        className={`
          flex
          items-center
          justify-between
          mb-4
        `}
      >
        <CampaignSearch
          value={searchKeyword}
          onChange={handleSearch}
          resultCount={totalFiltered}
          totalCount={totalAll}
        />
        {selectedIds.size > 0 && (
          <BulkStatusChange
            selectedCount={selectedIds.size}
            onChangeStatus={handleBulkStatusChange}
            disabled={selectedIds.size === 0}
          />
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E0E4E8]">
              <th className="w-10 py-3 px-2">
                <Checkbox
                  checked={selectedIds.size === data.length && data.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className={`
                    py-3
                    px-3
                    text-left
                    text-xs
                    font-semibold
                    text-[#6D7882]
                    whitespace-nowrap
                    ${isSortable(col) ? 'cursor-pointer hover:text-[#131416] select-none' : ''}
                    ${col === 'totalCost' || col === 'ctr' || col === 'cpc' || col === 'roas' ? 'text-right' : ''}
                  `}
                  onClick={isSortable(col) ? () => handleSort(col) : undefined}
                >
                  <span className="inline-flex items-center">
                    {COLUMN_LABELS[col]}
                    {renderSortIcon(col)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-16 text-center text-sm text-[#AEB9C2]"
                >
                  검색 결과가 없습니다
                </td>
              </tr>
            ) : (
              data.map((campaign) => (
                <tr
                  key={campaign.id}
                  className={`
                    border-b
                    border-[#F4F5F6]
                    hover:bg-[#FAFCFF]
                    transition-colors
                  `}
                >
                  <td className="py-4 px-2">
                    <Checkbox
                      checked={selectedIds.has(campaign.id)}
                      onChange={() => handleSelectOne(campaign.id)}
                    />
                  </td>
                  <td className="py-4 px-3 text-sm text-[#131416]">
                    {campaign.name}
                  </td>
                  <td className="py-4 px-3">
                    <Badge status={STATUS_BADGE_MAP[campaign.status]} size="sm">
                      {STATUS_LABEL_MAP[campaign.status]}
                    </Badge>
                  </td>
                  <td className="py-4 px-3 text-sm text-[#464C53]">
                    {campaign.platform}
                  </td>
                  <td className="py-4 px-3 text-sm text-[#464C53] whitespace-nowrap">
                    {formatPeriod(campaign.startDate, campaign.endDate)}
                  </td>
                  <td className="py-4 px-3 text-sm text-[#131416] text-right whitespace-nowrap">
                    {formatCurrency(campaign.totalCost)}
                  </td>
                  <td className="py-4 px-3 text-sm text-[#131416] text-right">
                    {campaign.ctr.toFixed(2)}%
                  </td>
                  <td className="py-4 px-3 text-sm text-[#131416] text-right">
                    {Math.round(campaign.cpc).toLocaleString('ko-KR')}
                  </td>
                  <td className="py-4 px-3 text-sm font-semibold text-[#3C79D7] text-right">
                    {campaign.roas.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalFiltered}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
