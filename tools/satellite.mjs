// Crops the website's sample-property satellite photo out of FieldBook's basemap image
// at build time (Vercel runs this before build.mjs). The crop matches VIEW in maps.mjs;
// the basemap's satellite image shares the basemap's pixel grid, so coordinates are 1:1.
// If the download or crop fails, the build carries on and the maps fall back to the
// plain map style.
import { writeFileSync } from "node:fs";

const SRC = "https://jweaintosivhiskjjmua.supabase.co/storage/v1/object/public/basemaps/corsica-talis-park/v3-sat.jpg";
const VIEW = { x: 1500, y: 1420, w: 800, h: 280 };
const OUT = new URL("../static/img/sample-sat.webp", import.meta.url);

try {
  const { default: sharp } = await import("sharp");
  const res = await fetch(SRC);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const out = await sharp(buf)
    .extract({ left: VIEW.x, top: VIEW.y, width: VIEW.w, height: VIEW.h })
    .resize(VIEW.w * 2, VIEW.h * 2, { kernel: "lanczos3" })
    .webp({ quality: 82 })
    .toBuffer();
  writeFileSync(OUT, out);
  console.log(`satellite: wrote ${out.length} bytes`);
} catch (err) {
  console.warn(`satellite: skipped (${err.message})`);
}
