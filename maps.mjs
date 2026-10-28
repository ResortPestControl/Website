// The illustrated property maps (barrier, rodent and termite) on the sample
// community photo, and the Lee + Collier service-area map. Drawn as inline SVG
// over static/img/property-map.webp (760 x 810), styled like FieldBook's maps.
import { readFileSync } from "node:fs";

const W = 760;
const H = 810;

// The six condo buildings in the photo: center x, y, width, height, rotation (degrees).
const BUILDINGS = [
  [617, 118, 125, 105, -28],
  [482, 217, 135, 108, -28],
  [390, 342, 132, 106, -28],
  [280, 437, 132, 106, -28],
  [160, 532, 132, 106, -28],
  [102, 725, 130, 108, -25],
];

function corners([cx, cy, w, h, deg], grow = 0) {
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  const hw = w / 2 + grow;
  const hh = h / 2 + grow;
  return [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]);
}

const pts = (p) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** Points every `spacing` px around a building, `grow` px outside its wall. */
function around(b, grow, spacing, offset = 0) {
  const p = corners(b, grow);
  const out = [];
  let carry = offset;
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = p[i];
    const [bx, by] = p[(i + 1) % 4];
    const len = Math.hypot(bx - ax, by - ay);
    for (let d = carry; d < len; d += spacing) out.push([ax + ((bx - ax) * d) / len, ay + ((by - ay) * d) / len]);
    carry = (carry - len) % spacing;
    if (carry < 0) carry += spacing;
  }
  return out;
}

function buildingLabels() {
  return BUILDINGS.map(
    ([cx, cy], i) =>
      `<g><rect x="${cx - 30}" y="${cy - 12}" width="60" height="24" rx="12" fill="rgba(255,253,248,.92)"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="#1d1c18">Bldg ${i + 1}</text></g>`,
  ).join("");
}

const outlines = (stroke = "rgba(255,255,255,.9)") =>
  BUILDINGS.map((b) => `<polygon points="${pts(corners(b))}" fill="rgba(231,232,235,.18)" stroke="${stroke}" stroke-width="2.5"/>`).join("");

function figure({ id, title, description, svg, legend, alt }) {
  return `<figure class="mapcard" id="${id}">
<div class="mapcard-text">
<h3>${title}</h3>
<p>${description}</p>
<ul class="legend legend-col">${legend.map(([sw, label]) => `<li>${sw}<span>${label}</span></li>`).join("")}</ul>
</div>
<div class="mapfig">
<img src="/img/property-map.webp" srcset="/img/property-map-380.webp 380w, /img/property-map.webp 760w" sizes="(max-width: 860px) 100vw, 640px" width="${W}" height="${H}" alt="${alt}" loading="lazy">
<svg viewBox="0 0 ${W} ${H}" aria-hidden="true" font-family="system-ui,sans-serif">${svg}</svg>
<figcaption>Sample property</figcaption>
</div>
</figure>`;
}

const sw = (inner) => `<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">${inner}</svg>`;

