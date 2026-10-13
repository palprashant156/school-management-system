"use client";

import React from "react";
import { Search, Inbox, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/formatters";
import { Badge, Button, Card, CardContent, Input, Skeleton, Dialog } from "@/components/ui/ui";

/* ---------- Page header ---------- */
export function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
      <div>
        {breadcrumb && <p className="text-xs text-slate-400 mb-1">{breadcrumb}</p>}
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/* ---------- KPI card ---------- */
export function KpiCard({
  label,
  value,
  hint,
  delta,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <p className="text-[13px] font-medium text-slate-500">{label}</p>
          {icon && <span className="text-slate-400">{icon}</span>}
        </div>
        <p className="text-[26px] font-semibold tracking-tight text-slate-900 mt-1.5">{value}</p>
        <div className="flex items-center gap-2 mt-1">
          {delta && <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">{delta}</span>}
          {hint && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------- Status badges ---------- */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: React.ComponentProps<typeof Badge>["tone"]; label: string }> = {
    active: { tone: "green", label: "Active" },
    inactive: { tone: "slate", label: "Inactive" },
    pending: { tone: "amber", label: "Pending" },
    alumni: { tone: "blue", label: "Alumni" },
    present: { tone: "green", label: "Present" },
    absent: { tone: "red", label: "Absent" },
    late: { tone: "amber", label: "Late" },
    excused: { tone: "blue", label: "Excused" },
    unmarked: { tone: "slate", label: "Not marked" },
    paid: { tone: "green", label: "Paid" },
    overdue: { tone: "red", label: "Overdue" },
    partial: { tone: "amber", label: "Partial" },
    success: { tone: "green", label: "Success" },
    failed: { tone: "red", label: "Failed" },
    refunded: { tone: "slate", label: "Refunded" },
    draft: { tone: "slate", label: "Draft" },
    published: { tone: "green", label: "Published" },
    scheduled: { tone: "blue", label: "Scheduled" },
    "on-leave": { tone: "amber", label: "On leave" },
    resigned: { tone: "slate", label: "Resigned" },
    trial: { tone: "amber", label: "Trial" },
    suspended: { tone: "red", label: "Suspended" },
    archived: { tone: "slate", label: "Archived" },
    invited: { tone: "blue", label: "Invited" },
    disabled: { tone: "slate", label: "Disabled" },
  };
  const key = status.toLowerCase();
  const v = map[key] ?? { tone: "slate" as const, label: status };
  return (
    <Badge tone={v.tone}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {v.label}
    </Badge>
  );
}

/* ---------- Search ---------- */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-9" aria-label={placeholder} />
    </div>
  );
}

/* ---------- Empty / Loading / Error ---------- */
export function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <span className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        {icon ?? <Inbox className="h-5 w-5" />}
      </span>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {desc && <p className="text-[13px] text-slate-500 mt-1 max-w-sm">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full" />
      ))}
    </div>
  );
}

export function LoadingInline({ label = "Loading…" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-500">
      <Loader2 className="h-4 w-4 animate-spin" /> {label}
    </span>
  );
}

/* ---------- Pagination ---------- */
export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100">
      <p className="text-xs text-slate-500">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Previous
        </Button>
        <span className="text-xs text-slate-600 px-2">
          Page {page} of {Math.max(1, totalPages)}
        </span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

/* ---------- Confirm dialog ---------- */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  desc,
  confirmLabel = "Confirm",
  danger,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  desc?: string;
  confirmLabel?: string;
  danger?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} desc={desc}>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}

/* ---------- Currency ---------- */
export function Currency({ amount }: { amount: number }) {
  return <span className="font-medium tabular-nums">{formatINR(amount)}</span>;
}

/* ---------- Data table shell ---------- */
export function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[720px]">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={cn("text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-4 py-3 border-b border-slate-200 bg-slate-50/60", className)}>
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 border-b border-slate-100 text-slate-800 align-middle", className)}>{children}</td>;
}

/* ---------- Demo label ---------- */
export function DemoNote({ text = "Demo data — stored locally in your browser, no backend connected." }: { text?: string }) {
  return (
    <p className="text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2">
      {text}
    </p>
  );
}
