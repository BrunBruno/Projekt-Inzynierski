import { useEffect, useRef } from "react";

import classes from "./HeaderSection.module.scss";
import HeaderSectionIcons from "./HeaderSectionIcons";

type HeaderSectionProps = {
  indicators: readonly ["home", "play", "learn", "faq"];
};

function HeaderSection({ indicators }: HeaderSectionProps) {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (!headerRef.current) {
        return;
      }

      let headerClasses: DOMTokenList = headerRef.current.classList;
      if (window.scrollY === 0) {
        headerClasses.remove(classes["header-sticky"]);
      } else {
        headerClasses.add(classes["header-sticky"]);
      }
    });
  }, []);

  return (
    <header ref={headerRef} className={classes.header}>
      <div className={classes.header__background}>
        <p />
        <p />
      </div>
      <div className={classes.header__logo}>
        <a href="/" target="_self"></a>
      </div>

      <nav className={classes.header__navigation}>
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
              <HeaderSectionIcons iconName={element} />
            </span>
          </a>
        ))}
        <div className={classes.indicator}></div>
      </nav>

      <div className={`${classes.header__form} ${classes["header-form"]}`}>
        <button className={classes.header__form__sButton}>About</button>
        <button className={classes.header__form__sButton}>Sign Up</button>
        <button className={classes.header__form__mButton}>Sign In</button>
      </div>
    </header>
  );
}

export default HeaderSection;
