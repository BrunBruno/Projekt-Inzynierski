import React from 'react';
import { useEffect, useRef } from 'react';
import { generateRandomId } from '../../shared/functions/Functions';
import { HandleOnScroll } from '../../shared/functions/Types';

import classes from './HomePage.module.scss';
import navClasses from './nav-section/NavSection.module.scss';

import NavSection from './nav-section/NavSection';
import HeroSection from './hero-section/HeroSection';
import PlaySection from './play-section/PlaySection';
import LearnSection from './learn-section/LearnSection';
import FaqSection from './faq-section/FaqSection';
import LogoIconSvg from '../../shared/svgs/LogoIconSvg';

const indicators = ['home', 'play', 'learn', 'faq'] as const;

const defsIds = {
  id0: generateRandomId(),
  id1: generateRandomId(),
  id2: generateRandomId(),
  id3: generateRandomId(),
  id4: generateRandomId(),
  id5: generateRandomId(),
  id6: generateRandomId(),
};

function HomePage() {
  const sections = [
    {
      id: 'home',
      ref: useRef<HTMLDivElement>(null),
      forRef: useRef<HandleOnScroll>(null),
    },
    {
      id: 'play',
      ref: useRef<HTMLDivElement>(null),
      forRef: useRef<HandleOnScroll>(null),
    },
    {
      id: 'learn',
      ref: useRef<HTMLDivElement>(null),
      forRef: useRef<HandleOnScroll>(null),
    },
    {
      id: 'faq',
      ref: useRef<HTMLDivElement>(null),
      forRef: useRef<HandleOnScroll>(null),
    },
  ];
  const navForRef = useRef<HandleOnScroll>(null);

  // scroll events
  const handleScroll = () => {
    if (navForRef.current) navForRef.current.handleOnScroll();
    sections.forEach((section) => {
      if (section.forRef.current) {
        section.forRef.current.handleOnScroll();
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // navbar funnctionality
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      console.log('aaa');

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

    sections.forEach((section) => {
      if (section.ref.current) {
        console.log(section.ref.current);
        observer.observe(section.ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  // intro animation
  const bgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const hasAnimationPlayed = sessionStorage.getItem('animationPlayed');
    if (!hasAnimationPlayed) {
      const bgElement = bgRef.current;
      if (bgElement) {
        bgElement.classList.remove(classes['intro-remove']);
        bgElement.classList.add(classes['intro-begin']);
      }

      const timeoutId = setTimeout(() => {
        if (bgElement) {
          bgElement.classList.add(classes['intro-remove']);
          sessionStorage.setItem('animationPlayed', 'true');
        }
        //}, 2500);
      }, 3500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, []);

  return (
    <main className={classes['home-main']}>
      <div
        ref={bgRef}
        className={`${classes['intro-background']} ${classes['intro-remove']}`}
      >
        <div className={classes['intro-logo']}>
          <LogoIconSvg iconClass="" defsIds={defsIds} />
          <p>Chess</p>
        </div>
      </div>

      <NavSection ref={navForRef} indicators={indicators} />

      {sections.map((section) => (
        <React.Fragment key={section.id}>
          <div
            id={`obs-${section.id}`}
            ref={section.ref}
            className={classes.observe}
          />
          {renderSection(section.id, section.forRef)}
        </React.Fragment>
      ))}

      <footer className={classes.footer}>Footer</footer>
    </main>
  );
}

function renderSection(id: string, forRef: React.RefObject<HandleOnScroll>) {
  switch (id) {
    case 'home':
      return <HeroSection ref={forRef} />;
    case 'play':
      return <PlaySection ref={forRef} />;
    case 'learn':
      return <LearnSection ref={forRef} />;
    case 'faq':
      return <FaqSection ref={forRef} />;
    default:
      return null;
  }
}

export default HomePage;
