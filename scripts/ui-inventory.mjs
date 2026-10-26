import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { inventoryEntries } from "./inventory-core.mjs";

const SOURCE_EXTENSIONS = new Set([".jsx", ".tsx"]);
const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const sourceRoot = join(projectRoot, "src");

function sourceFiles(directory) {
  const found = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      found.push(...sourceFiles(path));
    } else if (SOURCE_EXTENSIONS.has(extname(entry.name))) {
      found.push(path);
    }
  }
  return found.sort();
}

const sources = sourceFiles(sourceRoot).map((path) => ({
  path,
  text: readFileSync(path, "utf8"),
}));
const entries = inventoryEntries(sources);

if (entries.length === 0) {
  console.error("ui:snapshot found no data-ui, data-panel or data-cue entries in src/.");
  process.exit(1);
}

console.log(entries.join("\n"));
