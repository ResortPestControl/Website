// Simple line drawings of each pest for the Pest Guide cards: one small SVG per species,
// drawn from a few parameters (colors, proportions, markings) so the drawings stay consistent.
const INK = "#2b2722";

const svg = (label, inner, vb = "0 0 100 100") =>
  `<svg class="pest-art-svg" viewBox="${vb}" role="img" aria-label="${label}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

/** Ant from above: head, thorax and abdomen, six bent legs, elbowed antennae. */
export function ant(label, { head = "#3a2a20", thorax = "#3a2a20", gaster = "#3a2a20", legs = INK, headR = 8, size = 1 } = {}) {
  const s = size;
  const leg = (y, dx, dy) => `<path d="M50 ${y} l${-12 * s} ${dy * s} l${-dx * s} ${8 * s}" stroke="${legs}"/><path d="M50 ${y} l${12 * s} ${dy * s} l${dx * s} ${8 * s}" stroke="${legs}"/>`;
  return svg(
    label,
    `<g transform="translate(50 50) scale(${s}) translate(-50 -50)">
${leg(40, 4, -8)}${leg(44, 2, 2)}${leg(48, -2, 12)}
<path d="M46 ${30 - headR} l-6 -8 l-8 -4 M54 ${30 - headR} l6 -8 l8 -4" stroke="${legs}"/>
<circle cx="50" cy="${30 - headR / 2}" r="${headR}" fill="${head}"/>
<ellipse cx="50" cy="44" rx="5" ry="9" fill="${thorax}"/>
<circle cx="50" cy="55" r="2.2" fill="${thorax}"/>
<ellipse cx="50" cy="70" rx="11" ry="13" fill="${gaster}"/>
</g>`,
    "18 8 64 84",
  );
}

/** Cockroach from above: shield behind the head, wings, long antennae, spiny legs. */
export function roach(label, { body = "#7a3f1d", shield = "#8a4a22", band = null, stripes = null, edge = null, shortWings = false, size = 1 } = {}) {
  const s = size;
  const legs = [[38, -18, -6], [50, -22, 4], [62, -20, 18]]
    .map(([y, dx, dy]) => `<path d="M42 ${y} l${dx / 2} ${dy / 2} l${dx / 2} ${dy / 2 + 6}"/><path d="M58 ${y} l${-dx / 2} ${dy / 2} l${-dx / 2} ${dy / 2 + 6}"/>`)
    .join("");
  const wingLen = shortWings ? 20 : 38;
  return svg(
    label,
    `<g transform="translate(50 50) scale(${s}) translate(-50 -50)">
<path d="M46 20 C40 10 30 6 18 4 M54 20 C60 10 70 6 82 4" stroke-width="1.5"/>
${legs}
<ellipse cx="50" cy="56" rx="15" ry="${shortWings ? 26 : 30}" fill="${body}"/>
<path d="M50 34 C44 ${34 + wingLen / 2} 40 ${34 + wingLen} 38 ${34 + wingLen + 4} M50 34 C56 ${34 + wingLen / 2} 60 ${34 + wingLen} 62 ${34 + wingLen + 4}" stroke="${edge || "rgba(0,0,0,.35)"}" stroke-width="${edge ? 2.5 : 1.5}"/>
<path d="M50 34 V${34 + wingLen + 2}" stroke="rgba(0,0,0,.35)" stroke-width="1.2"/>
<ellipse cx="50" cy="31" rx="14" ry="9" fill="${shield}"/>
${band ? `<path d="M38 33 Q50 41 62 33" stroke="${band}" stroke-width="2.5"/>` : ""}
${stripes ? `<path d="M46 25 V37 M54 25 V37" stroke="${stripes}" stroke-width="2.5"/>` : ""}
<circle cx="50" cy="22" r="4.5" fill="${shield}"/>
</g>`,
  );
}

/** Rat or mouse from the side: body, head, ear, eye, whiskers, stick legs and a tail. */
export function rodent(label, { fur = "#5b5048", ear = 6, tail = 1, body = 1, snout = 1 } = {}) {
  const bx = 52;
  const rx = 22 * body;
  const ry = 13 * body;
  const tailEnd = bx - rx - 38 * tail;
  return svg(
    label,
    `<path d="M${bx - rx + 2} ${58} C${bx - rx - 14 * tail} ${66} ${tailEnd + 10} ${46} ${tailEnd} ${54}" stroke-width="2.2"/>
<path d="M${bx - rx * 0.5} ${58 + ry - 6} l-2 10 M${bx - rx * 0.1} ${58 + ry - 5} l2 10 M${bx + rx * 0.45} ${58 + ry - 6} l-1 10 M${bx + rx * 0.75} ${58 + ry - 8} l3 9"/>
<ellipse cx="${bx}" cy="58" rx="${rx}" ry="${ry}" fill="${fur}"/>
<path d="M${bx + rx - 6} ${50} q${14 * snout} 2 ${22 * snout} 10 q-${10 * snout} 6 -${22 * snout} 4 z" fill="${fur}"/>
<circle cx="${bx + rx - 2}" cy="${46 - ear / 3}" r="${ear}" fill="#c9a49a"/>
<circle cx="${bx + rx + 8 * snout}" cy="54" r="1.6" fill="${INK}" stroke="none"/>
<path d="M${bx + rx + 20 * snout} 60 l8 -3 M${bx + rx + 20 * snout} 60 l9 1 M${bx + rx + 20 * snout} 60 l7 4" stroke-width="1"/>`,
    "-14 34 122 48",
  );
}

/** Termite from above: straight body, beaded straight antennae, pale soft body. */
export function termite(label, { head = "#b5651d", body = "#efe2c8", wings = false } = {}) {
  const legs = [[40, -14, -4], [46, -16, 4], [52, -14, 12]]
    .map(([y, dx, dy]) => `<path d="M46 ${y} l${dx / 2} ${dy / 2} l${dx / 2} ${dy / 2 + 4}"/><path d="M54 ${y} l${-dx / 2} ${dy / 2} l${-dx / 2} ${dy / 2 + 4}"/>`)
    .join("");
  return svg(
    label,
    `${wings ? `<path d="M50 40 C30 46 22 70 26 90 C34 82 44 64 50 46 M50 40 C70 46 78 70 74 90 C66 82 56 64 50 46" fill="rgba(200,215,230,.5)" stroke-width="1.3"/>` : ""}
<path d="M46 22 l-6 -10 l-4 -6 M54 22 l6 -10 l4 -6" stroke-dasharray="2 1.6"/>
${legs}
<ellipse cx="50" cy="44" rx="6" ry="6" fill="${body}"/>
<ellipse cx="50" cy="66" rx="9" ry="${wings ? 16 : 18}" fill="${body}"/>
<path d="M42 60 Q50 63 58 60 M42 67 Q50 70 58 67 M43 74 Q50 77 57 74" stroke-width="1" stroke="rgba(0,0,0,.3)"/>
<ellipse cx="50" cy="29" rx="7" ry="9" fill="${head}"/>`,
  );
}

/** A low-rise condo building, for the community programs card. */
export function building(label) {
  const windows = [];
  for (const y of [40, 56, 72]) for (const x of [28, 42, 58, 72]) windows.push(`<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="#cfe3ea" stroke-width="1.3"/>`);
  return svg(
    label,
    `<path d="M16 88 H84" />
<rect x="20" y="28" width="60" height="60" fill="#efe6d6"/>
<path d="M16 30 L50 12 L84 30 Z" fill="#c4621f"/>
${windows.join("")}
<rect x="45" y="74" width="10" height="14" fill="#1d5b3a"/>`,
  );
}
