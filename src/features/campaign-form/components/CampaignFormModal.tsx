/**
 * 캠페인 등록 모달 — 폼 + 유효성 검사 + 등록 후 동기화
 */

'use client';

import type { Platform } from '@/types/entities';

import Modal from '@/shared/ui/Modal';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';
import DatePicker from '@/shared/ui/DatePicker';
import ToggleChip from '@/shared/ui/ToggleChip';
import { useCreateCampaign } from '@/entities/campaign/hooks/useCampaignMutation';

import { useCampaignForm } from '../hooks/useCampaignForm';

const PLATFORM_OPTIONS: { key: Platform; label: string }[] = [
  { key: 'Google', label: 'Google' },
  { key: 'Meta', label: 'Meta' },
  { key: 'Naver', label: 'Naver' },
];

interface CampaignFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CampaignFormModal({
  isOpen,
  onClose,
}: CampaignFormModalProps) {
  const { formData, errors, updateField, validate, reset } = useCampaignForm();
  const createCampaign = useCreateCampaign();

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const id = `NEW-${Date.now()}`;

    createCampaign.mutate(
      {
        id,
        name: formData.name,
        platform: formData.platform as Platform,
        status: 'active',
        budget: Number(formData.budget),
        startDate: formData.startDate,
        endDate: formData.endDate,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="캠페인 등록">
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold text-[#131416] mb-1.5">
            캠페인명 <span className="text-[#FF6161]">*</span>
          </label>
          <Input
            placeholder="캠페인명을 입력하세요"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            status={errors.name ? 'error' : 'default'}
            errorMessage={errors.name}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#131416] mb-1.5">
            광고 매체 <span className="text-[#FF6161]">*</span>
          </label>
          <div className="flex gap-2">
            {PLATFORM_OPTIONS.map(({ key, label }) => (
              <ToggleChip
                key={key}
                label={label}
                isActive={formData.platform === key}
                onClick={() => updateField('platform', key)}
                size="lg"
              />
            ))}
          </div>
          {errors.platform && (
            <p className="mt-1 text-xs text-[#FF6161]">{errors.platform}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#131416] mb-1.5">
              예산 <span className="text-[#FF6161]">*</span>
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0"
                value={formData.budget}
                onChange={(e) => updateField('budget', e.target.value)}
                status={errors.budget ? 'error' : 'default'}
                errorMessage={errors.budget}
                className="pr-8"
              />
              <span
                className={`
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-sm
                  text-[#6D7882]
                  pointer-events-none
                `}
              >
                원
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#131416] mb-1.5">
              집행금액 <span className="text-[#FF6161]">*</span>
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0"
                value={formData.cost}
                onChange={(e) => updateField('cost', e.target.value)}
                status={errors.cost ? 'error' : 'default'}
                errorMessage={errors.cost}
                className="pr-8"
              />
              <span
                className={`
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-sm
                  text-[#6D7882]
                  pointer-events-none
                `}
              >
                원
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#131416] mb-1.5">
              집행 시작일 <span className="text-[#FF6161]">*</span>
            </label>
            <DatePicker
              value={formData.startDate}
              onChange={(date) => updateField('startDate', date)}
              placeholder="시작일 선택"
              calendarSize="sm"
            />
            {errors.startDate && (
              <p className="mt-1 text-xs text-[#FF6161]">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#131416] mb-1.5">
              집행 종료일 <span className="text-[#FF6161]">*</span>
            </label>
            <DatePicker
              value={formData.endDate}
              onChange={(date) => updateField('endDate', date)}
              placeholder="종료일 선택"
              calendarSize="sm"
            />
            {errors.endDate && (
              <p className="mt-1 text-xs text-[#FF6161]">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div
          className={`
            flex
            items-center
            justify-end
            gap-3
            pt-4
            border-t
            border-[#F4F5F6]
          `}
        >
          <Button variant="tertiary" onClick={handleClose}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={createCampaign.isPending}
          >
            {createCampaign.isPending ? '등록 중...' : '등록'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
