import type { ReactNode } from 'react'
import './Header.css'

interface HeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <div className="header">
      <div className="header__content">
        <h1 className="header__title">{title}</h1>
        {subtitle && <p className="header__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="header__action">{action}</div>}
    </div>
  )
}
