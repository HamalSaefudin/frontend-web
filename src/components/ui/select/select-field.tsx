import { useState, useRef, useEffect, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Command, CommandList, CommandEmpty, CommandItem } from './command'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select'

export interface SelectOption {
  value: string
  label: string
}

interface BaseProps {
  id?: string
  label?: string
  placeholder?: string
  options: SelectOption[]
  disabled?: boolean
  required?: boolean
  error?: string
  clearable?: boolean
  className?: string
  dropdownPosition?: 'auto' | 'top' | 'bottom'
}

interface SingleProps extends BaseProps {
  mode?: 'single'
  value?: string
  onChange?: (value: string) => void
}

interface MultiProps extends BaseProps {
  mode: 'multi'
  value?: string[]
  onChange?: (value: string[]) => void
}

interface SimpleProps extends BaseProps {
  mode: 'simple'
  value?: SelectOption
  onChange?: (value?: SelectOption) => void
}

type SelectFieldProps = SingleProps | MultiProps | SimpleProps

// ── Icons ────────────────────────────────────────────────────────
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={cn('text-muted-foreground transition-transform duration-150', open && 'rotate-180')}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

// ── Shared dropdown list ─────────────────────────────────────────
function DropdownList({ options, value, onSelect }: {
  options: SelectOption[]
  value?: string
  onSelect: (val: string) => void
}) {
  return (
    <Command shouldFilter={false}>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {options.map((opt) => (
          <CommandItem
            key={opt.value}
            value={opt.value}
            onSelect={() => onSelect(opt.value)}
            onClick={() => onSelect(opt.value)}
          >
            <span className="flex-1">{opt.label}</span>
            {value === opt.value && <CheckIcon />}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  )
}

// ── Simple (non-searchable, uses Radix Select) ───────────────────
function SimpleSelect({ id, placeholder, options, value, onChange, disabled, clearable }: SimpleProps) {
  const selectedValue = value?.value ?? ''

  const handleValueChange = (val: string) => {
    const selectedOption = options.find((opt) => opt.value === val)
    if (selectedOption) {
      onChange?.(selectedOption)
    }
  }

  return (
    <Select value={selectedValue} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder ?? 'Select...'} />
        {clearable && value?.value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange?.(undefined) }}
            className="ml-auto mr-1 text-muted-foreground hover:text-foreground"
          >
            <ClearIcon />
          </button>
        )}
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface DropdownPosition {
  top: number
  left: number
  width: number
}

// ── Single searchable — input IS the trigger ─────────────────────
function SingleSelect({ id, placeholder, options, value, onChange, disabled, clearable, dropdownPosition = 'auto' }: SingleProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dropdownPos, setDropdownPos] = useState<DropdownPosition>({ top: 0, left: 0, width: 0 })
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)
  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  const handleFocus = () => {
    setSearch('')
    setOpen(true)
  }

  const handleSelect = (val: string) => {
    onChange?.(val)
    setSearch('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation()
    onChange?.('')
    setSearch('')
    setOpen(false)
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e: globalThis.MouseEvent) => {
      const target = e.target as Node
      const insideContainer = containerRef.current?.contains(target)
      const insideDropdown = dropdownRef.current?.contains(target)
      if (!insideContainer && !insideDropdown) {
        setOpen(false)
        setSearch('')
      }
    }

    const handleScroll = (e: Event) => {
      const target = e.target as Node
      if (dropdownRef.current?.contains(target)) return
      setOpen(false)
      setSearch('')
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll', handleScroll, true)
    }
  }, [open])

  useEffect(() => {
    if (!open || !containerRef.current) return

    const calculatePosition = () => {
      const containerRect = containerRef.current!.getBoundingClientRect()
      const dropdownHeight = dropdownRef.current?.offsetHeight || 300
      const spaceBelow = window.innerHeight - containerRect.bottom

      const shouldPositionOnTop = dropdownPosition === 'top'
        ? true
        : dropdownPosition === 'bottom'
          ? false
          : spaceBelow < dropdownHeight + 20

      const top = shouldPositionOnTop
        ? containerRect.top - dropdownHeight - 8
        : containerRect.bottom + 8

      setDropdownPos({
        top: Math.max(8, top),
        left: containerRect.left,
        width: containerRect.width,
      })
    }

    const observer = new ResizeObserver(calculatePosition)
    observer.observe(containerRef.current)

    const timeoutId = setTimeout(calculatePosition, 0)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [open, dropdownPosition])

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => {
          setOpen(true)
          inputRef.current?.focus()
        }}
        className={cn(
          'flex h-10 w-full items-center gap-1.5 rounded-lg border border-input bg-background px-3 text-sm transition-colors cursor-text',
          open && 'border-ring ring-2 ring-ring/20',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={search || (selected?.label ?? '')}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder ?? 'Select...'}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-0"
        />
        <div className="flex shrink-0 items-center gap-1 pointer-events-none">
          {clearable && value && !open && (
            <button type="button" onClick={(e) => { e.stopPropagation(); handleClear(e) }} className="text-muted-foreground hover:text-foreground pointer-events-auto">
              <ClearIcon />
            </button>
          )}
          <div className="text-muted-foreground">
            <ChevronIcon open={open} />
          </div>
        </div>
      </div>

      {open && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[9999] rounded-lg border border-border bg-background shadow-md"
          style={{
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            width: `${dropdownPos.width}px`,
          }}
        >
          <DropdownList options={filtered} value={value} onSelect={handleSelect} />
        </div>,
        document.body
      )}
    </div>
  )
}

