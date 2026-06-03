import type { ReactNode } from 'react'
import './Container.css'

interface ContainerProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Container({ children, maxWidth = 'lg' }: ContainerProps) {
  return (
    <div className={`container container--${maxWidth}`}>
      {children}
    </div>
  )
}
