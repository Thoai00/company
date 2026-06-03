"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */
const SVCS = [
  {
    id: "01", title: "ERP / CRM Development", short: "Enterprise Systems",
    metric: "40% ops cost reduction",
    desc: "Custom ERP and CRM platforms that unify every department — from finance and inventory to sales pipelines — into one connected, automated system built precisely for your business.",
    tags: ["ERP", "CRM", "Integrations", "Automation", "Reporting"],
    color: "#ef233c", wide: true,  icon: "grid"    as const,
  },
  {
    id: "02", title: "Software Development",   short: "Custom Builds",
    metric: "On-time. Every time.",
    desc: "Bespoke web and mobile applications, complex backends, and enterprise platforms engineered exactly to your spec — from first commit to full production scale.",
    tags: ["Web Apps", "Mobile", "APIs", "Cloud", "Backend"],
    color: "#f77f00", wide: false, icon: "code"    as const,
  },
  {
    id: "03", title: "Website Development",    short: "Web Presence",
    metric: "Sub-1s load times",
    desc: "High-performance websites built for speed, SEO, and conversion — from sharp marketing sites to full web platforms with seamless, intuitive UX.",
    tags: ["Next.js", "React", "CMS", "E-commerce", "SEO"],
    color: "#f4c842", wide: false, icon: "browser" as const,
  },
  {
    id: "04", title: "Three.js Web Experiences", short: "WebGL / Interactive",
    metric: "60 fps WebGL, always",
    desc: "Immersive websites powered by WebGL and Three.js — real-time 3D scenes, product configurators, and digital showrooms that stop the scroll and convert.",
    tags: ["Three.js", "WebGL", "GLSL", "React Three Fiber", "Interactive"],
    color: "#27ae60", wide: true,  icon: "cube"    as const,
  },
  {
    id: "05", title: "Digital Marketing",       short: "Growth Engine",
    metric: "3.4× avg ROAS delivered",
    desc: "Performance-first marketing — SEO, paid acquisition, analytics infrastructure, and compounding content engines engineered to grow your audience month over month.",
    tags: ["SEO / SEM", "Paid Ads", "Analytics", "Growth", "Social Media"],
    color: "#0a90d8", wide: true,  icon: "chart"   as const,
  },
  {
    id: "06", title: "3D Animation & Visualization", short: "Motion & Render",
    metric: "Photorealistic · 4K",
    desc: "Photorealistic product renders, cinematic brand films, motion graphics, and architectural visualizations that bring your brand to life in stunning, shareable detail.",
    tags: ["3D Renders", "Motion Graphics", "WebGL", "AR/VR", "Product Viz"],
    color: "#dce8f5", wide: false, icon: "animate" as const,
  },
] as const;

type Svc      = typeof SVCS[number];
type IconType = Svc["icon"];

/* ═══════════════════════════════════════════════════
   RUBIK COLOURS
═══════════════════════════════════════════════════ */
const RUBIK = {
  r: "#ef233c", o: "#f77f00", y: "#f4c842",
  g: "#27ae60", b: "#0a90d8", w: "#dce8f5",
} as const;
type RK = keyof typeof RUBIK;

const STICKERS: RK[][] = [
  ["r","w","b","g","r","o","y","r","g"],
  ["o","b","r","w","o","g","r","y","o"],
  ["y","r","o","b","y","w","o","g","y"],
  ["g","y","b","r","g","o","b","w","g"],
  ["b","w","r","g","b","o","y","b","g"],
  ["w","o","y","r","w","b","y","g","w"],
];

