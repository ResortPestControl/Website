// The illustrated property maps (barrier, rodent and termite) and the Lee + Collier
// service-area map. The property maps use FieldBook's own sample property, "Naples
// Shores": its traced building outlines and wall-snapped rodent stations
// (demo-geometry.json, from station-app's src/fixtures/demo.geometry.ts), drawn over the
// same satellite photo at the same 900 x 700 canvas, styled like FieldBook's maps.
import { readFileSync } from "node:fs";

const GEO = JSON.parse(readFileSync(new URL("./demo-geometry.json", import.meta.url), "utf8"));
const W = GEO.W;
const H = GEO.H;

/** "M x yL x y...Z" -> [[x, y], ...] */
const polyOf = (d) => d.replace(/[MZ]/g, "").split("L").map((p) => p.trim().split(/\s+/).map(Number));
const BUILDINGS = GEO.buildings.map((b) => ({ ...b, poly: polyOf(b.d) }));

function inside([x, y], poly) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

function buildingLabels() {
  return BUILDINGS.map(
    ({ c: [cx, cy], label }) =>
      `<g><rect x="${cx - 19}" y="${cy - 10}" width="38" height="20" rx="10" fill="rgba(255,253,248,.92)"/><text x="${cx}" y="${cy + 4.5}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#1d1c18">${label}</text></g>`,
  ).join("");
}

const outlines = () => BUILDINGS.map((b) => `<path d="${b.d}" fill="rgba(231,232,235,.16)" stroke="rgba(255,255,255,.95)" stroke-width="1.8" stroke-linejoin="round"/>`).join("");

function figure({ id, title, description, svg, legend, alt }, compact = false) {
  const map = `<div class="mapfig">
<img src="/img/property-1350.webp" srcset="/img/property-800.webp 800w, /img/property-1350.webp 1350w" sizes="(max-width: 860px) 100vw, 640px" width="1350" height="1050" alt="${alt}" loading="lazy">
<svg viewBox="0 0 ${W} ${H}" aria-hidden="true" font-family="system-ui,sans-serif">${svg}</svg>
<figcaption>${compact ? `${title} · ` : ""}Sample property</figcaption>
</div>`;
  const legendHtml = (cls) => `<ul class="${cls}">${legend.map(([sw, label]) => `<li>${sw}<span>${label}</span></li>`).join("")}</ul>`;
  if (compact) return `<figure class="mapcard compact">${map}${legendHtml("legend")}</figure>`;
  return `<figure class="mapcard" id="${id}">
<div class="mapcard-text">
<h3>${title}</h3>
<p>${description}</p>
${legendHtml("legend legend-col")}
</div>
${map}
</figure>`;
}

const sw = (inner) => `<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">${inner}</svg>`;

/* ---------------------------------------------------------------- barrier */
export function barrierMap(compact = false) {
  const interior = new Set([1, 4]); // buildings with interior service this visit
  // The band hugs the outside of each wall: a wide stroke on the outline, masked so only
  // the half outside the building shows (FieldBook's perimeter band does the same).
  const svg = [
    `<defs><mask id="outside-bldgs"><rect width="${W}" height="${H}" fill="#fff"/>${BUILDINGS.map((b) => `<path d="${b.d}" fill="#000"/>`).join("")}</mask></defs>`,
    `<g mask="url(#outside-bldgs)">${BUILDINGS.map((b) => `<path d="${b.d}" fill="none" stroke="rgba(52,199,89,.8)" stroke-width="16" stroke-linejoin="round"/>`).join("")}</g>`,
    BUILDINGS.map((b, i) => (interior.has(i) ? `<path d="${b.d}" fill="rgba(46,160,67,.42)"/>` : "")).join(""),
    outlines(),
    buildingLabels(),
  ].join("");
  return figure(
    {
      id: "barrier-map",
      title: "Barrier treatment map",
      description:
        "Shows where the perimeter barrier was applied on this visit. The green band runs along the outside wall of every building that was treated. Shaded buildings also had interior service, so managers can see exactly what was covered and when.",
      alt: "Aerial map of seven condo buildings, each outlined by a green perimeter barrier band along its outside walls",
      svg,
      legend: [
        [sw(`<rect x="2" y="2" width="18" height="18" rx="3" fill="none" stroke="rgba(52,199,89,.9)" stroke-width="5"/>`), "Perimeter barrier applied"],
        [sw(`<rect x="3" y="3" width="16" height="16" rx="2" fill="rgba(46,160,67,.5)" stroke="#fff" stroke-width="1.5"/>`), "Interior treated this visit"],
        [sw(`<rect x="3" y="3" width="16" height="16" rx="2" fill="#cfd2d8" stroke="#fff" stroke-width="2"/>`), "Building outline"],
      ],
    },
    compact,
  );
}

