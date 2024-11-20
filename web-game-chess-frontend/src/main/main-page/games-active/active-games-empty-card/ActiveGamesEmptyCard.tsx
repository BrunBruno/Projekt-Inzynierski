import { useEffect, useRef } from "react";
import classes from "./ActiveGamesEmptyCard.module.scss";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";

type ActiveGamesEmptyCardProps = {};

function ActiveGamesEmptyCard({}: ActiveGamesEmptyCardProps) {
  ///

  // elements ref for card resizing
  const cardRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);

  // updates card size on resize
  useEffect(() => {
    const resizeCard = (): void => {
      const card = cardRef.current;
      const grid = gridRef.current;
      const data = dataRef.current;

      if (card && grid && data) {
        card.style.height = `${card.clientWidth + data.clientHeight}px`;
        grid.style.height = `${grid.clientWidth}px`;
      }
    };

    window.addEventListener("resize", resizeCard);
    resizeCard();

    return () => {
      window.removeEventListener("resize", resizeCard);
    };
  }, []);

  // create board from game position
  const mapFromPosition = (): JSX.Element[] => {
    const fields: JSX.Element[] = [];

    for (let i = 0; i < 64; i++) {
      const alternate = (i % 2 === 0 && Math.floor(i / 8) % 2 === 1) || (i % 2 === 1 && Math.floor(i / 8) % 2 === 0);

      fields.push(<div key={i} className={`${alternate ? classes["light-f"] : classes["dark-f"]}`} />);
    }

    return fields;
  };

  return (
    <div ref={cardRef} className={classes.card}>
      <div ref={gridRef} className={`${classes["mini-grid"]}`}>
        {mapFromPosition()}

        <div className={classes.players}>
          <div className={classes.player}>
            <AvatarImage
              username={""}
              profilePicture={null}
              containerClass={classes["white-player-img"]}
              imageClass={classes["player-img"]}
            />
          </div>

          <div className={classes.players__sep}>
            <span>vs</span>
          </div>

          <div className={classes.player}>
            <AvatarImage
              username={""}
              profilePicture={null}
              containerClass={classes["black-player-img"]}
              imageClass={classes["player-img"]}
            />
          </div>
        </div>
      </div>

      <div ref={dataRef} className={classes["game-data"]}></div>
    </div>
  );
}

export default ActiveGamesEmptyCard;
