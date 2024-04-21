import classes from './LearnSection.module.scss';
import { useEffect, useRef, useState } from 'react';
import LearnSectionLineIcon from './LearnSectionLineIcon';
import { createOneTimeObserver } from '../../../shared/utils/functions/createOneTimeObserver';
import { mainColor } from '../../../shared/utils/enums/colorMaps';

const LearnSectionBlocks = () => {
  const [wasActived, setWasActived] = useState(false);
  const [count, setCount] = useState<number>(0);

  const SectionBlocks = [
    {
      title: 'Some Title Aaaa',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas voluptatem quaerat deserunt, animi aspernatur, nemo rem, earum eum nisi totam doloremque quos dolorum molestiae enim! Quos nesciunt ducimus iusto quaerat?',
      iconName: 'pieces-icon',
      iconRef: useRef<HTMLDivElement>(null),
      textRef: useRef<HTMLDivElement>(null),
      lineRef: useRef<HTMLDivElement>(null),
    },
    {
      title: 'Some Title Aaaa',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas voluptatem quaerat deserunt, animi aspernatur, nemo rem, earum eum nisi totam doloremque quos dolorum molestiae enim! Quos nesciunt ducimus iusto quaerat?',
      iconName: 'counter-icon',
      iconRef: useRef<HTMLDivElement>(null),
      textRef: useRef<HTMLDivElement>(null),
      lineRef: useRef<HTMLDivElement>(null),
    },
    {
      title: 'Some Title Aaaa',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas voluptatem quaerat deserunt, animi aspernatur, nemo rem, earum eum nisi totam doloremque quos dolorum molestiae enim! Quos nesciunt ducimus iusto quaerat?',
      iconName: 'icon3',
      iconRef: useRef<HTMLDivElement>(null),
      textRef: useRef<HTMLDivElement>(null),
      lineRef: useRef<HTMLDivElement>(null),
    },
    {
      title: 'Some Title Aaaa',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas voluptatem quaerat deserunt, animi aspernatur, nemo rem, earum eum nisi totam doloremque quos dolorum molestiae enim! Quos nesciunt ducimus iusto quaerat?',
      iconId: 'icon4',
      iconRef: useRef<HTMLDivElement>(null),
      textRef: useRef<HTMLDivElement>(null),
      lineRef: useRef<HTMLDivElement>(null),
    },
  ];

  // create learn section icons
  const createIcon = (iconName: string): JSX.Element => {
    switch (iconName) {
      case 'pieces-icon':
        const links = [
          'white-rook',
          'black-queen',
          'white-pawn',
          'black-bishop',
          'white-king',
        ] as const;

        const images = links.map((link) => (
          <img
            key={link}
            src={`pieces/${link}.png`}
            alt={link}
            draggable={false}
          />
        ));

        return <>{images}</>;

      case 'counter-icon':
        const elements = Array.from({ length: 4 }).map((_, i) => {
          const value = Math.floor(count / Math.pow(3, -(i - 3)))
            .toString()
            .slice(-1);
          return (
            <div
              key={i}
              style={{ color: value === '3' ? mainColor.c5 : mainColor.c0 }}
            >
              {value}
            </div>
          );
        });
        return <>{elements}</>;
      case 'icon3':
        return <></>;
      case 'icon4':
        return <></>;
      default:
        return <></>;
    }
  };
  // end create learn section icons

  // observer block
  useEffect(() => {
    const textObserverAction = (entry: IntersectionObserverEntry): void => {
      entry.target.classList.add(classes['active-text']);
    };
    const textObserver: IntersectionObserver = createOneTimeObserver(
      textObserverAction,
      {}
    );

    const iconObserverAction = (entry: IntersectionObserverEntry): void => {
      entry.target.classList.add(classes['active-icon']);

      if (
        !wasActived &&
        entry.target.classList.contains(classes['counter-icon'])
      ) {
        setWasActived(true);
        setTimeout(() => incrementCount(0), 1000);
      }
    };
    const iconObserver: IntersectionObserver = createOneTimeObserver(
      iconObserverAction,
      {}
    );

    const lineObserverAction = (entry: IntersectionObserverEntry): void => {
      entry.target.classList.add(classes['active-line']);
    };
    const lineObserver: IntersectionObserver = createOneTimeObserver(
      lineObserverAction,
      {}
    );

    SectionBlocks.forEach((block) => {
      if (block.textRef.current) {
        textObserver.observe(block.textRef.current);
      }
      if (block.iconRef.current) {
        iconObserver.observe(block.iconRef.current);
      }
      if (block.lineRef.current) {
        lineObserver.observe(block.lineRef.current);
      }
    });

    return () => {
      textObserver.disconnect();
      iconObserver.disconnect();
      lineObserver.disconnect();
    };
  }, [SectionBlocks]);

  const incrementCount = (currentCount: number) => {
    if (currentCount < 100) {
      setTimeout(() => {
        setCount(currentCount + 1);
        incrementCount(currentCount + 1);
      }, 10);
    }
  };
  // end observe block

  return (
    <div className={classes.learn__z_pattern}>
      {SectionBlocks.map((block, index) =>
        index % 2 !== 0 ? (
          <div className={classes.learn__z_pattern__row} key={index}>
            <div
              ref={block.textRef}
              className={classes.learn__z_pattern__row__text}
            >
              <h3>{block.title}</h3>
              <p>{block.text}</p>
            </div>
            <div
              ref={block.iconRef}
              className={`${classes.learn__z_pattern__row__icon} ${
                classes[block.iconName!]
              }`}
            >
              {createIcon(block.iconName!)}
            </div>
            <div ref={block.lineRef} className={classes['row-line-icon']}>
              <LearnSectionLineIcon />
            </div>
          </div>
        ) : (
          <div className={classes.learn__z_pattern__row} key={index}>
            <div
              ref={block.iconRef}
              className={`${classes.learn__z_pattern__row__icon} ${
                classes[block.iconName!]
              }`}
            >
              {createIcon(block.iconName!)}
            </div>
            <div
              ref={block.textRef}
              className={classes.learn__z_pattern__row__text}
            >
              <h3>{block.title}</h3>
              <p>{block.text}</p>
            </div>

            <div ref={block.lineRef} className={classes['row-line-icon']}>
              <LearnSectionLineIcon />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default LearnSectionBlocks;
