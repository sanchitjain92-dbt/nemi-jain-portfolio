import { lazy, Suspense, useEffect, useRef } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Journey from './components/journey/Journey.jsx';
import Research from './components/Research.jsx';
import Expertise from './components/Expertise.jsx';
import Leadership from './components/Leadership.jsx';
import Service from './components/Service.jsx';
import Contact from './components/Contact.jsx';
import BackToTop from './components/BackToTop.jsx';
import { Moments } from './components/Media.jsx';
import { gallery } from './data/profile.js';
import { useRoute } from './hooks/useRoute.js';

const Publications = lazy(() => import('./components/Publications.jsx'));

function skipToMain(e) {
  e.preventDefault();
  document.getElementById('main')?.focus();
}

export default function App() {
  const route = useRoute();
  const onPublications = route.page === 'publications';

  const prevPage = useRef(null);

  // Same-page anchors scroll natively; this handles first load and page changes (to/from Publications).
  useEffect(() => {
    const pageChanged = prevPage.current !== null && prevPage.current !== route.page;
    prevPage.current = route.page;
    let frame;

    if (onPublications) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Publications is lazy-loaded, so wait for its heading to mount before focusing it.
      const focusTitle = (tries) => {
        const title = document.getElementById('pubs-title');
        if (title) title.focus({ preventScroll: true });
        else if (tries > 0) frame = requestAnimationFrame(() => focusTitle(tries - 1));
      };
      if (pageChanged) focusTitle(300);
      return () => cancelAnimationFrame(frame);
    }

    if (route.section) {
      frame = requestAnimationFrame(() => {
        const target = document.getElementById(route.section);
        if (target) target.scrollIntoView({ behavior: 'instant' });
        else if (pageChanged) window.scrollTo({ top: 0, behavior: 'instant' });
        if (!pageChanged) return;
        const focusTarget = target ?? document.getElementById('main');
        // Sections aren't focusable by default; tabindex -1 allows programmatic focus only.
        if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
        focusTarget.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(frame);
    }

    if (pageChanged) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('main')?.focus({ preventScroll: true });
    }
  }, [route.page]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <a className="skip-link" href="#main" onClick={skipToMain}>
        Skip to content
      </a>
      <Nav page={route.page} />
      <main id="main" tabIndex={-1}>
        {onPublications ? (
          <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
            <Publications theme={route.theme} />
          </Suspense>
        ) : (
          <>
            <Hero />
            <About />
            <Moments items={gallery} />
            <Journey />
            <Research />
            <Expertise />
            <Leadership />
            <Service />
          </>
        )}
      </main>
      <Contact />
      <BackToTop />
    </>
  );
}
