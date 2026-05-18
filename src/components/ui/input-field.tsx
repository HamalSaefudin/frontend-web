import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * text     — default, no restrictions
 * number   — digits only (0-9), no decimals
 * alpha    — letters and spaces only, no digits or special chars
 * currency — digits only; display shows thousands separators (e.g. 1,000,000)
 *            but onChange fires with the raw digit string (e.g. "1000000")
 */
export type InputVariant = 'text' | 'number' | 'alpha' | 'currency'

interface InputFieldProps extends ComponentProps<"input"> {
  label?: string;
  error?: string;
  variant?: InputVariant;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(raw: string | number | readonly string[] | undefined): string {
  if (raw === undefined || raw === '') return ''
  const digits = String(raw).replace(/\D/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('en-US')
}

// Keys always allowed regardless of variant (navigation, editing, shortcuts)
const NAV_KEYS = [
  'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'Home', 'End',
]

// ── Component ─────────────────────────────────────────────────────────────────

function InputField({
  label,
  error,
  id,
  type,
  required,
  variant = 'text',
  value,
  onChange,
  onKeyDown,
  className,
  ...props
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isCurrency = variant === 'currency';

  // ── Derived input props ────────────────────────────────────────────────────
  // Currency display is always derived from the value prop — no local state
  // needed. The parent owns the raw digit string; we just format it for display.
  const resolvedType =
    isCurrency || variant === 'number' ? 'text'
    : isPassword ? (showPassword ? 'text' : 'password')
    : type

  const resolvedValue = isCurrency ? formatCurrency(value) : value

  const resolvedInputMode =
    variant === 'number' || isCurrency ? 'numeric' : undefined

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (NAV_KEYS.includes(e.key) || e.ctrlKey || e.metaKey) {
      onKeyDown?.(e)
      return
    }

    if (variant === 'number' || isCurrency) {
      if (!/^\d$/.test(e.key)) e.preventDefault()
    } else if (variant === 'alpha') {
      if (!/^[a-zA-Z]$/.test(e.key) && e.key !== ' ') e.preventDefault()
    }

    onKeyDown?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (variant === 'number') {
      // Strip non-digits (handles paste)
      e.target.value = e.target.value.replace(/\D/g, '')

    } else if (variant === 'alpha') {
      // Strip digits and special chars (handles paste)
      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')

    } else if (isCurrency) {
      // Parent receives raw digits; display is re-derived from value on next render
      e.target.value = e.target.value.replace(/,/g, '').replace(/\D/g, '')
    }

    onChange?.(e)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          id={id}
          type={resolvedType}
          value={resolvedValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          inputMode={resolvedInputMode}
          aria-invalid={!!error}
          className={cn(isPassword && "pr-10", className)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export { InputField };
