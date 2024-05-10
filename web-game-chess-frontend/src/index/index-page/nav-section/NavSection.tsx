import { forwardRef, useImperativeHandle, useRef } from 'react';
import classes from './NavSection.module.scss';
import NavSectionIcons from './NavSectionIcons';
import { HandleOnScroll } from '../../../shared/utils/types/handleOnScroll';

type NavSectionProps = {
  indicators: readonly ['home', 'play', 'learn', 'faq'];
};

const NavSection = forwardRef<HandleOnScroll, NavSectionProps>(
  (
    { indicators }: NavSectionProps,
    ref: React.ForwardedRef<HandleOnScroll>
  ) => {
    // handle navbar onscroll
    const navRef = useRef<HTMLDivElement>(null);
    const handleOnScroll = (): void => {
      if (navRef.current) {
        const navRefClasses = navRef.current.classList;

        if (window.scrollY > 1.2 * window.innerHeight) {
          navRefClasses.remove(classes['nav-none']);
        } else {
          navRefClasses.add(classes['nav-none']);
        }

        if (window.scrollY <= 1.8 * window.innerHeight) {
          navRefClasses.remove(classes['nav-sticky']);
        } else {
          navRefClasses.add(classes['nav-sticky']);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));
    // end handle navbar onscoll

    return (
      <div ref={navRef} className={`${classes.nav} ${classes['nav-none']}`}>
        <nav className={classes['nav-bar']}>
          {indicators.map((element, index) => (
            <a
              href={'#' + element + '-section'}
              key={`a-${index}`}
              className={`${classes['nav-element']} ${
                index === 0 ? classes.active : ''
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
      </div>
    );
  }
);

export default NavSection;
