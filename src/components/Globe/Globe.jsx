import { useEffect, useRef } from "react";
import "./Globe.css";

/* ============================================================
   Continent polygons in [lon, lat] vertices (rough but
   recognizable). Used to flag which sphere grid points are
   "land" vs "ocean". Resolution: ~2.5° grid → ~2000 land dots.
============================================================ */
const CONTINENTS = [
  // North America
  [
    [-167, 65], [-160, 71], [-130, 72], [-95, 75], [-80, 78], [-65, 78],
    [-55, 75], [-55, 50], [-65, 45], [-78, 35], [-80, 25], [-87, 21],
    [-97, 16], [-105, 18], [-114, 23], [-122, 35], [-128, 50], [-150, 60],
    [-167, 65],
  ],
  // South America
  [
    [-77, 12], [-62, 10], [-50, 5], [-35, -5], [-35, -8], [-42, -23],
    [-57, -34], [-68, -55], [-75, -50], [-73, -25], [-80, -10], [-78, 5],
    [-77, 12],
  ],
  // Greenland
  [
    [-45, 83], [-22, 78], [-22, 70], [-42, 60], [-55, 70], [-58, 78],
    [-45, 83],
  ],
  // Eurasia (Europe + Asia merged)
  [
    [-10, 36], [-10, 43], [-5, 48], [-3, 58], [5, 60], [12, 65], [25, 71],
    [60, 75], [100, 78], [140, 73], [180, 68], [180, 60], [165, 55],
    [145, 45], [128, 38], [122, 30], [115, 22], [108, 12], [102, 6],
    [98, 18], [88, 22], [78, 8], [73, 22], [60, 25], [55, 18], [45, 13],
    [38, 16], [33, 30], [28, 41], [22, 38], [12, 38], [0, 43], [-10, 36],
  ],
  // Africa
  [
    [10, 35], [33, 30], [38, 16], [45, 13], [50, 12], [50, 2], [40, -3],
    [40, -16], [35, -22], [25, -33], [18, -35], [13, -22], [12, -10],
    [9, 4], [-7, 5], [-17, 14], [-16, 22], [-2, 28], [-10, 32], [10, 35],
  ],
  // Australia
  [
    [113, -22], [120, -19], [130, -12], [137, -11], [144, -11], [152, -25],
    [148, -38], [138, -38], [128, -34], [116, -34], [113, -22],
  ],
  // Madagascar
  [
    [49, -12], [50, -18], [47, -25], [44, -22], [44, -16], [49, -12],
  ],
];

/* Cities where Stratus Industries operates */
const MARKERS = [
  { city: "Buenos Aires", lat: -34.6, lon: -58.4 },
  { city: "Madrid", lat: 40.4, lon: -3.7 },
];

