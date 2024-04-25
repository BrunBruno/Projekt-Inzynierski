import React from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import classes from "./LearnSection.module.scss";
import LearnBlocks from "./learn-components/LearnBlocks";
import { HandleOnScroll } from "../../../shared/utils/types/handleOnScroll";
import { createOneTimeObserver } from "../../../shared/utils/functions/createOneTimeObserver";
import { mainColor } from "../../../shared/utils/enums/colorMaps";
import { generateRandomColor } from "../../../shared/utils/functions/generateRandomColor";

type LearnSectionProps = {
  sectionRef: React.RefObject<HTMLElement>;
};

const LearnSection = forwardRef<HandleOnScroll, LearnSectionProps>(
  (
    { sectionRef }: LearnSectionProps,
    ref: React.ForwardedRef<HandleOnScroll>
  ) => {
    const handleOnScroll = () => {};
    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));

    const cardRefs = useRef<HTMLDivElement[]>([]);
    useEffect(() => {
      const observerAction = (entry: IntersectionObserverEntry): void => {
        entry.target.classList.add(classes["open-card"]);
      };
      const observer: IntersectionObserver = createOneTimeObserver(
        observerAction,
        {}
      );

      cardRefs.current.forEach((cardRef) => {
        observer.observe(cardRef);
      });

      return () => {
        observer.disconnect();
      };
    }, []);

    const generateCards = (): JSX.Element[] => {
      const crads: JSX.Element[] = [];

      const numberOfCards = 6;
      for (let i = 0; i < numberOfCards; i++) {
        const randomColor = generateRandomColor(mainColor);
        crads.push(
          <div
            ref={(ref) => (cardRefs.current[i] = ref!)}
            key={`card-${i}`}
            className={classes.learn__join__card}
            style={{
              top: `${Math.floor(i / 2) * 30}rem`,
              borderColor: randomColor,
            }}
          >
            <div
              className={classes.learn__join__card__inner}
              style={{ backgroundImage: `url('images/learn-bg${i}.jpg')` }}
            />
          </div>
        );
      }

      return crads;
    };

    return (
      <section id="learn-section" ref={sectionRef} className={classes.learn}>
        <LearnBlocks />
        <div className={classes.learn__join}>
          {generateCards()}

          {/* middle button */}
          <div className={classes.learn__join__button}>
            <h2>BRN CHESS</h2>
            <h3>
              In the heart of the chessboard, where kings reign and pawns dream,
              we find ourselves in a realm where intellect meets strategy, where
              every move is a step towards victory, where each decision carries
              the weight of kingdoms.
            </h3>
            <a href="#home-section">
              <button>JOIN NOW</button>
            </a>
          </div>
          {/* end middle button */}
        </div>
      </section>
    );
  }
);

export default LearnSection;
