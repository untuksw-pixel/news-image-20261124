// Entry program for make.fun news-image-20261124.
//
// The front page image lives in this repository as entry.png. This
// program simply copies it to the output directory the harness asks
// for, so both runs produce byte-identical output.
//
// Usage: node main.ts   (reads MAKEFUN_OUTPUT_DIR, defaults to /output)
import { copyFileSync, existsSync, mkdirSync, renameSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

if (!existsSync(source)) {
  console.error(`Missing source image: ${source}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
// Write via a temp file and rename so a partial copy can never
// be mistaken for the finished image.
const tmp = join(outDir, ".entry.png.tmp");
copyFileSync(source, tmp);
renameSync(tmp, target);
console.log(`Wrote ${target}`);
