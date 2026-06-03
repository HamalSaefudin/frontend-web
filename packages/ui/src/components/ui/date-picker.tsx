import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import dayjs from 'dayjs'
import { cn } from '../../lib/utils'
import { Label } from './label'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './input-group'

interface DatePickerProps {
  id?: string
  label?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  required?: boolean
  className?: string
}

function formatDate(date: Date | undefined): string {
  if (!date) return ''
  return dayjs(date).format('DD MMMM YYYY')
}

function parseDate(str: string): Date | undefined {
  const d = new Date(str)
  return isNaN(d.getTime()) ? undefined : d
}

export function DatePicker({
  id,
  label,
  value,
  onChange,
  placeholder = 'Select date...',
  disabled,
  error,
  required,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const [draft, setDraft] = React.useState('')
  const [month, setMonth] = React.useState<Date | undefined>(value)

  // When not focused, always derive display from the value prop (no useEffect needed)
  const displayValue = isFocused ? draft : formatDate(value)

  const handleFocus = () => {
    setDraft(formatDate(value))
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value
    setDraft(str)
    if (str === '') {
      onChange?.(undefined)
    } else {
      const parsed = parseDate(str)
      if (parsed) {
        setMonth(parsed)
        onChange?.(parsed)
      }
    }
  }

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date)
    setOpen(false)
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}

      <InputGroup>
        <InputGroupInput
          id={id}
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="icon-xs"
                disabled={disabled}
                aria-label="Open calendar"
              >
                <CalendarIcon />
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-[320px] overflow-hidden p-0"
              align="end"
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={value}
                month={month}
                onMonthChange={setMonth}
                onSelect={handleSelect}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