function pointInPolygon([x, y], poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function isLand(lon, lat) {
  for (const poly of CONTINENTS) {
    if (pointInPolygon([lon, lat], poly)) return true;
  }
  return false;
}

function latLonToVec(lat, lon) {
  const latR = (lat * Math.PI) / 180;
  const lonR = (lon * Math.PI) / 180;
  const x = Math.cos(latR) * Math.sin(lonR);
  const y = Math.sin(latR);
  const z = Math.cos(latR) * Math.cos(lonR);
  return [x, y, z];
}

function buildLandDots() {
  const dots = [];
  const STEP = 2.4;
  for (let lat = -58; lat <= 82; lat += STEP) {
    // Step in lon scales with cos(lat) so density stays even on screen
    const lonStep = STEP / Math.max(0.25, Math.cos((lat * Math.PI) / 180));
    for (let lon = -180; lon < 180; lon += lonStep) {
      if (isLand(lon, lat)) {
        dots.push(latLonToVec(lat, lon));
      }
    }
  }
  return dots;
}

export default function Globe() {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return undefined;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let SIZE = 0;
    let RADIUS = 0;
    let CENTER = 0;

    // Sizing — fits the stage; capped at 580px on large screens.
    function sizeCanvas() {
      const stageRect = stage.getBoundingClientRect();
      // Globe takes ~78% of stage width (rest is whirl space)
      SIZE = Math.round(Math.min(stageRect.width, stageRect.height) * 0.78);
      RADIUS = SIZE * 0.46;
      CENTER = SIZE / 2;
      canvas.width = SIZE * dpr;
      canvas.height = SIZE * dpr;
      canvas.style.width = `${SIZE}px`;
      canvas.style.height = `${SIZE}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeCanvas();

    const ro = new ResizeObserver(sizeCanvas);
    ro.observe(stage);

    // Generate static data once
    const landDots = buildLandDots();
    const markers = MARKERS.map((m, i) => {
      const v = latLonToVec(m.lat, m.lon);
      return { ...m, vec: v, phase: (i * Math.PI * 2) / MARKERS.length };
    });

    // Visibility — pause RAF when section off-screen
    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visible = e.isIntersecting;
          if (visible && !raf) {
            raf = requestAnimationFrame(frame);
          }
        });
      },
      { threshold: 0.05 }
    );
    io.observe(stage);

    // Axial tilt: ~17° — North Pole leans toward the viewer
    const TILT = -0.3;
    const ct = Math.cos(TILT);
    const st = Math.sin(TILT);

    let raf = null;
    let prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function rotate([x, y, z], cy, sy) {
      // Y rotation (spin)
      const x1 = x * cy + z * sy;
      const z1 = -x * sy + z * cy;
      const y1 = y;
      // X rotation (tilt) — tilts North Pole toward camera
      const x2 = x1;
      const y2 = y1 * ct - z1 * st;
      const z2 = y1 * st + z1 * ct;
      return [x2, y2, z2];
    }

    function frame(t) {
      if (!visible) {
        raf = null;
        return;
      }
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Slow rotation; reduced-motion users get a stationary globe.
      const rotY = prefersReduced ? 0.6 : t * 0.00018;
      const cy = Math.cos(rotY);
      const sy = Math.sin(rotY);

      // ----- Faint sphere fill so the silhouette reads even when
      //       there are no dots in the ocean.
      const grad = ctx.createRadialGradient(
        CENTER - RADIUS * 0.35,
        CENTER - RADIUS * 0.4,
        RADIUS * 0.1,
        CENTER,
        CENTER,
        RADIUS
      );
      grad.addColorStop(0, "rgba(56, 189, 248, 0.05)");
      grad.addColorStop(0.6, "rgba(56, 189, 248, 0.015)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Subtle equator + meridian lines — only the visible halves
      ctx.strokeStyle = "rgba(240, 237, 232, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      // ----- Land dots
      for (let i = 0; i < landDots.length; i++) {
        const [x, y, z] = rotate(landDots[i], cy, sy);
        if (z < 0) continue;
        const sx = CENTER + x * RADIUS;
        const syp = CENTER - y * RADIUS;
        const depth = z; // 0..1, larger = closer to camera
        const size = 0.85 + depth * 0.85;
        const alpha = 0.22 + depth * 0.55;
        ctx.fillStyle = `rgba(240, 237, 232, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, syp, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ----- Markers (cyan pulse)
      for (let i = 0; i < markers.length; i++) {
        const m = markers[i];
        const [x, y, z] = rotate(m.vec, cy, sy);
        // Allow markers near the limb to fade out instead of pop
        if (z < -0.08) continue;
        const sx = CENTER + x * RADIUS;
        const syp = CENTER - y * RADIUS;
        const limbFade = z < 0 ? 1 + z / 0.08 : 1;

        const pulse = 0.5 + 0.5 * Math.sin(t * 0.0028 + m.phase);

        // Outer glow halo
        const haloR = 11 + pulse * 7;
        const haloGrad = ctx.createRadialGradient(sx, syp, 0, sx, syp, haloR);
        haloGrad.addColorStop(0, `rgba(159, 232, 255, ${0.55 * limbFade})`);
        haloGrad.addColorStop(
          0.5,
          `rgba(159, 232, 255, ${0.18 * limbFade * (1 - pulse * 0.6)})`
        );
        haloGrad.addColorStop(1, "rgba(159, 232, 255, 0)");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(sx, syp, haloR, 0, Math.PI * 2);
        ctx.fill();

        // Expanding pulse ring
        const ringR = 4 + pulse * 16;
        ctx.strokeStyle = `rgba(159, 232, 255, ${
          (1 - pulse) * 0.55 * limbFade
        })`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(sx, syp, ringR, 0, Math.PI * 2);
        ctx.stroke();

        // Core dot
        ctx.fillStyle = `rgba(210, 245, 255, ${0.95 * limbFade})`;
        ctx.beginPath();
        ctx.arc(sx, syp, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Tiny white center
        ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * limbFade})`;
        ctx.beginPath();
        ctx.arc(sx, syp, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <section className="section globe">
      <div className="container globe__container">
        <header className="globe__heading">
          <span className="eyebrow">PRESENCIA</span>
          <h2 className="display display-lg">
            Nacidos en Argentina.{" "}
            <span className="italic-accent">Disponibles donde estés.</span>
          </h2>
          <p className="body-lg">
            Somos un equipo argentino con operación también en España. Trabajamos
            de forma remota con cualquier negocio — la distancia no es una
            barrera cuando lo que entregamos funciona.
          </p>
        </header>

        <div className="globe__stage" ref={stageRef}>
          {/* Whirl rings (CSS) */}
          <span className="globe__whirl globe__whirl--outer" aria-hidden="true">
            <span className="globe__whirl-node" />
          </span>
          <span className="globe__whirl globe__whirl--mid" aria-hidden="true" />
          <span
            className="globe__whirl globe__whirl--accent"
            aria-hidden="true"
          />
          <span
            className="globe__whirl globe__whirl--inner"
            aria-hidden="true"
          >
            <span className="globe__whirl-node globe__whirl-node--warm" />
          </span>

          {/* Soft glow plate behind */}
          <span className="globe__glow" aria-hidden="true" />

          <canvas
            ref={canvasRef}
            className="globe__canvas"
            aria-hidden="true"
          />
        </div>

        <ul className="globe__legend" aria-label="Convenciones del mapa">
          <li>
            <span className="globe__legend-dot globe__legend-dot--land" />
            <span>Continentes</span>
          </li>
          <li>
            <span className="globe__legend-dot globe__legend-dot--live" />
            <span>Sistema activo</span>
          </li>
          <li>
            <span className="globe__legend-meta">
              Argentina · España
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
