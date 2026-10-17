"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button, Dialog, FieldError, Input, Label } from "@/components/ui/ui";
import { resetRequestSchema, type ResetRequestValues } from "@/lib/validations/auth";
import { requestPasswordReset } from "@/lib/mock-auth";

export function ForgotPasswordDialog({
  open,
  onClose,
  defaultEmail,
}: {
  open: boolean;
  onClose: () => void;
  defaultEmail: string;
}) {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetRequestValues>({
    resolver: zodResolver(resetRequestSchema),
    defaultValues: { email: defaultEmail },
  });

  useEffect(() => {
    if (open) {
      reset({ email: defaultEmail });
      setSentTo(null);
    }
  }, [open, defaultEmail, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await requestPasswordReset(values.email);
    setSentTo(values.email);
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Reset your password"
      desc={sentTo ? undefined : "Enter your work email to see how recovery works."}
    >
      {sentTo ? (
        <div>
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Reset link requested</p>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                In the production app, a secure reset link would be sent to{" "}
                <span className="font-medium text-slate-700">{sentTo}</span>. This frontend demo
                does not send real email.
              </p>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Button type="button" onClick={onClose}>
              Back to sign in
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <Label htmlFor="reset-email">Work email</Label>
          <Input
            id="reset-email"
            type="email"
            autoComplete="email"
            placeholder="name@school.edu.in"
            autoFocus
            className="h-11 text-[15px]"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "reset-email-error" : "reset-email-hint"}
            {...register("email")}
          />
          <FieldError id="reset-email-error" message={errors.email?.message} />
          <p id="reset-email-hint" className="mt-1 text-xs text-slate-400">
            Frontend demo — no real email will be sent.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
