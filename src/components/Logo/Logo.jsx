import { useId } from "react";

/* ----------------------------------------------------------
   Stratus Industries logo — octagon + bold "S".
   Uses an SVG mask to punch a thin channel through the S
   stroke, recreating the double-line stencil treatment of
   the original mark. Inherits color from `currentColor`.
---------------------------------------------------------- */

const S_PATH =
  "M73 33 Q73 25 58 25 L42 25 Q27 25 27 38 Q27 50 42 50 L58 50 Q73 50 73 63 Q73 75 58 75 L42 75 Q27 75 27 67";

export default function Logo({ size = 32, className = "" }) {
  const rawId = useId().replace(/:/g, "");
  const maskId = `stratus-mask-${rawId}`;

  return (
    <svg
      className={`logo-mark ${className}`}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label="Stratus Industries"
      focusable="false"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="white" />
          {/* Thin black stroke punches a "channel" through the thick S */}
          <path
            d={S_PATH}
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="butt"
          />
        </mask>
      </defs>

      {/* Octagon frame */}
      <polygon
        points="30,6 70,6 94,30 94,70 70,94 30,94 6,70 6,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="miter"
      />

      {/* Bold S, with channel mask */}
      <path
        d={S_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinejoin="miter"
        strokeLinecap="butt"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
