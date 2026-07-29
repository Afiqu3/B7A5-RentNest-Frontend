"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import {
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

const STATS = [
  { value: "12k+", label: "Active listings" },
  { value: "8k+", label: "Happy renters" },
  { value: "4.9", label: "Avg. rating" },
];

export default function Banner() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 -left-24 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-16 top-24 size-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-28"
      >
        {/* copy */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="size-4 text-primary" />
            Find & List Rental Properties with Ease
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-heading text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"
          >
            Rent smarter with{" "}
            <span className="relative whitespace-nowrap text-primary">
              RentNest
              <svg
                aria-hidden
                viewBox="0 0 300 12"
                className="absolute -bottom-2 left-0 h-2.5 w-full text-amber-500/70"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9 C 80 2, 220 2, 298 8"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg"
          >
            Browse verified rentals, book viewings, and sign securely — all in
            one place. Whether you&rsquo;re looking to rent or list your
            property, RentNest makes it effortless.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <Button
              asChild
              size="lg"
              className="group w-full sm:w-auto"
            >
              <Link href="/register">
                Create your free account
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/properties">
                <Search />
                Browse properties
              </Link>
            </Button>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-12 grid w-full max-w-md grid-cols-3 gap-4 border-t border-border/70 pt-8 lg:max-w-none"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <dt className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* illustration */}
        <motion.div
          variants={item}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-amber-100/60 to-muted/40 shadow-xl ring-1 ring-black/5 dark:from-primary/10 dark:to-muted/20"
          >
            <Image
              src="/images/banner-home.svg"
              alt="Cozy rental homes at golden hour"
              width={1200}
              height={900}
              priority
              className="h-auto w-full"
            />
          </motion.div>

          {/* floating verified badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 16 }}
            className="absolute -left-3 bottom-8 flex items-center gap-3 rounded-2xl border border-border bg-background/90 p-3 shadow-lg backdrop-blur sm:-left-6"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <div className="pr-1 text-left">
              <p className="text-sm font-semibold text-foreground">
                Verified listings
              </p>
              <p className="text-xs text-muted-foreground">
                Every home is checked
              </p>
            </div>
          </motion.div>

          {/* floating rating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 16 }}
            className="absolute -right-2 top-8 flex items-center gap-2 rounded-2xl border border-border bg-background/90 px-3 py-2 shadow-lg backdrop-blur sm:-right-4"
          >
            <Star className="size-4 fill-amber-500 text-amber-500" />
            <span className="text-sm font-semibold text-foreground">4.9</span>
            <span className="text-xs text-muted-foreground">/ 5.0</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
