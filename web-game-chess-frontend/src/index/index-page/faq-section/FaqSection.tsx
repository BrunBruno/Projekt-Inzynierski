import {
  Dispatch,
  ForwardedRef,
  forwardRef,
  RefObject,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import classes from "./FaqSection.module.scss";
import { mainColor } from "../../../shared/utils/objects/colorMaps";
import { accountAndUserProfileFAQs, gameplayAndFeaturesFAQs, QuestionsType } from "./FaqSectionData";
import { HandleOnScroll } from "../../../shared/utils/types/commonTypes";
import FaqSectionCard from "./faq-section-card/FaqSectionCard";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../shared/svgs/iconsMap/SymbolIcons";
import { faqSectionIcons } from "./FaqSectionIcons";

type FaqSectionProps = {
  // section container ref
  sectionRef: RefObject<HTMLElement>;
  // for sticky nav
  faqContentRef: RefObject<HTMLDivElement>;
};

const FaqSection = forwardRef<HandleOnScroll, FaqSectionProps>(
  ({ sectionRef, faqContentRef }: FaqSectionProps, ref: ForwardedRef<HandleOnScroll>) => {
    ///

    // cards rows refs
    const row1Ref = useRef<HTMLDivElement>(null);
    const row2Ref = useRef<HTMLDivElement>(null);

    // cards per page / for resize adjustment
    const [cardCount, setCardCount] = useState<number>(2);

    // for showing and hiding slider arrows
    const [arrRow1Left, setArrRow1Left] = useState<boolean>(false);
    const [arrRow1Right, setArrRow1Right] = useState<boolean>(true);
    const [arrRow2Left, setArrRow2Left] = useState<boolean>(false);
    const [arrRow2Right, setArrRow2Right] = useState<boolean>(true);

    // for displaying slider indicator
    const [row1Indicator, setRow1Indicator] = useState<number>(0);
    const [row2Indicator, setRow2Indicator] = useState<number>(0);

    useEffect(() => {
      const handleCardCountOnResize = () => {
        const resetRow = (element: HTMLDivElement | null, setInd: Dispatch<SetStateAction<number>>) => {
          if (element) {
            element.scrollTo({
              left: 0,
              behavior: "smooth",
            });

            setInd(0);
          }
        };

        const count = window.innerWidth < 700 ? 1 : 2;
        setCardCount(count);

        resetRow(row1Ref.current, setRow1Indicator);
        resetRow(row2Ref.current, setRow2Indicator);
      };

      window.addEventListener("resize", handleCardCountOnResize);

      return () => {
        window.removeEventListener("resize", handleCardCountOnResize);
      };
    }, []);

    // to control scroll buttons
    const handleScrollOnClick = (containerRow: number, direction: number) => {
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

          const maxPos = Math.ceil(accountAndUserProfileFAQs.length / cardCount) - 1;
          setRow1Indicator((prev) => {
            let newPos = prev + direction;
            newPos = newPos < 0 ? 0 : newPos > maxPos ? maxPos : newPos;
            return newPos;
          });

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

          const maxPos = Math.ceil(accountAndUserProfileFAQs.length / cardCount);
          setRow2Indicator((prev) => {
            let newPos = prev + direction;
            newPos = newPos < 0 ? 0 : newPos > maxPos ? maxPos : newPos;
            return newPos;
          });

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

    // handle faq onscroll
    const handleOnScroll = () => {};
    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));

    return (
      <section id="faq-section" ref={sectionRef} className={classes.section}>
        <div ref={faqContentRef} className={classes.section__intro}>
          <h2>Most Asked Questions</h2>
        </div>
        {/* question cards */}

        <div className={classes.section__content}>
          {/* row 1 */}
          <div className={classes.section__content__category}>
            <IconCreator icons={faqSectionIcons} iconName={"accountFaq"} iconClass={classes["account-category-icon"]} />
            <h3 className={classes["cat-text"]}>Account and User Profile FAQs</h3>
          </div>

          <div
            className={`
          ${classes.section__content__arrow}
          ${classes["left-side"]} 
          ${!arrRow1Left ? classes["inactive-arrow"] : ""}
        `}
            onClick={() => {
              handleScrollOnClick(1, -1);
            }}
          >
            {arrRow1Left && (
              <IconCreator
                icons={symbolIcons}
                iconName={"arrow"}
                color={mainColor.c0}
                iconClass={classes["arrow-left"]}
              />
            )}
          </div>

          <div ref={row1Ref} className={classes.section__content__row}>
            {accountAndUserProfileFAQs.map((faq: QuestionsType, i: number) => (
              <FaqSectionCard key={`account-and-user-profile-${i}`} faq={faq} index={i} />
            ))}
          </div>

          <div
            className={`
              ${classes.section__content__arrow}
              ${classes["right-side"]} 
              ${!arrRow1Right ? classes["inactive-arrow"] : ""}
            `}
            onClick={() => {
              handleScrollOnClick(1, 1);
            }}
          >
            {arrRow1Right && (
              <IconCreator
                icons={symbolIcons}
                iconName={"arrow"}
                color={mainColor.c0}
                iconClass={classes["arrow-right"]}
              />
            )}
          </div>

          <div className={classes.section__content__indicator}>
            {Array.from({ length: Math.ceil(accountAndUserProfileFAQs.length / cardCount) }).map((_, i: number) => (
              <p
                key={`account-indicator-${i}`}
                className={`
                  ${classes["ind-point"]} 
                  ${row1Indicator === i ? classes.active : ""}
                `}
              />
            ))}
          </div>
          {/* --- */}

          {/* row 2 */}
          <div className={classes.section__content__category}>
            <IconCreator
              icons={faqSectionIcons}
              iconName={"gameplayFaq"}
              iconClass={classes["gameplay-category-icon"]}
            />
            <h3 className={classes["cat-text"]}>Gameplay an Features FAQs</h3>
          </div>

          <div
            className={`
              ${classes.section__content__arrow}
              ${classes["left-side"]} 
              ${!arrRow2Left ? classes["inactive-arrow"] : ""}
            `}
            onClick={() => {
              handleScrollOnClick(2, -1);
            }}
          >
            {arrRow2Left && (
              <IconCreator
                icons={symbolIcons}
                iconName={"arrow"}
                color={mainColor.c0}
                iconClass={classes["arrow-left"]}
              />
            )}
          </div>

          <div ref={row2Ref} className={classes.section__content__row}>
            {gameplayAndFeaturesFAQs.map((faq: QuestionsType, i: number) => (
              <FaqSectionCard key={`gameplay-and-features-${i}`} faq={faq} index={i} />
            ))}
          </div>

          <div
            className={`
              ${classes.section__content__arrow}
              ${classes["right-side"]} 
              ${!arrRow2Right ? classes["inactive-arrow"] : ""}
            `}
            onClick={() => {
              handleScrollOnClick(2, 1);
            }}
          >
            {arrRow2Right && (
              <IconCreator
                icons={symbolIcons}
                iconName={"arrow"}
                color={mainColor.c0}
                iconClass={classes["arrow-right"]}
              />
            )}
          </div>

          <div className={classes.section__content__indicator}>
            {Array.from({ length: Math.ceil(gameplayAndFeaturesFAQs.length / cardCount) }).map((_, i: number) => (
              <p
                key={`gameplay-indicator-${i}`}
                className={`
                  ${classes["ind-point"]} 
                  ${row2Indicator === i ? classes.active : ""}
                `}
              />
            ))}
          </div>
          {/* --- */}
        </div>
        {/* --- */}
      </section>
    );
  }
);

export default FaqSection;
