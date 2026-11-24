import { describe, it, expect } from 'vitest';
import { parseHash, publicationsHref } from './route.js';

const HOME = { page: 'home', theme: null, section: null };

describe('parseHash', () => {
  it('treats empty, root and unknown routes as home', () => {
    for (const h of ['', '#', '#/', '#/unknown']) expect(parseHash(h)).toEqual(HOME);
  });
  it('keeps section anchors on the home page', () => {
    expect(parseHash('#career')).toEqual({ page: 'home', theme: null, section: 'career' });
  });
  it('parses the publications route with and without a theme', () => {
    expect(parseHash('#/publications')).toEqual({ page: 'publications', theme: null, section: null });
    expect(parseHash('#/publications?theme=bioinorganic').theme).toBe('bioinorganic');
  });
  it('round-trips publicationsHref', () => {
    expect(parseHash(publicationsHref('surfaces')).theme).toBe('surfaces');
    expect(parseHash(publicationsHref())).toEqual({ page: 'publications', theme: null, section: null });
  });
});
