import { forwardRef, useImperativeHandle, useRef } from "react";
import classes from "./HeroSection.module.scss";
import { HandleOnScroll } from "../../../shared/utils/types/handleOnScroll";

type HeroSectionProps = {};

const HeroSection = forwardRef<HandleOnScroll, HeroSectionProps>(
  ({}: HeroSectionProps, ref: React.ForwardedRef<HandleOnScroll>) => {
    const heroBgRef = useRef<HTMLDivElement>(null);
    const handleOnScroll = () => {
      const bgElement = heroBgRef.current;

      if (bgElement) {
        const y = 0.8 * 100 - (window.scrollY / window.innerHeight) * 100;
        console.log(y);

        if (y < 100) {
          console.log(y);

          bgElement.style.backgroundImage = `radial-gradient(circle at 50% 50%, #0000 ${y}%, #000 ${
            y + 5
          }%, #000 100%)`;
        }
      }
    };

    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));

    return (
      <section className={classes.hero}>
        <div className={classes.hero__container}>
          <div ref={heroBgRef} className={classes.hero__container__bg}></div>
          <video className={classes.hero__conatiner__video} autoPlay loop muted>
            <source src="videos/hero-background.mp4" type="video/mp4" />
          </video>

          <div className={classes.hero__container__content}>aaa</div>
        </div>
      </section>
    );
  }
);

export default HeroSection;
