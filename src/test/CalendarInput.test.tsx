import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CalendarInput } from '../components/CalendarInput'

describe('CalendarInput', () => {
  it('renders input field with placeholder', () => {
    render(<CalendarInput placeholder="Select date..." />)
    
    const input = screen.getByPlaceholderText('Select date...')
    expect(input).toBeInTheDocument()
  })

  it('opens calendar dropdown when input is clicked', async () => {
    render(<CalendarInput />)
    
    const input = screen.getByRole('textbox')
    fireEvent.click(input)
    
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })
  })

  it('calls onChange when date is selected', async () => {
    const onChange = vi.fn()
    render(<CalendarInput onChange={onChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.click(input)
    
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })
    
    // Click on a date (assuming day 15 is visible)
    const dateButton = screen.getByText('15')
    fireEvent.click(dateButton)
    
    expect(onChange).toHaveBeenCalled()
  })

  it('displays selected date in input field', () => {
    const testDate = new Date(2024, 1, 15)
    render(<CalendarInput value={testDate} inputFormat="MM/dd/yyyy" />)
    
    const input = screen.getByDisplayValue('02/15/2024')
    expect(input).toBeInTheDocument()
  })

  it('shows clear button when clearable and has value', () => {
    const testDate = new Date(2024, 1, 15)
    render(<CalendarInput value={testDate} clearable />)
    
    const clearButton = screen.getByLabelText('Clear date')
    expect(clearButton).toBeInTheDocument()
  })

  it('calls onClear when clear button is clicked', () => {
    const onClear = vi.fn()
    const testDate = new Date(2024, 1, 15)
    render(<CalendarInput value={testDate} clearable onClear={onClear} />)
    
    const clearButton = screen.getByLabelText('Clear date')
    fireEvent.click(clearButton)
    
    expect(onClear).toHaveBeenCalled()
  })

  it('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <CalendarInput />
        <div data-testid="outside">Outside element</div>
      </div>
    )
    
    const input = screen.getByRole('textbox')
    fireEvent.click(input)
    
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })
    
    const outside = screen.getByTestId('outside')
    fireEvent.mouseDown(outside)
    
    await waitFor(() => {
      expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    })
  })

  it('disables input when disabled prop is true', () => {
    render(<CalendarInput disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('makes input readonly when readOnly prop is true', () => {
    render(<CalendarInput readOnly />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('readonly')
  })
})
