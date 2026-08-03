"use client";

import * as React from "react";
import Link from "next/link";
import { LogIn, Sparkles, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AuthPromptModalProps = {
  /** Where to return after auth — the current property page. */
  redirectTo: string;
};

/**
 * Auto-opens once when a signed-out visitor lands on a property page, nudging
 * them to sign in for the full details. It's dismissible — the public info
 * stays readable behind it.
 */
const AuthPromptModal = ({ redirectTo }: AuthPromptModalProps) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    // A short delay lets the page paint first, so the modal feels like a
    // deliberate nudge rather than a hard gate.
    const timer = window.setTimeout(() => setOpen(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  const loginHref = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;
  const registerHref = `/register?redirectTo=${encodeURIComponent(redirectTo)}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="size-6" />
          </div>
          <DialogTitle className="mt-3 text-center text-lg">
            See the full picture
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in or create a free account to view landlord contact details
            and send a rental request. You can keep browsing the listing either
            way.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-2.5">
          <Button asChild size="lg" className="w-full">
            <Link href={loginHref}>
              <LogIn />
              Log in
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href={registerHref}>
              <UserPlus />
              Create an account
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            Keep browsing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPromptModal;
