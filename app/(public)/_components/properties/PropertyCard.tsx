"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Bath,
  BedDouble,
  MapPin,
  Sparkles,
  Square,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export type PropertyPreview = {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  rentAmount: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSquareFt?: number | null;
  amenities: string[];
  status: string;
  image: string;
  category: string;
};

type PropertyCardProps = {
  property: PropertyPreview;
  /** Where "View details" points. Defaults to the property's own page. */
  href?: string;
  /** Shows the "Featured" chip. Only used on curated lists. */
  featured?: boolean;
  /** Delay (seconds) for the entry animation, for staggering a grid. */
  delay?: number;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

export default function PropertyCard({
  property,
  href = `/properties/${property.id}`,
  featured = false,
  delay = 0,
}: PropertyCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] border border-border bg-card/80 shadow-sm backdrop-blur-sm"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background/50 to-amber-500/15" />
        <div className="absolute inset-0 p-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/80">
              {property.status}
            </span>
            {featured && (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                Featured
              </span>
            )}
          </div>

          <div className="absolute bottom-5 left-5 right-5 rounded-[20px] border border-white/20 bg-background/80 p-4 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="size-4 text-primary" />
              <span>{property.title}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0 text-primary" />
              <span>{property.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{property.address}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Starting at
            </p>
            <p className="font-heading text-xl font-semibold text-foreground">
              {currencyFormatter.format(property.rentAmount)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
            <BedDouble className="size-3.5 text-primary" />
            {property.bedrooms ?? "—"} bed
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
            <Bath className="size-3.5 text-primary" />
            {property.bathrooms ?? "—"} bath
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
            <Square className="size-3.5 text-primary" />
            {property.areaSquareFt?.toLocaleString() ?? "N/A"} sq ft
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
            <Square className="size-3.5 text-primary" />
            {property.category}
          </span>
        </div>

        <div className="mt-4 mb-6 flex flex-wrap gap-2">
          {property.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 4 && (
            <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
              +{property.amenities.length - 4} more
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-4">
          <p className="truncate text-sm text-muted-foreground">
            Perfect for modern living
          </p>
          <Button asChild variant="outline" size="sm" className="group shrink-0">
            <Link href={href}>
              View details
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
