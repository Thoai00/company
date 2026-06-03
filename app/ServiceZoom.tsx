"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const SVC = [
  {
    id: "01", title: "Intelligent Automation",
    desc: "AI-powered workflows, RPA systems, and custom agents that eliminate repetitive work and run your operations around the clock.",
    tags: ["AI Agents", "RPA", "Workflow Automation", "ChatBots", "API Integration"],
    accent: "#0a90d8", hex: 0x0a90d8,
  },
  {
    id: "02", title: "Digital Marketing",
    desc: "Performance-first marketing — SEO, paid acquisition, analytics infrastructure, and content engines engineered to compound.",
    tags: ["SEO / SEM", "Paid Ads", "Analytics", "Growth Strategy", "Social Media"],
    accent: "#00c0ff", hex: 0x00c0ff,
  },
  {
    id: "03", title: "3D Animation & Visualization",
    desc: "Photorealistic product renders, interactive WebGL experiences, motion graphics, and architectural visualizations.",
    tags: ["3D Renders", "Motion Graphics", "WebGL", "Product Viz", "AR/VR"],
    accent: "#40d8ff", hex: 0x40d8ff,
  },
  {
    id: "04", title: "Custom Software",
    desc: "Bespoke web and mobile applications, complex backends, and enterprise platforms built around your exact requirements.",
    tags: ["Web Apps", "Mobile", "APIs", "Cloud", "Enterprise"],
    accent: "#0070b0", hex: 0x0070b0,
  },
];

const SZ     = 5;            // cube world-units side length
const Z_FAR  = 30;           // camera start (cube looks small, dramatic)
const Z_NEAR = 2.6;          // camera close-up (just outside face at z = SZ/2 = 2.5)

