/**
 * 일괄 상태 변경 — 체크박스 선택 후 드롭다운으로 상태 변경
 */

'use client';

import type { CampaignStatus } from '@/types/entities';

import Select from '@/shared/ui/Select';

interface BulkStatusChangeProps {
  selectedCount: number;
  onChangeStatus: (status: CampaignStatus) => void;
  disabled: boolean;
}

const STATUS_CHANGE_OPTIONS = [
  { value: 'active', label: '진행중' },
  { value: 'paused', label: '일시중지' },
  { value: 'ended', label: '종료' },
];

export default function BulkStatusChange({
  selectedCount,
  onChangeStatus,
  disabled,
}: BulkStatusChangeProps) {
  return (
    <div
      className={`
        flex
        items-center
        gap-2
      `}
    >
      <span className="text-sm text-[#464C53]">
        {selectedCount}건 선택
      </span>
      <Select
        options={STATUS_CHANGE_OPTIONS}
        placeholder="상태 변경"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.value) {
            onChangeStatus(e.target.value as CampaignStatus);
          }
        }}
        value=""
        className="w-32"
      />
    </div>
  );
}
