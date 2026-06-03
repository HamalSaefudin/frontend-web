import { type ReactNode } from 'react'
import './Card.css'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'elevated'
}

export function Card({ children, variant = 'default' }: CardProps) {
  return <div className={`card card--${variant}`}>{children}</div>
}