export default function ServiceZoom() {
  const secRef     = useRef<HTMLElement>(null);
  const mountRef   = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const idRef      = useRef<HTMLSpanElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const descRef    = useRef<HTMLParagraphElement>(null);
  const tagsRef    = useRef<HTMLDivElement>(null);
  const dotsRef    = useRef<HTMLDivElement>(null);
  const rawProg    = useRef(0);

  useEffect(() => {
    const mount   = mountRef.current;
    const section = secRef.current;
    if (!mount || !section) return;

    /* ── renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x03070e, 1);
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      position: "absolute", inset: "0", width: "100%", height: "100%",
    });

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    camera.position.set(0, 0, Z_FAR);

    const resize = () => {
      const w = mount.offsetWidth || window.innerWidth;
      const h = mount.offsetHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── fog ── */
    scene.fog = new THREE.FogExp2(0x03070e, 0.018);

    /* ── lighting ── */
    scene.add(new THREE.AmbientLight(0x060c1a, 1.2));

    // Front accent light (moves toward face as we zoom)
    const frontL = new THREE.PointLight(SVC[0].hex, 0, 100);
    frontL.position.set(0, 0, 15);
    scene.add(frontL);

    // Rim (behind cube)
    const rimL = new THREE.PointLight(SVC[0].hex, 60, 80);
    rimL.position.set(0, 0, -20);
    scene.add(rimL);

    // Corner sparkles
    const cA = new THREE.PointLight(0x0050aa, 80, 16);
    cA.position.set(-SZ, SZ, SZ); scene.add(cA);
    const cB = new THREE.PointLight(0x0050aa, 80, 16);
    cB.position.set(SZ, -SZ, SZ); scene.add(cB);

    /* ── the one cube ── */
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    const cubeGeo = new THREE.BoxGeometry(SZ, SZ, SZ);

    // Semi-transparent solid faces
    const faceMat = new THREE.MeshStandardMaterial({
      color: 0x011020, metalness: 0.9, roughness: 0.12,
      transparent: true, opacity: 0.45,
    });
    const faceMesh = new THREE.Mesh(cubeGeo, faceMat);
    cubeGroup.add(faceMesh);

    // Bright wireframe edges
    const edgeGeo = new THREE.EdgesGeometry(cubeGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x50d8ff, transparent: true, opacity: 0.95 });
    const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
    cubeGroup.add(edgeLine);

    // Glow plane on the front face (gets brighter as camera closes in)
    const glowGeo = new THREE.PlaneGeometry(SZ - 0.3, SZ - 0.3);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(SVC[0].hex),
      transparent: true, opacity: 0, depthWrite: false,
    });
    const glowPlane = new THREE.Mesh(glowGeo, glowMat);
    glowPlane.position.z = SZ / 2 + 0.02;
    cubeGroup.add(glowPlane);

    // Corner spheres at the 8 vertices
    const dotGeo = new THREE.SphereGeometry(0.14, 8, 6);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x80e8ff });
    const hs = SZ / 2;
    [[-hs,-hs,hs],[-hs,hs,hs],[hs,-hs,hs],[hs,hs,hs],
     [-hs,-hs,-hs],[-hs,hs,-hs],[hs,-hs,-hs],[hs,hs,-hs]].forEach(([x,y,z]) => {
      const d = new THREE.Mesh(dotGeo, dotMat);
      d.position.set(x, y, z);
      cubeGroup.add(d);
    });

    /* ── ambient particles ── */
    const P   = 700;
    const pPos = new Float32Array(P * 3);
    const pVel = new Float32Array(P * 3);
    for (let i = 0; i < P; i++) {
      const r = 12 + Math.random() * 26;
      const a = Math.random() * Math.PI * 2;
      const b = (Math.random() - 0.5) * Math.PI;
      pPos[i*3]   = r * Math.cos(a) * Math.cos(b);
      pPos[i*3+1] = r * Math.sin(b);
      pPos[i*3+2] = r * Math.sin(a) * 0.65;
      pVel[i*3]   = (Math.random() - 0.5) * 0.01;
      pVel[i*3+1] = (Math.random() - 0.5) * 0.01;
      pVel[i*3+2] = (Math.random() - 0.5) * 0.007;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x1a90c8, size: 0.09, transparent: true, opacity: 0.55, sizeAttenuation: true });
    const pts  = new THREE.Points(pGeo, pMat);
    scene.add(pts);

    /* ── helpers ── */
    const lerp       = (a: number, b: number, t: number) => a + (b - a) * t;
    const easeIO     = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    const easeOut    = (t: number) => 1 - Math.pow(1-t, 3);
    const clamp01    = (t: number) => Math.max(0, Math.min(1, t));

    /* ── update accent colour ── */
    const setAccent = (hex: number) => {
      const c = new THREE.Color(hex);
      edgeMat.color.set(c.clone().lerp(new THREE.Color(0xffffff), 0.45));
      glowMat.color.set(c);
      dotMat.color.set(c.clone().lerp(new THREE.Color(0xffffff), 0.5));
      frontL.color.set(c);
      rimL.color.set(c);
      faceMat.color.set(c.clone().multiplyScalar(0.08));
      faceMat.needsUpdate = true;
    };
    setAccent(SVC[0].hex);

    /* ── update HTML content ── */
    const setContent = (idx: number) => {
      const s = SVC[idx];
      if (idRef.current)    idRef.current.textContent    = s.id;
      if (titleRef.current) titleRef.current.textContent = s.title;
      if (descRef.current)  descRef.current.textContent  = s.desc;
      if (tagsRef.current) {
        tagsRef.current.innerHTML = s.tags.map(
          (tag) =>
            `<span style="display:inline-block;padding:5px 14px;border-radius:9999px;` +
            `font-family:monospace;font-size:11px;margin:3px;` +
            `border:1px solid ${s.accent}33;color:rgba(240,244,248,0.55);` +
            `background:${s.accent}0e;">${tag}</span>`
        ).join("");
      }
      /* dots */
      if (dotsRef.current) {
        [...dotsRef.current.children].forEach((el, i) => {
          const sp = el as HTMLElement;
          sp.style.opacity   = i === idx ? "1"      : "0.22";
          sp.style.transform = i === idx ? "scale(1.6)" : "scale(1)";
          sp.style.background = i === idx ? s.accent : "rgba(255,255,255,0.3)";
        });
      }
    };
    setContent(0);

    /* ── scroll ── */
    const onScroll = () => {
      const range = section.offsetHeight - window.innerHeight;
      rawProg.current = clamp01((window.scrollY - section.offsetTop) / range);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ── mouse ── */
    const mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x =  (e.clientX / window.innerWidth  - 0.5);
      mouse.y = -(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMouse);

    /* ── animation ── */
    let raf = 0, smooth = 0, prevIdx = -1;
    let cubeRotY = 0;          // tracks current Y rotation of cubeGroup
    let prev = performance.now() / 1000;
    const t0 = prev;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now() / 1000;
      const dt  = Math.min(now - prev, 0.05);
      prev = now;
      const t   = now - t0;

      smooth += (rawProg.current - smooth) * Math.min(1, dt * 3.5);

      /* ── service index & local progress ──
         4 equal bands  (0-25%, 25-50%, 50-75%, 75-100%)
         localP 0→1 within each band
         ─────────────────────────────────
         0.00–0.35  zoom in      (camera: Z_FAR → Z_NEAR)
         0.35–0.70  hold close   (service content visible)
         0.70–0.85  zoom out     (camera: Z_NEAR → Z_FAR)
         0.85–1.00  cube rotates to next face
      */
      const idx    = Math.min(3, Math.floor(smooth * 4));
      const localP = Math.min(0.9999, (smooth * 4) % 1);

      if (idx !== prevIdx) {
        setAccent(SVC[idx].hex);
        setContent(idx);
        prevIdx = idx;
      }

      /* zoom factor 0 = far, 1 = close */
      const zoomF =
        localP < 0.35 ? easeIO(localP / 0.35) :
        localP < 0.70 ? 1 :
        localP < 0.85 ? 1 - easeIO((localP - 0.70) / 0.15) : 0;

      /* content opacity */
      const contA =
        localP < 0.35 ? 0 :
        localP < 0.47 ? easeOut((localP - 0.35) / 0.12) :
        localP < 0.66 ? 1 :
        localP < 0.73 ? 1 - easeOut((localP - 0.66) / 0.07) : 0;

      /* ── camera ── */
      const targetZ = lerp(Z_FAR, Z_NEAR, zoomF);
      camera.position.z = targetZ;
      // subtle mouse parallax (dampened when close so it doesn't look jittery)
      const parallax = 1 - zoomF * 0.8;
      camera.position.x += (mouse.x * 2.5 * parallax - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 1.8 * parallax - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      /* ── cube rotation ──
         Target Y = -idx * 90°  (each service = one face toward camera)
         Only rotate during the "zoom out" phase (localP > 0.85), camera is far.
      */
      const targetY = -idx * Math.PI * 0.5;
      cubeRotY += (targetY - cubeRotY) * Math.min(1, dt * 3.2);
      cubeGroup.rotation.y = cubeRotY;

      // Tilt with mouse (zero out when fully zoomed)
      cubeGroup.rotation.x += (mouse.y * 0.18 * (1 - zoomF) - cubeGroup.rotation.x) * 0.04;

      /* ── glow plane ── */
      const glow = clamp01((zoomF - 0.45) / 0.55);
      glowMat.opacity = glow * 0.14;

      /* ── lights ── */
      frontL.intensity = glow * (280 + Math.sin(t * 1.4) * 80);
      rimL.intensity   = 50 + zoomF * (180 + Math.sin(t * 0.9) * 60);
      cA.position.set(-SZ * (1 + Math.sin(t*0.6)*0.05), SZ, SZ);
      cB.position.set( SZ * (1 + Math.cos(t*0.7)*0.05), -SZ, SZ);

      /* ── edge brightness ── */
      edgeMat.opacity = lerp(0.55, 1.0, zoomF);

      /* ── idle rotation of the cube when zoomed out ── */
      // Gentle Y drift when far (adds life before service content)
      if (zoomF < 0.1) {
        cubeGroup.rotation.y = cubeRotY + Math.sin(t * 0.25) * 0.08;
      }

      /* ── particles ── */
      const pa = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < P; i++) {
        pa[i*3]   += pVel[i*3];
        pa[i*3+1] += pVel[i*3+1];
        pa[i*3+2] += pVel[i*3+2];
        if (Math.abs(pa[i*3])   > 32) pVel[i*3]   *= -1;
        if (Math.abs(pa[i*3+1]) > 22) pVel[i*3+1] *= -1;
        if (Math.abs(pa[i*3+2]) > 22) pVel[i*3+2] *= -1;
      }
      pGeo.attributes.position.needsUpdate = true;
      pts.rotation.y = t * 0.018;
      pMat.opacity = 0.3 + Math.sin(t * 0.5) * 0.08 + zoomF * 0.3;

      /* ── HTML overlay ── */
      if (contentRef.current) {
        contentRef.current.style.opacity = String(clamp01(contA));
      }

      renderer.render(scene, camera);
    };
    tick();

    /* ── cleanup ── */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll",    onScroll);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize",    resize);
      cubeGeo.dispose();
      edgeGeo.dispose();
      glowGeo.dispose();
      dotGeo.dispose();
      pGeo.dispose();
      [faceMat, edgeMat, glowMat, dotMat, pMat].forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode) mount.removeChild(renderer.domElement);
    };
  }, []);

  /* ── total scroll = 600vh - 100vh = 500vh → ~125 vh per service ── */
  return (
    <section ref={secRef} id="services" style={{ height: "600vh" }} className="relative z-10">
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Three.js host */}
        <div ref={mountRef} className="absolute inset-0" />

        {/* vignette – keeps corners dark */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 88% 88% at 50% 50%, transparent 28%, rgba(3,7,14,0.72) 100%)" }} />

        {/* bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{ height: "14vh", background: "linear-gradient(to bottom, transparent, #03070e)" }} />

        {/* section label */}
        <div className="absolute top-10 left-8 md:left-14 z-10 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
          <span style={{ color: "var(--brand-light)" }}>01</span>
          <span style={{ color: "rgba(240,244,248,0.22)" }}>—</span>
          <span style={{ color: "rgba(240,244,248,0.36)" }}>What we do</span>
        </div>

        {/* ── service content — centred, appears when zoomed in ── */}
        <div
          ref={contentRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
          style={{ opacity: 0 }}
        >
          <div className="text-center" style={{ maxWidth: 520 }}>

            {/* id + divider */}
            <div className="mb-4 flex items-center justify-center gap-3">
              <span ref={idRef}
                className="font-mono text-xs font-bold uppercase tracking-[0.3em]"
                style={{ color: "var(--brand-light)" }}>01</span>
              <span className="h-px w-10 opacity-40" style={{ background: "var(--brand-light)" }} />
              <span className="font-mono text-xs uppercase tracking-[0.2em]"
                style={{ color: "rgba(240,244,248,0.35)" }}>Service</span>
            </div>

            {/* title */}
            <h3
              ref={titleRef}
              className="mb-5 font-black leading-tight tracking-tight text-white"
              style={{ fontSize: "clamp(2rem,5vw,3.8rem)" }}
            />

            {/* description */}
            <p
              ref={descRef}
              className="mb-7 text-base leading-relaxed mx-auto"
              style={{ color: "rgba(240,244,248,0.58)", maxWidth: "44ch" }}
            />

            {/* tags */}
            <div ref={tagsRef} className="flex flex-wrap justify-center" />
          </div>
        </div>

        {/* nav dots */}
        <div ref={dotsRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
          {SVC.map((s, i) => (
            <span key={s.id}
              style={{
                display: "block", width: 7, height: 7, borderRadius: "50%",
                background: i === 0 ? s.accent : "rgba(255,255,255,0.3)",
                opacity: i === 0 ? 1 : 0.22,
                transition: "opacity 0.35s ease, transform 0.35s ease, background 0.35s ease",
                transform: i === 0 ? "scale(1.6)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
