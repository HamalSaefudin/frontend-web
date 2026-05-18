import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

type TabsVariant = 'line' | 'pill'

const TabsVariantContext = React.createContext<TabsVariant>('line')

interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  /**
   * Visual style of the tabs.
   * - 'line' (default): underline indicator under the active tab.
   * - 'pill': filled background pill around the active tab inside a muted container.
   */
  variant?: TabsVariant
}

function Tabs({ variant = 'line', className, ...props }: TabsProps) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-variant={variant}
        className={cn('flex flex-col gap-2', className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const variant = React.useContext(TabsVariantContext)

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        'inline-flex items-center text-muted-foreground',
        variant === 'pill' &&
          'h-10 justify-start rounded-md bg-muted p-1',
        variant === 'line' &&
          'h-10 w-full justify-start gap-4 border-b border-border',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(TabsVariantContext)

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-variant={variant}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap',
        'text-sm font-medium ring-offset-background transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'pill' && [
          'rounded-sm px-3 py-1.5',
          'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        ],
        variant === 'line' && [
          'relative -mb-px h-full px-3 py-2',
          'border-b-2 border-transparent text-muted-foreground hover:text-foreground',
          'data-[state=active]:border-primary data-[state=active]:text-foreground',
        ],
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'mt-2 ring-offset-background',
        'data-[state=inactive]:hidden',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
