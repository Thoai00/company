"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import CubeBackground from "./Cubebackground";

/* ─── data ─── */
const SERVICES = [
  {
    id: "01", title: "Intelligent\nAutomation", short: "Automate",
    desc: "AI-powered workflows, RPA systems, and custom agents that eliminate repetitive work and run your operations around the clock.",
    tags: ["AI Agents", "RPA", "Workflow Automation", "ChatBots", "API Integration"],
    accent: "#0a90d8",
  },
  {
    id: "02", title: "Digital\nMarketing", short: "Market",
    desc: "Performance-first marketing — SEO, paid acquisition, analytics infrastructure, and content engines engineered to compound.",
    tags: ["SEO / SEM", "Paid Ads", "Analytics", "Growth Strategy", "Social Media"],
    accent: "#00c0ff",
  },
  {
    id: "03", title: "3D Animation\n& Visualization", short: "Animate",
    desc: "Photorealistic product renders, interactive WebGL experiences, motion graphics, and architectural visualizations.",
    tags: ["3D Renders", "Motion Graphics", "WebGL", "Product Viz", "AR/VR"],
    accent: "#40d8ff",
  },
  {
    id: "04", title: "Custom\nSoftware", short: "Build",
    desc: "Bespoke web and mobile applications, complex backends, and enterprise platforms built around your exact requirements.",
    tags: ["Web Apps", "Mobile", "APIs", "Cloud", "Enterprise"],
    accent: "#0070b0",
  },
];

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
  {
    icon: "⬡",
    title: "Senior talent only",
    body: "Every project is run by experienced engineers and strategists — no juniors, no outsourcing, no dilution.",
  },
  {
    icon: "◈",
    title: "Full-stack capability",
    body: "Automation, marketing, 3D, software — all in-house. One partner handles your entire digital operation.",
  },
  {
    icon: "◎",
    title: "On-time, on-scope",
    body: "We work in fixed-scope sprints with clear deliverables. No scope creep, no surprise invoices.",
  },
  {
    icon: "✦",
    title: "Outcome ownership",
    body: "We care about results, not just shipping. We track KPIs, iterate fast, and stay accountable to your goals.",
  },
  {
    icon: "⬔",
    title: "Direct communication",
    body: "No account managers. You talk directly to the people building your product, every day.",
  },
  {
    icon: "◇",
    title: "IP stays with you",
    body: "Every line of code, every asset, every strategy deck — full intellectual property transfer on completion.",
  },
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
    name: "James Okoye",
    role: "COO, Meridian Logistics",
  },
  {
    quote: "The 3D product animations they built for our launch campaign outperformed every other creative by 4×. Genuinely stunning work.",
    name: "Priya Sharma",
    role: "CMO, Luminary Health",
  },
  {
    quote: "They rebuilt our entire marketing stack from the ground up. Organic traffic up 280% in six months. These people know what they're doing.",
    name: "Daniel Müller",
    role: "Founder, NordRetail",
  },
];

const TICKER_ITEMS = [
  "AUTOMATION", "AI AGENTS", "DIGITAL MARKETING", "3D ANIMATION",
  "WEB APPS", "DEVOPS", "AR / VR", "SEO", "MOBILE", "CLOUD", "MOTION DESIGN",
];

/* ─────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="relative min-h-screen text-zinc-100 antialiased" style={{ background: "transparent" }}>
      <CubeBackground />

      {/* subtle grid */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage: "radial-gradient(ellipse 90% 90% at 50% 40%,black,transparent)",
      }} />

      <Hero />
      <Ticker />
      <Services />
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
   HERO  (no nav — logo is the anchor)
