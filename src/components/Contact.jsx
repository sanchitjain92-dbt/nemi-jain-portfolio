import { ArrowUpRight } from 'lucide-react';
import { profile } from '../data/profile.js';

export default function Contact() {
  const links = [
    { href: profile.links.linkedin, label: 'LinkedIn', sub: 'Connect and follow' },
    { href: profile.links.acs, label: 'ACS Career Consultant', sub: 'Request a career consultation' },
    { href: profile.links.ccn, label: 'Chemical Consultants Network', sub: 'R&D consulting profile' },
    { href: profile.links.orcid, label: 'ORCID', sub: 'Research record · 0000-0002-4617-4183' },
  ];

  return (
    <footer id="contact" className="contact">
      <div className="container">
        <div className="contact__grid">
          <div>
            <span className="kicker kicker--light">07 · Contact</span>
            <h2 className="contact__title">Let’s connect.</h2>
            <p className="contact__sub">
              For career guidance in chemistry, coatings and R&D consulting, mentoring, or collaboration on a cause.
            </p>
          </div>
          <ul className="contact__links">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  <div>
                    <strong>{l.label}</strong>
                    <span>{l.sub}</span>
                  </div>
                  <ArrowUpRight size={22} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__bar">
          <span>© {new Date().getFullYear()} Dr. Nemi Jain</span>
          <span>{profile.location}</span>
        </div>
      </div>
    </footer>
  );
}
