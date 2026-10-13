"use client";

import { useMemo, useState } from "react";
import { Plus, Download } from "lucide-react";
import { useStore } from "@/lib/store";
import { studentName } from "@/data/seed";
import { formatINR, formatDate, downloadCSV } from "@/lib/formatters";
import { Button, Card, Select, Input } from "@/components/ui/ui";
import { PageHeader, SearchInput, StatusBadge, Pagination, EmptyState, TableShell, Th, Td, TableSkeleton } from "@/components/shared/shared";
import { PaymentDialog } from "@/components/finance/payment-dialog";

export default function TransactionsPage() {
  const { payments, hydrated } = useStore();
  const [q, setQ] = useState("");
  const [method, setMethod] = useState("all");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [payOpen, setPayOpen] = useState(false);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return payments.filter((p) =>
      (!n || p.receiptNumber.toLowerCase().includes(n) || studentName(p.studentId).toLowerCase().includes(n)) &&
      (method === "all" || p.method === method) &&
      (status === "all" || p.status === status) &&
      (!from || p.date >= from) &&
      (!to || p.date <= to)
    );
  }, [payments, q, method, status, from, to]);

  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (!hydrated) return <TableSkeleton />;

  function exportCSV() {
    downloadCSV("fee-transactions.csv", filtered.map((p) => ({
      receipt: p.receiptNumber,
      student: studentName(p.studentId),
      date: p.date,
      amount: p.amount,
      method: p.method,
      status: p.status,
    })));
  }

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle={`${filtered.length} receipts · demo data`}
        breadcrumb="Fees / Transactions"
        actions={<><Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4" /> Export CSV</Button><Button onClick={() => setPayOpen(true)}><Plus className="h-4 w-4" /> Record payment</Button></>}
      />
      <Card>
        <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
          <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Receipt or student…" className="lg:col-span-2" />
          <Select aria-label="Method" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="all">All methods</option><option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Card</option><option>Other</option>
          </Select>
          <Select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option><option value="success">Success</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
          </Select>
          <span className="flex gap-2">
            <Input aria-label="From date" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input aria-label="To date" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </span>
        </div>
        {rows.length === 0 ? <EmptyState title="No transactions" desc="Adjust filters or record a payment." /> : (
          <>
            <TableShell>
              <thead><tr><Th>Receipt</Th><Th>Student</Th><Th>Date</Th><Th>Amount</Th><Th>Method</Th><Th>Status</Th></tr></thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <Td className="font-medium tabular-nums">{p.receiptNumber}</Td>
                    <Td>{studentName(p.studentId)}</Td>
                    <Td>{formatDate(p.date)}</Td>
                    <Td className="tabular-nums font-medium">{formatINR(p.amount)}</Td>
                    <Td>{p.method}</Td>
                    <Td><StatusBadge status={p.status} /></Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
            <Pagination page={page} totalPages={Math.max(1, Math.ceil(filtered.length / pageSize))} total={filtered.length} pageSize={pageSize} onPage={setPage} />
          </>
        )}
      </Card>
      <PaymentDialog open={payOpen} onClose={() => setPayOpen(false)} />
    </div>
  );
}
