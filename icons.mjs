// Line icons for the icon tiles, in the same hand-drawn style as the pest drawings.
const P = {
  family: `<path d="M8 22 24 9l16 13"/><path d="M12 19v20h24V19"/><circle cx="20" cy="27" r="3"/><circle cx="29" cy="28" r="2.4"/><path d="M15 39c0-5 2.5-7 5-7s5 2 5 7M25.5 39c0-4 1.6-6 3.5-6s3.5 2 3.5 6"/>`,
  badge: `<circle cx="24" cy="19" r="10"/><path d="m19.5 19 3 3 6-6"/><path d="m17 27-4 13 6-3 3 5 2-9M31 27l4 13-6-3-3 5-2-9"/>`,
  pin: `<path d="M24 42s-12-12-12-21a12 12 0 0 1 24 0c0 9-12 21-12 21z"/><circle cx="24" cy="21" r="4.5"/>`,
  shield: `<path d="M24 6 39 11v11c0 10-7 17-15 20-8-3-15-10-15-20V11z"/><path d="M17 24l5 5 9-10"/>`,
  search: `<circle cx="21" cy="21" r="11"/><path d="m29 29 10 10"/><path d="M17 18c1-2 3-3 5-3"/>`,
  seal: `<rect x="9" y="11" width="30" height="26" rx="2"/><path d="M9 20h30M9 28h30M19 11v9M29 20v8M19 28v9"/>`,
  spray: `<path d="M17 18h12v22H17z"/><path d="M19 18v-5h8v5M27 13h4l3-3"/><path d="M36 14l3-1M36 18h4M36 22l3 1"/>`,
  chart: `<path d="M8 40h32"/><path d="M12 34l8-9 6 5 10-14"/><circle cx="36" cy="16" r="2"/>`,
  calendar: `<rect x="8" y="11" width="32" height="28" rx="3"/><path d="M8 19h32M16 7v8M32 7v8"/><path d="M15 26h4M22 26h4M29 26h4M15 32h4M22 32h4"/>`,
  report: `<path d="M13 6h16l7 7v29H13z"/><path d="M29 6v7h7M18 21h13M18 27h13M18 33h8"/>`,
  dollar: `<rect x="6" y="13" width="36" height="22" rx="3"/><circle cx="24" cy="24" r="5"/><path d="M12 19v10M36 19v10"/>`,
  chat: `<path d="M8 12h32v20H22l-8 7v-7H8z"/><path d="M15 20h18M15 25h12"/>`,
  people: `<circle cx="18" cy="17" r="5"/><circle cx="32" cy="19" r="4"/><path d="M8 38c0-7 4.5-11 10-11s10 4 10 11M27 38c0-5 2-8 5-8s7 3 7 8"/>`,
  clock: `<circle cx="24" cy="24" r="16"/><path d="M24 14v10l7 5"/>`,
  leaf: `<path d="M10 38C10 20 22 10 40 9c0 18-10 29-27 29"/><path d="M10 38 28 20"/>`,
  station: `<path d="M8 32V22l6-8h20l6 8v10z"/><path d="M8 22h32M18 32v-6h12v6"/>`,
  building: `<path d="M10 40V12h28v28"/><path d="M6 40h36M16 18h4M28 18h4M16 25h4M28 25h4M16 32h4M28 32h4M22 40v-7h4v7"/>`,
  wing: `<path d="M24 22C16 14 8 14 6 18c4 6 12 8 18 4zM24 22c8-8 16-8 18-4-4 6-12 8-18 4z"/><path d="M24 22v16"/>`,
  tube: `<path d="M18 42V8M30 42V8"/><path d="M18 14c4 2 8 2 12 0M18 22c4 2 8 2 12 0M18 30c4 2 8 2 12 0M18 38c4 2 8 2 12 0"/>`,
  droppings: `<ellipse cx="16" cy="30" rx="4" ry="2"/><ellipse cx="26" cy="33" rx="4" ry="2"/><ellipse cx="33" cy="27" rx="4" ry="2"/><ellipse cx="22" cy="24" rx="4" ry="2"/>`,
  hollow: `<path d="M8 16h32v16H8z"/><path d="M14 22c3 2 6-2 9 0s6 2 9 0"/><circle cx="34" cy="26" r="1.6"/>`,
  termite: `<ellipse cx="24" cy="14" rx="4" ry="5"/><ellipse cx="24" cy="23" rx="3.5" ry="3.5"/><ellipse cx="24" cy="34" rx="5" ry="8"/><path d="M21 10l-4-5M27 10l4-5M21 22l-7-3M27 22l7-3M21 25l-8 2M27 25l8 2M21 28l-6 6M27 28l6 6"/>`,
  palm: `<path d="M24 42c0-10 1-18 0-24"/><path d="M24 18c-4-6-12-6-16-2 6-1 10 0 16 2zM24 18c4-6 12-6 16-2-6-1-10 0-16 2zM24 18c-2-6-8-10-12-9 4 2 8 5 12 9zM24 18c2-6 8-10 12-9-4 2-8 5-12 9z"/>`,
};

/** An inline line icon by name. */
export const icon = (name, size = 40) =>
  `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ""}</svg>`;

/** A grid of icon tiles: [icon, title, short line?]. */
export const tiles = (items, cls = "") =>
  `<div class="tiles ${cls}">${items
    .map(([ic, title, text]) => `<div class="tile"><span class="tile-ico">${icon(ic)}</span><b>${title}</b>${text ? `<span>${text}</span>` : ""}</div>`)
    .join("")}</div>`;
