import { useEffect, useRef, useState } from 'react';
import { journey, journeyEras, LEVELS } from '../../data/journey.js';
import PaintStripe from './PaintStripe.jsx';

const Y0 = 1968;
const Y1 = 2027;
const X = (y) => ((y - Y0) / (Y1 - Y0)) * 100;
const pct = (level) => 4 + level * (92 / (LEVELS.length - 1));

export function Altimeter({ level }) {
  const now = Math.round(level);
  return (
    <aside className="jy-alt" aria-hidden="true">
      <div className="jy-k">Altitude · role</div>
      <div className="jy-alt__track">
        <div className="jy-alt__fill" style={{ height: `calc(${pct(level)}% - 6px)` }} />
        {LEVELS.map((l, i) => (
          <div key={l} className={`jy-alt__lv ${i <= level + 0.01 ? 'is-reached' : ''} ${i === now ? 'is-now' : ''}`} style={{ bottom: `${pct(i)}%` }}>
            {l}
          </div>
        ))}
        <div className="jy-alt__dot" style={{ bottom: `${pct(level)}%` }} />
      </div>
    </aside>
  );
}

// Ruler dots are clickable only on wide screens; on phones the stop tabs below do that job.
function useWide() {
  const query = '(min-width: 901px)';
  const [wide, setWide] = useState(() => typeof window === 'undefined' || window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setWide(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return wide;
}

export function Ruler({ year, current, onSelect }) {
  const wide = useWide();
  const bands = journeyEras.map((e) => (
    <i key={e.label} style={{ left: `${X(e.from)}%`, width: `${X(e.to) - X(e.from)}%`, background: e.color }} />
  ));
  return (
    <div className="jy-ruler">
      <div className="jy-k jy-ruler__k">
        Five
        <br />
        decades
      </div>
      <div className="jy-ruler__body">
        <div className="jy-ruler__eras" aria-hidden="true">
          {journeyEras.map((e, i) => {
            const last = i === journeyEras.length - 1;
            return (
              <span key={e.label} style={{ left: `${last ? X(e.to) - 1.5 : (X(e.from) + X(e.to)) / 2}%` }} className={last ? 'is-end' : ''}>
                {e.label}
              </span>
            );
          })}
        </div>
        <div className="jy-ruler__band" aria-hidden="true">
          <div className="jy-ruler__base">{bands}</div>
          <div className="jy-ruler__lit" style={{ clipPath: `inset(0 ${100 - X(year)}% 0 0)` }}>
            {bands}
          </div>
        </div>
        <div className="jy-ruler__marks">
          {journey.map((stop, i) => {
            const props = {
              className: `jy-mark ${i === current ? 'is-now' : ''} ${i < current ? 'is-done' : ''}`,
              style: { left: `${X(stop.start)}%` },
            };
            const inner = (
              <>
                <i />
                <span>{stop.mark}</span>
              </>
            );
            return wide ? (
              <button key={stop.code} type="button" {...props} onClick={() => onSelect(i)} aria-label={`${stop.city}, ${stop.years}`}>
                {inner}
              </button>
            ) : (
              <span key={stop.code} {...props} aria-hidden="true">
                {inner}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function StopTabs({ current, onSelect }) {
  const ref = useRef(null);
  // Keep the current stop visible when the tab strip scrolls sideways (phones).
  useEffect(() => {
    const nav = ref.current;
    const tab = nav?.children[current];
    if (tab && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: tab.offsetLeft - 20, behavior: 'smooth' });
  }, [current]);
  return (
    <nav className="jy-tabs" aria-label="Journey stops" ref={ref}>
      {journey.map((stop, i) => (
        <button
          key={stop.code}
          type="button"
          className={`jy-tab jy-tab--${stop.country} ${i === current ? 'is-now' : ''} ${i < current ? 'is-done' : ''}`}
          aria-current={i === current ? 'step' : undefined}
          onClick={() => onSelect(i)}
        >
          <span className="jy-tab__n">0{i + 1}</span>
          <span className="jy-tab__city">{stop.city}</span>
          <span className="jy-tab__yrs">{stop.years}</span>
        </button>
      ))}
    </nav>
  );
}

export function Chapter({ index, onSelect, invite, painted, animatePaint }) {
  const stop = journey[index];
  const prev = journey[index - 1];
  const next = journey[index + 1];
  return (
    <div className={`jy-chapter ${painted ? 'is-painted' : ''} ${animatePaint ? 'is-painting' : ''}`} key={index}>
      {painted && <PaintStripe />}
      <div className="jy-numeral" aria-hidden="true">
        0{index + 1}
        <small>of 0{journey.length}</small>
      </div>
      <div className="jy-chapter__lead">
        <div className="jy-chapter__yrs">{stop.years}</div>
        <div className={`jy-chapter__place jy-chapter__place--${stop.country}`}>
          {stop.city} · {stop.region}
        </div>
        <h3>{stop.title}</h3>
        <p>{stop.summary}</p>
      </div>
      <ul className="jy-chapter__items">
        {stop.items.map(([yr, what, where]) => (
          <li key={what}>
            <span className="jy-chapter__yr">{yr}</span>
            <div>
              <h4>{what}</h4>
              <span>{where}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="jy-chapter__nav">
        <button type="button" className="jy-prev" disabled={!prev} onClick={() => onSelect(index - 1)}>
          ← {prev?.city}
        </button>
        <span className="jy-keys">
          or use <kbd>←</kbd>
          <kbd>→</kbd>
        </span>
        <button type="button" className={`jy-next ${invite ? 'is-inviting' : ''}`} onClick={() => onSelect(next ? index + 1 : 0)}>
          <span>
            <span className="jy-next__k">{next ? `Next stop · ${index + 2} of ${journey.length}` : 'Journey complete'}</span>
            <span className="jy-next__t">{next ? `${next.city}, ${next.years}` : 'Start again from Jaipur'}</span>
          </span>
          <span className="jy-next__arrow" aria-hidden="true">
            {next ? '→' : '↺'}
          </span>
        </button>
      </div>
    </div>
  );
}
