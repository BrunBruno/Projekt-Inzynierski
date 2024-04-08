import { useEffect, useRef, useState } from 'react';
import classes from './HomePage.module.scss';
import headerClasses from './header-section/HeaderSection.module.scss';
import HeaderSection from './header-section/HeaderSection';
import HeroSection from './hero-section/HeroSection';
import PlaySection from './play-section/PlaySection';
import LearnSection from './learn-section/LearnSection';
import FaqSection from './faq-section/FaqSection';

function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isNavigating) {
          console.log(isNavigating);

          let elements = document.getElementsByClassName(
            headerClasses.nav_element
          );

          for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove(headerClasses.active);
          }

          if (entry.target.id === 'obs-hero') {
            elements[0].classList.add(headerClasses.active);
          }
          if (entry.target.id === 'obs-play') {
            elements[1].classList.add(headerClasses.active);
          }
          if (entry.target.id === 'obs-learn') {
            elements[2].classList.add(headerClasses.active);
          }
          if (entry.target.id === 'obs-faq') {
            elements[3].classList.add(headerClasses.active);
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
      <HeaderSection setIsNavigating={setIsNavigating} />

      <div id="obs-hero" ref={heroRef} className={classes.observe} />
      <HeroSection />

      <div id="obs-play" ref={playRef} className={classes.observe} />
      <PlaySection />

      <div id="obs-learn" ref={learnRef} className={classes.observe} />
      <LearnSection />

      <div id="obs-faq" ref={faqRef} className={classes.observe} />
      <FaqSection />

      {/* <footer className={classes.footer}>Footer</footer> */}
    </main>
  );
}

export default HomePage;
