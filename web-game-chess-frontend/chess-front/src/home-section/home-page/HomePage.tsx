import React from "react";
import { useEffect, useRef } from "react";
import classes from "./HomePage.module.scss";
import navClasses from "./nav-section/NavSection.module.scss";
import NavSection from "./nav-section/NavSection";
import HomeSection from "./home-section/HomeSection";
import PlaySection from "./play-section/PlaySection";
import LearnSection from "./learn-section/LearnSection";
import FaqSection from "./faq-section/FaqSection";
import LogoIconSvg from "../../shared/svgs/LogoIconSvg";
import { HandleOnScroll } from "../../shared/utils/types/handleOnScroll";
import FooterSection from "./footer-section/FooterSection";
import HeroSection from "./hero-section/HeroSection";

// sections indicators
const indicators = ["home", "play", "learn", "faq"] as const;

interface Section {
  id: string;
  indRef: React.MutableRefObject<HTMLDivElement | null>;
  forRef: React.MutableRefObject<HandleOnScroll | null>;
  sectionRef: React.MutableRefObject<HTMLElement | null>;
}

function HomePage() {
  // create section map
  const createSection = (sectionId: string): Section => ({
    id: sectionId,
    indRef: useRef<HTMLDivElement>(null),
    forRef: useRef<HandleOnScroll>(null),
    sectionRef: useRef<HTMLElement>(null),
  });
  const sections: Section[] = [
    createSection("home"),
    createSection("play"),
    createSection("learn"),
    createSection("faq"),
  ];

  // navbar ref
  const navForRef = useRef<HandleOnScroll>(null);
  const heroForRef = useRef<HandleOnScroll>(null);

  // scroll events
  const handleScroll = () => {
    if (navForRef.current) navForRef.current.handleOnScroll();
    if (heroForRef.current) heroForRef.current.handleOnScroll();

    sections.forEach((section) => {
      if (section.forRef.current) {
        section.forRef.current.handleOnScroll();
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // navbar funnctionality
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let elements: HTMLCollectionOf<Element> = document.getElementsByClassName(
              navClasses["nav-element"]
            );

            for (let i = 0; i < elements.length; i++) {
              elements[i].classList.remove(navClasses.active);

              if (entry.target.id === `obs-${indicators[i]}`) {
                elements[i].classList.add(navClasses.active);
              }
            }
          }
        });
      }
    );

    sections.forEach((section) => {
      if (section.indRef.current) {
        observer.observe(section.indRef.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  // intro animation
  const bgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const hasAnimationPlayed = sessionStorage.getItem("animationPlayed");

    if (!hasAnimationPlayed) {
      const bgElement = bgRef.current;
      if (bgElement) {
        bgElement.classList.remove(classes["intro-remove"]);
        bgElement.classList.add(classes["intro-begin"]);
      }

      const timeoutId = setTimeout(() => {
        if (bgElement) {
          bgElement.classList.add(classes["intro-remove"]);

          sessionStorage.setItem("animationPlayed", "true");
        }
      }, 2500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, []);

  // set indicators heights
  useEffect(() => {
    const wH = window.innerHeight;

    for (let i = 0; i < sections.length; i++) {
      const sectionElement = sections[i].sectionRef.current;
      const sectionIndicator = sections[i].indRef.current;

      if (sectionElement && sectionIndicator) {
        const sH = sectionElement.offsetHeight;
        const indH = sH - wH;

        // set indicators heights to sections height - 100vh
        sectionIndicator.style.height = `${indH}px`;
      }
    }
  }, [sections]);

  return (
    <main className={classes["home-main"]}>
      <div
        ref={bgRef}
        className={`${classes["intro-background"]} ${classes["intro-remove"]}`}
      >
        <div className={classes["intro-logo"]}>
          <LogoIconSvg iconClass={classes["intro-svg"]} />
          <p className={classes["intro-text"]}>Chess</p>
        </div>
      </div>

      <NavSection ref={navForRef} indicators={indicators} />

      <HeroSection ref={heroForRef} />

      {sections.map((section) => (
        <React.Fragment key={section.id}>
          <div
            id={`obs-${section.id}`}
            ref={section.indRef}
            className={classes.observe}
          />
          {renderSection(section.id, section.forRef, section.sectionRef)}
        </React.Fragment>
      ))}

      <FooterSection />
    </main>
  );
}

function renderSection(
  id: string,
  forRef: React.RefObject<HandleOnScroll>,
  sectionRef: React.RefObject<HTMLElement>
) {
  switch (id) {
    case "home":
      return <HomeSection ref={forRef} sectionRef={sectionRef} />;
    case "play":
      return <PlaySection ref={forRef} sectionRef={sectionRef} />;
    case "learn":
      return <LearnSection ref={forRef} sectionRef={sectionRef} />;
    case "faq":
      return <FaqSection ref={forRef} sectionRef={sectionRef} />;
    default:
      return null;
  }
}

export default HomePage;
