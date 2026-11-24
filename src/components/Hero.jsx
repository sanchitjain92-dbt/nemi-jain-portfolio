import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { Counter } from './ui.jsx';
import { profile, stats, markets } from '../data/profile.js';

const fade = (delay, reduce) => ({
  initial: reduce ? false : { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="hero">
      <div className="container hero__grid">
        <div className="hero__text">
          <motion.p className="kicker" {...fade(0.05, reduce)}>
            {profile.tagline.join('  ·  ')}
          </motion.p>
          <motion.h1 className="hero__name" {...fade(0.15, reduce)}>
            <span className="hero__dr">Dr.</span> Nemi Jain
          </motion.h1>
          <motion.p className="hero__statement" {...fade(0.25, reduce)}>
            {profile.statement}
          </motion.p>
          <motion.div className="hero__actions" {...fade(0.35, reduce)}>
            <a href="#career" className="btn btn--solid">
              View career <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn btn--link">
              Get in touch
            </a>
          </motion.div>
        </div>

        <motion.figure className="portrait" {...fade(0.3, reduce)}>
          <div className="portrait__card">
            <img src={profile.photo} alt="Portrait of Dr. Nemi Jain" />
            <div className="portrait__swatches" aria-hidden>
              {markets.map((m) => (
                <span key={m.code} style={{ background: m.color }} />
              ))}
            </div>
            <figcaption>
              <strong>Dr. Nemi Jain</strong>
              <span>{profile.currentTitle}</span>
              <span className="portrait__loc">
                <MapPin size={13} /> {profile.location}
              </span>
            </figcaption>
          </div>
        </motion.figure>
      </div>

      <div className="container">
        <motion.dl className="stats" {...fade(0.45, reduce)}>
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <dt className="stat__value">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </dt>
              <dd className="stat__label">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
