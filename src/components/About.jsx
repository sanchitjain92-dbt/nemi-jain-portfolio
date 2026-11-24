import { Reveal, SectionHeader } from './ui.jsx';
import { about, education } from '../data/profile.js';

export default function About() {
  return (
    <section id="profile" className="section">
      <div className="container">
        <SectionHeader num="01" label="Profile" title="Where rigorous science meets a life of service." />

        <div className="split">
          <div />
          <div>
            <Reveal>
              <p className="lead">{about.lead}</p>
            </Reveal>
            <div className="about__cols">
              <Reveal className="about__body">
                {about.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </Reveal>
              <Reveal delay={0.1} className="edu">
                <h3 className="mini-title">Education & Credentials</h3>
                <ul>
                  {education.map((e) => (
                    <li key={e.title}>
                      <span className="edu__year">{e.year}</span>
                      <div>
                        <strong>{e.title}</strong>
                        <span>{e.org}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>

        <Reveal>
          <div className="focus">
            {about.focus.map((f, i) => (
              <div key={f.title} className="focus__item">
                <span className="focus__num">0{i + 1}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
