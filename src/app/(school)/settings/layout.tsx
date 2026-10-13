"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/settings", label: "Overview" },
  { href: "/settings/school", label: "School" },
  { href: "/settings/academic", label: "Academic" },
  { href: "/settings/users", label: "Users" },
  { href: "/settings/roles", label: "Roles & Permissions" },
  { href: "/settings/subscription", label: "Subscription" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500">School configuration · demo data stored locally</p>
      </div>
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 mb-5">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap",
                active ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}
