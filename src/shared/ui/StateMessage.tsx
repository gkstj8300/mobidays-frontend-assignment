/**
 * StateMessage — 로딩/에러/빈 데이터 상태 피드백 UI
 */

'use client';

import Icon from './Icon';

type StateType = 'loading' | 'error' | 'empty';

interface StateMessageProps {
  type: StateType;
  message?: string;
  height?: string;
}

const defaultMessages: Record<StateType, string> = {
  loading: '데이터를 불러오는 중...',
  error: '데이터를 불러오지 못했습니다',
  empty: '해당 기간에 데이터가 없습니다',
};

export default function StateMessage({
  type,
  message,
  height = 'h-[200px]',
}: StateMessageProps) {
  const displayMessage = message ?? defaultMessages[type];

  return (
    <div
      className={`
        ${height}
        flex
        flex-col
        items-center
        justify-center
        gap-2
        text-sm
      `}
    >
      {type === 'loading' && (
        <div
          className={`
            w-6
            h-6
            border-2
            border-[#E0E5EA]
            border-t-[#6096E6]
            rounded-full
            animate-spin
          `}
        />
      )}
      {type === 'error' && (
        <Icon name="close" size={24} className="text-[#FF6161]" />
      )}
      <span
        className={`
          ${type === 'error' ? 'text-[#FF6161]' : 'text-[#AEB9C2]'}
        `}
      >
        {displayMessage}
      </span>
    </div>
  );
}
