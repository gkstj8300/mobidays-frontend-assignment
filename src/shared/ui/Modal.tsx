/**
 * Modal — Figma 오버레이 + 카드 기반
 * overlay: rgba(5, 27, 60, 0.5)
 * card: bg white, borderRadius 10px, shadow
 */

'use client';

import { useEffect, useCallback } from 'react';

import Icon from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
      `}
    >
      <div
        className={`
          absolute
          inset-0
          bg-[rgba(5,27,60,0.5)]
        `}
        onClick={onClose}
      />

      <div
        className={`
          relative
          w-full
          max-w-[480px]
          max-h-[90vh]
          overflow-y-auto
          bg-white
          rounded-[10px]
          shadow-[0px_10px_20px_0px_rgba(22,45,71,0.2)]
          p-6
        `}
      >
        <div
          className={`
            flex
            items-center
            justify-between
            mb-6
          `}
        >
          <div className="flex items-center gap-2">
            <div
              className={`
                w-8
                h-8
                flex
                items-center
                justify-center
                rounded-lg
                bg-[#ECF3FD]
                text-[#3C79D7]
              `}
            >
              <Icon name="plus" size={18} />
            </div>
            <h2 className="text-lg font-bold text-[#131416]">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`
              w-8
              h-8
              flex
              items-center
              justify-center
              rounded
              text-[#6D7882]
              hover:text-[#131416]
              hover:bg-[#F4F5F6]
              transition-colors
              cursor-pointer
            `}
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
