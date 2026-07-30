"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, type Variants } from "motion/react";
import { Building2, House, Mail, Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/custom-ui/password-input";
import type { Role } from "@/lib/types";
import { registrationAction } from "../_actions/authActions";

const ROLES: { value: Role; label: string; icon: typeof House }[] = [
  { value: "TENANT", label: "Tenant", icon: House },
  { value: "LANDLORD", label: "Landlord", icon: Building2 },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 140, damping: 18 },
  },
};

const RegisterForm = () => {
  const router = useRouter();
  const [state, action, pending] = useActionState(registrationAction, false);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message || "Account created successfully");
      router.push("/login");
    } else {
      toast.error(state.message || "Registration failed");
    }
  }, [state, router]);

  const errors = state && !state.success ? state.errors : undefined;

  const fieldError = (field: string) =>
    errors?.[field as keyof typeof errors]?.[0];

  return (
    <motion.form
      action={action}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col gap-5">
        <motion.div variants={item} className="grid gap-2">
          <Label className="text-xs md:text-base" htmlFor="name">
            Full name
          </Label>
          <div className="relative">
            <User
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              className="pl-9"
              aria-invalid={Boolean(fieldError("name"))}
              required
            />
          </div>
          {fieldError("name") && (
            <p className="text-xs font-medium text-destructive">
              {fieldError("name")}
            </p>
          )}
        </motion.div>

        <motion.div variants={item} className="grid gap-2">
          <Label className="text-xs md:text-base" htmlFor="email">
            Email
          </Label>
          <div className="relative">
            <Mail
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              autoComplete="email"
              className="pl-9"
              aria-invalid={Boolean(fieldError("email"))}
              required
            />
          </div>
          {fieldError("email") && (
            <p className="text-xs font-medium text-destructive">
              {fieldError("email")}
            </p>
          )}
        </motion.div>

        <motion.div variants={item} className="grid gap-2">
          <Label className="text-xs md:text-base" htmlFor="phone">
            Phone
          </Label>
          <div className="relative">
            <Phone
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+880 1700 000000"
              autoComplete="tel"
              className="pl-9"
              aria-invalid={Boolean(fieldError("phone"))}
              required
            />
          </div>
          {fieldError("phone") && (
            <p className="text-xs font-medium text-destructive">
              {fieldError("phone")}
            </p>
          )}
        </motion.div>

        <motion.div variants={item} className="grid gap-2">
          <Label className="text-xs md:text-base" htmlFor="password">
            Password
          </Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={Boolean(fieldError("password"))}
            required
          />
          {fieldError("password") && (
            <p className="text-xs font-medium text-destructive">
              {fieldError("password")}
            </p>
          )}
        </motion.div>

        <motion.div variants={item} className="grid gap-2">
          <Label className="text-xs md:text-base">I am a</Label>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((role, index) => (
              <label
                key={role.value}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-4xl border border-border bg-input/30 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 has-checked:border-primary has-checked:bg-primary/10 has-checked:text-primary has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  defaultChecked={index === 0}
                  className="sr-only"
                />
                <role.icon className="size-4" />
                {role.label}
              </label>
            ))}
          </div>
          {fieldError("role") && (
            <p className="text-xs font-medium text-destructive">
              {fieldError("role")}
            </p>
          )}
        </motion.div>

        <motion.div variants={item} className="space-y-3 pt-1">
          <Button
            type="submit"
            disabled={pending}
            className="w-full cursor-pointer"
          >
            {pending ? "Submitting..." : "Create Account"}
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/login")}
            variant="outline"
            className="w-full cursor-pointer"
          >
            I already have an account
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
};

export default RegisterForm;
