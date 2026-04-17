/**
 * Input — Figma `input` 컴포넌트 기반
 * type: default / search
 * status: default / error
 */

'use client';

import type { InputHTMLAttributes } from 'react';

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
          <svg
            className={`
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              w-5
              h-5
              text-[#6D7882]
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
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
        <span
          className={`
            text-xs
            text-[#FF6161]
          `}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}
