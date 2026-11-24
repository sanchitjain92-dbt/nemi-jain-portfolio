import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, animate } from 'framer-motion';

// Gentle fade-up; triggers as soon as any part of the element enters the viewport.
export function Reveal({ children, delay = 0, className, as = 'div' }) {
  const Tag = motion[as];
  const reduce = useReducedMotion();
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

export function SectionHeader({ num, label, title, intro, dark = false }) {
  return (
    <header className={`sh ${dark ? 'sh--dark' : ''}`}>
      <div className="sh__label">
        <span className="sh__num">{num}</span>
        <span>{label}</span>
      </div>
      <div>
        <h2 className="sh__title">{title}</h2>
        {intro && <p className="sh__intro">{intro}</p>}
      </div>
    </header>
  );
}

export function Counter({ value, prefix = '', suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(value);

  useEffect(() => {
    if (reduce) {
      setN(value);
      return;
    }
    if (!inView) return;
    const c = animate(0, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value, reduce]);

  return (
    <span ref={ref}>
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

export function AuthorList({ authors, highlight = 'N. C. Jain' }) {
  const names = authors.split(', ');
  return (
    <>
      {names.map((a, i) => (
        <span key={a}>
          {a === highlight ? <strong>{a}</strong> : a}
          {i < names.length - 1 && ', '}
        </span>
      ))}
    </>
  );
}
