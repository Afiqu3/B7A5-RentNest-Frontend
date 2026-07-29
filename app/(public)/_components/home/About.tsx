"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Home, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  "Verified homes and transparent listings",
  "A smoother booking experience for renters",
  "Support that stays with you from search to move-in",
];

export default function About() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-sm font-medium text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            About RentNest
          </span>

          <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Renting should feel simple, safe, and personal.
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            We help renters discover trusted homes and give landlords a clearer,
            calmer way to manage every step of the journey.
          </p>

          <ul className="mt-6 space-y-3">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Button asChild className="mt-6 group">
            <Link href="/about">
              Learn more
              <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl border border-border bg-linear-to-br from-primary/10 via-background to-amber-500/10 p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-background text-primary shadow-sm">
              <Home className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Why people choose us
              </p>
              <p className="text-sm text-muted-foreground">
                A calmer way to rent
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-border bg-background/80 p-4">
              <p className="text-sm font-medium text-foreground">
                Trusted experience
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Verified listings and clear communication from start to finish.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background/80 p-4">
              <p className="text-sm font-medium text-foreground">
                Built for modern renting
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Smart tools, flexible support, and a smoother flow for every
                visit.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
