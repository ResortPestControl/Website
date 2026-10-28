// The property maps (barrier, rodent and termite) and the Lee + Collier service-area map.
// The property maps are drawn from FieldBook's own data for a sample property
// (tools/sample-geometry-src.json): five traced buildings and the station layout mapped
// in FieldBook -- the rodent stations of one building and the termite stations of another,
// repeated on each building. Building numbers are replaced and the street name is left off.
// The satellite photo is cropped from FieldBook's basemap at build time
// (tools/satellite.mjs); without it the maps use FieldBook's plain map style.
// Every station and building is clickable: static/maps.js shows its latest reading.
import { existsSync, readFileSync } from "node:fs";

const SRC = JSON.parse(readFileSync(new URL("./tools/sample-geometry-src.json", import.meta.url), "utf8"));
const SAT = existsSync(new URL("./static/img/sample-sat.webp", import.meta.url));
const VIEW = { x: 1500, y: 1420, w: 800, h: 280 };
const LABELS = ["100", "200", "300", "400", "500"];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** "M x yL x y...Z" -> [[x, y], ...] */
const polyOf = (d) => d.replace(/[MZ]/g, "").split("L").map((p) => p.trim().split(/\s+/).map(Number));
const bboxMin = (poly) => [Math.min(...poly.map((p) => p[0])), Math.min(...poly.map((p) => p[1]))];
const bboxCenter = (poly) => {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
};

const BUILDINGS = SRC.buildings.map(([key, d], i) => {
  const poly = polyOf(d);
  return { key, d, poly, label: LABELS[i], min: bboxMin(poly), c: bboxCenter(poly) };
});
const byKey = (k) => BUILDINGS.find((b) => b.key === k);

/** Repeat one building's station layout on every building, by the offset between their footprints. */
function repeatLayout(fromKey, points) {
  const [fx, fy] = byKey(fromKey).min;
  return BUILDINGS.flatMap((b, bi) => points.map(([x, y, facing], n) => ({ b: bi, n: n + 1, x: x - fx + b.min[0], y: y - fy + b.min[1], facing })));
}
const RODENT = repeatLayout(SRC.rodentFrom, SRC.rodent);
const TERMITE = repeatLayout(SRC.termiteFrom, SRC.termite);

const JOINS = [[1460, 1443], [1765, 1446], [1987, 1451], [2154, 1431], [2275.5, 1396]];
const basemap = () =>
  SAT
    ? `<image href="/img/sample-sat.webp" x="${VIEW.x}" y="${VIEW.y}" width="${VIEW.w}" height="${VIEW.h}" preserveAspectRatio="none"/>`
    : `<rect x="${VIEW.x}" y="${VIEW.y}" width="${VIEW.w}" height="${VIEW.h}" fill="#f4f3ee"/>` +
      `<path d="${SRC.water}" fill="#9fd6ea"/>` +
      `<path d="${SRC.road}" fill="#c3ccd8"/>${JOINS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16.8" fill="#c3ccd8"/>`).join("")}`;

// On the photo the roofs speak for themselves; outlines are only drawn where they carry
// meaning (the barrier map) or when there is no photo underneath.
const outlines = (always = false) =>
  !always && SAT
    ? ""
    : BUILDINGS.map((b) => `<path d="${b.d}" fill="${SAT ? "rgba(255,255,255,.08)" : "#dcdde1"}" stroke="${SAT ? "rgba(255,255,255,.9)" : "#a9adb5"}" stroke-width="1.4" stroke-linejoin="round"/>`).join("");

function buildingLabels() {
  return BUILDINGS.map(
    ({ c: [cx, cy], label }) =>
      `<g pointer-events="none"><rect x="${cx - 17}" y="${cy - 8}" width="34" height="16" rx="8" fill="rgba(255,253,248,.95)" stroke="#a9adb5" stroke-width=".8"/><text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#1d1c18">${label}</text></g>`,
  ).join("");
}

/** A clickable map item: `title` heads the detail panel, `rows` are [label, value] pairs. */
const hit = (inner, title, rows) =>
  `<g class="st" tabindex="0" role="button" aria-label="${esc(title)}" data-d="${esc(JSON.stringify({ t: title, r: rows }))}">${inner}</g>`;

function figure({ id, title, description, svg, legend, alt, prompt }, compact = false) {
  const map = `<div class="mapfig">
<svg class="mapsvg" viewBox="${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}" width="${VIEW.w}" height="${VIEW.h}" aria-label="${alt}" font-family="system-ui,sans-serif">${basemap()}${svg}</svg>
<figcaption>${compact ? `${title} · ` : ""}Sample property</figcaption>
</div>
<div class="mapdetail" aria-live="polite"><p class="mapdetail-hint">${prompt}</p></div>`;
  const legendHtml = (cls) => `<ul class="${cls}">${legend.map(([sw, label]) => `<li>${sw}<span>${label}</span></li>`).join("")}</ul>`;
  if (compact) return `<figure class="mapcard compact">${map}${legendHtml("legend")}</figure>`;
  return `<figure class="mapcard" id="${id}">
<div class="mapcard-text">
<h3>${title}</h3>
<p>${description}</p>
${legendHtml("legend legend-col")}
</div>
<div class="mapcard-map">${map}</div>
</figure>`;
}

