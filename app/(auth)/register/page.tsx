import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, House, KeyRound, Sparkles } from "lucide-react";

import RegisterForm from "@/app/(auth)/_components/RegisterForm";

export const metadata: Metadata = {
  title: "Create account · RentNest",
  description:
    "Create your RentNest account to find a home or list your property.",
};

const HIGHLIGHTS = [
  { icon: BadgeCheck, text: "Verified homes and transparent listings" },
  { icon: KeyRound, text: "List and manage properties with ease" },
  { icon: Sparkles, text: "A smoother rental experience, end to end" },
];

export default function RegisterPage() {
  return (
    <main className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Brand panel — hidden on small screens */}
        <aside className="relative hidden overflow-hidden rounded-[32px] border border-border bg-card p-10 shadow-sm lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          >
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
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
              Your next home starts here.
            </h2>
            <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
              Create an account to discover trusted homes as a tenant, or list
              and manage properties as a landlord.
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
                Create your account
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Join RentNest in just a few steps.
              </p>
            </div>

            <RegisterForm />
          </div>
        </section>
      </div>
    </main>
  );
}
