const parse = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const toHex = (n: number): string => Math.round(n).toString(16).padStart(2, '0');

/** Équivalent de `color-mix(in srgb, a pct%, b)` : `pct` de `a` pour le reste de `b`. */
export function mix(a: string, b: string, pct: number): string {
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const p = pct / 100;
  return `#${toHex(ar * p + br * (1 - p))}${toHex(ag * p + bg * (1 - p))}${toHex(ab * p + bb * (1 - p))}`;
}

/** `#RRGGBB` + opacité 0-1 -> `rgba(...)`. */
export function alpha(hex: string, a: number): string {
  const [r, g, b] = parse(hex);
  return `rgba(${r},${g},${b},${a})`;
}
