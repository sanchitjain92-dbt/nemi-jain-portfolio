import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { publicationsHref } from '../lib/route.js';

const LINKS = [
  { id: 'profile', label: 'Story' },
  { id: 'career', label: 'Career' },
  { id: 'research', label: 'Research' },
  { id: 'service', label: 'Service' },
  { id: 'contact', label: 'Connect' },
];

export default function Nav({ page }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      setScrolled(window.scrollY > 24);
      if (page !== 'home') {
        setActive('');
        return;
      }
      const probe = window.scrollY + window.innerHeight * 0.35;
      let current = '';
      for (const { id } of LINKS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probe) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [page]);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${scrolled || page !== 'home' ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__brand" onClick={close}>
          Nemi Jain<span>, Ph.D.</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? 'is-active' : ''}
              aria-current={active === l.id ? 'location' : undefined}
              onClick={close}
            >
              {l.label}
            </a>
          ))}
          <a
            href={publicationsHref()}
            className={`nav__pub ${page === 'publications' ? 'is-active' : ''}`}
            aria-current={page === 'publications' ? 'page' : undefined}
            onClick={close}
          >
            Publications
          </a>
        </nav>
        <button
          className="nav__toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className="nav__progress" aria-hidden>
        <span ref={barRef} />
      </div>
    </header>
  );
}
