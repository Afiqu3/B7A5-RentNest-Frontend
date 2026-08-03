"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CheckCircle2,
  Lock,
  LogIn,
  Mail,
  MapPin,
  Phone,
  Square,
  Tag,
  UserRound,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PropertyDetail } from "@/lib/property-details";
import AuthPromptModal from "./AuthPromptModal";
import RequestRentalDialog from "./RequestRentalDialog";

type Viewer = {
  id: string;
  role: string;
};

type PropertyDetailsProps = {
  property: PropertyDetail;
  isLoggedIn: boolean;
  viewer: Viewer | null;
  /** The current path, used for post-login redirects. */
  redirectTo: string;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

function statusStyles(status: string) {
  switch (status?.toUpperCase()) {
    case "AVAILABLE":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "RENTED":
      return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "UNAVAILABLE":
      return "border-destructive/30 bg-destructive/10 text-destructive";
    default:
      return "border-border bg-background/80 text-foreground/80";
  }
}

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const PropertyDetails = ({
  property,
  isLoggedIn,
  viewer,
  redirectTo,
}: PropertyDetailsProps) => {
  const rent = Number(property.rentAmount);
  const amenities = property.amenities ?? [];
  const isAvailable = property.status?.toUpperCase() === "AVAILABLE";
  const canRequest = isLoggedIn && viewer?.role === "TENANT" && isAvailable;

  const stats = [
    { icon: BedDouble, label: "Bedrooms", value: property.bedrooms ?? "—" },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms ?? "—" },
    {
      icon: Square,
      label: "Area",
      value: property.areaSquareFt
        ? `${property.areaSquareFt.toLocaleString()} ft²`
        : "—",
    },
    { icon: Tag, label: "Category", value: property.category?.name ?? "—" },
  ];

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-1/2 size-80 translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 size-64 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <motion.div {...fade} transition={{ duration: 0.3 }}>
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
            <Link href="/properties">
              <ArrowLeft />
              Back to properties
            </Link>
          </Button>
        </motion.div>

        {/* hero */}
        <motion.div
          {...fade}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative h-64 overflow-hidden rounded-3xl border border-border/70 bg-muted shadow-sm sm:h-80 lg:h-105"
        >
          {property.image ? (
            <Image
              src={property.image}
              alt={property.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1152px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No photo available
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/10 to-background/20" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-4 sm:p-5">
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.16em] uppercase backdrop-blur",
                statusStyles(property.status),
              )}
            >
              {property.status}
            </span>
            {property.category?.name ? (
              <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] font-medium text-foreground/80 backdrop-blur">
                {property.category.name}
              </span>
            ) : null}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {property.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground sm:text-base">
              <MapPin className="size-4 shrink-0 text-primary" />
              {property.location}
            </p>
          </div>
        </motion.div>

        {/* body */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* main column */}
          <div className="space-y-6 lg:col-span-2">
            <motion.div
              {...fade}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border/70 bg-card/70 p-4 text-center"
                >
                  <stat.icon className="mx-auto size-5 text-primary" />
                  <p className="mt-2 font-heading text-lg font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.section
              {...fade}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="rounded-3xl border border-border/70 bg-card/70 p-5 sm:p-6"
            >
              <h2 className="font-heading text-lg font-semibold text-foreground">
                About this property
              </h2>
              <p className="mt-3 text-sm leading-7 whitespace-pre-line text-muted-foreground sm:text-base">
                {property.description}
              </p>

              <div className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{property.address}</span>
              </div>
            </motion.section>

            {amenities.length > 0 ? (
              <motion.section
                {...fade}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="rounded-3xl border border-border/70 bg-card/70 p-5 sm:p-6"
              >
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Amenities
                </h2>
                <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </motion.section>
            ) : null}
          </div>

          {/* sidebar */}
          <motion.aside
            {...fade}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="lg:sticky lg:top-24 lg:h-fit"
          >
            <div className="space-y-4 rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm sm:p-6">
              <div>
                <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                  Monthly rent
                </p>
                <p className="mt-1 font-heading text-3xl font-semibold text-foreground">
                  {Number.isFinite(rent) ? currency.format(rent) : "—"}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
              </div>

              {/* request / auth CTA */}
              {canRequest && viewer ? (
                <RequestRentalDialog
                  propertyId={property.id}
                  userId={viewer.id}
                  propertyTitle={property.title}
                  rentLabel={
                    Number.isFinite(rent) ? currency.format(rent) : "the rent"
                  }
                />
              ) : isLoggedIn && !isAvailable ? (
                <div className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  This property is currently {property.status.toLowerCase()} and
                  isn&apos;t accepting requests.
                </div>
              ) : isLoggedIn && viewer?.role !== "TENANT" ? (
                <div className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  Only tenant accounts can send rental requests.
                </div>
              ) : null}

              {/* landlord section */}
              <div className="border-t border-border/60 pt-4">
                <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                  Landlord
                </p>

                {isLoggedIn ? (
                  <div className="mt-3 space-y-2.5">
                    <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <UserRound className="size-4 shrink-0 text-muted-foreground" />
                      {property.landlord?.name ?? "Contact via RentNest"}
                    </p>
                    {property.landlord?.email ? (
                      <a
                        href={`mailto:${property.landlord.email}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Mail className="size-4 shrink-0" />
                        <span className="line-clamp-1">
                          {property.landlord.email}
                        </span>
                      </a>
                    ) : null}
                    {property.landlord?.phone ? (
                      <a
                        href={`tel:${property.landlord.phone}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Phone className="size-4 shrink-0" />
                        {property.landlord.phone}
                      </a>
                    ) : null}
                    {!property.landlord?.email &&
                    !property.landlord?.phone &&
                    !property.landlord?.name ? (
                      <p className="text-sm text-muted-foreground">
                        Contact details will appear here.
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-start gap-2 rounded-2xl border border-dashed border-border bg-muted/40 px-3.5 py-3 text-sm text-muted-foreground">
                      <Lock className="mt-0.5 size-4 shrink-0" />
                      Landlord contact details are hidden. Sign in to view them.
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button asChild className="w-full">
                        <Link
                          href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
                        >
                          <LogIn />
                          Log in
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link
                          href={`/register?redirectTo=${encodeURIComponent(redirectTo)}`}
                        >
                          <UserPlus />
                          Create an account
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* First-visit nudge for signed-out visitors. */}
      {!isLoggedIn ? <AuthPromptModal redirectTo={redirectTo} /> : null}
    </div>
  );
};

export default PropertyDetails;
