import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Product.css";

/* ------------------------------------------------------------------
   Sidebar nav — every entry shows in the UI.
   `viewable: true` = we render a dedicated mock view for that item.
------------------------------------------------------------------ */
const NAV = [
  { id: "dashboard", label: "Dashboard", viewable: true },
  { id: "turnos", label: "Turnos", viewable: true },
  { id: "clientes", label: "Clientes", viewable: true },
  { id: "servicios", label: "Servicios", viewable: false },
  { id: "empleados", label: "Empleados", viewable: false },
  { id: "caja", label: "Caja", viewable: true },
  { id: "analisis", label: "Análisis", viewable: true },
  { id: "recordatorios", label: "Recordatorios", viewable: false },
  { id: "configuracion", label: "Configuración", viewable: false },
];

const VIEWS = NAV.filter((n) => n.viewable).map((n) => n.id);

const NavIcon = () => (
  <svg
    viewBox="0 0 16 16"
    className="product__nav-icon"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="8" cy="8" r="2" fill="currentColor" />
  </svg>
);

export default function Product() {
  const stageRef = useRef(null);
  const stickyRef = useRef(null);
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Use matchMedia so we only pin on viewports where it's pleasant.
      const mm = gsap.matchMedia();

      mm.add("(min-width: 880px)", () => {
        ScrollTrigger.create({
          trigger: stageRef.current,
          start: "top top",
          end: `+=${VIEWS.length * 100}%`,
          pin: stickyRef.current,
          pinSpacing: true,
          scrub: 0.4,
          onUpdate: (self) => {
            // Map progress 0→1 onto the discrete view list.
            const idx = Math.min(
              VIEWS.length - 1,
              Math.floor(self.progress * VIEWS.length * 0.9999)
            );
            setActive(VIEWS[idx]);
          },
        });
      });

      // On mobile we cycle through views with simple in-view triggers
      // for the auxiliary "scroll dots" that sit below the mock.
    }, stageRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="section product" id="producto">
      <div className="container">
        <header className="product__intro">
          <span className="eyebrow">EL PRODUCTO</span>
          <h2 className="display display-lg">
            Una sola plataforma para{" "}
            <span className="italic-accent">cada día</span> de tu operación.
          </h2>
          <p className="body-lg">
            Stratus Cuts es una de nuestras plataformas en producción: un
            sistema integral de gestión para clínicas, estudios y consultorios.
            Turnos, clientes, caja y análisis, en una misma interfaz pensada
            para operadores reales.
          </p>
        </header>
      </div>

      <div className="product__stage" ref={stageRef}>
        <div className="product__sticky" ref={stickyRef}>
          <div className="product__app" data-active={active}>
            {/* Window chrome */}
            <div className="product__chrome" aria-hidden="true">
              <span className="product__chrome-dot" />
              <span className="product__chrome-dot" />
              <span className="product__chrome-dot" />
              <span className="product__chrome-url">
                studio-elite.stratus.io / {active}
              </span>
            </div>

            <div className="product__body">
              {/* Sidebar */}
              <aside className="product__sidebar" aria-label="Navegación de demo">
                <div className="product__brand">
                  <div className="product__brand-mark" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14">
                      <path
                        d="M8 1 L15 8 L8 15 L1 8 Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <circle cx="8" cy="8" r="2" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="product__brand-text">
                    <p>Studio Élite</p>
                    <span>PANEL ADMIN</span>
                  </div>
                </div>

                <span className="product__sidebar-label">NAVEGACIÓN</span>
                <ul className="product__nav">
                  {NAV.map((item) => (
                    <li
                      key={item.id}
                      data-viewable={item.viewable}
                      className={`product__nav-item ${
                        active === item.id ? "is-active" : ""
                      }`}
                      onClick={() => item.viewable && setActive(item.id)}
                    >
                      <NavIcon />
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>

                <p className="product__sidebar-foot">Stratus Cuts © 2026</p>
              </aside>

              {/* Main content area */}
              <main className="product__main">
                <DashboardView active={active === "dashboard"} />
                <TurnosView active={active === "turnos"} />
                <ClientesView active={active === "clientes"} />
                <CajaView active={active === "caja"} />
                <AnalisisView active={active === "analisis"} />
              </main>
            </div>
          </div>

          {/* Progress indicator below the mock */}
          <div className="product__progress" aria-hidden="true">
            {VIEWS.map((id) => (
              <span
                key={id}
                className={`product__progress-dot ${
                  active === id ? "is-active" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   VIEWS
   Each view renders inside `.product__main` with absolute
   positioning so they can crossfade. The `active` prop toggles
   the `is-active` class.
============================================================ */

function ViewShell({ active, title, subtitle, action, children, name }) {
  return (
    <section
      className={`product__view ${active ? "is-active" : ""}`}
      data-view={name}
      aria-hidden={!active}
    >
      <header className="product__view-head">
        <div>
          <h3 className="product__view-title">{title}</h3>
          <p className="product__view-sub">{subtitle}</p>
        </div>
        {action && <div className="product__view-action">{action}</div>}
      </header>
      <div className="product__view-body">{children}</div>
    </section>
  );
}

/* ---------- 1. Dashboard ---------- */

function DashboardView({ active }) {
  return (
    <ViewShell
      active={active}
      name="dashboard"
      title="Dashboard"
      subtitle="Una mirada rápida a tu operación de hoy"
      action={
        <span className="product__chip product__chip--ghost">
          Lunes, 23 de marzo
        </span>
      }
    >
      <div className="product__kpis">
        <KpiCard label="TURNOS HOY" value="12" delta="+3" tone="positive" />
        <KpiCard
          label="INGRESOS DEL MES"
          value="$245k"
          delta="+18%"
          tone="positive"
        />
        <KpiCard label="CLIENTES ACTIVOS" value="87" delta="+5" tone="info" />
        <KpiCard
          label="OCUPACIÓN"
          value="78%"
          delta="+4 pts"
          tone="warm"
        />
      </div>

      <div className="product__row product__row--split">
        <div className="product__panel">
          <header className="product__panel-head">
            <h4>Últimos 7 días</h4>
            <span className="product__panel-sub">Ingresos diarios</span>
          </header>
          <Sparkline />
        </div>

        <div className="product__panel">
          <header className="product__panel-head">
            <h4>Próximos turnos</h4>
            <span className="product__panel-sub">Hoy</span>
          </header>
          <ul className="product__appt-list">
            {[
              { t: "14:00", c: "Lucía Pereyra", s: "Corte + color" },
              { t: "15:30", c: "Mateo Aguirre", s: "Corte" },
              { t: "16:30", c: "Florencia Sosa", s: "Manicura" },
              { t: "17:30", c: "Diego Roldán", s: "Barba" },
            ].map((a, i) => (
              <li key={a.t} style={{ "--i": i }}>
                <span className="product__appt-time">{a.t}</span>
                <span className="product__appt-client">{a.c}</span>
                <span className="product__appt-service">{a.s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ViewShell>
  );
}

function KpiCard({ label, value, delta, tone }) {
  return (
    <div className={`product__kpi product__kpi--${tone}`}>
      <span className="product__kpi-label">{label}</span>
      <span className="product__kpi-value">{value}</span>
      <span className="product__kpi-delta">{delta} vs. semana pasada</span>
    </div>
  );
}

function Sparkline() {
  // Static SVG sparkline — animates its draw-in via CSS keyframes.
  const points = [12, 18, 14, 22, 19, 28, 32];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 320;
  const h = 100;
  const step = w / (points.length - 1);
  const norm = (v) => h - ((v - min) / (max - min)) * (h - 12) - 6;
  const d = points
    .map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${norm(v)}`)
    .join(" ");
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="product__spark"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7b8cde" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7b8cde" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkFill)" className="product__spark-area" />
      <path
        d={d}
        fill="none"
        stroke="#7b8cde"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="product__spark-line"
      />
      {points.map((v, i) => (
        <circle
          key={i}
          cx={i * step}
          cy={norm(v)}
          r="2.2"
          fill="#7b8cde"
          className="product__spark-dot"
          style={{ "--i": i }}
        />
      ))}
    </svg>
  );
}

/* ---------- 2. Turnos ---------- */

function TurnosView({ active }) {
  const slots = [
    { t: "08:30", c: "Sofía Méndez", s: "Tratamiento facial", p: "Camila", st: "Confirmado", tone: "ok" },
    { t: "09:30", c: "Tomás Gallo", s: "Corte de pelo", p: "Pepe", st: "En curso", tone: "warn" },
    { t: "10:30", c: "—", s: "Disponible", p: "—", st: "Libre", tone: "muted" },
    { t: "11:30", c: "Andrea Ríos", s: "Manicura + pedicura", p: "Camila", st: "Confirmado", tone: "ok" },
    { t: "13:00", c: "Julián Ortiz", s: "Barba", p: "Pepe", st: "Pendiente", tone: "info" },
    { t: "14:30", c: "Lucía Pereyra", s: "Corte + color", p: "Pepe", st: "Confirmado", tone: "ok" },
  ];
  return (
    <ViewShell
      active={active}
      name="turnos"
      title="Turnos"
      subtitle="Agenda del día — vista por horario"
      action={
        <button className="product__btn product__btn--primary">
          + Nuevo turno
        </button>
      }
    >
      <div className="product__panel product__panel--flush">
        <div className="product__schedule">
          <div className="product__schedule-head">
            <span>HORA</span>
            <span>CLIENTE</span>
            <span>SERVICIO</span>
            <span>PROFESIONAL</span>
            <span>ESTADO</span>
          </div>
          {slots.map((row, i) => (
            <div
              key={row.t}
              className="product__schedule-row"
              style={{ "--i": i }}
              data-tone={row.tone}
            >
              <span className="product__schedule-time">{row.t}</span>
              <span>{row.c}</span>
              <span>{row.s}</span>
              <span>{row.p}</span>
              <span className={`product__chip product__chip--${row.tone}`}>
                {row.st}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ViewShell>
  );
}

/* ---------- 3. Clientes ---------- */

function ClientesView({ active }) {
  const rows = [
    { n: "Lucía Pereyra", p: "+54 11 4423-1102", l: "hace 2 días", t: "$ 38.500" },
    { n: "Mateo Aguirre", p: "+54 11 5611-9087", l: "hace 1 semana", t: "$ 21.000" },
    { n: "Florencia Sosa", p: "+54 11 4778-3320", l: "hoy", t: "$ 92.300" },
    { n: "Diego Roldán", p: "+54 11 6622-0014", l: "hace 3 días", t: "$ 14.700" },
    { n: "Camila Bianchi", p: "+54 11 4901-2245", l: "hace 5 días", t: "$ 56.100" },
    { n: "Andrés Vega", p: "+54 11 3344-7711", l: "hace 12 días", t: "$ 8.900" },
  ];
  return (
    <ViewShell
      active={active}
      name="clientes"
      title="Clientes"
      subtitle="Tu base completa, segmentable por uso e historial"
      action={
        <div className="product__search">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11 11 L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input placeholder="Buscar cliente…" readOnly />
        </div>
      }
    >
      <div className="product__panel product__panel--flush">
        <div className="product__table">
          <div className="product__table-head">
            <span>NOMBRE</span>
            <span>TELÉFONO</span>
            <span>ÚLTIMO TURNO</span>
            <span className="product__align-right">FACTURADO</span>
          </div>
          {rows.map((r, i) => (
            <div
              className="product__table-row"
              key={r.n}
              style={{ "--i": i }}
            >
              <span className="product__client">
                <span className="product__avatar-mini" aria-hidden="true">
                  {r.n.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </span>
                {r.n}
              </span>
              <span className="product__cell-mono">{r.p}</span>
              <span>{r.l}</span>
              <span className="product__align-right product__cell-num">
                {r.t}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ViewShell>
  );
}

/* ---------- 4. Caja ---------- */

function CajaView({ active }) {
  return (
    <ViewShell
      active={active}
      name="caja"
      title="Caja"
      subtitle="Ingresos, gastos y ganancias"
      action={
        <button className="product__btn product__btn--primary">
          Finalizar y cerrar caja
        </button>
      }
    >
      <div className="product__tabs">
        <button className="product__tab is-active">Caja diaria</button>
        <button className="product__tab">Caja mensual</button>
      </div>

      <div className="product__kpis product__kpis--caja">
        <CajaKpi label="INGRESOS" value="$ 15.000,00" hint="1 turno" tone="positive" />
        <CajaKpi label="GASTOS" value="$ 0,00" hint="0 movimientos" tone="negative" />
        <CajaKpi label="GANANCIA NETA" value="$ 15.000,00" hint="" tone="info" />
        <CajaKpi label="MARGEN" value="100%" hint="sobre ingresos brutos" tone="grad" />
      </div>

      <div className="product__panel product__panel--flush">
        <header className="product__panel-head product__panel-head--inline">
          <h4>Ingresos del día</h4>
          <span className="product__panel-sub">Turnos confirmados y completados</span>
        </header>
        <div className="product__table product__table--caja">
          <div className="product__table-head">
            <span>HORA</span>
            <span>CLIENTE</span>
            <span>PROFESIONAL</span>
            <span>SERVICIO</span>
            <span>MÉTODO</span>
            <span className="product__align-right">MONTO</span>
          </div>
          <div className="product__table-row" style={{ "--i": 0 }}>
            <span className="product__cell-accent">15:30</span>
            <span>—</span>
            <span>Pepe</span>
            <span>Corte de pelo</span>
            <span className="product__chip product__chip--info">transferencia</span>
            <span className="product__align-right product__cell-num product__cell-pos">
              +$ 15.000,00
            </span>
          </div>
        </div>
      </div>
    </ViewShell>
  );
}

function CajaKpi({ label, value, hint, tone }) {
  return (
    <div className={`product__caja-kpi product__caja-kpi--${tone}`}>
      <span className="product__kpi-label">{label}</span>
      <span className="product__caja-value">{value}</span>
      {hint && <span className="product__kpi-hint">{hint}</span>}
    </div>
  );
}

/* ---------- 5. Análisis ---------- */

function AnalisisView({ active }) {
  const bars = [
    { d: "Lun", v: 0.55 },
    { d: "Mar", v: 0.72 },
    { d: "Mié", v: 0.48 },
    { d: "Jue", v: 0.84 },
    { d: "Vie", v: 0.96 },
    { d: "Sáb", v: 0.78 },
    { d: "Dom", v: 0.32 },
  ];
  const services = [
    { name: "Corte + color", pct: 38 },
    { name: "Corte de pelo", pct: 26 },
    { name: "Manicura", pct: 18 },
    { name: "Tratamiento facial", pct: 12 },
    { name: "Otros", pct: 6 },
  ];
  return (
    <ViewShell
      active={active}
      name="analisis"
      title="Análisis"
      subtitle="Tendencias de la última semana"
      action={
        <div className="product__chip-group">
          <span className="product__chip product__chip--ghost is-active">7d</span>
          <span className="product__chip product__chip--ghost">30d</span>
          <span className="product__chip product__chip--ghost">90d</span>
        </div>
      }
    >
      <div className="product__row product__row--split">
        <div className="product__panel">
          <header className="product__panel-head">
            <h4>Ingresos por día</h4>
            <span className="product__panel-sub">Esta semana vs. anterior</span>
          </header>
          <div className="product__bars">
            {bars.map((b, i) => (
              <div className="product__bar-col" key={b.d} style={{ "--i": i, "--v": b.v }}>
                <span className="product__bar" />
                <span className="product__bar-label">{b.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="product__panel">
          <header className="product__panel-head">
            <h4>Servicios más facturados</h4>
            <span className="product__panel-sub">Top de la semana</span>
          </header>
          <ul className="product__svc-list">
            {services.map((s, i) => (
              <li key={s.name} style={{ "--i": i, "--pct": s.pct }}>
                <span className="product__svc-name">{s.name}</span>
                <span className="product__svc-track">
                  <span className="product__svc-fill" />
                </span>
                <span className="product__svc-pct">{s.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ViewShell>
  );
}
