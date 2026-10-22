const ATTRIBUTE_PATTERN = /data-(ui|panel|cue)\s*=\s*"([^"]+)"/g;
const KINDS = { ui: "control", panel: "panel", cue: "cue" };

export function inventoryEntries(sources) {
  const entries = new Set();
  for (const source of sources) {
    for (const match of String(source.text).matchAll(ATTRIBUTE_PATTERN)) {
      entries.add(`${KINDS[match[1]]}: ${match[2]}`);
    }
  }
  return [...entries].sort();
}
