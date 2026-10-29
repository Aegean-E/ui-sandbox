import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { inventoryEntries } from "../scripts/inventory-core.mjs";

const appSource = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const entries = inventoryEntries([{ path: "src/App.jsx", text: appSource }]);

test("the app keeps every interactive control", () => {
  const controls = entries
    .filter((entry) => entry.startsWith("control: "))
    .map((entry) => entry.slice("control: ".length));

  assert.deepEqual(controls, [
    "app-root",
    "counter-decrement",
    "counter-increment",
    "counter-reset",
    "counter-value",
    "cue-empty",
    "cue-filter",
    "highlight-toggle",
    "status-results",
    "status-theme",
    "theme-toggle",
    "token-density",
    "token-preset-aurora",
    "token-preset-ember",
    "token-preset-forest",
    "token-preset-mono",
    "token-radius",
    "token-reset",
  ]);
});

test("the app declares every panel", () => {
  const panels = entries.filter((entry) => entry.startsWith("panel: "));

  assert.deepEqual(panels, ["panel: counter", "panel: filter", "panel: footer", "panel: theme", "panel: tokens", "panel: topbar"]);
});

test(".app binds color to --text so light theme overrides body dark-mode text", () => {
  const appBlock = stylesSource.match(/\.app\s*\{[^}]*\}/);
  assert.ok(appBlock, ".app rule must exist in src/styles.css");
  assert.match(appBlock[0], /color:\s*var\(--text\)\s*;/);
});

test("src/styles.css uses theme tokens with zero raw color literals", () => {
  assert.doesNotMatch(stylesSource, /#[0-9a-fA-F]{3,8}\b|\brgba?\(/);
});

test("interactive toggles and live counter carry accessibility attributes", () => {
  assert.match(appSource, /data-ui="theme-toggle"[\s\S]*?aria-pressed=\{theme === "light"\}/);
  assert.match(appSource, /data-ui="highlight-toggle"[\s\S]*?aria-pressed=\{highlight\}/);
  assert.match(appSource, /data-ui="counter-value"\s+aria-live="polite"/);
});

test("the token panel exposes presets, radius, density and reset", () => {
  for (const id of [
    "token-preset-aurora",
    "token-preset-ember",
    "token-preset-forest",
    "token-preset-mono",
    "token-radius",
    "token-density",
    "token-reset",
  ]) {
    assert.ok(appSource.includes(`data-ui="${id}"`), `${id} must stay in the app`);
  }
  assert.ok(appSource.includes('data-panel="tokens"'), "the tokens panel must stay declared");
});