/* ----------------------------------------------------------------- rodent */
const LEVEL = [
  ["#eae5db", "#1d1c18", "No feeding"],
  ["#dfa06c", "#1d1c18", "Light feeding"],
  ["#e2b100", "#1d1c18", "Moderate feeding"],
  ["#c62828", "#fffefc", "Heavy feeding"],
  ["#5b7a99", "#fffefc", "New station installed"],
  ["#7d5ba6", "#fffefc", "Expired bait replaced"],
];
// Reading at each of the 28 stations (index into LEVEL): the activity concentrates at the
// north-east end of the property, the way FieldBook's demo report tells it.
const RODENT_READINGS = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 4, 0, 0, 1, 0, 0, 0, 1, 2, 0, 1, 3, 2, 0, 2, 0, 3, 5];

// Protecta LP lid from above (StationMarker's LP_HEX_UNIT): full-width back at local +y,
// chamfered front at local -y. Rotating by facing + 90 points the front along `facing`
// (degrees clockwise from +x), so the back sits against the wall it was snapped to.
const LP_UNIT = [[0, 0], [1, 0], [1, 0.62], [0.8, 1], [0.2, 1], [0, 0.62]].map(([ux, uy]) => [(ux - 0.5) * 2, (0.5 - uy) * 2]);
function lidPoints(x, y, facing, hw = 11) {
  const hh = (hw * 9) / 13;
  const r = (((facing ?? 270) + 90) * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return LP_UNIT.map(([a, b]) => [a * hw, b * hh])
    .map(([a, b]) => `${(x + a * c - b * s).toFixed(1)},${(y + a * s + b * c).toFixed(1)}`)
    .join(" ");
}

export function rodentMap(compact = false) {
  const svg = [
    buildingLabels(),
    GEO.stations
      .map((st, i) => {
        const [fill, ink] = LEVEL[RODENT_READINGS[i] ?? 0];
        return `<g><polygon points="${lidPoints(st.x, st.y, st.facing)}" fill="${fill}" stroke="#fff" stroke-width="2"/><text x="${st.x}" y="${(st.y + 3.8).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="800" fill="${ink}">${st.n}</text></g>`;
      })
      .join(""),
  ].join("");
  return figure(
    {
      id: "rodent-map",
      title: "Rodent station map",
      description:
        "Every exterior bait station is numbered and pinned where it sits, back against the wall. At each visit the technician checks every station, and its color shows how much feeding it had. Hot spots stand out right away, and you can watch them cool down from one report to the next.",
      alt: "Aerial map of seven condo buildings with 28 numbered rodent bait stations against the walls, colored by feeding activity",
      svg,
      legend: LEVEL.map(([fill, , label]) => [sw(`<polygon points="${lidPoints(11, 11, 270, 9)}" fill="${fill}" stroke="#fff" stroke-width="1.5"/>`), label]),
    },
    compact,
  );
}

/* ---------------------------------------------------------------- termite */
// Paved or roofed cells of the photo (bright, unsaturated pixels; 3 px cells in canvas
// units), from paved.json. Termite stations go in the ground: never a road, driveway or roof.
const PAVED = JSON.parse(readFileSync(new URL("./paved.json", import.meta.url), "utf8"));
const pavedBits = Buffer.from(PAVED.bits, "base64");
function paved(x, y) {
  const cx = Math.floor(x / PAVED.cell);
  const cy = Math.floor(y / PAVED.cell);
  if (cx < 0 || cy < 0 || cx >= PAVED.w || cy >= PAVED.h) return true;
  const i = cy * PAVED.w + cx;
  return ((pavedBits[i >> 3] >> (i & 7)) & 1) === 1;
}
const inGround = ([x, y]) => {
  for (let dy = -4; dy <= 4; dy += 2) for (let dx = -4; dx <= 4; dx += 2) if (paved(x + dx, y + dy)) return false;
  return !BUILDINGS.some((b) => inside([x, y], b.poly));
};

/** In-ground spots ringing a building just outside its walls, at least `spacing` apart. */
function termiteSpots(b, spacing) {
  const poly = b.poly;
  const area = poly.reduce((s, [x, y], i) => {
    const [nx, ny] = poly[(i + 1) % poly.length];
    return s + x * ny - nx * y;
  }, 0);
  const sign = area > 0 ? 1 : -1; // outward normal side for this winding
  const kept = [];
  for (const off of [7, 11]) {
    for (let i = 0; i < poly.length; i++) {
      const [ax, ay] = poly[i];
      const [bx, by] = poly[(i + 1) % poly.length];
      const len = Math.hypot(bx - ax, by - ay);
      const nx = (sign * (by - ay)) / len;
      const ny = (-sign * (bx - ax)) / len;
      for (let d = 4; d < len - 2; d += 4) {
        const p = [ax + ((bx - ax) * d) / len + nx * off, ay + ((by - ay) * d) / len + ny * off];
        if (!inGround(p)) continue;
        if (kept.some(([x, y]) => Math.hypot(x - p[0], y - p[1]) < spacing)) continue;
        kept.push(p);
      }
    }
  }
  return kept;
}

export function termiteMap(compact = false) {
  const spots = BUILDINGS.flatMap((b) => termiteSpots(b, 20));
  // Live activity at two neighbouring stations, and one that couldn't be reached.
  const liveAt = spots.reduce((best, p, i) => (p[1] < spots[best][1] ? i : best), 0);
  const live = new Set([liveAt, liveAt + 1]);
  const noAccess = new Set([Math.floor(spots.length * 0.3)]);
  const svg = [
    spots
      .map(([x, y], i) => {
        const cx = x.toFixed(1);
        const cy = y.toFixed(1);
        if (live.has(i)) return `<circle cx="${cx}" cy="${cy}" r="8.5" fill="none" stroke="#c62828" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="4.8" fill="#c62828" stroke="#fff" stroke-width="1.5"/>`;
        if (noAccess.has(i)) return `<circle cx="${cx}" cy="${cy}" r="4.8" fill="rgba(255,255,255,.4)" stroke="#fff" stroke-width="1.5" stroke-dasharray="2.5 2"/>`;
        return `<circle cx="${cx}" cy="${cy}" r="4.8" fill="#b8874c" stroke="#fff" stroke-width="1.5"/>`;
      })
      .join(""),
    buildingLabels(),
  ].join("");
  return figure(
    {
      id: "termite-map",
      title: "Termite station map",
      description:
        "In-ground termite monitoring stations ring each building in the soil and landscape beds along the walls. Every station is inspected on schedule. Live termite activity is flagged in red so it can be treated right away, and any station that couldn't be reached is marked for the next visit.",
      alt: "Aerial map of seven condo buildings ringed by in-ground termite monitoring stations, two flagged with live activity",
      svg,
      legend: [
        [sw(`<circle cx="11" cy="11" r="6" fill="#b8874c" stroke="#fff" stroke-width="2"/>`), "Inspected, no activity"],
        [sw(`<circle cx="11" cy="11" r="9" fill="none" stroke="#c62828" stroke-width="2.5"/><circle cx="11" cy="11" r="5" fill="#c62828" stroke="#fff" stroke-width="1.5"/>`), "Live termite activity"],
        [sw(`<circle cx="11" cy="11" r="6" fill="#d8d3c8" stroke="#7b7468" stroke-width="1.5" stroke-dasharray="3 2.5"/>`), "Could not access"],
      ],
    },
    compact,
  );
}

/* ------------------------------------------------------- service area map */
export function serviceAreaMap() {
  const geo = JSON.parse(readFileSync(new URL("./swfl.json", import.meta.url), "utf8"));
  const label = (name, x, y) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="26" font-weight="800" letter-spacing=".08em" fill="#1d5b3a" opacity=".85">${name}</text>`;
  return `<figure class="areamap">
<svg viewBox="0 0 ${geo.W} ${geo.H}" role="img" aria-label="Map of Southwest Florida with Lee and Collier counties highlighted" font-family="system-ui,sans-serif">
<rect width="${geo.W}" height="${geo.H}" fill="#cfe3ea"/>
${geo.other.map(([, d]) => `<path d="${d}" fill="#efe9dd" stroke="#c9bfad" stroke-width="1.2"/>`).join("")}
${Object.values(geo.served).map((d) => `<path d="${d}" fill="#7fbf95" fill-opacity=".85" stroke="#1d5b3a" stroke-width="2.5"/>`).join("")}
${label("LEE COUNTY", 290, 152)}
${label("COLLIER COUNTY", 560, 520)}
${geo.towns
  .map(
    ([name, x, y]) =>
      `<g><circle cx="${x}" cy="${y}" r="5.5" fill="${name === "Naples" ? "#c4621f" : "#fff"}" stroke="#1d1c18" stroke-width="1.5"/><text x="${x + 9}" y="${y + 5}" font-size="15" font-weight="700" fill="#1d1c18" paint-order="stroke" stroke="#fff" stroke-width="3">${name}${name === "Naples" ? " (office)" : ""}</text></g>`,
  )
  .join("")}
</svg>
</figure>`;
}