───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-16"
    >
      {/* glow behind cube area */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 55% 55% at 70% 50%, rgba(10,144,216,0.14), transparent 70%)",
      }} />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* ── LOGO ── */}
        <div className="mb-12 flex items-center gap-5">
          <div className="relative">
            {/* glow ring */}
            <div className="absolute -inset-3 rounded-full opacity-40"
              style={{ background: "radial-gradient(circle, rgba(10,144,216,0.5), transparent 70%)", filter: "blur(12px)" }}
            />
            <Image
              src="/logo.png"
              alt="Three Plug Software Solutions"
              width={130} height={130}
              className="relative h-32 w-auto object-contain drop-shadow-[0_0_24px_rgba(10,144,216,0.6)]"
              priority
            />
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight leading-none text-white">THREE PLUG</div>
            <div className="mt-1 font-mono text-xs uppercase tracking-[0.22em]" style={{ color: "rgba(10,144,216,0.8)" }}>
              Software Solutions
            </div>
          </div>
        </div>

        {/* ── HEADLINE ── */}
        <div className="grid gap-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-widest"
              style={{ borderColor: "rgba(10,144,216,0.3)", background: "rgba(10,144,216,0.07)", color: "var(--brand-light)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--brand-light)" }} />
              Full-service digital studio
            </div>

            <h1
              className="font-black leading-[0.87] tracking-tight"
              style={{ fontSize: "clamp(3.8rem, 9.5vw, 9rem)", textShadow: "0 4px 80px rgba(3,7,14,0.6)" }}
            >
              Automate.
              <br />
              <span className="italic" style={{
                background: "linear-gradient(95deg, #0a90d8 0%, #40d8ff 60%, #0a90d8 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Market.
              </span>
              <br />
              Animate.
            </h1>

            <p
              className="mt-8 max-w-lg text-xl leading-relaxed"
              style={{ color: "rgba(240,244,248,0.6)", textShadow: "0 2px 30px rgba(3,7,14,0.8)" }}
            >
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

          {/* inline stat strip */}
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

      {/* scroll cue */}
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
      }}
    >
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
   SERVICES
