"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@/components/ui/ui";

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

export default function SchoolSettingsPage() {
  const { school, updateSchool, toast } = useStore();
  const [f, setF] = useState({ ...school });

  function save(e: React.FormEvent) {
    e.preventDefault();
    updateSchool(f);
    toast({ kind: "success", title: "School settings saved (demo)" });
  }

  return (
    <form onSubmit={save} className="grid md:grid-cols-2 gap-4 max-w-4xl">
      <Card className="md:col-span-2">
        <CardHeader><CardTitle>School profile</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field id="sn" label="School name"><Input id="sn" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field id="sc" label="School code"><Input id="sc" value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} /></Field>
          <div className="sm:col-span-2 flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
            <span className="h-10 w-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">V</span>
            <p className="text-[13px] text-slate-500">Logo upload is a placeholder in this demo.</p>
          </div>
          <div className="sm:col-span-2"><Field id="sa" label="Address"><Input id="sa" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></Field></div>
          <Field id="sci" label="City"><Input id="sci" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></Field>
          <Field id="sst" label="State"><Input id="sst" value={f.state} onChange={(e) => setF({ ...f, state: e.target.value })} /></Field>
          <Field id="sp" label="Pincode"><Input id="sp" value={f.pincode} onChange={(e) => setF({ ...f, pincode: e.target.value })} /></Field>
          <Field id="sph" label="Phone"><Input id="sph" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
          <Field id="sem" label="Email"><Input id="sem" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
          <Field id="stz" label="Timezone"><Input id="stz" value={f.timezone} onChange={(e) => setF({ ...f, timezone: e.target.value })} /></Field>
          <Field id="scu" label="Currency"><Input id="scu" value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })} /></Field>
        </CardContent>
      </Card>
      <div className="md:col-span-2 flex justify-end"><Button type="submit">Save changes</Button></div>
    </form>
  );
}
