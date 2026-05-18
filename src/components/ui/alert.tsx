import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

function Alert({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-2xl px-4 py-3 text-sm',
        className,
      )}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
  )
}

function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm leading-relaxed', className)} {...props} />
  )
}

export { Alert, AlertTitle, AlertDescription }
