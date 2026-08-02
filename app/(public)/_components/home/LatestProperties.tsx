"use server";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LatestPropertyList from "../properties/LatestPropertyList";
import { getLatestProperties } from "../../_action/actions";
import LatestPropertiesHeader from "./LatestPropertiesHeader";

// type PropertyPreview = {
//   id: string;
//   title: string;
//   description: string;
//   location: string;
//   address: string;
//   rentAmount: number;
//   bedrooms: number;
//   bathrooms: number;
//   areaSquareFt?: number;
//   amenities: string[];
//   status: string;
//   image: string;
//   category: string;
//   // createdAt: string;
// };

// const featuredProperties: PropertyPreview[] = [
//   {
//     id: "prop-1",
//     title: "Modern Loft with Skyline Views",
//     description:
//       "A bright, airy loft with premium finishes, a private balcony, and a spacious open-plan layout.",
//     location: "Downtown, Seattle",
//     address: "128 Harbor Avenue",
//     rentAmount: 2450,
//     bedrooms: 2,
//     bathrooms: 2,
//     areaSquareFt: 1320,
//     amenities: ["Gym", "Concierge", "Parking"],
//     status: "Available",
//     image: "/images/banner-home.svg",
//     category: "House",
//   },
//   {
//     id: "prop-2",
//     title: "Garden Villa Retreat",
//     description:
//       "A serene retreat with lush garden views, warm wood interiors, and a tranquil patio for relaxing evenings.",
//     location: "Cedar Hills",
//     address: "42 Willow Lane",
//     rentAmount: 1980,
//     bedrooms: 3,
//     bathrooms: 2,
//     areaSquareFt: 1680,
//     amenities: ["Pet Friendly", "Backyard", "Laundry"],
//     status: "Available",
//     image: "/images/banner-home.svg",
//     category: "House",
//   },
//   {
//     id: "prop-3",
//     title: "Executive Riverside Residence",
//     description:
//       "An elegant riverside home with smart-home features, a chef-ready kitchen, and generous outdoor space.",
//     location: "Riverfront District",
//     address: "89 Lake-view Terrace",
//     rentAmount: 3120,
//     bedrooms: 4,
//     bathrooms: 3,
//     areaSquareFt: 2410,
//     amenities: ["Waterfront", "Fireplace", "Terrace"],
//     status: "Available",
//     image: "/images/banner-home.svg",
//     category: "House",
//   },
// ];

function PropertyListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[28px] border border-border bg-card/70 p-5 shadow-sm"
        >
          <div className="h-40 rounded-[24px] bg-muted" />
          <div className="mt-4 h-4 w-24 rounded-full bg-muted" />
          <div className="mt-4 h-6 w-3/4 rounded bg-muted" />
          <div className="mt-3 h-4 w-full rounded bg-muted" />
          <div className="mt-3 h-4 w-2/3 rounded bg-muted" />
          <div className="mt-5 flex items-center justify-between">
            <div className="h-5 w-20 rounded bg-muted" />
            <div className="h-9 w-24 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function LatestProperties() {
  const featuredProperties = await getLatestProperties();
  // console.log(featuredProperties)

  return (
    <section className="relative overflow-hidden bg-muted/30 py-16 sm:py-20 lg:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/2 top-0 h-72 w-72 translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <LatestPropertiesHeader />
          <Button asChild variant="outline" className="group self-start">
            <Link href="/properties">
              Explore all homes
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="mt-10">
          <Suspense fallback={<PropertyListSkeleton />}>
            <LatestPropertyList properties={featuredProperties} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
