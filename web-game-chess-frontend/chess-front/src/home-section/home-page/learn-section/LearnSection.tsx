import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import classes from './LearnSection.module.scss';
import { HandleOnScroll } from '../../../shared/functions/Types';
import { getRandomColor } from '../../../shared/functions/Functions';
import React from 'react';

type LearnSectionProps = {};

const LearnSection = forwardRef<HandleOnScroll, LearnSectionProps>(
  ({}: LearnSectionProps, ref: React.ForwardedRef<HandleOnScroll>) => {
    const handleOnScroll = () => {};
    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));

    const cardRefs = useRef<HTMLDivElement[]>([]);
    useEffect(() => {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      };

      const observer = new IntersectionObserver(
        (
          entries: IntersectionObserverEntry[],
          observer: IntersectionObserver
        ) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(classes['open-card']);
            } else {
              entry.target.classList.remove(classes['open-card']);
            }
          });
        },
        observerOptions
      );

      cardRefs.current.forEach((cardRef) => {
        observer.observe(cardRef);
      });

      return () => {
        cardRefs.current.forEach((cardRef) => {
          observer.unobserve(cardRef);
        });
      };
    }, []);

    const generateCards = (): JSX.Element[] => {
      const crads: JSX.Element[] = [];

      const numberOfCards = 6;
      for (let i = 0; i < numberOfCards; i++) {
        const randomColor = getRandomColor();
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
      <section id="learn-section" className={classes.learn}>
        <div className={classes.learn__z_pattern}>
          <div className={classes.learn__z_pattern__row}>
            <div className={classes.learn__z_pattern__row__icon}></div>
            <div className={classes.learn__z_pattern__row__text}>
              <h3>Some Title Aaaa</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
                voluptatem quaerat deserunt, animi aspernatur, nemo rem, earum
                eum nisi totam doloremque quos dolorum molestiae enim! Quos
                nesciunt ducimus iusto quaerat?
              </p>
            </div>
          </div>
          <div className={classes.learn__z_pattern__row}>
            <div className={classes.learn__z_pattern__row__text}>
              <h3>Some Title Aaaa</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
                voluptatem quaerat deserunt, animi aspernatur, nemo rem, earum
                eum nisi totam doloremque quos dolorum molestiae enim! Quos
                nesciunt ducimus iusto quaerat?
              </p>
            </div>

            <div className={classes.learn__z_pattern__row__icon}></div>
          </div>
          <div className={classes.learn__z_pattern__row}>
            <div className={classes.learn__z_pattern__row__icon}></div>
            <div className={classes.learn__z_pattern__row__text}>
              <h3>Some Title Aaaa</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
                voluptatem quaerat deserunt, animi aspernatur, nemo rem, earum
                eum nisi totam doloremque quos dolorum molestiae enim! Quos
                nesciunt ducimus iusto quaerat?
              </p>
            </div>
          </div>
          <div className={classes.learn__z_pattern__row}>
            <div className={classes.learn__z_pattern__row__text}>
              <h3>Some Title Aaaa</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
                voluptatem quaerat deserunt, animi aspernatur, nemo rem, earum
                eum nisi totam doloremque quos dolorum molestiae enim! Quos
                nesciunt ducimus iusto quaerat?
              </p>
            </div>
            <div className={classes.learn__z_pattern__row__icon}></div>
          </div>
        </div>
        <div className={classes.learn__join}>
          {generateCards()}
          <div className={classes.learn__join__button}>
            <h2>BRN CHESS</h2>
            <h3>
              In the heart of the chessboard, where kings reign and pawns dream,
              we find ourselves in a realm where intellect meets strategy, where
              every move is a step towards victory, where each decision carries
              the weight of kingdoms.
            </h3>
            <button>JOIN NOW</button>
          </div>
        </div>
      </section>
    );
  }
);

export default LearnSection;
