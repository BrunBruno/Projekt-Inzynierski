import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import classes from "./HomeSection.module.scss";
import HomeActions from "./home-actions/HomeActions";
import { createOneTimeObserver } from "../../../shared/utils/functions/createOneTimeObserver";
import { HandleOnScroll } from "../../../shared/utils/types/commonTypes";

type HomeSectionProps = {
  // section container ref
  sectionRef: React.RefObject<HTMLElement>;
};

const HomeSection = forwardRef<HandleOnScroll, HomeSectionProps>(
  ({ sectionRef }: HomeSectionProps, ref: React.ForwardedRef<HandleOnScroll>) => {
    ///

    const introRef = useRef<HTMLDivElement>(null);

    // handle home on scroll
    const homeRef = useRef<HTMLDivElement>(null);
    const handleOnScroll = () => {
      // const homeElement = homeRef.current;
      // if (homeElement) {
      //   const y = window.scrollY - 1.7 * window.innerHeight;
      //   if (y < 1.7 * homeElement.clientHeight) {
      //     const brightness = -100 / (1 + Math.pow(Math.E, -(y - h) / 100)) + 100;
      //     homeElement.style.filter = `brightness(${brightness}%)`;
      //   }
      // }
    };

    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));
    //*/

    // to observe home intro
    useEffect(() => {
      const introObserverAction = (entry: IntersectionObserverEntry): void => {
        entry.target.classList.add(classes["show"]);
      };
      const introObserver: IntersectionObserver = createOneTimeObserver(introObserverAction, {});

      if (introRef.current) {
        introObserver.observe(introRef.current);
      }

      return () => {
        introObserver.disconnect();
      };
    }, [introRef]);
    //*/

    return (
      <section id="home-section" ref={sectionRef} className={classes.home}>
        <div ref={homeRef} className={classes.home__content}>
          {/* intro senction */}
          <div ref={introRef} className={classes.home__content__intro}>
            <h1 className={classes.home__content__intro__h1}>
              <span>Welcome to</span>
              <br />
              <span>BRN Chess</span>
            </h1>
            <span className={classes.home__content__intro__text}>
              Chess is one of the most popular and enduring games in the world, with millions of people playing and
              enjoying it every day. It is a game of strategy, logic, and skill, where players must use their wits and
              experience to outmaneuver their opponents and claim victory on the board.
            </span>
          </div>
          {/* --- */}

          <HomeActions />
        </div>
      </section>
    );
  }
);

export default HomeSection;
