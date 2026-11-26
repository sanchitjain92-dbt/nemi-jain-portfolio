import { describe, it, expect } from 'vitest';
import { flightAt, stopAt, levelAt, rulerYearAt, distanceAt, cumulativeKm, haversineKm } from './journey.js';

const STOPS = 7; // 6 places + the advisory chapter (no flight)

describe('journey progress', () => {
  it('splits progress into a route segment and fraction, parking at the last city', () => {
    expect(flightAt(0)).toEqual({ seg: 0, frac: 0 });
    expect(flightAt(1.5)).toEqual({ seg: 1, frac: 0.5 });
    expect(flightAt(5)).toEqual({ seg: 4, frac: 1 });
    expect(flightAt(6)).toEqual({ seg: 4, frac: 1 });
  });

  it('reports the current stop, clamped to the range', () => {
    expect(stopAt(0, STOPS)).toBe(0);
    expect(stopAt(2.99, STOPS)).toBe(2);
    expect(stopAt(3, STOPS)).toBe(3);
    expect(stopAt(9, STOPS)).toBe(6);
  });

  it('interpolates role level and ruler year between stops', () => {
    const levels = [0, 1, 2, 2, 3, 6, 7];
    expect(levelAt(4.5, levels)).toBeCloseTo(4.5);
    expect(levelAt(6, levels)).toBe(7);
    const ends = [1976, 1983, 1985, 1989, 1990.5, 2025, 2027];
    expect(rulerYearAt(5, ends)).toBe(2025);
    expect(rulerYearAt(0.5, ends)).toBeCloseTo(1979.5);
  });

  it('measures great-circle distance and accumulates it along the route', () => {
    const delhi = [77.21, 28.61];
    const charlottesville = [-78.48, 38.03];
    expect(haversineKm(delhi, charlottesville)).toBeGreaterThan(12000);
    expect(haversineKm(delhi, charlottesville)).toBeLessThan(13000);
    const km = cumulativeKm([[0, 0], [0, 1], [0, 2]]);
    expect(km[2]).toBeCloseTo(2 * km[1]);
    expect(distanceAt(0.5, km)).toBeCloseTo(km[1] / 2);
    expect(distanceAt(9, km)).toBe(km[2]);
  });
});
