# Stratus Industries — Landing Page

Landing page de **Stratus Industries** — empresa de software empresarial y SaaS, fundada en 2025. Construida con React + Vite, animaciones con GSAP + ScrollTrigger y smooth scroll con Lenis. Sin librerías de UI (todo CSS propio).

---

## Stack

- **React 19** + **Vite** (template `react`).
- **GSAP** + **@gsap/react** + **ScrollTrigger** — animaciones de scroll, timelines, ticker compartido.
- **Lenis** — smooth scroll, integrado con el `gsap.ticker`.
- **react-intersection-observer** — disponible para hooks de visibilidad puntuales.
- Tipografías de Google Fonts: **Cormorant Garamond** (display, italics) y **DM Sans** (UI / body).

---

## Instalación

```bash
# 1. Posicionarse en la carpeta
cd stratus-landing

# 2. Instalar dependencias
npm install

# 3. Servir en desarrollo (http://localhost:5173)
npm run dev

# 4. Build de producción
npm run build
npm run preview
```

> Requiere Node 18+.

---

## Estructura de carpetas

```
src/
├── components/
│   ├── Navbar/        Header sticky con frosted glass al hacer scroll
│   ├── Hero/          Headline animado + orbe atmosférico CSS
│   ├── Philosophy/    Cuatro principios + visuales (orbit/grid/bars/pulse)
│   ├── Services/      Grid 2x2 de servicios con hover glow
│   ├── Stats/         Contadores animados con IntersectionObserver
│   ├── Industries/    Lista de sectores con líneas que se "dibujan"
│   ├── Team/          Avatares con iniciales en degradado
│   ├── Testimonial/   Cita revelada palabra por palabra
│   ├── FAQ/           Acordeón con altura animada por GSAP
│   ├── CTA/           Cierre con orbe pulsante de fondo
│   └── Footer/        4 columnas + legales
│
├── hooks/
│   ├── useScrollAnimation.js   Wrapper para correr una animación al entrar al viewport
│   └── useCountUp.js           Counter con IntersectionObserver + easeOutCubic
│
├── utils/
│   └── animations.js   Recetas reutilizables: fadeInUp, staggerReveal,
│                       lineDrawIn, splitWords, textRevealByWords,
│                       counterAnimation. Registra ScrollTrigger.
│
├── styles/
│   ├── globals.css     Variables CSS, reset, scrollbar, ruido, cursor, botones
│   └── typography.css  Imports de Google Fonts + clases de tipografía
│
├── App.jsx             Composición de secciones + cursor personalizado
└── main.jsx            Bootstrap: Lenis + GSAP ticker + render React
```

Cada componente tiene su propio `*.css` colocalizado. La lógica de animación vive en `utils/animations.js` o en hooks; los componentes solo importan recetas.

---

## Sistema de diseño

| Token                       | Valor                        | Uso                                     |
| --------------------------- | ---------------------------- | --------------------------------------- |
| `--color-bg`                | `#0a0a0f`                    | Fondo global (negro azulado)            |
| `--color-surface`           | `#111118`                    | Cards, secciones secundarias            |
| `--color-surface-alt`       | `#16161f`                    | Variante hover                          |
| `--color-text-primary`      | `#f0ede8`                    | Crema cálida, no blanco puro            |
| `--color-text-secondary`    | `#8a8a9a`                    | Body, labels secundarias                |
| `--color-accent`            | `#7b8cde`                    | Italics, énfasis, focus                 |
| `--color-accent-warm`       | `#c9a96e`                    | Highlights dorados sutiles              |
| `--color-gradient`          | `linear-gradient(135deg, …)` | Avatares, logos, glow                   |

Tipografía:
- Títulos grandes: **Cormorant Garamond** 300/400/500, `clamp(40px, 6vw, 80px)`.
- Italics de énfasis: misma fuente con `font-style: italic` y `color: var(--color-accent)`.
- Body / UI: **DM Sans** 300/400/500.
- Labels: DM Sans 11px uppercase con `letter-spacing: 0.18em`.

---

## Recetas de animación

`src/utils/animations.js` expone las primitivas usadas en toda la página:

- `fadeInUp(el)` — translateY 40 → 0, opacity 0 → 1, `power3.out`, 0.9s.
- `staggerReveal(els, { stagger })` — versión en cascada de la anterior.
- `lineDrawIn(el)` — `scaleX 0 → 1` con `transform-origin: left`.
- `splitWords(el)` — divide el texto en `<span data-word>` reutilizables.
- `textRevealByWords(el)` — splits + slide vertical palabra a palabra.
- `counterAnimation(el, target)` — RAF + easing para contadores.

Defaults de ScrollTrigger: `start: "top 80%"`, `toggleActions: "play none none none"` (la animación dispara una vez y no se reinicia).

Lenis se inicializa una sola vez en `main.jsx` y se sincroniza con `gsap.ticker`, de modo que cualquier `ScrollTrigger` lee la posición scrolleada por Lenis sin saltos.

---

## Notas de implementación

- **Orbe del Hero:** implementado con CSS puro (radial-gradients apilados + 3 anillos rotando). Sin Three.js para mantener bundle ligero.
- **Cursor personalizado:** punto de 8px que sigue al mouse con `gsap.quickTo` y crece sobre elementos interactivos. Se desactiva en pointer coarse (touch).
- **Noise overlay:** SVG inline en `body::before` con `mix-blend-mode: overlay` y `opacity: 0.035`.
- **Contenido en español** en toda la UI.
- **Sin librerías de UI** — solo CSS propio + GSAP + Lenis.

---

## Cómo agregar una nueva sección

1. Crear `src/components/MiSeccion/MiSeccion.jsx` y `MiSeccion.css`.
2. Importar utilidades de `utils/animations.js` o usar `useScrollAnimation`.
3. Agregar `<MiSeccion />` en `src/App.jsx` en la posición deseada.
4. Reutilizar las clases globales: `.section`, `.container`, `.eyebrow`, `.display`, `.body-lg`, `.btn`.

---

© 2026 Stratus Industries (proyecto demo).
