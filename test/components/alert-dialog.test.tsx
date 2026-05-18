import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

function Example({ onAction }: { onAction?: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Open</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Confirm</AlertDialogTitle>
        <AlertDialogDescription>Sure?</AlertDialogDescription>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onAction}>OK</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  )
}

describe('AlertDialog', () => {
  it('opens on trigger click', async () => {
    render(<Example />)
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument()
    await userEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Confirm')).toBeInTheDocument()
    expect(screen.getByText('Sure?')).toBeInTheDocument()
  })

  it('fires action on click and closes', async () => {
    const onAction = vi.fn()
    render(<Example onAction={onAction} />)
    await userEvent.click(screen.getByText('Open'))
    await userEvent.click(screen.getByRole('button', { name: 'OK' }))
    expect(onAction).toHaveBeenCalled()
  })

  it('cancel closes dialog', async () => {
    render(<Example />)
    await userEvent.click(screen.getByText('Open'))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument()
  })
})
