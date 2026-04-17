/**
 * 캠페인 등록 폼 상태 + 유효성 검사 훅
 */

'use client';

import { useState, useCallback } from 'react';

import type { Platform } from '@/types/entities';

import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  BUDGET_MIN,
  BUDGET_MAX,
  COST_MIN,
  COST_MAX,
} from '../constants';

export interface CampaignFormData {
  name: string;
  platform: Platform | '';
  budget: string;
  cost: string;
  startDate: string;
  endDate: string;
}

export interface CampaignFormErrors {
  name?: string;
  platform?: string;
  budget?: string;
  cost?: string;
  startDate?: string;
  endDate?: string;
}

const initialFormData: CampaignFormData = {
  name: '',
  platform: '',
  budget: '',
  cost: '',
  startDate: '',
  endDate: '',
};

export const useCampaignForm = () => {
  const [formData, setFormData] = useState<CampaignFormData>(initialFormData);
  const [errors, setErrors] = useState<CampaignFormErrors>({});

  const updateField = useCallback(
    <K extends keyof CampaignFormData>(key: K, value: CampaignFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [],
  );

  const validate = useCallback((): boolean => {
    const newErrors: CampaignFormErrors = {};

    if (!formData.name || formData.name.length < NAME_MIN_LENGTH) {
      newErrors.name = `캠페인명은 ${NAME_MIN_LENGTH}자 이상이어야 합니다`;
    } else if (formData.name.length > NAME_MAX_LENGTH) {
      newErrors.name = `캠페인명은 ${NAME_MAX_LENGTH}자 이하여야 합니다`;
    }

    if (!formData.platform) {
      newErrors.platform = '광고 매체를 선택해주세요';
    }

    const budget = Number(formData.budget);
    if (!formData.budget || isNaN(budget)) {
      newErrors.budget = '예산을 입력해주세요';
    } else if (!Number.isInteger(budget)) {
      newErrors.budget = '예산은 정수여야 합니다';
    } else if (budget < BUDGET_MIN || budget > BUDGET_MAX) {
      newErrors.budget = `예산은 ${BUDGET_MIN.toLocaleString()}원 ~ ${BUDGET_MAX.toLocaleString()}원이어야 합니다`;
    }

    const cost = Number(formData.cost);
    if (formData.cost === '' || isNaN(cost)) {
      newErrors.cost = '집행금액을 입력해주세요';
    } else if (!Number.isInteger(cost)) {
      newErrors.cost = '집행금액은 정수여야 합니다';
    } else if (cost < COST_MIN || cost > COST_MAX) {
      newErrors.cost = `집행금액은 ${COST_MIN.toLocaleString()}원 ~ ${COST_MAX.toLocaleString()}원이어야 합니다`;
    } else if (!isNaN(budget) && cost > budget) {
      newErrors.cost = '집행금액은 예산을 초과할 수 없습니다';
    }

    if (!formData.startDate) {
      newErrors.startDate = '시작일을 선택해주세요';
    }

    if (!formData.endDate) {
      newErrors.endDate = '종료일을 선택해주세요';
    } else if (formData.startDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = '종료일은 시작일 이후여야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const reset = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    updateField,
    validate,
    reset,
  };
};
