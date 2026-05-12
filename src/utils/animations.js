/* ----------------------------------------------------------
   utils/animations.js
   Reusable GSAP recipes. Components import from here so the
   animation language stays consistent across the page.
---------------------------------------------------------- */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ScrollTrigger defaults — tweaked once.
ScrollTrigger.defaults({
  start: "top 80%",
  toggleActions: "play none none none",
});

/**
 * fadeInUp — subtle vertical reveal.
 * @param {Element|string} el
 * @param {object} opts { delay, scrollTrigger }
 */
export function fadeInUp(el, opts = {}) {
  const { delay = 0, scrollTrigger = el, duration = 0.9 } = opts;
  return gsap.fromTo(
    el,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger:
        scrollTrigger === false
          ? undefined
          : {
              trigger: scrollTrigger,
              start: "top 85%",
            },
    }
  );
}

/**
 * staggerReveal — same as fadeInUp but for an array/NodeList.
 */
export function staggerReveal(els, opts = {}) {
  const { stagger = 0.1, scrollTrigger = els[0]?.parentNode, delay = 0 } = opts;
  return gsap.fromTo(
    els,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      delay,
      stagger,
      ease: "power3.out",
      scrollTrigger: scrollTrigger
        ? { trigger: scrollTrigger, start: "top 85%" }
        : undefined,
    }
  );
}

/**
 * lineDrawIn — horizontal line that "draws" from left.
 */
export function lineDrawIn(el, opts = {}) {
  const { trigger = el, delay = 0, duration = 1.1 } = opts;
  return gsap.fromTo(
    el,
    { scaleX: 0 },
    {
      scaleX: 1,
      transformOrigin: "left center",
      duration,
      delay,
      ease: "power3.inOut",
      scrollTrigger: { trigger, start: "top 85%" },
    }
  );
}

/**
 * Splits text into word spans (idempotent).
 * Returns the spans for further manipulation.
 */
export function splitWords(el) {
  if (!el) return [];
  if (el.dataset.splitDone === "true") {
    return Array.from(el.querySelectorAll("span[data-word]"));
  }
  const text = el.textContent.trim();
  el.textContent = "";
  const fragment = document.createDocumentFragment();
  const words = text.split(/\s+/);
  const spans = words.map((word, i) => {
    const wrap = document.createElement("span");
    wrap.dataset.word = "true";
    wrap.style.display = "inline-block";
    wrap.style.overflow = "hidden";
    wrap.style.verticalAlign = "top";
    const inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.textContent = word;
    wrap.appendChild(inner);
    fragment.appendChild(wrap);
    if (i < words.length - 1) {
      fragment.appendChild(document.createTextNode(" "));
    }
    return inner;
  });
  el.appendChild(fragment);
  el.dataset.splitDone = "true";
  return spans;
}

/**
 * textRevealByWords — splits and animates each word from below.
 */
export function textRevealByWords(el, opts = {}) {
  const { stagger = 0.05, delay = 0 } = opts;
  const words = splitWords(el);
  return gsap.fromTo(
    words,
    { y: "100%", opacity: 0 },
    {
      y: "0%",
      opacity: 1,
      duration: 0.9,
      delay,
      stagger,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    }
  );
}

/**
 * counterAnimation — counts a number element from 0 → target with easing.
 * Renders integers; pass `decimals` for floats (e.g. 99.9).
 */
export function counterAnimation(el, target, opts = {}) {
  const { duration = 2, decimals = 0, suffix = "" } = opts;
  const obj = { val: 0 };
  return gsap.to(obj, {
    val: target,
    duration,
    ease: "power2.out",
    onUpdate() {
      const n = decimals ? obj.val.toFixed(decimals) : Math.round(obj.val);
      el.textContent = `${n}${suffix}`;
    },
    scrollTrigger: { trigger: el, start: "top 85%" },
  });
}
