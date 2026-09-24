// App icon design: green long-shadow tile with a white mosque.
// All icon files (public/icon.svg, PWA PNGs, Android launcher layers) are built from this.

const r = n => Math.round(n * 10) / 10;

// --- Mosque primitives: each has an SVG path and a convex point set for the shadow ---
const poly = pts => ({ d: 'M' + pts.map(p => `${r(p[0])},${r(p[1])}`).join('L') + 'Z', pts });
const rect = (x, y, w, h) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
const circlePts = (cx, cy, rad, n = 24) =>
  Array.from({ length: n }, (_, i) => [cx + rad * Math.cos((2 * Math.PI * i) / n), cy + rad * Math.sin((2 * Math.PI * i) / n)]);
const circle = (cx, cy, rad) => ({
  d: `M${cx - rad},${cy}a${rad},${rad} 0 1,0 ${2 * rad},0a${rad},${rad} 0 1,0 ${-2 * rad},0Z`,
  pts: circlePts(cx, cy, rad),
});
// Flat-bottomed dome with an optional straight drum.
const dome = (cx, baseY, halfW, h, sideH = 0) => {
  const top = baseY - sideH - h;
  const d = `M${cx - halfW},${baseY}V${baseY - sideH}C${cx - halfW},${top + h * 0.3} ${cx - halfW * 0.6},${top} ${cx},${top}` +
    `C${cx + halfW * 0.6},${top} ${cx + halfW},${top + h * 0.3} ${cx + halfW},${baseY - sideH}V${baseY}Z`;
  const pts = [[cx - halfW, baseY], [cx + halfW, baseY]];
  for (let i = 0; i <= 16; i++) {
    const a = (Math.PI * i) / 16;
    pts.push([cx - halfW * Math.cos(a), baseY - sideH - h * Math.sin(a)]);
  }
  return { d, pts };
};
// Crescent with horns up: circle minus a smaller circle shifted upwards.
const crescent = (cx, cy, R, shift, r2) => {
  const y = (r2 * r2 - R * R - shift * shift) / (2 * shift);
  const x = Math.sqrt(R * R - y * y);
  return {
    d: `M${r(cx - x)},${r(cy + y)}A${R},${R} 0 1,0 ${r(cx + x)},${r(cy + y)}A${r2},${r2} 0 0,1 ${r(cx - x)},${r(cy + y)}Z`,
    pts: circlePts(cx, cy, R, 16),
  };
};
const withPath = (shape, d) => ({ ...shape, d });

const mx = 175; // minaret axis
const dx = 297; // dome axis

const SHAPES = [
  // minaret
  crescent(mx, 80, 9, 5, 8),
  rect(mx - 1.5, 88, 3, 12),
  circle(mx, 104, 5),
  circle(mx, 119, 7),
  withPath(poly([[mx - 3, 124], [mx + 3, 124], [mx + 15, 186], [mx - 15, 186]]),
    `M${mx - 3},124Q${mx + 2},124 ${mx + 5},140Q${mx + 13},172 ${mx + 15},186H${mx - 15}Q${mx - 13},172 ${mx - 5},140Q${mx - 2},124 ${mx - 3},124Z`),
  poly([[mx - 27, 187], [mx + 27, 187], [mx + 18, 201], [mx - 18, 201]]),
  rect(mx - 18, 200, 36, 50),
  poly([[mx - 27, 249], [mx + 27, 249], [mx + 18, 263], [mx - 18, 263]]),
  rect(mx - 18, 262, 36, 46),
  // dome
  crescent(dx, 150, 8, 4.5, 7),
  rect(dx - 1.5, 157, 3, 16),
  circle(dx, 176, 6),
  dome(dx, 214, 19, 26),
  rect(dx - 24, 210, 48, 6),
  dome(dx, 304, 69, 78, 12),
  // building, flared plinth, platform
  rect(140, 304, 232, 98),
  withPath(poly([[140, 400], [372, 400], [394, 419], [118, 419]]), 'M140,400H372Q374,414 394,419H118Q138,414 140,400Z'),
  rect(108, 426, 296, 18),
];

const arch = (cx, top, w, h) => {
  const hw = w / 2;
  return `M${cx - hw},${top + h}V${top + hw}A${hw},${hw} 0 0,1 ${cx + hw},${top + hw}V${top + h}Z`;
};
const OPENINGS = [
  arch(173, 320, 20, 32), arch(205, 320, 20, 32),
  arch(307, 320, 20, 32), arch(339, 320, 20, 32),
  'M236,410V372Q236,352 256,346Q276,352 276,372V410Z', // pointed-arch door
].join('');

