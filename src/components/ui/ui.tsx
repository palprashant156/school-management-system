"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/formatters";

type BtnVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
type BtnSize = "sm" | "md" | "lg" | "icon";

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: BtnSize }) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
  const variants: Record<BtnVariant, string> = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
  };
  const sizes: Record<BtnSize, string> = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-9 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
    icon: "h-9 w-9",
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-white border border-slate-200 rounded-xl shadow-[0_1px_2px_rgba(15,23,42,0.04)]", className)} {...props} />;
}
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pt-5 pb-0", className)} {...props} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-[15px] font-semibold text-slate-900", className)} {...props} />;
}
export function CardDesc({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-[13px] text-slate-500 mt-0.5", className)} {...props} />;
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("block text-[13px] font-medium text-slate-700 mb-1.5", className)} {...props} />;
}

export function Input({ className, ...props }: React.ComponentPropsWithRef<"input">) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 min-h-[96px]",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600",
        className
      )}
      {...props}
    />
  );
}

export function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return <p id={id} className="text-xs text-red-600 mt-1">{message}</p>;
}

export function Badge({
  tone = "slate",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: "slate" | "green" | "amber" | "red" | "blue" | "indigo" | "purple" }) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-[13px] font-semibold",
        className
      )}
    >
      {initials(name)}
    </span>
  );
}

export function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-slate-200" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
            value === t.id ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Dialog({
  open,
  onClose,
  title,
  desc,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  desc?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  React.useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Close dialog" className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div
        className={cn(
          "relative w-full bg-white rounded-t-2xl sm:rounded-xl border border-slate-200 shadow-xl max-h-[92vh] overflow-y-auto",
          wide ? "sm:max-w-2xl" : "sm:max-w-lg"
        )}
      >
        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
          <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>
          {desc && <p className="text-[13px] text-slate-500 mt-0.5">{desc}</p>}
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-slate-200/70", className)} />;
}

export function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px bg-slate-200", className)} />;
}
