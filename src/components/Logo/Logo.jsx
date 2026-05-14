export default function Logo({ size = 32, className = "" }) {
  return (
    <img
      src="/logos/stratus-icon.png"
      alt=""
      width={size}
      height={size}
      className={`logo-mark ${className}`}
      style={{ mixBlendMode: "screen", display: "block", objectFit: "contain" }}
      draggable={false}
    />
  );
}
