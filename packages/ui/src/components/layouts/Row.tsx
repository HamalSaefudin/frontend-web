import type { ReactNode, HTMLAttributes } from 'react'

interface RowProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
}

const gapMap = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-6',
}

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
}

export function Row({
  children,
  gap = 'md',
  align = 'center',
  justify = 'start',
  className = '',
  ...props
}: RowProps) {
  const classes = `flex flex-row ${gapMap[gap]} ${alignMap[align]} ${justifyMap[justify]} ${className}`.trim()

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
