"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { className } from "@/data/seed";
import { formatINR } from "@/lib/formatters";
import { ACADEMIC_YEARS } from "@/data/seed";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDesc, Input, Label, Select, Dialog } from "@/components/ui/ui";
import { PageHeader, TableSkeleton, DemoNote } from "@/components/shared/shared";

const CATS = ["Tuition Fee", "Admission Fee", "Examination Fee", "Transport Fee", "Activity Fee"];

export default function FeeStructuresPage() {
  const { classes, feeStructures, academicYear, upsertFeeStructure, hydrated, toast } = useStore();
  const [year, setYear] = useState(academicYear);
  const [classId, setClassId] = useState(classes[0]?.id ?? "c-1");
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<{ name: string; amount: number }[]>([]);

  const current = useMemo(
    () => feeStructures.find((f) => f.academicYear === year && f.classId === classId),
    [feeStructures, year, classId]
  );
  const total = (current?.categories ?? []).reduce((a, c) => a + c.amount, 0);

  if (!hydrated) return <TableSkeleton />;

  function startEdit() {
    setRows(current ? [...current.categories] : CATS.map((name) => ({ name, amount: 0 })));
    setOpen(true);
  }

  function save() {
    if (rows.some((r) => !r.name || r.amount < 0 || Number.isNaN(r.amount))) {
      toast({ kind: "error", title: "Check amounts", desc: "Category names required, amounts must be ≥ 0." });
      return;
    }
    upsertFeeStructure({ id: current?.id ?? `fs-${year}-${classId}`, academicYear: year, classId, categories: rows });
    toast({ kind: "success", title: "Fee structure saved", desc: `${className(classId)} · ${year} (demo).` });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Fee Structures"
        subtitle="Per class, per academic year · INR"
        breadcrumb="Fees / Structures"
        actions={<Button onClick={startEdit}><Plus className="h-4 w-4" /> {current ? "Edit structure" : "Create structure"}</Button>}
      />
      <Card className="mb-4">
        <CardContent className="pt-4 flex flex-col sm:flex-row gap-3">
          <div>
            <Label htmlFor="fy">Academic year</Label>
            <Select id="fy" value={year} onChange={(e) => setYear(e.target.value)} className="sm:w-44">
              {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="fc">Class</Label>
            <Select id="fc" value={classId} onChange={(e) => setClassId(e.target.value)} className="sm:w-52">
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{className(classId)} · {year}</CardTitle><CardDesc>{current ? `${current.categories.length} categories · Total ${formatINR(total)}` : "No structure defined yet"}</CardDesc></CardHeader>
        <CardContent>
          {!current ? (
            <p className="text-sm text-slate-500">No fee structure for this class/year. Create one to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead><tr className="text-left text-xs uppercase text-slate-500"><th className="px-3 py-2">Category</th><th className="px-3 py-2 text-right">Amount</th></tr></thead>
                <tbody>
                  {current.categories.map((c) => (
                    <tr key={c.name} className="border-t border-slate-100">
                      <td className="px-3 py-2.5">{c.name}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums font-medium">{formatINR(c.amount)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-slate-200 bg-slate-50/60 font-semibold">
                    <td className="px-3 py-2.5">Total per student</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{formatINR(total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-3"><DemoNote /></div>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} title={`${current ? "Edit" : "Create"} fee structure`} desc={`${className(classId)} · ${year}`} wide>
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_140px_40px] gap-2 items-center">
              <Input aria-label={`Category ${i + 1}`} value={r.name} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
              <Input aria-label={`Amount ${i + 1}`} type="number" min={0} value={r.amount} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, amount: Number(e.target.value) } : x))} />
              <Button variant="ghost" size="icon" aria-label="Remove row" onClick={() => setRows(rows.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setRows([...rows, { name: "", amount: 0 }])}><Plus className="h-3.5 w-3.5" /> Add category</Button>
          <p className="text-sm font-medium">Total: {formatINR(rows.reduce((a, c) => a + (Number(c.amount) || 0), 0))}</p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save structure</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
