import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import { SectionHeader } from '../ui.jsx';
import TopoLines from '../TopoLines.jsx';
import JourneyMap from './JourneyMap.jsx';
import { Altimeter, Chapter, Ruler, StopTabs } from './parts.jsx';
import { journey, LEVELS } from '../../data/journey.js';
import { cumulativeKm, distanceAt, levelAt, rulerYearAt, stopAt } from '../../lib/journey.js';

const LAST = journey.length - 1;
const KM = cumulativeKm(journey.slice(0, 6).map((s) => s.coords));
const LEVEL_BY_STOP = journey.map((s) => s.level);
const END_BY_STOP = journey.map((s) => s.end);
const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);

export default function Journey() {
  const reduce = useReducedMotion();
  const [s, setS] = useState(0);
  const [touched, setTouched] = useState(false);
  const sRef = useRef(0);
  const raf = useRef(0);

  const set = (v) => {
    sRef.current = v;
    setS(v);
  };

  const flyTo = useCallback(
    (target, ms) => {
      cancelAnimationFrame(raf.current);
      const to = Math.max(0, Math.min(LAST, target));
      if (reduce) return set(to);
      const from = sRef.current;
      const t0 = performance.now();
      const dur = ms ?? Math.max(600, Math.abs(to - from) * 1400);
      const step = (now) => {
        const u = Math.min(1, (now - t0) / dur);
        set(from + (to - from) * ease(u));
        if (u < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    },
    [reduce]
  );

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const current = stopAt(s, journey.length);
  const level = levelAt(s, LEVEL_BY_STOP);
  const go = (i) => {
    setTouched(true);
    flyTo(i);
  };
  const play = () => {
    setTouched(true);
    set(0);
    flyTo(LAST, 10500);
  };
  // Arrow keys only while focus is inside the journey, so page scrolling is never hijacked.
  const onKeyDown = (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' && current < LAST) {
      e.preventDefault();
      go(current + 1);
    } else if (e.key === 'ArrowLeft' && current > 0) {
      e.preventDefault();
      go(current - 1);
    }
  };
  const km = Math.round(distanceAt(Math.min(s, 5), KM));

  return (
    <section id="career" className="section section--tint journey has-topo">
      <TopoLines variant="journey" />
      <div className="container">
        <SectionHeader
          num="02"
          label="Career"
          title="From Rajasthan to Ohio."
          intro="Five decades, two countries, one steady climb — from a chemistry student in Jaipur to a senior manager in Cleveland, and onward to advising the next generation."
        />

        <div className="jy" onKeyDown={onKeyDown}>
          <div className="jy-top">
            <Altimeter level={level} />
            <div className="jy-mapcol">
              <div className="jy-mapwrap">
                <JourneyMap s={s} current={current} />
                <div className="jy-role" aria-hidden="true">
                  <span>Role</span> {LEVELS[Math.round(level)]}
                </div>
              </div>
              <div className="jy-bar">
                <button type="button" className="jy-play" onClick={play}>
                  <Play size={14} aria-hidden="true" /> Play the journey
                </button>
                <input
                  type="range"
                  className="jy-scrub"
                  min="0"
                  max={LAST * 100}
                  value={Math.round(s * 100)}
                  aria-label="Journey progress"
                  aria-valuetext={`${journey[current].city}, ${journey[current].years}`}
                  onChange={(e) => {
                    cancelAnimationFrame(raf.current);
                    setTouched(true);
                    set(e.target.value / 100);
                  }}
                />
                <div className="jy-log">
                  <span>
                    <strong>{km.toLocaleString()}</strong> km flown
                  </span>
                  <span>
                    <strong>{current >= 2 ? 2 : 1}</strong> {current >= 2 ? 'countries' : 'country'}
                  </span>
                  <span>
                    <strong>{Math.min(6, current + 1)}</strong> {current ? 'cities' : 'city'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Ruler year={s >= LAST ? 2027 : rulerYearAt(s, END_BY_STOP)} current={current} onSelect={go} />
          <StopTabs current={current} onSelect={go} />
          <section aria-live="polite" aria-label="Journey chapter">
            <Chapter index={current} onSelect={go} invite={!touched} />
          </section>
        </div>

        <ol className="jy-print">
          {journey.map((stop) => (
            <li key={stop.code}>
              <h3>
                {stop.years} · {stop.city}, {stop.region} — {stop.title}
              </h3>
              <p>{stop.summary}</p>
              <ul>
                {stop.items.map(([yr, what, where]) => (
                  <li key={what}>
                    {yr && `${yr} — `}
                    {what}, {where}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
