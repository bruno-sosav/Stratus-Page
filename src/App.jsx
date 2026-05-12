import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Product from "./components/Product/Product";
import Team from "./components/Team/Team";
import Process from "./components/Process/Process";
import FAQ from "./components/FAQ/FAQ";
import CTA from "./components/CTA/CTA";
import Footer from "./components/Footer/Footer";

export default function App() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const dot = cursorRef.current;
    if (!dot) return undefined;
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;

    const xTo = gsap.quickTo(dot, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e) => {
      dot.classList.add("is-visible");
      xTo(e.clientX);
      yTo(e.clientY);
      const t = e.target;
      if (t && t.closest && t.closest("a, button, .services__card, .team__card")) {
        dot.classList.add("is-hover");
      } else {
        dot.classList.remove("is-hover");
      }
    };

    const onLeave = () => dot.classList.remove("is-visible");

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <span className="cursor-dot" ref={cursorRef} aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Product />
        <Team />
        <Process />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
