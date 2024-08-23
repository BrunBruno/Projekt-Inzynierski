import { useEffect, useRef } from "react";
import LogoIconSvg from "../../../shared/svgs/LogoIconSvg";
import classes from "./IntroBackgroundSection.module.scss";

type IntroBackgroundSectionProps = {};

function IntroBackgroundSection({}: IntroBackgroundSectionProps) {
  ///

  // intro animation
  // intro background ref
  const backgroundRef = useRef<HTMLElement>(null);
  useEffect(() => {
    // to play only on first entry
    const hasAnimationPlayed = sessionStorage.getItem("entry-animation-played");

    if (!hasAnimationPlayed) {
      const animationDuration = 2500;
      const bgElement = backgroundRef.current;

      if (bgElement) {
        bgElement.classList.remove(classes["hidden-intro"]);
        bgElement.classList.add(classes["intro-begin"]);
      }

      const timeoutId = setTimeout(() => {
        if (bgElement) {
          bgElement.classList.add(classes["hidden-intro"]);

          sessionStorage.setItem("entry-animation-played", "true");
        }
      }, animationDuration);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, []);
  //*/

  return (
    <section ref={backgroundRef} className={`${classes["intro-background"]} ${classes["hidden-intro"]}`}>
      <div className={classes["intro-logo"]}>
        <LogoIconSvg iconClass={classes["intro-svg"]} />
        <p className={classes["intro-text"]}>Chess</p>
      </div>
    </section>
  );
}

export default IntroBackgroundSection;
