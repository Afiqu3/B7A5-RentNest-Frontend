"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  emptyRequestState,
  type RequestActionState,
} from "@/lib/landlord-requests";
import { updateRequestStatus } from "../../_actions/landlordRequestsAction";

type RequestDecisionProps = {
  rentalId: string;
};

/**
 * Approve / reject controls for a single pending request. Kept as its own
 * component so each row owns an isolated `useActionState` — one card's pending
 * state never bleeds into another's.
 */
const RequestDecision = ({ rentalId }: RequestDecisionProps) => {
  const router = useRouter();

  const action = React.useMemo(
    () => updateRequestStatus.bind(null, rentalId),
    [rentalId],
  );

  const [state, formAction, pending] = React.useActionState<
    RequestActionState,
    FormData
  >(action, emptyRequestState);

  const handledAt = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    if (!state.submittedAt || state.submittedAt === handledAt.current) return;
    handledAt.current = state.submittedAt;

    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
      // Re-fetch so the row moves out of "pending" and the counts update.
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state.message, state.submittedAt, state.success, router]);

  return (
    <form action={formAction} className="flex gap-2">
      <Button
        type="submit"
        name="status"
        value="APPROVED"
        size="sm"
        disabled={pending}
        className="flex-1 bg-emerald-600 text-white hover:bg-emerald-600/90"
      >
        {pending ? <Loader2 className="animate-spin" /> : <Check />}
        Approve
      </Button>
      <Button
        type="submit"
        name="status"
        value="REJECTED"
        size="sm"
        variant="destructive"
        disabled={pending}
        className="flex-1"
      >
        <X />
        Reject
      </Button>
    </form>
  );
};

export default RequestDecision;
