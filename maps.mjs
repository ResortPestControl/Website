// The illustrated property maps (barrier, rodent and termite) and the Lee + Collier
// service-area map. The property maps are drawn from FieldBook's own data for a sample
// property (tools/sample-geometry-src.json): five traced buildings, the road and lake from
// its Standard basemap, and the station layout mapped in FieldBook -- the rodent stations
// of one building and the termite stations of another, repeated on each building.
// Building numbers are replaced and the street name is left off.
import { readFileSync } from "node:fs";

const SRC = JSON.parse(readFileSync(new URL("./tools/sample-geometry-src.json", import.meta.url), "utf8"));
const VIEW = { x: 1500, y: 1420, w: 800, h: 280 };
const LABELS = ["100", "200", "300", "400", "500"];

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
  `<rect x="${VIEW.x}" y="${VIEW.y}" width="${VIEW.w}" height="${VIEW.h}" fill="#f4f3ee"/>` +
  `<path d="${SRC.water}" fill="#9fd6ea"/>` +
  `<path d="${SRC.road}" fill="#c3ccd8"/>${JOINS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16.8" fill="#c3ccd8"/>`).join("")}`;

const outlines = (fill = "#dcdde1") => BUILDINGS.map((b) => `<path d="${b.d}" fill="${fill}" stroke="#a9adb5" stroke-width="1.4" stroke-linejoin="round"/>`).join("");

function buildingLabels() {
  return BUILDINGS.map(
    ({ c: [cx, cy], label }) =>
      `<g><rect x="${cx - 17}" y="${cy - 8}" width="34" height="16" rx="8" fill="rgba(255,253,248,.95)" stroke="#a9adb5" stroke-width=".8"/><text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#1d1c18">${label}</text></g>`,
  ).join("");
}

function figure({ id, title, description, svg, legend, alt }, compact = false) {
  const map = `<div class="mapfig">
<svg class="mapsvg" viewBox="${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}" width="${VIEW.w}" height="${VIEW.h}" role="img" aria-label="${alt}" font-family="system-ui,sans-serif">${basemap()}${svg}</svg>
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
  const interior = new Set([1, 3]); // buildings with interior service this visit
  // FieldBook's perimeter band: 15 px (about 4 m) out from every wall, round at the corners.
  const svg = [
    `<defs><mask id="outside-bldgs"><rect x="${VIEW.x}" y="${VIEW.y}" width="${VIEW.w}" height="${VIEW.h}" fill="#fff"/>${BUILDINGS.map((b) => `<path d="${b.d}" fill="#000"/>`).join("")}</mask></defs>`,
    `<g mask="url(#outside-bldgs)">${BUILDINGS.map((b) => `<path d="${b.d}" fill="none" stroke="#7fd39a" stroke-opacity=".85" stroke-width="30" stroke-linejoin="round"/>`).join("")}</g>`,
    outlines(),
    BUILDINGS.map((b, i) => (interior.has(i) ? `<path d="${b.d}" fill="rgba(46,160,67,.38)"/>` : "")).join(""),
    buildingLabels(),
  ].join("");
  return figure(
    {
      id: "barrier-map",
      title: "Barrier treatment map",
      description:
        "Shows where the perimeter barrier was applied on this visit. The green band follows the outside walls of every building that was treated. Shaded buildings also had interior service, so managers can see exactly what was covered and when.",
      alt: "Map of five condo buildings, each surrounded by a green perimeter barrier band along its outside walls",
      svg,
      legend: [
        [sw(`<rect x="2" y="2" width="18" height="18" rx="4" fill="none" stroke="#7fd39a" stroke-width="5"/>`), "Perimeter barrier applied"],
        [sw(`<rect x="3" y="3" width="16" height="16" rx="2" fill="#9cc8a4" stroke="#a9adb5" stroke-width="1.5"/>`), "Interior treated this visit"],
        [sw(`<rect x="3" y="3" width="16" height="16" rx="2" fill="#dcdde1" stroke="#a9adb5" stroke-width="1.5"/>`), "Building"],
      ],
    },
    compact,
  );
}

/* ----------------------------------------------------------------- rodent */
const LEVEL = [
  ["#eae5db", "No feeding"],
  ["#dfa06c", "Light feeding"],
  ["#e2b100", "Moderate feeding"],
  ["#c62828", "Heavy feeding"],
  ["#5b7a99", "New station installed"],
  ["#7d5ba6", "Expired bait replaced"],
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

export function rodentMap(compact = false) {
  const svg = [
    outlines(),
    buildingLabels(),
    RODENT.map((st, i) => {
      const [fill] = LEVEL[RODENT_READINGS[i] ?? 0];
      return `<polygon points="${lidPoints(st.x, st.y, st.facing)}" fill="${fill}" stroke="#1d1c18" stroke-width="1.1" stroke-linejoin="round"/>`;
    }).join(""),
  ].join("");
  return figure(
    {
      id: "rodent-map",
      title: "Rodent station map",
      description:
        "Every exterior bait station is pinned where it sits, back against the wall. At each visit the technician checks every station, and its color shows how much feeding it had. Hot spots stand out right away, and you can watch them cool down from one report to the next.",
      alt: "Map of five condo buildings with rodent bait stations against the walls, colored by feeding activity",
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
    TERMITE.map(({ x, y }, i) => {
      const cx = x.toFixed(1);
      const cy = y.toFixed(1);
      if (live.has(i)) return `<circle cx="${cx}" cy="${cy}" r="8" fill="none" stroke="#c62828" stroke-width="2.2"/><circle cx="${cx}" cy="${cy}" r="4.4" fill="#c62828" stroke="#fff" stroke-width="1.3"/>`;
      if (noAccess.has(i)) return `<circle cx="${cx}" cy="${cy}" r="4.4" fill="#e9e5dc" stroke="#7b7468" stroke-width="1.3" stroke-dasharray="2.2 1.8"/>`;
      return `<circle cx="${cx}" cy="${cy}" r="4.4" fill="#b8874c" stroke="#fff" stroke-width="1.3"/>`;
    }).join(""),
  ].join("");
  return figure(
    {
      id: "termite-map",
      title: "Termite station map",
      description:
        "In-ground termite monitoring stations ring each building in the soil and landscape beds along the walls. Every station is inspected on schedule. Live termite activity is flagged in red so it can be treated right away, and any station that couldn't be reached is marked for the next visit.",
      alt: "Map of five condo buildings ringed by in-ground termite monitoring stations, two flagged with live activity",
      svg,
      legend: [
        [sw(`<circle cx="11" cy="11" r="6" fill="#b8874c" stroke="#fff" stroke-width="2"/>`), "Inspected, no activity"],
        [sw(`<circle cx="11" cy="11" r="9" fill="none" stroke="#c62828" stroke-width="2.5"/><circle cx="11" cy="11" r="5" fill="#c62828" stroke="#fff" stroke-width="1.5"/>`), "Live termite activity"],
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
