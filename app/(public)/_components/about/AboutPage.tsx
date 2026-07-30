"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Building2,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Pillar = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const pillars: Pillar[] = [
  {
    icon: ShieldCheck,
    title: "Trusted by default",
    description:
      "Every listing is reviewed with care so renters can move forward with confidence.",
  },
  {
    icon: HeartHandshake,
    title: "Built around people",
    description:
      "We make it easier for landlords and renters to communicate clearly and kindly.",
  },
  {
    icon: Building2,
    title: "Made for modern living",
    description:
      "A polished experience that supports search, booking, and long-term comfort in one place.",
  },
];

const stats = [
  { value: "12k+", label: "Verified listings" },
  { value: "98%", label: "Satisfaction rate" },
  { value: "24/7", label: "Support access" },
];

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-sm font-medium text-muted-foreground">
              <Sparkles className="size-4 text-primary" />
              About RentNest
            </span>

            <h1 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              A cleaner way to rent, list, and connect.
            </h1>

            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              RentNest brings together trusted homes, simple conversations, and
              a smoother rental journey for everyone involved.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="group">
                <Link href="/properties">
                  Explore properties
                  <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/register">Create an account</Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm"
                >
                  <p className="font-heading text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="rounded-3xl border border-border bg-linear-to-br from-primary/10 via-background to-amber-500/10 p-6 shadow-sm sm:p-8"
          >
            <div className="rounded-2xl border border-border bg-background/90 p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Why we exist
              </p>
              <p className="mt-3 text-xl font-semibold text-foreground">
                We make renting feel less stressful and more human.
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                From the first search to the final move-in, RentNest keeps the
                experience clear, secure, and focused on real comfort.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Verified listings and secure communication",
                "Flexible tools for renters and landlords",
                "Support that stays with you every step of the way",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 rounded-2xl border border-border bg-background/80 p-3 text-sm text-foreground"
                >
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </span>
                <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
                  {pillar.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mt-16 rounded-3xl border border-border bg-muted/40 p-8 shadow-sm sm:p-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Ready to begin?
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
                Discover a better rental experience today.
              </h2>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/register">
                Join RentNest
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
