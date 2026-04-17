/**
 * Button — Figma `button` 컴포넌트 기반
 * variant: primary / secondary / tertiary
 * size: default (36px) / small (30px)
 */

'use client';

import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'default' | 'small';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-[#0D47A1]
    text-white
    hover:bg-[#2162C3]
    active:bg-[#3C79D7]
    disabled:bg-[rgba(13,71,161,0.4)]
  `,
  secondary: `
    bg-[#3C79D7]
    text-white
    hover:bg-[#4F86DB]
    active:bg-[#6394DF]
    disabled:bg-[rgba(60,121,215,0.4)]
  `,
  tertiary: `
    bg-white
    text-[#131416]
    border
    border-[#AEB9C2]
    hover:bg-[#F4F5F6]
    active:bg-[#ECEFF1]
    disabled:bg-[rgba(0,0,0,0.05)]
    disabled:text-[#AEB9C2]
    disabled:border-[#E0E5EA]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  default: `
    h-9
    px-3
    rounded-lg
    text-sm
    font-medium
  `,
  small: `
    h-[30px]
    px-2.5
    py-2
    rounded-md
    text-xs
    font-medium
  `,
};

export default function Button({
  variant = 'primary',
  size = 'default',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex
        items-center
        justify-center
        gap-0.5
        transition-colors
        cursor-pointer
        disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
