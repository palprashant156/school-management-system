"use client";

import { Check, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDesc } from "@/components/ui/ui";
import { DemoNote } from "@/components/shared/shared";

const ROLES = ["School Owner", "Principal", "Administrator", "Accountant", "Teacher"];
const PERMS = ["View", "Create", "Edit", "Delete", "Export"];
const MATRIX: Record<string, Record<string, boolean | "partial">> = {
  "School Owner": { View: true, Create: true, Edit: true, Delete: true, Export: true },
  Principal: { View: true, Create: true, Edit: true, Delete: false, Export: true },
  Administrator: { View: true, Create: true, Edit: true, Delete: false, Export: true },
  Accountant: { View: true, Create: true, Edit: true, Delete: false, Export: true },
  Teacher: { View: true, Create: false, Edit: "partial", Delete: false, Export: false },
};

export default function RolesPage() {
  return (
    <Card className="max-w-4xl">
      <CardHeader><CardTitle>Roles & permissions</CardTitle><CardDesc>Frontend demonstration only — not enforced by a backend</CardDesc></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead><tr><th className="text-left px-3 py-2 text-xs uppercase text-slate-500">Role</th>{PERMS.map((p) => <th key={p} className="text-center px-3 py-2 text-xs uppercase text-slate-500">{p}</th>)}</tr></thead>
            <tbody>
              {ROLES.map((r) => (
                <tr key={r} className="border-t border-slate-100">
                  <td className="px-3 py-2.5 font-medium">{r}</td>
                  {PERMS.map((p) => {
                    const v = MATRIX[r][p];
                    return (
                      <td key={p} className="px-3 py-2.5 text-center">
                        {v === true ? <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><Check className="h-3.5 w-3.5" /></span>
                          : v === "partial" ? <span className="text-xs text-amber-700 font-medium">Own classes</span>
                          : <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400"><Minus className="h-3.5 w-3.5" /></span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3"><DemoNote text="This matrix is illustrative. Real authorization must be enforced server-side." /></div>
      </CardContent>
    </Card>
  );
}
