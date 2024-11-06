import { RefObject, useEffect, useRef, useState } from "react";
import classes from "./BackgroundBoard.module.scss";
import { MousePosition } from "../../../../shared/utils/types/commonTypes";

let timer: NodeJS.Timeout;

type BackgroundBoardProps = {
  defaultViewRef: RefObject<HTMLDivElement>;
};

function BackgroundBoard({ defaultViewRef }: BackgroundBoardProps) {
  ///

  // inner board ref
  const innerRef = useRef<HTMLDivElement>(null);

  // mouse position state
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  // to handle mouse movement and map to board movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const defElement = defaultViewRef.current;

      if (defElement) {
        const maxDeg = 20;

        const defRec = defElement.getBoundingClientRect();
        const def05W = defRec.width / 2;
        const def05H = defRec.height / 2;

        let newX: number = (maxDeg / def05W) * event.clientX - maxDeg;
        let newY: number = -(maxDeg / def05H) * event.clientY + maxDeg;
        newX = Math.abs(newX) < 20 ? newX : newX < 0 ? -20 : 20;
        newY = Math.abs(newY) < 20 ? newY : newY < 0 ? -20 : 20;

        setMousePosition({ x: newX, y: newY });

        // set highlight
        const innerBoard = innerRef.current;
        if (innerBoard) {
          innerBoard.classList.add(classes.active);
          clearTimeout(timer);

          timer = setTimeout(() => {
            innerBoard.classList.remove(classes.active);
          }, 100);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [defaultViewRef]);
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
    <div className={classes.board}>
      <div
        className={classes.board__grid}
        style={{
          transform: `
                rotateY(${mousePosition.x}deg)
                rotateX(${mousePosition.y}deg)
              `,
        }}
      >
        <div ref={innerRef} className={classes.board__grid__inner}>
          {generateGrid()}
        </div>

        <div
          className={classes.board__grid__outer}
          style={{
            transform: `
                  translate(-50%, -50%)
                  translateY(${mousePosition.y}px)
                  translateX(${-mousePosition.x}px)
                `,
          }}
        />
      </div>

      <div
        className={classes.board__shadow}
        style={{
          transform: `
                translate(-50%, 10%)
                rotateX(${88 - 0.1 * Math.abs(mousePosition.y)}deg)
              `,
          width: `
                ${100 + Math.abs(mousePosition.x)}%
              `,
        }}
      />
    </div>
  );
}

export default BackgroundBoard;
