import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Industries.css";

const items = [
  {
    n: "01",
    title: "Peluquerías & estéticas",
    body:
      "Sistema de gestión completo: turnos online, historial de clientes, control de caja y reportes. Tu equipo trabaja sin papeles y tus clientes reservan desde el celular. Primer nicho disponible, más rubros en camino.",
  },
  {
    n: "02",
    title: "Gastronomía",
    body:
      "Página web a medida con menú digital, reservas de mesa y pedidos online. Diseñada para que tus clientes lleguen, reserven y pidan sin que tengas que levantar el teléfono.",
  },
  {
    n: "03",
    title: "Servicios profesionales",
    body:
      "Abogados, médicos, contadores, consultores. Una página web que muestra tus servicios, agenda consultas y te da presencia profesional online desde el día uno.",
  },
];

export default function Industries() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".industries__heading > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".industries__heading", start: "top 80%" },
        }
      );

      gsap.utils.toArray(".industries__row").forEach((row) => {
        const line = row.querySelector(".industries__divider");
        const content = row.querySelectorAll(
          ".industries__num, .industries__title, .industries__body"
        );

        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 1.1,
            ease: "power3.inOut",
            scrollTrigger: { trigger: row, start: "top 90%" },
          }
        );

        gsap.fromTo(
          content,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 85%" },
          }
        );
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section industries" ref={sectionRef}>
      <div className="container">
        <header className="industries__heading">
          <span className="eyebrow">INDUSTRIAS</span>
          <h2 className="display display-lg">
            Sectores donde operamos{" "}
            <span className="italic-accent">todos los días</span>.
          </h2>
          <p className="body-lg">
            Cada rubro tiene sus propias reglas. Construimos soluciones que
            entienden cómo trabaja tu negocio, no al revés.
          </p>
        </header>

        <ul className="industries__list" role="list">
          {items.map((it) => (
            <li className="industries__row" key={it.n}>
              <span className="industries__divider" aria-hidden="true" />
              <div className="industries__row-grid">
                <span className="industries__num label mono">— {it.n}</span>
                <h3 className="industries__title display display-md">
                  {it.title}
                </h3>
                <p className="industries__body body-md">{it.body}</p>
                <span className="industries__chev" aria-hidden="true">
                  →
                </span>
              </div>
            </li>
          ))}
          <li className="industries__row industries__row--end">
            <span className="industries__divider" aria-hidden="true" />
          </li>
        </ul>
      </div>
    </section>
  );
}
