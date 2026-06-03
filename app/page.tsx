"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import CubeBackground from "./Cubebackground";
import ServiceBoxes from "./ServiceBoxes";

/* ─── DATA ─── */
const STATS = [
  { to: 120, suffix: "+", label: "Projects delivered" },
  { to: 9,   suffix: "+", label: "Years in business"  },
  { to: 40,  suffix: "+", label: "Engineers & designers" },
  { to: 99,  suffix: "%", label: "Client retention"   },
];

const PROCESS = [
  { n: "01", title: "Discover", body: "Deep-dive into your goals, users, and constraints before writing a single line of code." },
  { n: "02", title: "Design",   body: "Architecture, UX blueprints, and technical specs locked in before development begins." },
  { n: "03", title: "Build",    body: "Agile sprints, daily standups, real demos every week. You see progress the whole time." },
  { n: "04", title: "Launch",   body: "Rigorous QA, zero-downtime deploy, post-launch monitoring, and 90-day hypercare." },
];

const WHY = [
  { icon: "⬡", title: "Senior talent only",
    body: "Every project is run by experienced engineers and strategists — no juniors, no outsourcing, no dilution." },
  { icon: "◈", title: "Full-stack capability",
    body: "Automation, marketing, 3D, software — all in-house. One partner handles your entire digital operation." },
  { icon: "◎", title: "On-time, on-scope",
    body: "We work in fixed-scope sprints with clear deliverables. No scope creep, no surprise invoices." },
  { icon: "✦", title: "Outcome ownership",
    body: "We care about results, not just shipping. We track KPIs, iterate fast, and stay accountable to your goals." },
  { icon: "⬔", title: "Direct communication",
    body: "No account managers. You talk directly to the people building your product, every day." },
  { icon: "◇", title: "IP stays with you",
    body: "Every line of code, every asset, every strategy deck — full intellectual property transfer on completion." },
];

const WORK = [
  {
    tag: "Automation · AI",
    title: "AutoFlow — Enterprise Workflow Engine",
    desc: "End-to-end RPA system replacing 14 manual processes across a 200-person logistics firm. 80% reduction in ops overhead.",
    color: "from-[#0a90d8]/30 to-[#012a5e]/60",
  },
  {
    tag: "Digital Marketing",
    title: "GrowthOS — Performance Marketing Platform",
    desc: "Custom analytics + paid media system that drove a 3.4× ROAS improvement for a $12M e-commerce brand.",
    color: "from-[#00c0ff]/25 to-[#01204a]/60",
  },
  {
    tag: "3D Animation",
    title: "ArchViz Studio — Architectural Visualization",
    desc: "Interactive 3D property walkthroughs for a real-estate developer. Sold 70% of units off-plan before construction.",
    color: "from-[#40d8ff]/20 to-[#011830]/60",
  },
];

const TESTIMONIALS = [
  {
    quote: "Three Plug automated processes we thought were impossible to automate. The ROI was visible within the first month.",
    name: "James Okoye", role: "COO, Meridian Logistics",
  },
  {
    quote: "The 3D product animations they built for our launch campaign outperformed every other creative by 4×. Genuinely stunning work.",
    name: "Priya Sharma", role: "CMO, Luminary Health",
  },
  {
    quote: "They rebuilt our entire marketing stack from the ground up. Organic traffic up 280% in six months. These people know what they're doing.",
    name: "Daniel Müller", role: "Founder, NordRetail",
  },
];

const TICKER_ITEMS = [
  "AUTOMATION", "AI AGENTS", "DIGITAL MARKETING", "3D ANIMATION",
  "WEB APPS", "DEVOPS", "AR / VR", "SEO", "MOBILE", "CLOUD", "MOTION DESIGN",
];

/* ─── RUBIK COLOUR SYSTEM ─── */
const RUBIK = {
  r: "#ef233c",
  o: "#f77f00",
  y: "#f4c842",
  g: "#27ae60",
  b: "#0a90d8",
  w: "#dce8f5",
} as const;
type RubikKey = keyof typeof RUBIK;

const WHY_COLORS  = [RUBIK.b, RUBIK.o, RUBIK.y, RUBIK.g, RUBIK.r, RUBIK.w];
const PROC_COLORS = [RUBIK.r, RUBIK.o, RUBIK.y, RUBIK.g];
const WORK_COLORS = [RUBIK.b, RUBIK.r, RUBIK.g];
const TESTI_COLORS = [RUBIK.b, RUBIK.g, RUBIK.y];

/* Fixed Rubik sticker patterns (no random = no hydration mismatch) */
const WHY_STICKERS: RubikKey[][] = [
  ["b","w","r","g","b","o","y","b","g"],
  ["o","b","g","r","o","b","w","y","o"],
  ["y","r","b","o","y","g","b","w","y"],
  ["g","y","o","w","g","r","o","b","g"],
  ["r","g","w","b","r","y","g","o","r"],
  ["w","o","y","r","w","b","y","g","w"],
];
const PROC_STICKERS: RubikKey[][] = [
  ["r","b","w","g","r","o","b","r","y"],
  ["o","r","b","w","o","g","r","y","o"],
  ["y","o","r","b","y","w","o","g","y"],
  ["g","y","o","r","g","b","y","w","g"],
];
const BIG_DECO_FACE: RubikKey[] = ["b","r","g","o","y","w","b","g","r"];

