import { forwardRef, useImperativeHandle, useRef } from "react";
import { HandleOnScroll } from "../../../shared/functions/Types";

import classes from "./NavSection.module.scss";
import NavSectionIcons from "./NavSectionIcons";

type NavSectionProps = {
  indicators: readonly ["home", "play", "learn", "faq"];
};

const NavSection = forwardRef<HandleOnScroll, NavSectionProps>(
  (
    { indicators }: NavSectionProps,
    ref: React.ForwardedRef<HandleOnScroll>
  ) => {
    // handle navbar on scroll
    const navRef = useRef<HTMLElement>(null);
    const handleOnScroll = (): void => {
      if (navRef.current) {
        const navRefClasses = navRef.current.classList;

        if (window.scrollY === 0) {
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
      <header ref={navRef} className={classes.navigation}>
        <nav className={classes.nav}>
          {indicators.map((element, index) => (
            <a
              href={"#" + element + "-section"}
              key={index}
              className={`${classes.nav_element} ${
                index === 0 ? classes.active : ""
              }`}
            >
              <span className={classes.text}>{element.toUpperCase()}</span>
              <span className={classes.icon}>
                <NavSectionIcons iconName={element} />
              </span>
            </a>
          ))}
          <div className={classes.indicator}></div>
        </nav>

        <div className={classes["nav-actions"]}>
          <button>
            <span>About</span>
          </button>
          <button>
            <span>Sign In</span>
          </button>
          <button>
            <span>Sign Up</span>
          </button>
        </div>
      </header>
    );
  }
);

export default NavSection;

// https://geoffroymounier.medium.com/react-hook-optimised-scrollevent-listener-13513649a64d
