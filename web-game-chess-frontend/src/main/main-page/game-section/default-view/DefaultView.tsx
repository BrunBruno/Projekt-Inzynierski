import { useEffect, useRef, useState } from "react";
import classes from "./DefaultView.module.scss";
import { MousePosition } from "../../../../shared/utils/types/commonTypes";

let timer: number;

type DefaultViewProps = {};

function DefaultView({}: DefaultViewProps) {
  ///

  const boardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  // to handle mouse movement and map to board movement
  useEffect(() => {
    const maxDeg = 20;
    const ww05 = window.innerWidth / 2;
    const wh05 = window.innerHeight / 2;

    const handleMouseMove = (event: MouseEvent) => {
      const newX = (maxDeg / ww05) * event.clientX - maxDeg;
      const newY = -(maxDeg / wh05) * event.clientY + maxDeg;
      setMousePosition({ x: newX, y: newY });

      const innerBoard = innerRef.current;
      if (innerBoard) {
        innerBoard.classList.add(classes.active);
        clearTimeout(timer);

        timer = setTimeout(() => {
          innerBoard.classList.remove(classes.active);
        }, 100);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
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

          rowTiles.push(<div key={key} className={classes.tile} />);
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

  return (
    <div className={classes.default}>
      <div ref={boardRef} className={classes.board}>
        <div
          className={classes.board__grid}
          style={{
            transform: `rotateY(${mousePosition.x}deg) rotateX(${mousePosition.y}deg)`,
          }}
        >
          <div ref={innerRef} className={classes.board__grid__inner}>
            {generateGrid()}
          </div>

          <div
            className={classes.board__grid__outer}
            style={{
              transform: `translate(-50%, -50%) translateY(${mousePosition.y}px) translateX(${-mousePosition.x}px)`,
            }}
          />
        </div>

        <div
          className={classes.board__shadow}
          style={{
            transform: `translate(-50%, 10%) rotateX(${88 - 0.1 * Math.abs(mousePosition.y)}deg)`,
            width: `${100 + Math.abs(mousePosition.x)}%`,
          }}
        />
      </div>
    </div>
  );
}

export default DefaultView;
