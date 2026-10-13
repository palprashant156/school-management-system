"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Bell,
  GraduationCap,
  ChevronDown,
  LogOut,
  Building2,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { schoolNav, platformNav, isActive } from "@/lib/navigation";
import { useStore, StoreProvider } from "@/lib/store";
import { Avatar } from "@/components/ui/ui";
import { ACADEMIC_YEARS } from "@/data/seed";

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { school } = useStore();
  const isPlatform = pathname.startsWith("/platform");

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-4">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onNavigate}>
          <span className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[15px] font-semibold text-slate-900 leading-none">SchoolOS</span>
            <span className="block text-[11px] text-slate-500 mt-1 leading-none">School Management</span>
          </span>
        </Link>
        {!isPlatform && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Current school</p>
            <p className="text-[13px] font-semibold text-slate-900 truncate mt-0.5">{school.name}</p>
            <p className="text-[11px] text-slate-500">{school.code} · {school.city}</p>
          </div>
        )}
        {isPlatform && (
          <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5">
            <p className="text-[11px] font-medium text-indigo-600 uppercase tracking-wide flex items-center gap-1">
              <Building2 className="h-3 w-3" /> Platform admin
            </p>
            <p className="text-[13px] font-semibold text-indigo-900 mt-0.5">All schools</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5" aria-label="Primary">
        {(isPlatform ? platformNav : schoolNav).map((g) => (
          <div key={g.title}>
            <p className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{g.title}</p>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = isActive(pathname, item);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                        active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {!isPlatform && (
          <div>
            <p className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Platform</p>
            <Link
              href="/platform"
              onClick={onNavigate}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              <Building2 className="h-[18px] w-[18px]" /> Platform admin
            </Link>
          </div>
        )}
        {isPlatform && (
          <div>
            <p className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">School</p>
            <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100">
              <GraduationCap className="h-[18px] w-[18px]" /> Back to school
            </Link>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-slate-200">
        <UserFooter />
      </div>
    </div>
  );
}

function UserFooter() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { school } = useStore();
  return (
    <div className="relative">
      {open && (
        <>
          <button aria-label="Close menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full mb-2 left-0 right-0 z-20 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5">
            <button
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              onClick={() => { setOpen(false); router.push("/settings/users"); }}
            >
              Profile & users
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
              onClick={() => { setOpen(false); router.push("/login"); }}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </>
      )}
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-slate-100 text-left">
        <Avatar name="Priya Nair" className="h-8 w-8 text-xs" />
        <span className="flex-1 min-w-0">
          <span className="block text-[13px] font-semibold text-slate-900 truncate">Priya Nair</span>
          <span className="block text-[11px] text-slate-500 truncate">Administrator · {school.code}</span>
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
    </div>
  );
}

function Header({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { academicYear, setAcademicYear, school } = useStore();
  const [q, setQ] = useState("");

  const title = pathname === "/" ? "Home" : pathname.split("/").filter(Boolean).map((s) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())).join(" / ") || "Dashboard";

  return (
    <header className="h-16 shrink-0 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center gap-3 px-4 sm:px-6 sticky top-0 z-30">
      <button className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100" onClick={onMenu} aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] sm:text-sm font-semibold text-slate-900 truncate">{title}</p>
        <p className="text-[11px] text-slate-500 hidden sm:block">{school.name} · {academicYear}</p>
      </div>
      <div className="hidden md:flex items-center gap-2">
        <select
          aria-label="Academic year"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-600"
        >
          {ACADEMIC_YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <form
        className="hidden sm:block relative"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) router.push(`/students?q=${encodeURIComponent(q.trim())}`);
        }}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search students…"
          aria-label="Global search"
          className="h-9 w-52 lg:w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600"
        />
      </form>
      <Link href="/announcements" className="relative p-2 rounded-lg hover:bg-slate-100" aria-label="Notifications, 3 unread">
        <Bell className="h-5 w-5 text-slate-600" />
        <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-semibold flex items-center justify-center">3</span>
      </Link>
      <Avatar name="Priya Nair" className="h-8 w-8 text-xs hidden sm:inline-flex" />
    </header>
  );
}

function Toasts() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="fixed bottom-4 right-4 z-[60] space-y-2 w-[calc(100%-2rem)] max-w-sm" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="bg-slate-900 text-white rounded-xl shadow-lg px-4 py-3 flex items-start gap-2.5">
          {t.kind === "success" ? <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5" /> : t.kind === "error" ? <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" /> : <Info className="h-4 w-4 text-blue-300 mt-0.5" />}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold">{t.title}</p>
            {t.desc && <p className="text-xs text-slate-300 mt-0.5">{t.desc}</p>}
          </div>
          <button onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <StoreProvider>
      <div className="min-h-screen flex bg-slate-50">
        <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-white border-r border-slate-200 sticky top-0 h-screen">
          <Suspense fallback={<div className="p-4 text-sm text-slate-400">Loading…</div>}>
            <Sidebar />
          </Suspense>
        </aside>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button aria-label="Close navigation" className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white shadow-xl flex flex-col">
              <div className="flex justify-end p-2">
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 rounded-lg hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <Suspense fallback={<div className="p-4 text-sm text-slate-400">Loading…</div>}>
                  <Sidebar onNavigate={() => setMobileOpen(false)} />
                </Suspense>
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">
          <Suspense fallback={<div className="h-16 border-b border-slate-200 bg-white" />}>
            <Header onMenu={() => setMobileOpen(true)} />
          </Suspense>
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1200px] w-full mx-auto">{children}</main>
          <footer className="px-6 py-4 text-center text-xs text-slate-400">
            SchoolOS demo · Mock data stored locally · No backend connected
          </footer>
        </div>
        <Toasts />
      </div>
    </StoreProvider>
  );
}
