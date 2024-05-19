import axios from "axios";
import classes from "./UserGame.module.scss";
import { GetFinishedGamesDto } from "../../../../shared/utils/types/gameDtos";
import {
  gameControllerPaths,
  getAuthorization,
} from "../../../../shared/utils/functions/apiFunctions";
import { GetFinishedGamesModel } from "../../../../shared/utils/types/gameModels";
import { useEffect, useState } from "react";
import LoadingPage from "../../../../shared/components/loading-page/LoadingPage";
import { pieceImageMap } from "../../../../shared/utils/enums/piecesMaps";
import PiecesSvgs from "../../../../shared/svgs/PiecesSvgs";

type UserGamesProps = {};

function UserGames({}: UserGamesProps) {
  const [games, setGames] = useState<GetFinishedGamesDto[] | null>(null);

  const [pageSize, setPageSize] = useState<number>(10);

  const getGames = async () => {
    const getGamesOptions: GetFinishedGamesModel = {
      pageNumber: 1,
      pageSize: pageSize,
    };

    try {
      const gamesRespones = await axios.get(
        gameControllerPaths.getFinishedGame(getGamesOptions),
        getAuthorization()
      );

      console.log(gamesRespones.data);
      setGames(gamesRespones.data.items);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getGames();
  }, []);

  // create board from game position
  const mapFromPosition = (position: string): JSX.Element => {
    const fields: JSX.Element[] = [];
    let ind: number = 0;

    for (let i = 0; i < position.length; i++) {
      const char = position[i];

      if (char == "/") {
        ind++;
        continue;
      }

      if (!isNaN(parseInt(char))) {
        for (let j = 0; j < parseInt(char); j++) {
          fields.push(
            <div
              key={ind}
              className={`${ind % 2 === 0 ? classes["light-f"] : classes["dark-f"]}`}
            ></div>
          );

          ind++;
        }
      } else {
        fields.push(
          <div
            key={ind}
            className={`${ind % 2 === 0 ? classes["light-f"] : classes["dark-f"]}`}
            style={{ backgroundImage: `url("/pieces/${pieceImageMap[char]}")` }}
          ></div>
        );
        ind++;
      }
    }

    return <div className={`${classes["mini-grid"]}`}>{fields}</div>;
  };

  if (!games) return <LoadingPage />;

  return (
    <div className={classes.games}>
      <div className={classes.games__list}>
        {games.map((game, i) => (
          <div key={`game-${i}`} className={classes.games__list__record}>
            {mapFromPosition(game.position)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserGames;