/* ---------------------------------------------------------------- barrier */
export function barrierMap() {
  const interior = new Set([1, 4]); // buildings with interior service this visit
  const svg = [
    BUILDINGS.map((b, i) => (interior.has(i) ? `<polygon points="${pts(corners(b))}" fill="rgba(46,160,67,.38)"/>` : "")).join(""),
    BUILDINGS.map((b) => `<polygon points="${pts(corners(b, 7))}" fill="none" stroke="rgba(52,199,89,.75)" stroke-width="13" stroke-linejoin="round"/>`).join(""),
    outlines(),
    buildingLabels(),
  ].join("");
  return figure({
    id: "barrier-map",
    title: "Barrier treatment map",
    description:
      "Shows where the perimeter barrier was applied on this visit. The green band follows the outside wall of every building that was treated. Shaded buildings also had interior service, so managers can see exactly what was covered and when.",
    alt: "Aerial map of six condo buildings, each outlined with a green perimeter barrier band",
    svg,
    legend: [
      [sw(`<rect x="2" y="2" width="18" height="18" rx="3" fill="none" stroke="rgba(52,199,89,.85)" stroke-width="5"/>`), "Perimeter barrier applied"],
      [sw(`<rect x="3" y="3" width="16" height="16" rx="2" fill="rgba(46,160,67,.45)" stroke="#fff" stroke-width="1.5"/>`), "Interior treated this visit"],
      [sw(`<rect x="3" y="3" width="16" height="16" rx="2" fill="#cfd2d8" stroke="#fff" stroke-width="2"/>`), "Building outline"],
    ],
  });
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
// Activity at each station, in order around the property (index into LEVEL).
const RODENT_READINGS = [0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 3, 2, 0, 0, 5, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0];

function lidPath(x, y, deg, scale = 1.45) {
  // Protecta LP lid seen from above: a six-sided shape, chamfered front corners.
  const shape = [[-13, -9], [13, -9], [13, 2], [8, 9], [-8, 9], [-13, 2]].map(([a, b]) => [a * scale, b * scale]);
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return pts(shape.map(([a, b]) => [x + a * c - b * s, y + a * s + b * c]));
}

export function rodentMap() {
  let n = 0;
  // A station off each corner, plus one along the long front wall of the bigger buildings.
  const stations = BUILDINGS.flatMap((b, i) => {
    const c = corners(b, 20);
    const mid = [(c[0][0] + c[1][0]) / 2, (c[0][1] + c[1][1]) / 2];
    return ([1, 2, 3].includes(i) ? [c[0], mid, c[1], c[2], c[3]] : c).map((p) => [p, b[4]]);
  });
  const svg = [
    outlines(),
    buildingLabels(),
    stations
      .map(([[x, y], deg]) => {
        const lvl = RODENT_READINGS[n % RODENT_READINGS.length];
        const [fill, ink] = LEVEL[lvl];
        n++;
        return `<g><polygon points="${lidPath(x, y, deg)}" fill="${fill}" stroke="#fff" stroke-width="2.5"/><text x="${x.toFixed(1)}" y="${(y + 5.5).toFixed(1)}" text-anchor="middle" font-size="16" font-weight="800" fill="${ink}">${n}</text></g>`;
      })
      .join(""),
  ].join("");
  return figure({
    id: "rodent-map",
    title: "Rodent station map",
    description:
      "Every exterior bait station is numbered and pinned where it sits. At each visit the technician checks every station, and its color shows how much feeding it had. Hot spots stand out right away, and you can watch them cool down from one report to the next.",
    alt: "Aerial map of six condo buildings with numbered rodent bait stations colored by feeding activity",
    svg,
    legend: LEVEL.map(([fill, , label]) => [sw(`<polygon points="${lidPath(11, 11, 0, 0.75)}" fill="${fill}" stroke="#fff" stroke-width="1.5" transform="translate(0,0)"/>`), label]),
  });
}

/* ---------------------------------------------------------------- termite */
export function termiteMap() {
  const live = new Set([9, 10]);
  const noAccess = new Set([31]);
  let n = 0;
  const svg = [
    outlines(),
    BUILDINGS.map((b, bi) =>
      around(b, 11, 40, 8 + bi * 3)
        .map(([x, y]) => {
          const i = n++;
          if (live.has(i)) return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12" fill="none" stroke="#c62828" stroke-width="3"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="#c62828" stroke="#fff" stroke-width="2"/>`;
          if (noAccess.has(i)) return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="rgba(255,255,255,.35)" stroke="#fff" stroke-width="2" stroke-dasharray="3 2.5"/>`;
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7.5" fill="#b8874c" stroke="#fff" stroke-width="2"/>`;
        })
        .join(""),
    ).join(""),
    buildingLabels(),
  ].join("");
  return figure({
    id: "termite-map",
    title: "Termite station map",
    description:
      "In-ground termite monitoring stations ring each building at regular spacing. Every station is inspected on schedule. Live termite activity is flagged in red so it can be treated right away, and any station that couldn't be reached is marked for the next visit.",
    alt: "Aerial map of six condo buildings ringed by in-ground termite monitoring stations, two flagged with live activity",
    svg,
    legend: [
      [sw(`<circle cx="11" cy="11" r="6.5" fill="#b8874c" stroke="#fff" stroke-width="2"/>`), "Inspected, no activity"],
      [sw(`<circle cx="11" cy="11" r="9" fill="none" stroke="#c62828" stroke-width="2.5"/><circle cx="11" cy="11" r="5" fill="#c62828" stroke="#fff" stroke-width="1.5"/>`), "Live termite activity"],
      [sw(`<circle cx="11" cy="11" r="6.5" fill="#d8d3c8" stroke="#7b7468" stroke-width="1.5" stroke-dasharray="3 2.5"/>`), "Could not access"],
    ],
  });
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
