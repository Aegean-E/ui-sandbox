import { useEffect, useMemo, useRef, useState } from "react";

const CUES = [
  {
    id: "focus",
    label: "Focus ring",
    detail: "Every control keeps a visible keyboard focus ring.",
  },
  {
    id: "contrast",
    label: "Contrast",
    detail: "Text and controls use theme tokens, never raw colors.",
  },
  {
    id: "spacing",
    label: "Spacing",
    detail: "Cards share one radius, gap and padding scale.",
  },
  {
    id: "motion",
    label: "Motion",
    detail: "Transitions stay short and respect reduced-motion preferences.",
  },
];

const PANELS = [
  { id: "counter", label: "Counter", detail: "Stateful controls with labelled actions." },
  { id: "filter", label: "Search", detail: "Controlled input with live filtering." },
  { id: "theme", label: "Theme", detail: "Token-driven light and dark palettes." },
];

const THEME_STORAGE_KEY = "ui-sandbox-theme";
const CONTRAST_TARGET = 4.5;
const CONTRAST_PAIRS = [
  { label: "Body text", foreground: "--text", backgrounds: ["--bg"] },
  { label: "Muted text", foreground: "--text-muted", backgrounds: ["--bg-soft"] },
  {
    label: "Primary button",
    foreground: "--accent-contrast",
    backgrounds: ["--accent", "--accent-strong"],
  },
];

function readStoredTheme() {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function preferredTheme() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "dark";
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function parseColor(value) {
  const text = value.trim();
  const hex = text.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const expanded =
      hex[1].length === 3
        ? hex[1].split("").map((part) => part + part).join("")
        : hex[1];
    return [0, 2, 4].map((offset) => parseInt(expanded.slice(offset, offset + 2), 16) / 255);
  }
  const rgb = text.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const parts = rgb[1].split(",").map((part) => Number.parseFloat(part));
    if (parts.length >= 3 && parts.slice(0, 3).every(Number.isFinite)) {
      return parts.slice(0, 3).map((part) => part / 255);
    }
  }
  return null;
}

function luminance(rgb) {
  const [r, g, b] = rgb.map((part) =>
    part <= 0.03928 ? part / 12.92 : ((part + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground, background) {
  const fg = parseColor(foreground);
  const bg = parseColor(background);
  if (!fg || !bg) {
    return null;
  }
  const lighter = Math.max(luminance(fg), luminance(bg));
  const darker = Math.min(luminance(fg), luminance(bg));
  return (lighter + 0.05) / (darker + 0.05);
}

export default function App() {
  const appRef = useRef(null);
  const [theme, setTheme] = useState(() => readStoredTheme() ?? preferredTheme());
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(false);
  const [contrast, setContrast] = useState([]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage can be unavailable; the in-memory theme still works.
    }
  }, [theme]);

  useEffect(() => {
    const node = appRef.current;
    if (!node) {
      return;
    }
    const styles = getComputedStyle(node);
    const read = (name) => styles.getPropertyValue(name);
    setContrast(
      CONTRAST_PAIRS.map((pair) => {
        const ratio = pair.backgrounds.reduce((lowest, background) => {
          const value = contrastRatio(read(pair.foreground), read(background));
          if (value === null) {
            return lowest;
          }
          return lowest === null ? value : Math.min(lowest, value);
        }, null);
        return {
          ...pair,
          ratio,
          pass: ratio !== null && ratio >= CONTRAST_TARGET,
        };
      }),
    );
  }, [theme]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return CUES;
    }
    return CUES.filter((cue) =>
      `${cue.label} ${cue.detail}`.toLowerCase().includes(needle),
    );
  }, [query]);

  return (
    <div
      ref={appRef}
      className={`app theme-${theme}${highlight ? " outline" : ""}`}
      data-ui="app-root"
    >
      <header className="topbar" data-panel="topbar">
        <div className="identity">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            AIKit bounded UI surface
          </p>
          <h1>UI Sandbox</h1>
          <p className="subtitle">
            A small React surface for exercising visual changes under the UI
            guard. Edit src/ only, then run the fast and snapshot proofs.
          </p>
          <div className="chips">
            <span className="chip">
              <span className="chip-dot" aria-hidden="true" />
              Live preview
            </span>
            <span className="chip">React + Vite</span>
            <span className="chip">Token theme</span>
          </div>
        </div>
        <button
          className="button button-ghost"
          data-ui="theme-toggle"
          aria-pressed={theme === "light"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          type="button"
        >
          {theme === "dark" ? "Light theme" : "Dark theme"}
        </button>
      </header>

      <main className="grid">
        <section
          className={`card${highlight ? " is-highlighted" : ""}`}
          data-panel="counter"
        >
          <h2>Counter</h2>
          <p className="hint">Increment, decrement, or reset the shared tally.</p>
          <p className="counter" data-ui="counter-value" aria-live="polite">
            {count}
          </p>
          <div className="row">
            <button
              className="button button-ghost"
              data-ui="counter-decrement"
              onClick={() => setCount(count - 1)}
              type="button"
            >
              Decrease
            </button>
            <button
              className="button"
              data-ui="counter-increment"
              onClick={() => setCount(count + 1)}
              type="button"
            >
              Increase
            </button>
            <button
              className="button button-ghost"
              data-ui="counter-reset"
              onClick={() => setCount(0)}
              type="button"
            >
              Reset
            </button>
          </div>
        </section>

        <section className="card" data-panel="filter">
          <h2>Search cues</h2>
          <label className="label" htmlFor="cue-filter">
            Filter
          </label>
          <input
            className="input"
            data-ui="cue-filter"
            id="cue-filter"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Focus, contrast, spacing..."
            type="search"
            value={query}
          />
          <ul className="cue-list">
            {results.map((cue) => (
              <li className="cue" key={cue.id}>
                <span className="cue-label">{cue.label}</span>
                <span className="cue-detail">{cue.detail}</span>
              </li>
            ))}
          </ul>
          {results.length === 0 ? (
            <p className="empty" data-ui="cue-empty">
              No cue matches "{query}".
            </p>
          ) : null}
        </section>

        <section className="card" data-panel="theme">
          <h2>Panels</h2>
          <p className="hint">Each panel is one bounded part of this surface.</p>
          <ul className="panel-list">
            {PANELS.map((panel) => (
              <li key={panel.id}>
                <strong>{panel.label}</strong>
                <span>{panel.detail}</span>
              </li>
            ))}
          </ul>
          <div className="contrast" aria-live="polite">
            <p className="contrast-title">Contrast proof</p>
            {contrast.length === 0 ? (
              <p className="contrast-empty">Checking theme tokens...</p>
            ) : (
              contrast.map((entry) => (
                <p
                  className={`contrast-row${entry.pass ? "" : " is-failing"}`}
                  key={entry.label}
                >
                  <span>{entry.label}</span>
                  <span>{entry.ratio === null ? "unknown" : `${entry.ratio.toFixed(1)}:1`}</span>
                  <span>{entry.pass ? "AA" : "below AA"}</span>
                </p>
              ))
            )}
          </div>
          <button
            className="button button-ghost"
            data-ui="highlight-toggle"
            aria-pressed={highlight}
            onClick={() => setHighlight(!highlight)}
            type="button"
          >
            {highlight ? "Hide outlines" : "Show outlines"}
          </button>
        </section>
      </main>

      <footer className="footer" data-panel="footer">
        <span data-ui="status-theme">Theme: {theme}</span>
        <span data-ui="status-results">{results.length} cue(s)</span>
      </footer>
    </div>
  );
}
