import React from 'react'
import clsx from 'clsx'
import { CalendarView } from '../types'
import { getViewTitle } from '../utils/dateUtils'

interface CalendarHeaderProps {
  currentDate: Date
  view: CalendarView
  onPrevious: () => void
  onNext: () => void
  onViewChange: (view: CalendarView) => void
  className?: string
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  onPrevious,
  onNext,
  onViewChange,
  className,
}) => {
  const viewOptions: { value: CalendarView; label: string }[] = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' },
  ]

  return (
    <div className={clsx('rcp-calendar-header', className)}>
      <div className="rcp-calendar-header__navigation">
        <button
          type="button"
          onClick={onPrevious}
          className="rcp-calendar-header__nav-button"
          aria-label="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10.5 13L5.5 8L10.5 3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <h2 className="rcp-calendar-header__title">
          {getViewTitle(currentDate, view)}
        </h2>

        <button
          type="button"
          onClick={onNext}
          className="rcp-calendar-header__nav-button"
          aria-label="Next"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.5 3L10.5 8L5.5 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="rcp-calendar-header__view-selector">
        {viewOptions.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onViewChange(value)}
            className={clsx(
              'rcp-calendar-header__view-button',
              view === value && 'rcp-calendar-header__view-button--active'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
} 