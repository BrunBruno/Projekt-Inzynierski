import React from 'react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import classes from './LearnSection.module.scss';
import { HandleOnScroll } from '../../../shared/functions/Types';
import {
  createOneTimeObserver,
  getRandomColor,
} from '../../../shared/functions/Functions';
import LearnSectionBlocks from './LearnSectionBlocks';

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
        entry.target.classList.add(classes['open-card']);
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
      <section id="learn-section" ref={sectionRef} className={classes.learn}>
        <LearnSectionBlocks />
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