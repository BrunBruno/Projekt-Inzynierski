import { forwardRef, useImperativeHandle, useRef } from "react";
import classes from "./HeroSection.module.scss";
import HeroHeader from "./hero-header/HeroHeader";
import { HandleOnScroll } from "../../../shared/utils/types/commonTypes";

type HeroSectionProps = {
  // section container ref
  heroSectionRef: React.RefObject<HTMLElement>;
};

const HeroSection = forwardRef<HandleOnScroll, HeroSectionProps>(
  ({ heroSectionRef }: HeroSectionProps, ref: React.ForwardedRef<HandleOnScroll>) => {
    ///

    const heroBgRef = useRef<HTMLDivElement>(null);

    // to handle elements on scroll
    const handleOnScroll = () => {
      const bgElement = heroBgRef.current;

      if (window.innerWidth > 700 && window.innerWidth < 3000) {
        if (bgElement) {
          const y = 100 - (window.scrollY / (1.5 * window.innerHeight)) * 100;

          if (y < 100) {
            bgElement.style.backgroundImage = `radial-gradient(circle at 50% 50%, #0000 ${y}%, #000 ${
              y + 5
            }%, #000 100%)`;
          }
        }
      } else {
        if (bgElement) {
          bgElement.style.backgroundImage = "none";
        }
      }
    };

    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));
    //*/

    return (
      <section ref={heroSectionRef} className={classes.hero}>
        <div className={classes.hero__container}>
          <div ref={heroBgRef} className={classes.hero__container__bg} />
          <HeroHeader />

          {/* hero content */}
          <div className={classes.hero__container__content}>
            <div></div>
            <h1>
              <span>
                <span className={classes["span-n"]}>Enter the</span> <span className={classes["span-f"]}>realm</span>
              </span>
              <br />
              <span>
                <span className={classes["span-n"]}>where every</span> <span className={classes["span-f"]}>move</span>{" "}
                <span className={classes["span-n"]}> shapes destiny</span>
              </span>
            </h1>

            <h2>Are you ready to conquer the board?</h2>
            <a href="#home-section" className={classes.begin}>
              <p />
            </a>
          </div>
          {/* --- */}
        </div>
      </section>
    );
  }
);

export default HeroSection;