───────────────────────────────────────────────────── */
function Services() {
  return (
    <section id="services" className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <SectionLabel number="01" label="What we do" />
        <div className="mb-20 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="font-black leading-none tracking-tight"
            style={{ fontSize: "clamp(2.6rem,6vw,5.2rem)" }}>
            One studio.<br />
            <GradText>Every service</GradText> you need.
          </h2>
          <p className="max-w-sm text-base leading-relaxed md:text-right"
            style={{ color: "rgba(240,244,248,0.45)" }}>
            Automation, marketing, 3D, software — four disciplines, zero hand-offs, one team that owns your outcomes.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {SERVICES.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service: s }: { service: typeof SERVICES[number] }) {
  const cardRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return;
    const r  = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const ny = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    el.style.transform = `perspective(900px) rotateX(${-ny * 5}deg) rotateY(${nx * 5}deg) scale(1.02)`;
  };
  const resetTilt = () => { if (cardRef.current) cardRef.current.style.transform = ""; };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(110, 110, false);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
    camera.position.z = 4;

    scene.add(new THREE.AmbientLight(0x334466, 2.5));
    const dl = new THREE.DirectionalLight(0xffffff, 3); dl.position.set(2, 3, 4); scene.add(dl);
    const pl = new THREE.PointLight(0x0090d0, 100, 30); pl.position.set(-3, -2, 3); scene.add(pl);

    const geoMap = [
      new THREE.TorusKnotGeometry(0.85, 0.26, 80, 14),
      new THREE.IcosahedronGeometry(1.05, 1),
      new THREE.OctahedronGeometry(1.15, 0),
      new THREE.BoxGeometry(1.35, 1.35, 1.35),
    ];
    const geo = geoMap[parseInt(s.id) - 1] ?? geoMap[0];
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(s.accent), metalness: 0.8, roughness: 0.12,
      emissive: new THREE.Color(s.accent), emissiveIntensity: 0.3,
    });
    const mesh  = new THREE.Mesh(geo, mat); scene.add(mesh);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0x80e8ff, transparent: true, opacity: 0.45 })
    );
    mesh.add(edges);

    let raf = 0;
    const tick = () => { mesh.rotation.x += 0.007; mesh.rotation.y += 0.011; renderer.render(scene, camera); raf = requestAnimationFrame(tick); };
    tick();
    return () => { cancelAnimationFrame(raf); geo.dispose(); mat.dispose(); renderer.dispose(); };
  }, [s.id, s.accent]);

  return (
    <div ref={cardRef} onMouseMove={tilt} onMouseLeave={resetTilt}
      className="group relative overflow-hidden rounded-3xl p-8"
      style={{
        background: "rgba(4,10,22,0.6)", border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(22px)", transformStyle: "preserve-3d",
        transition: "transform 0.15s ease, box-shadow 0.3s ease",
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%,${s.accent}1e,transparent 70%)`, border: `1px solid ${s.accent}38` }} />

      <div className="relative z-10 flex items-start justify-between">
        <span className="font-mono text-xs uppercase tracking-widest" style={{ color: s.accent }}>{s.id}</span>
        <canvas ref={canvasRef} width={110} height={110} className="opacity-85" />
      </div>

      <div className="relative z-10 -mt-2">
        <h3 className="mb-4 whitespace-pre-line font-black leading-tight tracking-tight"
          style={{ fontSize: "clamp(1.7rem,2.8vw,2.4rem)" }}>
          {s.title}
        </h3>
        <p className="mb-6 text-sm leading-relaxed" style={{ color: "rgba(240,244,248,0.55)" }}>{s.desc}</p>
        <div className="flex flex-wrap gap-2">
          {s.tags.map((t) => (
            <span key={t} className="rounded-full px-3 py-1 font-mono text-xs"
              style={{ border: `1px solid ${s.accent}30`, color: "rgba(240,244,248,0.5)", background: `${s.accent}0b` }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-7 right-7 text-xl opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1"
        style={{ color: s.accent }}>↗</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   WHY CHOOSE THREE PLUG
───────────────────────────────────────────────────── */
function WhyUs() {
  return (
    <section id="why" className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <SectionLabel number="02" label="Why Three Plug" />
        <h2 className="mb-16 font-black leading-none tracking-tight" style={{ fontSize: "clamp(2.4rem,5.5vw,4.8rem)" }}>
          The studio that<br /><GradText>ships and stays.</GradText>
        </h2>

        <div className="grid gap-px overflow-hidden rounded-3xl"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {WHY.map((w, i) => (
            <WhyCard key={i} {...w} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref}
      className="group p-8 transition-all duration-700"
      style={{
        background: "rgba(3,7,14,0.7)", backdropFilter: "blur(16px)",
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)",
      }}
    >
      <div className="mb-5 text-3xl" style={{ color: "var(--brand-light)" }}>{icon}</div>
      <h3 className="mb-3 text-lg font-black tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(240,244,248,0.5)" }}>{body}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   PROCESS
───────────────────────────────────────────────────── */
function Process() {
  return (
    <section id="process" className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <SectionLabel number="03" label="How we work" />
        <h2 className="mb-16 font-black leading-none tracking-tight" style={{ fontSize: "clamp(2.4rem,5.5vw,4.8rem)" }}>
          Built for<br /><GradText>momentum.</GradText>
        </h2>

        <div className="relative grid gap-0 md:grid-cols-4">
          <div className="absolute top-8 left-0 right-0 hidden h-px md:block"
            style={{ background: "linear-gradient(90deg,transparent,rgba(10,144,216,0.35) 20%,rgba(10,144,216,0.35) 80%,transparent)" }} />
          {PROCESS.map((step, i) => <ProcessStep key={i} step={step} />)}
        </div>
      </div>
    </section>
  );
}

function ProcessStep({ step }: { step: typeof PROCESS[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative m-1 p-8 transition-all duration-700"
      style={{
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
        background: "rgba(4,10,22,0.5)", backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px",
      }}
    >
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl font-mono text-sm font-bold"
        style={{ border: "1px solid rgba(10,144,216,0.4)", background: "rgba(10,144,216,0.1)", color: "var(--brand-light)" }}>
        {step.n}
      </div>
      <h3 className="mb-3 text-xl font-black tracking-tight">{step.title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(240,244,248,0.5)" }}>{step.body}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   ABOUT / STATS
───────────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <SectionLabel number="04" label="The studio" />
            <h2 className="mb-8 font-black leading-none tracking-tight" style={{ fontSize: "clamp(2.4rem,5vw,4.5rem)" }}>
              Senior talent.<br /><GradText>Zero layers.</GradText>
            </h2>
            <p className="mb-6 text-lg leading-relaxed" style={{ color: "rgba(240,244,248,0.62)" }}>
              Three Plug is a tight-knit studio of engineers, designers, and marketers who have
              all done this before. You work directly with the people building your product —
              no account managers, no hand-offs, no dilution.
            </p>
            <p className="mb-10 text-lg leading-relaxed" style={{ color: "rgba(240,244,248,0.42)" }}>
              Whether it&apos;s an AI automation system, a conversion-optimised marketing funnel,
              or a cinematic 3D brand film — we own the outcome start to finish.
            </p>
            <a href="#contact"
              className="inline-flex rounded-full border px-7 py-3.5 font-semibold transition-all hover:bg-white/8"
              style={{ borderColor: "rgba(10,144,216,0.4)", color: "var(--brand-light)" }}>
              Meet the team →
            </a>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
            {STATS.map((s, i) => <StatBox key={i} {...s} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBox({ to, suffix, label }: { to: number; suffix?: string; label: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const t0 = performance.now(), dur = 1600;
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick); obs.disconnect();
    }, { threshold: 0.5 });
    obs.observe(el); return () => obs.disconnect();
  }, [to]);
  return (
    <div ref={ref} className="flex flex-col justify-between p-10"
      style={{ background: "rgba(3,7,14,0.75)", backdropFilter: "blur(16px)" }}>
      <div className="font-black leading-none tracking-tight"
        style={{ fontSize: "clamp(3rem,5vw,4.5rem)", color: "var(--brand-light)" }}>
        {val}{suffix}
      </div>
      <div className="mt-3 text-sm" style={{ color: "rgba(240,244,248,0.4)" }}>{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   FEATURED WORK
───────────────────────────────────────────────────── */
function FeaturedWork() {
  return (
    <section id="work" className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <SectionLabel number="05" label="Featured work" />
            <h2 className="font-black leading-none tracking-tight" style={{ fontSize: "clamp(2.4rem,5.5vw,4.8rem)" }}>
              Results,<br /><GradText>not promises.</GradText>
            </h2>
          </div>
          <a href="#contact"
            className="hidden rounded-full border px-6 py-3 font-semibold transition-all hover:bg-white/8 md:block"
            style={{ borderColor: "rgba(255,255,255,0.14)", color: "rgba(240,244,248,0.55)" }}>
            See all work →
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {WORK.map((w, i) => <WorkCard key={i} work={w} />)}
        </div>
      </div>
    </section>
  );
}

function WorkCard({ work: w }: { work: typeof WORK[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref}
      className="group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-700 hover:-translate-y-1"
      style={{
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(28px)",
        background: "rgba(4,10,22,0.6)", border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* gradient image placeholder */}
      <div className={`h-52 bg-linear-to-br ${w.color} relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="h-32 w-32 rounded-full border-2 border-white/40" />
          <div className="absolute h-20 w-20 rounded-full border border-white/30" />
        </div>
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(10,144,216,0.15), transparent 60%)" }} />
      </div>

      <div className="flex flex-1 flex-col p-7">
        <span className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: "var(--brand-light)" }}>{w.tag}</span>
        <h3 className="mb-3 text-xl font-black leading-tight tracking-tight">{w.title}</h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed" style={{ color: "rgba(240,244,248,0.5)" }}>{w.desc}</p>
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-colors"
          style={{ color: "var(--brand-light)" }}>
          View case study
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────────────── */
function Testimonials() {
  return (
    <section id="testimonials" className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <SectionLabel number="06" label="Client stories" />
        <h2 className="mb-16 font-black leading-none tracking-tight" style={{ fontSize: "clamp(2.4rem,5.5vw,4.8rem)" }}>
          Trusted by teams<br /><GradText>that move fast.</GradText>
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => <TestiCard key={i} t={t} />)}
        </div>
      </div>
    </section>
  );
}

