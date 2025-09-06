import { useState } from 'react'
import { Calendar, CalendarInput, CalendarEvent, CalendarView, SelectionMode, DateRange } from '../index'

const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(2024, 1, 15, 9, 0),
    end: new Date(2024, 1, 15, 10, 0),
    color: '#3b82f6',
  },
  {
    id: '2',
    title: 'Project Deadline',
    start: new Date(2024, 1, 20),
    color: '#ef4444',
  },
  {
    id: '3',
    title: 'Conference',
    start: new Date(2024, 1, 25, 8, 0),
    end: new Date(2024, 1, 27, 17, 0),
    color: '#10b981',
  },
]

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | Date[] | DateRange | null>(new Date())
  const [inputDate, setInputDate] = useState<Date | Date[] | DateRange | null>(null)
  const [view, setView] = useState<CalendarView>('month')
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('single')
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showWeekNumbers, setShowWeekNumbers] = useState(false)
  const [disableWeekends, setDisableWeekends] = useState(false)
  const [showEvents, setShowEvents] = useState(false)
  const [theme, setTheme] = useState('default')
  const [interactionMode, setInteractionMode] = useState<'standalone' | 'input'>('standalone')

  const themes = {
    default: undefined,
    blue: {
      primary: '#2563eb',
      secondary: '#dbeafe',
      selected: '#1d4ed8',
      today: '#fbbf24',
    },
    green: {
      primary: '#059669',
      secondary: '#d1fae5',
      selected: '#047857',
      today: '#f59e0b',
    },
    purple: {
      primary: '#7c3aed',
      secondary: '#ede9fe',
      selected: '#6d28d9',
      today: '#f59e0b',
    },
    dark: {
      primary: '#3b82f6',
      secondary: '#374151',
      background: '#1f2937',
      text: '#f3f4f6',
      textSecondary: '#9ca3af',
      border: '#4b5563',
      hover: '#374151',
      selected: '#3b82f6',
      disabled: '#6b7280',
      today: '#f59e0b',
    },
  }

  const formatSelectedValue = (value: Date | Date[] | DateRange | null) => {
    if (!value) return 'None'
    
    if (value instanceof Date) {
      return value.toLocaleDateString() + (showTimePicker ? ` ${value.toLocaleTimeString()}` : '')
    }
    
    if (Array.isArray(value)) {
      return value.map(d => d.toLocaleDateString()).join(', ')
    }
    
    // DateRange
    const start = value.start ? value.start.toLocaleDateString() : 'None'
    const end = value.end ? value.end.toLocaleDateString() : 'None'
    return `${start} - ${end}`
  }

  return (
    <div className="demo-app">
      <div className="demo-header">
        <h1>React Calendar Plus Demo</h1>
        <p>A comprehensive React calendar component with date/time selection, multiple views, and full customization support.</p>
      </div>

      <div className="demo-content">
        {/* Controls */}
        <div className="demo-controls">
          <h3>Configuration</h3>
          
          <div className="control-group">
            <label>
              <strong>Interaction Mode:</strong>
              <select 
                value={interactionMode} 
                onChange={(e) => {
                  setInteractionMode(e.target.value as 'standalone' | 'input')
                  setSelectedDate(null)
                  setInputDate(null)
                }}
              >
                <option value="standalone">Standalone Calendar</option>
                <option value="input">Input with Dropdown</option>
              </select>
            </label>
          </div>

          <div className="control-group">
            <label>
              <strong>Selection Mode:</strong>
              <select 
                value={selectionMode} 
                onChange={(e) => {
                  setSelectionMode(e.target.value as SelectionMode)
                  setSelectedDate(null)
                  setInputDate(null)
                }}
              >
                <option value="single">Single</option>
                <option value="multiple">Multiple</option>
                <option value="range">Range</option>
              </select>
            </label>
          </div>

          <div className="control-group">
            <label>
              <strong>Default View:</strong>
              <select value={view} onChange={(e) => setView(e.target.value as CalendarView)}>
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
            </label>
          </div>

          <div className="control-group">
            <label>
              <strong>Theme:</strong>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="default">Default</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>

          <div className="control-group checkboxes">
            <label>
              <input
                type="checkbox"
                checked={showTimePicker}
                onChange={(e) => setShowTimePicker(e.target.checked)}
              />
              Show Time Picker
            </label>

            <label>
              <input
                type="checkbox"
                checked={showWeekNumbers}
                onChange={(e) => setShowWeekNumbers(e.target.checked)}
              />
              Show Week Numbers
            </label>

            <label>
              <input
                type="checkbox"
                checked={disableWeekends}
                onChange={(e) => setDisableWeekends(e.target.checked)}
              />
              Disable Weekends
            </label>

            <label>
              <input
                type="checkbox"
                checked={showEvents}
                onChange={(e) => setShowEvents(e.target.checked)}
              />
              Show Sample Events
            </label>
          </div>

          <div className="selected-value">
            <strong>Selected:</strong> {formatSelectedValue(interactionMode === 'standalone' ? selectedDate : inputDate)}
          </div>
        </div>

        {/* Calendar */}
        <div className="demo-calendar">
          {interactionMode === 'standalone' ? (
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              view={view}
              onViewChange={setView}
              selectionMode={selectionMode}
              showTimePicker={showTimePicker}
              showWeekNumbers={showWeekNumbers}
              disableWeekends={disableWeekends}
              events={showEvents ? sampleEvents : []}
              theme={themes[theme as keyof typeof themes]}
              responsive={true}
              onDateClick={(date, event) => {
                console.log('Date clicked:', date, event)
              }}
              onRangeSelect={(range) => {
                console.log('Range selected:', range)
              }}
              onMonthChange={(date) => {
                console.log('Month changed:', date)
              }}
              onWeekChange={(date) => {
                console.log('Week changed:', date)
              }}
              onDayChange={(date) => {
                console.log('Day changed:', date)
              }}
            />
          ) : (
            <div style={{ maxWidth: '300px' }}>
              <CalendarInput
                value={inputDate}
                onChange={setInputDate}
                view={view}
                onViewChange={setView}
                selectionMode={selectionMode}
                showTimePicker={showTimePicker}
                showWeekNumbers={showWeekNumbers}
                disableWeekends={disableWeekends}
                events={showEvents ? sampleEvents : []}
                theme={themes[theme as keyof typeof themes]}
                placeholder="Select a date..."
                inputFormat="MM/dd/yyyy"
                clearable={true}
                closeOnSelect={selectionMode === 'single'}
                dropdownPosition="auto"
                onDateClick={(date, event) => {
                  console.log('Date clicked:', date, event)
                }}
                onRangeSelect={(range) => {
                  console.log('Range selected:', range)
                }}
                onMonthChange={(date) => {
                  console.log('Month changed:', date)
                }}
                onWeekChange={(date) => {
                  console.log('Week changed:', date)
                }}
                onDayChange={(date) => {
                  console.log('Day changed:', date)
                }}
                onOpen={() => {
                  console.log('Calendar opened')
                }}
                onClose={() => {
                  console.log('Calendar closed')
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Examples */}
      <div className="demo-examples">
        <h3>Usage Examples</h3>
        
        <div className="example">
          <h4>Standalone Calendar</h4>
          <pre><code>{`import { Calendar } from 'react-calendar-plus'
import 'react-calendar-plus/dist/style.css'

function MyComponent() {
  const [date, setDate] = useState(new Date())
  
  return (
    <Calendar
      value={date}
      onChange={setDate}
      selectionMode="single"
      interactionMode="standalone"
    />
  )
}`}</code></pre>
        </div>

        <div className="example">
          <h4>Input with Dropdown Calendar</h4>
          <pre><code>{`import { CalendarInput } from 'react-calendar-plus'
import 'react-calendar-plus/dist/style.css'

function MyComponent() {
  const [date, setDate] = useState(null)
  
  return (
    <CalendarInput
      value={date}
      onChange={setDate}
      placeholder="Select a date..."
      clearable={true}
      closeOnSelect={true}
    />
  )
}`}</code></pre>
        </div>

        <div className="example">
          <h4>Range Selection with Time Picker</h4>
          <pre><code>{`<Calendar
  selectionMode="range"
  showTimePicker
  timeFormat="12h"
  onChange={(range) => {
    console.log('Selected range:', range)
  }}
  onRangeSelect={(range) => {
    console.log('Range completed:', range)
  }}
/>`}</code></pre>
        </div>

        <div className="example">
          <h4>Custom Theme</h4>
          <pre><code>{`const customTheme = {
  primary: '#059669',
  secondary: '#d1fae5',
  selected: '#047857',
  today: '#f59e0b',
}

<Calendar
  theme={customTheme}
  // ... other props
/>`}</code></pre>
        </div>

        <div className="example">
          <h4>With Events</h4>
          <pre><code>{`const events = [
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(2024, 1, 15, 9, 0),
    end: new Date(2024, 1, 15, 10, 0),
    color: '#3b82f6',
  },
  // ... more events
]

<Calendar
  events={events}
  view="week"
  // ... other props
/>`}</code></pre>
        </div>
      </div>
    </div>
  )
}

export default App 