const sw = (inner) => `<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">${inner}</svg>`;

/* ---------------------------------------------------------------- barrier */
export function barrierMap(compact = false) {
  const interior = new Set([1, 3]); // buildings with interior service this visit
  // FieldBook's perimeter band: 15 px (about 4 m) out from every wall, round at the corners.
  const svg = [
    `<defs><mask id="outside-bldgs"><rect x="${VIEW.x}" y="${VIEW.y}" width="${VIEW.w}" height="${VIEW.h}" fill="#fff"/>${BUILDINGS.map((b) => `<path d="${b.d}" fill="#000"/>`).join("")}</mask></defs>`,
    `<g mask="url(#outside-bldgs)" pointer-events="none">${BUILDINGS.map((b) => `<path d="${b.d}" fill="none" stroke="#5fd17f" stroke-opacity="${SAT ? ".7" : ".85"}" stroke-width="30" stroke-linejoin="round"/>`).join("")}</g>`,
    outlines(true),
    BUILDINGS.map((b, i) =>
      hit(
        `<path d="${b.d}" fill="${interior.has(i) ? "rgba(46,160,67,.45)" : "rgba(0,0,0,0)"}"/>`,
        `Building ${b.label}`,
        [
          ["Perimeter barrier", "Applied all the way around, out about 4 m (13 ft) from the foundation"],
          ["Interior service", interior.has(i) ? "Treated this visit" : "Not scheduled this visit"],
          ["Entry points", i === 3 ? "Gap under the rear service door noted for the association" : "None found"],
        ],
      ),
    ).join(""),
    buildingLabels(),
  ].join("");
  return figure(
    {
      id: "barrier-map",
      title: "Barrier treatment map",
      description:
        "Shows where the perimeter barrier was applied on this visit. The green band follows the outside walls of every building that was treated. Shaded buildings also had interior service, so managers can see exactly what was covered and when.",
      alt: "Map of five condo buildings, each surrounded by a green perimeter barrier band along its outside walls",
      prompt: "Select a building to see what was treated.",
      svg,
      legend: [
        [sw(`<rect x="2" y="2" width="18" height="18" rx="4" fill="none" stroke="#5fd17f" stroke-width="5"/>`), "Perimeter barrier applied"],
        [sw(`<rect x="3" y="3" width="16" height="16" rx="2" fill="#7fbf8c" stroke="#fff" stroke-width="1.5"/>`), "Interior treated this visit"],
      ],
    },
    compact,
  );
}

/* ----------------------------------------------------------------- rodent */
// [fill, legend label, detail for the panel]
const LEVEL = [
  ["#eae5db", "No feeding", ["Feeding", "None"], ["Action", "Inspected, bait fresh"]],
  ["#dfa06c", "Light feeding", ["Feeding", "Light, under 25% of the bait eaten"], ["Action", "Bait topped up"]],
  ["#e2b100", "Moderate feeding", ["Feeding", "Moderate, about half the bait eaten"], ["Action", "Bait replaced, watching this area"]],
  ["#c62828", "Heavy feeding", ["Feeding", "Heavy, bait gone"], ["Action", "Bait replaced, area inspected for entry points"]],
  ["#5b7a99", "New station installed", ["Feeding", "New this visit"], ["Action", "Station installed and filled"]],
  ["#7d5ba6", "Expired bait replaced", ["Feeding", "None"], ["Action", "Expired bait replaced"]],
];
// Reading at each station, building by building (6 per building): quiet at the west end,
// activity building toward the east end of the property.
const RODENT_READINGS = [
  0, 0, 0, 0, 0, 0,
  0, 0, 1, 0, 0, 5,
  0, 0, 0, 1, 0, 0,
  1, 0, 2, 2, 1, 0,
  4, 1, 3, 2, 2, 1,
];

