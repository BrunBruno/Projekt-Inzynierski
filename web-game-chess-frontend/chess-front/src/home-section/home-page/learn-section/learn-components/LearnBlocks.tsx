import classes from "./LearnBlocks.module.scss";
import { useEffect, useRef, useState } from "react";
import { createOneTimeObserver } from "../../../../shared/utils/functions/createOneTimeObserver";
import { mainColor } from "../../../../shared/utils/enums/colorMaps";
import LearnSectionIcons from "./LearnSectionIcons";
import { SectionData, sectionData } from "./LearnBlocksElements";

const LearnBlocks = () => {
  const [wasActived, setWasActived] = useState(false);
  const [count, setCount] = useState<number>(0);

  const generateSectionBlock = (data: SectionData) => {
    return {
      title: data.title,
      text: data.text,
      iconName: data.iconName,
      iconRef: useRef<HTMLDivElement>(null),
      textRef: useRef<HTMLDivElement>(null),
      lineRef: useRef<HTMLDivElement>(null),
    };
  };

  const SectionBlocks = sectionData.map((data) => generateSectionBlock(data));

  // create learn section icons
  const createIcon = (iconName: string): JSX.Element => {
    switch (iconName) {
      case "pieces-icon":
        const links = [
          "white-rook",
          "black-queen",
          "white-pawn",
          "black-bishop",
          "white-king",
        ] as const;

        const images = links.map((link) => (
          <img
            key={link}
            src={`pieces/${link}.png`}
            alt={link}
            draggable={false}
            className={classes["piece-img"]}
          />
        ));

        return (
          <>
            {images}
            <LearnSectionIcons iconName="board" />
          </>
        );

      case "counter-icon":
        const elements = Array.from({ length: 4 }).map((_, i) => {
          const value = Math.floor(count / Math.pow(3, -(i - 3)))
            .toString()
            .slice(-1);

          return (
            <div
              key={i}
              style={{ color: value === "3" ? mainColor.c3 : mainColor.c0 }}
            >
              {value}
            </div>
          );
        });
        return (
          <>
            <LearnSectionIcons iconName="trophy" />
            <div className={classes.screen}>{elements}</div>
          </>
        );
      case "engine-icon":
        return <LearnSectionIcons iconName="engine" />;
      case "message-icon":
        return (
          <div className={classes["message-con"]}>
            <LearnSectionIcons iconName="message" />
            <LearnSectionIcons iconName="message" />
            <LearnSectionIcons iconName="message" />
            <LearnSectionIcons iconName="community" />
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
      entry.target.classList.add(classes["active-text"]);
    };
    const textObserver: IntersectionObserver = createOneTimeObserver(
      textObserverAction,
      {}
    );

    const iconObserverAction = (entry: IntersectionObserverEntry): void => {
      entry.target.classList.add(classes["active-icon"]);

      if (
        !wasActived &&
        entry.target.classList.contains(classes["counter-icon"])
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
      entry.target.classList.add(classes["active-line"]);
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
    <div className={classes.zpattern}>
      {SectionBlocks.map((block, index) =>
        index % 2 !== 0 ? (
          <div className={classes.zpattern__row} key={index}>
            <div ref={block.textRef} className={classes.zpattern__row__text}>
              <h3 className={classes["row-h3"]}>{block.title}</h3>
              <p className={classes["row-p"]}>{block.text}</p>
            </div>
            <div
              ref={block.iconRef}
              className={`${classes.zpattern__row__icon} ${
                classes[block.iconName]
              }`}
            >
              {createIcon(block.iconName)}
            </div>
            <div ref={block.lineRef} className={classes["row-line-icon"]}>
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
              <h3 className={classes["row-h3"]}>{block.title}</h3>
              <p className={classes["row-p"]}>{block.text}</p>
            </div>

            <div ref={block.lineRef} className={classes["row-line-icon"]}>
              <LearnSectionIcons iconName="pawnLine" />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default LearnBlocks;
