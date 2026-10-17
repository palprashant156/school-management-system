import { GraduationCap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandLockup({
  onDark = true,
  tagline = false,
  size = "md",
}: {
  onDark?: boolean;
  tagline?: boolean;
  size?: "md" | "lg";
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-[11px] bg-indigo-600 text-white",
          size === "lg" ? "h-10 w-10" : "h-9 w-9"
        )}
      >
        <GraduationCap className={size === "lg" ? "h-5 w-5" : "h-[18px] w-[18px]"} aria-hidden />
      </span>
      <span className="flex flex-col">
        <span
          className={cn(
            "text-[17px] font-semibold leading-none tracking-[-0.01em]",
            onDark ? "text-white" : "text-slate-900"
          )}
        >
          SchoolOS
        </span>
        {tagline && (
          <span className={cn("mt-1.5 text-[11px] leading-none", onDark ? "text-white/50" : "text-slate-500")}>
            School operations, beautifully connected.
          </span>
        )}
      </span>
    </div>
  );
}

function BrandIllustration({ className }: { className?: string }) {
  const outline = "rgba(255,255,255,0.32)";
  const window = "rgba(255,255,255,0.24)";
  const faint = "rgba(255,255,255,0.16)";
  const label = "rgba(255,255,255,0.45)";
  const accent = "rgba(129,140,248,0.85)";

  const leaders = [
    { x: 250, text: "ATTENDANCE" },
    { x: 380, text: "STUDENT RECORDS" },
    { x: 510, text: "FEE LEDGER" },
  ];

  return (
    <svg
      viewBox="0 0 760 470"
      fill="none"
      preserveAspectRatio="xMinYMid meet"
      aria-hidden="true"
      focusable="false"
      className={cn("w-full", className)}
    >
      <defs>
        <pattern id="os-blueprint" width="38" height="38" patternUnits="userSpaceOnUse">
          <path d="M38 0H0V38" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
        </pattern>
        <radialGradient id="os-grid-fade" cx="42%" cy="46%" r="72%">
          <stop offset="52%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="os-grid-mask">
          <rect x="0" y="0" width="760" height="470" fill="url(#os-grid-fade)" />
        </mask>
      </defs>

      <rect x="0" y="0" width="760" height="470" fill="url(#os-blueprint)" mask="url(#os-grid-mask)" />

      <circle cx="380" cy="228" r="162" fill="rgba(255,255,255,0.018)" stroke="rgba(255,255,255,0.04)" />

      <g stroke={outline} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <rect x="315" y="214" width="130" height="172" />
        <path d="M303 214 L380 158 L457 214" />
        <rect x="185" y="270" width="130" height="116" />
        <rect x="445" y="270" width="130" height="116" />
        <path d="M181 270 H319" />
        <path d="M441 270 H579" />
      </g>

      <g stroke={outline} strokeWidth="1.25" strokeLinecap="round">
        <path d="M150 386 H690" strokeOpacity="0.9" />
      </g>
      <g stroke={faint} strokeWidth="1">
        <path d="M350 392 H410" />
        <path d="M338 398 H422" />
        <path d="M326 404 H434" />
        <rect x="600" y="270" width="90" height="116" strokeDasharray="3 6" />
        <path d="M645 322 v12 M639 328 h12" />
      </g>

      <g stroke={window} strokeWidth="1.25" strokeLinecap="round">
        <path d="M198 378 V330 a13 13 0 0 1 26 0 V378" />
        <path d="M237 378 V330 a13 13 0 0 1 26 0 V378" />
        <path d="M276 378 V330 a13 13 0 0 1 26 0 V378" />
        <path d="M458 378 V330 a13 13 0 0 1 26 0 V378" />
        <path d="M497 378 V330 a13 13 0 0 1 26 0 V378" />
        <path d="M536 378 V330 a13 13 0 0 1 26 0 V378" />
        <path d="M325 378 V318 a13 13 0 0 1 26 0 V378" />
        <path d="M411 378 V318 a13 13 0 0 1 26 0 V378" />
        <path d="M336 266 V246 a10 10 0 0 1 20 0 V266" />
        <path d="M370 266 V246 a10 10 0 0 1 20 0 V266" />
        <path d="M404 266 V246 a10 10 0 0 1 20 0 V266" />
      </g>

      <path d="M362 386 V346 a18 18 0 0 1 36 0 V386" stroke={outline} strokeWidth="1.25" strokeLinecap="round" />

      <circle cx="380" cy="186" r="13" stroke={window} strokeWidth="1.25" />
      <path d="M380 179 v7 h4.5" stroke={label} strokeWidth="1.25" strokeLinecap="round" />

      <g>
        <path d="M380 158 V116" stroke={faint} strokeWidth="1.25" strokeLinecap="round" />
        <path d="M380 119 L412 128 L380 137 Z" fill="rgba(129,140,248,0.3)" stroke="rgba(165,180,252,0.6)" strokeWidth="1" />
      </g>

      <g>
        {leaders.map(({ x, text }) => (
          <g key={text}>
            <circle cx={x} cy="386" r="2.2" fill={x === 380 ? accent : "rgba(255,255,255,0.3)"} />
            <path d={`M${x} 393 V430`} stroke={faint} strokeWidth="1" strokeDasharray="2 5" />
            <text
              x={x}
              y="448"
              textAnchor="middle"
              fill={label}
              fontSize="9.5"
              fontWeight="500"
              letterSpacing="2"
            >
              {text}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function BrandPanel() {
  return (
    <section className="brand-panel-surface relative hidden min-h-svh flex-col justify-between overflow-hidden px-12 py-10 text-white lg:sticky lg:top-0 lg:flex lg:h-svh xl:px-16 xl:py-12">
      <header className="relative z-10">
        <BrandLockup size="lg" tagline />
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center overflow-hidden py-8">
        <p className="max-w-[540px] text-balance text-[clamp(2.25rem,3.4vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-white">
          Everything your school needs. Nothing it doesn&rsquo;t.
        </p>
        <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-white/60">
          One calm, connected workspace for student records, attendance, fees, and the people who
          make your school thrive.
        </p>
        <div className="mt-8 h-[min(40vh,420px)] min-h-[170px] w-full max-w-[600px] shrink xl:mt-10">
          <BrandIllustration className="h-full w-full" />
        </div>
      </div>

      <footer className="relative z-10">
        <p className="flex items-center gap-2 text-[13px] font-medium text-white/75">
          <ShieldCheck className="h-4 w-4 text-indigo-300" aria-hidden />
          Built for the people who keep schools moving.
        </p>
        <p className="mt-1.5 pl-6 text-xs text-white/50">Designed with privacy and security in mind.</p>
      </footer>
    </section>
  );
}
