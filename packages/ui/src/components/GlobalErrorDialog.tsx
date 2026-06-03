import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { useErrorStore } from "@frontend/shared/store/useErrorStore.ts";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "./ui/alert-dialog";
import { cn } from "../lib/utils";

function ErrorIcon() {
  return (
    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-error-bg)] mx-auto mb-4">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-error-text)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
  );
}

export function GlobalErrorDialog() {
  const errors = useErrorStore((s) => s.errors);
  const clearError = useErrorStore((s) => s.clearError);

  const firstKey = Object.keys(errors)[0];
  const errorEntry = firstKey ? errors[firstKey] : undefined;

  const dismiss = () => firstKey && clearError(firstKey);

  return (
    <AlertDialog open={!!errorEntry} onOpenChange={dismiss}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-[500] bg-black/30 backdrop-blur-[1px]" />
        <AlertDialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-[501] -translate-x-1/2 -translate-y-1/2",
            "w-[90%] max-w-sm rounded-xl bg-background border border-border shadow-lg",
            "p-0 overflow-hidden",
          )}
        >
          <div className="h-1.5 w-full bg-[var(--color-error-text)] rounded-t-2xl" />

          <div className="px-6 pt-6 pb-2 text-center">
            <ErrorIcon />
            <AlertDialogTitle className="text-base font-semibold text-[var(--color-error-text)] mb-1">
              {errorEntry?.title ?? "Terjadi Kesalahan"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
              {errorEntry?.message}
            </AlertDialogDescription>
          </div>

          <AlertDialogFooter className="px-6 pb-6 mt-4">
            <AlertDialogAction
              onClick={dismiss}
              className="w-full bg-[var(--color-error-text)] text-white hover:opacity-90 active:opacity-80 [box-shadow:none] rounded-xl h-10"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialog>
  );
}
