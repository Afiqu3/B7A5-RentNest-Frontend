"use client";

import PropertyCard, { type PropertyPreview } from "./PropertyCard";

type LatestPropertyListProps = {
  properties: PropertyPreview[];
};

export default function LatestPropertyList({
  properties,
}: LatestPropertyListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
