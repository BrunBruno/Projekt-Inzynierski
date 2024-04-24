import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import classes from './FaqSection.module.scss';
import { HandleOnScroll } from '../../../shared/utils/types/handleOnScroll';
import ArrowLeftSvg from '../../../shared/svgs/ArrowLeftSvg';
import { mainColor } from '../../../shared/utils/enums/colorMaps';
import ArrowRightSvg from '../../../shared/svgs/ArrowRightSvg';

type FaqSectionProps = {
  sectionRef: React.RefObject<HTMLElement>;
};

const FaqSection = forwardRef<HandleOnScroll, FaqSectionProps>(
  (
    { sectionRef }: FaqSectionProps,
    ref: React.ForwardedRef<HandleOnScroll>
  ) => {
    const scrollSize = window.innerWidth / 2;
    const row1Ref = useRef<HTMLDivElement>(null);
    const row2Ref = useRef<HTMLDivElement>(null);

    // handle faq onscroll
    const handleOnScroll = () => {};
    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));
    // end handle faq onscroll

    const handleScrollOnClick = (
      containerRef: React.RefObject<HTMLDivElement>,
      scrollAmount: number
    ) => {
      if (containerRef.current) {
        containerRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        });
      }
    };

    return (
      <section id="faq-section" ref={sectionRef} className={classes.faq}>
        <div className={classes.faq__intro}>
          <h2>Most Asked Questions</h2>
        </div>

        <div className={classes.faq__content}>
          {/* question sections */}
          <div
            className={classes.faq__content__arrow}
            onClick={() => {
              handleScrollOnClick(row1Ref, -scrollSize);
            }}
          >
            <ArrowLeftSvg iconClass="" color={mainColor.c0} />
          </div>
          <div ref={row1Ref} className={classes.faq__content__row}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={classes.faq__content__row__block}>
                <h5>How many teaspoons in a tablespoon?</h5>
                <p className={classes.text}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Facere reiciendis voluptas autem enim, exercitationem, ut
                  laboriosam id quae totam eius quis veniam temporibus aut non
                  numquam cupiditate delectus quo est?
                </p>
                <p className={classes.see}>Check the Answer</p>
              </div>
            ))}
          </div>
          <div
            className={classes.faq__content__arrow}
            onClick={() => {
              handleScrollOnClick(row1Ref, scrollSize);
            }}
          >
            <ArrowRightSvg iconClass="" color={mainColor.c0} />
          </div>
          <div
            className={classes.faq__content__arrow}
            onClick={() => {
              handleScrollOnClick(row2Ref, -scrollSize);
            }}
          >
            <ArrowLeftSvg iconClass="" color={mainColor.c0} />
          </div>
          <div ref={row2Ref} className={classes.faq__content__row}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={classes.faq__content__row__block}>
                <h5>How many teaspoons in a tablespoon?</h5>
                <p className={classes.text}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Facere reiciendis voluptas autem enim, exercitationem, ut
                  laboriosam id quae totam eius quis veniam temporibus aut non
                  numquam cupiditate delectus quo est?
                </p>
              </div>
            ))}
          </div>
          <div
            className={classes.faq__content__arrow}
            onClick={() => {
              handleScrollOnClick(row2Ref, scrollSize);
            }}
          >
            <ArrowRightSvg iconClass="" color={mainColor.c0} />
          </div>
          {/* end question sections */}{' '}
        </div>
      </section>
    );
  }
);

export default FaqSection;
