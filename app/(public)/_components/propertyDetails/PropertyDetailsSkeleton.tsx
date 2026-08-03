import { Skeleton } from "@/components/ui/skeleton";

/** Static shell rendered while the property details stream in. */
const PropertyDetailsSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Skeleton className="mb-4 h-8 w-40 rounded-full" />
      <Skeleton className="h-64 w-full rounded-3xl sm:h-80 lg:h-105" />

      <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
        <Skeleton className="h-80 rounded-3xl" />
      </div>
    </div>
  );
};

export default PropertyDetailsSkeleton;
