import { describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ModalProvider, useModalDepth } from '@/components/ModalProvider'

describe('ModalProvider', () => {
  it('returns no-op fallbacks outside provider', () => {
    const { result } = renderHook(() => useModalDepth())
    expect(result.current.push()).toBe(0)
    expect(() => result.current.pop()).not.toThrow()
  })

  it('assigns sequential slot indexes via push', () => {
    const { result } = renderHook(() => useModalDepth(), {
      wrapper: ({ children }) => <ModalProvider>{children}</ModalProvider>,
    })

    let slot1 = -1
    let slot2 = -1
    let slot3 = -1
    act(() => { slot1 = result.current.push() })
    act(() => { slot2 = result.current.push() })
    act(() => { slot3 = result.current.push() })
    expect([slot1, slot2, slot3]).toEqual([0, 1, 2])
  })

  it('pop decreases slot back', () => {
    const { result } = renderHook(() => useModalDepth(), {
      wrapper: ({ children }) => <ModalProvider>{children}</ModalProvider>,
    })

    act(() => { result.current.push() })
    act(() => { result.current.push() })
    act(() => { result.current.pop() })
    let next = -1
    act(() => { next = result.current.push() })
    expect(next).toBe(1)
  })

  it('pop never goes below 0', () => {
    const { result } = renderHook(() => useModalDepth(), {
      wrapper: ({ children }) => <ModalProvider>{children}</ModalProvider>,
    })
    act(() => { result.current.pop() })
    let next = -1
    act(() => { next = result.current.push() })
    expect(next).toBe(0)
  })
})