/* ═══════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════ */
function useReveal(threshold = 0.06) {
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

function useTilt(intensity = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const move = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * intensity;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -intensity;
    el.style.transition = "transform 0.07s linear";
    el.style.transform  = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg)`;
  }, [intensity]);
  const leave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transition = "transform 0.65s cubic-bezier(0.23,1,0.32,1)";
    el.style.transform  = "";
  }, []);
  return { ref, move, leave };
}

/* ═══════════════════════════════════════════════════
   RUBIK FACE STICKER
═══════════════════════════════════════════════════ */
function RubikFace({ pattern, size = 40 }: { pattern: RK[]; size?: number }) {
  const gap = Math.max(2, Math.round(size * 0.055));
  const pad = Math.max(3, Math.round(size * 0.082));
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(3,1fr)",
      gap, padding: pad, width: size, height: size,
      background: "#050a14",
      borderRadius: Math.round(size * 0.15),
      border: "1px solid rgba(255,255,255,0.15)",
      boxShadow: "0 4px 22px rgba(0,0,0,0.55)",
      flexShrink: 0,
    }}>
      {pattern.map((k, i) => (
        <div key={i} style={{
          background: RUBIK[k],
          borderRadius: Math.round(size * 0.045),
          boxShadow: `0 0 ${Math.round(size * 0.11)}px ${RUBIK[k]}60`,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SERVICE ICONS  (72 × 72 viewBox)
═══════════════════════════════════════════════════ */
function ServiceIcon({ type, color }: { type: IconType; color: string }) {
  const p = { width: 72, height: 72, viewBox: "0 0 72 72", fill: "none" } as const;

  if (type === "grid") {
    const cells: { r: number; c: number; lit: boolean }[] = [
      {r:0,c:0,lit:true},{r:0,c:1,lit:true},{r:0,c:2,lit:true},
      {r:1,c:0,lit:true},{r:1,c:1,lit:false},{r:1,c:2,lit:false},
      {r:2,c:0,lit:false},{r:2,c:1,lit:false},{r:2,c:2,lit:true},
    ];
    return (
      <svg {...p}>
        {cells.map(({ r, c, lit }) => (
          <rect key={`${r}${c}`}
            x={c * 23 + 3} y={r * 23 + 3} width={20} height={20} rx={4}
            fill={lit ? `${color}38` : "transparent"}
            stroke={color} strokeOpacity={lit ? 1 : 0.28} strokeWidth={1.5}
          />
        ))}
        {/* Connecting lines */}
        <line x1="13" y1="26" x2="13" y2="46" stroke={color} strokeWidth="1" strokeOpacity="0.22" strokeDasharray="2,3"/>
        <line x1="36" y1="26" x2="36" y2="46" stroke={color} strokeWidth="1" strokeOpacity="0.22" strokeDasharray="2,3"/>
      </svg>
    );
  }

  if (type === "code") {
    return (
      <svg {...p}>
        {/* < bracket */}
        <path d="M24 18 L8  36 L24 54" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* > bracket */}
        <path d="M48 18 L64 36 L48 54" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* / slash */}
        <path d="M40 14 L32 58" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.65"/>
      </svg>
    );
  }

  if (type === "browser") {
    return (
      <svg {...p}>
        <rect x="4"  y="12" width="64" height="48" rx="7"
          stroke={color} strokeWidth="1.5" fill={`${color}08`}/>
        <line x1="4" y1="26" x2="68" y2="26" stroke={color} strokeWidth="1.5" strokeOpacity="0.7"/>
        <circle cx="14" cy="19" r="3" fill={color} fillOpacity="0.8"/>
        <circle cx="24" cy="19" r="3" fill={color} fillOpacity="0.55"/>
        <circle cx="34" cy="19" r="3" fill={color} fillOpacity="0.3"/>
        <rect x="12" y="33" width="48" height="4" rx="2" fill={color} fillOpacity="0.45"/>
        <rect x="12" y="42" width="36" height="4" rx="2" fill={color} fillOpacity="0.3"/>
        <rect x="12" y="51" width="24" height="4" rx="2" fill={color} fillOpacity="0.18"/>
      </svg>
    );
  }

  if (type === "cube") {
    return (
      <svg {...p}>
        {/* Top face */}
        <polygon points="36,6 62,21 36,36 10,21"
          stroke={color} strokeWidth="1.5" fill={`${color}15`}/>
        {/* Left face */}
        <polygon points="10,21 36,36 36,66 10,51"
          stroke={color} strokeWidth="1.5" fill={`${color}08`}/>
        {/* Right face */}
        <polygon points="62,21 36,36 36,66 62,51"
          stroke={color} strokeWidth="1.5" fill={`${color}20`}/>
        {/* Hidden edges dashed */}
        <line x1="36" y1="6"  x2="36" y2="36" stroke={color} strokeWidth="1" strokeOpacity="0.35" strokeDasharray="3,3"/>
        <line x1="10" y1="21" x2="36" y2="36" stroke={color} strokeWidth="1" strokeOpacity="0.35" strokeDasharray="3,3"/>
        <line x1="62" y1="21" x2="36" y2="36" stroke={color} strokeWidth="1" strokeOpacity="0.35" strokeDasharray="3,3"/>
        {/* Center dot */}
        <circle cx="36" cy="36" r="2.5" fill={color} fillOpacity="0.9"/>
      </svg>
    );
  }

  if (type === "chart") {
    return (
      <svg {...p}>
        <rect x="6"  y="44" width="11" height="20" rx="3" fill={color} fillOpacity="0.35"/>
        <rect x="21" y="32" width="11" height="32" rx="3" fill={color} fillOpacity="0.55"/>
        <rect x="36" y="20" width="11" height="44" rx="3" fill={color} fillOpacity="0.75"/>
        <rect x="51" y="8"  width="11" height="56" rx="3" fill={color} fillOpacity="0.95"/>
        <line x1="4" y1="66" x2="68" y2="66" stroke={color} strokeWidth="1.5" strokeOpacity="0.35"/>
        {/* Trend arrow */}
        <path d="M10 50 L30 30 L52 16" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M46 12 L56 16 L52 26" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  /* animate — orbit rings */
  return (
    <svg {...p}>
      <ellipse cx="36" cy="36" rx="27" ry="11" stroke={color} strokeWidth="1.5" strokeOpacity="0.5"/>
      <ellipse cx="36" cy="36" rx="11" ry="27" stroke={color} strokeWidth="1.5" strokeOpacity="0.7"/>
      <circle  cx="36" cy="36" r="27"  stroke={color} strokeWidth="1"   strokeOpacity="0.22"/>
      <circle  cx="36" cy="36" r="5"   fill={color} fillOpacity="0.9"/>
      <circle  cx="63" cy="36" r="4"   fill={color}/>
      <path d="M57 30 L63 36 L57 42" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   SINGLE SERVICE CARD
═══════════════════════════════════════════════════ */
function ServiceCard({ svc, index, visible }: { svc: Svc; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  const tilt = useTilt(9);
  const { color, wide } = svc;
  const delay = `${index * 95}ms`;

  /* header height — taller on wide cards */
  const HDR = wide ? 230 : 210;

  return (
    /* reveal wrapper */
    <div
      className={`col-span-1 ${wide ? "lg:col-span-2" : ""}`}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "none" : `translateY(${44 + index * 8}px) scale(0.96)`,
        transition: `opacity 0.75s ${delay}, transform 0.75s ${delay} cubic-bezier(0.22,1,0.36,1)`,
        minHeight: 0,
      }}
    >
      {/* ── spinning-border shell ── */}
      <div
        className="relative h-full"
        style={{ padding: 1.5, borderRadius: 20, overflow: "hidden" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); tilt.leave(); }}
      >
        {/* static border colour */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `${color}30`, borderRadius: 20 }} />

        {/* spinning conic gradient — always rendered, opacity driven */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "200%", height: "200%",
            top: "-50%", left: "-50%",
            background: `conic-gradient(
              from 0deg,
              transparent   0deg,
              ${color}ee   65deg,
              transparent 130deg,
              ${color}55  240deg,
              transparent 310deg
            )`,
            animation: "spin 2.4s linear infinite",
            opacity:    hovered ? 1 : 0,
            transition: "opacity 0.45s",
          }}
        />

        {/* ── inner dark card ── */}
        <div
          ref={tilt.ref}
          onMouseMove={tilt.move}
          className="relative flex flex-col h-full"
          style={{ background: "#030912", borderRadius: 18.5, overflow: "hidden" }}
        >

          {/* ╔══════════════════ VISUAL HEADER ══════════════════╗ */}
          <div className="relative flex-shrink-0 overflow-hidden" style={{ height: HDR }}>

            {/* base dark gradient */}
            <div className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse at 55% 65%, ${color}22 0%, ${color}09 55%, transparent 85%)` }} />

            {/* dot-grid texture */}
            <div className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, ${color}24 1.2px, transparent 1.2px)`,
                backgroundSize: "24px 24px",
              }} />

            {/* diagonal line texture */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.07 }}>
              <defs>
                <pattern id={`dl${index}`} width="32" height="32" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                  <line x1="0" y1="16" x2="32" y2="16" stroke={color} strokeWidth="0.8"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#dl${index})`}/>
            </svg>

            {/* enormous watermark number */}
            <div
              className="absolute bottom-0 right-3 font-black leading-none select-none pointer-events-none"
              style={{
                fontSize: "clamp(90px, 14vw, 160px)",
                lineHeight: 0.82,
                color: color,
                opacity: hovered ? 0.18 : 0.08,
                transition: "opacity 0.5s",
                letterSpacing: "-0.04em",
              }}
            >
              {svc.id}
            </div>

            {/* hover inner glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 35% 55%, ${color}30, transparent 65%)`,
                opacity:    hovered ? 1 : 0,
                transition: "opacity 0.5s",
              }}
            />

            {/* scan shimmer — only when hovered */}
            <div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                height: "38%", top: "-18%",
                background: `linear-gradient(to bottom, transparent, ${color}1a, transparent)`,
                opacity:    hovered ? 1 : 0,
                transition: "opacity 0.35s",
                animation:  hovered ? "scanDown 2.6s linear infinite" : "none",
              }}
            />

            {/* ── icon — center ── */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                filter:    `drop-shadow(0 0 ${hovered ? 32 : 16}px ${color}${hovered ? "cc" : "77"})`,
                transform: `scale(${hovered ? 1.12 : 1})`,
                transition: "filter 0.45s, transform 0.45s cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              <ServiceIcon type={svc.icon} color={color} />
            </div>

            {/* service number + label — top left */}
            <div className="absolute top-4 left-5 flex items-center gap-2">
              <div
                className="font-mono text-xs font-black tracking-[0.28em] uppercase"
                style={{ color: `${color}dd` }}
              >
                {svc.id}
              </div>
              <div className="h-px w-6" style={{ background: `${color}55` }} />
              <div className="font-mono text-[9px] uppercase tracking-[0.22em]"
                style={{ color: `${color}66` }}>
                {svc.short}
              </div>
            </div>

            {/* Rubik sticker — top right */}
            <div
              className="absolute top-4 right-4 pointer-events-none"
              style={{
                opacity:    hovered ? 0.9 : 0.22,
                transform:  `scale(${hovered ? 1 : 0.88}) rotate(${hovered ? 0 : -6}deg)`,
                transition: "opacity 0.4s, transform 0.4s cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              <RubikFace pattern={STICKERS[index]} size={38} />
            </div>

            {/* metric badge — bottom left */}
            <div className="absolute bottom-4 left-5">
              <span
                className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
                style={{
                  background:  hovered ? `${color}28` : `${color}14`,
                  border:      `1px solid ${hovered ? `${color}66` : `${color}35`}`,
                  color:       hovered ? `${color}ee` : `${color}99`,
                  backdropFilter: "blur(10px)",
                  transition: "all 0.35s",
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: 1, background: color, flexShrink: 0, display: "inline-block" }} />
                {svc.metric}
              </span>
            </div>

            {/* bottom fade into card body */}
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{ height: 56, background: "linear-gradient(to bottom, transparent, #030912)" }}
            />
          </div>
          {/* ╚══════════════════ /HEADER ══════════════════╝ */}

          {/* ╔═════════════════ CONTENT BODY ═════════════════╗ */}
          <div className="flex flex-1 flex-col px-6 pt-3 pb-6">

            {/* animated accent bar */}
            <div
              className="mb-4 h-[2px] rounded-full"
              style={{
                width:      hovered ? 80 : 32,
                background: `linear-gradient(90deg, ${color}, ${color}44)`,
                transition: "width 0.45s cubic-bezier(0.23,1,0.32,1)",
                boxShadow:  hovered ? `0 0 12px ${color}88` : "none",
              }}
            />

            <h3
              className="mb-3 font-black leading-tight tracking-tight text-white"
              style={{ fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)" }}
            >
              {svc.title}
            </h3>

            <p
              className="mb-4 flex-1 text-sm leading-relaxed"
              style={{ color: "rgba(230,238,248,0.50)" }}
            >
              {svc.desc}
            </p>

            {/* tags */}
            <div className="mb-5 flex flex-wrap gap-1.5">
              {svc.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9.5px] uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: hovered ? `${color}44` : `${color}28`,
                    color:       hovered ? `${color}cc` : `${color}aa`,
                    background:  `${color}0e`,
                    transition:  "border-color 0.3s, color 0.3s",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA row */}
            <div
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
              style={{ color }}
            >
              <div
                style={{
                  width: 8, height: 8, borderRadius: 2,
                  background: color,
                  boxShadow:  hovered ? `0 0 10px ${color}` : "none",
                  transition: "box-shadow 0.35s",
                }}
              />
              Explore service
              <span
                className="ml-auto"
                style={{
                  transform:  hovered ? "translateX(5px)" : "translateX(0)",
                  transition: "transform 0.35s cubic-bezier(0.23,1,0.32,1)",
                  display: "inline-block",
                }}
              >→</span>
            </div>
          </div>
          {/* ╚═════════════════ /CONTENT ═════════════════╝ */}

        </div>{/* /inner dark card */}
      </div>{/* /spinning-border shell */}
    </div>/* /reveal wrapper */
  );
}

