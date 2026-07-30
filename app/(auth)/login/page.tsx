import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, House, ShieldCheck, Sparkles } from "lucide-react";

import LoginForm from "@/app/_components/LoginForm";

export const metadata: Metadata = {
  title: "Log in · RentNest",
  description: "Sign in to your RentNest account to manage your rentals.",
};

const HIGHLIGHTS = [
  { icon: BadgeCheck, text: "Verified homes and transparent listings" },
  { icon: ShieldCheck, text: "Secure, encrypted payments" },
  { icon: Sparkles, text: "A smoother rental experience, end to end" },
];

export default function LoginPage() {
  return (
    <main className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Brand panel — hidden on small screens */}
        <aside className="relative hidden overflow-hidden rounded-[32px] border border-border bg-card p-10 shadow-sm lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          >
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
          </div>

          <Link href="/" className="group flex w-fit items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-6">
              <House className="size-5" strokeWidth={2} />
            </span>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              RentNest
            </span>
          </Link>

          <div className="mt-12">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground">
              Welcome back to your rental home base.
            </h2>
            <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
              Sign in to manage listings, track requests, and pick up right
              where you left off.
            </p>

            <ul className="mt-8 space-y-3">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-start gap-3 text-sm text-foreground"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="pt-1.5">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Form card */}
        <section className="w-full">
          <div className="mx-auto w-full max-w-md rounded-[28px] border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
            {/* Mobile brand mark */}
            <Link
              href="/"
              className="group mb-8 flex w-fit items-center gap-2 lg:hidden"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-6">
                <House className="size-5" strokeWidth={2} />
              </span>
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                RentNest
              </span>
            </Link>

            <div className="mb-6">
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Sign in
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your details to access your account.
              </p>
            </div>

            <Suspense
              fallback={<div className="h-72 animate-pulse rounded-xl bg-muted" />}
            >
              <LoginForm />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}
