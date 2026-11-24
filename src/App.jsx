import { lazy, Suspense, useEffect } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Career from './components/Career.jsx';
import Research from './components/Research.jsx';
import Expertise from './components/Expertise.jsx';
import Leadership from './components/Leadership.jsx';
import Service from './components/Service.jsx';
import Contact from './components/Contact.jsx';
import { useRoute } from './hooks/useRoute.js';

const Publications = lazy(() => import('./components/Publications.jsx'));

function skipToMain(e) {
  e.preventDefault();
  document.getElementById('main')?.focus();
}

export default function App() {
  const route = useRoute();
  const onPublications = route.page === 'publications';

  // Same-page anchors scroll natively; this handles first load and returning from Publications.
  useEffect(() => {
    if (onPublications) {
      window.scrollTo(0, 0);
      return;
    }
    if (route.section) {
      requestAnimationFrame(() => document.getElementById(route.section)?.scrollIntoView());
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
            <Career />
            <Research />
            <Expertise />
            <Leadership />
            <Service />
          </>
        )}
      </main>
      <Contact />
    </>
  );
}