// Long shadow: sweep each convex primitive 45° down-right (hull of p ∪ p+(L,L)).
const hull = pts => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  const upper = [];
  for (const q of p) { while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), q) <= 0) lower.pop(); lower.push(q); }
  for (const q of p.reverse()) { while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), q) <= 0) upper.pop(); upper.push(q); }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
};
const L = 700;
const SHADOW = SHAPES
  .map(s => hull([...s.pts, ...s.pts.map(([x, y]) => [x + L, y + L])]))
  .map(h => 'M' + h.map(p => `${r(p[0])},${r(p[1])}`).join('L') + 'Z')
  .join('');
const MOSQUE = SHAPES.map(s => s.d).join('');

// Farthest mosque point from the canvas centre, used to fit safe zones.
const CENTER = [256, 258];
const MOSQUE_RADIUS = Math.max(...SHAPES.flatMap(s => s.pts).map(([x, y]) => Math.hypot(x - CENTER[0], y - CENTER[1])));

const COLORS = {
  tileTop: '#4CC468', tileBottom: '#43B35D',
  panelTop: '#2E8A44', panelBottom: '#3FA656',
  shadow: '#1B5E2B', shadowOpacity: 0.42,
};

const defs = `
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${COLORS.tileTop}"/><stop offset="1" stop-color="${COLORS.tileBottom}"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${COLORS.panelTop}"/><stop offset="1" stop-color="${COLORS.panelBottom}"/>
    </linearGradient>
    <mask id="mosqueMask" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
      <path fill="#FFFFFF" d="${MOSQUE}"/>
      <path fill="#000000" d="${OPENINGS}"/>
    </mask>`;

/** Mosque (and optionally its shadow), scaled about the canvas centre. */
const mosqueGroup = (scale, { shadow = true, color = '#FFFFFF' } = {}) => {
  const t = `translate(${CENTER[0]} ${CENTER[1]}) scale(${r(scale * 1000) / 1000}) translate(${-CENTER[0]} ${-CENTER[1]})`;
  return `
  <g transform="${t}">
    ${shadow ? `<path d="${SHADOW}" fill="${COLORS.shadow}" fill-opacity="${COLORS.shadowOpacity}"/>` : ''}
    <rect x="-400" y="-400" width="1312" height="1312" fill="${color}" mask="url(#mosqueMask)"/>
  </g>`;
};

const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>${defs}
    <clipPath id="canvas"><rect width="512" height="512"/></clipPath>
  </defs>
  <g clip-path="url(#canvas)">${body}
  </g>
</svg>
`;

// Safe-zone radii as a fraction of the canvas: maskable PWA icons 40%, Android adaptive 66dp/108dp/2.
const fit = radiusFraction => (512 * radiusFraction) / MOSQUE_RADIUS;
// Extra breathing room inside the adaptive safe zone so circular masks don't crowd the base.
const ADAPTIVE_PADDING = 0.84;

export const iconSvg = {
  /** Main icon: rounded tile with a lighter frame (public/icon.svg, favicon, legacy launcher). */
  tile: () => svg(`
    <clipPath id="tileClip"><rect width="512" height="512" rx="104"/></clipPath>
    <g clip-path="url(#tileClip)">
      <rect width="512" height="512" fill="url(#tile)"/>
      <rect x="28" y="28" width="456" height="456" rx="80" fill="url(#panel)"/>
      <path d="${SHADOW}" fill="${COLORS.shadow}" fill-opacity="${COLORS.shadowOpacity}"/>
    </g>
    <rect width="512" height="512" fill="#FFFFFF" mask="url(#mosqueMask)"/>`),

  /** Full-bleed square for PWA "maskable" (mosque inside the 40% safe circle). */
  maskable: () => svg(`
    <rect width="512" height="512" fill="url(#panel)"/>${mosqueGroup(fit(0.4) * 0.97)}`),

  /** Android adaptive icon background layer. */
  adaptiveBackground: () => svg(`
    <rect width="512" height="512" fill="url(#panel)"/>`),

  /** Android adaptive icon foreground layer: mosque + long shadow in the safe zone. */
  adaptiveForeground: () => svg(mosqueGroup(fit(33 / 108) * ADAPTIVE_PADDING)),

  /** Android 13+ themed icon: plain silhouette, the system tints it. */
  adaptiveMonochrome: () => svg(mosqueGroup(fit(33 / 108) * ADAPTIVE_PADDING, { shadow: false })),
};