/* ─── HOOKS ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis] as const;
}

function useTilt(intensity = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * intensity;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -intensity;
    el.style.transition = "transform 0.07s linear";
    el.style.transform  = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) scale(1.04)`;
  };
  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.6s cubic-bezier(0.23,1,0.32,1)";
    el.style.transform  = "";
  };
  return { ref, onMouseMove, onMouseLeave };
}

/* ─── RUBIK FACE COMPONENT ─── */
function RubikFace({ pattern, size = 40 }: { pattern: RubikKey[]; size?: number }) {
  const gap = Math.max(2, Math.round(size * 0.05));
  const pad = Math.max(3, Math.round(size * 0.08));
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
      gap, padding: pad, width: size, height: size,
      background: "#050a14",
      borderRadius: Math.round(size * 0.14),
      border: "1px solid rgba(255,255,255,0.14)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.55)",
    }}>
      {pattern.map((key, i) => (
        <div key={i} style={{
          background: RUBIK[key],
          borderRadius: Math.round(size * 0.04),
          boxShadow: `0 0 ${Math.round(size * 0.1)}px ${RUBIK[key]}55`,
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="relative min-h-screen text-zinc-100 antialiased" style={{ background: "transparent" }}>
      <CubeBackground />

      {/* subtle grid overlay */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage: "radial-gradient(ellipse 90% 90% at 50% 40%,black,transparent)",
      }} />

      <Hero />
      <Ticker />
      <ServiceBoxes />
      <WhyUs />
      <Process />
      <About />
      <FeaturedWork />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-16">
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 55% 55% at 70% 50%, rgba(10,144,216,0.14), transparent 70%)",
      }} />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-12 flex items-center gap-5">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full opacity-40"
              style={{ background: "radial-gradient(circle, rgba(10,144,216,0.5), transparent 70%)", filter: "blur(12px)" }} />
            <Image src="/logo.png" alt="Three Plug Software Solutions" width={130} height={130}
              className="relative h-32 w-auto object-contain drop-shadow-[0_0_24px_rgba(10,144,216,0.6)]" priority />
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight leading-none text-white">THREE PLUG</div>
            <div className="mt-1 font-mono text-xs uppercase tracking-[0.22em]" style={{ color: "rgba(10,144,216,0.8)" }}>
              Software Solutions
            </div>
          </div>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-widest"
              style={{ borderColor: "rgba(10,144,216,0.3)", background: "rgba(10,144,216,0.07)", color: "var(--brand-light)" }}>
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--brand-light)" }} />
              Full-service digital studio
            </div>

            <h1 className="font-black leading-[0.87] tracking-tight"
              style={{ fontSize: "clamp(3.8rem, 9.5vw, 9rem)", textShadow: "0 4px 80px rgba(3,7,14,0.6)" }}>
              Automate.
              <br />
              <span className="italic" style={{
                background: "linear-gradient(95deg, #0a90d8 0%, #40d8ff 60%, #0a90d8 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Market.</span>
              <br />
              Animate.
            </h1>

            <p className="mt-8 max-w-lg text-xl leading-relaxed"
              style={{ color: "rgba(240,244,248,0.6)", textShadow: "0 2px 30px rgba(3,7,14,0.8)" }}>
              We automate your operations, grow your audience, and bring your brand
              to life in motion — all under one roof.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#contact"
                className="rounded-full px-8 py-4 font-bold transition-all hover:scale-105"
                style={{ background: "var(--brand-light)", color: "#03070e", boxShadow: "0 0 36px rgba(10,144,216,0.4)" }}>
                Start a project →
              </a>
              <a href="#services"
                className="rounded-full border px-8 py-4 font-semibold transition-all hover:bg-white/8"
                style={{ borderColor: "rgba(255,255,255,0.15)", color: "#f0f4f8" }}>
                Explore services
              </a>
            </div>
          </div>

          <div className="hidden lg:flex lg:flex-col lg:gap-6">
            {[{ n: "120+", l: "Projects" }, { n: "99%", l: "Retention" }, { n: "9+", l: "Years" }].map((s) => (
              <div key={s.l} className="text-right">
                <div className="text-3xl font-black leading-none" style={{ color: "var(--brand-light)" }}>{s.n}</div>
                <div className="mt-0.5 font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(240,244,248,0.35)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: "rgba(240,244,248,0.3)" }}>scroll</span>
        <div className="h-8 w-px" style={{ background: "linear-gradient(to bottom, rgba(10,144,216,0.5), transparent)" }} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   TICKER
───────────────────────────────────────────────────── */
function Ticker() {
  const row = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative z-10 overflow-hidden py-5"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(3,7,14,0.6)",
        backdropFilter: "blur(14px)",
      }}>
      <div className="flex w-max animate-[marquee_34s_linear_infinite]">
        {row.map((it, i) => (
          <span key={i} className="flex items-center text-xs font-extrabold uppercase tracking-[0.18em]"
            style={{ color: "rgba(255,255,255,0.28)" }}>
            {it}
            <span className="mx-7 text-sm" style={{ color: "rgba(10,144,216,0.65)" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   WHY CHOOSE THREE PLUG  — "Six sides. All covered."
───────────────────────────────────────────────────── */
function WhyUs() {
  const [containerRef, vis] = useReveal(0.05);

  return (
    <section id="why" className="relative z-10 px-6 py-28 overflow-hidden">
      {/* Large decorative Rubik face background */}
      <div className="pointer-events-none absolute top-12 right-8 opacity-[0.04]"
        style={{ transform: "rotate(18deg)", animation: "floatY 7s ease-in-out infinite" }}>
        <RubikFace pattern={BIG_DECO_FACE} size={260} />
      </div>
      <div className="pointer-events-none absolute bottom-8 left-4 opacity-[0.03]"
        style={{ transform: "rotate(-12deg)", animation: "floatY 9s ease-in-out infinite 2s" }}>
        <RubikFace pattern={["r","g","b","o","y","w","g","r","y"]} size={180} />
      </div>

      <div className="mx-auto max-w-7xl">
        <SectionLabel number="02" label="Why Three Plug" />

        <div className="mb-4 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-black leading-none tracking-tight" style={{ fontSize: "clamp(2.4rem,5.5vw,4.8rem)" }}>
            The studio that<br /><GradText>ships and stays.</GradText>
          </h2>
          {/* Mini Rubik face beside heading */}
          <div className="hidden lg:block opacity-70" style={{ animation: "stickerPop 0.8s 0.4s both" }}>
            <RubikFace pattern={WHY_STICKERS[0]} size={64} />
          </div>
        </div>

        <p className="mb-14 text-base max-w-md" style={{ color: "rgba(240,244,248,0.4)" }}>
          Six capabilities. Six sides. Every angle covered.
        </p>

        {/* 3 × 2 card grid — styled like a cube face with seam lines */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden rounded-3xl"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.035)",
            gap: "1px",
          }}
        >
          {WHY.map((w, i) => (
            <WhyCard key={i} {...w} index={i} visible={vis} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyCard({
  icon, title, body, index, visible,
}: {
  icon: string; title: string; body: string; index: number; visible: boolean;
}) {
  const tilt = useTilt(7);
  const color = WHY_COLORS[index];
  const delay = `${index * 85}ms`;

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="group relative overflow-hidden p-8"
      style={{
        background: "rgba(3,7,14,0.88)",
        backdropFilter: "blur(20px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "perspective(700px) rotateY(-50deg) translateY(16px)",
        transition: `opacity 0.75s ${delay}, transform 0.75s ${delay} cubic-bezier(0.22,1,0.36,1)`,
        borderLeft: `3px solid ${color}`,
        willChange: "transform",
      }}
    >
      {/* Hover scan-line shimmer */}
      <div
        className="pointer-events-none absolute left-0 right-0 opacity-0 group-hover:opacity-100"
        style={{
          height: "40%", top: "-20%",
          background: `linear-gradient(to bottom, transparent, ${color}12, transparent)`,
          transition: "opacity 0.4s",
          animation: "scanDown 2.4s linear infinite",
        }}
      />

      {/* Rubik sticker grid — top right */}
      <div
        className="absolute top-4 right-4 opacity-20 group-hover:opacity-55 transition-opacity duration-500"
        style={{ animation: visible ? `stickerPop 0.6s ${delay} both` : "none" }}
      >
        <RubikFace pattern={WHY_STICKERS[index]} size={38} />
      </div>

      {/* Icon badge */}
      <div
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold"
        style={{
          background: `${color}18`,
          color,
          border: `1px solid ${color}44`,
          boxShadow: `0 0 24px ${color}22`,
        }}
      >
        {icon}
      </div>

      {/* Expanding accent bar */}
      <div
        className="mb-4 h-0.5 rounded-full transition-all duration-500 group-hover:w-16"
        style={{ width: 32, background: `linear-gradient(90deg, ${color}, ${color}44)` }}
      />

      <h3 className="mb-3 text-lg font-black tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(240,244,248,0.5)" }}>{body}</p>

      {/* Bottom color glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}88, transparent)` }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   PROCESS  — "Solve the cube in 4 moves."
───────────────────────────────────────────────────── */
function Process() {
  const [lineRef, lineVis] = useReveal(0.3);

  return (
    <section id="process" className="relative z-10 px-6 py-28 overflow-hidden">
      {/* Big ghost cube face */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.025]"
        style={{ transform: "translateY(-50%) rotate(8deg)", animation: "floatY 11s ease-in-out infinite" }}>
        <RubikFace pattern={["o","r","b","g","o","y","w","b","o"]} size={320} />
      </div>

      <div className="mx-auto max-w-7xl">
        <SectionLabel number="03" label="How we work" />
        <h2 className="mb-3 font-black leading-none tracking-tight" style={{ fontSize: "clamp(2.4rem,5.5vw,4.8rem)" }}>
          Built for<br /><GradText>momentum.</GradText>
        </h2>
        <p className="mb-16 text-base max-w-sm" style={{ color: "rgba(240,244,248,0.38)" }}>
          Four moves. Every time.
        </p>

        <div className="relative">
          {/* Animated connector line */}
          <div
            ref={lineRef}
            className="absolute top-[3.25rem] left-[3.5rem] right-[3.5rem] h-px hidden md:block overflow-hidden rounded-full"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-full"
              style={{
                background: "linear-gradient(90deg, #ef233c, #f77f00, #f4c842, #27ae60)",
                transformOrigin: "left center",
                animation: lineVis ? "lineGrow 1.4s cubic-bezier(0.22,1,0.36,1) 0.3s both" : "none",
              }}
            />
          </div>

          <div className="relative grid gap-5 md:grid-cols-4">
            {PROCESS.map((step, i) => (
              <ProcessStep key={i} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessStep({ step, index }: { step: typeof PROCESS[number]; index: number }) {
  const [ref, vis] = useReveal(0.25);
  const tilt = useTilt(9);
  const color = PROC_COLORS[index];

  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(48px)",
        transition: `opacity 0.7s ${index * 110}ms, transform 0.7s ${index * 110}ms cubic-bezier(0.22,1,0.36,1)`,
      }}
    >
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="group relative overflow-hidden rounded-2xl p-7"
        style={{
          background: "rgba(4,10,22,0.8)",
          border: `1px solid ${color}28`,
          backdropFilter: "blur(18px)",
          willChange: "transform",
        }}
      >
        {/* Top color stripe */}
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}44)` }} />

        {/* Rubik sticker in corner */}
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-80 transition-opacity duration-500"
          style={{ animation: vis ? `stickerPop 0.5s ${index * 110 + 400}ms both` : "none" }}>
          <RubikFace pattern={PROC_STICKERS[index]} size={36} />
        </div>

        {/* Step number badge */}
        <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl font-mono text-base font-black"
          style={{
            background: `${color}15`,
            color,
            border: `1px solid ${color}50`,
            boxShadow: `0 0 32px ${color}22`,
          }}
        >
          {step.n}
          {/* Small sticker dots */}
          <div className="absolute -top-1.5 -right-1.5 flex gap-1">
            <div style={{ width: 6, height: 6, borderRadius: 1, background: color, opacity: 0.9 }} />
            <div style={{ width: 6, height: 6, borderRadius: 1, background: color, opacity: 0.5 }} />
          </div>
        </div>

        <h3 className="mb-3 text-xl font-black tracking-tight">{step.title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(240,244,248,0.5)" }}>{step.body}</p>

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${color}66, transparent)`, opacity: 0.5, animation: "borderPulse 2.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   ABOUT / STATS  — cube-face stat panel
───────────────────────────────────────────────────── */
function About() {
  const [textRef, textVis] = useReveal(0.2);
  const [gridRef, gridVis] = useReveal(0.2);

  return (
    <section id="about" className="relative z-10 px-6 py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">

          {/* Left: text */}
          <div
            ref={textRef}
            style={{
              opacity: textVis ? 1 : 0,
              transform: textVis ? "none" : "translateX(-40px)",
              transition: "opacity 0.8s, transform 0.8s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <SectionLabel number="04" label="The studio" />
            <h2 className="mb-8 font-black leading-none tracking-tight" style={{ fontSize: "clamp(2.4rem,5vw,4.5rem)" }}>
              Senior talent.<br /><GradText>Zero layers.</GradText>
            </h2>
            <p className="mb-6 text-lg leading-relaxed" style={{ color: "rgba(240,244,248,0.62)" }}>
              Three Plug is a tight-knit studio of engineers, designers, and marketers who have
              all done this before. You work directly with the people building your product —
              no account managers, no hand-offs, no dilution.
            </p>
            <p className="mb-10 text-lg leading-relaxed" style={{ color: "rgba(240,244,248,0.4)" }}>
              Whether it&apos;s an AI automation system, a conversion-optimised marketing funnel,
              or a cinematic 3D brand film — we own the outcome start to finish.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 font-semibold transition-all hover:bg-white/8 hover:gap-3"
              style={{ borderColor: "rgba(10,144,216,0.4)", color: "var(--brand-light)" }}
            >
              Meet the team <span>→</span>
            </a>
          </div>

          {/* Right: 2×2 stat grid styled as a Rubik face */}
          <div
            ref={gridRef}
            className="grid grid-cols-2 overflow-hidden rounded-3xl"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              gap: "1px",
              opacity: gridVis ? 1 : 0,
              transform: gridVis ? "none" : "translateX(40px) scale(0.96)",
              transition: "opacity 0.8s 0.15s, transform 0.8s 0.15s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {STATS.map((s, i) => (
              <StatBox key={i} {...s} color={WHY_COLORS[i]} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBox({ to, suffix, label, color }: { to: number; suffix?: string; label: string; color: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const t0 = performance.now(), dur = 1800;
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col justify-between overflow-hidden p-10"
      style={{ background: "rgba(3,7,14,0.82)", backdropFilter: "blur(20px)" }}
    >
      {/* Rubik sticker accent top-left */}
      <div className="absolute top-3 left-3 flex gap-1">
        {[1, 0.5, 0.25].map((op, i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: 2,
            background: color, opacity: op,
          }} />
        ))}
      </div>

      {/* Top color bar */}
      <div className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}44)`, animation: "borderPulse 3s ease-in-out infinite" }} />

      <div
        className="font-black leading-none tracking-tight"
        style={{
          fontSize: "clamp(2.8rem,4.5vw,4rem)",
          color,
          textShadow: `0 0 40px ${color}55`,
        }}
      >
        {val}{suffix}
      </div>

      <div className="mt-3 text-sm font-mono uppercase tracking-widest" style={{ color: "rgba(240,244,248,0.38)" }}>
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   FEATURED WORK  — tilt cards with cube face patterns
───────────────────────────────────────────────────── */
function FeaturedWork() {
  const [headRef, headVis] = useReveal(0.2);

  return (
    <section id="work" className="relative z-10 px-6 py-28 overflow-hidden">
      {/* Ghost deco */}
      <div className="pointer-events-none absolute bottom-0 left-0 opacity-[0.03]"
        style={{ transform: "rotate(-15deg)", animation: "floatY 8s ease-in-out infinite 1s" }}>
        <RubikFace pattern={["b","y","r","g","w","o","r","b","g"]} size={220} />
      </div>

      <div className="mx-auto max-w-7xl">
        <div
          ref={headRef}
          className="mb-16 flex items-end justify-between"
          style={{
            opacity: headVis ? 1 : 0,
            transform: headVis ? "none" : "translateY(24px)",
            transition: "opacity 0.7s, transform 0.7s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div>
            <SectionLabel number="05" label="Featured work" />
            <h2 className="font-black leading-none tracking-tight" style={{ fontSize: "clamp(2.4rem,5.5vw,4.8rem)" }}>
              Results,<br /><GradText>not promises.</GradText>
            </h2>
          </div>
          <a
            href="#contact"
            className="hidden rounded-full border px-6 py-3 font-semibold transition-all hover:bg-white/8 md:block"
            style={{ borderColor: "rgba(255,255,255,0.14)", color: "rgba(240,244,248,0.55)" }}
          >
            See all work →
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {WORK.map((w, i) => (
            <WorkCard key={i} work={w} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkCard({ work: w, index }: { work: typeof WORK[number]; index: number }) {
  const [revealRef, vis] = useReveal(0.15);
  const tilt = useTilt(10);
  const color = WORK_COLORS[index];

  /* Cube-face sticker pattern backgrounds */
  const bgPatterns: RubikKey[][] = [
    ["b","w","b","w","b","w","b","w","b"],
    ["r","o","r","o","r","o","r","o","r"],
    ["g","y","g","y","g","y","g","y","g"],
  ];

  return (
    <div
      ref={revealRef}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : `translateY(${32 + index * 14}px)`,
        transition: `opacity 0.75s ${index * 120}ms, transform 0.75s ${index * 120}ms cubic-bezier(0.22,1,0.36,1)`,
      }}
    >
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="group relative flex flex-col overflow-hidden rounded-3xl"
        style={{
          background: "rgba(4,10,22,0.75)",
          border: `1px solid ${color}22`,
          backdropFilter: "blur(20px)",
          willChange: "transform",
        }}
      >
        {/* Image / preview panel */}
        <div className={`h-56 bg-gradient-to-br ${w.color} relative overflow-hidden`}>
          {/* Rubik face pattern grid as decorative background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-15">
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3,1fr)",
              gap: 10, width: 200, height: 200,
            }}>
              {bgPatterns[index].map((key, i) => (
                <div key={i} style={{
                  background: RUBIK[key], borderRadius: 6,
                  opacity: i % 2 === 0 ? 0.9 : 0.3,
                  boxShadow: `0 0 16px ${RUBIK[key]}88`,
                }} />
              ))}
            </div>
          </div>

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: `radial-gradient(ellipse at 40% 40%, ${color}22, transparent 60%)` }} />

          {/* Corner Rubik face on hover */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-90 transition-all duration-500"
            style={{ transform: "scale(0.8) rotate(-8deg) group-hover:scale(1)" }}>
            <RubikFace pattern={bgPatterns[index]} size={42} />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-7">
          {/* Tag with color sticker */}
          <div className="mb-3 flex items-center gap-2">
            <div style={{ width: 9, height: 9, borderRadius: 2, background: color, flexShrink: 0 }} />
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color }}>{w.tag}</span>
          </div>

          <h3 className="mb-3 text-xl font-black leading-tight tracking-tight">{w.title}</h3>
          <p className="mb-6 flex-1 text-sm leading-relaxed" style={{ color: "rgba(240,244,248,0.5)" }}>{w.desc}</p>

          <div className="group/link flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
            style={{ color: "var(--brand-light)" }}>
            View case study
            <span className="transition-transform duration-200 group-hover:translate-x-1.5">→</span>
          </div>
        </div>

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${color}88, transparent)` }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   TESTIMONIALS  — cube-bracket cards
───────────────────────────────────────────────────── */
function Testimonials() {
  const [headRef, headVis] = useReveal(0.2);

  return (
    <section id="testimonials" className="relative z-10 px-6 py-28 overflow-hidden">
      {/* Ghost deco */}
      <div className="pointer-events-none absolute top-8 right-4 opacity-[0.04]"
        style={{ transform: "rotate(22deg)", animation: "floatY 10s ease-in-out infinite 0.5s" }}>
        <RubikFace pattern={["w","g","b","r","y","o","b","w","g"]} size={200} />
      </div>

      <div className="mx-auto max-w-7xl">
        <div
          ref={headRef}
          style={{
            opacity: headVis ? 1 : 0,
            transform: headVis ? "none" : "translateY(24px)",
            transition: "opacity 0.7s, transform 0.7s",
          }}
        >
          <SectionLabel number="06" label="Client stories" />
          <h2 className="mb-16 font-black leading-none tracking-tight" style={{ fontSize: "clamp(2.4rem,5.5vw,4.8rem)" }}>
            Trusted by teams<br /><GradText>that move fast.</GradText>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <TestiCard key={i} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestiCard({ t, index }: { t: typeof TESTIMONIALS[number]; index: number }) {
  const [revealRef, vis] = useReveal(0.2);
  const tilt = useTilt(7);
  const color = TESTI_COLORS[index];

  /* Cube corner bracket helper */
  const CubeCorner = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
    const top    = pos.startsWith("t") ? 0 : undefined;
    const bottom = pos.startsWith("b") ? 0 : undefined;
    const left   = pos.endsWith("l")  ? 0 : undefined;
    const right  = pos.endsWith("r")  ? 0 : undefined;
    const bx     = pos.endsWith("l")  ? "borderLeft" : "borderRight";
    const by     = pos.startsWith("t") ? "borderTop"  : "borderBottom";
    return (
      <div className="absolute" style={{ top, bottom, left, right, width: 18, height: 18, [bx]: `2px solid ${color}`, [by]: `2px solid ${color}`, opacity: 0.6 }} />
    );
  };

  return (
    <div
      ref={revealRef}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : `translateY(${36 + index * 10}px)`,
        transition: `opacity 0.75s ${index * 130}ms, transform 0.75s ${index * 130}ms cubic-bezier(0.22,1,0.36,1)`,
      }}
    >
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="group relative flex flex-col overflow-hidden rounded-3xl p-8"
        style={{
          background: "rgba(4,10,22,0.8)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(22px)",
          willChange: "transform",
        }}
      >
        {/* Cube corner brackets */}
        <CubeCorner pos="tl" />
        <CubeCorner pos="tr" />
        <CubeCorner pos="bl" />
        <CubeCorner pos="br" />

        {/* Star ratings as Rubik sticker squares */}
        <div className="mb-5 flex gap-1.5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                width: 14, height: 14, borderRadius: 3,
                background: color,
                opacity: i < 4 ? 1 : 0.5,
                boxShadow: `0 0 8px ${color}66`,
                animation: vis ? `stickerPop 0.4s ${i * 60 + index * 130}ms both` : "none",
              }}
            />
          ))}
        </div>

        {/* Quote */}
        <p className="mb-8 flex-1 text-base leading-relaxed" style={{ color: "rgba(240,244,248,0.7)" }}>
          &ldquo;{t.quote}&rdquo;
        </p>

        {/* Author row */}
        <div className="flex items-center gap-4 border-t pt-6" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          {/* Avatar as Rubik-face sticker */}
          <div
            className="flex h-11 w-11 items-center justify-center font-black text-sm"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}88)`,
              color: "#03070e",
              borderRadius: 10,
              boxShadow: `0 0 20px ${color}44`,
            }}
          >
            {t.name[0]}
          </div>
          <div>
            <div className="font-bold text-sm">{t.name}</div>
            <div className="text-xs" style={{ color: "rgba(240,244,248,0.4)" }}>{t.role}</div>
          </div>
        </div>

        {/* Hover Rubik face peek */}
        <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-70 transition-all duration-500"
          style={{ transform: "rotate(12deg)" }}>
          <RubikFace
            pattern={WHY_STICKERS[index % 6]}
            size={40}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   CTA  — morphing Three.js blob
───────────────────────────────────────────────────── */
function CTA() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ref, vis] = useReveal(0.1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
    camera.position.z = 5;
    const resize = () => {
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);
      camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    scene.add(new THREE.AmbientLight(0x112244, 1.8));
    const dl  = new THREE.DirectionalLight(0xffffff, 2.5);
    dl.position.set(4, 6, 6); scene.add(dl);
    const pl1 = new THREE.PointLight(0x0090d0, 220, 40);
    pl1.position.set(-5, 0, 4); scene.add(pl1);
    const pl2 = new THREE.PointLight(0x00cfff, 130, 30);
    pl2.position.set(5, 4, -2); scene.add(pl2);
    const geo     = new THREE.IcosahedronGeometry(2.2, 4);
    const origPos = Float32Array.from(geo.attributes.position.array as Float32Array);
    const count   = geo.attributes.position.count;
    const mat     = new THREE.MeshStandardMaterial({ color: 0x012a5e, metalness: 0.9, roughness: 0.08, emissive: new THREE.Color(0x003880), emissiveIntensity: 0.7 });
    const mesh    = new THREE.Mesh(geo, mat); scene.add(mesh);
    const wireGeo = new THREE.IcosahedronGeometry(2.26, 2);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x40b8ff, transparent: true, opacity: 0.28 });
    const wire    = new THREE.LineSegments(new THREE.EdgesGeometry(wireGeo), wireMat); scene.add(wire);
    let raf = 0;
    const t0 = performance.now() / 1000;
    const tick = () => {
      const t   = performance.now() / 1000 - t0;
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const ox = origPos[i * 3], oy = origPos[i * 3 + 1], oz = origPos[i * 3 + 2];
        const n  = Math.sin(ox * 2 + t * 1.1) * Math.cos(oy * 2.2 + t * 0.9) * Math.sin(oz * 1.8 + t * 1.2);
        pos[i * 3] = ox * (1 + n * 0.11);
        pos[i * 3 + 1] = oy * (1 + n * 0.11);
        pos[i * 3 + 2] = oz * (1 + n * 0.11);
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals();
      mesh.rotation.x = t * 0.1; mesh.rotation.y = t * 0.15;
      wire.rotation.x = t * 0.07; wire.rotation.y = t * 0.12;
      pl1.intensity = 200 + Math.sin(t * 1.2) * 60;
      pl2.intensity = 110 + Math.cos(t * 0.8) * 40;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      geo.dispose(); wireGeo.dispose(); mat.dispose(); wireMat.dispose(); renderer.dispose();
    };
  }, []);

  return (
    <section id="contact" className="relative z-10 overflow-hidden" style={{ minHeight: "88vh" }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ opacity: 0.5 }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 75% 85% at 50% 50%,rgba(3,7,14,0.2),rgba(3,7,14,0.82))" }} />

      {/* Floating Rubik faces in corners */}
      <div className="pointer-events-none absolute top-10 left-8 opacity-15"
        style={{ animation: "floatY 6s ease-in-out infinite" }}>
        <RubikFace pattern={["r","b","g","o","y","w","b","r","g"]} size={60} />
      </div>
      <div className="pointer-events-none absolute bottom-14 right-10 opacity-15"
        style={{ animation: "floatY 8s ease-in-out infinite 1.5s" }}>
        <RubikFace pattern={["g","w","r","b","o","y","w","g","b"]} size={50} />
      </div>
      <div className="pointer-events-none absolute top-1/4 right-16 opacity-10"
        style={{ animation: "floatY 10s ease-in-out infinite 3s" }}>
        <RubikFace pattern={["y","r","b","w","g","o","r","y","w"]} size={40} />
      </div>

      <div
        ref={ref}
        className="relative z-10 flex min-h-[88vh] flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: vis ? 1 : 0,
          transform: vis ? "none" : "translateY(32px)",
          transition: "opacity 0.9s, transform 0.9s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <SectionLabel number="07" label="Let's work together" center />

        {/* Rubik sticker row above heading */}
        <div className="mt-2 mb-6 flex items-center justify-center gap-2">
          {(["r","o","y","g","b","w"] as RubikKey[]).map((k, i) => (
            <div
              key={k}
              style={{
                width: 14, height: 14, borderRadius: 3,
                background: RUBIK[k],
                boxShadow: `0 0 10px ${RUBIK[k]}66`,
                animation: vis ? `stickerPop 0.4s ${i * 60 + 200}ms both` : "none",
              }}
            />
          ))}
        </div>

        <h2 className="font-black leading-[0.88] tracking-tight" style={{ fontSize: "clamp(3rem,8.5vw,8rem)" }}>
          Got something<br />
          <span className="italic" style={{
            background: "linear-gradient(95deg,#0a90d8,#40d8ff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            worth building?
          </span>
        </h2>

        <p className="mx-auto mt-8 max-w-lg text-xl leading-relaxed" style={{ color: "rgba(240,244,248,0.55)" }}>
          Tell us about your project. We respond to every serious inquiry within 24 hours.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:hello@threeplug.com"
            className="rounded-full px-10 py-5 text-lg font-bold transition-all hover:scale-105"
            style={{ background: "var(--brand-light)", color: "#03070e", boxShadow: "0 0 52px rgba(10,144,216,0.45)" }}
          >
            hello@threeplug.com
          </a>
          <a
            href="#top"
            className="rounded-full border px-10 py-5 text-lg font-semibold transition-all hover:bg-white/8"
            style={{ borderColor: "rgba(255,255,255,0.18)", color: "#f0f4f8" }}
          >
            Book a call
          </a>
        </div>

        <div className="mt-16 flex gap-8">
          {["LinkedIn", "Dribbble", "GitHub", "Instagram"].map((s) => (
            <a key={s} href="#" className="font-mono text-xs uppercase tracking-widest transition-colors hover:text-white"
              style={{ color: "rgba(240,244,248,0.28)" }}>{s}</a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────── */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative z-10 px-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(2,5,12,0.94)", backdropFilter: "blur(22px)" }}
    >
      <div className="mx-auto max-w-7xl py-16">
        {/* Rubik face colour strip at top */}
        <div className="mb-14 flex h-0.5 overflow-hidden rounded-full">
          {(["r","o","y","g","b","w"] as RubikKey[]).map((k) => (
            <div key={k} className="flex-1" style={{ background: RUBIK[k], animation: "borderPulse 3s ease-in-out infinite" }} />
          ))}
        </div>

        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          {/* Brand col */}
          <div>
            <div className="mb-5 flex items-center gap-4">
              <Image src="/logo.png" alt="Three Plug" width={56} height={56} className="h-14 w-auto object-contain" />
              <div>
                <div className="font-black tracking-tight text-white text-base leading-tight">THREE PLUG</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(10,144,216,0.7)" }}>Software Solutions</div>
              </div>
            </div>
            <p className="mb-6 text-sm leading-relaxed" style={{ color: "rgba(240,244,248,0.35)" }}>
              Full-service digital studio specialising in intelligent automation, performance marketing, 3D animation, and custom software development.
            </p>
            {/* Small Rubik face */}
            <div className="mb-5 opacity-50 hover:opacity-100 transition-opacity duration-300">
              <RubikFace pattern={["b","w","r","g","b","o","y","b","g"]} size={44} />
            </div>
            <div className="flex gap-3">
              {["in","dr","gh","ig"].map((s) => (
                <a key={s} href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-bold uppercase transition-all hover:scale-110"
                  style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(240,244,248,0.4)", background: "rgba(255,255,255,0.04)" }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Services" links={["Intelligent Automation","Digital Marketing","3D Animation","Custom Software","AI Integration","DevOps & Cloud"]} color={RUBIK.b} />
          <FooterCol title="Company"  links={["About us","Our process","Case studies","Blog","Careers","Press kit"]} color={RUBIK.g} />
          <FooterCol title="Resources" links={["Documentation","Free tools","Templates","Webinars","Newsletter","Affiliate"]} color={RUBIK.y} />

          {/* Contact col */}
          <div>
            <div className="mb-5 flex items-center gap-2">
              <div style={{ width: 7, height: 7, borderRadius: 1, background: RUBIK.r }} />
              <div className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: "rgba(240,244,248,0.3)" }}>Contact</div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Email",    value: "hello@threeplug.com" },
                { label: "Phone",    value: "+1 (800) 000-0000" },
                { label: "Location", value: "Global · Remote-first" },
              ].map((c) => (
                <div key={c.label}>
                  <div className="font-mono text-[10px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(10,144,216,0.6)" }}>{c.label}</div>
                  <div className="text-sm" style={{ color: "rgba(240,244,248,0.5)" }}>{c.value}</div>
                </div>
              ))}
            </div>
            <a
              href="#contact"
              className="mt-6 inline-flex rounded-full px-5 py-2.5 text-xs font-bold transition-all hover:scale-105"
              style={{ background: "var(--brand-light)", color: "#03070e" }}
            >
              Get in touch →
            </a>
          </div>
        </div>
      </div>

      <div
        className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t py-7 text-xs sm:flex-row"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <span className="font-mono uppercase tracking-widest" style={{ color: "rgba(240,244,248,0.2)" }}>
          © {year} Three Plug Software Solutions. All rights reserved.
        </span>
        <div className="flex gap-6">
          {["Privacy Policy","Terms of Service","Cookie Policy"].map((l) => (
            <a key={l} href="#" className="transition-colors hover:text-white" style={{ color: "rgba(240,244,248,0.25)" }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, color }: { title: string; links: string[]; color: string }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <div style={{ width: 7, height: 7, borderRadius: 1, background: color, boxShadow: `0 0 6px ${color}88` }} />
        <div className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: "rgba(240,244,248,0.3)" }}>{title}</div>
      </div>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm transition-colors hover:text-white" style={{ color: "rgba(240,244,248,0.42)" }}>{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── SHARED ─── */
function SectionLabel({ number, label, center }: { number: string; label: string; center?: boolean }) {
  return (
    <div className={`mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] ${center ? "justify-center" : ""}`}>
      <span style={{ color: "var(--brand-light)" }}>{number}</span>
      <span style={{ color: "rgba(240,244,248,0.25)" }}>—</span>
      <span style={{ color: "rgba(240,244,248,0.38)" }}>{label}</span>
    </div>
  );
}

function GradText({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: "linear-gradient(95deg,#0a90d8,#40d8ff)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    }}>
      {children}
    </span>
  );
}
