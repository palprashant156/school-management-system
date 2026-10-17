import type { Metadata } from "next";
import { BrandLockup, BrandPanel } from "@/components/auth/brand-panel";
import { LoginForm } from "@/components/auth/login-form";
import { AuthFooter } from "@/components/auth/auth-footer";

export const metadata: Metadata = {
  title: "Sign in — SchoolOS",
  description: "Sign in to your SchoolOS school workspace.",
};

export default function LoginPage() {
  return (
    <div className="min-h-svh bg-canvas lg:grid lg:grid-cols-[56fr_44fr]">
      <BrandPanel />

      <div className="flex min-h-svh flex-col lg:min-h-0">
        <main className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-12 xl:px-20">
          <div className="mx-auto w-full max-w-[400px]">
            <div className="mb-10 lg:hidden">
              <BrandLockup onDark={false} />
            </div>

            <header>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                School administration portal
              </p>
              <h1 className="mt-3 text-[27px] font-semibold tracking-[-0.015em] text-slate-900 sm:text-[29px]">
                Welcome back
              </h1>
              <p className="mt-2 text-[15px] text-slate-500">Sign in to your school workspace.</p>
            </header>

            <LoginForm />
          </div>
        </main>

        <AuthFooter />
      </div>
    </div>
  );
}
