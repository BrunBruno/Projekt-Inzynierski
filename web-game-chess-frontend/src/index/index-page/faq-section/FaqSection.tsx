import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import classes from "./FaqSection.module.scss";
import { mainColor } from "../../../shared/utils/enums/colorMaps";
import { accountAndUserProfileFAQs, gameplayAndFeaturesFAQs } from "./FaqSectionData";
import { HandleOnScroll } from "../../../shared/utils/types/commonTypes";
import FaqSectionCard from "./faq-section-card/FaqSectionCard";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../shared/svgs/iconsMap/SymbolIcons";

type FaqSectionProps = {
  // section container ref
  sectionRef: React.RefObject<HTMLElement>;
};

const FaqSection = forwardRef<HandleOnScroll, FaqSectionProps>(
  ({ sectionRef }: FaqSectionProps, ref: React.ForwardedRef<HandleOnScroll>) => {
    ///

    const row1Ref = useRef<HTMLDivElement>(null);
    const row2Ref = useRef<HTMLDivElement>(null);

    const [arrRow1Left, setArrRow1Left] = useState<boolean>(false);
    const [arrRow1Right, setArrRow1Right] = useState<boolean>(true);
    const [arrRow2Left, setArrRow2Left] = useState<boolean>(false);
    const [arrRow2Right, setArrRow2Right] = useState<boolean>(true);

    // to control scroll buttons
    const handleScrollOnClick = (containerRow: number, direction: number) => {
      const cardCount = window.innerWidth < 700 ? 1 : 2;
      let element: HTMLDivElement | null;
      let child;
      let scrollAmount: number;

      if (containerRow === 1) {
        element = row1Ref.current;
        if (element) {
          child = element.firstChild as HTMLDivElement;
          scrollAmount = cardCount * direction * child.clientWidth;

          element.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });

          const scrollPos = element.scrollLeft + scrollAmount;
          const scrollMax = element.scrollWidth - element.clientWidth;

          if (scrollPos <= 0) {
            setArrRow1Left(false);
          } else {
            setArrRow1Left(true);
          }

          if (scrollPos >= scrollMax) {
            setArrRow1Right(false);
          } else {
            setArrRow1Right(true);
          }
        }
      } else if (containerRow === 2) {
        element = row2Ref.current;
        if (element) {
          child = element.firstChild as HTMLDivElement;
          scrollAmount = cardCount * direction * child.clientWidth;

          element.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });

          const scrollPos = element.scrollLeft + scrollAmount;
          const scrollMax = element.scrollWidth - element.clientWidth;

          if (scrollPos <= 0) {
            setArrRow2Left(false);
          } else {
            setArrRow2Left(true);
          }

          if (scrollPos >= scrollMax) {
            setArrRow2Right(false);
          } else {
            setArrRow2Right(true);
          }
        }
      }
    };
    //*/

    // handle faq onscroll
    const handleOnScroll = () => {};
    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));
    //*/

    return (
      <section id="faq-section" ref={sectionRef} className={classes.section}>
        <div className={classes.section__intro}>
          <h2>Most Asked Questions</h2>
        </div>
        {/* question cards */}

        <div className={classes.section__content}>
          <div className={classes.section__content__category}>Account and User Profile FAQs</div>

          {/* row 1 */}
          <div
            className={classes.section__content__arrow}
            onClick={() => {
              handleScrollOnClick(1, -1);
            }}
          >
            {arrRow1Left && (
              <IconCreator
                icons={symbolIcons}
                iconName="arrow"
                color={mainColor.c0}
                iconClass={classes["arrow-left"]}
              />
            )}
          </div>

          <div ref={row1Ref} className={classes.section__content__row}>
            {accountAndUserProfileFAQs.map((faq, i) => (
              <FaqSectionCard key={`account-and-user-profile-${i}`} faq={faq} index={i} />
            ))}
          </div>

          <div
            className={classes.section__content__arrow}
            onClick={() => {
              handleScrollOnClick(1, 1);
            }}
          >
            {arrRow1Right && (
              <IconCreator
                icons={symbolIcons}
                iconName="arrow"
                color={mainColor.c0}
                iconClass={classes["arrow-right"]}
              />
            )}
          </div>
          {/* --- */}

          <div className={classes.section__content__category}>Gameplay and Features FAQs</div>

          {/* row 2 */}
          <div
            className={classes.section__content__arrow}
            onClick={() => {
              handleScrollOnClick(2, -1);
            }}
          >
            {arrRow2Left && (
              <IconCreator
                icons={symbolIcons}
                iconName="arrow"
                color={mainColor.c0}
                iconClass={classes["arrow-left"]}
              />
            )}
          </div>

          <div ref={row2Ref} className={classes.section__content__row}>
            {gameplayAndFeaturesFAQs.map((faq, i) => (
              <FaqSectionCard key={`{gameplay-and-features-${i}`} faq={faq} index={i} />
            ))}
          </div>

          <div
            className={classes.section__content__arrow}
            onClick={() => {
              handleScrollOnClick(2, 1);
            }}
          >
            {arrRow2Right && (
              <IconCreator
                icons={symbolIcons}
                iconName="arrow"
                color={mainColor.c0}
                iconClass={classes["arrow-right"]}
              />
            )}
          </div>
          {/* --- */}
        </div>
        {/* --- */}
      </section>
    );
  }
);

export default FaqSection;
