import React, { forwardRef, useImperativeHandle, useRef } from "react";
import classes from "./PlayBoard.module.scss";
import LogoIconSvg from "../../../../shared/svgs/LogoIconSvg";
import { HandleOnScroll } from "../../../../shared/utils/types/commonTypes";

type PlayBoardProps = {};

const PlayBoard = forwardRef<HandleOnScroll, PlayBoardProps>(
  ({}: PlayBoardProps, ref: React.ForwardedRef<HandleOnScroll>) => {
    ///

    const wh = window.innerHeight;

    // whole board div ref
    // for handle on scroll
    const boardRef = useRef<HTMLDivElement>(null);
    // inner and outer sections of board refs
    // for handling on intersection event
    const innerBoardRef = useRef<HTMLDivElement>(null);
    const outerBoardRef = useRef<HTMLDivElement>(null);
    // ref for each tile in board
    const elementRefs: { [key: string]: React.RefObject<HTMLDivElement> } = {};

    // handle board on scroll
    const handleOnScroll = (): void => {
      const innerElement = innerBoardRef.current;
      const outerElement = outerBoardRef.current;

      if (window.innerWidth > 700 && window.innerWidth < 2000) {
        const element = boardRef.current;
        if (element) {
          const parentRect = element.getBoundingClientRect();
          const y = parentRect.top;

          if (y > -wh && y < wh) {
            // lighting up board
            if (innerElement && outerElement) {
              if (y < wh * 0.5 && y > -wh * 0.5) {
                innerElement.classList.add(classes["visible-inner"]);
                outerElement.classList.add(classes["visible-outer"]);
              } else {
                innerElement.classList.remove(classes["visible-inner"]);
                outerElement.classList.remove(classes["visible-outer"]);
              }
            }

            const scale: number = Math.pow(Math.E, -(1 / Math.pow(10, 6)) * Math.pow(y, 2));
            const rotate: number = -(1 / 100) * y;

            // rotate board based on user position
            element.style.transform = `scale(${scale}) rotateZ(${rotate}deg)`;
          }
        }
      } else {
        // clear on too small and too big screens
        if (innerElement && outerElement) {
          innerElement.classList.add(classes["visible-inner"]);
          outerElement.classList.add(classes["visible-outer"]);

          const element = boardRef.current;
          if (element) {
            element.style.transform = `scale(${1}) rotateZ(${0}deg)`;
          }
        }
      }
    };

    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));
    //*/

    // generate board
    const generateGrid = (): JSX.Element[] => {
      const boardRows: JSX.Element[] = [];

      const nRows = 8;
      for (let i = 0; i < nRows; i++) {
        const generateTiles = (): JSX.Element[] => {
          const rowTiles: JSX.Element[] = [];

          const nCols = 8;
          for (let j = 0; j < nCols; j++) {
            const key = `${j + 1}-${i + 1}`;

            if (!elementRefs[key]) {
              elementRefs[key] = React.createRef<HTMLDivElement>();
            }

            rowTiles.push(<div ref={elementRefs[key]} key={key} className={classes.tile} />);
          }

          return rowTiles;
        };

        boardRows.push(
          <div key={i} className={classes["grid-row"]}>
            {generateTiles()}
          </div>
        );
      }

      return boardRows;
    };
    //*/

    // handle on click
    // to create wave pattern
    const handleBoardOnClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): string => {
      // get cor of tiles based on cursor position
      const getPosition = (c_pos: number, p_pos: number, p_size: number): number => {
        return Math.floor((c_pos - p_pos) / (p_size / 8)) + 1;
      };

      const parentRect = event.currentTarget.getBoundingClientRect();

      const x: number = getPosition(event.clientX, parentRect.left, parentRect.width);
      const y: number = getPosition(event.clientY, parentRect.top, parentRect.height);

      const key: string = `${x}-${y}`;

      return key;
    };

    const time = 30;
    const done: string[] = [];
    const makeWave = (key: string): void => {
      let [row, col]: [number, number] = key.split("-").map(Number) as [number, number];

      let neighborKey: string = `${row}-${col}`;

      if (row === 0 || row === 9 || col === 0 || col === 9 || done.includes(neighborKey)) {
        return;
      }
      done.push(neighborKey);

      const neighborElement = elementRefs[key];
      if (neighborElement && neighborElement.current) {
        neighborElement.current.style.filter = "brightness(200%)";

        setTimeout(() => {
          if (neighborElement.current) {
            neighborElement.current.style.filter = "brightness(50%)";
          }
        }, time);
      }

      if (done.length < 64) {
        if (row > 0 && row < 9 && col > 0 && col < 9) {
          setTimeout(() => {}, 1000);
          setTimeout(() => makeWave(`${row - 1}-${col}`), time);
          setTimeout(() => makeWave(`${row + 1}-${col}`), time);
          setTimeout(() => makeWave(`${row}-${col - 1}`), time);
          setTimeout(() => makeWave(`${row}-${col + 1}`), time);
        }
      } else {
        setTimeout(() => {
          done.length = 0;
        }, time);
      }
    };
    //*/

    // handle board hover
    // to move "flashlight" over board
    const handleOnGridHover = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const parentRect = event.currentTarget.getBoundingClientRect();
      const offsetX = event.clientX - parentRect.left;
      const offsetY = event.clientY - parentRect.top;

      const indicator = document.getElementById("indicator");
      if (indicator) {
        indicator.style.left = `${offsetX}px`;
        indicator.style.top = `${offsetY}px`;
      }
    };
    //*/

    // to show or hide indicator flashlight
    const handleIndicatorVisibility = (opacity: number) => {
      const indicator = document.getElementById("indicator");
      if (indicator) {
        indicator.style.opacity = opacity.toString();
      }
    };
    //*/

    return (
      <div ref={boardRef} className={classes.board}>
        <div className={classes.board__grid}>
          {/* inner board */}
          <div ref={innerBoardRef} className={classes.board__grid__inner}>
            <div id="indicator" className={classes.indicator} />
            {generateGrid()}
          </div>
          {/* --- */}

          {/* outer board */}
          <div
            ref={outerBoardRef}
            className={classes.board__grid__outer}
            onMouseMove={(event) => handleOnGridHover(event)}
            onMouseEnter={() => {
              handleIndicatorVisibility(1);
            }}
            onMouseLeave={() => {
              handleIndicatorVisibility(0);
            }}
            onClick={(event) => {
              makeWave(handleBoardOnClick(event));
            }}
          >
            <LogoIconSvg iconClass={classes["board-svg"]} />
          </div>
          {/* --- */}
        </div>
      </div>
    );
  }
);

export default PlayBoard;
