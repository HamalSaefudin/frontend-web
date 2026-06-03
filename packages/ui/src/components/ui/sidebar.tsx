import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronDownIcon, PanelLeftIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useIsMobile } from '../../hooks/use-mobile'
import { Button } from './button'
import { useSidebar } from './use-sidebar'
import { SidebarContext, type SidebarContextValue } from './sidebar-context'

// ── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

// ── Provider ─────────────────────────────────────────────────────────────────

interface SidebarProviderProps {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  children,
  className,
  style,
}: SidebarProviderProps) {
  const isMobile = useIsMobile()
  const [internalOpen, setInternalOpen] = useState(defaultOpen)

  const open = openProp ?? internalOpen
  const setOpen = useCallback(
    (value: boolean) => {
      if (onOpenChange) onOpenChange(value)
      else setInternalOpen(value)
    },
    [onOpenChange]
  )

  const toggle = useCallback(() => setOpen(!open), [open, setOpen])

  // Cmd/Ctrl + B keyboard shortcut to toggle the sidebar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggle])

  const value = useMemo<SidebarContextValue>(
    () => ({
      open,
      setOpen,
      toggle,
      isMobile,
      state: open ? 'expanded' : 'collapsed',
    }),
    [open, setOpen, toggle, isMobile]
  )

  return (
    <SidebarContext.Provider value={value}>
      <div
        className={cn('flex min-h-screen w-full', className)}
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

// ── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  children: ReactNode
  className?: string
  /** When collapsed: 'icon' shrinks to icon-only rail, 'offcanvas' hides entirely */
  collapsible?: 'icon' | 'offcanvas'
}

export function Sidebar({ children, className, collapsible = 'icon' }: SidebarProps) {
  const { open, isMobile, setOpen } = useSidebar()

  // ── Mobile: portal-rendered slide-in drawer ──────────────────────────────
  if (isMobile) {
    if (!open) return null
    return createPortal(
      <>
        <div
          className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm animate-in fade-in"
          onClick={() => setOpen(false)}
          aria-hidden
        />
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-[151] flex w-[var(--sidebar-width)] flex-col',
            'bg-background border-r border-border shadow-lg',
            'animate-in slide-in-from-left',
            className,
          )}
          style={{ '--sidebar-width': SIDEBAR_WIDTH } as React.CSSProperties}
        >
          {children}
        </aside>
      </>,
      document.body,
    )
  }

  // ── Desktop: in-flow rail with width transition ─────────────────────────
  const isCollapsed = !open
  const isOffcanvas = collapsible === 'offcanvas' && isCollapsed

  return (
    <aside
      data-state={open ? 'expanded' : 'collapsed'}
      data-collapsible={collapsible}
      className={cn(
        'group/sidebar sticky top-0 flex h-screen flex-col',
        'bg-background border-r border-border',
        'transition-[width] duration-200 ease-linear',
        isOffcanvas
          ? 'w-0 overflow-hidden border-r-0'
          : isCollapsed
            ? 'w-[var(--sidebar-width-icon)]'
            : 'w-[var(--sidebar-width)]',
        className,
      )}
    >
      {children}
    </aside>
  )
}

// ── Sidebar sections ─────────────────────────────────────────────────────────

export function SidebarHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex shrink-0 items-center gap-2 p-2 min-h-12', className)}
      {...props}
    />
  )
}

export function SidebarContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-1 flex-col gap-2 overflow-auto p-2', className)}
      {...props}
    />
  )
}

export function SidebarFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex shrink-0 flex-col gap-2 p-2', className)}
      {...props}
    />
  )
}

export function SidebarSeparator({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-2 h-px shrink-0 bg-border', className)}
      {...props}
    />
  )
}

// ── Menu primitives ──────────────────────────────────────────────────────────

// ── Group context (per-group collapse state) ─────────────────────────────────

interface SidebarGroupContextValue {
  collapsible: boolean
  collapsed: boolean
  toggle: () => void
}

const SidebarGroupContext = createContext<SidebarGroupContextValue | null>(null)

interface SidebarGroupProps extends ComponentProps<'div'> {
  /** When true, the group label becomes a button that toggles its menu items. */
  collapsible?: boolean
  /** Initial open state when `collapsible`. Defaults to `true` (expanded). */
  defaultOpen?: boolean
}

export function SidebarGroup({
  collapsible = false,
  defaultOpen = true,
  className,
  children,
  ...props
}: SidebarGroupProps) {
  const [collapsed, setCollapsed] = useState(!defaultOpen)
  const value = useMemo<SidebarGroupContextValue>(
    () => ({
      collapsible,
      collapsed,
      toggle: () => setCollapsed((c) => !c),
    }),
    [collapsible, collapsed],
  )

  return (
    <SidebarGroupContext.Provider value={value}>
      <div className={cn('flex flex-col gap-1', className)} {...props}>
        {children}
      </div>
    </SidebarGroupContext.Provider>
  )
}

