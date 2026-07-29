"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert, RotateCw, House } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive sm:size-16">
          <TriangleAlert className="size-7 sm:size-8" strokeWidth={1.75} />
        </div>

        <h1 className="mt-5 font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground sm:text-base">
          We hit an unexpected problem while loading this page. You can try
          again, or head back to safety.
        </p>

        {error?.digest ? (
          <p className="mt-4 rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground break-all">
            Error ref: {error.digest}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button
            onClick={() => reset()}
            size="lg"
            className="w-full sm:w-auto"
          >
            <RotateCw />
            Try again
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/">
              <House />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
