import { Property } from "@/lib/types";
import PropertyCard, { type PropertyPreview } from "./PropertyCard";

type LatestPropertyListProps = {
  properties: Property[];
};

function toPreview(property: Property): PropertyPreview {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    location: property.location,
    address: property.address,
    rentAmount: property.rentAmount,
    bedrooms: property.bedrooms ?? null,
    bathrooms: property.bathrooms ?? null,
    areaSquareFt: property.areaSquareFt ?? null,
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    status: property.status,
    image: property.image,
    category: property.category.name,
  };
}

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
        <PropertyCard
          key={property.id}
          property={toPreview(property)}
          featured
        />
      ))}
    </div>
  );
}
