import { useEffect, useRef } from 'react';

import classes from './HomePage.module.scss';
import navClasses from './nav-section/NavSection.module.scss';

// import HeaderSection from './nav-section/NavSection';
import NavSection from './nav-section/NavSection';
import HeroSection from './hero-section/HeroSection';
import PlaySection from './play-section/PlaySection';
import LearnSection from './learn-section/LearnSection';
import FaqSection from './faq-section/FaqSection';

const indicators = ['home', 'play', 'learn', 'faq'] as const;

function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let elements: HTMLCollectionOf<Element> =
            document.getElementsByClassName(navClasses.nav_element);

          for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove(navClasses.active);

            if (entry.target.id === `obs-${indicators[i]}`) {
              elements[i].classList.add(navClasses.active);
            }
          }
        }
      });
    });

    if (heroRef.current !== null) observer.observe(heroRef.current);
    if (learnRef.current !== null) observer.observe(learnRef.current);
    if (playRef.current !== null) observer.observe(playRef.current);
    if (faqRef.current !== null) observer.observe(faqRef.current);
  }, []);

  return (
    <main className={classes['home-main']}>
      {/* <HeaderSection indicators={indicators} /> */}
      <NavSection indicators={indicators} />

      <div id="obs-home" ref={heroRef} className={classes.observe} />
      <HeroSection />

      <div id="obs-play" ref={playRef} className={classes.observe} />
      <PlaySection />

      <div id="obs-learn" ref={learnRef} className={classes.observe} />
      <LearnSection />

      <div id="obs-faq" ref={faqRef} className={classes.observe} />
      <FaqSection />

      <footer className={classes.footer}>Footer</footer>
    </main>
  );
}

export default HomePage;
