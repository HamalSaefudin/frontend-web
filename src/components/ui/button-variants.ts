import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold text-sm transition-all duration-150 select-none outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95',
  {
    variants: {
      variant: {
        default:     'bg-primary text-primary-foreground hover:opacity-90',
        secondary:   'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
        destructive: 'bg-destructive text-white hover:opacity-90',
        outline:     'border border-border bg-background text-foreground hover:bg-secondary',
        ghost:       'text-foreground hover:bg-secondary',
        link:        'bg-transparent text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-6',
        sm:      'h-8 px-4 text-xs',
        lg:      'h-12 px-8 text-base',
        icon:    'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
