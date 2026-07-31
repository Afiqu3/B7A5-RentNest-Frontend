import { Skeleton } from "@/components/ui/skeleton";

export function PropertyGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div
      aria-hidden
      className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[28px] border border-border bg-card/70 shadow-sm"
        >
          <Skeleton className="h-48 rounded-none" />
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <div className="mt-5 flex gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PropertiesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card/70 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Skeleton className="h-11 flex-1 rounded-4xl" />
          <div className="flex shrink-0 gap-2">
            <Skeleton className="h-11 w-44 rounded-4xl" />
            <Skeleton className="h-11 w-28 rounded-4xl" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>
      </div>

      <PropertyGridSkeleton />
    </div>
  );
}
