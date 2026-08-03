import { Skeleton } from "@/components/ui/skeleton";

/** Static shell rendered while the landlord's requests stream in. */
const LandlordRequestsSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/70 bg-linear-to-br from-primary/10 via-background to-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-7 w-36 rounded-full" />
            <Skeleton className="h-9 w-72 max-w-full rounded-2xl" />
            <Skeleton className="h-5 w-80 max-w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-16 w-28 rounded-2xl" />
            <Skeleton className="h-16 w-28 rounded-2xl" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-border/70 bg-card/70"
          >
            <div className="flex gap-4 p-5">
              <Skeleton className="size-24 shrink-0 rounded-2xl" />
              <div className="flex-1 space-y-2.5">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
                <Skeleton className="h-4 w-1/3 rounded-lg" />
              </div>
            </div>
            <div className="mx-5 border-t border-border/60" />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-40 rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-36 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandlordRequestsSkeleton;
