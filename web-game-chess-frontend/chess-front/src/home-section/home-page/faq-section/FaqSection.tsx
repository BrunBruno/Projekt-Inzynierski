import React, { forwardRef, useImperativeHandle } from 'react';
import classes from './FaqSection.module.scss';
import { HandleOnScroll } from '../../../shared/utils/types/handleOnScroll';

type FaqSectionProps = {
  sectionRef: React.RefObject<HTMLElement>;
};

const FaqSection = forwardRef<HandleOnScroll, FaqSectionProps>(
  (
    { sectionRef }: FaqSectionProps,
    ref: React.ForwardedRef<HandleOnScroll>
  ) => {
    // handle faq onscroll
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

        {/* question sections */}
        <div className={classes.faq__content}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className={classes.faq__content__block}>
              <h5>How many teaspoons in a tablespoon?</h5>
              <p className={classes.text}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
                reiciendis voluptas autem enim, exercitationem, ut laboriosam id
                quae totam eius quis veniam temporibus aut non numquam
                cupiditate delectus quo est?
              </p>
              <p className={classes.see}>Check the Answer</p>
            </div>
          ))}
        </div>
        <div className={classes.faq__content}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className={classes.faq__content__block}>
              <h5>How many teaspoons in a tablespoon?</h5>
              <p className={classes.text}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
                reiciendis voluptas autem enim, exercitationem, ut laboriosam id
                quae totam eius quis veniam temporibus aut non numquam
                cupiditate delectus quo est?
              </p>
            </div>
          ))}
        </div>
        {/* end question sections */}
      </section>
    );
  }
);

export default FaqSection;
