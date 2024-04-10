import { useEffect, useRef } from "react";

import classes from "./NavSection.module.scss";
import NavSectionIcons from "./NavSectionIcons";
import LogoIconSvg from "../../../shared/svgs/LogoIconSvg";

type NavSectionProps = {
  indicators: readonly ["home", "play", "learn", "faq"];
};

function NavSection({ indicators }: NavSectionProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (!navRef.current) {
        return;
      }

      let navRefClasses: DOMTokenList = navRef.current.classList;
      if (window.scrollY === 0) {
        navRefClasses.remove(classes["nav-sticky"]);
      } else {
        navRefClasses.add(classes["nav-sticky"]);
      }
    });
  }, []);

  return (
    <header ref={navRef} className={classes.navigation}>
      <div className={classes["nav-logo"]}>
        <a href="/">
          <LogoIconSvg />
        </a>
        <p>Chess</p>
      </div>

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

export default NavSection;
