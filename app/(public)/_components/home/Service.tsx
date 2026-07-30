"use client";

import { motion, type Variants } from "motion/react";
import {
  Search,
  BadgeCheck,
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  Headset,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const SERVICES: Service[] = [
  {
    icon: Search,
    title: "Smart search & filters",
    description:
      "Find the right home fast with filters for price, location, size, and amenities that actually matter.",
  },
  {
    icon: BadgeCheck,
    title: "Verified listings",
    description:
      "Every property is reviewed and approved by our team, so what you see is what you get.",
  },
  {
    icon: CalendarCheck,
    title: "Effortless booking",
    description:
      "Request a rental and schedule viewings in a few taps. Landlords approve or decline in one place.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    description:
      "Pay deposits and rent through protected, encrypted checkout with a clear record of every transaction.",
  },
  {
    icon: LayoutDashboard,
    title: "Landlord dashboard",
    description:
      "List properties, manage availability, and handle requests from one intuitive control center.",
  },
  {
    icon: Headset,
    title: "Dedicated support",
    description:
      "Real people ready to help renters and landlords at every step, whenever you need a hand.",
  },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

export default function Service() {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-16 sm:py-20 lg:py-28">
      {/* decorative accent */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/2 top-0 h-72 w-72 translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* heading */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="size-4 text-primary" />
            Everything you need
          </motion.span>

          <motion.h2
            variants={item}
            className="mt-6 font-heading text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl"
          >
            One platform for every step of renting
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg"
          >
            From the first search to the signed lease, RentNest brings renters,
            landlords, and admins together in one seamless experience.
          </motion.p>
        </motion.div>

        {/* cards */}
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <motion.li
              key={service.title}
              variants={item}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-sm transition-colors hover:border-primary/40 hover:shadow-md"
            >
              {/* hover wash */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              />

              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                <service.icon className="size-6" strokeWidth={1.75} />
              </span>

              <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-pretty text-muted-foreground">
                {service.description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
