import { describe, it, expect } from 'vitest';
import { formatCitation } from './citation.js';

describe('formatCitation', () => {
  it('formats authors, year, title, venue and DOI URL', () => {
    expect(
      formatCitation({
        year: 1978,
        title: 'Volatile Double Isopropoxides of Tin with Aluminium',
        venue: 'Journal of Inorganic and Nuclear Chemistry 40, 349–351',
        doi: '10.1016/0022-1902(78)80139-0',
        authors: 'R. C. Mehrotra, A. K. Rai, N. C. Jain',
      })
    ).toBe(
      'R. C. Mehrotra, A. K. Rai, N. C. Jain (1978). Volatile Double Isopropoxides of Tin with Aluminium. Journal of Inorganic and Nuclear Chemistry 40, 349–351. https://doi.org/10.1016/0022-1902(78)80139-0'
    );
  });
  it('handles a missing year and DOI', () => {
    expect(formatCitation({ title: 'X', venue: 'Y', authors: 'A' })).toBe('A (n.d.). X. Y.');
  });
});
