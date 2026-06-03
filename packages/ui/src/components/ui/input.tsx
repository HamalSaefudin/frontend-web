import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground',
        'placeholder:text-muted-foreground',
        'outline-none transition-colors duration-150',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20',
        'disabled:pointer-events-none disabled:opacity-50',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
        className
      )}
      {...props}
    />
  )
}

export { Input }
