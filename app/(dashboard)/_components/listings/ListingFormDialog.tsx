"use client";

import * as React from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  AlertCircle,
  Bath,
  BedDouble,
  Building2,
  Check,
  Loader2,
  MapPin,
  Ruler,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  PROPERTY_STATUS_OPTIONS,
  type PropertyField,
  type PropertyStatus,
} from "@/lib/validations";
import {
  emptyListingState,
  type ListingActionState,
  type MyListing,
  type MyListingCategory,
} from "@/lib/listings";
import { createListing, updateListing } from "../../_actions/myListings";
import AmenitiesField from "./AmenitiesField";
import ImageField from "./ImageField";

type ListingFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present when editing; omitted when creating. */
  listing?: MyListing | null;
  categories: MyListingCategory[];
  onSaved: () => void;
};

/** Inline validation message under a field. */
const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="flex items-start gap-1.5 text-xs text-destructive"
    >
      <AlertCircle className="mt-px size-3.5 shrink-0" />
      {message}
    </motion.p>
  );
};

const ListingFormDialog = ({
  open,
  onOpenChange,
  listing,
  categories,
  onSaved,
}: ListingFormDialogProps) => {
  const isEditing = Boolean(listing);

  const action = React.useMemo(
    () => (listing ? updateListing.bind(null, listing.id) : createListing),
    [listing],
  );

  const [state, formAction, pending] = React.useActionState<
    ListingActionState,
    FormData
  >(action, emptyListingState);

  // Controlled because they're not plain text inputs — each writes into a
  // hidden field the server action reads.
  const [categoryId, setCategoryId] = React.useState(listing?.categoryId ?? "");
  const [amenities, setAmenities] = React.useState<string[]>(
    listing?.amenities ?? [],
  );
  const [image, setImage] = React.useState(listing?.image ?? "");
  const [status, setStatus] = React.useState<PropertyStatus | "">(
    // A brand-new listing goes live by default; that's what landlords expect.
    (listing?.status as PropertyStatus) ?? "AVAILABLE",
  );

  const errors = state.errors;
  const errorOf = (field: PropertyField) => errors?.[field]?.[0];

  const handledAt = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    if (!state.submittedAt || state.submittedAt === handledAt.current) return;
    handledAt.current = state.submittedAt;

    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
      onSaved();
      onOpenChange(false);
    } else {
      toast.error(state.message);
    }
  }, [state.message, state.submittedAt, state.success, onOpenChange, onSaved]);

  return (
    <Dialog open={open} onOpenChange={pending ? undefined : onOpenChange}>
      <DialogContent
        showCloseButton={!pending}
        className="max-h-[92dvh] gap-0 overflow-y-auto p-0 sm:max-w-2xl lg:max-w-3xl"
      >
        <div className="sticky top-0 z-10 rounded-t-4xl border-b border-border/60 bg-linear-to-br from-primary/10 via-popover to-popover px-5 pt-6 pb-5 backdrop-blur sm:px-7">
          <DialogHeader>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Building2 className="size-3.5" />
              {isEditing ? "Edit listing" : "New listing"}
            </div>
            <DialogTitle className="mt-2 text-lg sm:text-xl">
              {isEditing ? listing?.title : "Add a property to your portfolio"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the details below — every field is saved as it appears here."
                : "Tell tenants what makes this place worth calling home."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form action={formAction} className="space-y-6 px-5 py-6 sm:px-7">
          {/* Values the server action reads but that aren't plain inputs. */}
          <input type="hidden" name="categoryId" value={categoryId} />
          <input type="hidden" name="amenities" value={amenities.join(",")} />
          <input type="hidden" name="image" value={image} />
          <input type="hidden" name="status" value={status} />

          <section className="space-y-2">
            <Label>Property photo</Label>
            <ImageField
              value={image}
              onChange={setImage}
              invalid={Boolean(errorOf("image"))}
              disabled={pending}
            />
            <FieldError message={errorOf("image")} />
          </section>

          <section className="space-y-2">
            <Label>Availability</Label>
            <div
              role="radiogroup"
              aria-label="Availability"
              className="grid gap-2 sm:grid-cols-3"
            >
              {PROPERTY_STATUS_OPTIONS.map((option) => {
                const selected = status === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={pending}
                    onClick={() => setStatus(option.value)}
                    className={cn(
                      "relative rounded-2xl border p-3 text-left transition-colors outline-none",
                      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      "disabled:pointer-events-none disabled:opacity-60",
                      selected
                        ? "border-primary/40 bg-primary/10"
                        : "border-border/70 bg-input/20 hover:border-primary/30 hover:bg-primary/5",
                      Boolean(errorOf("status")) &&
                        !selected &&
                        "border-destructive/40",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          selected ? "text-primary" : "text-foreground",
                        )}
                      >
                        {option.label}
                      </span>
                      {selected && (
                        <motion.span
                          layoutId="status-check"
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                        >
                          <Check className="size-3" />
                        </motion.span>
                      )}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>
            <FieldError message={errorOf("status")} />
          </section>

          <section className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={listing?.title ?? ""}
                placeholder="Cosy 2-bedroom apartment near the park"
                aria-invalid={Boolean(errorOf("title"))}
                disabled={pending}
                className="h-11"
              />
              <FieldError message={errorOf("title")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-trigger">Category</Label>
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
                disabled={pending || categories.length === 0}
              >
                <SelectTrigger
                  id="category-trigger"
                  aria-invalid={Boolean(errorOf("categoryId"))}
                  className="h-11 w-full"
                >
                  <SelectValue
                    placeholder={
                      categories.length === 0
                        ? "No categories available"
                        : "Select a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categories.length === 0 ? (
                <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <AlertCircle className="mt-px size-3.5 shrink-0" />
                  We couldn&apos;t load any categories. Ask an admin to add one,
                  then reopen this form.
                </p>
              ) : (
                <FieldError message={errorOf("categoryId")} />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rentAmount">
                <Wallet className="size-3.5 text-muted-foreground" />
                Monthly rent (BDT)
              </Label>
              <Input
                id="rentAmount"
                name="rentAmount"
                type="number"
                inputMode="numeric"
                min={1}
                // No `step`: the browser validates it as an offset from `min`,
                // so step=100 with min=1 would only accept 1, 101, 201, …
                defaultValue={listing ? String(listing.rentAmount) : ""}
                placeholder="45000"
                aria-invalid={Boolean(errorOf("rentAmount"))}
                disabled={pending}
                className="h-11"
              />
              <FieldError message={errorOf("rentAmount")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                <MapPin className="size-3.5 text-muted-foreground" />
                Area
              </Label>
              <Input
                id="location"
                name="location"
                defaultValue={listing?.location ?? ""}
                placeholder="Gulshan"
                aria-invalid={Boolean(errorOf("location"))}
                disabled={pending}
                className="h-11"
              />
              <FieldError message={errorOf("location")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full address</Label>
              <Input
                id="address"
                name="address"
                defaultValue={listing?.address ?? ""}
                placeholder="House 12, Road 5, Gulshan-2, Dhaka"
                aria-invalid={Boolean(errorOf("address"))}
                disabled={pending}
                className="h-11"
              />
              <FieldError message={errorOf("address")} />
            </div>
          </section>

          <section className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">
                <BedDouble className="size-3.5 text-muted-foreground" />
                Bedrooms
              </Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                inputMode="numeric"
                min={0}
                max={50}
                defaultValue={listing?.bedrooms ?? ""}
                placeholder="2"
                aria-invalid={Boolean(errorOf("bedrooms"))}
                disabled={pending}
                className="h-11"
              />
              <FieldError message={errorOf("bedrooms")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">
                <Bath className="size-3.5 text-muted-foreground" />
                Bathrooms
              </Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                inputMode="numeric"
                min={0}
                max={50}
                defaultValue={listing?.bathrooms ?? ""}
                placeholder="2"
                aria-invalid={Boolean(errorOf("bathrooms"))}
                disabled={pending}
                className="h-11"
              />
              <FieldError message={errorOf("bathrooms")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areaSquareFt">
                <Ruler className="size-3.5 text-muted-foreground" />
                Area (sq ft)
              </Label>
              <Input
                id="areaSquareFt"
                name="areaSquareFt"
                type="number"
                inputMode="numeric"
                min={1}
                defaultValue={listing?.areaSquareFt ?? ""}
                placeholder="1250"
                aria-invalid={Boolean(errorOf("areaSquareFt"))}
                disabled={pending}
                className="h-11"
              />
              <FieldError message={errorOf("areaSquareFt")} />
            </div>
          </section>

          <section className="space-y-2">
            <Label>Amenities</Label>
            <AmenitiesField
              value={amenities}
              onChange={setAmenities}
              invalid={Boolean(errorOf("amenities"))}
              disabled={pending}
            />
            <FieldError message={errorOf("amenities")} />
          </section>

          <section className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={listing?.description ?? ""}
              placeholder="A beautiful, sunlit apartment with modern finishes, an open-concept kitchen, and a spacious balcony."
              aria-invalid={Boolean(errorOf("description"))}
              disabled={pending}
              rows={5}
            />
            <FieldError message={errorOf("description")} />
          </section>

          <DialogFooter
            className={cn(
              "sticky bottom-0 -mx-5 border-t border-border/60 bg-popover/95 px-5 py-4 backdrop-blur sm:-mx-7 sm:px-7",
            )}
          >
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={pending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : <Check />}
              {pending
                ? isEditing
                  ? "Saving…"
                  : "Publishing…"
                : isEditing
                  ? "Save changes"
                  : "Publish listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ListingFormDialog;
