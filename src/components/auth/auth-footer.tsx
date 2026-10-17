"use client";

import { useRef, useState } from "react";
import { Badge, Button, Dialog } from "@/components/ui/ui";

type InfoKey = "contact" | "privacy" | "terms" | "help";

const INFO_CONTENT: Record<
  InfoKey,
  { title: string; desc?: string; placeholder: boolean; body: React.ReactNode }
> = {
  contact: {
    title: "Contact your school administrator",
    desc: "Accounts are created by your school.",
    placeholder: false,
    body: (
      <>
        <p className="text-[13px] leading-relaxed text-slate-600">
          SchoolOS accounts are invited by your school&rsquo;s administrator. If you need access,
          ask your administrator to invite you from{" "}
          <span className="font-medium text-slate-800">Settings &rarr; Users</span> in the school
          workspace.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">
          This demo can&rsquo;t send real messages to your school.
        </p>
      </>
    ),
  },
  privacy: {
    title: "Privacy",
    placeholder: true,
    body: (
      <p className="text-[13px] leading-relaxed text-slate-600">
        This is a frontend demo of SchoolOS. A privacy policy has not been published for this
        build, and no real student data is collected or processed.
      </p>
    ),
  },
  terms: {
    title: "Terms of service",
    placeholder: true,
    body: (
      <p className="text-[13px] leading-relaxed text-slate-600">
        This is a frontend demo of SchoolOS. Terms of service have not been published for this
        build — the demo is provided for evaluation only.
      </p>
    ),
  },
  help: {
    title: "Help",
    placeholder: true,
    body: (
      <p className="text-[13px] leading-relaxed text-slate-600">
        This is a frontend demo of SchoolOS. A help centre has not been published for this build;
        use the demo credentials on the sign-in screen to explore the product.
      </p>
    ),
  },
};

export function AuthFooter() {
  const [info, setInfo] = useState<InfoKey | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  function openInfo(key: InfoKey) {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setInfo(key);
  }

  function closeInfo() {
    setInfo(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  const content = info ? INFO_CONTENT[info] : null;

  const linkClass =
    "rounded-sm font-medium text-slate-500 underline-offset-4 transition-colors hover:text-slate-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";

  return (
    <footer className="px-6 pb-7 pt-4 sm:px-10 lg:px-14 xl:px-20">
      <div className="mx-auto w-full max-w-[400px]">
        <div className="h-px bg-slate-200/80" />
        <p className="mt-5 text-[13px] leading-relaxed text-slate-500">
          New to SchoolOS?{" "}
          <button
            type="button"
            onClick={() => openInfo("contact")}
            className="rounded-sm font-medium text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Contact your school administrator
          </button>
          .
        </p>
        <div className="mt-6 flex flex-col gap-2.5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 SchoolOS</p>
          <nav aria-label="Legal and support" className="flex items-center gap-4">
            <button type="button" onClick={() => openInfo("privacy")} className={linkClass}>
              Privacy
            </button>
            <button type="button" onClick={() => openInfo("terms")} className={linkClass}>
              Terms
            </button>
            <button type="button" onClick={() => openInfo("help")} className={linkClass}>
              Help
            </button>
          </nav>
        </div>
      </div>

      <Dialog open={info !== null} onClose={closeInfo} title={content?.title ?? ""} desc={content?.desc}>
        {content && (
          <>
            {content.placeholder && <Badge tone="slate" className="mb-3">Demo placeholder</Badge>}
            {content.body}
            <div className="mt-5 flex justify-end">
              <Button type="button" onClick={closeInfo}>
                Close
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </footer>
  );
}
