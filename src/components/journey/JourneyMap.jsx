import { useLayoutEffect, useRef } from 'react';
import { GEO } from '../../data/geo.js';
import { journey, researchTrips } from '../../data/journey.js';
import { flightAt } from '../../lib/journey.js';

const C = GEO.cities;
const PTS = journey.slice(0, 6).map((s) => C[s.code]);
const arc = (a, b, lift) => `M${a[0]} ${a[1]} Q${(a[0] + b[0]) / 2} ${Math.min(a[1], b[1]) - lift} ${b[0]} ${b[1]}`;
const ROUTE = [arc(PTS[0], PTS[1], 14), arc(PTS[1], PTS[2], 235), arc(PTS[2], PTS[3], 100), arc(PTS[3], PTS[4], 22), arc(PTS[4], PTS[5], 18)];
const LABEL = { JAI: [10, 20, 'start'], DEL: [10, -10, 'start'], CHO: [10, 16, 'start'], FNL: [0, -14, 'middle'], CHI: [-10, -10, 'end'], CLE: [10, -10, 'start'] };
// Airplane glyph: Material Icons "flight" (Apache License 2.0).
const PLANE = 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z';

const mix = (a, b, t) => {
  const hex = (s) => [1, 3, 5].map((j) => parseInt(s.slice(j, j + 2), 16));
  const A = hex(a);
  const B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
};

export default function JourneyMap({ s, current }) {
  const segRefs = useRef([]);
  const planeRef = useRef(null);

  // Route drawing and plane position need the rendered path geometry.
  useLayoutEffect(() => {
    const { seg, frac } = flightAt(s);
    segRefs.current.forEach((p, i) => {
      const L = p.getTotalLength();
      p.style.strokeDasharray = `${L}`;
      p.style.strokeDashoffset = `${i < seg ? 0 : i === seg ? L * (1 - frac) : L}`;
    });
    const path = segRefs.current[seg];
    const L = path.getTotalLength();
    const at = L * frac;
    const pt = path.getPointAtLength(at);
    const a = path.getPointAtLength(Math.max(0, at - 1.5));
    const b = path.getPointAtLength(Math.min(L, at + 1.5));
    const angle = s >= 5 ? -90 : (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    planeRef.current.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${angle + 90}) scale(1.45)`);
  }, [s]);

  const sky = mix('#fcf6ec', '#f1f4f8', Math.max(0, Math.min(1, (s - 1.1) / 1)));
  const [dx, dy] = PTS[1];

  return (
    <svg
      className="jy-map"
      viewBox="0 0 1000 470"
      role="img"
      aria-label="Map of Dr. Nemi Jain’s journey: Jaipur and New Delhi in India, then Charlottesville, Fort Collins, Chicago and Cleveland in the United States"
    >
      <defs>
        <radialGradient id="jy-fade" cx="55%" cy="58%" r="50%">
          <stop offset=".55" stopColor="#fff" />
          <stop offset=".95" stopColor="#000" />
        </radialGradient>
        <mask id="jy-india" maskUnits="userSpaceOnUse" x="600" y="0" width="400" height="470">
          <rect x="600" y="0" width="400" height="470" fill="url(#jy-fade)" />
        </mask>
        <filter id="jy-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#161a22" floodOpacity=".35" />
        </filter>
      </defs>
      <rect className="jy-sky" width="1000" height="470" fill={sky} />
      <path d={GEO.usGraticule} className="jy-grat jy-grat--us" />
      <path d={GEO.usOutline} className="jy-land jy-land--us" />
      <path d={GEO.usInner} className="jy-states" />
      <g mask="url(#jy-india)">
        <path d={GEO.indiaGraticule} className="jy-grat jy-grat--in" />
        <path d={GEO.indiaLand} className="jy-land jy-land--in" />
      </g>
      <text className="jy-country jy-country--us" x="64" y="448">
        United States <tspan className="jy-country__yrs">· 1983 —</tspan>
      </text>
      <text className="jy-country jy-country--in" x="975" y="448" textAnchor="end">
        India <tspan className="jy-country__yrs">· 1968 – 1983</tspan>
      </text>

      {s >= 1 && (
        <g className="jy-trips">
          {researchTrips.map(({ city, year, at: [x, y] }) => (
            <g key={city}>
              <path d={`M${dx} ${dy} Q${(dx + x) / 2 + 10} ${y - 22} ${x} ${y}`} />
              <circle cx={x} cy={y} r="3" />
              <text x={x - 7} y={y + 4} textAnchor="end">
                {city} ’{year.slice(2)}
              </text>
            </g>
          ))}
        </g>
      )}

      <g className="jy-route-ghost">
        {ROUTE.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className="jy-route">
        {ROUTE.map((d, i) => (
          <path key={d} d={d} ref={(el) => (segRefs.current[i] = el)} className={i === 1 ? 'is-ocean' : ''} />
        ))}
      </g>
      {s >= 1.1 && s < 2.6 && (
        <text className="jy-crossing" x={(PTS[1][0] + PTS[2][0]) / 2} y="52" textAnchor="middle">
          1983 · NATIONAL SCHOLAR · INDIA → AMERICA
        </text>
      )}

      {journey.slice(0, 6).map((stop, i) => {
        const [x, y] = PTS[i];
        const [lx, ly, anchor] = LABEL[stop.code];
        return (
          <g key={stop.code} className={`jy-pin ${i <= current ? 'is-reached' : ''}`}>
            <circle cx={x} cy={y} r={4.5 + stop.level * 0.8} className={`jy-pin__dot jy-pin__dot--${stop.country}`} />
            <text x={x + lx} y={y + ly} textAnchor={anchor} className="jy-pin__label">
              {stop.city}
            </text>
          </g>
        );
      })}

      <g ref={planeRef} className="jy-plane" filter="url(#jy-shadow)">
        <path d={PLANE} transform="translate(-11.5 -12)" />
      </g>
    </svg>
  );
}
