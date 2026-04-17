/**
 * Input — Figma `input` 컴포넌트 기반
 * type: default / search
 * status: default / error
 */

'use client';

import type { InputHTMLAttributes } from 'react';

import Icon from './Icon';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputType?: 'default' | 'search';
  status?: 'default' | 'error';
  errorMessage?: string;
}

export default function Input({
  inputType = 'default',
  status = 'default',
  errorMessage,
  className = '',
  ...props
}: InputProps) {
  const borderStyle = status === 'error'
    ? 'border-[#F0312B]'
    : 'border-[#CED5DB] focus:border-[#6096E6]';

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        {inputType === 'search' && (
          <div
            className={`
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-[#6D7882]
            `}
          >
            <Icon name="search" size={20} />
          </div>
        )}
        <input
          className={`
            h-9
            w-full
            bg-[rgba(255,255,255,0.8)]
            border
            ${borderStyle}
            rounded-lg
            text-sm
            font-medium
            text-[#131416]
            placeholder:text-[#AEB9C2]
            outline-none
            transition-colors
            disabled:bg-[rgba(0,0,0,0.05)]
            disabled:border-[#E0E5EA]
            disabled:text-[#AEB9C2]
            ${inputType === 'search' ? 'pl-10 pr-3 py-1.5' : 'px-3 py-1.5'}
            ${className}
          `}
          {...props}
        />
      </div>
      {status === 'error' && errorMessage && (
        <div className="flex items-center gap-1 text-xs text-[#FF6161]">
          <Icon name="close" size={16} className="text-[#FF6161]" />
          {errorMessage}
        </div>
      )}
    </div>
  );
}
