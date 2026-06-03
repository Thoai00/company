"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import * as THREE from "three";

export default function ScrollHero() {
  const mountRef     = useRef<HTMLDivElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const rawProg      = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x03070e, 1);
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      position: "absolute", inset: "0", width: "100%", height: "100%",
    });

    /* ── scene / camera ── */
    const scene  = new THREE.Scene();
    scene.fog    = new THREE.FogExp2(0x03070e, 0.007);
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 300);
    camera.position.set(0, 0, 52);

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── lights ── */
    scene.add(new THREE.AmbientLight(0x112244, 2.2));
    const dl = new THREE.DirectionalLight(0xffffff, 3);
    dl.position.set(5, 12, 15); scene.add(dl);
    const pl1 = new THREE.PointLight(0x0090d0, 400, 130);
    pl1.position.set(-22, 2, 8); scene.add(pl1);
    const pl2 = new THREE.PointLight(0x00cfff, 300, 110);
    pl2.position.set(22, 6, -6); scene.add(pl2);
    const backGlow = new THREE.PointLight(0x003060, 700, 70);
    backGlow.position.set(0, 0, -18); scene.add(backGlow);

    /* ── canvas text texture ── */
    const CW = 4096, CH = 1024;
    const cv  = document.createElement("canvas");
    cv.width  = CW; cv.height = CH;
    const ctx = cv.getContext("2d")!;

    // outer glow
    ctx.save();
    ctx.filter = "blur(30px)";
    ctx.font   = `bold ${Math.floor(CH * 0.54)}px "Arial Black", Impact, sans-serif`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle    = "rgba(10,144,216,0.9)";
    ctx.fillText("THREE PLUG", CW / 2, CH * 0.43);
    ctx.restore();

    // inner glow
    ctx.save();
    ctx.filter = "blur(8px)";
    ctx.font   = `bold ${Math.floor(CH * 0.52)}px "Arial Black", Impact, sans-serif`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle    = "rgba(200,240,255,0.55)";
    ctx.fillText("THREE PLUG", CW / 2, CH * 0.43);
    ctx.restore();

    // gradient fill
    const grad = ctx.createLinearGradient(0, CH * 0.05, 0, CH * 0.78);
    grad.addColorStop(0,   "#ffffff");
    grad.addColorStop(0.3, "#c0f0ff");
    grad.addColorStop(0.65, "#0a90d8");
    grad.addColorStop(1,   "#002a60");
    ctx.font = `bold ${Math.floor(CH * 0.5)}px "Arial Black", Impact, sans-serif`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle    = grad;
    ctx.fillText("THREE PLUG", CW / 2, CH * 0.43);

    // subtitle
    ctx.font      = `300 ${Math.floor(CH * 0.068)}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(10,144,216,0.7)";
    ctx.fillText("S O F T W A R E   S O L U T I O N S", CW / 2, CH * 0.73);

    const textTex = new THREE.CanvasTexture(cv);

    /* main text plane */
    const textGeo  = new THREE.PlaneGeometry(44, 11);
    const textMat  = new THREE.MeshBasicMaterial({ map: textTex, transparent: true, depthWrite: false });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    scene.add(textMesh);

    /* glow echo plane (behind) */
    const glowGeo  = new THREE.PlaneGeometry(48, 12);
    const glowMat  = new THREE.MeshBasicMaterial({ map: textTex, transparent: true, opacity: 0.15, depthWrite: false });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.z = -1.2;
    scene.add(glowMesh);

    /* ── 3 accent shapes ── */
    type ShapeEntry = { mesh: THREE.Mesh; spin: THREE.Vector3; phase: number; base: THREE.Vector3 };
    const shapeArr: ShapeEntry[] = [];
    const shapeGeos: THREE.BufferGeometry[] = [];

    const accentDefs = [
      { geo: new THREE.OctahedronGeometry(1.9, 0),          pos: [-25, 7, 5] as [number,number,number],  col: 0x0a90d8 },
      { geo: new THREE.TorusKnotGeometry(1.1, 0.3, 80, 14), pos: [1, -10, -2] as [number,number,number], col: 0x00c0ff },
      { geo: new THREE.IcosahedronGeometry(1.65, 1),         pos: [25, 6, 4] as [number,number,number],   col: 0x40d8ff },
    ];
    accentDefs.forEach(({ geo, pos, col }) => {
      shapeGeos.push(geo);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(col), metalness: 0.85, roughness: 0.1,
        emissive: new THREE.Color(col), emissiveIntensity: 0.5,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      const edgesGeo = new THREE.EdgesGeometry(geo);
      shapeGeos.push(edgesGeo);
      mesh.add(new THREE.LineSegments(
        edgesGeo,
        new THREE.LineBasicMaterial({ color: 0x80e8ff, transparent: true, opacity: 0.5 }),
      ));
      scene.add(mesh);
      shapeArr.push({
        mesh, spin: new THREE.Vector3(
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 0.7,
        ),
        phase: Math.random() * Math.PI * 2,
        base: new THREE.Vector3(...pos),
      });
    });

    /* ── particle field ── */
    const P   = 900;
    const pBuf = new Float32Array(P * 3);
    for (let i = 0; i < P; i++) {
      const r = 14 + Math.random() * 32;
      const a = Math.random() * Math.PI * 2;
      const b = (Math.random() - 0.5) * Math.PI * 0.5;
      pBuf[i*3]   = r * Math.cos(a) * Math.cos(b);
      pBuf[i*3+1] = r * Math.sin(b);
      pBuf[i*3+2] = r * Math.sin(a) * 0.55 - 6;
    }
    const pGeo  = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pBuf, 3));
    const pMat  = new THREE.PointsMaterial({ color: 0x1a90c8, size: 0.1, transparent: true, opacity: 0.6, sizeAttenuation: true });
    const pts   = new THREE.Points(pGeo, pMat);
    scene.add(pts);

    /* ── depth grid ── */
    const gridHelper = new THREE.GridHelper(120, 28, 0x001a33, 0x000d1a);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.z = -22;
    const setGridOpacity = (op: number) => {
      const mat = gridHelper.material;
      (Array.isArray(mat) ? mat : [mat]).forEach(
        (m) => { (m as THREE.LineBasicMaterial).transparent = true; (m as THREE.LineBasicMaterial).opacity = op; }
      );
    };
    setGridOpacity(0.08);
    scene.add(gridHelper);

    /* ── scroll ── */
    const onScroll = () => {
      rawProg.current = Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * 3)));
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

    /* ── animation loop ── */
    let raf = 0, smooth = 0, prev = performance.now() / 1000;
    const t0 = prev;
    const lrp  = (a: number, b: number, t: number) => a + (b - a) * t;
    const ease = (x: number) => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now() / 1000;
      const dt  = Math.min(now - prev, 0.05);
      prev = now;
      const t   = now - t0;

      smooth += (rawProg.current - smooth) * Math.min(1, dt * 3.5);
      const e = ease(smooth);

      /* camera zooms from z=52 through the text (z=0) to z=-20 */
      camera.position.z = lrp(52, -20, e);
      camera.position.x += (mouse.x * 3.5 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 2.0 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      /* text fades as camera passes through */
      const ta = Math.max(0, 1 - Math.max(0, (e - 0.55) / 0.25));
      textMat.opacity = ta;
      glowMat.opacity = 0.15 * ta;

      /* shapes rush toward + past camera */
      shapeArr.forEach((s) => {
        s.mesh.rotation.x += s.spin.x * dt;
        s.mesh.rotation.y += s.spin.y * dt;
        s.mesh.position.y  = s.base.y + Math.sin(t * 0.4 + s.phase) * 1.8;
        s.mesh.position.z  = s.base.z + e * 24;
        const d = Math.abs(camera.position.z - s.mesh.position.z);
        s.mesh.scale.setScalar(Math.max(0.01, Math.min(1, d * 0.08)));
      });

      /* particles slow orbit */
      pts.rotation.y = t * 0.022;
      pMat.opacity   = 0.35 + Math.sin(t * 0.5) * 0.1 + e * 0.4;

      /* grid rushes toward camera */
      gridHelper.position.z = -22 + e * 18;
      setGridOpacity(0.08 + e * 0.45);

      /* pulsing lights */
      pl1.intensity   = 320 + Math.sin(t * 1.4) * 120;
      pl2.intensity   = 240 + Math.cos(t * 1.0) * 90;
      backGlow.intensity = 500 + Math.sin(t * 0.7) * 180 + e * 450;

      /* HTML overlays — driven imperatively (no React re-render) */
      const ct = contentRef.current;
      const sc = scrollCueRef.current;
      if (ct) {
        const a = Math.max(0, Math.min(1, (e - 0.72) / 0.2));
        ct.style.opacity   = String(a);
        ct.style.transform = `translateY(${(1 - a) * 28}px)`;
        ct.style.pointerEvents = a > 0.05 ? "auto" : "none";
      }
      if (sc) {
        sc.style.opacity = String(Math.max(0, 1 - e * 12));
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
      textTex.dispose();
      textGeo.dispose(); textMat.dispose();
      glowGeo.dispose(); glowMat.dispose();
      shapeGeos.forEach((g) => g.dispose());
      shapeArr.forEach((s) => (s.mesh.material as THREE.Material).dispose());
      pGeo.dispose(); pMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    /* 400 vh container gives 300 vh of actual scroll travel for the sticky element */
    <div style={{ height: "400vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Three.js canvas host */}
        <div ref={mountRef} className="absolute inset-0" />

        {/* radial vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 20%, rgba(3,7,14,0.78) 100%)" }}
        />

        {/* bottom-edge fade → connects smoothly to the next section */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{ height: "20vh", background: "linear-gradient(to bottom, transparent, #03070e)" }}
        />

        {/* ── Hero UI layer — fades in at ~72 % scroll progress ── */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24"
          style={{ opacity: 0, pointerEvents: "none", transition: "none" }}
        >
          <div className="mx-auto w-full max-w-7xl">

            {/* logo row */}
            <div className="mb-10 flex items-center gap-4">
              <div className="relative">
                <div
                  className="absolute -inset-3 rounded-full opacity-40"
                  style={{ background: "radial-gradient(circle, rgba(10,144,216,0.5), transparent 70%)", filter: "blur(12px)" }}
                />
                <Image
                  src="/logo.png" alt="Three Plug Software Solutions"
                  width={96} height={96} priority
                  className="relative h-24 w-auto object-contain drop-shadow-[0_0_24px_rgba(10,144,216,0.6)]"
                />
              </div>
              <div>
                <div className="text-2xl font-black tracking-tight text-white">THREE PLUG</div>
                <div className="mt-1 font-mono text-xs uppercase tracking-[0.22em]"
                  style={{ color: "rgba(10,144,216,0.8)" }}>Software Solutions</div>
              </div>
            </div>

            {/* headline */}
            <h1
              className="mb-6 font-black leading-[0.87] tracking-tight"
              style={{ fontSize: "clamp(3.5rem,9vw,8.5rem)", textShadow: "0 4px 80px rgba(3,7,14,0.6)" }}
            >
              Automate.
              <br />
              <span className="italic" style={{
                background: "linear-gradient(95deg,#0a90d8,#40d8ff)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Market.
              </span>
              <br />
              Animate.
            </h1>

            <p className="mb-10 max-w-lg text-xl leading-relaxed"
              style={{ color: "rgba(240,244,248,0.6)", textShadow: "0 2px 30px rgba(3,7,14,0.8)" }}>
              We automate your operations, grow your audience, and bring your brand
              to life in motion — all under one roof.
            </p>

            <div className="flex flex-wrap gap-4">
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

            {/* mini stat strip */}
            <div className="mt-14 flex gap-10">
              {[{ n: "120+", l: "Projects" }, { n: "99%", l: "Retention" }, { n: "9+", l: "Years" }].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-black leading-none" style={{ color: "var(--brand-light)" }}>{s.n}</div>
                  <div className="mt-0.5 font-mono text-xs uppercase tracking-widest"
                    style={{ color: "rgba(240,244,248,0.35)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* scroll cue — disappears once user starts scrolling */}
        <div
          ref={scrollCueRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]"
            style={{ color: "rgba(240,244,248,0.35)" }}>scroll</span>
          <div className="h-8 w-px"
            style={{ background: "linear-gradient(to bottom, rgba(10,144,216,0.5), transparent)" }} />
        </div>
      </div>
    </div>
  );
}
