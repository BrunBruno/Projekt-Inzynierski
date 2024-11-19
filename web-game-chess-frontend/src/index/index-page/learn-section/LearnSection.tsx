import { CSSProperties, ForwardedRef, RefObject } from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import classes from "./LearnSection.module.scss";
import LearnBlocks from "./learn-blocks/LearnBlocks";
import { createOneTimeObserver } from "../../../shared/utils/functions/observers";
import { mainColor } from "../../../shared/utils/objects/colorMaps";
import { HandleOnScroll } from "../../../shared/utils/types/commonTypes";
import { generateRandomColor } from "../../../shared/utils/functions/random";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { specialPiecesSvgs } from "../../../shared/svgs/iconsMap/SpecialPiecesSvgs";

type LearnSectionProps = {
  // section container ref
  sectionRef: RefObject<HTMLElement>;
};

const LearnSection = forwardRef<HandleOnScroll, LearnSectionProps>(
  ({ sectionRef }: LearnSectionProps, ref: ForwardedRef<HandleOnScroll>) => {
    ///

    // side cards refs, for opening
    const cardRefs = useRef<HTMLDivElement[]>([]);

    // to handle section on scroll
    const handleOnScroll = () => {};
    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));

    // to apply card open on intersection
    useEffect(() => {
      const options: IntersectionObserverInit = {};

      const observerAction = (entry: IntersectionObserverEntry): void => {
        entry.target.classList.add(classes["open-card"]);
      };

      const observer: IntersectionObserver = createOneTimeObserver(observerAction, options);

      cardRefs.current.forEach((cardRef: HTMLDivElement) => {
        observer.observe(cardRef);
      });

      return () => {
        observer.disconnect();
      };
    }, []);

    // to generate cards
    const generateCards = (): JSX.Element[] => {
      const cards: JSX.Element[] = [];

      const numberOfCards = 6;

      for (let i = 0; i < numberOfCards; i++) {
        const cardStyle: CSSProperties = {
          top: `${Math.floor(i / 2) * 30}rem`,
          borderColor: generateRandomColor(mainColor),
        };

        cards.push(
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

      return cards;
    };

    return (
      <section id="learn-section" ref={sectionRef} className={classes.section}>
        <LearnBlocks />

        {/* middle join button */}
        <div className={classes.section__join}>
          {generateCards()}

          <div className={classes.section__join__content}>
            <h2 className={classes["join-header"]}>
              <IconCreator
                icons={specialPiecesSvgs}
                iconName={"n"}
                color={mainColor.c7}
                iconClass={classes["join-l-horse"]}
              />

              <span>BRN CHESS</span>

              <IconCreator
                icons={specialPiecesSvgs}
                iconName={"n"}
                color={mainColor.c7}
                iconClass={classes["join-r-horse"]}
              />
            </h2>

            <h3 className={classes["join-text"]}>
              <span>
                In the heart of the chessboard, where kings reign and pawns dream, we find ourselves in a realm where
                intellect meets strategy, where every move is a step towards victory, where each decision carries the
                weight of kingdoms.
              </span>
            </h3>

            <a href="#home-section" className={classes["join-action"]}>
              <button className={classes["join-button"]}>
                <span>JOIN NOW</span>
              </button>
            </a>
          </div>
        </div>
        {/* --- */}
      </section>
    );
  }
);

export default LearnSection;
