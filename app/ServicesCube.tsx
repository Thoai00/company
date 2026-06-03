"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ── service data ── */
const SVC = [
  {
    id: "01", title: "Intelligent Automation",
    desc: "AI-powered workflows, RPA systems, and custom agents that eliminate repetitive work and run your operations around the clock.",
    tags: ["AI Agents", "RPA", "Workflow Automation", "ChatBots", "API Integration"],
    accent: "#0a90d8", accentN: 0x0a90d8,
  },
  {
    id: "02", title: "Digital Marketing",
    desc: "Performance-first marketing — SEO, paid acquisition, analytics infrastructure, and content engines engineered to compound.",
    tags: ["SEO / SEM", "Paid Ads", "Analytics", "Growth Strategy", "Social Media"],
    accent: "#00c0ff", accentN: 0x00c0ff,
  },
  {
    id: "03", title: "3D Animation & Visualization",
    desc: "Photorealistic product renders, interactive WebGL experiences, motion graphics, and architectural visualizations.",
    tags: ["3D Renders", "Motion Graphics", "WebGL", "Product Viz", "AR/VR"],
    accent: "#40d8ff", accentN: 0x40d8ff,
  },
  {
    id: "04", title: "Custom Software",
    desc: "Bespoke web and mobile applications, complex backends, and enterprise platforms built around your exact requirements.",
    tags: ["Web Apps", "Mobile", "APIs", "Cloud", "Enterprise"],
    accent: "#0070b0", accentN: 0x0070b0,
  },
];

const GRID = 4;          // 4×4×4 = 64 pieces
const SPC  = 0.9;        // spacing between centres
const SZ   = 0.72;       // single cube side length
const HALF = (GRID - 1) / 2;

type Piece = {
  mesh:    THREE.Mesh;
  home:    THREE.Vector3;
  scatter: THREE.Vector3;
  spin:    THREE.Vector3;
  stagger: number;        // 0–0.3, delays assembly start per piece
  phase:   number;        // random float offset for gentle bob
};

