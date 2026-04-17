/**
 * 페이지네이션 — 1페이지당 10건, Figma 아이콘 사용
 */

'use client';

import Icon from '@/shared/ui/Icon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 0) {
    return null;
  }

  const startItem = (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, totalItems);

  return (
    <div
      className={`
        flex
        items-center
        justify-between
        pt-4
      `}
    >
      <span className="text-sm text-[#6D7882]">
        {startItem}-{endItem} / {totalItems}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`
            w-8
            h-8
            flex
            items-center
            justify-center
            rounded
            text-[#464C53]
            hover:bg-[#F4F5F6]
            disabled:text-[#AEB9C2]
            disabled:hover:bg-transparent
            transition-colors
            cursor-pointer
            disabled:cursor-not-allowed
          `}
        >
          <Icon name="arrow-left" size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`
              w-8
              h-8
              flex
              items-center
              justify-center
              rounded
              text-sm
              transition-colors
              cursor-pointer
              ${
                page === currentPage
                  ? 'bg-[#6096E6] text-white'
                  : 'text-[#464C53] hover:bg-[#F4F5F6]'
              }
            `}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`
            w-8
            h-8
            flex
            items-center
            justify-center
            rounded
            text-[#464C53]
            hover:bg-[#F4F5F6]
            disabled:text-[#AEB9C2]
            disabled:hover:bg-transparent
            transition-colors
            cursor-pointer
            disabled:cursor-not-allowed
          `}
        >
          <Icon name="arrow-right" size={16} />
        </button>
      </div>
    </div>
  );
}
