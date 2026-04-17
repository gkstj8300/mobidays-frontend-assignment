/**
 * Checkbox — Figma `checkbox` 컴포넌트 기반
 * 18x18px, borderRadius 4px
 */

'use client';

import type { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export default function Checkbox({
  label,
  className = '',
  ...props
}: CheckboxProps) {
  return (
    <label
      className={`
        inline-flex
        items-center
        gap-2
        cursor-pointer
        ${props.disabled ? 'cursor-not-allowed opacity-50' : ''}
      `}
    >
      <div className="relative">
        <input
          type="checkbox"
          className="peer sr-only"
          {...props}
        />
        <div
          className={`
            w-[18px]
            h-[18px]
            rounded
            border-[1.4px]
            border-[#CED5DB]
            bg-[rgba(255,255,255,0.8)]
            transition-colors
            peer-checked:bg-[#6096E6]
            peer-checked:border-[#6096E6]
            peer-hover:border-[#6096E6]
            peer-disabled:border-[rgba(0,0,0,0.1)]
            ${className}
          `}
        />
        <svg
          className={`
            absolute
            top-0.5
            left-0.5
            w-3
            h-3
            text-white
            opacity-0
            peer-checked:opacity-100
            transition-opacity
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      {label && (
        <span className="text-sm text-[#131416]">{label}</span>
      )}
    </label>
  );
}
