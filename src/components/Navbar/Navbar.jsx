import { useEffect, useRef, useState } from "react";
import Logo from "../Logo/Logo";
import "./Navbar.css";

export default function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className={`navbar ${scrolled ? "is-scrolled" : ""}`}
      data-scrolled={scrolled}
    >
      <div className="navbar__inner">
        <a href="#top" className="navbar__brand" aria-label="Stratus Industries">
          <span className="navbar__logo" aria-hidden="true">
            <Logo size={30} />
          </span>
          <span className="navbar__brand-text">STRATUS INDUSTRIES</span>
        </a>

        <div className="navbar__pill" role="status" aria-label="Sistemas · Web · Agentes IA — establecido en 2025">
          <span className="navbar__pill-dot" />
          <span className="navbar__pill-text">
            · SISTEMAS · WEB · AGENTES IA&nbsp;|&nbsp;EST.&nbsp;2025
          </span>
        </div>

        <nav className="navbar__links" aria-label="Navegación principal">
          <a href="#servicios" className="navbar__link">
            Servicios
          </a>
          <a
            href="https://wa.me/5492236720416"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__link navbar__link--cta"
          >
            Contacto
          </a>
        </nav>
      </div>
    </header>
  );
}
