import { useEffect, useRef } from 'react';

import classes from './HeaderSection.module.scss';
import HeaderSectionIcons from './HeaderSectionIcons';

const indicators = ['home', 'learn', 'play', 'faq'] as const;

function HeaderSection() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY === 0) {
        headerRef.current?.classList.remove(classes['header-sticky']);
      } else {
        headerRef.current?.classList.add(classes['header-sticky']);
      }
    });
  }, []);

  return (
    <header ref={headerRef} className={classes.header}>
      <div className={classes.header__background}>
        <p />
        <p />
      </div>
      <div
        className={classes.header__logo}
        onClick={() => {
          location.reload();
        }}
      >
        <img src="images/logo.png" />
      </div>

      <nav className={classes.header__navigation}>
        {indicators.map((element, index) => (
          <a
            href={'#' + element}
            key={index}
            className={index === 0 ? classes.active : ''}
          >
            <span className={classes.text}>{element.toUpperCase()}</span>
            <span className={classes.icon}>
              <HeaderSectionIcons iconName={element} />
            </span>
          </a>
        ))}
        <div className={classes.indicator}></div>
      </nav>

      <div className={`${classes.header__form} ${classes['header-form']}`}>
        <button className={classes.header__form__sButton}>Sign In</button>
        <button className={classes.header__form__mButton}>Sign Up</button>
      </div>
    </header>
  );
}

export default HeaderSection;
