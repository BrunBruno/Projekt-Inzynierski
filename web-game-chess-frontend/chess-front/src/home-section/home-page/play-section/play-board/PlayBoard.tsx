import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import classes from './PlayBoard.module.scss';
import { HandleOnScroll } from '../../../../shared/utils/types/handleOnScroll';
import LogoIconSvg from '../../../../shared/svgs/LogoIconSvg';

type PlayBoardProps = {};

const PlayBoard = forwardRef<HandleOnScroll, PlayBoardProps>(
  ({}: PlayBoardProps, ref: React.ForwardedRef<HandleOnScroll>) => {
    //vars
    const wh = window.innerHeight;

    // whole board div ref
    // for handle on scroll
    const boardRef = useRef<HTMLDivElement>(null);
    // inner and outer sections of board refs
    // for handling on intersection event
    const innerBoardRef = useRef<HTMLDivElement>(null);
    const outerBoardRef = useRef<HTMLDivElement>(null);

    // hadnle board on scroll
    const handleOnScroll = (): void => {
      const element = boardRef.current;
      if (element) {
        const parentRect = element.getBoundingClientRect();
        const y = parentRect.top;

        if (y > -wh && y < wh) {
          const innerElement = innerBoardRef.current;
          const outerElement = outerBoardRef.current;
          if (innerElement && outerElement) {
            if (y < wh * 0.5 && y > -wh * 0.5) {
              innerElement.classList.add(classes['visible-inner']);
              outerElement.classList.add(classes['visible-outer']);
            } else {
              innerElement.classList.remove(classes['visible-inner']);
              outerElement.classList.remove(classes['visible-outer']);
            }
          }

          const scale: number = Math.pow(
            Math.E,
            -(1 / Math.pow(10, 6)) * Math.pow(y, 2)
          );
          const rotate: number = -(1 / 100) * y;

          element.style.transform = `scale(${scale}) rotateZ(${rotate}deg)`;
        }
      }
    };

    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));
    // end hadnle board on scroll

    // genrate board
    const elementRefs: { [key: string]: React.RefObject<HTMLDivElement> } = {};
    const generateGrid = (): JSX.Element[] => {
      const rows: JSX.Element[] = [];

      const numberOfRows = 8;
      for (let i = 0; i < numberOfRows; i++) {
        const generateTiles = (): JSX.Element[] => {
          const tiles: JSX.Element[] = [];

          const numberOfTiles = 8;
          for (let j = 0; j < numberOfTiles; j++) {
            const key = `${j + 1}-${i + 1}`;
            if (!elementRefs[key]) {
              elementRefs[key] = React.createRef<HTMLDivElement>();
            }

            tiles.push(
              <div ref={elementRefs[key]} key={key} className={classes.tile} />
            );
          }

          return tiles;
        };

        rows.push(
          <div key={i} className={classes['grid-row']}>
            {generateTiles()}
          </div>
        );
      }

      return rows;
    };
    // end generate board

    // handle on click
    const handleBoardOnClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): string => {
      const getPosition = (
        cpos: number,
        ppos: number,
        psize: number
      ): number => {
        return Math.floor((cpos - ppos) / (psize / 8)) + 1;
      };
      const parentRect = event.currentTarget.getBoundingClientRect();

      const x: number = getPosition(
        event.clientX,
        parentRect.left,
        parentRect.width
      );
      const y: number = getPosition(
        event.clientY,
        parentRect.top,
        parentRect.height
      );

      const key: string = `${x}-${y}`;

      return key;
    };

    const time = 30;
    const done: string[] = [];
    const makeWave = (key: string): void => {
      let [row, col]: [number, number] = key.split('-').map(Number) as [
        number,
        number,
      ];

      let neighborKey: string = `${row}-${col}`;

      if (
        row === 0 ||
        row === 9 ||
        col === 0 ||
        col === 9 ||
        done.includes(neighborKey)
      ) {
        return;
      }
      done.push(neighborKey);

      const neighborElement = elementRefs[key];
      if (neighborElement && neighborElement.current) {
        neighborElement.current.style.filter = 'brightness(200%)';
        setTimeout(() => {
          if (neighborElement.current) {
            neighborElement.current.style.filter = 'brightness(50%)';
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
    // end handle on click

    // handle board hover
    const handleOnGridHover = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      const parentRect = event.currentTarget.getBoundingClientRect();
      const offsetX = event.clientX - parentRect.left;
      const offsetY = event.clientY - parentRect.top;

      const indicator = document.getElementById('indicator');
      if (indicator) {
        indicator.style.left = `${offsetX}px`;
        indicator.style.top = `${offsetY}px`;
      }
    };
    // end handle board hover

    return (
      <div ref={boardRef} className={classes.board}>
        <div className={classes.board__grid}>
          <div ref={innerBoardRef} className={classes.board__grid__inner}>
            <div id="indicator" className={classes.indicator} />
            {generateGrid()}
          </div>
          <div
            ref={outerBoardRef}
            className={classes.board__grid__outer}
            onMouseMove={(event) => handleOnGridHover(event)}
            onMouseEnter={() => {
              const indicator = document.getElementById('indicator');
              if (indicator) {
                indicator.style.opacity = '1';
              }
            }}
            onMouseLeave={() => {
              const indicator = document.getElementById('indicator');
              if (indicator) {
                indicator.style.opacity = '0';
              }
            }}
            onClick={(event) => {
              makeWave(handleBoardOnClick(event));
            }}
          >
            <LogoIconSvg iconClass={classes['board-svg']} />
          </div>
        </div>
      </div>
    );
  }
);

export default PlayBoard;
