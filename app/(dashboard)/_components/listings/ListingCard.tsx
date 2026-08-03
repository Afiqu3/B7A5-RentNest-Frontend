"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  Bath,
  BedDouble,
  CalendarDays,
  MapPin,
  PencilLine,
  Square,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MyListing } from "@/lib/listings";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

/** Maps a backend status onto the palette, with a neutral fallback. */
export function statusStyles(status: string) {
  switch (status?.toUpperCase()) {
    case "AVAILABLE":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "RENTED":
      return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "UNAVAILABLE":
    case "DELETED":
      return "border-destructive/30 bg-destructive/10 text-destructive";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

type ListingCardProps = {
  listing: MyListing;
  index: number;
  onEdit: (listing: MyListing) => void;
  onDelete: (listing: MyListing) => void;
  disabled?: boolean;
};

const ListingCard = ({
  listing,
  index,
  onEdit,
  onDelete,
  disabled,
}: ListingCardProps) => {
  const rent = Number(listing.rentAmount);
  const amenities = listing.amenities ?? [];
  const visibleAmenities = amenities.slice(0, 3);
  const hiddenCount = amenities.length - visibleAmenities.length;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.04, 0.32),
        ease: "easeOut",
      }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/70 shadow-sm backdrop-blur-sm"
    >
      <div className="relative h-44 overflow-hidden bg-muted">
        {listing.image ? (
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No photo yet
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/5 to-transparent" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3.5">
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase backdrop-blur",
              statusStyles(listing.status),
            )}
          >
            {listing.status}
          </span>
          {listing.category?.name && (
            <span className="rounded-full border border-border bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground/80 backdrop-blur">
              {listing.category.name}
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3.5">
          <span className="rounded-full bg-background/85 px-3 py-1.5 font-heading text-sm font-semibold text-foreground shadow-sm backdrop-blur">
            {Number.isFinite(rent) ? currency.format(rent) : "—"}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              /mo
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-1.5">
          <h3 className="line-clamp-1 font-heading text-base font-semibold text-foreground">
            {listing.title}
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-primary" />
            <span className="line-clamp-1">
              {listing.location}
              {listing.address ? ` · ${listing.address}` : ""}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border/60 bg-muted/40 p-2.5 text-center">
          <div className="flex flex-col items-center gap-1">
            <BedDouble className="size-4 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">
              {listing.bedrooms ?? "—"} bed
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-border/60">
            <Bath className="size-4 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">
              {listing.bathrooms ?? "—"} bath
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Square className="size-4 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">
              {listing.areaSquareFt ?? "—"} ft²
            </span>
          </div>
        </div>

        {visibleAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleAmenities.map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
              >
                {amenity}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="rounded-full border border-border/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                +{hiddenCount} more
              </span>
            )}
          </div>
        )}

        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {listing.description}
        </p>

        <div className="mt-auto space-y-3 pt-1">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            Listed {dateFormatter.format(new Date(listing.createdAt))}
          </p>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={disabled}
              onClick={() => onEdit(listing)}
            >
              <PencilLine />
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="flex-1"
              disabled={disabled}
              onClick={() => onDelete(listing)}
            >
              <Trash2 />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ListingCard;
