import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./FAQ.css";

const faqs = [
  {
    q: "¿Cuánto cuesta?",
    a: "Depende del servicio y el alcance. No tenemos precios fijos publicados porque cada negocio es distinto — una peluquería chica no necesita lo mismo que una cadena. Lo que sí te podemos decir: respondemos rápido, damos un presupuesto claro y no hay costos ocultos ni letra chica.",
  },
  {
    q: "¿El sistema de gestión funciona para mi negocio?",
    a: "Hoy está listo para peluquerías y centros de estética — turnos online, historial de clientes, control de caja y reportes en un solo lugar. Estamos desarrollando versiones para otros rubros. Si tu negocio es distinto, igual escribinos: lo evaluamos y te decimos con honestidad si podemos ayudarte.",
  },
  {
    q: "¿Qué incluye una página web?",
    a: "Personalizamos todo: fotos, colores, servicios, datos del negocio. Las páginas para gastronomía incluyen carrito con pedidos directo a tu WhatsApp. Las de profesionales incluyen agenda de consultas. Sin intermediarios, sin comisiones por pedido.",
  },
  {
    q: "¿Qué es un agente IA y si realmente sirve?",
    a: "Es un asistente que atiende a tus clientes por WhatsApp o en tu web, todos los días a cualquier hora. Responde preguntas frecuentes, agenda turnos y filtra consultas sin que vos tengas que estar presente. Funciona mejor para negocios que reciben muchos mensajes repetitivos.",
  },
  {
    q: "¿Cuánto tarda en estar listo?",
    a: "Una página web estándar entre dos y tres semanas. Un sistema de gestión o agente IA varía según el alcance, pero siempre acordamos un plazo concreto antes de arrancar. Nada de timelines abiertos.",
  },
  {
    q: "¿Cómo empezamos?",
    a: "Escribinos por WhatsApp o por mail, nos contás qué necesitás y armamos una propuesta. Sin reuniones eternas ni presupuestos que tardan semanas. Respondemos rápido y vamos al punto.",
  },
];

function FAQItem({ q, a, isOpen, onToggle, index }) {
  const contentRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    const line = lineRef.current;
    if (!content) return;

    if (isOpen) {
      const targetHeight = content.scrollHeight;
      gsap.to(content, {
        height: targetHeight,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      });
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.6,
            ease: "power3.inOut",
            transformOrigin: "left center",
          }
        );
      }
    } else {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div className={`faq__item ${isOpen ? "is-open" : ""}`}>
      <button
        className="faq__trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-${index}`}
      >
        <span className="faq__num label mono">— 0{index + 1}</span>
        <span className="faq__question display display-md">{q}</span>
        <span className="faq__icon" aria-hidden="true">
          <span className="faq__icon-bar" />
          <span className="faq__icon-bar faq__icon-bar--v" />
        </span>
      </button>

      <div className="faq__panel" id={`faq-${index}`} ref={contentRef}>
        <span className="faq__inner-line" ref={lineRef} aria-hidden="true" />
        <p className="faq__answer body-md">{a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq__heading > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".faq__heading", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".faq__item",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.07,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".faq__list", start: "top 80%" },
        }
      );
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section faq" ref={sectionRef}>
      <div className="container faq__container">
        <header className="faq__heading">
          <span className="eyebrow">FAQ</span>
          <h2 className="display display-lg">
            Preguntas <span className="italic-accent">frecuentes</span>.
          </h2>
          <p className="body-lg">
            ¿Tenés otra duda? Escribinos por WhatsApp — respondemos el mismo
            día.
          </p>
        </header>

        <div className="faq__list">
          {faqs.map((item, i) => (
            <FAQItem
              key={item.q}
              {...item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