export default function ServicesCube() {
  const secRef     = useRef<HTMLElement>(null);
  const mountRef   = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const idRef      = useRef<HTMLSpanElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const descRef    = useRef<HTMLParagraphElement>(null);
  const tagsRef    = useRef<HTMLDivElement>(null);
  const dot0Ref    = useRef<HTMLSpanElement>(null);
  const dot1Ref    = useRef<HTMLSpanElement>(null);
  const dot2Ref    = useRef<HTMLSpanElement>(null);
  const dot3Ref    = useRef<HTMLSpanElement>(null);
  const dotRefs    = [dot0Ref, dot1Ref, dot2Ref, dot3Ref];
  const rawProg    = useRef(0);

  useEffect(() => {
    const mount   = mountRef.current;
    const section = secRef.current;
    if (!mount || !section) return;

    /* ── renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      position: "absolute", inset: "0", width: "100%", height: "100%",
    });

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(-1.5, 0, 18);
    camera.lookAt(-1.5, 0, 0);

    const resize = () => {
      const w = mount.offsetWidth  || window.innerWidth;
      const h = mount.offsetHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── lighting ── */
    scene.add(new THREE.AmbientLight(0x223355, 2.5));
    const dl = new THREE.DirectionalLight(0xffffff, 3);
    dl.position.set(6, 10, 12); scene.add(dl);
    const rimL  = new THREE.PointLight(0x0090d0, 0, 60);
    rimL.position.set(-14, -5, 8); scene.add(rimL);
    const fillL = new THREE.PointLight(0x00cfff, 0, 50);
    fillL.position.set(14, 8, -4); scene.add(fillL);

    /* ── geometry shared by all pieces ── */
    const boxGeo = new THREE.BoxGeometry(SZ, SZ, SZ);

    /* ── build 4×4×4 cube-of-cubes ── */
    const group  = new THREE.Group();
    group.position.set(-3.2, 0, 0); // offset left to leave room for text
    scene.add(group);

    const pieces: Piece[] = [];

    for (let x = 0; x < GRID; x++) {
      for (let y = 0; y < GRID; y++) {
        for (let z = 0; z < GRID; z++) {
          const home = new THREE.Vector3(
            (x - HALF) * SPC,
            (y - HALF) * SPC,
            (z - HALF) * SPC,
          );

          const onFace =
            x === 0 || x === GRID - 1 ||
            y === 0 || y === GRID - 1 ||
            z === 0 || z === GRID - 1;
          const onEdge =
            [x === 0 || x === GRID - 1, y === 0 || y === GRID - 1, z === 0 || z === GRID - 1]
              .filter(Boolean).length >= 2;

          const mat = new THREE.MeshStandardMaterial({
            color:            new THREE.Color(0x011840),
            metalness:        0.75,
            roughness:        0.18,
            emissive:         new THREE.Color(0x002255),
            emissiveIntensity: onEdge ? 0.9 : onFace ? 0.5 : 0.2,
          });
          const mesh = new THREE.Mesh(boxGeo, mat);
          mesh.position.copy(home);

          /* edge highlight */
          const edgeGeo = new THREE.EdgesGeometry(boxGeo);
          mesh.add(new THREE.LineSegments(
            edgeGeo,
            new THREE.LineBasicMaterial({
              color: 0x40c8ff, transparent: true,
              opacity: onEdge ? 0.65 : onFace ? 0.35 : 0.08,
            }),
          ));
          group.add(mesh);

          /* radial scatter direction */
          const dir = home.clone().normalize();
          if (dir.lengthSq() < 0.001) dir.set(Math.random()-0.5, 1, Math.random()-0.5).normalize();

          pieces.push({
            mesh, home, phase: Math.random() * Math.PI * 2, stagger: Math.random() * 0.28,
            scatter: new THREE.Vector3(
              dir.x * (10 + Math.random() * 8) + (Math.random()-0.5) * 6,
              dir.y * (10 + Math.random() * 8) + (Math.random()-0.5) * 6,
              dir.z * 6  + (Math.random()-0.5) * 4,
            ),
            spin: new THREE.Vector3(
              (Math.random()-0.5)*2.4, (Math.random()-0.5)*2.8, (Math.random()-0.5)*1.6,
            ),
          });
        }
      }
    }

    /* ── helpers ── */
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const easeOut3 = (t: number) => 1 - Math.pow(1 - t, 3);

    /* regenerate scatter positions between services */
    const newScatter = () => {
      pieces.forEach((p) => {
        const dir = p.home.clone().normalize();
        if (dir.lengthSq() < 0.001) dir.set(Math.random()-0.5, 1, Math.random()-0.5).normalize();
        p.scatter.set(
          dir.x * (10 + Math.random() * 8) + (Math.random()-0.5) * 6,
          dir.y * (10 + Math.random() * 8) + (Math.random()-0.5) * 6,
          dir.z * 6  + (Math.random()-0.5) * 4,
        );
        p.stagger = Math.random() * 0.28;
      });
    };

    /* recolour pieces to match service accent */
    const setAccent = (hex: number) => {
      const col = new THREE.Color(hex);
      pieces.forEach((p) => {
        const m = p.mesh.material as THREE.MeshStandardMaterial;
        const t = p.home.clone().normalize().y * 0.5 + 0.5; // gradient top→bottom
        m.color.set(col.clone().multiplyScalar(lerp(0.12, 0.55, t)));
        m.emissive.set(col.clone().multiplyScalar(0.35));
        m.needsUpdate = true;
      });
      rimL.color.set(new THREE.Color(hex));
      fillL.color.set(new THREE.Color(hex));
    };

    /* push new text + tags to the right-side overlay */
    const setContent = (idx: number) => {
      const s = SVC[idx];
      if (idRef.current)    idRef.current.textContent    = s.id;
      if (titleRef.current) titleRef.current.textContent = s.title;
      if (descRef.current)  descRef.current.textContent  = s.desc;
      if (tagsRef.current) {
        tagsRef.current.innerHTML = s.tags
          .map(
            (tag) =>
              `<span style="display:inline-block;padding:4px 12px;border-radius:9999px;` +
              `font-family:monospace;font-size:11px;margin:3px;` +
              `border:1px solid ${s.accent}33;color:rgba(240,244,248,0.5);` +
              `background:${s.accent}0d;">${tag}</span>`,
          )
          .join("");
      }
      /* nav dots */
      dotRefs.forEach((ref, i) => {
        if (!ref.current) return;
        ref.current.style.opacity   = i === idx ? "1" : "0.22";
        ref.current.style.transform = i === idx ? "scale(1.5)" : "scale(1)";
        ref.current.style.background = i === idx ? s.accent : "rgba(255,255,255,0.35)";
      });
    };

    /* init */
    setAccent(SVC[0].accentN);
    setContent(0);

    /* ── scroll progress ── */
    const onScroll = () => {
      const range = section.offsetHeight - window.innerHeight;
      rawProg.current = Math.max(0, Math.min(1,
        (window.scrollY - section.offsetTop) / range,
      ));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ── mouse parallax ── */
    const mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x =  (e.clientX / window.innerWidth  - 0.5);
      mouse.y = -(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMouse);

    /* ── animation loop ── */
    let raf = 0, smooth = 0, prevIdx = -1, prev = performance.now() / 1000;
    const t0 = prev;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now() / 1000;
      const dt  = Math.min(now - prev, 0.05);
      prev = now;
      const t   = now - t0;

      smooth += (rawProg.current - smooth) * Math.min(1, dt * 3.5);

      /* ── which service, local progress ──
         4 equal bands: service-i occupies [i/4, (i+1)/4]
         localP: 0→1 inside that band
           0.00–0.45 → assemble
           0.45–0.80 → hold (cube rotates, content visible)
           0.80–1.00 → explode out
      */
      const idx    = Math.min(3, Math.floor(smooth * 4));
      const localP = (smooth * 4) % 1;

      /* ── service changed: new scatter + colours + content ── */
      if (idx !== prevIdx) {
        newScatter();
        setAccent(SVC[idx].accentN);
        setContent(idx);
        prevIdx = idx;
      }

      /* ── assemble factor: 0=scattered, 1=assembled ── */
      let rawA: number;
      if      (localP < 0.45) rawA = localP / 0.45;            // 0→1
      else if (localP < 0.80) rawA = 1;                         // fully assembled
      else                    rawA = 1 - (localP - 0.80) / 0.20; // 1→0
      rawA = Math.max(0, Math.min(1, rawA));

      /* ── content opacity ── */
      const cAlpha =
        localP < 0.42 ? 0 :
        localP < 0.55 ? (localP - 0.42) / 0.13 :
        localP < 0.78 ? 1 :
        Math.max(0, 1 - (localP - 0.78) / 0.07);

      if (contentRef.current) {
        contentRef.current.style.opacity   = String(Math.max(0, cAlpha));
        contentRef.current.style.transform = `translateX(${(1 - Math.min(1, cAlpha + 0.25)) * 22}px)`;
      }

      /* ── cube pieces ── */
      for (const p of pieces) {
        /* stagger: piece i starts assembling a bit later */
        const sa  = Math.max(0, Math.min(1, (rawA - p.stagger) / (1 - 0.28)));
        const ea  = easeOut3(sa);

        p.mesh.position.set(
          lerp(p.scatter.x, p.home.x, ea) + Math.sin(t * 0.40 + p.phase) * 0.10 * ea * ea,
          lerp(p.scatter.y, p.home.y, ea) + Math.cos(t * 0.35 + p.phase) * 0.10 * ea * ea,
          lerp(p.scatter.z, p.home.z, ea),
        );

        /* spin while scattered; snap to 0 when assembled */
        const sf = (1 - ea) * (1 - ea);
        p.mesh.rotation.x += p.spin.x * sf * dt;
        p.mesh.rotation.y += p.spin.y * sf * dt;
        p.mesh.rotation.z += p.spin.z * sf * dt;
        const dec = Math.min(0.85, ea * 9 * dt);
        p.mesh.rotation.x *= (1 - dec);
        p.mesh.rotation.y *= (1 - dec);
        p.mesh.rotation.z *= (1 - dec);
      }

      /* ── cube group slow rotation ── */
      group.rotation.y += dt * (0.38 * rawA + 0.06 * (1 - rawA));
      group.rotation.x += (mouse.y * 0.28 - group.rotation.x) * 0.035;
      group.rotation.z += (-mouse.x * 0.10 - group.rotation.z) * 0.035;

      /* lights brighten when assembled */
      rimL.intensity  = (180 + Math.sin(t * 1.3) * 70)  * rawA;
      fillL.intensity = (140 + Math.cos(t * 0.9) * 50)  * rawA;

      renderer.render(scene, camera);
    };
    tick();

    /* ── cleanup ── */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll",    onScroll);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize",    resize);
      boxGeo.dispose();
      pieces.forEach((p) => (p.mesh.material as THREE.Material).dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    /* 500 vh → 400 vh of scroll → 100 vh per service */
    <section ref={secRef} id="services" style={{ height: "500vh" }} className="relative z-10">

      {/* sticky viewport */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Three.js canvas */}
        <div ref={mountRef} className="absolute inset-0" />

        {/* left-transparent → right-dark gradient so text is readable */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(3,7,14,0.05) 0%, rgba(3,7,14,0.45) 48%, rgba(3,7,14,0.92) 100%)",
          }}
        />

        {/* bottom fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{ height: "14vh", background: "linear-gradient(to bottom, transparent, #03070e)" }}
        />

        {/* section label – top-left */}
        <div className="absolute top-10 left-8 md:left-14 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
          <span style={{ color: "var(--brand-light)" }}>01</span>
          <span style={{ color: "rgba(240,244,248,0.22)" }}>—</span>
          <span style={{ color: "rgba(240,244,248,0.36)" }}>What we do</span>
        </div>

        {/* permanent headline – top-right area */}
        <div className="absolute top-10 right-8 md:right-14 text-right hidden md:block">
          <div className="font-black leading-none tracking-tight"
            style={{ fontSize: "clamp(1.2rem,2.2vw,2rem)", color: "rgba(240,244,248,0.08)" }}>
            One studio.<br />Every service.
          </div>
        </div>

        {/* ── service content — right half ── */}
        <div className="absolute right-0 top-0 flex h-full w-full flex-col justify-center pl-[50%] pr-8 md:pr-16 lg:pr-24">
          <div
            ref={contentRef}
            style={{ opacity: 0, transition: "none", willChange: "opacity, transform" }}
          >
            {/* service id */}
            <div className="mb-4 flex items-center gap-3">
              <span
                ref={idRef}
                className="font-mono text-sm font-bold"
                style={{ color: "var(--brand-light)" }}
              >01</span>
              <span className="h-px w-8 rounded" style={{ background: "var(--brand-light)", opacity: 0.45 }} />
            </div>

            {/* title */}
            <h3
              ref={titleRef}
              className="mb-5 font-black leading-tight tracking-tight"
              style={{ fontSize: "clamp(1.9rem,3.8vw,3rem)" }}
            >
              Intelligent Automation
            </h3>

            {/* description */}
            <p
              ref={descRef}
              className="mb-7 max-w-sm text-base leading-relaxed"
              style={{ color: "rgba(240,244,248,0.58)" }}
            />

            {/* tags */}
            <div ref={tagsRef} className="-m-1 flex flex-wrap" />
          </div>
        </div>

        {/* ── nav dots – bottom center ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {SVC.map((s, i) => {
            const ref = dotRefs[i];
            return (
              <span
                key={s.id}
                ref={ref}
                style={{
                  display: "block", width: 7, height: 7, borderRadius: "50%",
                  background: i === 0 ? s.accent : "rgba(255,255,255,0.3)",
                  opacity: i === 0 ? 1 : 0.22,
                  transition: "opacity 0.35s ease, transform 0.35s ease, background 0.35s ease",
                  transform: i === 0 ? "scale(1.5)" : "scale(1)",
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
