import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { AuthorList, Reveal, SectionHeader } from './ui.jsx';
import { themes, works, speaking, venues } from '../data/research.js';
import { publicationsHref } from '../lib/route.js';
import { Videos } from './Media.jsx';
import { videos } from '../data/profile.js';

const FIRST = 1976;
const LAST = 2009;
const YEARS = Array.from({ length: LAST - FIRST + 1 }, (_, i) => FIRST + i);

export default function Research() {
  const [hover, setHover] = useState(null);

  const { byTheme, articles, countries, byYear } = useMemo(() => {
    const byTheme = Object.fromEntries(Object.keys(themes).map((k) => [k, 0]));
    const byYear = Object.fromEntries(YEARS.map((y) => [y, []]));
    works.forEach((w) => {
      byTheme[w.theme]++;
      if (w.year) byYear[w.year].push(w);
    });
    return {
      byTheme,
      byYear,
      articles: works.filter((w) => w.type === 'article').length,
      countries: new Set(venues.map((v) => v.country)).size,
    };
  }, []);

  const landmarks = works.filter((w) => w.landmark);
  const summary = Object.entries(themes)
    .map(([k, t]) => `${byTheme[k]} on ${t.label.toLowerCase()} (${t.years})`)
    .join('; ');

  return (
    <section id="research" className="section">
      <div className="container">
        <SectionHeader
          num="03"
          label="Research"
          title="Fifty years of published science."
          intro="From synthetic inorganic chemistry in Jaipur and Delhi, to enzyme-model chemistry in Virginia and Colorado, to analytical and surface science for the coatings industry."
        />

        <Reveal>
          <dl className="r-stats">
            <div><dt>{works.length}</dt><dd>Publications & presentations</dd></div>
            <div><dt>{articles}</dt><dd>Peer-reviewed journal articles</dd></div>
            <div><dt>{venues.length}</dt><dd>Cities presented in</dd></div>
            <div><dt>{countries}</dt><dd>Countries</dd></div>
          </dl>
        </Reveal>

        <Reveal>
          <figure className="output">
            <figcaption className="output__head">
              <span className="mini-title">Output by year, {FIRST}–{LAST}</span>
              <span className="output__hint" aria-hidden>
                {hover ? (
                  <>
                    <strong>{hover.year}</strong> · {hover.title}
                  </>
                ) : (
                  'Hover a dot to see the work · click to explore that theme'
                )}
              </span>
            </figcaption>
            <p className="sr-only">Works by research theme: {summary}.</p>
            <div className="output__plot" aria-hidden onMouseLeave={() => setHover(null)}>
              {YEARS.map((y) => (
                <div key={y} className="output__col">
                  <div className="output__stack">
                    {byYear[y].map((w) => (
                      <a
                        key={w.title}
                        href={publicationsHref(w.theme)}
                        tabIndex={-1}
                        className="output__dot"
                        style={{ background: themes[w.theme].color }}
                        onMouseEnter={() => setHover(w)}
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
              <a className="theme" style={{ '--c': t.color }} href={publicationsHref(k)}>
                <span className="theme__bar" />
                <span className="theme__meta">
                  <span>{t.years}</span>
                  <span>{byTheme[k]} works</span>
                </span>
                <h3>{t.label}</h3>
                <span className="theme__where">{t.where}</span>
                <p>{t.text}</p>
                <span className="theme__link">
                  View works <ArrowRight size={14} aria-hidden />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <h3 className="block-title">Landmark papers</h3>
        <ol className="cites">
          {landmarks.map((w) => (
            <Reveal as="li" key={w.doi} className="cite">
              <span className="cite__year">{w.year}</span>
              <div>
                <a href={`https://doi.org/${w.doi}`} target="_blank" rel="noreferrer" className="cite__title">
                  {w.title}
                </a>
                <p className="cite__authors">
                  <AuthorList authors={w.authors} />
                </p>
                <p className="cite__venue">
                  <em>{w.venue}</em>
                </p>
              </div>
              <ArrowUpRight size={18} className="cite__arrow" aria-hidden />
            </Reveal>
          ))}
        </ol>
        <a href={publicationsHref()} className="btn btn--solid see-all">
          See all {works.length} works <ArrowRight size={16} aria-hidden />
        </a>

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

        <Videos items={videos} />

        <Reveal>
          <div className="venues">
            <span className="mini-title">Research presented in</span>
            <p>
              {venues.map((v, i) => (
                <span key={v.city}>
                  {v.city}
                  {i < venues.length - 1 && <b aria-hidden> · </b>}
                </span>
              ))}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
