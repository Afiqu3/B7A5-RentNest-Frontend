"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  Home,
  Loader2,
  PlusCircle,
  Sparkles,
  Wallet,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type {
  MyListing as MyListingType,
  MyListingCategory,
} from "@/lib/listings";
import { deleteListing } from "../../_actions/myListings";
import ListingCard from "./ListingCard";
import ListingFormDialog from "./ListingFormDialog";
import ListingsPagination, { buildListingsHref } from "./ListingsPagination";

type ListingsMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type MyListingProps = {
  listings: MyListingType[];
  categories: MyListingCategory[];
  meta: ListingsMeta;
  currentPage: number;
  baseHref: string;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

const MyListing = ({
  listings,
  categories,
  meta,
  currentPage,
  baseHref,
}: MyListingProps) => {
  const router = useRouter();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<MyListingType | null>(null);
  const [pendingDelete, setPendingDelete] =
    React.useState<MyListingType | null>(null);
  const [deleting, startDeleting] = React.useTransition();

  /* ----------------------------- derived data ---------------------------- */

  const stats = React.useMemo(() => {
    const available = listings.filter(
      (listing) => listing.status?.toUpperCase() === "AVAILABLE",
    ).length;

    const rents = listings
      .map((listing) => Number(listing.rentAmount))
      .filter((rent) => Number.isFinite(rent));

    const averageRent = rents.length
      ? Math.round(rents.reduce((sum, rent) => sum + rent, 0) / rents.length)
      : 0;

    return { available, averageRent };
  }, [listings]);

  const totalPages = Math.max(meta.totalPages || 1, 1);

  /* ------------------------------- handlers ------------------------------ */

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (listing: MyListingType) => {
    setEditing(listing);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const target = pendingDelete;

    startDeleting(async () => {
      try {
        const result = await deleteListing(target.id);

        if (result?.success) {
          toast.success(result.message);

          // Removing the only row on the last page would strand the landlord
          // on an empty page, so step back one first.
          if (listings.length === 1 && currentPage > 1) {
            router.push(buildListingsHref(baseHref, currentPage - 1));
          } else {
            router.refresh();
          }
        } else {
          toast.error(result?.message || "Could not remove this listing.");
        }
      } catch {
        toast.error("Unable to remove this listing right now.");
      } finally {
        setPendingDelete(null);
      }
    });
  };

  /* -------------------------------- render ------------------------------- */

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* ------------------------------ header ------------------------------ */}
      <div className="rounded-3xl border border-border/70 bg-linear-to-br from-primary/10 via-background to-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Building2 className="size-4" />
              Listing manager
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Your rental portfolio
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Publish new homes, keep details current, and retire listings
                that are no longer on the market.
              </p>
            </div>
          </div>

          <Button size="lg" onClick={openCreate} className="w-full lg:w-auto">
            <PlusCircle />
            Create property
          </Button>
        </div>

        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Total listings",
              value: String(meta.total),
              icon: Home,
            },
            {
              // Only the current page is loaded, so these two are scoped to it
              // rather than claiming to describe the whole portfolio.
              label: "Available on this page",
              value: String(stats.available),
              icon: CheckCircle2,
            },
            {
              label: "Avg. rent on this page",
              value: stats.averageRent
                ? currency.format(stats.averageRent)
                : "—",
              icon: Wallet,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.06, duration: 0.25 }}
              className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3"
            >
              <dt className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <stat.icon className="size-3.5 shrink-0 text-primary" />
                {stat.label}
              </dt>
              <dd className="mt-1.5 font-heading text-xl font-semibold text-foreground">
                {stat.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>

      {/* ------------------------------- grid ------------------------------- */}
      {listings.length === 0 ? (
        currentPage > 1 ? (
          <EmptyState
            icon={Building2}
            title="Nothing on this page"
            description="This page is empty — it may have been cleared since you last loaded it."
            action={
              <Button asChild variant="outline" size="lg">
                <Link href={baseHref}>Back to the first page</Link>
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={Building2}
            title="No listings yet"
            description="Publish your first property and it will show up here, ready for tenants to browse and request."
            action={
              <Button size="lg" onClick={openCreate}>
                <PlusCircle />
                Create your first listing
              </Button>
            }
          />
        )
      ) : (
        <>
          <motion.div
            layout
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {listings.map((listing, index) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  index={index}
                  onEdit={openEdit}
                  onDelete={setPendingDelete}
                  disabled={deleting}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          <ListingsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={meta.total}
            showing={listings.length}
            limit={meta.limit}
            baseHref={baseHref}
          />
        </>
      )}

      {/* ------------------------------ dialogs ----------------------------- */}
      {/*
        Keyed and conditionally mounted so `useActionState`, the amenity chips
        and the image preview all reset between create and edit — React's
        <Activity> would otherwise keep the previous listing's state alive.
      */}
      {formOpen && (
        <ListingFormDialog
          key={editing?.id ?? "create"}
          open={formOpen}
          onOpenChange={setFormOpen}
          listing={editing}
          categories={categories}
          onSaved={() => router.refresh()}
        />
      )}

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{pendingDelete?.title}&rdquo; will be removed from your
              portfolio and will no longer appear in tenant searches. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={(event) => {
                // Keep the dialog mounted while the request is in flight.
                event.preventDefault();
                confirmDelete();
              }}
            >
              {deleting ? <Loader2 className="animate-spin" /> : null}
              {deleting ? "Deleting…" : "Delete listing"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center"
  >
    <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
      <Icon className="size-6" />
    </div>
    <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
      {title}
    </h2>
    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
      {description}
    </p>
    {action ? <div className="mt-6">{action}</div> : null}
    <Sparkles className="mt-6 size-4 text-primary/40" aria-hidden />
  </motion.div>
);

export default MyListing;
