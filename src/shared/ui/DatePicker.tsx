/**
 * DatePicker — Figma `date picker` + `date picker_modal` + `button_element` 기반
 * 트리거 input 클릭 → 달력 모달 → 날짜 선택
 * 달력은 fixed 포지션으로 렌더링하여 부모 overflow에 영향받지 않음
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

import Icon from './Icon';

type CalendarSize = 'sm' | 'md' | 'lg';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  calendarSize?: CalendarSize;
}

const calendarSizeStyles: Record<CalendarSize, {
  width: string;
  padding: string;
  cellSize: string;
  gap: string;
  headerFont: string;
  dayFont: string;
  cellFont: string;
}> = {
  sm: {
    width: 'w-56',
    padding: 'p-3',
    cellSize: 'w-5 h-5',
    gap: 'gap-1',
    headerFont: 'text-sm',
    dayFont: 'text-xs',
    cellFont: 'text-[10px]',
  },
  md: {
    width: 'w-72',
    padding: 'p-4',
    cellSize: 'w-7 h-7',
    gap: 'gap-2',
    headerFont: 'text-base',
    dayFont: 'text-sm',
    cellFont: 'text-xs',
  },
  lg: {
    width: 'w-96',
    padding: 'p-5',
    cellSize: 'w-10 h-10',
    gap: 'gap-2',
    headerFont: 'text-lg',
    dayFont: 'text-sm',
    cellFont: 'text-sm',
  },
};

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

const formatDisplay = (dateStr: string): string => {
  if (!dateStr) {
    return '';
  }
  return dateStr.replace(/-/g, '.');
};

const getMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevLastDate = new Date(year, month, 0).getDate();

  const days: { date: number; type: 'prev' | 'current' | 'next'; full: string }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevLastDate - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    days.push({
      date: d,
      type: 'prev',
      full: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }

  for (let d = 1; d <= lastDate; d++) {
    days.push({
      date: d,
      type: 'current',
      full: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }

  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month + 2 > 12 ? 1 : month + 2;
    const y = month + 2 > 12 ? year + 1 : year;
    days.push({
      date: d,
      type: 'next',
      full: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }

  return days;
};

const getToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export default function DatePicker({
  value,
  onChange,
  placeholder = '날짜 선택',
  calendarSize = 'md',
}: DatePickerProps) {
  const sizeStyle = calendarSizeStyles[calendarSize];
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [viewYear, setViewYear] = useState(() => {
    if (value) {
      return parseInt(value.split('-')[0], 10);
    }
    return new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    if (value) {
      return parseInt(value.split('-')[1], 10) - 1;
    }
    return new Date().getMonth();
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const today = getToday();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        calendarRef.current && !calendarRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = useCallback(() => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
    setIsOpen((prev) => !prev);
  }, [isOpen]);

  const handlePrevMonth = useCallback(() => {
    setViewMonth((prev) => {
      if (prev === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewMonth((prev) => {
      if (prev === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const handleSelect = useCallback(
    (dateStr: string) => {
      onChange(dateStr);
      setIsOpen(false);
    },
    [onChange],
  );

  const days = getMonthDays(viewYear, viewMonth);

  const getCellStyle = (day: typeof days[0]): string => {
    if (day.type !== 'current') {
      return 'text-[#AEB9C2]';
    }
    if (day.full === value) {
      return 'bg-[#6096E6] text-white';
    }
    if (day.full === today) {
      return 'text-[#131416] border border-[#E0E5EA]';
    }
    const dayOfWeek = new Date(day.full).getDay();
    if (dayOfWeek === 0) {
      return 'text-[#FF6161]';
    }
    return 'text-[#131416] hover:bg-[#ECF3FD]';
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={`
          w-full
          h-9
          px-3
          py-1.5
          flex
          items-center
          justify-between
          gap-1
          bg-[rgba(255,255,255,0.8)]
          border
          rounded-md
          text-sm
          font-medium
          outline-none
          transition-colors
          cursor-pointer
          ${isOpen ? 'border-[#6096E6]' : 'border-[#AEB9C2] hover:border-[#6096E6]'}
          ${value ? 'text-[#131416]' : 'text-[#AEB9C2]'}
        `}
      >
        {value ? formatDisplay(value) : placeholder}
        <Icon name="calendar" size={20} className="text-[#6D7882]" />
      </button>

      {isOpen && createPortal(
        <div
          ref={calendarRef}
          style={{ top: position.top, left: position.left }}
          className={`
            fixed
            ${sizeStyle.width}
            ${sizeStyle.padding}
            bg-[rgba(255,255,255,0.95)]
            backdrop-blur-[20px]
            rounded-[10px]
            shadow-[0px_10px_20px_0px_rgba(22,45,71,0.2)]
            z-[100]
          `}
        >
          <div
            className={`
              flex
              items-center
              justify-between
              pb-3
              mb-3
              border-b
              border-[#CDD1D5]
            `}
          >
            <button
              type="button"
              onClick={handlePrevMonth}
              className={`
                w-5
                h-5
                flex
                items-center
                justify-center
                text-[#464C53]
                hover:text-[#131416]
                cursor-pointer
              `}
            >
              <Icon name="arrow-left" size={20} />
            </button>
            <span className={`${sizeStyle.headerFont} font-bold text-[#131416]`}>
              {viewYear}년 {viewMonth + 1}월
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className={`
                w-5
                h-5
                flex
                items-center
                justify-center
                text-[#464C53]
                hover:text-[#131416]
                cursor-pointer
              `}
            >
              <Icon name="arrow-right" size={20} />
            </button>
          </div>

          <div className={`grid grid-cols-7 ${sizeStyle.gap} mb-2`}>
            {DAYS_OF_WEEK.map((day, i) => (
              <div
                key={day}
                className={`
                  text-center
                  ${sizeStyle.dayFont}
                  font-semibold
                  ${i === 0 ? 'text-[#FF6161]' : 'text-[#131416]'}
                `}
              >
                {day}
              </div>
            ))}
          </div>

          <div className={`grid grid-cols-7 ${sizeStyle.gap}`}>
            {days.map((day) => (
              <button
                key={day.full}
                type="button"
                onClick={() => handleSelect(day.full)}
                className={`
                  ${sizeStyle.cellSize}
                  flex
                  items-center
                  justify-center
                  rounded-full
                  ${sizeStyle.cellFont}
                  font-medium
                  transition-colors
                  cursor-pointer
                  ${getCellStyle(day)}
                `}
              >
                {day.date}
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
