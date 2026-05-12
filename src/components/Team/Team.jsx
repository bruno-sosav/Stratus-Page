import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Team.css";

const team = [
  { initials: "BSV", name: "Bruno Sosa Villamón", role: "CEO · COFUNDADOR" },
  { initials: "AL", name: "Alen Lantaño", role: "CTO · COFUNDADOR" },
];

export default function Team() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".team__heading > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".team__heading", start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".team__card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".team__grid", start: "top 80%" },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section team" ref={sectionRef}>
      <div className="container">
        <header className="team__heading">
          <span className="eyebrow">EL EQUIPO</span>
          <h2 className="display display-lg">
            Dos fundadores. Un mismo{" "}
            <span className="italic-accent">estándar</span>.
          </h2>
          <p className="body-lg">
            Stratus opera con un equipo deliberadamente reducido. Cada
            plataforma la diseñan y construyen las mismas dos personas, las cuales 
            se encargan de buscar la solución mas precisa y eficiente a cada necesidad
            que cada negocio tenga. Buscando siempre maximizar resultados y minimizar costos
            de quienes confian en nosotros. 
          </p>
        </header>

        <div className="team__grid">
          {team.map((m) => (
            <article className="team__card" key={m.initials}>
              <div className="team__avatar" aria-hidden="true">
                <span className="team__initials">{m.initials}</span>
                <span className="team__avatar-glow" />
              </div>
              <h3 className="team__name display display-md">{m.name}</h3>
              <span className="team__role label">{m.role}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
