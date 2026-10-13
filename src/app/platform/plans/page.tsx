"use client";

import { Check } from "lucide-react";
import { plans } from "@/data/seed";
import { formatINR } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle, CardDesc, Badge } from "@/components/ui/ui";
import { PageHeader, DemoNote } from "@/components/shared/shared";

export default function PlatformPlans() {
  return (
    <div>
      <PageHeader title="Plans & Subscriptions" subtitle="Tiered pricing · prices configured centrally" breadcrumb="Platform" />
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <Card key={p.id} className={p.popular ? "border-indigo-300 ring-1 ring-indigo-200" : ""}>
            <CardHeader>
              <div className="flex items-center gap-2"><CardTitle>{p.name}</CardTitle>{p.popular && <Badge tone="indigo">Popular</Badge>}</div>
              <CardDesc>{p.description}</CardDesc>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{formatINR(p.priceMonthly)}<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <p className="text-xs text-slate-500">{formatINR(p.priceYearly)}/year · up to {p.studentLimit.toLocaleString("en-IN")} students · {p.activeSchools} active schools</p>
              <ul className="mt-3 space-y-1.5 text-[13px]">
                {p.modules.map((m) => <li key={m} className="flex gap-1.5"><Check className="h-4 w-4 text-emerald-600 shrink-0" /> {m}</li>)}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4"><DemoNote text="Sample pricing for demo. Plan assignment happens in Schools directory (local mock state)." /></div>
    </div>
  );
}
