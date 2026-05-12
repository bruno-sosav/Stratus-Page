import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./CTA.css";

const WHATSAPP_AR = "https://wa.me/5492236720416";
const WHATSAPP_ES  = "https://wa.me/342235673494";

// ── Mesh constants ──────────────────────────────────────────
const GRID_GAP    = 72;   // px between nodes
const CONNECT_MAX = 104;  // connects all 8 adjacent grid neighbours
const MAX_PACKETS = 35;   // simultaneous travelling data packets
const NODE_R      = 1.5;

function IconWhatsApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

// ── Mesh canvas hook ─────────────────────────────────────────
function useMeshCanvas(canvasRef, hostRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const host   = hostRef.current;
    if (!canvas || !host) return undefined;

    const ctx     = canvas.getContext("2d");
    const dpr     = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0;
    let nodes     = [];
    let nodeGlows = new Float32Array(0);
    let packets   = [];   // { i, j, t, speed, warm }
    let lastNow   = 0;
    let raf = null, visible = false;

    // ── Build grid ──────────────────────────────────────────
    function buildNodes() {
      nodes   = [];
      packets = [];
      const cols = Math.ceil(W / GRID_GAP) + 2;
      const rows = Math.ceil(H / GRID_GAP) + 2;
      const offX = (W - (cols - 1) * GRID_GAP) / 2;
      const offY = (H - (rows - 1) * GRID_GAP) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          nodes.push({
            bx:    offX + c * GRID_GAP,
            by:    offY + r * GRID_GAP,
            // More amplitude for visible drift
            ampX:  14 + Math.random() * 16,
            ampY:  12 + Math.random() * 14,
            phX:   Math.random() * Math.PI * 2,
            phY:   Math.random() * Math.PI * 2,
            speed: 0.00038 + Math.random() * 0.00030,
            warm:  Math.random() < 0.07,
          });
        }
      }
      nodeGlows = new Float32Array(nodes.length);
    }

    // ── Current wave positions ──────────────────────────────
    function getPositions(t) {
      const d = reduced ? 0 : 1;
      return nodes.map(n => ({
        x:    n.bx + Math.sin(t * n.speed + n.phX) * n.ampX * d,
        y:    n.by + Math.cos(t * n.speed * 0.73 + n.phY) * n.ampY * d,
        warm: n.warm,
      }));
    }

    // ── Spawn a new data packet ─────────────────────────────
    function spawnPacket(pos) {
      if (packets.length >= MAX_PACKETS) return;
      const i = Math.floor(Math.random() * pos.length);
      const neighbors = [];
      for (let j = 0; j < pos.length; j++) {
        if (j === i) continue;
        const dx = pos[i].x - pos[j].x;
        if (Math.abs(dx) > CONNECT_MAX) continue;
        const dy = pos[i].y - pos[j].y;
        if (Math.abs(dy) > CONNECT_MAX) continue;
        if (dx * dx + dy * dy <= CONNECT_MAX * CONNECT_MAX) neighbors.push(j);
      }
      if (!neighbors.length) return;
      const j = neighbors[Math.floor(Math.random() * neighbors.length)];
      // Variable speed: some packets zip, some crawl
      const speed = 0.00042 + Math.random() * 0.00055;
      packets.push({ i, j, t: 0, speed, warm: pos[i].warm || pos[j].warm });
    }

    // ── Main render loop ────────────────────────────────────
    function frame(now) {
      if (!visible) { raf = null; return; }
      const dt = Math.min(48, now - lastNow);
      lastNow = now;

      ctx.clearRect(0, 0, W, H);
      const pos = getPositions(now);

      // ─ Advance packets, collect arrivals ─
      const live = [];
      for (const p of packets) {
        p.t += p.speed * dt;
        if (p.t >= 1) {
          // Packet arrived — flash destination node
          nodeGlows[p.j] = Math.min(1, nodeGlows[p.j] + 0.95);
          // Chain: with 60% chance, immediately spawn another from that node
          if (!reduced && Math.random() < 0.6 && packets.length < MAX_PACKETS) {
            packets.push({ i: p.j, j: p.i, t: 0,
              speed: 0.00042 + Math.random() * 0.00055,
              warm: pos[p.j].warm });
          }
        } else {
          live.push(p);
        }
      }
      packets = live;

      // Spawn fresh packets at a base rate
      if (!reduced && Math.random() < 0.12) spawnPacket(pos);

      // ─ Decay node glows ─
      const decayRate = 0.030 * (dt / 16);
      for (let i = 0; i < nodeGlows.length; i++) {
        if (nodeGlows[i] > 0) nodeGlows[i] = Math.max(0, nodeGlows[i] - decayRate);
      }

      // ─ Build packet-on-edge lookup for edge brightening ─
      const litEdges = new Map();
      for (const p of packets) {
        const key = p.i < p.j ? `${p.i}_${p.j}` : `${p.j}_${p.i}`;
        litEdges.set(key, p.t);
      }

      // ─ Draw edges ─
      for (let i = 0; i < pos.length; i++) {
        const pi = pos[i];
        for (let j = i + 1; j < pos.length; j++) {
          const pj = pos[j];
          const dx = pi.x - pj.x;
          if (Math.abs(dx) > CONNECT_MAX) continue;
          const dy = pi.y - pj.y;
          if (Math.abs(dy) > CONNECT_MAX) continue;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > CONNECT_MAX) continue;

          const fade    = 1 - dist / CONNECT_MAX;
          const isWarm  = pi.warm || pj.warm;
          const key     = `${i}_${j}`;
          const lit     = litEdges.has(key);

          // Edges carrying a packet glow brighter
          const baseA   = isWarm ? 0.18 : 0.12;
          const alpha   = lit ? fade * 0.62 : fade * baseA;
          const lw      = lit ? 1.1 : 0.55;

          ctx.strokeStyle = isWarm
            ? `rgba(201, 169, 110, ${alpha})`
            : `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = lw;
          ctx.beginPath();
          ctx.moveTo(pi.x, pi.y);
          ctx.lineTo(pj.x, pj.y);
          ctx.stroke();
        }
      }

      // ─ Draw travelling packets ─
      for (const p of packets) {
        const from = pos[p.i];
        const to   = pos[p.j];
        const px   = from.x + (to.x - from.x) * p.t;
        const py   = from.y + (to.y - from.y) * p.t;

        // Outer glow
        const haloR = 10;
        const halo  = ctx.createRadialGradient(px, py, 0, px, py, haloR);
        if (p.warm) {
          halo.addColorStop(0, "rgba(201, 169, 110, 0.55)");
        } else {
          halo.addColorStop(0, "rgba(56, 189, 248, 0.45)");
        }
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(px, py, haloR, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        ctx.fillStyle = p.warm
          ? "rgba(255, 225, 150, 1)"
          : "rgba(190, 235, 255, 1)";
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fill();

        // Tiny trailing tail (3 fading dots behind the packet)
        for (let k = 1; k <= 3; k++) {
          const tt = Math.max(0, p.t - k * 0.035);
          const tx = from.x + (to.x - from.x) * tt;
          const ty = from.y + (to.y - from.y) * tt;
          const ta = (0.35 - k * 0.1);
          ctx.fillStyle = p.warm
            ? `rgba(201, 169, 110, ${ta})`
            : `rgba(56, 189, 248, ${ta})`;
          ctx.beginPath();
          ctx.arc(tx, ty, 1.5 - k * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ─ Draw nodes ─
      for (let i = 0; i < pos.length; i++) {
        const p    = pos[i];
        const glow = nodeGlows[i];
        const base = p.warm ? 0.58 : 0.36;
        const alpha  = base + glow * 0.42;
        const radius = NODE_R + (p.warm ? 0.5 : 0) + glow * 3;

        // Activation halo when glow > 0
        if (glow > 0.04) {
          const haloR = 12 + glow * 10;
          const hg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
          hg.addColorStop(0, p.warm
            ? `rgba(201, 169, 110, ${glow * 0.38})`
            : `rgba(56, 189, 248, ${glow * 0.32})`);
          hg.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = hg;
          ctx.beginPath();
          ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = p.warm
          ? `rgba(201, 169, 110, ${alpha})`
          : `rgba(56, 189, 248, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    // ── Resize ──────────────────────────────────────────────
    function resize() {
      const rect = host.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        visible = e.isIntersecting;
        if (visible && !raf) {
          lastNow = performance.now();
          raf = requestAnimationFrame(frame);
        }
      });
    }, { threshold: 0 });
    io.observe(host);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [canvasRef, hostRef]);
}

