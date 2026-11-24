import { motion } from 'framer-motion';
import { Reveal, SectionHeader } from './ui.jsx';
import { service } from '../data/profile.js';

const START = 2004;
const END = new Date().getFullYear() + 1;
const SPAN = END - START;
const TICKS = [2004, 2010, 2015, 2020, 2025];

const pct = (year) => ((year - START) / SPAN) * 100;

export default function Service() {
  return (
    <section id="service" className="section section--dark">
      <div className="container">
        <SectionHeader
          dark
          num="06"
          label="Service"
          title="A life measured in giving."
          intro="From a cancer-fighting relay in Wayne County to girls’ education in rural Africa — more than two decades of service, still growing."
        />

        <Reveal>
          <div className="gantt" role="table" aria-label="Years of service by organization">
            <div className="gantt__axis" aria-hidden>
              {TICKS.map((y) => (
                <span key={y} style={{ left: `${pct(y)}%` }}>
                  {y}
                </span>
              ))}
              <span className="gantt__now" style={{ left: '100%' }}>
                Today
              </span>
            </div>
            {service.map((s, i) => (
              <div className="gantt__row" role="row" key={s.org + s.role}>
                <div className="gantt__label" role="cell">
                  <strong>{s.org}</strong>
                  <span>{s.role}</span>
                </div>
                <div className="gantt__lane" role="cell">
                  <motion.div
                    className="gantt__bar"
                    style={{ left: `${pct(s.since)}%`, background: s.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${100 - pct(s.since)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <span className="gantt__since" style={{ left: `${pct(s.since)}%` }}>
                    {s.since}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="causes">
          {service.map((s) => (
            <Reveal key={s.role + s.org}>
              <div className="cause">
                <span className="cause__tag" style={{ color: s.color }}>
                  {s.cause}
                </span>
                <h3>{s.org}</h3>
                <p>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
