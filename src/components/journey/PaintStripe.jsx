// A deep-blue stripe rolled down the chapter margin, with drips gathering at the bottom.
// Purely decorative; the finished state is the CSS default, so reduced motion and no-JS show it painted.
const DRIPS = [
  { x: '13%', w: '10%', h: 58, delay: 1.1, dur: 1.5 },
  { x: '36%', w: '13%', h: 86, delay: 1.2, dur: 1.9 },
  { x: '62%', w: '9%', h: 44, delay: 1.3, dur: 1.4 },
  { x: '82%', w: '11%', h: 70, delay: 1.4, dur: 1.7 },
];

export default function PaintStripe() {
  return (
    <div className="jy-paint" aria-hidden="true">
      <svg width="0" height="0" className="jy-paint__defs" focusable="false">
        <filter id="jy-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>
      <div className="jy-paint__goo">
        <div className="jy-paint__stripe" />
        {DRIPS.map((d) => (
          <i
            key={d.x}
            className="jy-paint__drip"
            style={{ '--x': d.x, '--w': d.w, '--h': `${d.h}px`, '--delay': `${d.delay}s`, '--dur': `${d.dur}s` }}
          />
        ))}
      </div>
      <div className="jy-paint__track">
        <svg className="jy-paint__roller" viewBox="0 0 150 110" focusable="false">
          <rect x="62" y="0" width="14" height="40" rx="6" fill="#161a22" />
          <path d="M69 40 V56 H142 V95 H126" fill="none" stroke="#2b2f36" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
          <rect x="0" y="80" width="126" height="30" rx="10" fill="#3b5878" />
          <rect x="6" y="84" width="114" height="6" rx="3" fill="#fff" fillOpacity=".22" />
        </svg>
      </div>
    </div>
  );
}
