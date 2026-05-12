/* ----------------------------------------------------------
   useScrollAnimation
   Lightweight wrapper that runs a GSAP animation factory once,
   when the target element enters the viewport.

   Usage:
     const ref = useRef(null);
     useScrollAnimation(ref, (el) => fadeInUp(el));
---------------------------------------------------------- */

import { useEffect } from "react";

export function useScrollAnimation(ref, factory, deps = []) {
  useEffect(() => {
    const el = ref?.current;
    if (!el || typeof factory !== "function") return undefined;

    // factory may return a tween/timeline (with .kill()) or a cleanup fn.
    const result = factory(el);

    return () => {
      if (!result) return;
      if (typeof result === "function") {
        result();
      } else if (typeof result.kill === "function") {
        result.kill();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useScrollAnimation;
