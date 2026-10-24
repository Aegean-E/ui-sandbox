import { useMemo, useState } from "react";

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
    detail: "Transitions stay short and respect reduced motion next.",
  },
];

const PANELS = [
  { id: "counter", label: "Counter", detail: "Stateful controls with labelled actions." },
  { id: "filter", label: "Search", detail: "Controlled input with live filtering." },
  { id: "theme", label: "Theme", detail: "Token-driven light and dark palettes." },
];

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(false);

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
          <p className="counter" data-ui="counter-value">
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
