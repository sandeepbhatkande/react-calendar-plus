import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parseISO,
  isValid,
  getDay,
  eachDayOfInterval,
  getWeek,
} from 'date-fns'
import { enUS } from 'date-fns/locale'
import { CalendarView, LocaleConfig, DateRange } from '../types'

export const DEFAULT_LOCALE: LocaleConfig = {
  locale: 'en-US',
  weekStartsOn: 0, // Sunday
  formatOptions: {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  },
}

export const getCalendarDays = (
  date: Date,
  locale: LocaleConfig = DEFAULT_LOCALE
): Date[] => {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: locale.weekStartsOn })
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: locale.weekStartsOn })
  
  return eachDayOfInterval({ start, end })
}

export const getWeekDays = (
  date: Date,
  locale: LocaleConfig = DEFAULT_LOCALE
): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: locale.weekStartsOn })
  const end = endOfWeek(date, { weekStartsOn: locale.weekStartsOn })
  
  return eachDayOfInterval({ start, end })
}

export const getWeekOfMonth = (date: Date): Date[] => {
  const start = startOfWeek(date)
  const end = endOfWeek(date)
  
  return eachDayOfInterval({ start, end })
}

export const formatDate = (
  date: Date,
  formatString: string
): string => {
  return format(date, formatString, { locale: enUS })
}

export const formatDateForDisplay = (
  date: Date,
  locale: LocaleConfig = DEFAULT_LOCALE
): string => {
  return new Intl.DateTimeFormat(locale.locale, locale.formatOptions).format(date)
}

export const isDateInRange = (date: Date, range: DateRange): boolean => {
  if (!range.start || !range.end) return false
  return isWithinInterval(date, { start: range.start, end: range.end })
}

export const isDateSelected = (
  date: Date,
  selectedValue: Date | Date[] | DateRange | null
): boolean => {
  if (!selectedValue) return false
  
  if (selectedValue instanceof Date) {
    return isSameDay(date, selectedValue)
  }
  
  if (Array.isArray(selectedValue)) {
    return selectedValue.some(selectedDate => isSameDay(date, selectedDate))
  }
  
  // DateRange
  if (selectedValue.start && selectedValue.end) {
    return isDateInRange(date, selectedValue)
  } else if (selectedValue.start) {
    return isSameDay(date, selectedValue.start)
  }
  
  return false
}

export const isDateDisabled = (
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[],
  disabledDaysOfWeek?: number[],
  disableWeekends?: boolean
): boolean => {
  if (minDate && date < minDate) return true
  if (maxDate && date > maxDate) return true
  
  if (disabledDates && disabledDates.some(disabledDate => isSameDay(date, disabledDate))) {
    return true
  }
  
  const dayOfWeek = getDay(date)
  if (disabledDaysOfWeek && disabledDaysOfWeek.includes(dayOfWeek)) {
    return true
  }
  
  if (disableWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
    return true
  }
  
  return false
}

export const getViewTitle = (date: Date, view: CalendarView): string => {
  switch (view) {
    case 'month':
      return format(date, 'MMMM yyyy', { locale: enUS })
    case 'week':
      const weekStart = startOfWeek(date)
      const weekEnd = endOfWeek(date)
      if (isSameMonth(weekStart, weekEnd)) {
        return `${format(weekStart, 'MMM d', { locale: enUS })} - ${format(weekEnd, 'd, yyyy', { locale: enUS })}`
      } else {
        return `${format(weekStart, 'MMM d', { locale: enUS })} - ${format(weekEnd, 'MMM d, yyyy', { locale: enUS })}`
      }
    case 'day':
      return format(date, 'EEEE, MMMM d, yyyy', { locale: enUS })
    default:
      return format(date, 'MMMM yyyy', { locale: enUS })
  }
}

export const navigateDate = (
  date: Date,
  direction: 'previous' | 'next',
  view: CalendarView
): Date => {
  switch (view) {
    case 'month':
      return direction === 'previous' ? subMonths(date, 1) : addMonths(date, 1)
    case 'week':
      return direction === 'previous' ? subWeeks(date, 1) : addWeeks(date, 1)
    case 'day':
      return direction === 'previous' ? subDays(date, 1) : addDays(date, 1)
    default:
      return date
  }
}

export const parseDateTime = (dateTimeString: string): Date | null => {
  try {
    const parsed = parseISO(dateTimeString)
    return isValid(parsed) ? parsed : null
  } catch {
    return null
  }
}

export const combineDateTime = (date: Date, time: Date): Date => {
  const newDate = new Date(date)
  newDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds())
  return newDate
}

export const getWeekNumber = (date: Date): number => {
  return getWeek(date)
} 