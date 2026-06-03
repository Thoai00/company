"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const GRID = 6;
const SPACING = 1.1;
const SIZE = 0.88;

export default function CubeBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* --- wait until the fixed div has real pixel dimensions --- */
    const setup = () => {
      const width  = mount.offsetWidth  || window.innerWidth;
      const height = mount.offsetHeight || window.innerHeight;

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
      const getBaseZ = () => (mount.offsetWidth || window.innerWidth) < 640 ? 30 : 18;
      camera.position.set(0, 0, getBaseZ());

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mount.appendChild(renderer.domElement);

      /* ── lighting ── */
      scene.add(new THREE.AmbientLight(0x223355, 1.2));

      const key = new THREE.DirectionalLight(0xffffff, 2.8);
      key.position.set(6, 10, 12);
      scene.add(key);

      const blueRim = new THREE.PointLight(0x0090d0, 180, 80);
      blueRim.position.set(-10, -6, 8);
      scene.add(blueRim);

      const cyanFill = new THREE.PointLight(0x00cfff, 120, 70);
      cyanFill.position.set(10, 8, -6);
      scene.add(cyanFill);

      /* ── cube of cubes ── */
      const group = new THREE.Group();
      scene.add(group);

      const geo      = new THREE.BoxGeometry(SIZE, SIZE, SIZE);
      const deepBlue = new THREE.Color(0x011840);
      const midBlue  = new THREE.Color(0x0a70c0);
      const shellCol = new THREE.Color(0x30b8f8);

      type Piece = {
        mesh: THREE.Mesh;
        home: THREE.Vector3;
        scatter: THREE.Vector3;
        spin: THREE.Vector3;
        floatPhase: number;
        floatAmp: number;
      };
      const pieces: Piece[] = [];
      const half = (GRID - 1) / 2;

      for (let x = 0; x < GRID; x++) {
        for (let y = 0; y < GRID; y++) {
          for (let z = 0; z < GRID; z++) {
            const px = (x - half) * SPACING;
            const py = (y - half) * SPACING;
            const pz = (z - half) * SPACING;

            const isShell =
              x === 0 || x === GRID - 1 ||
              y === 0 || y === GRID - 1 ||
              z === 0 || z === GRID - 1;
            const isEdge =
              [x === 0 || x === GRID - 1, y === 0 || y === GRID - 1, z === 0 || z === GRID - 1]
                .filter(Boolean).length >= 2;

            const t = y / (GRID - 1);
            const base = isEdge
              ? deepBlue.clone().lerp(shellCol, t * 0.9 + 0.1)
              : isShell
              ? deepBlue.clone().lerp(midBlue,  t * 0.75 + 0.25)
              : deepBlue.clone().lerp(midBlue,  t * 0.35);

            const mat = new THREE.MeshStandardMaterial({
              color: base,
              metalness: 0.7,
              roughness: 0.2,
              emissive: new THREE.Color(isEdge ? 0x004488 : isShell ? 0x002255 : 0x001133),
              emissiveIntensity: isEdge ? 0.9 : isShell ? 0.6 : 0.25,
            });

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(px, py, pz);

            const edges = new THREE.LineSegments(
              new THREE.EdgesGeometry(geo),
              new THREE.LineBasicMaterial({
                color: isEdge ? 0x60e0ff : isShell ? 0x30a8e0 : 0x0a4060,
                transparent: true,
                opacity: isEdge ? 0.7 : isShell ? 0.4 : 0.1,
              })
            );
            mesh.add(edges);
            group.add(mesh);

            const home    = new THREE.Vector3(px, py, pz);
            const radial  = home.clone().normalize();
            if (radial.lengthSq() < 0.001) radial.set(0, 1, 0);

            const scatter = new THREE.Vector3(
              (Math.random() - 0.5) * 42,
              (Math.random() - 0.5) * 28,
              radial.z * 4 + Math.random() * 14
            );

            pieces.push({
              mesh, home, scatter,
              spin: new THREE.Vector3(
                (Math.random() - 0.5) * 1.6,
                (Math.random() - 0.5) * 1.6,
                (Math.random() - 0.5) * 1.0,
              ),
              floatPhase: Math.random() * Math.PI * 2,
              floatAmp:   0.5 + Math.random() * 1.0,
            });
          }
        }
      }

      /* ── ambient particle field ── */
      const P_COUNT = 350;
      const pPos    = new Float32Array(P_COUNT * 3);
      const pVel: THREE.Vector3[] = [];
      for (let i = 0; i < P_COUNT; i++) {
        pPos[i * 3]     = (Math.random() - 0.5) * 80;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 50;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
        pVel.push(new THREE.Vector3(
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.012,
          0,
        ));
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x1a90c8, size: 0.07, transparent: true, opacity: 0.55, sizeAttenuation: true,
      });
      const particleSys = new THREE.Points(pGeo, pMat);
      scene.add(particleSys);

      /* ── floating wireframe accents ── */
      type Wire = { mesh: THREE.LineSegments; spin: THREE.Vector3; floatPhase: number };
      const wires: Wire[] = [];

      const addWire = (
        geoW: THREE.BufferGeometry,
        pos: [number, number, number],
        opacity: number
      ) => {
        const eg  = new THREE.EdgesGeometry(geoW);
        const mat = new THREE.LineBasicMaterial({ color: 0x0860a0, transparent: true, opacity });
        const m   = new THREE.LineSegments(eg, mat);
        m.position.set(...pos);
        scene.add(m);
        wires.push({
          mesh: m,
          spin: new THREE.Vector3(
            (Math.random() - 0.5) * 0.25,
            (Math.random() - 0.5) * 0.25,
            (Math.random() - 0.5) * 0.15,
          ),
          floatPhase: Math.random() * Math.PI * 2,
        });
        geoW.dispose();
      };

      addWire(new THREE.IcosahedronGeometry(3.0, 0), [-17, 5, -18], 0.28);
      addWire(new THREE.TorusGeometry(2.4, 0.45, 8, 20),  [ 18, -5, -22], 0.22);
      addWire(new THREE.OctahedronGeometry(2.8, 0),       [-10, -9, -20], 0.24);
      addWire(new THREE.IcosahedronGeometry(2.0, 1),      [ 14, 10, -16], 0.18);
      addWire(new THREE.TorusKnotGeometry(1.8, 0.4, 64, 8), [0, 0, -30],  0.14);

      /* ── scroll progress ── */
      const onScroll = () => {
        progressRef.current = Math.min(Math.max(window.scrollY / (window.innerHeight * 1.1), 0), 1);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      /* ── mouse parallax ── */
      const mouse = { x: 0, y: 0 };
      const onMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.7;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.7;
      };
      window.addEventListener("mousemove", onMove);

      /* ── animation ── */
      let raf    = 0;
      let smooth = 0;
      let prev   = performance.now() / 1000;
      const t0   = prev;
      const ease = (v: number) => 1 - Math.pow(1 - v, 3);

      const animate = () => {
        const now = performance.now() / 1000;
        const dt  = Math.min(now - prev, 0.05);
        prev      = now;
        const t   = now - t0;

        smooth += (progressRef.current - smooth) * Math.min(1, dt * 5);
        const e  = ease(smooth);
        const as = 1 - e; // assembled factor

        /* cube pieces */
        for (const p of pieces) {
          // snap perfectly to home when essentially assembled (avoids float drift on idle)
          if (e < 0.004) {
            p.mesh.position.copy(p.home);
            p.mesh.rotation.set(0, 0, 0);
            continue;
          }

          const bx = p.home.x + (p.scatter.x - p.home.x) * e;
          const by = p.home.y + (p.scatter.y - p.home.y) * e;
          const bz = p.home.z + (p.scatter.z - p.home.z) * e;

          const fx = Math.sin(t * 0.45 + p.floatPhase) * p.floatAmp * e;
          const fy = Math.cos(t * 0.38 + p.floatPhase) * p.floatAmp * e;

          p.mesh.position.set(bx + fx, by + fy, bz);

          // spin is zero when assembled, full when exploded — prevents rotation buildup
          const spinE = e * e;
          p.mesh.rotation.x += p.spin.x * spinE * dt;
          p.mesh.rotation.y += p.spin.y * spinE * dt;
          p.mesh.rotation.z += p.spin.z * spinE * dt;

          // exponential decay back to zero rotation as pieces reassemble
          const decay = Math.pow(1 - e, 2) * 9 * dt;
          const f     = 1 - Math.min(decay, 0.8);
          p.mesh.rotation.x *= f;
          p.mesh.rotation.y *= f;
          p.mesh.rotation.z *= f;
        }

        /* cube group rotation + parallax */
        group.rotation.y += dt * (0.22 + as * 0.12);
        group.rotation.x += (mouse.y * 0.4 - group.rotation.x) * 0.04;
        group.rotation.z += (-mouse.x * 0.15 - group.rotation.z) * 0.04;

        /* particle drift */
        const positions = pGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < P_COUNT; i++) {
          positions[i * 3]     += pVel[i].x;
          positions[i * 3 + 1] += pVel[i].y;
          if (Math.abs(positions[i * 3])     > 40) pVel[i].x *= -1;
          if (Math.abs(positions[i * 3 + 1]) > 25) pVel[i].y *= -1;
        }
        pGeo.attributes.position.needsUpdate = true;
        particleSys.rotation.y = t * 0.018;
        pMat.opacity = 0.3 + e * 0.4;

        /* floating wireframes */
        for (const w of wires) {
          w.mesh.rotation.x += w.spin.x * dt;
          w.mesh.rotation.y += w.spin.y * dt;
          w.mesh.rotation.z += w.spin.z * dt;
          w.mesh.position.y += Math.sin(t * 0.3 + w.floatPhase) * 0.005;
          (w.mesh.material as THREE.LineBasicMaterial).opacity =
            (0.12 + e * 0.2) * Math.min(smooth * 3, 1);
        }

        /* camera parallax */
        camera.position.z = getBaseZ() + e * 8;
        camera.position.x += (mouse.x * 2.5 - camera.position.x) * 0.04;
        camera.position.y += (-mouse.y * 2.5 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        /* pulsing rim light */
        blueRim.intensity = 150 + Math.sin(t * 1.4) * 50;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();

      /* ── resize ── */
      const onResize = () => {
        const w = mount.offsetWidth  || window.innerWidth;
        const h = mount.offsetHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      /* ── cleanup ── */
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll",    onScroll);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize",    onResize);
        geo.dispose();
        pGeo.dispose();
        pieces.forEach((p) => (p.mesh.material as THREE.Material).dispose());
        renderer.dispose();
        if (renderer.domElement.parentNode) mount.removeChild(renderer.domElement);
      };
    };

    /* defer one frame so the fixed div has layout dimensions */
    const id = requestAnimationFrame(setup);
    return () => cancelAnimationFrame(id);
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 h-screen w-screen pointer-events-none" aria-hidden />;
}
