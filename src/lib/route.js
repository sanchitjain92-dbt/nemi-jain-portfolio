export const PUBLICATIONS = 'publications';

export function parseHash(hash = '') {
  const raw = hash.replace(/^#/, '');
  if (raw.startsWith('/')) {
    const [path, query = ''] = raw.slice(1).split('?');
    if (path === PUBLICATIONS) {
      const theme = new URLSearchParams(query).get('theme');
      return { page: PUBLICATIONS, theme: theme || null, section: null };
    }
    return { page: 'home', theme: null, section: null };
  }
  return { page: 'home', theme: null, section: raw || null };
}

export function publicationsHref(theme) {
  return theme ? `#/${PUBLICATIONS}?theme=${encodeURIComponent(theme)}` : `#/${PUBLICATIONS}`;
}
