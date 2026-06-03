import { useState, useEffect } from 'react'
import { useIsFetching } from '@tanstack/react-query'
import './TopLoadingBar.css'

type BarState = 'idle' | 'loading' | 'completing'

export function TopLoadingBar() {
  const isFetching = useIsFetching()
  const [barState, setBarState] = useState<BarState>('idle')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isFetching > 0) {
        setBarState('loading')
      } else {
        setBarState((prev) => (prev === 'loading' ? 'completing' : prev))
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [isFetching])

  if (barState === 'idle') return null

  return (
    <div
      className={`top-loading-bar top-loading-bar--${barState}`}
      onAnimationEnd={() => {
        if (barState === 'completing') setBarState('idle')
      }}
    />
  )
}
