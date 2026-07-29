import Link from "next/link";
import { MapPinOff, House, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-background px-6 py-16 text-center">
      <div className="w-full max-w-lg">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:size-20">
          <MapPinOff className="size-8 sm:size-10" strokeWidth={1.5} />
        </div>

        <p className="mt-8 font-heading text-6xl font-bold tracking-tighter text-primary sm:text-8xl">
          404
        </p>

        <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          This listing wandered off
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have been
          moved. Let&rsquo;s get you back to browsing your next home.
        </p>

        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/properties">
              <Compass />
              Browse listings
            </Link>
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
