import assert from "node:assert/strict";
import test from "node:test";
import { inventoryEntries } from "../scripts/inventory-core.mjs";

test("inventory entries label each attribute kind", () => {
  const entries = inventoryEntries([
    {
      path: "src/App.jsx",
      text: '<div data-ui="app-root"><section data-panel="counter"></section><li data-cue="focus" />',
    },
  ]);

  assert.deepEqual(entries, ["control: app-root", "cue: focus", "panel: counter"]);
});

test("inventory entries deduplicate and sort", () => {
  const entries = inventoryEntries([
    { path: "a.jsx", text: '<button data-ui="z" /><button data-ui="a" />' },
    { path: "b.jsx", text: '<button data-ui="a" />' },
  ]);

  assert.deepEqual(entries, ["control: a", "control: z"]);
});

test("inventory entries ignore unrelated attributes", () => {
  const entries = inventoryEntries([
    { path: "a.jsx", text: '<div id="root" data-testid="root" data-ui={dynamic} />' },
  ]);

  assert.deepEqual(entries, []);
});
