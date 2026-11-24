import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Moments, Videos } from './Media.jsx';

describe('media sections', () => {
  it('render nothing when no content is provided', () => {
    expect(renderToString(<Moments items={[]} />)).toBe('');
    expect(renderToString(<Videos items={[]} />)).toBe('');
  });
  it('render provided photos and videos', () => {
    const photos = renderToString(<Moments items={[{ src: '/a.jpg', alt: 'At the lab', caption: 'Lab', year: 1990 }]} />);
    expect(photos).toContain('alt="At the lab"');
    const vids = renderToString(<Videos items={[{ title: 'ACS talk', youtubeId: 'abc123', year: 2016 }]} />);
    expect(vids).toContain('Play video: ACS talk');
  });
});
