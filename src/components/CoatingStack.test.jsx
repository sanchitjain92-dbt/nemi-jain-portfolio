import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import CoatingStack from './CoatingStack.jsx';
import { eras } from '../data/profile.js';

const sherwin = eras.find((e) => e.coats);

describe('CoatingStack', () => {
  it('renders nothing when there are no coats', () => {
    expect(renderToString(<CoatingStack coats={[]} range="1989 — 2025" />)).toBe('');
  });

  it('lists the career layers in order, substrate first, each with its coat name', () => {
    const html = renderToString(<CoatingStack coats={sherwin.coats} range={sherwin.range} />);
    const roles = [...html.matchAll(/class="coat__role">([^<]+)</g)].map((m) => m[1]);
    const names = [...html.matchAll(/class="coat__name">([^<]+)</g)].map((m) => m[1]);
    expect(roles).toEqual(['Chemistry foundations', 'Research Chemist', 'Senior Scientist', 'Team Leader', 'Senior Manager']);
    expect(names).toEqual(['Substrate', 'Primer', 'Basecoat', 'Midcoat', 'Topcoat']);
    expect(html).toContain(`aria-label="Career progression, ${sherwin.range}"`);
  });
});
