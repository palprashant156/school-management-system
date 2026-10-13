"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ACADEMIC_YEARS } from "@/data/seed";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDesc, Select, Badge } from "@/components/ui/ui";

export default function AcademicSettingsPage() {
  const { academicYear, setAcademicYear, classes, sections, toast } = useStore();
  const [year, setYear] = useState(academicYear);

  return (
    <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
      <Card>
        <CardHeader><CardTitle>Academic year</CardTitle><CardDesc>Active year drives filters across the app</CardDesc></CardHeader>
        <CardContent className="flex gap-2 items-end">
          <span className="flex-1">
            <Select aria-label="Academic year" value={year} onChange={(e) => setYear(e.target.value)}>
              {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </Select>
          </span>
          <Button onClick={() => { setAcademicYear(year); toast({ kind: "success", title: `Academic year set to ${year}` }); }}>Apply</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Classes & sections</CardTitle><CardDesc>{classes.length} classes · {sections.length} sections</CardDesc></CardHeader>
        <CardContent>
          <Link href="/classes"><Button variant="outline" size="sm">Manage classes</Button></Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Attendance statuses</CardTitle><CardDesc>Defaults used in daily marking</CardDesc></CardHeader>
        <CardContent className="flex flex-wrap gap-1.5">
          {["Present", "Absent", "Late", "Excused"].map((s) => <Badge key={s} tone="slate">{s}</Badge>)}
        </CardContent>
      </Card>
    </div>
  );
}
