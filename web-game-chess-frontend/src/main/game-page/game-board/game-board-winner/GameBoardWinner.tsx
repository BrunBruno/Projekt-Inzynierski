import { useNavigate } from "react-router-dom";
import { EndGameDto, GetEndedGameDto, GetGameDto, SearchGameDto } from "../../../../shared/utils/types/gameDtos";
import classes from "./GameBoardWinner.module.scss";
import { SearchGameModel } from "../../../../shared/utils/types/gameModels";
import { gameControllerPaths, getAuthorization } from "../../../../shared/utils/services/ApiService";
import axios from "axios";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { getErrMessage } from "../../../../shared/utils/functions/displayError";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import { PieceColor } from "../../../../shared/utils/enums/entitiesEnums";

type GameBoardWinnerProps = {
  // current game data
  gameData: GetGameDto;
  // game result data data
  winner: EndGameDto | GetEndedGameDto | null;
  // to start new game search
  setSearchIds: React.Dispatch<React.SetStateAction<SearchGameDto | null>>;
  //
  selectedTiming: SearchGameModel | null;
};

function GameBoardWinner({ winner, gameData, setSearchIds, selectedTiming }: GameBoardWinnerProps) {
  ///

  const navigate = useNavigate();

  const { showPopup } = usePopup();

  // to search for new game
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
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  if (!winner) return;

  return (
    <div className={classes.winner}>
      <div className={classes.winner__content}>
        <h2
          className={`
            ${classes.title}
            ${winner.winnerColor === null ? classes["draw"] : ""}
            ${winner.winnerColor === PieceColor.white ? classes["white-winner"] : ""}
            ${winner.winnerColor === PieceColor.black ? classes["black-winner"] : ""}
          `}
        >
          {winner.winnerColor === null && <span>Draw</span>}
          {winner.winnerColor === PieceColor.white && <span>White Wins</span>}
          {winner.winnerColor === PieceColor.black && <span>Black Wins</span>}
        </h2>
        <div className={classes.winner__content__info}>
          <div className={classes.winner__content__info__players}>
            <div className={`${classes.player} ${classes["white-player"]}`}>
              <AvatarImage
                username={gameData.whitePlayer.name}
                imageUrl={gameData.whitePlayer.imageUrl}
                containerClass={classes["white-player-img"]}
                imageClass={classes["player-img"]}
              />

              <div className={classes["player-data"]}>
                <span>{gameData.whitePlayer.name}</span>
                <span>
                  (<span>{gameData.whitePlayer.elo}</span>)
                </span>
              </div>
            </div>

            <p>vs</p>

            <div className={`${classes.player} ${classes["black-player"]}`}>
              <AvatarImage
                username={gameData.blackPlayer.name}
                imageUrl={gameData.blackPlayer.imageUrl}
                containerClass={classes["black-player-img"]}
                imageClass={classes["player-img"]}
              />

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
              <span>New Game</span>
            </button>

            <button className={classes["re-game"]}>Rematch</button>
          </div>

          <div className={classes.leave}>
            <button
              onClick={() => {
                navigate("/main");
              }}
            >
              <span>Leave</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameBoardWinner;
