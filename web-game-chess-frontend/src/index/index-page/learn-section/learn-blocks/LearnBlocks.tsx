import classes from "./LearnBlocks.module.scss";
import { Fragment, useEffect, useRef, useState } from "react";
import { createOneTimeObserver } from "../../../../shared/utils/functions/createOneTimeObserver";
import { mainColor } from "../../../../shared/utils/enums/colorMaps";
import LearnBlocksIcons from "./LearnBlocksIcons";
import { SectionData, sectionData } from "./LearnBlocksObjects";

type LearnBlocksProps = {};

const LearnBlocks = ({}: LearnBlocksProps) => {
  ///

  // for counter animation activation
  const [wasActived, setWasActived] = useState(false);
  // for counter animation
  const [count, setCount] = useState<number>(0);

  // to generate rows
  type SectionBlock = {
    title: string;
    text: string;
    iconName: string;
    iconRef: React.RefObject<HTMLDivElement>;
    textRef: React.RefObject<HTMLDivElement>;
    lineRef: React.RefObject<HTMLDivElement>;
  };

  const generateSectionBlock = (data: SectionData): SectionBlock => {
    return {
      title: data.title,
      text: data.text,
      iconName: data.iconName,
      iconRef: useRef<HTMLDivElement>(null),
      textRef: useRef<HTMLDivElement>(null),
      lineRef: useRef<HTMLDivElement>(null),
    };
  };

  const sectionBlocks: SectionBlock[] = sectionData.map((data) => generateSectionBlock(data));
  //*/

  // create learn section icons
  const createIcon = (iconName: string): JSX.Element => {
    switch (iconName) {
      case "pieces-icon":
        const links = ["white-rook", "black-queen", "white-pawn", "black-bishop", "white-king"] as const;

        const images: JSX.Element[] = links.map((link) => (
          <img key={link} src={`pieces/${link}.png`} alt={link} draggable={false} className={classes["piece-img"]} />
        ));

        return (
          <Fragment>
            {images}
            <LearnBlocksIcons iconName="board" />
          </Fragment>
        );

      case "counter-icon":
        const elements = Array.from({ length: 4 }).map((_, i) => {
          const value = Math.floor(count / Math.pow(3, -(i - 3)))
            .toString()
            .slice(-1);

          return (
            <div key={i} style={{ color: value === "3" ? mainColor.c3 : mainColor.c0 }}>
              {value}
            </div>
          );
        });

        return (
          <Fragment>
            <LearnBlocksIcons iconName="trophy" />
            <div className={classes.screen}>{elements}</div>
          </Fragment>
        );

      case "engine-icon":
        return <LearnBlocksIcons iconName="engine" />;

      case "message-icon":
        return (
          <div className={classes["message-con"]}>
            <LearnBlocksIcons iconName="message" />
            <LearnBlocksIcons iconName="message" />
            <LearnBlocksIcons iconName="message" />
            <LearnBlocksIcons iconName="community" />
          </div>
        );

      default:
        return <></>;
    }
  };
  //*/

  // to observe blocks
  useEffect(() => {
    let options: IntersectionObserverInit = {};

    const textObserverAction = (entry: IntersectionObserverEntry): void => {
      entry.target.classList.add(classes["active-text"]);
    };

    const textObserver: IntersectionObserver = createOneTimeObserver(textObserverAction, options);

    const iconObserverAction = (entry: IntersectionObserverEntry): void => {
      entry.target.classList.add(classes["active-icon"]);

      if (!wasActived && entry.target.classList.contains(classes["counter-icon"])) {
        setWasActived(true);
        setTimeout(() => incrementCount(0), 1000);
      }
    };

    const iconObserver: IntersectionObserver = createOneTimeObserver(iconObserverAction, options);

    const lineObserverAction = (entry: IntersectionObserverEntry): void => {
      entry.target.classList.add(classes["active-line"]);
    };

    const lineObserver: IntersectionObserver = createOneTimeObserver(lineObserverAction, options);

    sectionBlocks.forEach((block) => {
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
  }, [sectionBlocks]);
  //*/

  // for counter animation
  const incrementCount = (currentCount: number): void => {
    if (currentCount < 100) {
      setTimeout(() => {
        setCount(currentCount + 1);
        incrementCount(currentCount + 1);
      }, 10);
    }
  };
  //*/

  return (
    <div className={classes.zpattern}>
      {/* map blocks */}
      {sectionBlocks.map((block, index) =>
        index % 2 !== 0 ? (
          <div key={index} className={classes.zpattern__row}>
            <div ref={block.textRef} className={classes.zpattern__row__text}>
              <h3 className={classes["row-h3"]}>{block.title}</h3>
              <p className={classes["row-p"]}>{block.text}</p>
            </div>

            <div ref={block.iconRef} className={`${classes.zpattern__row__icon} ${classes[block.iconName]}`}>
              {createIcon(block.iconName)}
            </div>

            <div ref={block.lineRef} className={classes["row-line-icon"]}>
              <LearnBlocksIcons iconName="pawnLine" />
            </div>
          </div>
        ) : (
          <div key={index} className={classes.zpattern__row}>
            <div ref={block.iconRef} className={`${classes.zpattern__row__icon} ${classes[block.iconName!]}`}>
              {createIcon(block.iconName)}
            </div>

            <div ref={block.textRef} className={classes.zpattern__row__text}>
              <h3 className={classes["row-h3"]}>{block.title}</h3>
              <p className={classes["row-p"]}>{block.text}</p>
            </div>

            <div ref={block.lineRef} className={classes["row-line-icon"]}>
              <LearnBlocksIcons iconName="pawnLine" />
            </div>
          </div>
        )
      )}
      {/* --- */}
    </div>
  );
};

export default LearnBlocks;
