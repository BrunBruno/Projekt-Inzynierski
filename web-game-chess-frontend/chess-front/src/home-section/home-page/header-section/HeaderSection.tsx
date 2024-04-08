import { useEffect, useRef } from 'react';

import classes from './HeaderSection.module.scss';
import HeaderSectionIcons from './HeaderSectionIcons';

const indicators = ['home', 'play', 'learn', 'faq'] as const;

type HeaderSectionProps = {
  setIsNavigating: React.Dispatch<React.SetStateAction<boolean>>;
};

function HeaderSection({ setIsNavigating }: HeaderSectionProps) {
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

  const handleNavigation = () => {
    setIsNavigating(true);

    // setTimeout(() => {
    //   setIsNavigating(false);
    // }, 500);
  };

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
            href={'#' + element + '-section'}
            key={index}
            className={`${index === 0 ? classes.active : ''} ${classes.nav_element}`}
            onClick={() => handleNavigation()}
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
        <button className={classes.header__form__sButton}>About</button>
        <button className={classes.header__form__sButton}>Sign Up</button>
        <button className={classes.header__form__mButton}>Sign In</button>
      </div>
    </header>
  );
}

export default HeaderSection;
