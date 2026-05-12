import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Services.css";

const services = [
  {
    n: "01",
    tag: "Gestión",
    title: "Sistemas de gestión",
    body: "Para peluquerías y estéticas: turnos online, historial de clientes, control de caja y reportes en un solo lugar. Sin papeles, sin el caos de los WhatsApps. Más rubros en desarrollo.",
    detail: "Ideal para: peluquerías, centros de estética, salones de uñas",
  },
  {
    n: "02",
    tag: "Web",
    title: "Páginas web",
    body: "Para restaurantes, profesionales y cualquier negocio que quiera estar en internet. Diseñamos y desarrollamos sitios con reservas, menú digital o cartera de servicios — y carrito con pedidos directo a WhatsApp.",
    detail: "Ideal para: gastronomía, médicos, abogados, contadores, consultores",
  },
  {
    n: "03",
    tag: "IA",
    title: "Agentes IA",
    body: "Un asistente que atiende a tus clientes por WhatsApp o en tu web, todos los días a cualquier hora. Responde preguntas, agenda citas y filtra consultas sin que tengas que estar presente.",
    detail: "Ideal para: cualquier negocio que reciba muchos mensajes",
  },
  {
    n: "04",
    tag: "Custom",
    title: "Software a medida",
    body: "¿Tenés una idea o una necesidad que no entra en ninguna de estas? Hablamos, entendemos tu operación y construimos exactamente lo que necesitás. Sin moldes, sin soluciones genéricas.",
    detail: "Para cualquier rubro o proceso específico",
  },
];

export default function Services() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".services__heading > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".services__heading", start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".services__card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".services__grid", start: "top 80%" },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section services" id="servicios" ref={sectionRef}>
      <div className="container">
        <header className="services__heading">
          <span className="eyebrow">SERVICIOS</span>
          <h2 className="display display-lg">
            Lo que hacemos,{" "}
            <span className="italic-accent">sin vueltas</span>.
          </h2>
          <p className="body-lg">
            Cuatro servicios concretos para negocios reales. Sin términos
            técnicos, sin promesas que no podemos cumplir.
          </p>
        </header>

        <div className="services__grid">
          {services.map((s) => (
            <article className="services__card" key={s.n}>
              <header className="services__card-head">
                <span className="services__card-num label mono">
                  {s.n}/04
                </span>
                <span className="services__card-tag label">{s.tag}</span>
              </header>
              <h3 className="services__card-title display display-md">
                {s.title}
              </h3>
              <p className="services__card-body body-md">{s.body}</p>
              <p className="services__card-detail">{s.detail}</p>
              <span className="services__card-glow" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
