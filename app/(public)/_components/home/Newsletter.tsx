"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

type Status = "idle" | "success" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (!EMAIL_REGEX.test(value)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    // Demo only — no data is sent anywhere.
    setStatus("success");
    setMessage("You're subscribed! Watch your inbox for the latest listings.");
    setEmail("");
  }

  return (
    <section className="bg-background py-16 sm:py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[32px] border border-border bg-card px-6 py-12 shadow-sm sm:px-10 sm:py-16"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur"
            >
              <Mail className="size-4 text-primary" />
              Stay in the loop
            </motion.span>

            <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
              Get the freshest listings in your inbox.
            </h2>
            <p className="mt-3 text-base leading-7 text-pretty text-muted-foreground sm:text-lg">
              Join our newsletter for handpicked homes, price drops, and rental
              tips. No spam, unsubscribe anytime.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
              noValidate
            >
              <div className="relative flex-1">
                <Mail
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-label="Email address"
                  aria-invalid={status === "error"}
                  className="h-11 w-full rounded-full border border-border bg-background/80 pl-10 pr-4 text-sm text-foreground shadow-sm outline-none backdrop-blur transition-colors placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </div>
              <Button type="submit" size="lg" className="group shrink-0">
                Subscribe
                <Send className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </form>

            <div aria-live="polite" className="min-h-6">
              <AnimatePresence mode="wait">
                {status !== "idle" && message && (
                  <motion.p
                    key={message}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={
                      status === "success"
                        ? "mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary"
                        : "mt-4 text-sm font-medium text-destructive"
                    }
                  >
                    {status === "success" && <CheckCircle2 className="size-4" />}
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
