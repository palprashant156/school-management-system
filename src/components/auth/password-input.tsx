"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/ui";
import { cn } from "@/lib/utils";

export function PasswordInput({ className, ...props }: React.ComponentPropsWithRef<"input">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn("h-11 pr-11 text-[15px]", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {visible ? (
          <EyeOff className="h-[18px] w-[18px]" aria-hidden />
        ) : (
          <Eye className="h-[18px] w-[18px]" aria-hidden />
        )}
      </button>
    </div>
  );
}
