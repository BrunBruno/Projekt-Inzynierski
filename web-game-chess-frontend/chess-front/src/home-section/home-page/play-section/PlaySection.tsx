import { useEffect, useRef } from 'react';
import {
  streightChessboard,
  pieceImageMap,
} from '../../../shared/options/ChessOptions';

import classes from './PlaySection.module.scss';

function PlaySection() {
  const boardRef = useRef<HTMLDivElement>(null);
  const innerBoardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (boardRef.current) {
        const parentRect = boardRef.current.getBoundingClientRect();
        const y = parentRect.top;
        const h = window.innerHeight * 0.5;

        if (innerBoardRef.current) {
          if (y < h && y > -h) {
            console.log('aaa');
            innerBoardRef.current.classList.add(classes['board-intro']);
          } else {
            innerBoardRef.current.classList.remove(classes['board-intro']);
          }
        }

        const scale: number = Math.pow(
          Math.E,
          -(1 / Math.pow(10, 6)) * Math.pow(y, 2)
        );
        const rotate: number = -(1 / 100) * y;
        boardRef.current.style.transform = `scale(${scale}) rotateZ(${rotate}deg)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [boardRef]);

  const generateGrid = (): JSX.Element[] => {
    const rows: JSX.Element[] = [];

    const numberOfRows = 8;
    for (let i = 0; i < numberOfRows; i++) {
      const generateTiles = (): JSX.Element[] => {
        const tiles: JSX.Element[] = [];

        const numberOfTiles = 8;
        for (let j = 0; j < numberOfTiles; j++) {
          tiles.push(<div key={i + '-' + j} className={classes.tile}></div>);
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

  const generatePawns = (): JSX.Element[] => {
    const tiles: JSX.Element[] = [];

    const numberOfTiles = 64;
    for (let i = 0; i < numberOfTiles; i++) {
      const piece = streightChessboard[i];
      const imageUrl = pieceImageMap[piece];

      tiles.push(
        <div key={i} className={classes.pawn}>
          {piece !== ' ' && <img src={`pieces/${imageUrl}`} alt={piece} />}
          {piece !== ' ' && <p />}
        </div>
      );
    }

    return tiles;
  };

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

  return (
    <section id="play-section" className={classes.play}>
      <div className={classes.play__content}>
        <div className={classes.play__content__intro}>
          <h2>LET'S GET </h2>
          <h2>STARTED </h2>
        </div>
        <div ref={boardRef} className={classes.play__content__board}>
          <div className={classes.play__content__board__grid}>
            <div
              ref={innerBoardRef}
              className={classes.play__content__board__grid__inner}
            >
              <div id="indicator" className={classes.indicator}></div>
              {generateGrid()}
            </div>
            <div
              className={classes.play__content__board__grid__outer}
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
            >
              {generatePawns()}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.play__actions}></div>
    </section>
  );
}

export default PlaySection;
