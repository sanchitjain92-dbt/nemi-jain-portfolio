import { Reveal, SectionHeader } from './ui.jsx';
import { markets, toolkit } from '../data/profile.js';

export default function Expertise() {
  return (
    <section id="expertise" className="section">
      <div className="container">
        <SectionHeader
          num="04"
          label="Expertise"
          title="Coatings science, end to end."
          intro="Coatings protect and beautify nearly everything around us. Dr. Jain’s work spanned the markets that demand the most from them — and the analytical science that makes them better."
        />

        <h3 className="block-title">Markets served</h3>
        <div className="chips">
          {markets.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.05}>
              <article className="chip">
                <div className="chip__color" style={{ background: m.color }}>
                  <span>{m.code}</span>
                  <span>{m.chip}</span>
                </div>
                <div className="chip__label">
                  <h4>{m.name}</h4>
                  <p>{m.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <h3 className="block-title">Analytical toolkit</h3>
        <Reveal>
          <dl className="toolkit">
            {toolkit.map((g) => (
              <div key={g.group} className="toolkit__col">
                <dt className="mini-title">{g.group}</dt>
                <dd>
                  {g.items.map(([abbr, full], i) => (
                    <span key={abbr}>
                      <abbr title={full}>{abbr}</abbr>
                      {i < g.items.length - 1 && <b aria-hidden> · </b>}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
