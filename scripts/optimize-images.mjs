import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const TARGET_DIRS = ["public/illustrations", "public/Slide"];
const SOURCE_RE = /\.(png|jpe?g)$/i;

const FORMAT_CONFIG = [
  {
    ext: ".webp",
    label: "webp",
    transform: (img) => img.webp({ quality: 74, effort: 4 }),
  },
  {
    ext: ".avif",
    label: "avif",
    transform: (img) => img.avif({ quality: 52, effort: 4 }),
  },
];

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
      continue;
    }
    if (entry.isFile() && SOURCE_RE.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

async function ensureFresh(sourcePath, outputPath) {
  try {
    const [srcStat, outStat] = await Promise.all([fs.stat(sourcePath), fs.stat(outputPath)]);
    return srcStat.mtimeMs > outStat.mtimeMs;
  } catch {
    return true;
  }
}

async function convertOne(sourcePath, format) {
  const outputPath = sourcePath.replace(SOURCE_RE, format.ext);
  const needsWork = await ensureFresh(sourcePath, outputPath);
  if (!needsWork) return { changed: false, outputPath };

  const base = sharp(sourcePath, { failOn: "none" }).rotate();
  await format.transform(base).toFile(outputPath);
  return { changed: true, outputPath };
}

async function main() {
  const candidates = [];
  for (const relDir of TARGET_DIRS) {
    const absDir = path.join(ROOT, relDir);
    try {
      const stat = await fs.stat(absDir);
      if (stat.isDirectory()) {
        candidates.push(...(await walk(absDir)));
      }
    } catch {
      // ignore missing folders
    }
  }

  if (!candidates.length) {
    console.log("[optimize-images] No source images found in target folders.");
    return;
  }

  let converted = 0;
  let skipped = 0;

  for (const sourcePath of candidates) {
    for (const format of FORMAT_CONFIG) {
      try {
        const result = await convertOne(sourcePath, format);
        if (result.changed) converted += 1;
        else skipped += 1;
      } catch (error) {
        console.warn(`[optimize-images] Failed ${format.label}: ${sourcePath}`);
        console.warn(String(error?.message || error));
      }
    }
  }

  console.log(
    `[optimize-images] done | sources=${candidates.length} converted=${converted} skipped=${skipped}`,
  );
}

main().catch((error) => {
  console.error("[optimize-images] fatal", error);
  process.exitCode = 1;
});
