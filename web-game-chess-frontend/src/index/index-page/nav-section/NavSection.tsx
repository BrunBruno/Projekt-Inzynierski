import { forwardRef, useImperativeHandle, useRef } from "react";
import classes from "./NavSection.module.scss";
import NavSectionIcons from "./NavSectionIcons";
import { HandleOnScroll } from "../../../shared/utils/types/commonTypes";

type NavSectionProps = {
  // hero section container ref
  heroSectionRef: React.RefObject<HTMLElement>;
  // sections names
  indicators: readonly ["home", "play", "learn", "faq"];
};

const NavSection = forwardRef<HandleOnScroll, NavSectionProps>(
  ({ heroSectionRef, indicators }: NavSectionProps, ref: React.ForwardedRef<HandleOnScroll>) => {
    ///

    const navRef = useRef<HTMLDivElement>(null);

    // handle navbar onscroll
    const handleOnScroll = (): void => {
      const heroElement = heroSectionRef.current;
      const navElement = navRef.current;

      if (navElement && heroElement) {
        const navRefClasses = navElement.classList;

        if (window.scrollY > 0.8 * heroElement.clientHeight) {
          navRefClasses.remove(classes["nav-none"]);
        } else {
          navRefClasses.add(classes["nav-none"]);
        }

        if (window.scrollY <= 1.5 * heroElement.clientHeight) {
          navRefClasses.remove(classes["nav-sticky"]);
        } else {
          navRefClasses.add(classes["nav-sticky"]);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));
    //*/

    return (
      <div ref={navRef} className={`${classes.nav} ${classes["nav-none"]}`}>
        <nav className={classes["nav-bar"]}>
          {indicators.map((element, index) => (
            <a
              href={"#" + element + "-section"}
              key={`a-${index}`}
              className={`${classes["nav-element"]} ${index === 0 ? classes.active : ""}`}
            >
              <span className={classes.text}>{element.toUpperCase()}</span>
              <span className={classes.icon}>
                <NavSectionIcons iconName={element} />
              </span>
            </a>
          ))}
          <div className={classes.indicator}></div>
        </nav>
      </div>
    );
  }
);

export default NavSection;
