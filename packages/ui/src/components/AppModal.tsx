import { type ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './ui/button'
import { cn } from '../lib/utils'
import { useModalDepth } from './ModalProvider'

interface AppModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
  /** Called once after the modal becomes visible (equivalent to componentDidMount on the modal). */
  onOpen?: () => void
  /** Called after the modal is fully closed / children unmounted (equivalent to componentWillUnmount). */
  onUnmount?: () => void
}

export function AppModal({ isOpen, onClose, title, children, className, onOpen, onUnmount }: AppModalProps) {
  const { push, pop } = useModalDepth()
  const [depth, setDepth] = useState(0)

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Lifecycle: call onOpen when modal becomes visible
  useEffect(() => {
    if (isOpen) {
      setDepth(push())
      onOpen?.()
    }
  }, [isOpen, onOpen, push])

  // Lifecycle: call onUnmount when the modal closes or is removed from the tree
  useEffect(() => {
    if (!isOpen) {
      pop()
      return
    }
    return () => onUnmount?.()
  }, [isOpen, onUnmount, pop])

  if (!isOpen) return null

  const baseZIndex = 300 + depth * 100
  const backdropZ = baseZIndex + 1
  const contentZ = baseZIndex + 1
  const backdropOpacity = Math.min(0.4 + depth * 0.15, 0.85)

  return createPortal(
    <>
      {/* Backdrop — purely visual, no scroll, click to close */}
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ zIndex: backdropZ, backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})` }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Scroll host — owns scroll; click on empty area closes the modal */}
      <div
        className="fixed inset-0 overflow-y-auto overscroll-none"
        style={{ zIndex: contentZ }}
        onClick={onClose}
      >
        {/* CSS Grid centering — handles tall content correctly. With grid, when an
            item is taller than the row, the row grows naturally; with flex
            `items-center`, the item overflows both ends and the top is clipped. */}
        <div className="grid min-h-full place-items-center p-6">
          {/* Modal panel — natural block layout, height fits content */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="app-modal-title"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'w-[90%]',
              'bg-background rounded-xl border border-border shadow-lg',
              'px-6 py-4',
              className,
            )}
          >
            <div className="flex items-center justify-between pb-3">
              <h2 id="app-modal-title" className="text-base font-semibold text-foreground">
                {title}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close modal"
                className="text-muted-foreground"
              >
                ✕
              </Button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
