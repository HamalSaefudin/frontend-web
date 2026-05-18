import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import { AppModal } from '@/components/AppModal'
import { ModalProvider } from '@/components/ModalProvider'

function Wrapper({ children, initialOpen = true }: { children?: React.ReactNode; initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen)
  return (
    <ModalProvider>
      <button onClick={() => setOpen(true)}>open</button>
      <AppModal isOpen={open} onClose={() => setOpen(false)} title="Title">
        {children ?? <p>Body</p>}
      </AppModal>
    </ModalProvider>
  )
}

describe('AppModal', () => {
  it('renders title and children when open', () => {
    render(<Wrapper />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('returns null when closed', () => {
    render(<Wrapper initialOpen={false} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on Escape key', async () => {
    render(<Wrapper />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on close button click', async () => {
    render(<Wrapper />)
    await userEvent.click(screen.getByRole('button', { name: 'Close modal' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onOpen and onUnmount lifecycle hooks', async () => {
    const onOpen = vi.fn()
    const onUnmount = vi.fn()
    function Probe() {
      const [open, setOpen] = useState(true)
      return (
        <ModalProvider>
          <AppModal
            isOpen={open}
            onClose={() => setOpen(false)}
            title="t"
            onOpen={onOpen}
            onUnmount={onUnmount}
          >
            <p>content</p>
          </AppModal>
        </ModalProvider>
      )
    }
    render(<Probe />)
    expect(onOpen).toHaveBeenCalled()
    await userEvent.keyboard('{Escape}')
    expect(onUnmount).toHaveBeenCalled()
  })

  it('first modal uses depth-0 z-index', () => {
    render(<Wrapper />)
    const overlays = document.querySelectorAll('.backdrop-blur-sm')
    const backdrop = Array.from(overlays).find((el) => (el as HTMLElement).style.zIndex) as HTMLElement
    expect(backdrop?.style.zIndex).toBe('301')
    expect(backdrop?.style.backgroundColor).toBe('rgba(0, 0, 0, 0.4)')
  })
})
