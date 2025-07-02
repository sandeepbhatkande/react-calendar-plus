import React from 'react'
import { isToday, isSameMonth } from 'date-fns'
import clsx from 'clsx'
import { CalendarEvent, DayRendererProps } from '../types'
import { isDateSelected, isDateDisabled } from '../utils/dateUtils'

interface CalendarDayProps {
  date: Date
  currentMonth: Date
  selectedValue: Date | Date[] | null
  events: CalendarEvent[]
  onDateClick: (date: Date, event: React.MouseEvent) => void
  dayRenderer?: (props: DayRendererProps) => React.ReactNode
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  disabledDaysOfWeek?: number[]
  disableWeekends?: boolean
  showOtherMonths?: boolean
  className?: string
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  currentMonth,
  selectedValue,
  events,
  onDateClick,
  dayRenderer,
  minDate,
  maxDate,
  disabledDates,
  disabledDaysOfWeek,
  disableWeekends,
  showOtherMonths = true,
  className,
}) => {
  const isCurrentDay = isToday(date)
  const isSelected = isDateSelected(date, selectedValue)
  const isDisabled = isDateDisabled(
    date,
    minDate,
    maxDate,
    disabledDates,
    disabledDaysOfWeek,
    disableWeekends
  )
  const isOutOfMonth = !isSameMonth(date, currentMonth)
  const dayEvents = events.filter(event => 
    event.start <= date && (!event.end || event.end >= date)
  )

  const handleClick = (event: React.MouseEvent) => {
    if (isDisabled) return
    onDateClick(date, event)
  }

  const dayProps: DayRendererProps = {
    date,
    isToday: isCurrentDay,
    isSelected,
    isInRange: false, // This will be handled by the parent for range selection
    isDisabled,
    isOutOfMonth,
    events: dayEvents,
    onClick: (date: Date) => onDateClick(date, {} as React.MouseEvent),
  }

  if (dayRenderer) {
    return <>{dayRenderer(dayProps)}</>
  }

  if (isOutOfMonth && !showOtherMonths) {
    return <div className="rcp-calendar-day rcp-calendar-day--empty" />
  }

  return (
    <div
      className={clsx(
        'rcp-calendar-day',
        {
          'rcp-calendar-day--today': isCurrentDay,
          'rcp-calendar-day--selected': isSelected,
          'rcp-calendar-day--disabled': isDisabled,
          'rcp-calendar-day--out-of-month': isOutOfMonth,
          'rcp-calendar-day--has-events': dayEvents.length > 0,
        },
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={`${date.getDate()} ${date.toLocaleDateString()}`}
      aria-selected={isSelected}
      aria-disabled={isDisabled}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick(e as any)
        }
      }}
    >
      <span className="rcp-calendar-day__number">
        {date.getDate()}
      </span>
      
      {dayEvents.length > 0 && (
        <div className="rcp-calendar-day__events">
          {dayEvents.slice(0, 3).map((event, index) => (
            <div
              key={event.id || index}
              className="rcp-calendar-day__event"
              style={{
                backgroundColor: event.color,
                color: event.textColor,
              }}
              title={event.title}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="rcp-calendar-day__event-more">
              +{dayEvents.length - 3} more
            </div>
          )}
        </div>
      )}
    </div>
  )
} 