import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: 'sm' | 'md'
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, disabled, size = 'md', className, ...props }, ref) => {
    const dims = size === 'sm'
      ? { track: 'h-5 w-9', thumb: 'size-4', translate: 'translate-x-4' }
      : { track: 'h-6 w-11', thumb: 'size-5', translate: 'translate-x-5' }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        data-state={checked ? 'checked' : 'unchecked'}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          'inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent p-0.5 transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-input',
          dims.track,
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none block rounded-full bg-background shadow-sm transition-transform',
            dims.thumb,
            checked ? dims.translate : 'translate-x-0',
          )}
        />
      </button>
    )
  },
)

Switch.displayName = 'Switch'
