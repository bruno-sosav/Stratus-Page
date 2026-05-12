import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Hero.css";

export default function Hero() {
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctasRef = useRef(null);
  const starsRef = useRef(null);
  const heroRef = useRef(null);

  // Headline reveal timeline
  useEffect(() => {
    const lines = Array.from(headlineRef.current?.querySelectorAll(".hero__line-inner") ?? []);
    if (!lines.length) return undefined;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(lines, { y: "110%" }, { y: "0%", duration: 1.1, stagger: 0.12 })
      .fromTo(
        subRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        "-=0.5"
      )
      .fromTo(
        Array.from(ctasRef.current?.children ?? []),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
        "-=0.6"
      );

    return () => tl.kill();
  }, []);

  // Starfield — canvas-driven, depth layers + twinkle + diffraction crosses
  // on bright stars + occasional shooting stars + soft nebula clouds.
  useEffect(() => {
    const canvas = starsRef.current;
    const host = heroRef.current;
    if (!canvas || !host) return undefined;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let stars = [];
    let shootingStars = [];
    let lastShootingAt = 0;
    let nextShootingDelay = 14000 + Math.random() * 14000;
    let raf = null;
    let visible = true;

    // Star tint distribution: mostly white, faint blue-white & amber-white
    function pickTint() {
      const r = Math.random();
      if (r < 0.88) return [255, 255, 255];
      if (r < 0.96) return [220, 230, 255];
      return [255, 240, 220];
    }

    function makeStar() {
      // z² skews HARD toward tiny/dim stars — looks like a real night sky
      const z = Math.pow(Math.random(), 2.0);
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        z,
        baseAlpha: 0.18 + z * 0.78,
        size: 0.25 + z * 1.1,
        twinkleSpeed: 0.0005 + Math.random() * 0.0014,
        twinklePhase: Math.random() * Math.PI * 2,
        color: pickTint(),
        // Bright stars are rare; only the top ~2.5% get a halo
        bright: Math.random() < 0.022 + z * 0.04,
        // Even rarer: diffraction-cross capable (~1%)
        crossable: Math.random() < 0.01,
        driftSpeed: 0.0004 + Math.random() * 0.0009,
      };
    }

    function resize() {
      const rect = host.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density-based star count — saturated like a real long-exposure sky.
      // Capped so very large viewports don't blow up frame time.
      const NUM = Math.min(2000, Math.round((W * H) / 700));
      stars = [];
      for (let i = 0; i < NUM; i++) stars.push(makeStar());
    }

    function drawStars(t) {
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        // Subtle twinkle — range [0.4, 1.0]. Most stars stay near 0.7-1.0.
        const tw = 0.7 + 0.3 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        const alpha = s.baseAlpha * tw;
        // Slow horizontal parallax drift keyed to depth
        const x = (s.x + t * s.driftSpeed * s.z * 18) % (W + 20);
        const y = s.y;
        const [r, g, b] = s.color;

        // Halo only on the rare bright stars
        if (s.bright) {
          const haloR = s.size * 7 * tw;
          const halo = ctx.createRadialGradient(x, y, 0, x, y, haloR);
          halo.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.4})`);
          halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(x, y, haloR, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core pinpoint
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Diffraction cross — only on the rare crossable+bright stars at peak
        if (s.bright && s.crossable && tw > 0.88) {
          const len = s.size * 6.5 * tw;
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x - len, y);
          ctx.lineTo(x + len, y);
          ctx.moveTo(x, y - len);
          ctx.lineTo(x, y + len);
          ctx.stroke();
        }
      }
    }

    function drawShootingStars(t, dt) {
      // Spawn?
      if (!reduced && t - lastShootingAt > nextShootingDelay) {
        lastShootingAt = t;
        nextShootingDelay = 14000 + Math.random() * 16000;
        const angle = -0.25 - Math.random() * 0.25; // slope ~tan(angle)
        const speed = 0.55 + Math.random() * 0.35; // px/ms
        shootingStars.push({
          x: -40 + Math.random() * W * 0.4,
          y: Math.random() * H * 0.5,
          vx: Math.cos(angle) * speed,
          vy: -Math.sin(angle) * speed,
          life: 0,
          maxLife: 1100 + Math.random() * 500,
        });
      }

      shootingStars = shootingStars.filter((s) => {
        s.life += dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const lr = s.life / s.maxLife;
        if (lr > 1 || s.x > W + 100) return false;

        const alpha = lr < 0.2 ? lr / 0.2 : 1 - (lr - 0.2) / 0.8;
        const tailDx = -s.vx * 60;
        const tailDy = -s.vy * 60;
        const grad = ctx.createLinearGradient(
          s.x,
          s.y,
          s.x + tailDx,
          s.y + tailDy
        );
        grad.addColorStop(0, `rgba(255,255,255,${alpha * 0.95})`);
        grad.addColorStop(0.4, `rgba(200,220,255,${alpha * 0.4})`);
        grad.addColorStop(1, "rgba(200,220,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + tailDx, s.y + tailDy);
        ctx.stroke();

        // Bright head
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.4, 0, Math.PI * 2);
        ctx.fill();

        // Tiny halo
        const haloGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 8);
        haloGrad.addColorStop(0, `rgba(255,255,255,${alpha * 0.5})`);
        haloGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });
    }

    let lastT = performance.now();

    function frame(t) {
      if (!visible) {
        raf = null;
        return;
      }
      const dt = Math.min(48, t - lastT);
      lastT = t;

      ctx.clearRect(0, 0, W, H);
      drawStars(t);
      drawShootingStars(t, dt);
      raf = requestAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visible = e.isIntersecting;
          if (visible && !raf) {
            lastT = performance.now();
            raf = requestAnimationFrame(frame);
          }
        });
      },
      { threshold: 0 }
    );
    io.observe(host);

    raf = requestAnimationFrame(frame);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <section className="hero" id="top" ref={heroRef}>
      {/* Starfield — canvas behind everything */}
      <canvas ref={starsRef} className="hero__stars" aria-hidden="true" />

      {/* Atmospheric orb — pure CSS radial gradients with slow rotation */}
      <div className="hero__orb" aria-hidden="true">
        <div className="hero__orb-ring hero__orb-ring--a" />
        <div className="hero__orb-ring hero__orb-ring--b" />
        <div className="hero__orb-ring hero__orb-ring--c" />
        <div className="hero__orb-core" />
        <div className="hero__orb-glow" />
      </div>

      <div className="container hero__inner">
        <h1 className="hero__headline display display-xl" ref={headlineRef}>
          <span className="hero__line">
            <span className="hero__line-inner">
              Tu <span className="italic-accent">negocio,</span>
            </span>
          </span>
          <span className="hero__line">
            <span className="hero__line-inner">más ordenado</span>
          </span>
          <span className="hero__line">
            <span className="hero__line-inner">y mejor atendido.</span>
          </span>
        </h1>

        <p className="hero__sub body-lg" ref={subRef}>
          Creamos sistemas de gestión, páginas web y agentes IA para que tu
          negocio pierda menos tiempo en el desorden y gane más en lo que
          importa.
        </p>

        <div className="hero__ctas" ref={ctasRef}>
          <a href="#servicios" className="btn btn--primary">
            Ver qué hacemos <span className="arrow">→</span>
          </a>
          <a
            href="https://wa.me/5492236720416"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost"
          >
            Escribinos por WhatsApp
          </a>
        </div>

        <div className="hero__scroll-hint" aria-hidden="true">
          <span className="hero__scroll-line" />
          <span className="hero__scroll-text">SCROLL</span>
        </div>
      </div>
    </section>
  );
}
