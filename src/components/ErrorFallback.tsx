import { Alert, AlertTitle, AlertDescription } from './ui/alert'
import { Button } from './ui/button'

interface ErrorFallbackProps {
  errors: string[]
  onRetry?: () => void
}

export function ErrorFallback({ errors, onRetry }: ErrorFallbackProps) {
  return (
    <div className="m-6 flex flex-col gap-3">
      {errors.map((error, i) => (
        <Alert
          key={i}
          className="bg-[var(--color-error-bg)] text-[var(--color-error-text)] border border-[var(--color-error-border)]"
        >
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ))}
      {onRetry && (
        <Button variant="destructive" size="sm" onClick={onRetry} className="self-start">
          Try Again
        </Button>
      )}
    </div>
  )
}
