import { Reveal, SectionHeader } from './ui.jsx';
import CoatingStack from './CoatingStack.jsx';
import { eras } from '../data/profile.js';

export default function Career() {
  return (
    <section id="career" className="section section--tint">
      <div className="container">
        <SectionHeader
          num="02"
          label="Career"
          title="Five decades, three chapters."
          intro="From the classroom to the laboratory to the boardroom — and back to teaching and service."
        />

        {eras.map((era, i) => (
          <div key={era.title} className="era">
            <aside className="era__aside">
              <div className="era__sticky">
                <span className="era__range">{era.range}</span>
                <h3 className="era__title">
                  <span className="era__idx">Chapter {i + 1}</span>
                  {era.title}
                </h3>
                <p className="era__summary">{era.summary}</p>
                <CoatingStack coats={era.coats} range={era.range} className="coating--aside" />
              </div>
            </aside>

            <div className="era__body">
              <p className="era__summary era__summary--inline">{era.summary}</p>
              <CoatingStack coats={era.coats} range={era.range} className="coating--inline" />
              <ul className="entries">
                {era.entries.map((e) => (
                  <Reveal as="li" key={e.year + e.title} className="entry">
                      <span className="entry__year">{e.year}</span>
                      <div>
                        <h4>{e.title}</h4>
                        <span className="entry__org">{e.org}</span>
                        {e.text && <p>{e.text}</p>}
                      </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
