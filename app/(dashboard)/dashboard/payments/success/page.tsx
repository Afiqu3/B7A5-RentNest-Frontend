import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Payment Successful | RentNest",
  description: "Your payment was completed successfully.",
};

const PaymentSuccessPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 text-center shadow-sm backdrop-blur-sm duration-500 animate-in fade-in-0 zoom-in-95 sm:p-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-16 right-1/2 size-56 translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 duration-700 animate-in zoom-in-50 dark:text-emerald-400">
          <BadgeCheck className="size-8" strokeWidth={1.75} />
        </div>

        <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-foreground">
          Payment successful
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">
          Thank you — your payment has been received. A record of this
          transaction is now available in your payment history.
        </p>

        <div className="mt-7">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/dashboard/payments">
              <ReceiptText />
              View payments
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
