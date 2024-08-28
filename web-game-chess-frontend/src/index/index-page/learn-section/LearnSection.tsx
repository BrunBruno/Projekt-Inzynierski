import React, { CSSProperties } from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import classes from "./LearnSection.module.scss";
import LearnBlocks from "./learn-blocks/LearnBlocks";
import { createOneTimeObserver } from "../../../shared/utils/functions/createOneTimeObserver";
import { mainColor } from "../../../shared/utils/enums/colorMaps";
import { HandleOnScroll } from "../../../shared/utils/types/commonTypes";
import { generateRandomColor } from "../../../shared/utils/functions/generateRandom";

type LearnSectionProps = {
  // section containe ref
  sectionRef: React.RefObject<HTMLElement>;
};

const LearnSection = forwardRef<HandleOnScroll, LearnSectionProps>(
  ({ sectionRef }: LearnSectionProps, ref: React.ForwardedRef<HandleOnScroll>) => {
    ///

    // side cards refs, for opening
    const cardRefs = useRef<HTMLDivElement[]>([]);

    // to handle section on srcoll
    const handleOnScroll = () => {};
    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));
    //*/

    // to apply card open on intersection
    useEffect(() => {
      const options: IntersectionObserverInit = {};
      const observerAction = (entry: IntersectionObserverEntry): void => {
        entry.target.classList.add(classes["open-card"]);
      };

      const observer: IntersectionObserver = createOneTimeObserver(observerAction, options);

      cardRefs.current.forEach((cardRef) => {
        observer.observe(cardRef);
      });

      return () => {
        observer.disconnect();
      };
    }, []);
    //*/

    // to generate cards
    const generateCards = (): JSX.Element[] => {
      const crads: JSX.Element[] = [];

      const numberOfCards = 6;
      for (let i = 0; i < numberOfCards; i++) {
        const cardStyle: CSSProperties = {
          top: `${Math.floor(i / 2) * 30}rem`,
          borderColor: generateRandomColor(mainColor),
        };

        crads.push(
          <div
            ref={(ref) => (cardRefs.current[i] = ref!)}
            key={`card-${i}`}
            className={classes.section__join__card}
            style={cardStyle}
          >
            <div
              className={classes.section__join__card__inner}
              style={{ backgroundImage: `url('images/learn-bg${i}.jpg')` }}
            />
          </div>
        );
      }

      return crads;
    };
    //*/

    return (
      <section id="learn-section" ref={sectionRef} className={classes.section}>
        <LearnBlocks />

        {/* middle join button */}
        <div className={classes.section__join}>
          {generateCards()}

          <div className={classes.section__join__content}>
            <h2 className={classes["join-header"]}>
              <span>BRN CHESS</span>
            </h2>

            <h3 className={classes["join-text"]}>
              <span>
                In the heart of the chessboard, where kings reign and pawns dream, we find ourselves in a realm where
                intellect meets strategy, where every move is a step towards victory, where each decision carries the
                weight of kingdoms.
              </span>
            </h3>

            <a href="#home-section" className={classes["join-action"]}>
              <button className={classes["join-button"]}>JOIN NOW</button>
            </a>
          </div>
        </div>
        {/* --- */}
      </section>
    );
  }
);

export default LearnSection;
