import { Skeleton } from "@/components/ui/skeleton";

/** Static shell rendered while the landlord's portfolio streams in. */
const MyListingSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/70 bg-linear-to-br from-primary/10 via-background to-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-7 w-36 rounded-full" />
            <Skeleton className="h-9 w-64 max-w-full rounded-2xl" />
            <Skeleton className="h-5 w-80 max-w-full rounded-xl" />
          </div>
          <Skeleton className="h-10 w-full rounded-4xl lg:w-44" />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-border/70 bg-card/70"
          >
            <Skeleton className="h-44 rounded-none" />
            <div className="space-y-4 p-5">
              <Skeleton className="h-5 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
              <Skeleton className="h-16 rounded-2xl" />
              <div className="flex gap-1.5">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-8 flex-1 rounded-4xl" />
                <Skeleton className="h-8 flex-1 rounded-4xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Skeleton className="h-[92px] rounded-3xl sm:h-[68px]" />
    </div>
  );
};

export default MyListingSkeleton;
