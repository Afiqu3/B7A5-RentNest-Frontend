"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { House, Mail, MapPin, Phone } from "lucide-react";

type IconProps = ComponentProps<"svg">;

// Brand marks are not shipped by this version of lucide-react, so we render
// them as small inline SVGs to keep the logos recognizable.
function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

const COLUMNS: FooterColumn[] = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Properties", href: "/properties" },
      { label: "About", href: "/about" },
      { label: "Reviews", href: "/#reviews" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "/help" },
      { label: "FAQ", href: "/#faq" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];

const SOCIALS = [
  { label: "X", href: "https://x.com", icon: XIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedInIcon },
];

const CONTACTS = [
  { label: "hello@rentnest.com", href: "mailto:hello@rentnest.com", icon: Mail },
  { label: "+880 1700 000000", href: "tel:+8801700000000", icon: Phone },
  { label: "Dhaka, Bangladesh", href: null, icon: MapPin },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-muted/30">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <motion.div variants={item} className="max-w-sm">
            <Link
              href="/"
              className="group flex w-fit items-center gap-2 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-6">
                <House className="size-5" strokeWidth={2} />
              </span>
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                RentNest
              </span>
            </Link>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Trusted homes, transparent listings, and a smoother rental
              experience for tenants and landlords alike.
            </p>

            <ul className="mt-6 space-y-2.5">
              {CONTACTS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      className="inline-flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="size-4 shrink-0 text-primary" />
                      {label}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Icon className="size-4 shrink-0 text-primary" />
                      {label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {COLUMNS.map((column) => (
            <motion.div key={column.title} variants={item}>
              <h3 className="font-heading text-sm font-semibold tracking-wide text-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={item}
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row"
        >
          <p className="text-sm text-muted-foreground">
            &copy; {year} RentNest. All rights reserved.
          </p>

          <ul className="flex items-center gap-2">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <motion.a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="grid size-9 place-items-center rounded-full border border-border bg-background/70 text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="size-4" />
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </footer>
  );
}