export function SidebarGroupLabel({ className, children, ...props }: ComponentProps<'div'>) {
  const { open } = useSidebar()
  const group = useContext(SidebarGroupContext)

  // Collapsible: render as a button with a chevron indicator.
  if (group?.collapsible) {
    return (
      <button
        type="button"
        onClick={group.toggle}
        aria-expanded={!group.collapsed}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1',
          'text-xs font-medium uppercase tracking-wider text-muted-foreground',
          'hover:text-foreground transition-colors',
          'outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'transition-opacity duration-150',
          !open && 'opacity-0 pointer-events-none h-0 py-0 overflow-hidden',
          className,
        )}
      >
        <span className="truncate">{children}</span>
        <ChevronDownIcon
          className={cn(
            'size-3.5 shrink-0 transition-transform duration-150',
            group.collapsed && '-rotate-90',
          )}
        />
      </button>
    )
  }

  // Static label.
  return (
    <div
      className={cn(
        'px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider',
        'transition-opacity duration-150',
        !open && 'opacity-0 pointer-events-none h-0 py-0 overflow-hidden',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarMenu({ className, ...props }: ComponentProps<'ul'>) {
  const { open, isMobile } = useSidebar()
  const group = useContext(SidebarGroupContext)
  // Only honor the group's collapsed state when the sidebar itself is open
  // (or on mobile drawer). In icon-only mode, group toggles are unreachable,
  // so always show items to keep navigation accessible.
  const showLabel = open || isMobile
  const hidden = group?.collapsible && group.collapsed && showLabel

  return (
    <ul
      className={cn('flex flex-col gap-0.5', hidden && 'hidden', className)}
      {...props}
    />
  )
}

export function SidebarMenuItem({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li className={cn('relative', className)} {...props} />
  )
}

interface SidebarMenuButtonProps extends ComponentProps<'button'> {
  asChild?: boolean
  isActive?: boolean
  icon?: ReactNode
  tooltip?: string
}

/**
 * Renders as a button by default. Pass `asChild` to delegate to a single child
 * (e.g. NavLink) — the child receives the merged className. This is a lightweight
 * version of the Radix Slot pattern, sufficient for our nav-link usage.
 */
export function SidebarMenuButton({
  asChild,
  isActive,
  icon,
  tooltip,
  className,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const { open, isMobile } = useSidebar()
  const showLabel = open || isMobile

  const baseClass = cn(
    'flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium',
    'text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors',
    'outline-none focus-visible:ring-2 focus-visible:ring-ring',
    isActive && 'bg-secondary text-foreground',
    !showLabel && 'justify-center px-0',
    className,
  )

  const content = (
    <>
      {icon && <span className="shrink-0 [&>svg]:size-4">{icon}</span>}
      {showLabel && <span className="truncate">{children}</span>}
    </>
  )

  if (asChild && isValidElement(children)) {
    // Clone the child (e.g. NavLink) and merge our className onto it.
    // The child renders its own content — icon + label should be passed inside it.
    // NavLink supports a function-form className that receives `{ isActive }`.
    // We must preserve that signature when merging, otherwise the active style
    // gets stringified and silently dropped.
    type NavLinkClassNameArgs = { isActive: boolean; isPending: boolean; isTransitioning: boolean }
    type ChildClassName = string | ((args: NavLinkClassNameArgs) => string) | undefined
    const child = children as ReactElement<{ className?: ChildClassName; title?: string }>
    const childClassName = child.props.className
    const mergedClassName: ChildClassName =
      typeof childClassName === 'function'
        ? (args: NavLinkClassNameArgs) => cn(baseClass, childClassName(args))
        : cn(baseClass, childClassName)

    return cloneElement(child, {
      className: mergedClassName,
      title: !showLabel ? tooltip : child.props.title,
    })
  }

  return (
    <button
      className={baseClass}
      title={!showLabel ? tooltip : undefined}
      {...props}
    >
      {content}
    </button>
  )
}

// ── Trigger ──────────────────────────────────────────────────────────────────

export function SidebarTrigger({ className, ...props }: ComponentProps<'button'>) {
  const { toggle } = useSidebar()
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle sidebar"
      className={cn('h-8 w-8', className)}
      {...props}
    >
      <PanelLeftIcon />
    </Button>
  )
}

// ── Inset (page content area next to the sidebar) ────────────────────────────

export function SidebarInset({ className, ...props }: ComponentProps<'main'>) {
  return (
    <main
      className={cn('flex flex-1 flex-col min-h-screen min-w-0', className)}
      {...props}
    />
  )
}
