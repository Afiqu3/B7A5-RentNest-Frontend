"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { HelpCircle, Plus } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    question: "How do I book a property on RentNest?",
    answer:
      "Browse the listings, open a property you like, and send a rental request or schedule a viewing in a few taps. The landlord reviews your request and approves or declines it from their dashboard.",
  },
  {
    question: "Are all listings verified?",
    answer:
      "Yes. Every property is reviewed and approved by our team before it goes live, so what you see in the listing is what you get in person.",
  },
  {
    question: "How are payments handled?",
    answer:
      "Deposits and rent are paid through a protected, encrypted checkout. You get a clear record of every transaction, and funds are only released once terms are met.",
  },
  {
    question: "Can I list my property as a landlord?",
    answer:
      "Absolutely. Create a landlord account to list properties, manage availability, and handle rental requests from one intuitive control center.",
  },
  {
    question: "What if I need help during my rental?",
    answer:
      "Our support team is available to both renters and landlords at every step, from the first search to move-in day and beyond. Reach out any time and a real person will help.",
  },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-muted/30 py-16 sm:py-20 lg:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/2 top-0 h-72 w-72 translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur"
          >
            <HelpCircle className="size-4 text-primary" />
            Frequently asked questions
          </motion.span>
          <motion.h2
            variants={item}
            className="mt-5 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl"
          >
            Everything you need to know.
          </motion.h2>
          <motion.p
            variants={item}
            className="mt-3 text-base leading-7 text-pretty text-muted-foreground sm:text-lg"
          >
            Can&rsquo;t find what you&rsquo;re looking for? Our support team is
            always a message away.
          </motion.p>
        </motion.div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 space-y-3"
        >
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.li
                key={faq.question}
                variants={item}
                className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/40"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-base font-medium text-foreground">
                    {faq.question}
                  </span>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background/70 text-primary"
                  >
                    <Plus className="size-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-6 text-muted-foreground">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
