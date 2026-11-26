import { motion, useReducedMotion } from 'framer-motion';

const stack = { hidden: {}, applied: { transition: { staggerChildren: 0.14 } } };
const coat = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  applied: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

// A career shown as a paint cross-section: listed substrate-first, drawn bottom-up,
// each coat "applied" in turn when it scrolls into view.
// The list (not each layer) triggers the reveal: a fully clipped layer has an
// intersection ratio of 0 in Chrome, so it could never trigger itself.
export default function CoatingStack({ coats, range, className = '' }) {
  const reduce = useReducedMotion();
  if (!coats?.length) return null;

  return (
    <figure className={`coating ${className}`}>
      <motion.ol
        className="coating__stack"
        aria-label={`Career progression, ${range}`}
        variants={stack}
        initial={reduce ? false : 'hidden'}
        whileInView="applied"
        viewport={{ once: true, amount: 0.3 }}
      >
        {coats.map((c, i) => (
          <motion.li
            key={c.role}
            className={`coat ${c.light ? 'coat--light' : ''}`}
            style={{ background: c.color, '--i': i }}
            variants={coat}
          >
            <span className="coat__name">{c.coat}</span>
            <span className="coat__role">{c.role}</span>
            <span className="coat__note">{c.note}</span>
          </motion.li>
        ))}
      </motion.ol>
      <figcaption className="coating__caption">
        Each role builds on the one beneath — like a coating system · {range}
      </figcaption>
    </figure>
  );
}
