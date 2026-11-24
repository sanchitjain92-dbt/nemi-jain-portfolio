import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import CopyButton from './CopyButton.jsx';
import { AuthorList } from './ui.jsx';
import { orcid, themes, works, typeLabels } from '../data/research.js';
import { formatCitation } from '../lib/citation.js';

const validTheme = (t) => (t && themes[t] ? t : 'all');

export default function Publications({ theme: requestedTheme }) {
  const [theme, setTheme] = useState(validTheme(requestedTheme));
  const [type, setType] = useState('all');

  useEffect(() => setTheme(validTheme(requestedTheme)), [requestedTheme]);

  useEffect(() => {
    const previous = document.title;
    document.title = 'Publications — Dr. Nemi Jain';
    return () => {
      document.title = previous;
    };
  }, []);

  const filtered = works.filter((w) => (theme === 'all' || w.theme === theme) && (type === 'all' || w.type === type));
  const cited = works.filter((w) => w.doi);

  return (
    <div className="pubs">
      <div className="container">
        <a href="#research" className="pubs__back">
          <ArrowLeft size={16} aria-hidden /> Back to the story
        </a>
        <header className="pubs__head">
          <span className="kicker">Publications</span>
          <h1 id="pubs-title" className="pubs__title" tabIndex={-1}>Research record, 1976–2009</h1>
          <p className="sh__intro">
            {works.length} journal articles, conference papers, presentations and posters — from coordination chemistry to
            coatings science.
          </p>
          <a className="orcid-link" href={orcid.url} target="_blank" rel="noreferrer">
            <span className="orcid-badge">iD</span> ORCID {orcid.id}
          </a>
        </header>

        <section aria-labelledby="cited-title">
          <h2 id="cited-title" className="block-title">Journal articles with DOI</h2>
          <ol className="cites">
            {cited.map((w) => (
              <li key={w.doi} className="cite">
                <span className="cite__year">{w.year}</span>
                <div>
                  <a href={`https://doi.org/${w.doi}`} target="_blank" rel="noreferrer" className="cite__title">
                    {w.title}
                  </a>
                  <p className="cite__authors">
                    <AuthorList authors={w.authors} />
                  </p>
                  <p className="cite__venue">
                    <em>{w.venue}</em> · doi:{w.doi}
                  </p>
                  <CopyButton text={formatCitation(w)} ariaLabel={`Copy citation: ${w.title}`} />
                </div>
                <ArrowUpRight size={18} className="cite__arrow" aria-hidden />
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="all-title">
          <h2 id="all-title" className="block-title">All works</h2>
          <div className="filters-row">
            <div className="tabs" role="group" aria-label="Filter by type">
              {['all', ...Object.keys(typeLabels)].map((t) => (
                <button key={t} aria-pressed={type === t} className={type === t ? 'is-active' : ''} onClick={() => setType(t)}>
                  {t === 'all' ? 'All types' : typeLabels[t]}
                </button>
              ))}
            </div>
            <div className="tabs" role="group" aria-label="Filter by research theme">
              {['all', ...Object.keys(themes)].map((k) => (
                <button key={k} aria-pressed={theme === k} className={theme === k ? 'is-active' : ''} onClick={() => setTheme(k)}>
                  {k !== 'all' && <i className="tabs__dot" style={{ background: themes[k].color }} />}
                  {k === 'all' ? 'All themes' : themes[k].short}
                </button>
              ))}
            </div>
          </div>
          <p className="biblio__count" aria-live="polite">
            Showing {filtered.length} of {works.length}
          </p>
          <ul className="works">
            {filtered.map((w) => (
              <li key={w.title} className="work">
                <span className="work__year">{w.year ?? 'n.d.'}</span>
                <span className="work__dot" style={{ background: themes[w.theme].color }} title={themes[w.theme].label} />
                <div className="work__body">
                  {w.doi ? (
                    <a href={`https://doi.org/${w.doi}`} target="_blank" rel="noreferrer" className="work__title">
                      {w.title} <ArrowUpRight size={14} aria-hidden />
                    </a>
                  ) : (
                    <span className="work__title">{w.title}</span>
                  )}
                  <span className="work__venue">{w.venue}</span>
                </div>
                <span className="work__type">{typeLabels[w.type]}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
