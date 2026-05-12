import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  siSpotify,
  siFerrari,
  siBmw,
  siNasa,
  siNetflix,
  siAirbnb,
  siPlaystation,
  siNike,
} from "simple-icons";
import "./Clients.css";

// Logos with dark/black colors get a light override so they're visible on dark bg
const COLOR_OVERRIDES = { Nike: "#d8d8d8" };

function BrandIcon({ icon, title }) {
  const color = COLOR_OVERRIDES[title] || `#${icon.hex}`;
  return (
    <svg
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-label={title}
    >
      <path d={icon.path} />
    </svg>
  );
}


function ImgMark({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="clients__img"
      onError={(e) => { e.target.style.display = "none"; }}
    />
  );
}

const LOGOS = [
  { name: "River Plate",  mark: <ImgMark src="/logos/river.webp"        alt="River Plate" /> },
  { name: "Mustang",     mark: <ImgMark src="/logos/mustang.webp"       alt="Mustang" /> },
  { name: "Spotify",     mark: <BrandIcon icon={siSpotify}     title="Spotify" /> },
  { name: "Ferrari",     mark: <BrandIcon icon={siFerrari}     title="Ferrari" /> },
  { name: "BMW",         mark: <BrandIcon icon={siBmw}         title="BMW" /> },
  { name: "NASA",        mark: <BrandIcon icon={siNasa}        title="NASA" /> },
  { name: "Netflix",     mark: <BrandIcon icon={siNetflix}     title="Netflix" /> },
  { name: "PlayStation", mark: <BrandIcon icon={siPlaystation} title="PlayStation" /> },
  { name: "Nike",        mark: <BrandIcon icon={siNike}        title="Nike" /> },
];

export default function Clients() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".clients__header > *",
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".clients__header", start: "top 85%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="clients" ref={sectionRef}>
      <div className="container clients__header">
        <span className="eyebrow">Clientes</span>
        <p className="clients__subtitle">Empresas que confiaron en Stratus Industries</p>
      </div>

      <div className="clients__marquee" aria-label="Clientes">
        <div className="clients__track">
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <div className="clients__item" key={i} aria-label={logo.name}>
              <div className="clients__mark">{logo.mark}</div>
              <span className="clients__name">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
