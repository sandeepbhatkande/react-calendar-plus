import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import clsx from 'clsx'
import { TimePickerProps } from '../types'

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  format: timeFormat = '24h',
  minuteStep = 1,
  disabled = false,
  className,
}) => {
  const [hours, setHours] = useState(value ? value.getHours() : 0)
  const [minutes, setMinutes] = useState(value ? value.getMinutes() : 0)
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM')

  useEffect(() => {
    if (value) {
      const date = new Date(value)
      setHours(date.getHours())
      setMinutes(date.getMinutes())
      setPeriod(date.getHours() >= 12 ? 'PM' : 'AM')
    }
  }, [value])

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    if (disabled) return
    
    const date = new Date(value || new Date())
    date.setHours(newHours, newMinutes, 0, 0)
    onChange?.(date)
  }

  const handleHourChange = (newHours: number) => {
    let adjustedHours = newHours
    
    if (timeFormat === '12h') {
      if (period === 'PM' && newHours !== 12) {
        adjustedHours = newHours + 12
      } else if (period === 'AM' && newHours === 12) {
        adjustedHours = 0
      }
    }
    
    setHours(adjustedHours)
    handleTimeChange(adjustedHours, minutes)
  }

  const handleMinuteChange = (newMinutes: number) => {
    setMinutes(newMinutes)
    handleTimeChange(hours, newMinutes)
  }

  const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
    setPeriod(newPeriod)
    let adjustedHours = hours
    
    if (newPeriod === 'PM' && hours < 12) {
      adjustedHours = hours + 12
    } else if (newPeriod === 'AM' && hours >= 12) {
      adjustedHours = hours - 12
    }
    
    setHours(adjustedHours)
    handleTimeChange(adjustedHours, minutes)
  }

  const displayHours = timeFormat === '12h' 
    ? (hours === 0 ? 12 : hours > 12 ? hours - 12 : hours)
    : hours

  const hourOptions = Array.from(
    { length: timeFormat === '12h' ? 12 : 24 },
    (_, i) => timeFormat === '12h' ? i + 1 : i
  )

  const minuteOptions = Array.from(
    { length: Math.floor(60 / minuteStep) },
    (_, i) => i * minuteStep
  )

  return (
    <div className={clsx('rcp-time-picker', className)}>
      <div className="rcp-time-picker__container">
        {/* Hours */}
        <div className="rcp-time-picker__field">
          <label className="rcp-time-picker__label">Hour</label>
          <select
            value={displayHours}
            onChange={(e) => handleHourChange(parseInt(e.target.value))}
            disabled={disabled}
            className="rcp-time-picker__select"
          >
            {hourOptions.map((hour) => (
              <option key={hour} value={hour}>
                {hour.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        <div className="rcp-time-picker__separator">:</div>

        {/* Minutes */}
        <div className="rcp-time-picker__field">
          <label className="rcp-time-picker__label">Minute</label>
          <select
            value={minutes}
            onChange={(e) => handleMinuteChange(parseInt(e.target.value))}
            disabled={disabled}
            className="rcp-time-picker__select"
          >
            {minuteOptions.map((minute) => (
              <option key={minute} value={minute}>
                {minute.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        {/* Period (AM/PM) */}
        {timeFormat === '12h' && (
          <div className="rcp-time-picker__field">
            <label className="rcp-time-picker__label">Period</label>
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value as 'AM' | 'PM')}
              disabled={disabled}
              className="rcp-time-picker__select"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        )}
      </div>

      {/* Current time display */}
      <div className="rcp-time-picker__display">
        {value && format(value, timeFormat === '12h' ? 'h:mm a' : 'HH:mm')}
      </div>
    </div>
  )
} 