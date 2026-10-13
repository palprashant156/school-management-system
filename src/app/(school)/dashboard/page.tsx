"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Users, UserCheck, Wallet, AlertCircle, Plus, ClipboardCheck, Megaphone, CalendarDays } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid,
} from "recharts";
import { useStore } from "@/lib/store";
import { formatINR, formatNumber, formatDate } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDesc } from "@/components/ui/ui";
import { PageHeader, KpiCard, StatusBadge, DemoNote, TableSkeleton } from "@/components/shared/shared";
import { monthlyFeeCollection, attendanceTrend, schoolEvents } from "@/data/seed";

function greetingFor(h: number): string {
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const FALLBACK_DATE = "2025-10-13";

export default function DashboardPage() {
  const { students, payments, charges, hydrated, school, academicYear } = useStore();
  const [now, setNow] = useState<{ hour: number; iso: string } | null>(null);

  useEffect(() => {
    const d = new Date();
    setNow({ hour: d.getHours(), iso: d.toISOString().slice(0, 10) });
  }, []);

  const stats = useMemo(() => {
    const total = students.filter((s) => s.academicYear === academicYear).length || students.length;
    const present = Math.round(total * 0.93);
    const monthCollected = payments.filter((p) => p.status === "success").reduce((a, p) => a + p.amount, 0);
    const outstanding = charges.filter((c) => c.status !== "paid").reduce((a, c) => a + (c.amount - c.paidAmount), 0);
    return { total, present, monthCollected, outstanding };
  }, [students, payments, charges, academicYear]);

  if (!hydrated) return <TableSkeleton rows={8} />;

  const recentPayments = payments.slice(0, 5);
  const attention = students.slice(0, 4).map((s, i) => ({
    student: s,
    reason: i % 2 === 0 ? "Tuition fee overdue · ₹15,000" : "Guardian contact incomplete",
  }));

  const dateISO = now?.iso ?? FALLBACK_DATE;
  const greet = greetingFor(now?.hour ?? 9);

  return (
    <div>
      <PageHeader
        title={`${greet}, Admin`}
        subtitle={`Here's what's happening at ${school.name} today · ${formatDate(dateISO, "EEEE, dd MMM yyyy")}`}
        actions={
          <>
            <Link href="/students/new"><Button><Plus className="h-4 w-4" /> Add Student</Button></Link>
            <Link href="/attendance"><Button variant="outline"><ClipboardCheck className="h-4 w-4" /> Mark Attendance</Button></Link>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total Students" value={formatNumber(stats.total || 1240)} hint="Across all classes" delta="+2.1% vs last term" icon={<Users className="h-4 w-4" />} />
        <KpiCard label="Present Today" value={formatNumber(stats.present)} hint={`${Math.round((stats.present / Math.max(1, stats.total)) * 100)}% attendance`} delta="Mock analytics" icon={<UserCheck className="h-4 w-4" />} />
        <KpiCard label="Fee Collection This Month" value={formatINR(1420000)} hint="Sep–Oct cycle" delta="+8.4% vs Aug" icon={<Wallet className="h-4 w-4" />} />
        <KpiCard label="Outstanding Fees" value={formatINR(stats.outstanding || 386000)} hint="Across 214 students" delta="Needs follow-up" icon={<AlertCircle className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly fee collection</CardTitle>
            <CardDesc>Mock analytics · INR · 2025-26</CardDesc>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyFeeCollection} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(v: number) => `₹${Math.round(v / 100000)}L`} width={56} />
                  <Tooltip formatter={(v) => [formatINR(Number(v)), "Collected"]} />
                  <Bar dataKey="collected" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance trend</CardTitle>
            <CardDesc>Present % · last 6 school days · mock data</CardDesc>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis domain={[60, 100]} tickLine={false} axisLine={false} width={40} />
                  <Tooltip formatter={(v) => [`${v}%`, "Present"]} />
                  <Line type="monotone" dataKey="present" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s attendance</CardTitle>
            <CardDesc>Class 5-A · 38 students</CardDesc>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 text-center">
              {[
                ["Present", "34", "text-emerald-700 bg-emerald-50 border-emerald-200"],
                ["Absent", "2", "text-red-700 bg-red-50 border-red-200"],
                ["Not marked", "2", "text-slate-600 bg-slate-100 border-slate-200"],
              ].map(([l, v, cls]) => (
                <div key={l} className={`flex-1 rounded-lg border px-2 py-3 ${cls}`}>
                  <p className="text-xl font-semibold">{v}</p>
                  <p className="text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
            <Link href="/attendance"><Button variant="outline" className="w-full mt-4">Open attendance</Button></Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent fee transactions</CardTitle>
            <CardDesc>Latest 5 receipts</CardDesc>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-slate-900 truncate">{p.receiptNumber}</p>
                  <p className="text-xs text-slate-500">{formatDate(p.date)} · {p.method}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-semibold tabular-nums">{formatINR(p.amount)}</p>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
            <Link href="/fees/transactions"><Button variant="ghost" className="w-full">View all transactions</Button></Link>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {schoolEvents.slice(0, 4).map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <span className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <CalendarDays className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium truncate">{e.title}</p>
                    <p className="text-xs text-slate-500">{formatDate(e.date)} · {e.type}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Link href="/students/new"><Button variant="outline" className="w-full"><Plus className="h-4 w-4" /> Student</Button></Link>
              <Link href="/attendance"><Button variant="outline" className="w-full"><ClipboardCheck className="h-4 w-4" /> Attendance</Button></Link>
              <Link href="/fees"><Button variant="outline" className="w-full"><Wallet className="h-4 w-4" /> Collect fee</Button></Link>
              <Link href="/announcements"><Button variant="outline" className="w-full"><Megaphone className="h-4 w-4" /> Announce</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Students requiring attention</CardTitle>
          <CardDesc>Overdue fees or incomplete records · demo data</CardDesc>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {attention.map(({ student, reason }) => (
              <Link key={student.id} href={`/students/${student.id}`} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 hover:border-indigo-300 hover:bg-indigo-50/40">
                <span className="h-9 w-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                  {student.firstName[0]}{student.lastName[0]}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium truncate">{student.firstName} {student.lastName} · {student.admissionNumber}</span>
                  <span className="block text-xs text-slate-500 truncate">{reason}</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4"><DemoNote /></div>
        </CardContent>
      </Card>
    </div>
  );
}