// ── Multi searchable — tags + inline input as trigger ────────────
function MultiSelect({ id, placeholder, options, value = [], onChange, disabled, clearable, dropdownPosition = 'auto' }: MultiProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dropdownPos, setDropdownPos] = useState<DropdownPosition>({ top: 0, left: 0, width: 0 })
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selected = options.filter((o) => value.includes(o.value))
  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  const toggle = (val: string) => {
    onChange?.(value.includes(val) ? value.filter((v) => v !== val) : [...value, val])
    setSearch('')
    inputRef.current?.focus()
  }

  const removeTag = (val: string, e: MouseEvent) => {
    e.stopPropagation()
    onChange?.(value.filter((v) => v !== val))
  }

  const clearAll = (e: MouseEvent) => {
    e.stopPropagation()
    onChange?.([])
    setSearch('')
  }

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e: globalThis.MouseEvent) => {
      const target = e.target as Node
      const insideContainer = containerRef.current?.contains(target)
      const insideDropdown = dropdownRef.current?.contains(target)
      if (!insideContainer && !insideDropdown) {
        setOpen(false)
        setSearch('')
      }
    }

    const handleScroll = (e: Event) => {
      const target = e.target as Node
      if (dropdownRef.current?.contains(target)) return
      setOpen(false)
      setSearch('')
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll', handleScroll, true)
    }
  }, [open])

  useEffect(() => {
    if (!open || !containerRef.current) return

    const calculatePosition = () => {
      const containerRect = containerRef.current!.getBoundingClientRect()
      const dropdownHeight = dropdownRef.current?.offsetHeight || 300
      const spaceBelow = window.innerHeight - containerRect.bottom

      const shouldPositionOnTop = dropdownPosition === 'top'
        ? true
        : dropdownPosition === 'bottom'
          ? false
          : spaceBelow < dropdownHeight + 20

      const top = shouldPositionOnTop
        ? containerRect.top - dropdownHeight - 8
        : containerRect.bottom + 8

      setDropdownPos({
        top: Math.max(8, top),
        left: containerRect.left,
        width: containerRect.width,
      })
    }

    const observer = new ResizeObserver(calculatePosition)
    observer.observe(containerRef.current)

    const timeoutId = setTimeout(calculatePosition, 0)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [open, dropdownPosition])

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => {
          setOpen(true)
          inputRef.current?.focus()
        }}
        className={cn(
          'flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-sm cursor-text transition-colors',
          open && 'border-ring ring-2 ring-ring/20',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        {selected.map((opt) => (
          <span key={opt.value} className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium">
            {opt.label}
            <button
              type="button"
              onClick={(e) => removeTag(opt.value, e)}
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Remove ${opt.label}`}
            >×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={selected.length === 0 ? (placeholder ?? 'Select...') : ''}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[80px]"
        />
        <div className="ml-auto flex shrink-0 items-center gap-1 pointer-events-none">
          {clearable && value.length > 0 && (
            <button type="button" onClick={(e) => { e.stopPropagation(); clearAll(e) }} className="text-muted-foreground hover:text-foreground pointer-events-auto">
              <ClearIcon />
            </button>
          )}
          <div className="text-muted-foreground">
            <ChevronIcon open={open} />
          </div>
        </div>
      </div>

      {open && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[9999] rounded-lg border border-border bg-background shadow-md"
          style={{
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            width: `${dropdownPos.width}px`,
          }}
        >
          {options.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">No data</div>
          ) : (
            <Command shouldFilter={false}>
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {filtered.map((opt) => {
                  const isSelected = value.includes(opt.value)
                  return (
                    <CommandItem
                      key={opt.value}
                      value={opt.value}
                      onSelect={() => toggle(opt.value)}
                      onClick={() => toggle(opt.value)}
                    >
                      <div className={cn(
                        'mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border',
                        isSelected && 'bg-primary border-primary',
                      )}>
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                      <span className="flex-1">{opt.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandList>
            </Command>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}

// ── SelectField — public composite ───────────────────────────────
export function SelectField(props: SelectFieldProps) {
  const { id, label, required, error, className } = props

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}

      {props.mode === 'simple' ? (
        <SimpleSelect {...props} />
      ) : props.mode === 'multi' ? (
        <MultiSelect {...props} />
      ) : (
        <SingleSelect {...(props as SingleProps)} />
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
