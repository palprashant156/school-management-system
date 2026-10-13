"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { Button, Card, CardContent, Input, Label, FieldError } from "@/components/ui/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("priya@vidyavalley.edu.in");
  const [password, setPassword] = useState("demo1234");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters for this demo.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-10">
        <div className="flex items-center gap-2.5">
          <span className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="font-semibold text-lg">SchoolOS</span>
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight leading-tight">Run your school<br />from one calm place.</h1>
          <p className="text-slate-400 mt-3 max-w-md text-[15px]">Students, attendance, fees and announcements — designed for affordable private schools in India.</p>
          <div className="grid grid-cols-3 gap-3 mt-8 max-w-md">
            {[
              ["2,400+", "students managed"],
              ["96%", "attendance tracked"],
              ["₹1.4Cr", "fees collected"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-lg font-semibold">{v}</p>
                <p className="text-xs text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500">Demo build · Mock data only · No real authentication</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="lg:hidden flex items-center gap-2 mb-5">
              <span className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="h-4 w-4" />
              </span>
              <span className="font-semibold">SchoolOS</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500 mt-1">Sign in to Vidya Valley Public School</p>
            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="pr-10" />
                  <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <FieldError message={error} />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setEmail("amit@vidyavalley.edu.in"); setPassword("demo1234"); }}>
                  Accountant demo
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setEmail("kavitha@vidyavalley.edu.in"); setPassword("demo1234"); }}>
                  Teacher demo
                </Button>
              </div>
              <p className="text-xs text-slate-500 text-center">Any password works in this frontend demo. Data stays in your browser.</p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
