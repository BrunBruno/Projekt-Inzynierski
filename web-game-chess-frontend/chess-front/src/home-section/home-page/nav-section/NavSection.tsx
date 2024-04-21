import { forwardRef, useImperativeHandle, useRef } from 'react';
import classes from './NavSection.module.scss';
import NavSectionIcons from './NavSectionIcons';
import { HandleOnScroll } from '../../../shared/utils/types/handleOnScroll';
import { useNavigate } from 'react-router-dom';
import { registrationActionEnum } from '../../../shared/utils/enums/registrationAction';

type NavSectionProps = {
  indicators: readonly ['home', 'play', 'learn', 'faq'];
};

const NavSection = forwardRef<HandleOnScroll, NavSectionProps>(
  (
    { indicators }: NavSectionProps,
    ref: React.ForwardedRef<HandleOnScroll>
  ) => {
    const navigate = useNavigate();

    // handle navbar onscroll
    const navRef = useRef<HTMLElement>(null);
    const handleOnScroll = (): void => {
      if (navRef.current) {
        const navRefClasses = navRef.current.classList;

        if (window.scrollY === 0) {
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
      <header ref={navRef} className={classes.header}>
        {/* navbar */}
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
        {/* end navbar */}

        {/* side bar */}
        <div className={classes['nav-actions']}>
          <button
            className={classes['nav-button']}
            onClick={() => {
              navigate('/about');
            }}
          >
            <span>About</span>
          </button>
          <button
            className={classes['nav-button']}
            onClick={() => {
              navigate('/registration', {
                state: { regOption: registrationActionEnum.signIn },
              });
            }}
          >
            <span>Sign In</span>
          </button>
          <button
            className={classes['nav-button']}
            onClick={() => {
              navigate('/registration', {
                state: { regOption: registrationActionEnum.signUp },
              });
            }}
          >
            <span>Sign Up</span>
          </button>
        </div>
        {/* end side bar */}
      </header>
    );
  }
);

export default NavSection;
