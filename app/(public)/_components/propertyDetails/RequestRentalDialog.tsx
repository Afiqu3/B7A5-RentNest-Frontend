"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  AlertCircle,
  CalendarDays,
  CalendarRange,
  Check,
  KeyRound,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  emptyRentalRequestState,
  type RentalRequestActionState,
} from "@/lib/property-details";
import type { RentalRequestField } from "@/lib/validations";
import { requestRental } from "../../_action/propertyDetails";

type RequestRentalDialogProps = {
  propertyId: string;
  userId: string;
  propertyTitle: string;
  rentLabel: string;
};

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

const RequestRentalDialog = ({
  propertyId,
  userId,
  propertyTitle,
  rentLabel,
}: RequestRentalDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const action = React.useMemo(
    () => requestRental.bind(null, propertyId, userId),
    [propertyId, userId],
  );

  const [state, formAction, pending] = React.useActionState<
    RentalRequestActionState,
    FormData
  >(action, emptyRentalRequestState);

  const errorOf = (field: RentalRequestField) => state.errors?.[field]?.[0];

  // The native date input needs a `min` of today in yyyy-mm-dd.
  const today = React.useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
  }, []);

  const handledAt = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    if (!state.submittedAt || state.submittedAt === handledAt.current) return;
    handledAt.current = state.submittedAt;

    if (!state.message) return;

    if (!state.success) {
      toast.error(state.message);
      return;
    }

    toast.success(state.message);
    // Defer the close/refresh out of the effect body so we're not calling
    // setState synchronously during render commit.
    const timer = window.setTimeout(() => {
      setOpen(false);
      router.refresh();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [state.message, state.submittedAt, state.success, router]);

  return (
    <Dialog open={open} onOpenChange={pending ? undefined : setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full gap-2 sm:w-auto">
          <KeyRound />
          Request to Rent
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton={!pending} className="sm:max-w-md">
        <DialogHeader>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <KeyRound className="size-3.5" />
            Rental request
          </div>
          <DialogTitle className="mt-2 text-lg">
            Request to rent this home
          </DialogTitle>
          <DialogDescription>
            {propertyTitle} · {rentLabel}/mo. Pick your move-in date and how long
            you&apos;d like to stay — the landlord reviews every request.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="moveInDate">
              <CalendarDays className="size-3.5 text-muted-foreground" />
              Move-in date
            </Label>
            <Input
              id="moveInDate"
              name="moveInDate"
              type="date"
              min={today}
              aria-invalid={Boolean(errorOf("moveInDate"))}
              disabled={pending}
              className="h-11"
            />
            <FieldError message={errorOf("moveInDate")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="durationMonths">
              <CalendarRange className="size-3.5 text-muted-foreground" />
              Duration (months)
            </Label>
            <Input
              id="durationMonths"
              name="durationMonths"
              type="number"
              inputMode="numeric"
              min={1}
              max={24}
              defaultValue={12}
              placeholder="12"
              aria-invalid={Boolean(errorOf("durationMonths"))}
              disabled={pending}
              className="h-11"
            />
            <FieldError message={errorOf("durationMonths")} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : <Check />}
              {pending ? "Sending…" : "Send request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestRentalDialog;
