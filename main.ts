// Entry program for make.fun news-image-20261124 (v2).
//
// The front page image ships in this repository as entry.png.b64:
// the PNG's bytes base64-encoded in a single-line text file, because
// the snapshot push channel that carries this repository accepts
// UTF-8 text only. This program decodes it and writes the real
// entry.png to the output directory the harness asks for, so both
// runs produce byte-identical output.
//
// Usage: node main.ts   (reads MAKEFUN_OUTPUT_DIR, defaults to /output)
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "entry.png.b64");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

if (!existsSync(source)) {
  console.error(`Missing source image data: ${source}`);
  process.exit(1);
}

const png = Buffer.from(readFileSync(source, "utf8").trim(), "base64");
// Sanity check: refuse to ship anything that is not a PNG.
if (png.length < 8 || png.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
  console.error("Decoded data is not a PNG");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
// Write via a temp file and rename so a partial image can never
// be mistaken for the finished one.
const tmp = join(outDir, ".entry.png.tmp");
writeFileSync(tmp, png);
renameSync(tmp, target);
console.log(`Wrote ${target} (${statSync(target).size} bytes)`);
