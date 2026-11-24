import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Career from './components/Career.jsx';
import Research from './components/Research.jsx';
import Expertise from './components/Expertise.jsx';
import Leadership from './components/Leadership.jsx';
import Service from './components/Service.jsx';
import Contact from './components/Contact.jsx';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Career />
        <Research />
        <Expertise />
        <Leadership />
        <Service />
      </main>
      <Contact />
    </>
  );
}
