"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/custom-ui/password-input";
import { loginAction } from "../_actions/authActions";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";

  const [state, action, pending] = useActionState(
    loginAction.bind(null, redirectTo),
    false,
  );

  useEffect(() => {
    if (!state) return;
    if (!state.success) {
      toast.error(state.message || "Login failed");
    }
  }, [state]);

  return (
    <form action={action}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label className="text-xs md:text-base" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-xs md:text-base" htmlFor="password">
            Password
          </Label>
          <PasswordInput id="password" name="password" required />
        </div>

        <div className="space-y-3">
          <Button type="submit" className="w-full cursor-pointer">
            {pending ? "Submitting..." : "Login"}
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/register")}
            variant="outline"
            className="w-full cursor-pointer"
          >
            Create an Account
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
