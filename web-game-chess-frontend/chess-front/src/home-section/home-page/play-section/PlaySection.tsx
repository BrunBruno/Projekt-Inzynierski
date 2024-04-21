import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import classes from './PlaySection.module.scss';
import PlaySectionIcons from './PlaySectionIcons';
import { HandleOnScroll } from '../../../shared/utils/types/handleOnScroll';
import { mainColor } from '../../../shared/utils/enums/colorMaps';

type PlaySectionProps = {
  sectionRef: React.RefObject<HTMLElement>;
};

const PlaySection = forwardRef<HandleOnScroll, PlaySectionProps>(
  (
    { sectionRef }: PlaySectionProps,
    ref: React.ForwardedRef<HandleOnScroll>
  ) => {
    const wh = window.innerHeight;
    const stripSize = 40;
    const h = window.innerHeight * 0.5;

    const boardRef = useRef<HTMLDivElement>(null);
    const innerBoardRef = useRef<HTMLDivElement>(null);
    const boardIntroRef = useRef<HTMLDivElement>(null);

    const [isIntroOpen, setIsIntroOpen] = useState<boolean>(false);

    const handleBoardOnScroll = (): void => {
      const element = boardRef.current;
      if (element) {
        const parentRect = element.getBoundingClientRect();
        const y = parentRect.top;

        if (y > -wh && y < wh) {
          const innerElement = innerBoardRef.current;
          if (innerElement) {
            if (y < wh * 0.5 && y > -wh * 0.5) {
              innerElement.classList.add(classes['board-intro']);
            } else {
              innerElement.classList.remove(classes['board-intro']);
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

    const handleIntroOnScroll = (): void => {
      const element = boardIntroRef.current;
      if (element) {
        const introRect = element.getBoundingClientRect();
        const y = introRect.top;
        const p1 = -(y - h) / 10;
        const p2 = p1 + stripSize;

        if (p1 >= -stripSize && p1 <= 100 && p2 >= 0 && p2 <= 100 + stripSize) {
          element.style.backgroundImage = `linear-gradient(60deg, ${mainColor.c0} ${p1}%, ${mainColor.c4} ${p1}%, ${mainColor.c4} ${p2}%, ${mainColor.c0} ${p2}%)`;
        }

        if (!isIntroOpen && y < 100) {
          setIsIntroOpen(true);
        }
      }
    };

    const handleOnScroll = (): void => {
      handleIntroOnScroll();
      handleBoardOnScroll();
    };

    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));

    const elementRefs: { [key: string]: React.RefObject<HTMLDivElement> } = {};
    const generateGrid = (): JSX.Element[] => {
      const rows: JSX.Element[] = [];

      const numberOfRows = 8;
      for (let i = 0; i < numberOfRows; i++) {
        const generateTiles = (): JSX.Element[] => {
          const tiles: JSX.Element[] = [];

          const numberOfTiles = 8;
          for (let j = 0; j < numberOfTiles; j++) {
            const key = `${i + 1}-${j + 1}`;
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

    const time = 30;
    const done: string[] = [];
    const makeWave = (key: string): void => {
      let [row, col]: [number, number] = key.split('-').map(Number) as [
        number,
        number,
      ];
      if (row === 0 || row === 9 || col === 0 || col === 9) {
        return;
      }

      let neighborKey: string = `${row}-${col}`;

      if (done.includes(neighborKey)) {
        return;
      }
      done.push(neighborKey);

      const neighborElement = elementRefs[key];
      if (neighborElement && neighborElement.current) {
        neighborElement.current.style.filter = 'brightness(200%)';
        setTimeout(() => {
          neighborElement.current!.style.filter = 'brightness(50%)';
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

    const generatePawns = (): JSX.Element[] => {
      const tiles: JSX.Element[] = [];

      const numberOfTiles = 64;
      for (let i = 0; i < numberOfTiles; i++) {
        const innerKey = `${Math.floor(i / 8) + 1}-${(i % 8) + 1}`;
        tiles.push(
          <div
            key={i}
            className={classes.pawn}
            onClick={() => makeWave(innerKey)}
          />
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
      <section id="play-section" ref={sectionRef} className={classes.play}>
        <div className={classes.play__content}>
          <div
            ref={boardIntroRef}
            className={`${classes.play__content__intro} 
          ${isIntroOpen ? classes['open-intro'] : ''}`}
          >
            <h2>LET'S GET </h2>
            <h2>STARTED </h2>
          </div>
          <div ref={boardRef} className={classes.play__content__board}>
            <div className={classes.play__content__board__grid}>
              <div
                ref={innerBoardRef}
                className={classes.play__content__board__grid__inner}
                onClick={() => console.log('aaaa')}
              >
                <div id="indicator" className={classes.indicator} />
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
        <div className={classes.play__actions}>
          <div className={classes.play__actions__buttons}>
            <h3>Start playing now!</h3>
            <h4>
              Join our community and start playing users at your level or simply
              join random game and enjoy chess.
            </h4>
            <button className={classes['vs-player-button']}>
              <PlaySectionIcons iconName="online" />
              <span>PLAY ONLINE</span>
            </button>
            <button className={classes['vs-computer-button']}>
              <PlaySectionIcons iconName="offline" />
              <span>PLAY OFFLINE</span>
            </button>
          </div>
        </div>
      </section>
    );
  }
);

export default PlaySection;
