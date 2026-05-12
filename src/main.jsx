import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./styles/typography.css";
import "./styles/globals.css";

import App from "./App.jsx";

gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------------
// Lenis smooth scroll, synced with GSAP's ticker so that
// ScrollTrigger and Lenis share the same frame loop.
// ----------------------------------------------------------
const lenis = new Lenis({
  duration: 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
