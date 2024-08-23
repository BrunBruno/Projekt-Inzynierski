import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import classes from "./FaqSection.module.scss";
import ArrowLeftSvg from "../../../shared/svgs/ArrowLeftSvg";
import { mainColor } from "../../../shared/utils/enums/colorMaps";
import ArrowRightSvg from "../../../shared/svgs/ArrowRightSvg";
import { accountAndUserProfileFAQs, gameplayAndFeaturesFAQs } from "./FaqSectionQuestions";
import { HandleOnScroll } from "../../../shared/utils/types/commonTypes";
import FaqSectionCard from "./faq-section-card/FaqSectionCard";

type FaqSectionProps = {
  // section container ref
  sectionRef: React.RefObject<HTMLElement>;
};

const FaqSection = forwardRef<HandleOnScroll, FaqSectionProps>(
  ({ sectionRef }: FaqSectionProps, ref: React.ForwardedRef<HandleOnScroll>) => {
    ///

    const row1Ref = useRef<HTMLDivElement>(null);
    const row2Ref = useRef<HTMLDivElement>(null);

    const [arrR1A1, setArrR1A1] = useState<boolean>(false);
    const [arrR1A2, setArrR1A2] = useState<boolean>(true);
    const [arrR2A1, setArrR2A1] = useState<boolean>(false);
    const [arrR2A2, setArrR2A2] = useState<boolean>(true);

    // to controll scroll buttons
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
            setArrR1A1(false);
          } else {
            setArrR1A1(true);
          }

          if (scrollPos >= scrollMax) {
            setArrR1A2(false);
          } else {
            setArrR1A2(true);
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
            setArrR2A1(false);
          } else {
            setArrR2A1(true);
          }

          if (scrollPos >= scrollMax) {
            setArrR2A2(false);
          } else {
            setArrR2A2(true);
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
      <section id="faq-section" ref={sectionRef} className={classes.faq}>
        <div className={classes.faq__intro}>
          <h2>Most Asked Questions</h2>
        </div>

        <div className={classes.faq__content}>
          <div className={classes.faq__content__cathegory}>Account and User Profile FAQs</div>

          {/* question sections */}
          <div
            className={classes.faq__content__arrow}
            onClick={() => {
              handleScrollOnClick(1, -1);
            }}
          >
            {arrR1A1 && <ArrowLeftSvg iconClass="" color={mainColor.c0} />}
          </div>
          <div ref={row1Ref} className={classes.faq__content__row}>
            {accountAndUserProfileFAQs.map((faq, i) => (
              <FaqSectionCard key={`account-and-user-profile-${i}`} faq={faq} index={i} />
            ))}
          </div>
          <div
            className={classes.faq__content__arrow}
            onClick={() => {
              handleScrollOnClick(1, 1);
            }}
          >
            {arrR1A2 && <ArrowRightSvg iconClass="" color={mainColor.c0} />}
          </div>
          <div className={classes.faq__content__cathegory}>Gameplay and Features FAQs</div>
          <div
            className={classes.faq__content__arrow}
            onClick={() => {
              handleScrollOnClick(2, -1);
            }}
          >
            {arrR2A1 && <ArrowLeftSvg iconClass="" color={mainColor.c0} />}
          </div>
          <div ref={row2Ref} className={classes.faq__content__row}>
            {gameplayAndFeaturesFAQs.map((faq, i) => (
              <FaqSectionCard key={`{gameplay-and-features-${i}`} faq={faq} index={i} />
            ))}
          </div>
          <div
            className={classes.faq__content__arrow}
            onClick={() => {
              handleScrollOnClick(2, 1);
            }}
          >
            {arrR2A2 && <ArrowRightSvg iconClass="" color={mainColor.c0} />}
          </div>
          {/* --- */}
        </div>
      </section>
    );
  }
);

export default FaqSection;
