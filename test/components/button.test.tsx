import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('fires onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('disables when disabled prop set', async () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Go</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    await userEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('shows Loading... and disables when loading', () => {
    render(<Button loading>Submit</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveTextContent('Loading...')
  })

  it('applies variant and size classes', () => {
    render(<Button variant="destructive" size="lg">x</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toMatch(/bg-destructive/)
    expect(btn.className).toMatch(/h-12/)
  })

  it('renders as child when asChild is true', () => {
    render(<Button asChild><a href="/x">link</a></Button>)
    const link = screen.getByRole('link', { name: 'link' })
    expect(link).toHaveAttribute('href', '/x')
  })
})
