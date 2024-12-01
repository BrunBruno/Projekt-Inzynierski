import { useEffect } from "react";
import classes from "./BoardLoading.module.scss";

const size = 8;
function LoadingBoard(): JSX.Element {
  ///

  useEffect(() => {
    const startPos = [0, 0];

    const animateBoard = (pos: number[]) => {
      const [x, y] = pos;
      if (x >= size || y >= size) return;

      const element = document.getElementById(`file${x}${y}`);
      if (!element) return;
      element.classList.add(classes["active"]);

      if (x === size - 1 && y === size - 1) {
        setTimeout(() => {
          element.classList.remove(classes["active"]);
        }, 100);

        setTimeout(() => {
          animateBoard([0, 0]);
        }, 1000);
        return;
      }

      setTimeout(() => {
        element.classList.remove(classes["active"]);

        animateBoard([x + 1, y]);

        if (x === 0) animateBoard([x, y + 1]);
      }, 100);
    };

    animateBoard(startPos);
  }, []);

  return (
    <div className={classes.loading}>
      <div className={classes["board"]}>
        {Array.from({ length: size }).map((_, i) => (
          <div key={`row-${i}`} className={classes["row"]}>
            {Array.from({ length: size }).map((_, j) => (
              <div key={`file-${i}${j}`} id={`file${i}${j}`} className={classes["file"]}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingBoard;
