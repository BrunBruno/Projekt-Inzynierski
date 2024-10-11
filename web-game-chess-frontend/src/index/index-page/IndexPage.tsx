import { Fragment, MutableRefObject, RefObject } from "react";
import { useEffect, useRef } from "react";
import classes from "./IndexPage.module.scss";
import navClasses from "./nav-section/NavSection.module.scss";
import NavSection from "./nav-section/NavSection";
import HomeSection from "./home-section/HomeSection";
import PlaySection from "./play-section/PlaySection";
import LearnSection from "./learn-section/LearnSection";
import FaqSection from "./faq-section/FaqSection";
import FooterSection from "./footer-section/FooterSection";
import HeroSection from "./hero-section/HeroSection";
import { HandleOnScroll, PopupType } from "../../shared/utils/types/commonTypes";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import { useLocation } from "react-router-dom";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import IntroBackgroundSection from "./intro-background-section/IntroBackgroundSection";

// sections indicators
const indicators = ["home", "play", "learn", "faq"] as const;

// section interface
interface Section {
  // section name
  name: string;
  // ref for indicator element
  indicatorRef: MutableRefObject<HTMLDivElement | null>;
  // ref for scroll event
  scrollRef: MutableRefObject<HandleOnScroll | null>;
  // ref for section
  sectionRef: MutableRefObject<HTMLElement | null>;
}

function IndexPage() {
  ///

  const location = useLocation();
  const { showPopup } = usePopup();

  // create section map
  // use for navigation work
  const createSection = (sectionName: string): Section => ({
    name: sectionName,
    indicatorRef: useRef<HTMLDivElement>(null),
    scrollRef: useRef<HandleOnScroll>(null),
    sectionRef: useRef<HTMLElement>(null),
  });

  const sections: Section[] = [
    createSection("home"),
    createSection("play"),
    createSection("learn"),
    createSection("faq"),
  ];
  //*/

  // navbar scroll event ref
  const navScrollRef = useRef<HandleOnScroll>(null);
  // hero scroll event ref
  const heroScrollRef = useRef<HandleOnScroll>(null);
  // hero section ref
  const heroSectionRef = useRef<HTMLElement>(null);
  // home content ref
  // for making nav sticky
  const homeContentRef = useRef<HTMLDivElement>(null);

  // scroll events handling
  const handleScroll = () => {
    if (navScrollRef.current) navScrollRef.current.handleOnScroll();
    if (heroScrollRef.current) heroScrollRef.current.handleOnScroll();

    sections.forEach((section) => {
      if (section.scrollRef.current) {
        section.scrollRef.current.handleOnScroll();
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //*/

  // navbar functionality
  useEffect(() => {
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let elements: HTMLCollectionOf<Element> = document.getElementsByClassName(navClasses["nav-element"]);

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
      if (section.indicatorRef.current) {
        observer.observe(section.indicatorRef.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);
  //*/

  // set section indicators heights
  // for correct navbar indicator transition
  useEffect(() => {
    const wHF = window.innerHeight;

    for (let i = 0; i < sections.length; i++) {
      const sectionElement = sections[i].sectionRef.current;
      const sectionIndicator = sections[i].indicatorRef.current;

      if (sectionElement && sectionIndicator) {
        const sH = sectionElement.offsetHeight;
        const indH = sH - wHF;

        // set indicators heights to sections height - 100vh ?
        sectionIndicator.style.height = `${indH}px`;
      }
    }
  }, [sections]);
  //*/

  // to render section from map
  // pass section refs
  const renderSection = (
    name: string,
    scrollRef: RefObject<HandleOnScroll>,
    sectionRef: RefObject<HTMLElement>
  ): JSX.Element => {
    switch (name) {
      case "home":
        return <HomeSection ref={scrollRef} sectionRef={sectionRef} homeContentRef={homeContentRef} />;
      case "play":
        return <PlaySection ref={scrollRef} sectionRef={sectionRef} />;
      case "learn":
        return <LearnSection ref={scrollRef} sectionRef={sectionRef} />;
      case "faq":
        return <FaqSection ref={scrollRef} sectionRef={sectionRef} />;
      default:
        return <></>;
    }
  };
  //*/

  // handle page popups
  useEffect(() => {
    if (location.state) {
      const state = location.state as PopupType;

      if (state.popupText && state.popupType) {
        showPopup(state.popupText, state.popupType);
      }
    }
  }, [location.state]);
  //*/

  return (
    <main data-testid="main-index-page" className={classes["home-main"]}>
      <IntroBackgroundSection />

      <NavSection
        ref={navScrollRef}
        heroSectionRef={heroSectionRef}
        homeContentRef={homeContentRef}
        indicators={indicators}
      />

      <HeroSection ref={heroScrollRef} heroSectionRef={heroSectionRef} />

      {/* map sections */}
      {sections.map((section) => (
        <Fragment key={section.name}>
          {/* point to observe */}
          <div id={`obs-${section.name}`} ref={section.indicatorRef} className={classes.observe} />

          {/* section */}
          {renderSection(section.name, section.scrollRef, section.sectionRef)}
        </Fragment>
      ))}
      {/* --- */}

      <FooterSection />

      <MainPopUp />
    </main>
  );
}

export default IndexPage;
