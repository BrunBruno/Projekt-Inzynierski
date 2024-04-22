import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import classes from './HeroSection.module.scss';
import LogoIconSvg from '../../../shared/svgs/LogoIconSvg';
import { useNavigate } from 'react-router-dom';
import { HandleOnScroll } from '../../../shared/utils/types/handleOnScroll';
import HeroActions from './hero-actions/HeroActions';

type HeroSectionProps = {
  sectionRef: React.RefObject<HTMLElement>;
};

const HeroSection = forwardRef<HandleOnScroll, HeroSectionProps>(
  (
    { sectionRef }: HeroSectionProps,
    ref: React.ForwardedRef<HandleOnScroll>
  ) => {
    const navigate = useNavigate();

    const h = window.innerHeight * 0.7;

    // handle hero on scroll
    const heroRef = useRef<HTMLDivElement>(null);
    const handleOnScroll = () => {
      const heroElement = heroRef.current;

      if (heroElement) {
        const y = window.scrollY;

        if (y < heroElement.clientHeight * 1.5) {
          const brightness =
            -100 / (1 + Math.pow(Math.E, -(y - h) / 100)) + 100;

          heroElement.style.filter = `brightness(${brightness}%)`;
        }
      }
    };

    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));
    // end handle hero on scoll

    //set video play rate
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = 0.7;
      }
    }, [videoRef]);
    // end set video play rate

    return (
      <section id="home-section" ref={sectionRef} className={classes.hero}>
        <div ref={heroRef} className={classes.hero__content}>
          {/* hero background */}
          <div className={classes.hero__content__background}>
            {/* <video ref={videoRef} autoPlay loop muted>
              <source src="videos/hero-background.mp4" type="video/mp4" />
            </video> */}
          </div>

          {/* Logo */}
          <div className={classes['nav-logo']}>
            <a href="/">
              <LogoIconSvg iconClass={classes['logo-svg']} />
            </a>
            <p>Chess</p>
          </div>

          {/* intro senction */}
          <div className={classes.hero__content__intro}>
            <h1 className={classes.hero__content__intro__h1}>
              <span>Welcome to</span>
              <br />
              <span>BRN Chess</span>
            </h1>
            <span className={classes.hero__content__intro__text}>
              Welcome to the fascinating world of chess! Chess is one of the
              most popular and enduring games in the world, with millions of
              people playing and enjoying it every day. It is a game of
              strategy, logic, and skill, where players must use their wits and
              experience to outmaneuver their opponents and claim victory on the
              board.
            </span>
          </div>
          {/* end intro senction */}

          <HeroActions />
        </div>
      </section>
    );
  }
);

export default HeroSection;
