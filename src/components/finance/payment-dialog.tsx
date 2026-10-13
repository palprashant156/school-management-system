"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@/lib/store";
import { studentName } from "@/data/seed";
import { formatINR } from "@/lib/formatters";
import { Button, Dialog, Input, Label, Select, FieldError } from "@/components/ui/ui";

const schema = z.object({
  studentId: z.string().min(1, "Select student"),
  amount: z.number({ error: "Amount must be positive" }).min(1, "Amount must be positive"),
  date: z.string().min(1, "Payment date required"),
  method: z.enum(["Cash", "UPI", "Bank Transfer", "Card", "Other"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type V = z.infer<typeof schema>;

export function PaymentDialog({ open, onClose, presetStudent }: { open: boolean; onClose: () => void; presetStudent?: string }) {
  const { students, charges, payments, addPayment, toast } = useStore();
  const [receipt, setReceipt] = useState<string | null>(null);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<V>({
    resolver: zodResolver(schema),
    defaultValues: { date: "2025-10-13", method: "UPI", studentId: presetStudent ?? "" },
  });

  useEffect(() => {
    if (open) {
      reset({ date: new Date().toISOString().slice(0, 10), method: "UPI", studentId: presetStudent ?? "" });
      setReceipt(null);
    }
  }, [open, presetStudent, reset]);

  const studentId = watch("studentId");
  const amount = watch("amount");

  const dues = useMemo(() => charges.filter((c) => c.studentId === studentId && c.status !== "paid"), [charges, studentId]);
  const totalDue = dues.reduce((a, c) => a + (c.amount - c.paidAmount), 0);

  function onSubmit(v: V) {
    if (v.amount > totalDue && totalDue > 0) {
      toast({ kind: "error", title: "Amount exceeds dues", desc: `Outstanding is ${formatINR(totalDue)} for this student.` });
      return;
    }
    // allocate oldest-first
    let remaining = v.amount;
    const updates = dues.map((d) => {
      const bal = d.amount - d.paidAmount;
      const pay = Math.min(bal, remaining);
      remaining -= pay;
      const paidAmount = d.paidAmount + pay;
      return { id: d.id, paidAmount, status: (paidAmount >= d.amount ? "paid" : paidAmount > d.paidAmount - pay || paidAmount > 0 ? "partial" : d.status) as "paid" | "partial" | "pending" | "overdue" };
    });
    const num = `RCP-2025-${String(payments.length + 1).padStart(4, "0")}-${Math.floor(Math.random() * 90 + 10)}`;
    addPayment(
      {
        id: `pay-${Date.now()}`,
        receiptNumber: num,
        studentId: v.studentId,
        date: v.date,
        amount: v.amount,
        method: v.method,
        status: "success",
        reference: v.reference || undefined,
        notes: v.notes || undefined,
      },
      updates
    );
    setReceipt(num);
    toast({ kind: "success", title: "Payment recorded (demo)", desc: `${num} · ${formatINR(v.amount)} · not a real gateway transaction.` });
  }

  function close() {
    setReceipt(null);
    reset({ date: "2025-10-13", method: "UPI", studentId: presetStudent ?? "" });
    onClose();
  }

  return (
    <Dialog open={open} onClose={close} title="Record payment" desc="Demo receipt — no real money moves" wide>
      {receipt ? (
        <div className="text-center py-4">
          <p className="text-sm text-slate-500">Demo receipt generated</p>
          <p className="text-2xl font-semibold mt-1">{receipt}</p>
          <p className="text-sm mt-1">{studentName(studentId)} · {formatINR(amount || 0)}</p>
          <p className="text-xs text-slate-500 mt-2">Clearly marked demo receipt · mock receipt number</p>
          <Button className="mt-4" onClick={close}>Done</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label htmlFor="ps">Student *</Label>
            <Select id="ps" {...register("studentId")}>
              <option value="">Select student</option>
              {students.filter((s) => s.status === "active").map((s) => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName} · {s.admissionNumber}</option>
              ))}
            </Select>
            <FieldError message={errors.studentId?.message} />
            {studentId && <p className="text-xs mt-1 text-slate-600">Outstanding: <strong>{formatINR(totalDue)}</strong> across {dues.length} charge(s)</p>}
          </div>
          <div>
            <Label htmlFor="pa">Amount received (₹) *</Label>
            <Input id="pa" type="number" min={1} {...register("amount", { valueAsNumber: true })} placeholder="15000" />
            <FieldError message={errors.amount?.message} />
          </div>
          <div>
            <Label htmlFor="pd">Payment date *</Label>
            <Input id="pd" type="date" {...register("date")} />
            <FieldError message={errors.date?.message} />
          </div>
          <div>
            <Label htmlFor="pm">Payment method *</Label>
            <Select id="pm" {...register("method")}>
              <option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Card</option><option>Other</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="pr">Reference number</Label>
            <Input id="pr" {...register("reference")} placeholder="UPI ref / txn id (optional)" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="pn">Notes</Label>
            <Input id="pn" {...register("notes")} placeholder="Optional" />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={close}>Cancel</Button>
            <Button type="submit">Record payment</Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
