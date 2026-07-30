"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export default function ReviewsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mx-auto max-w-2xl text-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur">
        <Sparkles className="size-4 text-primary" />
        What people are saying
      </span>
      <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Trusted by renters and landlords alike.
      </h2>
      <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
        Real feedback from people who found or listed a home through RentNest.
      </p>
    </motion.div>
  );
}
