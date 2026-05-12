import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Process.css";

const steps = [
  {
    n: "01",
    title: "Hablamos",
    body: "Nos contás qué necesitás y cómo funciona tu negocio. En menos de 24hs te respondemos con una propuesta concreta. Sin reuniones eternas ni presupuestos que tardan semanas.",
  },
  {
    n: "02",
    title: "Construimos",
    body: "Arrancamos con lo acordado, te mostramos el avance y ajustamos en el camino. Plazo claro desde el principio. Sin sorpresas de último momento ni letra chica.",
  },
  {
    n: "03",
    title: "Lanzamos",
    body: "Entregamos algo que funciona desde el primer día. Y seguimos disponibles después — si necesitás ajustes o algo no cierra, lo resolvemos.",
  },
];

export default function Process() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".process__heading > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".process__heading", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".process__step",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".process__grid", start: "top 80%" },
        }
      );
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section process" id="proceso" ref={sectionRef}>
      <div className="container">
        <header className="process__heading">
          <span className="eyebrow">CÓMO TRABAJAMOS</span>
          <h2 className="display display-lg">
            Simple, rápido,{" "}
            <span className="italic-accent">sin vueltas</span>.
          </h2>
        </header>

        <div className="process__grid">
          {steps.map((s, i) => (
            <article className="process__step" key={s.n}>
              <span className="process__step-num label mono">{s.n}</span>
              {i < steps.length - 1 && (
                <span className="process__connector" aria-hidden="true" />
              )}
              <h3 className="process__step-title display display-md">{s.title}</h3>
              <p className="process__step-body body-md">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
