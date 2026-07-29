import { House } from "lucide-react";

export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-6 bg-background px-6 py-16 text-center"
    >
      <div className="relative flex size-20 items-center justify-center sm:size-24">
        <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-muted border-t-primary" />
        <span className="absolute inset-2 rounded-full bg-muted/40" />
        <House
          className="relative size-8 text-primary sm:size-9"
          strokeWidth={1.75}
        />
      </div>

      <div className="space-y-1.5">
        <p className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          Loading RentNest
        </p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Getting things ready for you&hellip;
        </p>
      </div>

      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="size-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-primary/70" />
      </div>

      <span className="sr-only">Loading, please wait.</span>
    </main>
  );
}
