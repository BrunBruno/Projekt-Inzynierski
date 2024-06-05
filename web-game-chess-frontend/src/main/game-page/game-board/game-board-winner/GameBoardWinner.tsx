import { useNavigate } from "react-router-dom";
import AvatarSvg from "../../../../shared/svgs/AvatarSvg";
import { pieceColor } from "../../../../shared/utils/enums/entitiesEnums";
import {
  EndGameDto,
  GetGameDto,
  SearchGameDto,
} from "../../../../shared/utils/types/gameDtos";
import classes from "./GameBoardWinner.module.scss";
import { SearchGameModel } from "../../../../shared/utils/types/gameModels";
import {
  gameControllerPaths,
  getAuthorization,
} from "../../../../shared/utils/functions/apiFunctions";
import axios from "axios";
import GameHubService from "../../../../shared/utils/services/GameHubService";

type GameBoardWinnerProps = {
  gameData: GetGameDto;
  winner: EndGameDto | null;
  setSearchIds: React.Dispatch<React.SetStateAction<SearchGameDto | null>>;
  selectedTiming: SearchGameModel | null;
};

function GameBoardWinner({
  winner,
  gameData,
  setSearchIds,
  selectedTiming,
}: GameBoardWinnerProps) {
  const navigate = useNavigate();

  if (!winner) return;

  const onSearchForGame = async () => {
    if (selectedTiming === null) return;

    const gameType: SearchGameModel = selectedTiming;

    try {
      const searchGameResponse = await axios.post<SearchGameDto>(
        gameControllerPaths.startSearch(),
        gameType,
        getAuthorization()
      );

      setSearchIds(searchGameResponse.data);

      GameHubService.PlayerJoined(searchGameResponse.data.timingId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.winner}>
      <div className={classes.winner__content}>
        <h2
          className={`
            ${classes.title}
            ${winner.winnerColor === null ? classes["draw"] : ""}
            ${
              winner.winnerColor === pieceColor.white
                ? classes["white-winner"]
                : ""
            }
            ${
              winner.winnerColor === pieceColor.black
                ? classes["black-winner"]
                : ""
            }
          `}
        >
          {winner.winnerColor === null && <span>Draw</span>}
          {winner.winnerColor === pieceColor.white && <span>White Wins</span>}
          {winner.winnerColor === pieceColor.black && <span>Black Wins</span>}
        </h2>
        <div className={classes.winner__content__info}>
          <div className={classes.winner__content__info__players}>
            <div className={`${classes.player} ${classes["white-player"]}`}>
              <div className={classes["white-player-img"]}>
                {gameData.whitePlayer.imageUrl ? (
                  <img
                    className={classes["player-img"]}
                    src={gameData.whitePlayer.imageUrl}
                    alt="white-player-avatar"
                  />
                ) : (
                  <AvatarSvg iconClass={classes.avatar} />
                )}
              </div>
              <div className={classes["player-data"]}>
                <span>{gameData.whitePlayer.name}</span>
                <span>
                  (<span>{gameData.whitePlayer.elo}</span>)
                </span>
              </div>
            </div>
            <p>vs</p>
            <div className={`${classes.player} ${classes["black-player"]}`}>
              <div className={classes["black-player-img"]}>
                {gameData.blackPlayer.imageUrl ? (
                  <img
                    className={classes["player-img"]}
                    src={gameData.blackPlayer.imageUrl}
                    alt="black-player-avatar"
                  />
                ) : (
                  <AvatarSvg iconClass={classes.avatar} />
                )}
              </div>
              <div className={classes["player-data"]}>
                <span>{gameData.blackPlayer.name}</span>
                <span>
                  (<span>{gameData.blackPlayer.elo}</span>)
                </span>
              </div>
            </div>
          </div>

          <div className={classes.winner__content__info__buttons}>
            <button
              className={classes["new-game"]}
              onClick={() => {
                onSearchForGame();
              }}
            >
              New Game
            </button>
            <button className={classes["re-game"]}>Remach</button>
          </div>

          <div className={classes.leave}>
            <button
              onClick={() => {
                navigate("/main");
              }}
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameBoardWinner;
