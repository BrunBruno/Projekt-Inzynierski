import { ForwardedRef, forwardRef, RefObject, useImperativeHandle, useRef } from "react";
import classes from "./NavSection.module.scss";
import { navSectionIcons } from "./NavSectionIcons";
import { HandleOnScroll } from "../../../shared/utils/types/commonTypes";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";

type NavSectionProps = {
  // hero section container ref
  heroSectionRef: RefObject<HTMLElement>;
  // home content container ref
  homeContentRef: RefObject<HTMLElement>;
  // faq section container ref
  faqContentRef: RefObject<HTMLElement>;
  // sections names
  indicators: readonly ["home", "play", "learn", "faq"];
};

const NavSection = forwardRef<HandleOnScroll, NavSectionProps>(
  (
    { heroSectionRef, homeContentRef, faqContentRef, indicators }: NavSectionProps,
    ref: ForwardedRef<HandleOnScroll>
  ) => {
    ///

    // hav section ref
    const navRef = useRef<HTMLDivElement>(null);

    // handle navbar onscroll
    const handleOnScroll = (): void => {
      const heroElement = heroSectionRef.current;
      const homeElement = homeContentRef.current;
      const faqElement = faqContentRef.current;
      const navElement = navRef.current;

      if (navElement && heroElement && homeElement && faqElement) {
        const navRefClasses = navElement.classList;

        // no nav
        if (window.scrollY > window.innerHeight) {
          navRefClasses.remove(classes["nav-none"]);
        } else {
          navRefClasses.add(classes["nav-none"]);
        }

        // *4 for earlier change
        const navIntersection =
          window.scrollY <= homeElement.clientHeight + heroElement.clientHeight - 4 * navElement.clientHeight ||
          faqElement.getBoundingClientRect().top < 0;

        // sticky nav
        if (navIntersection) {
          navRefClasses.remove(classes["nav-sticky"]);
        } else {
          navRefClasses.add(classes["nav-sticky"]);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));

    return (
      <div ref={navRef} className={`${classes.nav} ${classes["nav-none"]}`}>
        <nav className={classes["nav-bar"]}>
          {indicators.map((element, index: number) => (
            <a
              href={"#" + element + "-section"}
              key={`a-${index}`}
              className={`${classes["nav-element"]} ${index === 0 ? classes.active : ""}`}
            >
              <span className={classes.text}>{element.toUpperCase()}</span>
              <span className={classes.icon}>
                <IconCreator icons={navSectionIcons} iconName={element} iconClass={classes.icon} />
              </span>
            </a>
          ))}

          <div className={classes.indicator} />
        </nav>
      </div>
    );
  }
);

export default NavSection;
