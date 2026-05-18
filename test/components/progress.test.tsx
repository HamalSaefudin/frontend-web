import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Progress } from '@/components/ui/progress'

function getFill(container: HTMLElement) {
  return container.querySelector('.rounded-full.h-full, [class*="bg-primary"], [class*="bg-emerald"], [class*="bg-amber"], [class*="bg-destructive"]') as HTMLElement
    ?? (container.querySelector('div > div > div > div') as HTMLElement)
}

describe('Progress', () => {
  it('renders with given value', () => {
    const { container } = render(<Progress value={40} />)
    const fill = getFill(container)
    expect(fill.style.width).toBe('40%')
  })

  it('clamps below 0', () => {
    const { container } = render(<Progress value={-10} />)
    const fill = getFill(container)
    expect(fill.style.width).toBe('0%')
  })

  it('clamps above 100', () => {
    const { container } = render(<Progress value={250} />)
    const fill = getFill(container)
    expect(fill.style.width).toBe('100%')
  })

  it('shows label and value when set', () => {
    render(<Progress value={42} label="Upload" showValue />)
    expect(screen.getByText('Upload')).toBeInTheDocument()
    expect(screen.getByText('42%')).toBeInTheDocument()
  })

  it('applies color variant class', () => {
    const { container } = render(<Progress value={50} color="success" />)
    const fill = getFill(container)
    expect(fill.className).toMatch(/bg-emerald-500/)
  })
})
