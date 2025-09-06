import React, { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import clsx from 'clsx'
import { Calendar } from './Calendar'
import { CalendarProps, DateRange } from '../types'

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

export const CalendarInput: React.FC<CalendarInputProps> = ({
  value,
  defaultValue,
  onChange,
  placeholder = 'Select date...',
  inputClassName,
  calendarClassName,
  showInput = true,
  inputFormat = 'MM/dd/yyyy',
  disabled = false,
  readOnly = false,
  clearable = false,
  onClear,
  dropdownPosition = 'auto',
  dropdownOffset = 4,
  closeOnSelect = true,
  closeOnOutsideClick = true,
  onOpen,
  onClose,
  name,
  id,
  autoComplete = 'off',
  required = false,
  selectionMode = 'single',
  showTimePicker = false,
  ...calendarProps
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
  
  const inputRef = useRef<HTMLInputElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Format the current value for display
  const formatValue = (val: Date | Date[] | DateRange | null): string => {
    if (!val) return ''
    
    if (val instanceof Date) {
      return format(val, inputFormat)
    }
    
    if (Array.isArray(val)) {
      return val.map(d => format(d, inputFormat)).join(', ')
    }
    
    // DateRange
    const start = val.start ? format(val.start, inputFormat) : ''
    const end = val.end ? format(val.end, inputFormat) : ''
    return start && end ? `${start} - ${end}` : start || end
  }

  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(formatValue(value ?? defaultValue ?? null))
  }, [value, defaultValue, inputFormat])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return
    setInputValue(e.target.value)
  }

  // Handle input click
  const handleInputClick = () => {
    if (disabled || readOnly) return
    if (!isOpen) {
      setIsOpen(true)
      onOpen?.()
    }
  }

  // Handle calendar value change
  const handleCalendarChange = (newValue: Date | Date[] | DateRange | null) => {
    onChange?.(newValue)
    setInputValue(formatValue(newValue))
    
    // Only close on select if time picker is not enabled
    // When time picker is enabled, user needs to select time after date
    if (closeOnSelect && selectionMode === 'single' && !showTimePicker) {
      setIsOpen(false)
      onClose?.()
    }
  }


  // Handle clear button click
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(null)
    setInputValue('')
    onClear?.()
  }

  // Position dropdown
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      let top = inputRect.bottom + dropdownOffset
      let position: 'top' | 'bottom' = 'bottom'
      
      // Auto positioning - use estimated calendar height for initial positioning
      if (dropdownPosition === 'auto') {
        const spaceBelow = viewportHeight - inputRect.bottom
        const estimatedCalendarHeight = 400 // Estimated height for calendar
        
        if (spaceBelow < estimatedCalendarHeight && inputRect.top > estimatedCalendarHeight) {
          position = 'top'
        }
      } else if (dropdownPosition === 'top') {
        position = 'top'
      }
      
      setDropdownStyle({
        position: 'fixed',
        top: position === 'top' ? 'auto' : top,
        bottom: position === 'top' ? viewportHeight - inputRect.top + dropdownOffset : 'auto',
        left: inputRect.left,
        zIndex: 1000,
        minWidth: inputRect.width,
      })
    }
  }, [isOpen, dropdownPosition, dropdownOffset])

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnOutsideClick &&
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        onClose?.()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, closeOnOutsideClick, onClose])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        onClose?.()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Handle scroll and resize events to reposition dropdown
  useEffect(() => {
    let timeoutId: number | null = null

    const handleScroll = () => {
      if (isOpen && inputRef.current) {
        // Throttle scroll events to improve performance
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        
        timeoutId = setTimeout(() => {
          const inputRect = inputRef.current!.getBoundingClientRect()
          const viewportHeight = window.innerHeight
          const viewportWidth = window.innerWidth
          
          // Close dropdown if input is completely out of view
          if (inputRect.bottom < 0 || inputRect.top > viewportHeight || 
              inputRect.right < 0 || inputRect.left > viewportWidth) {
            setIsOpen(false)
            onClose?.()
            return
          }
          
          let top = inputRect.bottom + dropdownOffset
          let position: 'top' | 'bottom' = 'bottom'
          
          // Auto positioning - use estimated calendar height for initial positioning
          if (dropdownPosition === 'auto') {
            const spaceBelow = viewportHeight - inputRect.bottom
            const estimatedCalendarHeight = 400 // Estimated height for calendar
            
            if (spaceBelow < estimatedCalendarHeight && inputRect.top > estimatedCalendarHeight) {
              position = 'top'
            }
          } else if (dropdownPosition === 'top') {
            position = 'top'
          }
          
          setDropdownStyle({
            position: 'fixed',
            top: position === 'top' ? 'auto' : top,
            bottom: position === 'top' ? viewportHeight - inputRect.top + dropdownOffset : 'auto',
            left: inputRect.left,
            zIndex: 1000,
            minWidth: inputRect.width,
          })
        }, 16) // ~60fps throttling
      }
    }

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true) // Use capture to catch all scroll events
      window.addEventListener('resize', handleScroll)
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleScroll)
      }
    }
  }, [isOpen, dropdownPosition, dropdownOffset])

  return (
    <div ref={containerRef} className="rcp-calendar-input">
      {showInput && (
        <div className="rcp-calendar-input__wrapper">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            name={name}
            id={id}
            autoComplete={autoComplete}
            required={required}
            className={clsx(
              'rcp-calendar-input__field',
              disabled && 'rcp-calendar-input__field--disabled',
              readOnly && 'rcp-calendar-input__field--readonly',
              isOpen && 'rcp-calendar-input__field--open',
              inputClassName
            )}
          />
          
          {clearable && inputValue && !disabled && !readOnly && (
            <button
              type="button"
              onClick={handleClear}
              className="rcp-calendar-input__clear"
              aria-label="Clear date"
            >
              ×
            </button>
          )}
          
          <button
            type="button"
            onClick={handleInputClick}
            disabled={disabled}
            className={clsx(
              'rcp-calendar-input__toggle',
              disabled && 'rcp-calendar-input__toggle--disabled',
              isOpen && 'rcp-calendar-input__toggle--open'
            )}
            aria-label="Open calendar"
          >
            📅
          </button>
        </div>
      )}
      
      {isOpen && (
        <div
          ref={calendarRef}
          className={clsx(
            'rcp-calendar-input__dropdown',
            calendarClassName
          )}
          style={dropdownStyle}
        >
          <Calendar
            value={value || defaultValue}
            onChange={handleCalendarChange}
            selectionMode={selectionMode}
            showTimePicker={showTimePicker}
            {...calendarProps}
          />
          {showTimePicker && (
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--rcp-border)',
              backgroundColor: 'var(--rcp-hover)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px'
            }}>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onClose?.()
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--rcp-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
