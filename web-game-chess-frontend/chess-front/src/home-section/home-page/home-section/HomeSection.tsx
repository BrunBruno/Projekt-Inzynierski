import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import classes from "./HomeSection.module.scss";
import LogoIconSvg from "../../../shared/svgs/LogoIconSvg";
import { HandleOnScroll } from "../../../shared/utils/types/handleOnScroll";
import HomeActions from "./home-components/HomeActions";
import HomeHeader from "./home-components/HomeHeader";

type HomeSectionProps = {
  sectionRef: React.RefObject<HTMLElement>;
};

const HomeSection = forwardRef<HandleOnScroll, HomeSectionProps>(
  (
    { sectionRef }: HomeSectionProps,
    ref: React.ForwardedRef<HandleOnScroll>
  ) => {
    const h = window.innerHeight * 0.7;

    // handle home on scroll
    const homeRef = useRef<HTMLDivElement>(null);
    const handleOnScroll = () => {
      const homeElement = homeRef.current;

      if (homeElement) {
        const y = window.scrollY - window.innerHeight;

        if (y < homeElement.clientHeight * 1.5) {
          const brightness =
            -100 / (1 + Math.pow(Math.E, -(y - h) / 100)) + 100;

          homeElement.style.filter = `brightness(${brightness}%)`;
        }
      }
    };

    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));
    // end handle home on scoll

    //set video play rate
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = 0.7;
      }
    }, [videoRef]);
    // end set video play rate

    return (
      <section id="home-section" ref={sectionRef} className={classes.home}>
        <div ref={homeRef} className={classes.home__content}>
          {/* home background */}
          <div className={classes.home__content__background}></div>

          <HomeHeader />

          {/* intro senction */}
          <div className={classes.home__content__intro}>
            <h1 className={classes.home__content__intro__h1}>
              <span>Welcome to</span>
              <br />
              <span>BRN Chess</span>
            </h1>
            <span className={classes.home__content__intro__text}>
              Welcome to the fascinating world of chess! Chess is one of the
              most popular and enduring games in the world, with millions of
              people playing and enjoying it every day. It is a game of
              strategy, logic, and skill, where players must use their wits and
              experience to outmaneuver their opponents and claim victory on the
              board.
            </span>
          </div>
          {/* end intro senction */}

          <HomeActions />
        </div>
      </section>
    );
  }
);

export default HomeSection;