// ── Component ────────────────────────────────────────────────
export default function CTA() {
  const sectionRef = useRef(null);
  const meshRef    = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta__lines .cta__line-inner",
        { y: "110%" },
        {
          y: "0%",
          stagger: 0.12,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".cta__lines", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".cta__sub, .cta__buttons",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".cta__sub", start: "top 85%" },
        }
      );
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  useMeshCanvas(meshRef, sectionRef);

  return (
    <section className="section cta" ref={sectionRef}>
      <canvas className="cta__mesh" ref={meshRef} aria-hidden="true" />

      <div className="cta__bg" aria-hidden="true">
        <span className="cta__bg-orb" />
        <span className="cta__bg-aurora cta__bg-aurora--a" />
        <span className="cta__bg-aurora cta__bg-aurora--b" />
        <span className="cta__bg-aurora cta__bg-aurora--c" />
      </div>

      <div className="container cta__inner">
        <h2 className="cta__lines display display-xl">
          <span className="cta__line">
            <span className="cta__line-inner">Construyamos algo</span>
          </span>
          <span className="cta__line">
            <span className="cta__line-inner">
              <span className="italic-underline">que perdure.</span>
            </span>
          </span>
        </h2>

        <p className="cta__sub body-lg">
          Escribinos por WhatsApp y en menos de 24hs te respondemos. Sin
          formularios, sin vueltas.
        </p>

        <div className="cta__buttons">
          <a
            href={WHATSAPP_AR}
            className="btn btn--primary"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp Argentina"
          >
            <IconWhatsApp />
            WhatsApp AR <span className="arrow">→</span>
          </a>
          <a
            href={WHATSAPP_ES}
            className="btn btn--ghost"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp España"
          >
            <IconWhatsApp />
            WhatsApp ES
          </a>
        </div>
      </div>
    </section>
  );
}
