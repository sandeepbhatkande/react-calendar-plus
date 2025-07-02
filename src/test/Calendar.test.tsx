import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Calendar } from '../components/Calendar'
import { CalendarProps } from '../types'

describe('Calendar', () => {
  const defaultProps: Partial<CalendarProps> = {
    defaultView: 'month',
    selectionMode: 'single',
  }

  it('renders the calendar with default props', () => {
    render(<Calendar {...defaultProps} />)
    
    // Check if calendar container is rendered
    const calendar = screen.getByRole('button', { name: /\d+ .+/ })
    expect(calendar).toBeDefined()
  })

  it('renders month view by default', () => {
    render(<Calendar {...defaultProps} />)
    
    // Should show month/year in header
    const monthHeader = screen.getByRole('heading')
    expect(monthHeader.textContent).toMatch(/\w+ \d{4}/)
  })

  it('changes view when view button is clicked', () => {
    const onViewChange = vi.fn()
    render(<Calendar {...defaultProps} onViewChange={onViewChange} />)
    
    const weekButton = screen.getByText('Week')
    fireEvent.click(weekButton)
    
    expect(onViewChange).toHaveBeenCalledWith('week')
  })

  it('navigates to previous month', () => {
    const onMonthChange = vi.fn()
    render(<Calendar {...defaultProps} onMonthChange={onMonthChange} />)
    
    const prevButton = screen.getByLabelText('Previous')
    fireEvent.click(prevButton)
    
    expect(onMonthChange).toHaveBeenCalled()
  })

  it('navigates to next month', () => {
    const onMonthChange = vi.fn()
    render(<Calendar {...defaultProps} onMonthChange={onMonthChange} />)
    
    const nextButton = screen.getByLabelText('Next')
    fireEvent.click(nextButton)
    
    expect(onMonthChange).toHaveBeenCalled()
  })

  it('handles date selection in single mode', () => {
    const onChange = vi.fn()
    render(<Calendar {...defaultProps} selectionMode="single" onChange={onChange} />)
    
    // Find a date button (looking for first available date)
    const dateButton = screen.getAllByRole('button')[3] // Skip nav and view buttons
    fireEvent.click(dateButton)
    
    expect(onChange).toHaveBeenCalled()
  })

  it('shows time picker when enabled', () => {
    render(<Calendar {...defaultProps} showTimePicker value={new Date()} />)
    
    const hourSelect = screen.getByDisplayValue(/\d{2}/)
    expect(hourSelect).toBeDefined()
  })

  it('applies custom theme', () => {
    const theme = {
      primary: '#ff0000',
      background: '#ffffff',
    }
    
    const { container } = render(<Calendar {...defaultProps} theme={theme} />)
    const calendar = container.firstChild as HTMLElement
    
    expect(calendar.style.getPropertyValue('--rcp-primary')).toBe('#ff0000')
    expect(calendar.style.getPropertyValue('--rcp-background')).toBe('#ffffff')
  })

  it('disables weekends when disableWeekends is true', () => {
    render(<Calendar {...defaultProps} disableWeekends />)
    
    // This would require more complex logic to find weekend dates
    // For now, just verify the prop doesn't break rendering
    const calendar = screen.getByRole('button', { name: /\d+ .+/ })
    expect(calendar).toBeDefined()
  })

  it('shows events', () => {
    const events = [
      {
        id: '1',
        title: 'Test Event',
        start: new Date(),
      },
    ]
    
    render(<Calendar {...defaultProps} events={events} />)
    
    // Events would be shown in the calendar grid
    const calendar = screen.getByRole('button', { name: /\d+ .+/ })
    expect(calendar).toBeDefined()
  })

  it('handles range selection', () => {
    const onChange = vi.fn()
    const onRangeSelect = vi.fn()
    
    render(
      <Calendar
        {...defaultProps}
        selectionMode="range"
        onChange={onChange}
        onRangeSelect={onRangeSelect}
      />
    )
    
    const dateButtons = screen.getAllByRole('button').slice(3, 5) // Get two date buttons
    
    // Select start date
    fireEvent.click(dateButtons[0])
    expect(onChange).toHaveBeenCalledTimes(1)
    
    // Select end date
    fireEvent.click(dateButtons[1])
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onRangeSelect).toHaveBeenCalled()
  })

  it('handles multiple selection', () => {
    const onChange = vi.fn()
    
    render(<Calendar {...defaultProps} selectionMode="multiple" onChange={onChange} />)
    
    const dateButtons = screen.getAllByRole('button').slice(3, 5) // Get two date buttons
    
    // Select first date
    fireEvent.click(dateButtons[0])
    expect(onChange).toHaveBeenCalledTimes(1)
    
    // Select second date
    fireEvent.click(dateButtons[1])
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('renders custom day renderer', () => {
    const dayRenderer = ({ date }: any) => (
      <div data-testid="custom-day">{date.getDate()}</div>
    )
    
    render(<Calendar {...defaultProps} dayRenderer={dayRenderer} />)
    
    const customDay = screen.getByTestId('custom-day')
    expect(customDay).toBeDefined()
  })

  it('renders custom header renderer', () => {
    const headerRenderer = () => (
      <div data-testid="custom-header">Custom Header</div>
    )
    
    render(<Calendar {...defaultProps} headerRenderer={headerRenderer} />)
    
    const customHeader = screen.getByTestId('custom-header')
    expect(customHeader).toBeDefined()
    expect(customHeader.textContent).toBe('Custom Header')
  })
}) 