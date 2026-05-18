import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Returns `true` when the viewport width is below MOBILE_BREAKPOINT (768px).
 * Uses matchMedia so it stays in sync with viewport changes (no resize listener
 * spam — matchMedia only fires when the breakpoint is actually crossed).
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.innerWidth < MOBILE_BREAKPOINT
  )

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(mql.matches)
    mql.addEventListener('change', onChange)
    setIsMobile(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
