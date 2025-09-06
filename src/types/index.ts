export type CalendarView = 'month' | 'week' | 'day'

export type SelectionMode = 'single' | 'range' | 'multiple'

export interface CalendarDate {
  year: number
  month: number
  day: number
}

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end?: Date
  color?: string
  textColor?: string
}

export interface LocaleConfig {
  locale: string
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = Sunday, 1 = Monday, etc.
  formatOptions?: {
    weekday?: 'narrow' | 'short' | 'long'
    month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long'
    day?: 'numeric' | '2-digit'
  }
}

export interface CalendarTheme {
  primary?: string
  secondary?: string
  background?: string
  text?: string
  textSecondary?: string
  border?: string
  hover?: string
  selected?: string
  disabled?: string
  today?: string
}

export interface DayRendererProps {
  date: Date
  isToday: boolean
  isSelected: boolean
  isInRange: boolean
  isDisabled: boolean
  isOutOfMonth: boolean
  events: CalendarEvent[]
  onClick: (date: Date) => void
}

export interface HeaderRendererProps {
  date: Date
  view: CalendarView
  onPrevious: () => void
  onNext: () => void
  onViewChange: (view: CalendarView) => void
}

export interface CalendarProps {
  // Basic props
  value?: Date | Date[] | DateRange | null
  defaultValue?: Date | Date[] | DateRange | null
  onChange?: (value: Date | Date[] | DateRange | null) => void
  
  // Interaction mode
  interactionMode?: CalendarInteractionMode
  
  // View and selection
  view?: CalendarView
  defaultView?: CalendarView
  onViewChange?: (view: CalendarView) => void
  selectionMode?: SelectionMode
  
  // Time picker
  showTimePicker?: boolean
  timeFormat?: '12h' | '24h'
  minuteStep?: number
  
  // Locale and formatting
  locale?: LocaleConfig
  
  // Styling
  className?: string
  theme?: CalendarTheme
  
  // Event handlers
  onDateClick?: (date: Date, event: React.MouseEvent) => void
  onRangeSelect?: (range: DateRange) => void
  onMonthChange?: (date: Date) => void
  onWeekChange?: (startOfWeek: Date) => void
  onDayChange?: (date: Date) => void
  
  // Custom renderers
  dayRenderer?: (props: DayRendererProps) => React.ReactNode
  headerRenderer?: (props: HeaderRendererProps) => React.ReactNode
  
  // Constraints
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  disabledDaysOfWeek?: number[]
  disableWeekends?: boolean
  
  // Events
  events?: CalendarEvent[]
  
  // Responsive
  responsive?: boolean
  
  // Additional props
  showWeekNumbers?: boolean
  showOtherMonths?: boolean
  fixedWeekCount?: boolean
}

export interface TimePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  format?: '12h' | '24h'
  minuteStep?: number
  disabled?: boolean
  className?: string
}

export type CalendarInteractionMode = 'standalone' | 'input'

export interface CalendarInputProps extends Omit<CalendarProps, 'className'> {
  // Input specific props
  placeholder?: string
  inputClassName?: string
  calendarClassName?: string
  showInput?: boolean
  inputFormat?: string
  disabled?: boolean
  readOnly?: boolean
  clearable?: boolean
  onClear?: () => void
  
  // Dropdown specific props
  dropdownPosition?: 'auto' | 'top' | 'bottom'
  dropdownOffset?: number
  closeOnSelect?: boolean
  closeOnOutsideClick?: boolean
  onOpen?: () => void
  onClose?: () => void
  
  // Input field props
  name?: string
  id?: string
  autoComplete?: string
  required?: boolean
} 