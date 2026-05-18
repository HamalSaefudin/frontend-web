import { createContext } from 'react'

export interface SidebarContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
  isMobile: boolean
  state: 'expanded' | 'collapsed'
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)
