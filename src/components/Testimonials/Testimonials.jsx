import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Testimonials.css";

const testimonials = [
  {
    quote:
      "Con el sistema de Stratus dejé de usar la libreta de papel. Mis clientas reservan solas y yo me entero al momento. No sé cómo trabajaba antes sin esto.",
    name: "María González",
    role: "Peluquería Valentina",
    city: "Buenos Aires",
  },
  {
    quote:
      "La página que nos armaron tiene carrito directo a WhatsApp. Los pedidos empezaron a llegar desde el primer día sin que nosotros tuviéramos que hacer nada.",
    name: "Tomás Ricci",
    role: "Pizzería La Esperanza",
    city: "Córdoba",
  },
  {
    quote:
      "El agente responde mientras yo estoy con un paciente. Me ahorra horas de mensajes al día y nunca se equivoca con los horarios disponibles.",
    name: "Carolina Méndez",
    role: "Consultora de imagen",
    city: "Madrid",
  },
];

export default function Testimonials() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonials__heading > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".testimonials__heading", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".testimonials__card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.14,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".testimonials__grid", start: "top 80%" },
        }
      );
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section testimonials" id="testimonios" ref={sectionRef}>
      <div className="container">
        <header className="testimonials__heading">
          <span className="eyebrow">RESULTADOS</span>
          <h2 className="display display-lg">
            Lo que dicen{" "}
            <span className="italic-accent">nuestros clientes</span>.
          </h2>
        </header>

        <div className="testimonials__grid">
          {testimonials.map((t) => (
            <article className="testimonials__card" key={t.name}>
              <span className="testimonials__quote-mark" aria-hidden="true">"</span>
              <p className="testimonials__text body-md">"{t.quote}"</p>
              <footer className="testimonials__footer">
                <span className="testimonials__name">{t.name}</span>
                <span className="testimonials__role">
                  {t.role} · {t.city}
                </span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
