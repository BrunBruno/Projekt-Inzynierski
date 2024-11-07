import classes from "./LearnBlocks.module.scss";
import { RefObject, useEffect, useRef, useState } from "react";
import { createOneTimeObserver } from "../../../../shared/utils/functions/observers";
import { mainColor } from "../../../../shared/utils/objects/colorMaps";
import { SectionData, sectionData } from "./LearnBlocksData";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { learnBlocksIcons } from "./LearnBlocksIcons";
import { defaultPiecesImages } from "../../../../shared/svgs/iconsMap/DefaultPieceImageSvgs";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";
import { BlackPieceTag, PieceTag, WhitePieceTag } from "../../../../shared/utils/objects/constantLists";
import { getPieceSideColor } from "../../../../shared/utils/objects/piecesNameMaps";

// row block components
interface SectionBlock {
  title: string;
  text: string;
  iconName: string;
  iconRef: RefObject<HTMLDivElement>;
  textRef: RefObject<HTMLDivElement>;
  lineRef: RefObject<HTMLDivElement>;
}

type LearnBlocksProps = {};

const LearnBlocks = ({}: LearnBlocksProps) => {
  ///

  // for counter animation activation
  const [wasActive, setWasActive] = useState(false);
  // for counter animation
  const [count, setCount] = useState<number>(0);

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
  const createIcon = (iconName: string, ref: RefObject<HTMLDivElement>): JSX.Element => {
    switch (iconName) {
      case "pieces-icon": {
        const pieces: (WhitePieceTag | BlackPieceTag)[] = ["R", "q", "P", "b", "K"];

        const images: JSX.Element[] = pieces.map((piece, i) => (
          <IconCreator
            key={`${i}-${piece}`}
            icons={defaultPiecesImages}
            iconName={piece.toLowerCase() as PieceTag}
            iconClass={classes["piece-img"]}
            color={getPieceSideColor(piece as PieceTag)}
          />
        ));

        return (
          <div ref={ref} className={classes["pieces-con"]}>
            {images}
            <IconCreator icons={learnBlocksIcons} iconName={"gameBoard"} iconClass={classes["board-svg"]} />
          </div>
        );
      }

      case "counter-icon": {
        const elements = Array.from({ length: 4 }).map((_, i: number) => {
          const value = Math.floor(count / Math.pow(3, -(i - 3)))
            .toString()
            .slice(-1);

          return (
            <p
              key={i}
              style={{ color: value === "3" ? mainColor.c3 : mainColor.c0 }}
              className={classes["counter-number"]}
            >
              {value}
            </p>
          );
        });

        return (
          <div ref={ref} className={classes["counter-con"]}>
            <IconCreator icons={learnBlocksIcons} iconName={"trophy"} iconClass={classes["trophy-svg"]} />
            <div className={classes.screen}>{elements}</div>
          </div>
        );
      }

      case "engine-icon":
        return (
          <div ref={ref} className={classes["engine-con"]}>
            <IconCreator icons={learnBlocksIcons} iconName={"engine"} iconClass={classes["engine-svg"]} />
            <IconCreator icons={learnBlocksIcons} iconName={"motherBoard"} iconClass={classes["mother-board-svg"]} />
          </div>
        );

      case "message-icon":
        return (
          <div ref={ref} className={classes["message-con"]}>
            <IconCreator icons={learnBlocksIcons} iconName={"message"} iconClass={classes["message-svg"]} />
            <IconCreator icons={learnBlocksIcons} iconName={"message"} iconClass={classes["message-svg"]} />
            <IconCreator icons={learnBlocksIcons} iconName={"message"} iconClass={classes["message-svg"]} />
            <IconCreator icons={learnBlocksIcons} iconName={"community"} iconClass={classes["community-svg"]} />
          </div>
        );

      default:
        return <></>;
    }
  };
  //*/

  // to observe blocks
  useEffect(() => {
    const options: IntersectionObserverInit = {};

    const textObserverAction = (entry: IntersectionObserverEntry): void => {
      entry.target.classList.add(classes["active-text"]);
    };

    const textObserver: IntersectionObserver = createOneTimeObserver(textObserverAction, options);

    const iconObserverAction = (entry: IntersectionObserverEntry): void => {
      entry.target.classList.add(classes["active-icon"]);

      if (!wasActive && entry.target.classList.contains(classes["counter-con"])) {
        setWasActive(true);
        setTimeout(() => incrementCount(0), 1000);
      }
    };

    const iconObserver: IntersectionObserver = createOneTimeObserver(iconObserverAction, options);

    const lineObserverAction = (entry: IntersectionObserverEntry): void => {
      entry.target.classList.add(classes["active-line"]);
    };

    const lineObserver: IntersectionObserver = createOneTimeObserver(lineObserverAction, options);

    sectionBlocks.forEach((block: SectionBlock) => {
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
      {sectionBlocks.map((block: SectionBlock, index: number) =>
        index % 2 !== 0 ? (
          <div key={index} className={classes.zpattern__row}>
            {/* text */}
            <div ref={block.textRef} className={classes.zpattern__row__text}>
              <h3 className={classes["row-h3"]}>
                <IconCreator
                  icons={symbolIcons}
                  iconName={"roundArrow"}
                  color={mainColor.c0}
                  iconClass={classes["text-icon"]}
                />
                <span>{block.title}</span>
              </h3>
              <p className={classes["row-p"]}>{block.text}</p>
            </div>

            {/* icon */}
            <div
              className={`
                ${classes.zpattern__row__icon} 
                ${classes[block.iconName]}
              `}
            >
              {createIcon(block.iconName, block.iconRef)}
            </div>

            {/* line */}
            <div ref={block.lineRef} className={classes["row-line-icon"]}>
              <IconCreator icons={learnBlocksIcons} iconName={"pawnLine"} iconClass={classes["pawn-line"]} />
            </div>
          </div>
        ) : (
          <div key={index} className={classes.zpattern__row}>
            {/* icon */}
            <div
              className={`
                ${classes.zpattern__row__icon} 
                ${classes[block.iconName]}
              `}
            >
              {createIcon(block.iconName, block.iconRef)}
            </div>

            {/* text */}
            <div ref={block.textRef} className={classes.zpattern__row__text}>
              <h3 className={classes["row-h3"]}>
                <IconCreator
                  icons={symbolIcons}
                  iconName={"roundArrow"}
                  color={mainColor.c0}
                  iconClass={classes["text-icon"]}
                />
                <span>{block.title}</span>
              </h3>
              <p className={classes["row-p"]}>{block.text}</p>
            </div>

            {/* line */}
            <div ref={block.lineRef} className={classes["row-line-icon"]}>
              <IconCreator icons={learnBlocksIcons} iconName={"pawnLine"} iconClass={classes["pawn-line"]} />
            </div>
          </div>
        )
      )}
      {/* --- */}
    </div>
  );
};

export default LearnBlocks;
