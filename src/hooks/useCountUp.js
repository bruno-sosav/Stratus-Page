/* ----------------------------------------------------------
   useCountUp
   IntersectionObserver-driven counter. Animates from 0 to
   `target` using requestAnimationFrame and an easeOutCubic.
---------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export function useCountUp(target, { duration = 2000, decimals = 0 } = {}) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const startTime = performance.now();
            const tick = (now) => {
              const elapsed = now - startTime;
              const t = Math.min(elapsed / duration, 1);
              const eased = easeOutCubic(t);
              const next = target * eased;
              setValue(decimals ? Number(next.toFixed(decimals)) : Math.round(next));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration, decimals]);

  return [ref, value];
}

export default useCountUp;
