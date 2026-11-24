import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { Reveal } from './ui.jsx';

export function Moments({ items }) {
  if (!items?.length) return null;
  return (
    <section id="moments" className="section moments" aria-labelledby="moments-title">
      <div className="container">
        <h2 id="moments-title" className="block-title moments__title">Moments</h2>
        <div className="moments__strip">
          {items.map((p) => (
            <Reveal as="figure" key={p.src} className="moment">
              <img src={p.src} alt={p.alt} loading="lazy" />
              {(p.caption || p.year) && (
                <figcaption>
                  {p.caption}
                  {p.year && <span> · {p.year}</span>}
                </figcaption>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Videos({ items }) {
  if (!items?.length) return null;
  return (
    <>
      <h3 className="block-title">Talks on video</h3>
      <div className="videos">
        {items.map((v) => (
          <VideoCard key={v.youtubeId} video={v} />
        ))}
      </div>
    </>
  );
}

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const frame = useRef(null);

  useEffect(() => {
    if (playing) frame.current?.focus();
  }, [playing]);

  return (
    <figure className="video">
      <div className="video__frame">
        {playing ? (
          <iframe
            ref={frame}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            className="video__poster"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${video.title}`}
            style={{ backgroundImage: `url(https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg)` }}
          >
            <span className="video__play">
              <Play size={22} />
            </span>
          </button>
        )}
      </div>
      <figcaption>
        <strong>{video.title}</strong>
        <span>{[video.event, video.year].filter(Boolean).join(' · ')}</span>
      </figcaption>
    </figure>
  );
}
