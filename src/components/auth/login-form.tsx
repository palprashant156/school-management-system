"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Button, FieldError, Input } from "@/components/ui/ui";
import { PasswordInput } from "@/components/auth/password-input";
import { ForgotPasswordDialog } from "@/components/auth/forgot-password-dialog";
import { DEMO_PASSWORD, primaryDemoAccount, signInWithDemoCredentials } from "@/lib/mock-auth";
import { signInSchema, type SignInValues } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

const errorInputClass = "border-red-300 focus:border-red-500 focus:ring-red-500/15";

export function LoginForm() {
  const router = useRouter();
  const [credentialsError, setCredentialsError] = useState<string | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const forgotTriggerRef = useRef<HTMLButtonElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", remember: false },
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (values) => {
    setCredentialsError(null);
    const result = await signInWithDemoCredentials(values.email, values.password);
    if (!result.ok) {
      setCredentialsError(result.error);
      setFocus("password");
      return;
    }
    router.replace("/dashboard");
  });

  function fillDemoCredentials() {
    setValue("email", primaryDemoAccount.email, { shouldValidate: true });
    setValue("password", DEMO_PASSWORD, { shouldValidate: true });
    setCredentialsError(null);
    setFocus("email");
  }

  function openForgotPassword() {
    setForgotEmail(getValues("email"));
    setForgotOpen(true);
  }

  function closeForgotPassword() {
    setForgotOpen(false);
    requestAnimationFrame(() => forgotTriggerRef.current?.focus());
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate aria-busy={isSubmitting} className="mt-9 space-y-5">
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Work email
          </label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="name@school.edu.in"
            className={cn("h-11 text-[15px]", errors.email && errorInputClass)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            {...register("email")}
          />
          <FieldError id="login-email-error" message={errors.email?.message} />
        </div>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <label htmlFor="login-password" className="text-[13px] font-medium text-slate-700">
              Password
            </label>
            <button
              ref={forgotTriggerRef}
              type="button"
              onClick={openForgotPassword}
              className="rounded-sm text-[13px] font-medium text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Forgot password?
            </button>
          </div>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            className={cn(errors.password && errorInputClass)}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            {...register("password")}
          />
          <FieldError id="login-password-error" message={errors.password?.message} />
        </div>

        <label className="flex w-fit cursor-pointer select-none items-center gap-2.5 text-[13px] text-slate-600">
          <span className="relative flex h-[18px] w-[18px] shrink-0">
            <input
              type="checkbox"
              className="peer h-full w-full cursor-pointer appearance-none rounded-[5px] border border-slate-300 bg-white transition-colors checked:border-navy-950 checked:bg-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              {...register("remember")}
            />
            <Check
              className="pointer-events-none absolute inset-0 m-auto h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              aria-hidden
            />
          </span>
          Remember me
        </label>

        <div aria-live="polite" className="sr-only">
          {isSubmitting ? "Signing in, please wait." : ""}
        </div>

        {credentialsError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] leading-snug text-red-700"
          >
            <AlertCircle className="mt-px h-4 w-4 shrink-0" aria-hidden />
            <span>{credentialsError}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-lg bg-navy-950 text-[15px] hover:bg-navy-800 active:bg-navy-900"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="rounded-lg border border-slate-200/90 bg-white px-3.5 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-slate-700">Demo access</p>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="rounded-sm text-xs font-semibold text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Fill demo credentials
            </button>
          </div>
          <p className="mt-1 break-all font-mono text-[11px] leading-relaxed text-slate-500">
            {primaryDemoAccount.email} · {DEMO_PASSWORD}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Frontend demo — no real authentication or data transfer.
          </p>
        </div>
      </form>

      <ForgotPasswordDialog
        open={forgotOpen}
        onClose={closeForgotPassword}
        defaultEmail={forgotEmail}
      />
    </>
  );
}
