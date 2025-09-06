import React, { useState, useEffect, useMemo } from 'react'
import { format, startOfWeek, isSameDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import clsx from 'clsx'
import { CalendarProps, CalendarView, DateRange } from '../types'
import { CalendarHeader } from './CalendarHeader'
import { CalendarDay } from './CalendarDay'
import { TimePicker } from './TimePicker'
import {
  getCalendarDays,
  getWeekDays,
  navigateDate,
  DEFAULT_LOCALE,
  getWeekNumber,
  isDateInRange,
  combineDateTime,
} from '../utils/dateUtils'

export const Calendar: React.FC<CalendarProps> = ({
  value,
  defaultValue,
  onChange,
  view: controlledView,
  defaultView = 'month',
  onViewChange,
  selectionMode = 'single',
  showTimePicker = false,
  timeFormat = '24h',
  minuteStep = 1,
  locale = DEFAULT_LOCALE,
  className,
  theme,
  onDateClick,
  onRangeSelect,
  onMonthChange,
  onWeekChange,
  onDayChange,
  dayRenderer,
  headerRenderer,
  minDate,
  maxDate,
  disabledDates,
  disabledDaysOfWeek,
  disableWeekends,
  events = [],
  responsive = true,
  showWeekNumbers = false,
  showOtherMonths = true,
}) => {
  // State management
  const [currentView, setCurrentView] = useState<CalendarView>(controlledView || defaultView)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || null)
  const [rangeStart, setRangeStart] = useState<Date | null>(null)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  // Sync with controlled props
  useEffect(() => {
    if (controlledView !== undefined) {
      setCurrentView(controlledView)
    }
  }, [controlledView])

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  // Get days to display based on current view
  const displayDays = useMemo(() => {
    switch (currentView) {
      case 'month':
        return getCalendarDays(currentDate, locale)
      case 'week':
        return getWeekDays(currentDate, locale)
      case 'day':
        return [currentDate]
      default:
        return getCalendarDays(currentDate, locale)
    }
  }, [currentDate, currentView, locale])

  // Get week header days
  const weekHeaders = useMemo(() => {
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: locale.weekStartsOn })
    return getWeekDays(startOfCurrentWeek, locale)
  }, [locale])

  // Handle view changes
  const handleViewChange = (newView: CalendarView) => {
    setCurrentView(newView)
    onViewChange?.(newView)
    
    // Call appropriate change handlers
    switch (newView) {
      case 'month':
        onMonthChange?.(currentDate)
        break
      case 'week':
        onWeekChange?.(startOfWeek(currentDate, { weekStartsOn: locale.weekStartsOn }))
        break
      case 'day':
        onDayChange?.(currentDate)
        break
    }
  }

  // Handle navigation
  const handlePrevious = () => {
    const newDate = navigateDate(currentDate, 'previous', currentView)
    setCurrentDate(newDate)
    
    switch (currentView) {
      case 'month':
        onMonthChange?.(newDate)
        break
      case 'week':
        onWeekChange?.(startOfWeek(newDate, { weekStartsOn: locale.weekStartsOn }))
        break
      case 'day':
        onDayChange?.(newDate)
        break
    }
  }

  const handleNext = () => {
    const newDate = navigateDate(currentDate, 'next', currentView)
    setCurrentDate(newDate)
    
    switch (currentView) {
      case 'month':
        onMonthChange?.(newDate)
        break
      case 'week':
        onWeekChange?.(startOfWeek(newDate, { weekStartsOn: locale.weekStartsOn }))
        break
      case 'day':
        onDayChange?.(newDate)
        break
    }
  }

  // Handle direct date changes (from year/month selector)
  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate)
    
    switch (currentView) {
      case 'month':
        onMonthChange?.(newDate)
        break
      case 'week':
        onWeekChange?.(startOfWeek(newDate, { weekStartsOn: locale.weekStartsOn }))
        break
      case 'day':
        onDayChange?.(newDate)
        break
    }
  }

  // Handle date selection
  const handleDateClick = (date: Date, event: React.MouseEvent) => {
    onDateClick?.(date, event)

    let newValue: Date | Date[] | DateRange | null = null

    switch (selectionMode) {
      case 'single':
        newValue = date
        if (showTimePicker && selectedValue instanceof Date) {
          newValue = combineDateTime(date, selectedValue)
        }
        break

      case 'multiple':
        if (Array.isArray(selectedValue)) {
          const exists = selectedValue.find(d => isSameDay(d, date))
          if (exists) {
            newValue = selectedValue.filter(d => !isSameDay(d, date))
          } else {
            newValue = [...selectedValue, date]
          }
        } else {
          newValue = [date]
        }
        break

      case 'range':
        if (!rangeStart || (rangeStart && hoveredDate)) {
          setRangeStart(date)
          setHoveredDate(null)
          newValue = { start: date, end: null }
        } else {
          const start = rangeStart < date ? rangeStart : date
          const end = rangeStart < date ? date : rangeStart
          newValue = { start, end }
          setRangeStart(null)
          onRangeSelect?.({ start, end })
        }
        break
    }

    setSelectedValue(newValue)
    onChange?.(newValue)
  }

  // Handle time picker changes
  const handleTimeChange = (time: Date) => {
    if (selectedValue instanceof Date) {
      const newValue = combineDateTime(selectedValue, time)
      setSelectedValue(newValue)
      onChange?.(newValue)
    }
  }

  // Handle range hover for preview (unused for now but kept for future enhancement)
  // const handleDateHover = (date: Date) => {
  //   if (selectionMode === 'range' && rangeStart) {
  //     setHoveredDate(date)
  //   }
  // }

  // Check if date is in range (for visual feedback)
  const isInRange = (date: Date): boolean => {
    if (selectionMode !== 'range') return false
    
    if (selectedValue && typeof selectedValue === 'object' && 'start' in selectedValue) {
      return isDateInRange(date, selectedValue as DateRange)
    }
    
    if (rangeStart && hoveredDate) {
      const start = rangeStart < hoveredDate ? rangeStart : hoveredDate
      const end = rangeStart < hoveredDate ? hoveredDate : rangeStart
      return isDateInRange(date, { start, end })
    }
    
    return false
  }

  // Render week numbers
  const renderWeekNumber = (date: Date) => {
    if (!showWeekNumbers) return null
    
    return (
      <div className="rcp-calendar__week-number">
        {getWeekNumber(date)}
      </div>
    )
  }

  // Render calendar grid
  const renderCalendarGrid = () => {
    const weeks: Date[][] = []
    let currentWeek: Date[] = []

    displayDays.forEach((day, index) => {
      currentWeek.push(day)
      
      if (currentWeek.length === 7 || index === displayDays.length - 1) {
        weeks.push([...currentWeek])
        currentWeek = []
      }
    })

    return weeks.map((week, weekIndex) => (
      <div key={weekIndex} className="rcp-calendar__week">
        {showWeekNumbers && renderWeekNumber(week[0])}
        {week.map((day) => (
          <CalendarDay
            key={day.toISOString()}
            date={day}
            currentMonth={currentDate}
            selectedValue={Array.isArray(selectedValue) ? selectedValue : (selectedValue instanceof Date ? selectedValue : null)}
            events={events}
            onDateClick={handleDateClick}
            dayRenderer={dayRenderer}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            disabledDaysOfWeek={disabledDaysOfWeek}
            disableWeekends={disableWeekends}
            showOtherMonths={showOtherMonths}
            className={clsx(
              isInRange(day) && 'rcp-calendar-day--in-range'
            )}
          />
        ))}
      </div>
    ))
  }

  // Apply theme styles
  const themeStyles = theme ? {
    '--rcp-primary': theme.primary,
    '--rcp-secondary': theme.secondary,
    '--rcp-background': theme.background,
    '--rcp-text': theme.text,
    '--rcp-text-secondary': theme.textSecondary,
    '--rcp-border': theme.border,
    '--rcp-hover': theme.hover,
    '--rcp-selected': theme.selected,
    '--rcp-disabled': theme.disabled,
    '--rcp-today': theme.today,
  } as React.CSSProperties : {}

  return (
    <div
      className={clsx(
        'rcp-calendar',
        `rcp-calendar--${currentView}`,
        responsive && 'rcp-calendar--responsive',
        showTimePicker && 'rcp-calendar--with-time',
        className
      )}
      style={themeStyles}
    >
      {/* Header */}
      {headerRenderer ? (
        headerRenderer({
          date: currentDate,
          view: currentView,
          onPrevious: handlePrevious,
          onNext: handleNext,
          onViewChange: handleViewChange,
        })
      ) : (
        <CalendarHeader
          currentDate={currentDate}
          view={currentView}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onViewChange={handleViewChange}
          onDateChange={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}

      {/* Calendar body */}
      <div className="rcp-calendar__body">
        {/* Week day headers */}
        {currentView !== 'day' && (
          <div className="rcp-calendar__weekdays">
            {showWeekNumbers && <div className="rcp-calendar__week-number-header">#</div>}
            {weekHeaders.map((day) => (
              <div key={day.toISOString()} className="rcp-calendar__weekday">
                {format(day, 'EEE', { locale: enUS })}
              </div>
            ))}
          </div>
        )}

        {/* Calendar grid */}
        <div 
          className="rcp-calendar__grid"
          onMouseLeave={() => setHoveredDate(null)}
        >
          {renderCalendarGrid()}
        </div>
      </div>

      {/* Time picker */}
      {showTimePicker && selectedValue instanceof Date && (
        <div className="rcp-calendar__time-picker">
          <TimePicker
            value={selectedValue}
            onChange={handleTimeChange}
            format={timeFormat}
            minuteStep={minuteStep}
          />
        </div>
      )}
    </div>
  )
} 