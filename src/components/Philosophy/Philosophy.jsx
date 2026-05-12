import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Philosophy.css";

const blocks = [
  {
    id: "orbita",
    eyebrow: "01",
    title: "Ingeniería en órbita de tu negocio",
    body:
      "Cada plataforma gira alrededor de tus procesos reales. Diseñamos sistemas que simplifican la operación, y maximizan resultados.",
    visual: "orbit",
  },
  {
    id: "modular",
    eyebrow: "02",
    title: (
      <>
        Precisión <span className="italic-accent">modular</span>
      </>
    ),
    body:
      "Arquitectura cloud-native, componentes desacoplados y estándares abiertos. Todo lo que construimos se integra, se extiende y se mantiene.",
    visual: "grid",
  },
  {
    id: "datos",
    eyebrow: "03",
    title: "Datos en movimiento",
    body:
      "Telemetría operativa, reportes en tiempo real y pipelines que transforman la información cruda en decisiones ejecutivas.",
    visual: "bars",
  },
  {
    id: "impacto",
    eyebrow: "04",
    title: "Impacto medible",
    body:
      "No vendemos horas ni entregables. Medimos el éxito en reducción de fricción, tiempo recuperado y claridad operativa.",
    visual: "pulse",
  },
];

export default function Philosophy() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return undefined;
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        ".philosophy__heading > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".philosophy__heading",
            start: "top 80%",
          },
        }
      );

      // Each block: line draws + content fades in
      gsap.utils.toArray(".philosophy__block").forEach((block) => {
        const line = block.querySelector(".philosophy__divider");
        const content = block.querySelectorAll(
          ".philosophy__block-eyebrow, .philosophy__block-title, .philosophy__block-body, .philosophy__visual"
        );

        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 1.1,
            ease: "power3.inOut",
            scrollTrigger: { trigger: block, start: "top 85%" },
          }
        );

        gsap.fromTo(
          content,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: block, start: "top 80%" },
          }
        );
      });
    }, sectionRef.current);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="section philosophy" id="filosofia" ref={sectionRef}>
      <div className="container">
        <header className="philosophy__heading">
          <span className="eyebrow">FILOSOFÍA</span>
          <h2 className="display display-lg">
            Construimos sistemas con{" "}
            <span className="italic-accent">criterio</span>, no con{" "}
            <span className="italic-accent">prisa</span>.
          </h2>
          <p className="body-lg">
            Cuatro principios guían cada plataforma que entregamos.
          </p>
        </header>

        <div className="philosophy__blocks">
          {blocks.map((block) => (
            <article className="philosophy__block" key={block.id}>
              <div className="philosophy__divider" aria-hidden="true" />
              <div className="philosophy__block-grid">
                <div className="philosophy__block-text">
                  <span className="philosophy__block-eyebrow label">
                    — {block.eyebrow}
                  </span>
                  <h3 className="philosophy__block-title display display-md">
                    {block.title}
                  </h3>
                  <p className="philosophy__block-body body-md">{block.body}</p>
                </div>
                <div
                  className={`philosophy__visual philosophy__visual--${block.visual}`}
                  aria-hidden="true"
                >
                  {block.visual === "orbit" && <OrbitVisual />}
                  {block.visual === "grid" && <GridVisual />}
                  {block.visual === "bars" && <BarsVisual />}
                  {block.visual === "pulse" && <PulseVisual />}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Visuals ----------------------- */

function OrbitVisual() {
  return (
    <div className="vfx-orbit">
      <span className="vfx-orbit__center" />
      <span className="vfx-orbit__ring vfx-orbit__ring--1">
        <span className="vfx-orbit__satellite" />
      </span>
      <span className="vfx-orbit__ring vfx-orbit__ring--2">
        <span className="vfx-orbit__satellite vfx-orbit__satellite--warm" />
      </span>
      <span className="vfx-orbit__ring vfx-orbit__ring--3" />
    </div>
  );
}

function GridVisual() {
  return (
    <div className="vfx-grid">
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} style={{ "--i": i }} className="vfx-grid__cell" />
      ))}
    </div>
  );
}

function BarsVisual() {
  return (
    <div className="vfx-bars">
      {Array.from({ length: 7 }).map((_, i) => (
        <span key={i} style={{ "--i": i }} className="vfx-bars__bar" />
      ))}
    </div>
  );
}

function PulseVisual() {
  return (
    <div className="vfx-pulse">
      <span className="vfx-pulse__ring" />
      <span className="vfx-pulse__ring vfx-pulse__ring--delay" />
      <span className="vfx-pulse__core" />
    </div>
  );
}