// Protecta LP lid from above (StationMarker's LP_HEX_UNIT): full-width back at local +y,
// chamfered front at local -y. Rotating by facing + 90 points the front along `facing`
// (degrees clockwise from +x), so the back sits against the wall.
const LP_UNIT = [[0, 0], [1, 0], [1, 0.62], [0.8, 1], [0.2, 1], [0, 0.62]].map(([ux, uy]) => [(ux - 0.5) * 2, (0.5 - uy) * 2]);
function lidPoints(x, y, facing, hw = 6.8) {
  const hh = (hw * 9) / 13;
  const r = (((facing ?? 270) + 90) * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return LP_UNIT.map(([a, b]) => [a * hw, b * hh])
    .map(([a, b]) => `${(x + a * c - b * s).toFixed(1)},${(y + a * s + b * c).toFixed(1)}`)
    .join(" ");
}

const pad2 = (n) => String(n).padStart(2, "0");

export function rodentMap(compact = false) {
  const svg = [
    outlines(),
    buildingLabels(),
    RODENT.map((st, i) => {
      const [fill, , feeding, action] = LEVEL[RODENT_READINGS[i] ?? 0];
      const code = `${LABELS[st.b]}-R${pad2(st.n)}`;
      return hit(
        `<circle cx="${st.x.toFixed(1)}" cy="${st.y.toFixed(1)}" r="11" fill="transparent"/><polygon points="${lidPoints(st.x, st.y, st.facing)}" fill="${fill}" stroke="#1d1c18" stroke-width="1.1" stroke-linejoin="round"/>`,
        `Rodent station ${code}`,
        [["Station", "Tamper-resistant bait station, against the wall"], ["Building", LABELS[st.b]], feeding, action, ["Condition", "Good, locked and anchored"]],
      );
    }).join(""),
  ].join("");
  return figure(
    {
      id: "rodent-map",
      title: "Rodent station map",
      description:
        "Every exterior bait station is pinned where it sits, back against the wall. At each visit the technician checks every station, and its color shows how much feeding it had. Hot spots stand out right away, and you can watch them cool down from one report to the next.",
      alt: "Map of five condo buildings with rodent bait stations against the walls, colored by feeding activity",
      prompt: "Select a station to see its latest reading.",
      svg,
      legend: LEVEL.map(([fill, label]) => [sw(`<polygon points="${lidPoints(11, 11, 270, 9)}" fill="${fill}" stroke="#1d1c18" stroke-width="1.1"/>`), label]),
    },
    compact,
  );
}

/* ---------------------------------------------------------------- termite */
export function termiteMap(compact = false) {
  // Live activity at two neighbouring stations on building 300, and one that couldn't be reached.
  const perBldg = SRC.termite.length;
  const live = new Set([2 * perBldg + 5, 2 * perBldg + 6]);
  const noAccess = new Set([4 * perBldg + 11]);
  const svg = [
    outlines(),
    buildingLabels(),
    TERMITE.map(({ x, y, b, n }, i) => {
      const cx = x.toFixed(1);
      const cy = y.toFixed(1);
      const code = `${LABELS[b]}-T${pad2(n)}`;
      const target = `<circle cx="${cx}" cy="${cy}" r="10" fill="transparent"/>`;
      const base = [["Station", "In-ground termite monitoring station"], ["Building", LABELS[b]]];
      if (live.has(i))
        return hit(
          `${target}<circle cx="${cx}" cy="${cy}" r="8" fill="none" stroke="#ff3b30" stroke-width="2.2"/><circle cx="${cx}" cy="${cy}" r="4.4" fill="#c62828" stroke="#fff" stroke-width="1.3"/>`,
          `Termite station ${code}`,
          [...base, ["Activity", "Live subterranean termites found"], ["Action", "Bait cartridge installed, follow-up inspection booked"]],
        );
      if (noAccess.has(i))
        return hit(
          `${target}<circle cx="${cx}" cy="${cy}" r="4.4" fill="#e9e5dc" stroke="#7b7468" stroke-width="1.3" stroke-dasharray="2.2 1.8"/>`,
          `Termite station ${code}`,
          [...base, ["Activity", "Not inspected"], ["Action", "Covered by new landscaping, flagged for the next visit"]],
        );
      return hit(
        `${target}<circle cx="${cx}" cy="${cy}" r="4.4" fill="#b8874c" stroke="#fff" stroke-width="1.3"/>`,
        `Termite station ${code}`,
        [...base, ["Activity", "None"], ["Action", "Monitor checked, intact"]],
      );
    }).join(""),
  ].join("");
  return figure(
    {
      id: "termite-map",
      title: "Termite station map",
      description:
        "In-ground termite monitoring stations ring each building in the soil and landscape beds along the walls. Every station is inspected on schedule. Live termite activity is flagged in red so it can be treated right away, and any station that couldn't be reached is marked for the next visit.",
      alt: "Map of five condo buildings ringed by in-ground termite monitoring stations, two flagged with live activity",
      prompt: "Select a station to see its latest inspection.",
      svg,
      legend: [
        [sw(`<circle cx="11" cy="11" r="6" fill="#b8874c" stroke="#fff" stroke-width="2"/>`), "Inspected, no activity"],
        [sw(`<circle cx="11" cy="11" r="9" fill="none" stroke="#ff3b30" stroke-width="2.5"/><circle cx="11" cy="11" r="5" fill="#c62828" stroke="#fff" stroke-width="1.5"/>`), "Live termite activity"],
        [sw(`<circle cx="11" cy="11" r="6" fill="#e9e5dc" stroke="#7b7468" stroke-width="1.5" stroke-dasharray="3 2.5"/>`), "Could not access"],
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
