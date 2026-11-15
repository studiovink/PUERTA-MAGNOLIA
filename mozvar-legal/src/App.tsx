import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import { Intro, Services, Approach, Method, Matters } from './components/Sections';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';

/** Revela con suavidad los bloques marcados con data-reveal al entrar en pantalla. */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Header />
      <main id="contenido">
        <Hero />
        <Intro />
        <Services />
        <Approach />
        <Method />
        <Matters />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