function TestiCard({ t }: { t: typeof TESTIMONIALS[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="flex flex-col rounded-3xl p-8 transition-all duration-700"
      style={{
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
        background: "rgba(4,10,22,0.6)", border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* stars */}
      <div className="mb-5 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-sm" style={{ color: "var(--brand-light)" }}>★</span>
        ))}
      </div>
      <p className="mb-8 flex-1 text-base leading-relaxed" style={{ color: "rgba(240,244,248,0.65)" }}>
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-4 border-t pt-6" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        {/* avatar placeholder */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full font-black text-sm"
          style={{ background: "linear-gradient(135deg,#0a90d8,#40d8ff)", color: "#03070e" }}>
          {t.name[0]}
        </div>
        <div>
          <div className="font-bold text-sm">{t.name}</div>
          <div className="text-xs" style={{ color: "rgba(240,244,248,0.4)" }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   CTA  — morphing Three.js blob background
───────────────────────────────────────────────────── */
function CTA() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const resize = () => { renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false); camera.aspect = canvas.offsetWidth / canvas.offsetHeight; camera.updateProjectionMatrix(); };
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
    camera.position.z = 5;
    resize();

    scene.add(new THREE.AmbientLight(0x112244, 1.8));
    const dl  = new THREE.DirectionalLight(0xffffff, 2.5); dl.position.set(4, 6, 6); scene.add(dl);
    const pl1 = new THREE.PointLight(0x0090d0, 220, 40);   pl1.position.set(-5, 0, 4); scene.add(pl1);
    const pl2 = new THREE.PointLight(0x00cfff, 130, 30);   pl2.position.set(5, 4, -2); scene.add(pl2);

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
        const ox = origPos[i*3], oy = origPos[i*3+1], oz = origPos[i*3+2];
        const n  = Math.sin(ox*2+t*1.1)*Math.cos(oy*2.2+t*0.9)*Math.sin(oz*1.8+t*1.2);
        pos[i*3]=ox*(1+n*0.11); pos[i*3+1]=oy*(1+n*0.11); pos[i*3+2]=oz*(1+n*0.11);
      }
      geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
      mesh.rotation.x=t*0.1; mesh.rotation.y=t*0.15;
      wire.rotation.x=t*0.07; wire.rotation.y=t*0.12;
      pl1.intensity = 200+Math.sin(t*1.2)*60; pl2.intensity = 110+Math.cos(t*0.8)*40;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); geo.dispose(); wireGeo.dispose(); mat.dispose(); wireMat.dispose(); renderer.dispose(); };
  }, []);

  return (
    <section id="contact" className="relative z-10 overflow-hidden" style={{ minHeight: "88vh" }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ opacity: 0.5 }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 75% 85% at 50% 50%,rgba(3,7,14,0.2),rgba(3,7,14,0.82))" }} />

      <div className="relative z-10 flex min-h-[88vh] flex-col items-center justify-center px-6 text-center">
        <SectionLabel number="07" label="Let's work together" center />
        <h2 className="mt-4 font-black leading-[0.88] tracking-tight"
          style={{ fontSize: "clamp(3rem,8.5vw,8rem)" }}>
          Got something<br />
          <span className="italic" style={{ background: "linear-gradient(95deg,#0a90d8,#40d8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            worth building?
          </span>
        </h2>
        <p className="mx-auto mt-8 max-w-lg text-xl leading-relaxed" style={{ color: "rgba(240,244,248,0.55)" }}>
          Tell us about your project. We respond to every serious inquiry within 24 hours.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a href="mailto:hello@threeplug.com"
            className="rounded-full px-10 py-5 text-lg font-bold transition-all hover:scale-105"
            style={{ background: "var(--brand-light)", color: "#03070e", boxShadow: "0 0 52px rgba(10,144,216,0.45)" }}>
            hello@threeplug.com
          </a>
          <a href="#top"
            className="rounded-full border px-10 py-5 text-lg font-semibold transition-all hover:bg-white/8"
            style={{ borderColor: "rgba(255,255,255,0.18)", color: "#f0f4f8" }}>
            Book a call
          </a>
        </div>
        <div className="mt-16 flex gap-8">
          {["LinkedIn", "Dribbble", "GitHub", "Instagram"].map((s) => (
            <a key={s} href="#"
              className="font-mono text-xs uppercase tracking-widest transition-colors hover:text-white"
              style={{ color: "rgba(240,244,248,0.28)" }}>{s}</a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   FOOTER  — full multi-column corporate footer
───────────────────────────────────────────────────── */
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 px-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(2,5,12,0.9)", backdropFilter: "blur(20px)" }}>

      {/* top block */}
      <div className="mx-auto max-w-7xl py-16">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">

          {/* brand column */}
          <div>
            <div className="mb-5 flex items-center gap-4">
              <Image src="/logo.png" alt="Three Plug" width={56} height={56} className="h-14 w-auto object-contain" />
              <div>
                <div className="font-black tracking-tight text-white text-base leading-tight">THREE PLUG</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(10,144,216,0.7)" }}>Software Solutions</div>
              </div>
            </div>
            <p className="mb-6 text-sm leading-relaxed" style={{ color: "rgba(240,244,248,0.38)" }}>
              Full-service digital studio specialising in intelligent automation, performance marketing, 3D animation, and custom software development.
            </p>
            <div className="flex gap-4">
              {["in", "dr", "gh", "ig"].map((s) => (
                <a key={s} href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-bold uppercase transition-all hover:scale-110"
                  style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(240,244,248,0.4)", background: "rgba(255,255,255,0.04)" }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <FooterCol title="Services" links={[
            "Intelligent Automation", "Digital Marketing", "3D Animation", "Custom Software", "AI Integration", "DevOps & Cloud",
          ]} />

          {/* Company */}
          <FooterCol title="Company" links={[
            "About us", "Our process", "Case studies", "Blog", "Careers", "Press kit",
          ]} />

          {/* Resources */}
          <FooterCol title="Resources" links={[
            "Documentation", "Free tools", "Templates", "Webinars", "Newsletter", "Affiliate",
          ]} />

          {/* Contact */}
          <div>
            <div className="mb-5 font-mono text-xs uppercase tracking-[0.18em]"
              style={{ color: "rgba(240,244,248,0.3)" }}>Contact</div>
            <div className="space-y-3">
              {[
                { label: "Email", value: "hello@threeplug.com" },
                { label: "Phone", value: "+1 (800) 000-0000" },
                { label: "Location", value: "Global · Remote-first" },
              ].map((c) => (
                <div key={c.label}>
                  <div className="font-mono text-[10px] uppercase tracking-widest mb-0.5"
                    style={{ color: "rgba(10,144,216,0.6)" }}>{c.label}</div>
                  <div className="text-sm" style={{ color: "rgba(240,244,248,0.5)" }}>{c.value}</div>
                </div>
              ))}
            </div>
            <a href="#contact"
              className="mt-6 inline-flex rounded-full px-5 py-2.5 text-xs font-bold transition-all hover:scale-105"
              style={{ background: "var(--brand-light)", color: "#03070e" }}>
              Get in touch →
            </a>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t py-7 text-xs sm:flex-row"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <span className="font-mono uppercase tracking-widest" style={{ color: "rgba(240,244,248,0.2)" }}>
          © {year} Three Plug Software Solutions. All rights reserved.
        </span>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
            <a key={l} href="#"
              className="transition-colors hover:text-white"
              style={{ color: "rgba(240,244,248,0.25)" }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="mb-5 font-mono text-xs uppercase tracking-[0.18em]"
        style={{ color: "rgba(240,244,248,0.3)" }}>{title}</div>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l}>
            <a href="#"
              className="text-sm transition-colors hover:text-white"
              style={{ color: "rgba(240,244,248,0.42)" }}>{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   SHARED
───────────────────────────────────────────────────── */
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
