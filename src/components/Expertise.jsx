import { Reveal, SectionHeader } from './ui.jsx';
import { markets, toolkit, competencies } from '../data/profile.js';

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
          <div className="toolkit">
            {toolkit.map((g) => (
              <div key={g.group} className="toolkit__col">
                <span className="mini-title">{g.group}</span>
                <ul>
                  {g.items.map(([abbr, full]) => (
                    <li key={abbr}>
                      <strong>{abbr}</strong>
                      <span>{full}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <h3 className="block-title">Core competencies</h3>
        <Reveal>
          <ul className="competencies">
            {competencies.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
