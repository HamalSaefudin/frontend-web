import { cn } from '../../lib/utils'

interface ProgressProps {
  value: number
  label?: string
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'brand' | 'success' | 'warning' | 'danger'
  className?: string
}

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

const colorMap = {
  brand:   'bg-primary',
  success: 'bg-emerald-500',
  warning: 'bg-amber-400',
  danger:  'bg-destructive',
}

export function Progress({
  value,
  label,
  showValue = false,
  size = 'md',
  color = 'brand',
  className,
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          {label && <span>{label}</span>}
          {showValue && <span className="font-medium tabular-nums">{clamped}%</span>}
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-secondary', sizeMap[size])}>
        <div
          className={cn('h-full rounded-full', colorMap[color])}
          style={{ width: `${clamped}%`, transition: 'width 0.6s ease-out' }}
        />
      </div>
    </div>
  )
}
