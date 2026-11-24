import { ArrowUpRight, Atom, Layers, Lightbulb, GraduationCap } from 'lucide-react';
import { Reveal, SectionHeader } from './ui.jsx';
import { leadership, writings, honors } from '../data/profile.js';

const Icons = { Atom, Layers, Lightbulb, GraduationCap };

export default function Leadership() {
  return (
    <section id="leadership" className="section section--tint">
      <div className="container">
        <SectionHeader
          num="05"
          label="Leadership"
          title="Investing experience in people."
          intro="After building laboratories and teams for 35 years, Dr. Jain now advises scientists, students and organizations."
        />

        <div className="roles">
          {leadership.map((l, i) => {
            const Icon = Icons[l.icon];
            const Tag = l.link ? 'a' : 'div';
            const linkProps = l.link ? { href: l.link, target: '_blank', rel: 'noreferrer' } : {};
            return (
              <Reveal key={l.title} delay={i * 0.05}>
                <Tag className={`role ${l.link ? 'role--link' : ''}`} {...linkProps}>
                  <Icon size={22} strokeWidth={1.5} className="role__icon" />
                  <span className="role__org">{l.org}</span>
                  <h3>{l.title}</h3>
                  <p>{l.text}</p>
                  {l.link && <ArrowUpRight size={18} className="role__arrow" />}
                </Tag>
              </Reveal>
            );
          })}
        </div>

        <h3 className="block-title">Honors, appointments & distinctions</h3>
        <ul className="honors">
          {honors.map((h) => (
            <Reveal as="li" key={h.year + h.title} className="honor">
              <span className="honor__year">{h.year}</span>
              <div>
                <strong>{h.title}</strong>
                <span>{h.org}</span>
              </div>
            </Reveal>
          ))}
        </ul>

        <h3 className="block-title">Writing & announcements</h3>
        <ul className="posts">
          {writings.map((w) => (
            <Reveal as="li" key={w.title}>
                <a href={w.url} target="_blank" rel="noreferrer" className="post">
                  <span className="post__date">{w.date}</span>
                  <span className="post__kind">{w.kind}</span>
                  <span className="post__title">{w.title}</span>
                  <ArrowUpRight size={18} className="post__arrow" />
                </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
