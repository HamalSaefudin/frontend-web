/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

interface ModalContextType {
  push: () => number
  pop: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [, setDepth] = useState(0)
  const depthRef = useRef(0)

  const push = useCallback(() => {
    const slot = depthRef.current
    depthRef.current = slot + 1
    setDepth(depthRef.current)
    return slot
  }, [])
  const pop = useCallback(() => {
    depthRef.current = Math.max(0, depthRef.current - 1)
    setDepth(depthRef.current)
  }, [])

  const value = useMemo(() => ({ push, pop }), [push, pop])

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModalDepth() {
  const context = useContext(ModalContext)
  if (!context) {
    return { push: () => 0, pop: () => {} }
  }
  return context
}
