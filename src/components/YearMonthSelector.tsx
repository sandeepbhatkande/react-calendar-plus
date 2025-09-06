import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { format, setYear, setMonth, getYear, getMonth } from 'date-fns'
import { enUS } from 'date-fns/locale'

interface YearMonthSelectorProps {
  currentDate: Date
  onDateChange: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  className?: string
}

export const YearMonthSelector: React.FC<YearMonthSelectorProps> = ({
  currentDate,
  onDateChange,
  minDate,
  maxDate,
  className,
}) => {
  const [isYearOpen, setIsYearOpen] = useState(false)
  const [isMonthOpen, setIsMonthOpen] = useState(false)
  const yearRef = useRef<HTMLDivElement>(null)
  const monthRef = useRef<HTMLDivElement>(null)

  const currentYear = getYear(currentDate)
  const currentMonth = getMonth(currentDate)

  // Generate year options (current year ± 50 years)
  const yearOptions = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i)

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2024, i, 1), 'MMMM', { locale: enUS }),
  }))

  // Filter years based on min/max date constraints
  const filteredYearOptions = yearOptions.filter(year => {
    if (minDate && year < getYear(minDate)) return false
    if (maxDate && year > getYear(maxDate)) return false
    return true
  })

  // Filter months based on min/max date constraints for current year
  const filteredMonthOptions = monthOptions.filter(({ value }) => {
    const testDate = new Date(currentYear, value, 1)
    if (minDate && testDate < minDate) return false
    if (maxDate && testDate > maxDate) return false
    return true
  })

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false)
      }
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleYearChange = (year: number) => {
    const newDate = setYear(currentDate, year)
    onDateChange(newDate)
    setIsYearOpen(false)
  }

  const handleMonthChange = (month: number) => {
    const newDate = setMonth(currentDate, month)
    onDateChange(newDate)
    setIsMonthOpen(false)
  }

  return (
    <div className={clsx('rcp-year-month-selector', className)}>
      {/* Month Selector */}
      <div className="rcp-year-month-selector__group" ref={monthRef}>
        <button
          type="button"
          className="rcp-year-month-selector__button"
          onClick={() => setIsMonthOpen(!isMonthOpen)}
          aria-label="Select month"
        >
          {format(currentDate, 'MMMM', { locale: enUS })}
          <svg
            className={clsx(
              'rcp-year-month-selector__arrow',
              isMonthOpen && 'rcp-year-month-selector__arrow--open'
            )}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="currentColor"
          >
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {isMonthOpen && (
          <div className="rcp-year-month-selector__dropdown">
            <div className="rcp-year-month-selector__dropdown-content">
              {filteredMonthOptions.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={clsx(
                    'rcp-year-month-selector__option',
                    currentMonth === value && 'rcp-year-month-selector__option--selected'
                  )}
                  onClick={() => handleMonthChange(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Year Selector */}
      <div className="rcp-year-month-selector__group" ref={yearRef}>
        <button
          type="button"
          className="rcp-year-month-selector__button"
          onClick={() => setIsYearOpen(!isYearOpen)}
          aria-label="Select year"
        >
          {currentYear}
          <svg
            className={clsx(
              'rcp-year-month-selector__arrow',
              isYearOpen && 'rcp-year-month-selector__arrow--open'
            )}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="currentColor"
          >
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {isYearOpen && (
          <div className="rcp-year-month-selector__dropdown">
            <div className="rcp-year-month-selector__dropdown-content rcp-year-month-selector__dropdown-content--years">
              {filteredYearOptions.map((year) => (
                <button
                  key={year}
                  type="button"
                  className={clsx(
                    'rcp-year-month-selector__option',
                    currentYear === year && 'rcp-year-month-selector__option--selected'
                  )}
                  onClick={() => handleYearChange(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
