"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Receipt, AlertCircle, Wallet, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useStore } from "@/lib/store";
import { formatINR, formatDate, formatNumber } from "@/lib/formatters";
import { studentName, monthlyFeeCollection } from "@/data/seed";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDesc } from "@/components/ui/ui";
import { PageHeader, KpiCard, StatusBadge, TableSkeleton, DemoNote } from "@/components/shared/shared";
import { PaymentDialog } from "@/components/finance/payment-dialog";

export default function FeesPage() {
  const { payments, charges, hydrated } = useStore();
  const [payOpen, setPayOpen] = useState(false);

  if (!hydrated) return <TableSkeleton />;

  const outstanding = charges.filter((c) => c.status !== "paid").reduce((a, c) => a + (c.amount - c.paidAmount), 0);
  const overdue = charges.filter((c) => c.status === "overdue");
  const recent = payments.slice(0, 5);
  const outstandingList = charges.filter((c) => c.status !== "paid").slice(0, 6);

  return (
    <div>
      <PageHeader
        title="Fees & Finance"
        subtitle="Collection overview · INR · demo data"
        actions={
          <>
            <Link href="/fees/structures"><Button variant="outline">Fee structures</Button></Link>
            <Link href="/fees/transactions"><Button variant="outline"><Receipt className="h-4 w-4" /> Transactions</Button></Link>
            <Button onClick={() => setPayOpen(true)}><Plus className="h-4 w-4" /> Record payment</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Collection this month" value={formatINR(690000)} hint="Oct 2025 · mock" delta="+6.2%" icon={<Wallet className="h-4 w-4" />} />
        <KpiCard label="Total outstanding" value={formatINR(outstanding)} hint={`${formatNumber(charges.filter((c) => c.status !== "paid").length)} open charges`} icon={<AlertCircle className="h-4 w-4" />} />
        <KpiCard label="Payments received" value={formatNumber(payments.length)} hint="All time (demo)" icon={<Receipt className="h-4 w-4" />} />
        <KpiCard label="Overdue charges" value={formatNumber(overdue.length)} hint="Needs follow-up" icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      <div className="grid xl:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader><CardTitle>Collection trend</CardTitle><CardDesc>Monthly · mock analytics</CardDesc></CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyFeeCollection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(v: number) => `₹${Math.round(v / 100000)}L`} width={56} />
                  <Tooltip formatter={(v) => [formatINR(Number(v)), "Collected"]} />
                  <Bar dataKey="collected" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent transactions</CardTitle><CardDesc>Latest receipts</CardDesc></CardHeader>
          <CardContent className="space-y-3">
            {recent.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3">
                <div><p className="text-[13px] font-medium">{p.receiptNumber} · {studentName(p.studentId)}</p><p className="text-xs text-slate-500">{formatDate(p.date)} · {p.method}</p></div>
                <div className="text-right"><p className="text-[13px] font-semibold tabular-nums">{formatINR(p.amount)}</p><StatusBadge status={p.status} /></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle>Outstanding fees</CardTitle><CardDesc>Top open charges requiring follow-up</CardDesc></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead><tr className="text-left text-xs text-slate-500 uppercase"><th className="px-3 py-2">Student</th><th className="px-3 py-2">Category</th><th className="px-3 py-2">Due</th><th className="px-3 py-2">Balance</th><th className="px-3 py-2">Status</th></tr></thead>
              <tbody>
                {outstandingList.map((c) => (
                  <tr key={c.id} className="border-t border-slate-100">
                    <td className="px-3 py-2.5 font-medium">{studentName(c.studentId)}</td>
                    <td className="px-3 py-2.5">{c.category}</td>
                    <td className="px-3 py-2.5">{formatDate(c.dueDate)}</td>
                    <td className="px-3 py-2.5 tabular-nums font-medium">{formatINR(c.amount - c.paidAmount)}</td>
                    <td className="px-3 py-2.5"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3"><DemoNote /></div>
        </CardContent>
      </Card>

      <PaymentDialog open={payOpen} onClose={() => setPayOpen(false)} />
    </div>
  );
}
