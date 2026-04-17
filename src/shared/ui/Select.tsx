/**
 * Select — Figma `Dropdown` 컴포넌트 기반
 * borderRadius 8px, height 36px
 */

'use client';

import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  placeholder?: string;
}

export default function Select({
  options,
  placeholder,
  className = '',
  ...props
}: SelectProps) {
  return (
    <select
      className={`
        h-9
        px-3
        py-1.5
        bg-[rgba(255,255,255,0.8)]
        border
        border-[#CED5DB]
        rounded-lg
        text-sm
        font-medium
        text-[#131416]
        outline-none
        transition-colors
        focus:border-[#6096E6]
        disabled:bg-[rgba(0,0,0,0.05)]
        disabled:border-[#E0E5EA]
        disabled:text-[#AEB9C2]
        cursor-pointer
        appearance-none
        bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2218%22%20height%3d%2218%22%20viewBox%3d%220%200%2024%2024%22%20fill%3d%22none%22%20stroke%3d%22%236D7882%22%20stroke-width%3d%222%22%3e%3cpath%20d%3d%22M6%209l6%206%206-6%22%2f%3e%3c%2fsvg%3e')]
        bg-no-repeat
        bg-[right_8px_center]
        pr-8
        ${className}
      `}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
