import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { act, render, screen, waitFor } from '@testing-library/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

function Example({ defaultValue = 'a', onValueChange }: { defaultValue?: string; onValueChange?: (v: string) => void }) {
  return (
    <Tabs defaultValue={defaultValue} onValueChange={onValueChange}>
      <TabsList>
        <TabsTrigger value="a">A</TabsTrigger>
        <TabsTrigger value="b">B</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Panel A</TabsContent>
      <TabsContent value="b">Panel B</TabsContent>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('shows the default tab content', () => {
    render(<Example />)
    expect(screen.getByText('Panel A')).toBeInTheDocument()
    expect(screen.queryByText('Panel B')).not.toBeInTheDocument()
  })

  it('switches tabs on click', async () => {
    const onChange = vi.fn()
    render(<Example onValueChange={onChange} />)
    await userEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(onChange).toHaveBeenCalledWith('b')
    expect(screen.getByText('Panel B')).toBeInTheDocument()
  })

  it('marks active trigger with aria-selected=true', async () => {
    render(<Example />)
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true')
  })

  it('arrow key moves focus and activates in automatic mode', async () => {
    render(<Example />)
    const a = screen.getByRole('tab', { name: 'A' })
    await act(async () => {
      a.focus()
    })
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true')
    })
  })

  it('throws when child used outside Tabs', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TabsTrigger value="x" />)).toThrow()
    errSpy.mockRestore()
  })
})
