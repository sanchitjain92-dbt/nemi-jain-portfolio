// Pure helpers for the journey: progress `s` runs from 0 (first stop) to stops-1 (last).
// Stops 0–5 are places on the route (5 flight segments); the final stop is a chapter without a flight.

const SEGMENTS = 5;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function flightAt(s) {
  if (s >= SEGMENTS) return { seg: SEGMENTS - 1, frac: 1 };
  const seg = Math.floor(clamp(s, 0, SEGMENTS));
  return { seg, frac: s - seg };
}

export function stopAt(s, count) {
  return clamp(Math.floor(s + 1e-6), 0, count - 1);
}

function interpolate(s, values) {
  const last = values.length - 1;
  if (s >= last) return values[last];
  const i = Math.floor(clamp(s, 0, last));
  return values[i] + (values[i + 1] - values[i]) * (s - i);
}

export const levelAt = interpolate;
export const rulerYearAt = interpolate;

export function haversineKm([lon1, lat1], [lon2, lat2]) {
  const rad = (d) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

export function cumulativeKm(points) {
  return points.reduce((acc, p, i) => [...acc, i === 0 ? 0 : acc[i - 1] + haversineKm(points[i - 1], p)], []);
}

export const distanceAt = interpolate;

// Sherwin-Williams chapters get a rolled paint stripe; it animates only when arriving from a non-Sherwin chapter.
export function paintState(prev, next, stops) {
  const painted = Boolean(stops[next]?.sherwin);
  return { painted, animate: painted && !stops[prev]?.sherwin };
}
