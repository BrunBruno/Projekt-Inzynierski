import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import classes from "./FaqSection.module.scss";
import ArrowLeftSvg from "../../../shared/svgs/ArrowLeftSvg";
import { mainColor } from "../../../shared/utils/enums/colorMaps";
import ArrowRightSvg from "../../../shared/svgs/ArrowRightSvg";
import { accountAndUserProfileFAQs, gameplayAndFeaturesFAQs } from "./FaqSectionQuestions";
import { HandleOnScroll } from "../../../shared/utils/types/commonTypes";

type FaqSectionProps = {
  sectionRef: React.RefObject<HTMLElement>;
};

const FaqSection = forwardRef<HandleOnScroll, FaqSectionProps>(
  ({ sectionRef }: FaqSectionProps, ref: React.ForwardedRef<HandleOnScroll>) => {
    ///

    const scrollSize = window.innerWidth / 2;
    const row1Ref = useRef<HTMLDivElement>(null);
    const row2Ref = useRef<HTMLDivElement>(null);

    const [arrR1A1, setArrR1A1] = useState<boolean>(false);
    const [arrR1A2, setArrR1A2] = useState<boolean>(true);
    const [arrR2A1, setArrR2A1] = useState<boolean>(false);
    const [arrR2A2, setArrR2A2] = useState<boolean>(true);

    // handle faq onscroll
    const handleScrollOnClick = (containerRow: number, scrollAmount: number) => {
      let element;
      if (containerRow === 1) {
        element = row1Ref.current;
        if (element) {
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

    const handleOnScroll = () => {};
    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));
    // end handle faq onscroll

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
              handleScrollOnClick(1, -scrollSize);
            }}
          >
            {arrR1A1 && <ArrowLeftSvg iconClass="" color={mainColor.c0} />}
          </div>
          <div ref={row1Ref} className={classes.faq__content__row}>
            {accountAndUserProfileFAQs.map((faq, i) => (
              <div key={i} className={classes.faq__content__row__block}>
                <h5>
                  <span>#{i + 1} </span>
                  {faq.question}
                </h5>
                <p className={classes.text}>{faq.answer}</p>
                <p className={classes.see}>Check the Answer</p>
              </div>
            ))}
          </div>
          <div
            className={classes.faq__content__arrow}
            onClick={() => {
              handleScrollOnClick(1, scrollSize);
            }}
          >
            {arrR1A2 && <ArrowRightSvg iconClass="" color={mainColor.c0} />}
          </div>
          <div className={classes.faq__content__cathegory}>Gameplay and Features FAQs</div>
          <div
            className={classes.faq__content__arrow}
            onClick={() => {
              handleScrollOnClick(2, -scrollSize);
            }}
          >
            {arrR2A1 && <ArrowLeftSvg iconClass="" color={mainColor.c0} />}
          </div>
          <div ref={row2Ref} className={classes.faq__content__row}>
            {gameplayAndFeaturesFAQs.map((faq, i) => (
              <div key={i} className={classes.faq__content__row__block}>
                <h5>
                  <span>#{i + 1} </span>
                  {faq.question}
                </h5>
                <p className={classes.text}>{faq.answer}</p>
                <p className={classes.see}>Check the Answer</p>
              </div>
            ))}
          </div>
          <div
            className={classes.faq__content__arrow}
            onClick={() => {
              handleScrollOnClick(2, scrollSize);
            }}
          >
            {arrR2A2 && <ArrowRightSvg iconClass="" color={mainColor.c0} />}
          </div>
          {/* end question sections */}
        </div>
      </section>
    );
  }
);

export default FaqSection;
