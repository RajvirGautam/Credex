import Link from "next/link";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import ParallaxStage from "@/components/ParallaxStage";

/* ---------- AI tool logo marks (inline SVG) ---------- */

function ClaudeMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#D97757" />
      <path
        d="M9 22 L13.6 10 L15.6 10 L11 22 Z M16.6 10 L18.6 10 L23.2 22 L21.2 22 L19.7 18 L15.4 18 L17.6 13.4 L17.1 12 L16.6 10 Z M18.4 16.5 L17.6 14.4 L16.8 16.5 Z"
        fill="#fff"
      />
    </svg>
  );
}

function ChatGPTMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#10A37F" />
      <path
        d="M22.5 14.4a4.4 4.4 0 0 0-.4-3.6 4.45 4.45 0 0 0-4.8-2.1 4.4 4.4 0 0 0-3.3-1.5 4.45 4.45 0 0 0-4.25 3.1 4.4 4.4 0 0 0-2.95 2.1 4.45 4.45 0 0 0 .55 5.2 4.4 4.4 0 0 0 .4 3.6 4.45 4.45 0 0 0 4.8 2.1 4.4 4.4 0 0 0 3.3 1.5 4.45 4.45 0 0 0 4.25-3.1 4.4 4.4 0 0 0 2.95-2.1 4.45 4.45 0 0 0-.55-5.2Zm-6.6 9.2a3.3 3.3 0 0 1-2.1-.76l.1-.06 3.5-2a.57.57 0 0 0 .29-.5v-4.93l1.48.86a.05.05 0 0 1 .03.04v4.07a3.3 3.3 0 0 1-3.3 3.28Zm-7.1-3a3.3 3.3 0 0 1-.4-2.2l.1.06 3.5 2a.57.57 0 0 0 .58 0l4.27-2.46v1.7a.05.05 0 0 1-.02.05l-3.54 2.04a3.3 3.3 0 0 1-4.5-1.2Zm-.92-7.6a3.3 3.3 0 0 1 1.72-1.45v4.14a.57.57 0 0 0 .29.5l4.25 2.45-1.48.86a.05.05 0 0 1-.05 0L8.96 18.5a3.3 3.3 0 0 1-1.08-4.5Zm12.15 2.83-4.27-2.47L17.27 12.5a.05.05 0 0 1 .05 0l3.54 2.04a3.3 3.3 0 0 1-.5 5.95v-4.14a.57.57 0 0 0-.32-.51Zm1.47-2.22-.1-.06-3.5-2.03a.57.57 0 0 0-.58 0l-4.25 2.46v-1.71a.05.05 0 0 1 .02-.04l3.54-2.04a3.3 3.3 0 0 1 4.9 3.42Zm-9.25 3.04-1.48-.85a.05.05 0 0 1-.03-.04V11.7a3.3 3.3 0 0 1 5.42-2.54l-.1.06-3.5 2a.57.57 0 0 0-.29.5Zm.8-1.73 1.9-1.1 1.9 1.1v2.18l-1.9 1.1-1.9-1.1Z"
        fill="#fff"
      />
    </svg>
  );
}

function CursorMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#0e0d0b" />
      <path d="M9 8 L23 16 L16 16 L16 23 Z" fill="#fff" />
      <path d="M9 8 L9 22 L16 23 L16 16 Z" fill="#fff" opacity="0.55" />
    </svg>
  );
}

function CopilotMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#24292e" />
      <circle cx="12" cy="17" r="2.4" fill="#fff" />
      <circle cx="20" cy="17" r="2.4" fill="#fff" />
      <path d="M11 11h10v3.6c0 1.5-2.2 2.4-5 2.4s-5-.9-5-2.4Z" fill="#fff" />
    </svg>
  );
}

function GeminiMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <defs>
        <linearGradient id="gem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5b8bff" />
          <stop offset="100%" stopColor="#a563ff" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="#fff" />
      <path
        d="M16 6 C16 11 21 16 26 16 C21 16 16 21 16 26 C16 21 11 16 6 16 C11 16 16 11 16 6 Z"
        fill="url(#gem)"
      />
    </svg>
  );
}

function WindsurfMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#13b8a6" />
      <path
        d="M5 19c4-1 6 1 9 1s5-2 8-2 4 1 5 1v3c-1 0-2-1-5-1s-5 2-8 2-5-2-9-1Z"
        fill="#fff"
      />
      <path
        d="M5 13c4-1 6 1 9 1s5-2 8-2 4 1 5 1v3c-1 0-2-1-5-1s-5 2-8 2-5-2-9-1Z"
        fill="#fff"
        opacity="0.55"
      />
    </svg>
  );
}

function PerplexityMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#1FB8CD" />
      <path
        d="M16 7 L23 12 V20 L16 25 L9 20 V12 Z M16 11 L13 13 V19 L16 21 L19 19 V13 Z"
        fill="#fff"
      />
    </svg>
  );
}

function AnthropicMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#0e0d0b" />
      <path
        d="M12.4 9 L8 23 H10.7 L11.7 19.7 H15.5 L16.5 23 H19.2 L14.8 9 Z M12.3 17.4 L13.6 13 L14.9 17.4 Z"
        fill="#D97757"
      />
      <path d="M19.5 9 L24 23 H21.3 L17 9 Z" fill="#D97757" />
    </svg>
  );
}

function SparkleOrb() {
  return (
    <svg viewBox="0 0 220 220" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="orb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5b8bff" />
          <stop offset="60%" stopColor="#3d6bff" />
          <stop offset="100%" stopColor="#1c34a3" />
        </linearGradient>
        <radialGradient id="orbHi" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="110" cy="110" r="78" fill="url(#orb)" />
      <circle cx="110" cy="110" r="78" fill="url(#orbHi)" />
      <g fill="#fff">
        <path d="M110 70 L116 102 L148 110 L116 118 L110 150 L104 118 L72 110 L104 102 Z" />
        <circle cx="150" cy="78" r="4" opacity="0.85" />
        <circle cx="78" cy="146" r="3" opacity="0.7" />
      </g>
    </svg>
  );
}

/* ---------- Helpers ---------- */

type ChipProps = {
  className?: string;
  pv: number;
  anim: string;
  delay: string;
  children: React.ReactNode;
  pos?: React.CSSProperties;
};

function FloatingChip({ className = "", pv, anim, delay, children, pos }: ChipProps) {
  return (
    <div
      className={`parallax-chip absolute ${className}`}
      style={{ ["--pv" as string]: pv, ...pos } as React.CSSProperties}
    >
      <div className={`tool-chip ${anim}`} style={{ animationDelay: delay }}>
        {children}
      </div>
    </div>
  );
}

const BRANDS = [
  { name: "Codecraft_", glyph: <span className="inline-block h-3 w-3 rotate-45 bg-ink-900" /> },
  { name: "CoreOS", glyph: <span className="inline-block h-3 w-3 rounded-full border-2 border-ink-900" /> },
  { name: "Frequencii", glyph: <span className="inline-block h-3 w-3 rounded-full bg-ink-900" /> },
  { name: "Kintsu", glyph: <span className="inline-block h-3 w-3 rotate-45 bg-gradient-to-br from-brand-500 to-brand-700" /> },
  { name: "Lumen", glyph: <span className="inline-block h-3 w-3 rounded-sm bg-ink-900" /> },
  { name: "Northpath", glyph: <span className="inline-block h-3 w-3 rotate-12 bg-gradient-to-br from-emerald-500 to-teal-700" /> },
];

/* ---------- Page ---------- */

