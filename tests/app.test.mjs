import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { inventoryEntries } from "../scripts/inventory-core.mjs";

const appSource = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
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
  ]);
});

test("the app declares every panel", () => {
  const panels = entries.filter((entry) => entry.startsWith("panel: "));

  assert.deepEqual(panels, ["panel: counter", "panel: filter", "panel: footer", "panel: theme", "panel: topbar"]);
});

