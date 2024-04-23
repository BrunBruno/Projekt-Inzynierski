import classes from './LearnBlocks.module.scss';
import { useEffect, useRef, useState } from 'react';
import { createOneTimeObserver } from '../../../../shared/utils/functions/createOneTimeObserver';
import { mainColor } from '../../../../shared/utils/enums/colorMaps';
import LearnSectionIcons from './LearnSectionIcons';

const LearnBlocks = () => {
  const [wasActived, setWasActived] = useState(false);
  const [count, setCount] = useState<number>(0);

  const SectionBlocks = [
    {
      title: 'Ultimate Chess Experience',
      text: "Immerse yourself in the ultimate chess experience on our cutting-edge web app. Whether you're a seasoned grandmaster or just starting out, there's something for everyone. Enjoy seamless gameplay, stunning visuals, and intuitive controls. Sharpen your skills with tutorials, puzzles, and strategy guides. Connect with players worldwide, challenge friends, or join tournaments. With regular updates, the excitement never ends. Join us today for an unforgettable chess adventure!",
      iconName: 'pieces-icon',
      iconRef: useRef<HTMLDivElement>(null),
      textRef: useRef<HTMLDivElement>(null),
      lineRef: useRef<HTMLDivElement>(null),
    },
    {
      title: 'Unlock Your Potential',
      text: 'Explore chess engine ratings to uncover the secrets behind your performance. Gain insights into your strengths and areas for improvement. Track your progress and set ambitious goals to climb the rating ladder. Utilize chess engines to fine-tune your strategy and optimize decision-making. Embark on a journey of self-discovery and unlock your true chess potential.',
      iconName: 'counter-icon',
      iconRef: useRef<HTMLDivElement>(null),
      textRef: useRef<HTMLDivElement>(null),
      lineRef: useRef<HTMLDivElement>(null),
    },
    {
      title: 'Mastering Chess with AI',
      text: "Harness the power of cutting-edge chess engines to dominate the board. Explore the realm of artificial intelligence, where every move leads to victory. Whether you're a novice or a seasoned player, elevate your game with the strategic prowess of AI. Analyze positions with precision, refine tactics, and challenge grandmasters. Rewrite the rules of chess mastery with the assistance of AI.",
      iconName: 'engine-icon',
      iconRef: useRef<HTMLDivElement>(null),
      textRef: useRef<HTMLDivElement>(null),
      lineRef: useRef<HTMLDivElement>(null),
    },
    {
      title: 'Your Chess Community Awaits',
      text: "Join our vibrant chess community, where interaction is paramount and knowledge flows freely. Explore our blog section, a hub for enthusiasts to discuss strategies, analyze games, and explore the latest trends in chess. From beginner tips to advanced tactics, our diverse range of articles caters to all levels of players. Join the conversation, ask questions, and share insights with fellow enthusiasts worldwide. Let's enrich our chess experience together, fostering a community built on passion, camaraderie, and the timeless pursuit of improvement.",
      iconName: 'message-icon',
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
              style={{ color: value === '3' ? mainColor.c3 : mainColor.c0 }}
            >
              {value}
            </div>
          );
        });
        return <>{elements}</>;
      case 'engine-icon':
        return (
          <div className={classes['engine-con']}>
            <LearnSectionIcons iconName="engine" />
          </div>
        );
      case 'message-icon':
        return (
          <div className={classes['message-con']}>
            <LearnSectionIcons iconName="message" />
            <LearnSectionIcons iconName="message" />
            <LearnSectionIcons iconName="message" />
          </div>
        );
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

  // useEffect(() => {
  //   // Function to animate the line
  //   function animateLine(line) {
  //     let x1 = 1; // Starting x1 value
  //     const targetX1 = 7; // Ending x1 value
  //     const duration = 500; // Animation duration in milliseconds
  //     const fps = 60; // Frames per second
  //     const frameDuration = 1000 / fps; // Duration of each frame

  //     const totalFrames = duration / frameDuration; // Total number of frames

  //     // Calculate the distance to move per frame
  //     const dx = (targetX1 - x1) / totalFrames;

  //     // Animation function
  //     function updateLine() {
  //       x1 += dx; // Increment x1
  //       line.setAttribute('x1', x1); // Update the x1 attribute
  //       if (x1 < targetX1) {
  //         // Continue animating until we reach the target x1
  //         requestAnimationFrame(updateLine);
  //       }
  //     }

  //     // Start the animation
  //     updateLine();
  //   }

  //   // Get all line elements
  //   const lines = document.querySelectorAll(classes.st0);

  //   // Trigger the animation for each line
  //   lines.forEach((line) => {
  //     animateLine(line);
  //   });
  // }, []);

  return (
    <div className={classes.zpattern}>
      {SectionBlocks.map((block, index) =>
        index % 2 !== 0 ? (
          <div className={classes.zpattern__row} key={index}>
            <div ref={block.textRef} className={classes.zpattern__row__text}>
              <h3 className={classes['row-h3']}>{block.title}</h3>
              <p className={classes['row-p']}>{block.text}</p>
            </div>
            <div
              ref={block.iconRef}
              className={`${classes.zpattern__row__icon} ${
                classes[block.iconName!]
              }`}
            >
              {createIcon(block.iconName!)}
            </div>
            <div ref={block.lineRef} className={classes['row-line-icon']}>
              <LearnSectionIcons iconName="pawnLine" />
            </div>
          </div>
        ) : (
          <div className={classes.zpattern__row} key={index}>
            <div
              ref={block.iconRef}
              className={`${classes.zpattern__row__icon} ${
                classes[block.iconName!]
              }`}
            >
              {createIcon(block.iconName!)}
            </div>
            <div ref={block.textRef} className={classes.zpattern__row__text}>
              <h3 className={classes['row-h3']}>{block.title}</h3>
              <p className={classes['row-p']}>{block.text}</p>
            </div>

            <div ref={block.lineRef} className={classes['row-line-icon']}>
              <LearnSectionIcons iconName="pawnLine" />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default LearnBlocks;
