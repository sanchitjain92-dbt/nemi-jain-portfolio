export function formatCitation(work) {
  const parts = [`${work.authors} (${work.year ?? 'n.d.'}).`, `${work.title}.`];
  if (work.venue) parts.push(`${work.venue}.`);
  if (work.doi) parts.push(`https://doi.org/${work.doi}`);
  return parts.join(' ');
}
