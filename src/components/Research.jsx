import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { Reveal, SectionHeader } from './ui.jsx';
import { orcid, themes, works, typeLabels, speaking, venues } from '../data/research.js';

const FIRST = 1976;
const LAST = 2009;
const YEARS = Array.from({ length: LAST - FIRST + 1 }, (_, i) => FIRST + i);
const PREVIEW = 8;

export default function Research() {
  const [theme, setTheme] = useState('all');
  const [type, setType] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState(null);

  const counts = useMemo(() => {
    const byTheme = Object.fromEntries(Object.keys(themes).map((k) => [k, 0]));
    works.forEach((w) => byTheme[w.theme]++);
    return {
      byTheme,
      articles: works.filter((w) => w.type === 'article').length,
      countries: new Set(venues.map((v) => v.country)).size,
    };
  }, []);

  const byYear = useMemo(() => {
    const m = Object.fromEntries(YEARS.map((y) => [y, []]));
    works.forEach((w) => w.year && m[w.year].push(w));
    return m;
  }, []);

  const filtered = works.filter((w) => (theme === 'all' || w.theme === theme) && (type === 'all' || w.type === type));
  const visible = expanded ? filtered : filtered.slice(0, PREVIEW);
  const selected = works.filter((w) => w.doi);

  const pickTheme = (k) => {
    setTheme((t) => (t === k ? 'all' : k));
    setExpanded(false);
  };

  return (
    <section id="research" className="section">
      <div className="container">
        <SectionHeader
          num="03"
          label="Research"
          title="Fifty years of published science."
          intro="From synthetic inorganic chemistry in Jaipur and Delhi, to enzyme-model chemistry in Virginia and Colorado, to analytical and surface science for the coatings industry — a research record of journal articles, international conference papers, and invited talks."
        />

        <Reveal>
          <dl className="r-stats">
            <div>
              <dt>{works.length}</dt>
              <dd>Publications & presentations</dd>
            </div>
            <div>
              <dt>{counts.articles}</dt>
              <dd>Peer-reviewed journal articles</dd>
            </div>
            <div>
              <dt>{venues.length}</dt>
              <dd>Cities presented in</dd>
            </div>
            <div>
              <dt>{counts.countries}</dt>
              <dd>Countries</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal>
          <figure className="output">
            <figcaption className="output__head">
              <span className="mini-title">Output by year, {FIRST}–{LAST}</span>
              <span className="output__hint">
                {hover ? (
                  <>
                    <strong>{hover.year}</strong> · {hover.title}
                  </>
                ) : (
                  'Hover a dot to see the work · click a theme to filter the bibliography'
                )}
              </span>
            </figcaption>
            <div className="output__plot" onMouseLeave={() => setHover(null)}>
              {YEARS.map((y) => (
                <div key={y} className="output__col">
                  <div className="output__stack">
                    {byYear[y].map((w) => (
                      <button
                        key={w.title}
                        className={`output__dot ${theme !== 'all' && theme !== w.theme ? 'is-dim' : ''}`}
                        style={{ background: themes[w.theme].color }}
                        onMouseEnter={() => setHover(w)}
                        onFocus={() => setHover(w)}
                        onClick={() => pickTheme(w.theme)}
                        aria-label={`${y}: ${w.title}`}
                      />
                    ))}
                  </div>
                  <span className={`output__year ${y % 5 === 0 || y === FIRST || y === LAST ? 'is-label' : ''}`}>{y}</span>
                </div>
              ))}
            </div>
          </figure>
        </Reveal>

        <div className="themes">
          {Object.entries(themes).map(([k, t], i) => (
            <Reveal key={k} delay={i * 0.05}>
              <button
                className={`theme ${theme === k ? 'is-active' : ''} ${theme !== 'all' && theme !== k ? 'is-dim' : ''}`}
                style={{ '--c': t.color }}
                onClick={() => pickTheme(k)}
                aria-pressed={theme === k}
              >
                <span className="theme__bar" />
                <span className="theme__meta">
                  <span>{t.years}</span>
                  <span>
                    {counts.byTheme[k]} works
                  </span>
                </span>
                <h3>{t.label}</h3>
                <span className="theme__where">{t.where}</span>
                <p>{t.text}</p>
              </button>
            </Reveal>
          ))}
        </div>

        <h3 className="block-title">Selected journal publications</h3>
        <ol className="cites">
          {selected.map((w) => (
            <Reveal as="li" key={w.doi} className="cite">
              <span className="cite__year">{w.year}</span>
              <div>
                <a href={`https://doi.org/${w.doi}`} target="_blank" rel="noreferrer" className="cite__title">
                  {w.title}
                </a>
                <p className="cite__authors">{highlightAuthor(w.authors)}</p>
                <p className="cite__venue">
                  <em>{w.venue}</em> · doi:{w.doi}
                </p>
              </div>
              <ArrowUpRight size={18} className="cite__arrow" />
            </Reveal>
          ))}
        </ol>

        <div className="biblio">
          <div className="biblio__head">
            <h3 className="block-title block-title--flush">Complete bibliography</h3>
            <a className="orcid-link" href={orcid.url} target="_blank" rel="noreferrer">
              <span className="orcid-badge">iD</span> ORCID {orcid.id}
            </a>
          </div>

          <div className="tabs" role="tablist" aria-label="Filter by type">
            {['all', ...Object.keys(typeLabels)].map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={type === t}
                className={type === t ? 'is-active' : ''}
                onClick={() => {
                  setType(t);
                  setExpanded(false);
                }}
              >
                {t === 'all' ? 'All types' : typeLabels[t]}
              </button>
            ))}
            {theme !== 'all' && (
              <button className="tabs__clear" onClick={() => setTheme('all')}>
                <i style={{ background: themes[theme].color }} /> {themes[theme].short} ✕
              </button>
            )}
          </div>

          <p className="biblio__count">
            Showing {visible.length} of {filtered.length}
          </p>

          <ul className="works">
            <AnimatePresence initial={false}>
              {visible.map((w) => (
                <motion.li
                  key={w.title}
                  layout="position"
                  className="work"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="work__year">{w.year ?? 'n.d.'}</span>
                  <span className="work__dot" style={{ background: themes[w.theme].color }} title={themes[w.theme].label} />
                  <div className="work__body">
                    {w.doi ? (
                      <a href={`https://doi.org/${w.doi}`} target="_blank" rel="noreferrer" className="work__title">
                        {w.title} <ArrowUpRight size={14} />
                      </a>
                    ) : (
                      <span className="work__title">{w.title}</span>
                    )}
                    <span className="work__venue">{w.venue}</span>
                  </div>
                  <span className="work__type">{typeLabels[w.type]}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {filtered.length > PREVIEW && (
            <button className="more" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded}>
              {expanded ? 'Show fewer' : `Show all ${filtered.length}`}
              <ChevronDown size={16} style={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
            </button>
          )}
        </div>

        <h3 className="block-title">Speaking, teaching & chairing</h3>
        <ul className="talks">
          {speaking.map((s) => (
            <Reveal as="li" key={s.year + s.title} className="talk">
              <span className="talk__year">{s.year}</span>
              <span className="talk__role">{s.role}</span>
              <div>
                <h4>{s.title}</h4>
                <span>{s.venue}</span>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <div className="venues">
            <span className="mini-title">Research presented in</span>
            <p>
              {venues.map((v, i) => (
                <span key={v.city}>
                  {v.city}
                  {i < venues.length - 1 && <b> · </b>}
                </span>
              ))}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function highlightAuthor(authors) {
  return authors.split(', ').map((a, i, arr) => (
    <span key={a}>
      {a === 'N. C. Jain' ? <strong>{a}</strong> : a}
      {i < arr.length - 1 && ', '}
    </span>
  ));
}
