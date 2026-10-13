"use client";

import { Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { plans } from "@/data/seed";
import { formatINR } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDesc, Badge } from "@/components/ui/ui";

export default function SubscriptionPage() {
  const { school, students, toast, updateSchool } = useStore();
  const current = plans.find((p) => p.id === school.planId) ?? plans[1];

  return (
    <div className="max-w-5xl space-y-4">
      <Card>
        <CardHeader><CardTitle>Current plan — {current.name}</CardTitle><CardDesc>Student capacity {students.length} / {current.studentLimit} · Modules: {current.modules.join(", ")}</CardDesc></CardHeader>
        <CardContent>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${Math.min(100, (students.length / current.studentLimit) * 100)}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-1.5">Sample subscription data for demo.</p>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <Card key={p.id} className={p.id === current.id ? "border-indigo-300 ring-1 ring-indigo-200" : ""}>
            <CardHeader>
              <div className="flex items-center gap-2"><CardTitle>{p.name}</CardTitle>{p.popular && <Badge tone="indigo">Popular</Badge>}{p.id === current.id && <Badge tone="green">Current</Badge>}</div>
              <CardDesc>{p.description}</CardDesc>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{formatINR(p.priceMonthly)}<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <p className="text-xs text-slate-500">{formatINR(p.priceYearly)}/year · up to {p.studentLimit} students</p>
              <ul className="mt-3 space-y-1.5 text-[13px]">
                {p.modules.map((m) => <li key={m} className="flex gap-1.5"><Check className="h-4 w-4 text-emerald-600 shrink-0" /> {m}</li>)}
              </ul>
              <Button
                className="w-full mt-4"
                variant={p.id === current.id ? "outline" : "primary"}
                onClick={() => {
                  if (p.id === current.id) return;
                  updateSchool({ planId: p.id });
                  toast({ kind: "success", title: `Switched to ${p.name} (demo)`, desc: "Plan selection stored locally." });
                }}
              >
                {p.id === current.id ? "Current plan" : "Choose plan"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="pt-4 text-sm text-slate-600">
          Need more capacity? <Button variant="ghost" size="sm" className="px-1" onClick={() => toast({ kind: "info", title: "Sales contacted (demo)", desc: "Our team will reach out — this is a demo action." })}>Contact sales</Button>
        </CardContent>
      </Card>
    </div>
  );
}