/* ═══════════════════════════════════════════════════
   SECTION
═══════════════════════════════════════════════════ */
export default function ServiceBoxes() {
  const [hdrRef,  hdrVis]  = useReveal(0.2);
  const [gridRef, gridVis] = useReveal(0.04);

  return (
    <section id="services" className="relative z-10 py-24 sm:py-28 overflow-hidden">
      {/* ── ghost Rubik face decorations ── */}
      <div
        className="pointer-events-none absolute top-10 right-4 opacity-[0.04]"
        style={{ transform: "rotate(16deg)", animation: "floatY 9s ease-in-out infinite" }}
      >
        <RubikFace pattern={["r","o","g","b","y","w","r","g","b"]} size={220} />
      </div>
      <div
        className="pointer-events-none absolute bottom-12 left-2 opacity-[0.03]"
        style={{ transform: "rotate(-11deg)", animation: "floatY 12s ease-in-out infinite 2.5s" }}
      >
        <RubikFace pattern={["b","g","r","y","w","o","g","b","r"]} size={170} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* ── Section heading ── */}
        <div
          ref={hdrRef}
          style={{
            opacity:    hdrVis ? 1 : 0,
            transform:  hdrVis ? "none" : "translateY(30px)",
            transition: "opacity 0.7s, transform 0.7s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* label */}
          <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em]">
            <span style={{ color: "#0a90d8" }}>01</span>
            <span style={{ color: "rgba(240,244,248,0.22)" }}>—</span>
            <span style={{ color: "rgba(240,244,248,0.36)" }}>What we do</span>
          </div>

          <div className="mb-4 flex flex-wrap items-end justify-between gap-6">
            <h2
              className="font-black leading-[0.88] tracking-tight text-white"
              style={{ fontSize: "clamp(2.6rem, 5.5vw, 5.2rem)" }}
            >
              Six services.<br />
              <span style={{
                background: "linear-gradient(95deg,#0a90d8,#40d8ff)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                One roof.
              </span>
            </h2>

            {/* Rubik colour row — desktop only */}
            <div className="hidden lg:flex items-center gap-2.5">
              {(Object.keys(RUBIK) as RK[]).map((k, i) => (
                <div
                  key={k}
                  style={{
                    width: 18, height: 18, borderRadius: 4,
                    background: RUBIK[k],
                    boxShadow: `0 0 14px ${RUBIK[k]}77`,
                    animation: hdrVis ? `stickerPop 0.4s ${i * 60 + 200}ms both` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          <p
            className="mb-14 text-base sm:text-lg max-w-xl"
            style={{ color: "rgba(230,238,248,0.4)" }}
          >
            Every capability your business needs — enterprise software, immersive WebGL, performance
            marketing, and cinematic 3D — all in one studio, under one roof.
          </p>
        </div>

        {/* ── Bento card grid ──
            Mobile  (< 640px) : 1 column
            Tablet  (640–1024): 2 columns, all cards width-1
            Desktop (1024px+) : 3 columns, wide cards span 2
        ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {SVCS.map((svc, i) => (
            <ServiceCard key={svc.id} svc={svc} index={i} visible={gridVis} />
          ))}
        </div>

      </div>
    </section>
  );
}
