import useCountUp from "../../hooks/useCountUp";
import "./Stats.css";

function Stat({ target, decimals = 0, suffix = "+", label }) {
  const [ref, value] = useCountUp(target, { duration: 2200, decimals });
  const display = decimals
    ? Number(value).toFixed(decimals)
    : Math.round(value);
  return (
    <div className="stats__item" ref={ref}>
      <span className="stats__value display display-lg mono">
        {display}
        <span className="stats__suffix">{suffix}</span>
      </span>
      <span className="stats__label label">{label}</span>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="section stats">
      <div className="container">
        <div className="stats__grid">
          <Stat target={1} label="Año de operación" />
          <Stat target={4} label="Clientes activos" />
          <Stat target={6} label="Proyectos entregados" />
          <Stat target={99.9} decimals={1} suffix="%" label="Uptime garantizado" />
        </div>
      </div>
    </section>
  );
}