export default function Page() {
  return (
    <div>
      {/* HERO */}
      <section className="hero-bg relative overflow-hidden pt-10 pb-16">
        <div className="hero-arc" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-0 lg:flex-row lg:items-center lg:gap-4">

            {/* Left: headline + subtitle + CTA */}
            <div className="w-full shrink-0 lg:w-[48%] flex flex-col items-center lg:items-start text-center lg:text-left">

              {/* Social proof pill */}
              <Reveal>
                <div className="mb-5 inline-flex w-fit max-w-full items-center gap-2 sm:gap-3 rounded-full border border-ink-100 bg-white/80 px-2.5 sm:px-3 py-1.5 shadow-sm backdrop-blur">
                  <div className="flex shrink-0 -space-x-2">
                    <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-brand-600 ring-2 ring-white text-[8px] sm:text-[9px] font-bold text-white">S</span>
                    <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-rose-500 ring-2 ring-white text-[8px] sm:text-[9px] font-bold text-white">K</span>
                    <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-teal-600 ring-2 ring-white text-[8px] sm:text-[9px] font-bold text-white">M</span>
                  </div>
                  <span className="truncate text-[10px] sm:text-xs text-ink-600">
                    <span className="font-semibold text-ink-900">500+ teams</span> saving on AI
                  </span>
                  <span className="flex shrink-0 gap-px text-amber-400 text-[8px] sm:text-[10px]">★★★★★</span>
                </div>
              </Reveal>

              <Reveal delay={40}>
                <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink-900 sm:text-5xl">
                  Right-size your stack with Elite{" "}
                  <span className="relative inline-flex h-11 w-11 items-center justify-center align-middle sm:h-16 sm:w-16">
                    {/* Gemini-style smooth 4-pointed star */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full drop-shadow-[0_6px_20px_rgba(31,61,209,0.4)]" aria-hidden>
                      <defs>
                        <linearGradient id="hsk" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6fa3ff" />
                          <stop offset="100%" stopColor="#1a35d0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M50 2
                           C51.5 22 78 48.5 98 50
                           C78 51.5 51.5 78 50 98
                           C48.5 78 22 51.5 2 50
                           C22 48.5 48.5 22 50 2 Z"
                        fill="url(#hsk)"
                      />
                    </svg>
                    <span className="relative z-10 text-xs font-bold tracking-tight text-white sm:text-sm">
                      AI
                    </span>
                  </span>{" "}
                  Spend Audits
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-5 max-w-sm mx-auto lg:mx-0 text-base text-ink-500">
                  We help teams cut waste, consolidate subscriptions, and maximize ROI
                  with deterministic rules that deliver real, defensible savings.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <Link
                    href="/audit"
                    className="btn-brand transition-transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Get Started Free
                    <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-xs">↗</span>
                  </Link>
                  <Link href="/audit" className="text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors">
                    See how it works →
                  </Link>
                </div>
              </Reveal>

              {/* Social proof stats row */}
              <Reveal delay={260}>
                <div className="mt-10 grid grid-cols-2 gap-y-6 border-t border-ink-100 pt-8 sm:flex sm:flex-wrap sm:justify-center lg:justify-start lg:gap-6">
                  <div className="text-center lg:text-left">
                    <p className="text-2xl font-semibold text-ink-900">34%</p>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-ink-500">avg. cost reduction</p>
                  </div>
                  <div className="hidden sm:block w-px self-stretch bg-ink-100" />
                  <div className="text-center lg:text-left">
                    <p className="text-2xl font-semibold text-ink-900">2.3M+</p>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-ink-500">audits completed</p>
                  </div>
                  <div className="hidden sm:block w-px self-stretch bg-ink-100" />
                  <div className="col-span-2 text-center lg:text-left sm:col-span-1">
                    <p className="text-2xl font-semibold text-ink-900">165</p>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-ink-500">countries served</p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: floating orb stage */}
            <div className="w-full lg:w-[52%] mt-8 sm:mt-12 lg:mt-0 flex items-center justify-center h-[280px] sm:h-[380px] lg:h-[400px]">
          {/* Floating logo + orb stage with scroll-linked parallax */}
          <ParallaxStage className="relative h-[400px] w-[400px] scale-[0.65] sm:scale-[0.9] lg:scale-100 origin-center shrink-0">


            {/* Center orb with soft halo */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className="parallax-chip glow-orb absolute h-[380px] w-[380px] rounded-full animate-halo"
                style={{ ["--pv" as string]: 0.4 } as React.CSSProperties}
              />
              <div
                className="parallax-chip absolute h-[300px] w-[300px] rounded-full border border-dashed border-brand-300/60 animate-spin-slow"
                style={{ ["--pv" as string]: 0.6 } as React.CSSProperties}
              />
              <div
                className="parallax-chip relative h-[220px] w-[220px] animate-drift"
                style={{ ["--pv" as string]: 0.2 } as React.CSSProperties}
              >
                <SparkleOrb />
              </div>
            </div>

            {/* Chips sit on the 300px-diameter orbit ring (r=145px, stage center 50%/200px).
                Positions: cx = 50% + r·sin θ,  cy = 200 − r·cos θ,  offset by −32px (half chip). */}
            {/* θ=0°  top       */ }
            <FloatingChip pv={1.1} anim="animate-float-a" delay="-1.0s" pos={{ left:"calc(50% - 32px)", top:"23px"    }}><ClaudeMark /></FloatingChip>
            {/* θ=45° top-right */}
            <FloatingChip pv={1.3} anim="animate-float-b" delay="-3.5s" pos={{ left:"calc(50% + 70px)",  top:"65px"    }}><PerplexityMark /></FloatingChip>
            {/* θ=90° right     */}
            <FloatingChip pv={1.5} anim="animate-float-c" delay="-6.0s" pos={{ left:"calc(50% + 113px)", top:"168px"   }}><GeminiMark /></FloatingChip>
            {/* θ=135° bot-right*/}
            <FloatingChip pv={1.3} anim="animate-float-a" delay="-2.0s" pos={{ left:"calc(50% + 70px)",  top:"271px"   }}><WindsurfMark /></FloatingChip>
            {/* θ=180° bottom   */}
            <FloatingChip pv={1.1} anim="animate-float-b" delay="-4.5s" pos={{ left:"calc(50% - 32px)", top:"313px"   }}><CopilotMark /></FloatingChip>
            {/* θ=225° bot-left */}
            <FloatingChip pv={1.3} anim="animate-float-c" delay="-7.0s" pos={{ left:"calc(50% - 134px)",top:"271px"   }}><CursorMark /></FloatingChip>
            {/* θ=270° left     */}
            <FloatingChip pv={1.5} anim="animate-float-a" delay="-9.0s" pos={{ left:"calc(50% - 177px)",top:"168px"   }}><ChatGPTMark /></FloatingChip>
            {/* θ=315° top-left */}
            <FloatingChip pv={1.3} anim="animate-float-b" delay="-5.5s" pos={{ left:"calc(50% - 134px)",top:"65px"    }}><AnthropicMark /></FloatingChip>
          </ParallaxStage>
            </div>{/* end right col */}
          </div>{/* end flex row */}

          {/* Scroll cue */}
          <Reveal delay={400}>
            <div className="mx-auto mt-4 flex flex-col items-center gap-1 text-ink-400">
              <span className="text-[11px] uppercase tracking-[0.18em]">Scroll</span>
              <span className="animate-bob inline-block text-lg leading-none">↓</span>
            </div>
          </Reveal>

          {/* Trusted by — infinite marquee */}
          <Reveal delay={120}>
            <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center gap-6 rounded-2xl bg-white/60 px-6 py-6 ring-1 ring-ink-100 backdrop-blur md:flex-row md:items-center md:gap-8">
              <div className="shrink-0 text-sm font-medium text-ink-800 text-center md:text-left">
                Trusted by
                <br className="hidden md:block" />
                <span className="text-ink-500">global brands</span>
              </div>
              <div className="marquee-mask relative w-full overflow-hidden">
                <div className="marquee-track flex animate-marquee gap-12 pr-12 text-ink-700">
                  {[...BRANDS, ...BRANDS].map((b, i) => (
                    <span key={i} className="flex shrink-0 items-center gap-2 text-base font-semibold tracking-tight">
                      {b.glyph}
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Reveal>
          <div className="mb-10 text-center">
            <span className="pill bg-brand-50 text-brand-700">How it works</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Three steps. No login. No fluff.
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              n: 1,
              t: "Tell us your stack",
              b: "Pick the AI tools you pay for, the plan tier, monthly spend, and seats. Nothing leaves your browser until you submit.",
            },
            {
              n: 2,
              t: "Get a deterministic audit",
              b: "Hard-coded rules, no LLM-as-judge. Every recommendation has a citation. Below-noise savings (<$10/mo) are suppressed.",
            },
            {
              n: 3,
              t: "Share or save",
              b: "Email yourself the report, send finance a public link with PII stripped, or just close the tab. Up to you.",
            },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div className="card h-full">
                <p className="text-3xl font-semibold text-brand-300">
                  {s.n.toString().padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-medium">{s.t}</h3>
                <p className="mt-1 text-sm text-ink-600">{s.b}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Live counters strip */}
        <Reveal delay={120}>
          <div className="mt-12 md:mt-16 grid gap-8 md:gap-6 rounded-2xl border border-ink-100 bg-gradient-to-br from-brand-50 to-white p-8 md:grid-cols-3">
            <div className="text-center">
              <p className="text-4xl font-semibold tracking-tight text-ink-900">
                $<Counter to={4.2} decimals={1} />M
              </p>
              <p className="mt-1 text-sm text-ink-500">in audited annual spend</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-semibold tracking-tight text-ink-900">
                <Counter to={28} decimals={0} suffix="%" />
              </p>
              <p className="mt-1 text-sm text-ink-500">average leak found per stack</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-semibold tracking-tight text-ink-900">
                <Counter to={60} decimals={0} suffix="s" />
              </p>
              <p className="mt-1 text-sm text-ink-500">to a defensible report</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ABOUT / TRUST */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card h-full">
              <h3 className="font-medium">Defensible numbers</h3>
              <p className="mt-2 text-sm text-ink-600">
                Every dollar figure cites a vendor pricing URL — pulled and dated in
                the public <span className="font-mono">PRICING_DATA.md</span>. We won&apos;t
                manufacture savings.
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="card h-full">
              <h3 className="font-medium">Built by Credex</h3>
              <p className="mt-2 text-sm text-ink-600">
                If your audit shows a real leak, you can route the same tools through
                Credex credits and capture the discount. If it doesn&apos;t, we&apos;ll tell you
                you&apos;re spending well.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRICING anchor + FAQ */}
      <section id="pricing" className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <div className="text-center">
            <span className="pill bg-ink-100 text-ink-700">Pricing</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Free, forever.
            </h2>
            <p className="mt-2 text-ink-600">
              The audit is free. Citations are public. The only thing we ever charge
              for lives over at <span className="font-medium">Credex</span>.
            </p>
            <Link href="/audit" className="btn-brand mt-6 transition-transform hover:-translate-y-0.5">
              Run my audit →
            </Link>
          </div>
        </Reveal>

        <div className="mt-14">
          <Reveal>
            <h3 className="text-xl font-semibold">FAQ</h3>
          </Reveal>
          <div className="mt-4 space-y-3">
            {[
              {
                q: "What's the catch?",
                a: "None. No login, no email required to see results. We do offer to email a copy because it's useful, but the page renders first.",
              },
              {
                q: "Will you sell my data?",
                a: "No. The shareable URL strips identifying details. We store an audit so the share link works.",
              },
              {
                q: "How current is the pricing?",
                a: "We pull every number from the vendor's own pricing page and re-verify weekly. The pull date is stamped in PRICING_DATA.md.",
              },
              {
                q: "Is the engine using AI to make recommendations?",
                a: "No. Recommendations are deterministic, hard-coded rules. AI only writes the optional ~100-word personalized summary, where a wrong number doesn't matter.",
              },
              {
                q: "What if you can't help me?",
                a: "Then you'll get a 'you're spending well' page. We won't invent a problem to manufacture a CTA.",
              },
            ].map((f, i) => (
              <Reveal key={f.q} delay={i * 80}>
                <details className="card group">
                  <summary className="cursor-pointer list-none font-medium">
                    <span className="mr-2 inline-block w-3 text-ink-400 group-open:rotate-90 transition-transform">
                      ›
                    </span>
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm text-ink-600">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
