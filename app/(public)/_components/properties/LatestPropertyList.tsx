import PropertyCard, { type PropertyPreview } from "./PropertyCard";

type LatestPropertyListProps = {
  properties: PropertyPreview[];
};

export default function LatestPropertyList({
  properties,
}: LatestPropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-border bg-card/60 p-10 text-center">
        <p className="text-base font-medium text-foreground">
          No properties available right now.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Check back soon, new homes are listed regularly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
