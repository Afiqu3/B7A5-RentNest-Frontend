"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  BadgeCheck,
  CalendarDays,
  Loader2,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { NavbarProps, ProfileFormState } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateProfileAction } from "../_actions/profileActions";

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */

function initialsOf(name: string | undefined) {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(value: string | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  // Pin the timezone so the server and client render the same day — otherwise
  // a timestamp near midnight hydrates with a mismatch.
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

const ROLE_COPY: Record<string, string> = {
  TENANT: "Browse listings, send rental requests, and pay securely.",
  LANDLORD: "List properties, manage availability, and approve requests.",
  ADMIN: "Moderate listings, users, and transactions across the platform.",
};

/* -------------------------------------------------------------------------- */
/*                                  info row                                  */
/* -------------------------------------------------------------------------- */

function InfoCard({
  icon: Icon,
  label,
  value,
  index,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      className="group flex items-start gap-3 rounded-2xl border border-border bg-card/70 p-4 transition-colors duration-300 hover:border-primary/30 hover:bg-card"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-medium text-foreground">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               update dialog                                */
/* -------------------------------------------------------------------------- */

function UpdateProfileDialog({
  name,
  phone,
  email,
}: {
  name: string;
  phone: string;
  email: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<ProfileFormState>(false);
  const [pending, startTransition] = React.useTransition();

  // Controlled fields. React 19 auto-resets an uncontrolled form once a
  // function `action` returns, which would wipe the user's edits while the
  // request is still in flight — controlling the inputs avoids that entirely.
  const [form, setForm] = React.useState({ name, phone });

  const setField = (field: "name" | "phone") => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Reset to the latest server values whenever the dialog is (re)opened.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setForm({ name, phone });
      setState(false);
    }
    setOpen(next);
  };

  // Calling the action inside a transition (rather than useActionState + an
  // effect) lets us react to the result directly — close on success, keep the
  // dialog open and show field errors on failure.
  const action = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateProfileAction(state, formData);

      if (result && result.success) {
        setState(false);
        setOpen(false);
        toast.success(result.message || "Profile updated.");
        // Pull the revalidated profile back down so the page reflects the edit.
        router.refresh();
        return;
      }

      setState(result);
      toast.error(
        (result && result.message) || "Could not update your profile.",
      );
    });
  };

  const errors = state && !state.success ? state.errors : undefined;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="group w-full sm:w-auto">
          <Pencil className="transition-transform duration-300 group-hover:-rotate-12" />
          Update profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update your profile</DialogTitle>
          <DialogDescription>
            Change your display name and contact number. Your email address and
            role are managed by RentNest and cannot be edited here.
          </DialogDescription>
        </DialogHeader>

        <form action={action} noValidate className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label htmlFor="profile-name">Full name</Label>
            <Input
              id="profile-name"
              name="name"
              value={form.name}
              onChange={(event) => setField("name")(event.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              aria-invalid={Boolean(errors?.name)}
              aria-describedby={errors?.name ? "profile-name-error" : undefined}
              required
            />
            {errors?.name && (
              <p
                id="profile-name-error"
                className="text-xs font-medium text-destructive"
              >
                {errors.name[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="profile-phone">Phone number</Label>
            <Input
              id="profile-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={(event) => setField("phone")(event.target.value)}
              placeholder="+880 1XXX XXXXXX"
              autoComplete="tel"
              aria-invalid={Boolean(errors?.phone)}
              aria-describedby={
                errors?.phone ? "profile-phone-error" : undefined
              }
              required
            />
            {errors?.phone && (
              <p
                id="profile-phone-error"
                className="text-xs font-medium text-destructive"
              >
                {errors.phone[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              value={email}
              readOnly
              disabled
              className="cursor-not-allowed opacity-70"
            />
            <p className="text-xs text-muted-foreground">
              Contact support to change the email on your account.
            </p>
          </div>

          <DialogFooter className="pt-1">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin" />}
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  my profile                                */
/* -------------------------------------------------------------------------- */

export default function MyProfile({ user }: NavbarProps) {
  const profile = user?.success ? user.data : undefined;

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center">
        <p className="font-heading text-lg font-semibold text-foreground">
          We couldn&apos;t load your profile.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Your session may have expired. Please log in again.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login">Go to login</Link>
        </Button>
      </div>
    );
  }

  const isActive = profile.activeStatus?.toUpperCase() === "ACTIVE";

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* ------------------------------- header ------------------------------ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:p-8"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 right-0 size-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 size-56 rounded-full bg-amber-500/10 blur-3xl" />
        </div>

        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Avatar className="size-16 border border-border shadow-sm sm:size-20">
                <AvatarFallback className="bg-primary/10 font-heading text-lg font-semibold text-primary sm:text-xl">
                  {initialsOf(profile.name) || <UserRound className="size-6" />}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="min-w-0">
              <h1 className="truncate font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {profile.name}
              </h1>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {profile.email}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-primary uppercase">
                  <ShieldCheck className="size-3" />
                  {profile.role}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  <BadgeCheck className="size-3" />
                  {profile.activeStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <UpdateProfileDialog
              name={profile.name}
              phone={profile.phone}
              email={profile.email}
            />
          </div>
        </div>

        {ROLE_COPY[profile.role] && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="mt-6 border-t border-border/70 pt-5 text-sm leading-6 text-muted-foreground"
          >
            {ROLE_COPY[profile.role]}
          </motion.p>
        )}
      </motion.section>

      {/* ------------------------------ details ------------------------------ */}
      <section className="mt-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Account details
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <InfoCard
            index={0}
            icon={UserRound}
            label="Full name"
            value={profile.name}
          />
          <InfoCard
            index={1}
            icon={Mail}
            label="Email"
            value={profile.email}
          />
          <InfoCard
            index={2}
            icon={Phone}
            label="Phone"
            value={profile.phone || "Not provided"}
          />
          <InfoCard
            index={3}
            icon={ShieldCheck}
            label="Role"
            value={profile.role}
          />
          <InfoCard
            index={4}
            icon={CalendarDays}
            label="Member since"
            value={formatDate(profile.createdAt)}
          />
        </div>
      </section>
    </div>
  );
}
