import { useNavigate } from "react-router-dom";
import {
  EndGameDto,
  GetEndedGameDto,
  GetGameDto,
  GetOpponentDto,
  SearchWebGameDto,
} from "../../../../shared/utils/types/gameDtos";
import classes from "./WebGameWinner.module.scss";
import { CreateRematchGameModel, SearchWebGameModel } from "../../../../shared/utils/types/gameModels";
import { webGameController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import axios from "axios";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import { Dispatch, SetStateAction } from "react";
import { StateOptions } from "../../../../shared/utils/objects/interfacesEnums";
import { PlayerDto } from "../../../../shared/utils/types/abstractDtosAndModels";
import { Guid } from "guid-typescript";

type WebGameWinnerProps = {
  // game id
  gameId: Guid;
  // current game data
  gameData: GetGameDto;
  // player data
  playerData: PlayerDto;
  // game result data data
  winner: EndGameDto | GetEndedGameDto | null;
  // to start new game search
  setSearchIds: Dispatch<SetStateAction<SearchWebGameDto | null>>;
  // timing for new game or rematch
  selectedTiming: SearchWebGameModel | null;
  // rematch game id
  newGameId: Guid | null;
};

function WebGameWinner({
  gameId,
  gameData,
  playerData,
  winner,
  setSearchIds,
  selectedTiming,
  newGameId,
}: WebGameWinnerProps) {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // to search for new game
  const onSearchForGame = async (): Promise<void> => {
    if (!selectedTiming) {
      returnOnFail();
      return;
    }

    const model: SearchWebGameModel = {
      type: selectedTiming.type,
      minutes: selectedTiming.minutes,
      increment: selectedTiming.increment,
    };

    try {
      const response = await axios.post<SearchWebGameDto>(webGameController.startSearch(), model, getAuthorization());

      setSearchIds(response.data);

      await GameHubService.PlayerJoined(response.data.timingId);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  //
  const onCreateRematchRequest = async (): Promise<void> => {
    if (!selectedTiming) {
      returnOnFail();
      return;
    }

    try {
      const response = await axios.get<GetOpponentDto>(webGameController.getOpponent(gameId), getAuthorization());

      const model: CreateRematchGameModel = {
        type: selectedTiming.type,
        minutes: selectedTiming.minutes,
        increment: selectedTiming.increment,
        opponentId: response.data.opponentId,
        previousGameId: gameId,
      };

      await GameHubService.CreateRematchGame(model);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // to accept rematch
  const onAcceptRematchRequest = async () => {
    if (!newGameId) {
      returnOnFail();
      return;
    }

    try {
      await GameHubService.AcceptRematch(newGameId);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  const returnOnFail = (): void => {
    const state: StateOptions = {
      popup: { text: "ERROR STARTING GAME", type: "error" },
    };

    navigate("/main", { state: state });
  };

  // generate players schema
  const generatePlayers = (): JSX.Element => {
    if (!winner) return <></>;

    const renderPlayer = (player: PlayerDto, colorClass: string, avatarClass: string): JSX.Element => {
      return (
        <div className={`${classes.player} ${colorClass}`}>
          <AvatarImage
            username={player.name}
            profilePicture={player.profilePicture}
            containerClass={avatarClass}
            imageClass={classes["player-img"]}
          />

          <div className={classes["player-data"]}>
            <span>{player.name}</span>
            <span>
              (<span>{player.elo + winner.eloGain}</span>)
            </span>
          </div>
        </div>
      );
    };

    const wasOpponentBetter =
      gameData.whitePlayer.elo === gameData.blackPlayer.elo
        ? null
        : gameData.whitePlayer.elo < gameData.blackPlayer.elo;

    const isWinner = winner.winnerColor !== null ? (playerData.color === winner.winnerColor ? true : false) : null;

    const sign =
      isWinner === null ? (wasOpponentBetter === null ? "" : wasOpponentBetter ? "+" : "-") : isWinner ? "+" : "-";

    const eloGained = Math.abs(winner.eloGain);

    return (
      <div className={classes.winner__content__info__players}>
        {gameData.whitePlayer.name == playerData.name
          ? renderPlayer(gameData.whitePlayer, classes["white-player"], classes["white-player-img"])
          : renderPlayer(gameData.blackPlayer, classes["black-player"], classes["black-player-img"])}

        <div className={classes.vs}>
          <span>vs</span>

          <span>
            <span className={sign === "+" ? classes.p : classes.m}>{sign}</span>
            {eloGained}
          </span>
        </div>

        {gameData.whitePlayer.name == playerData.name
          ? renderPlayer(gameData.blackPlayer, classes["black-player"], classes["black-player-img"])
          : renderPlayer(gameData.whitePlayer, classes["white-player"], classes["white-player-img"])}
      </div>
    );
  };
  //*/

  if (!winner) return <></>;

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
          {generatePlayers()}

          <div className={classes.winner__content__info__buttons}>
            <button
              className={classes["new-game"]}
              onClick={() => {
                onSearchForGame();
              }}
            >
              <span>New Game</span>
            </button>

            {newGameId ? (
              <button
                className={classes["re-game"]}
                onClick={() => {
                  onAcceptRematchRequest();
                }}
              >
                <span>Accept</span>
              </button>
            ) : (
              <button
                className={classes["re-game"]}
                onClick={() => {
                  onCreateRematchRequest();
                }}
              >
                <span>Rematch</span>
              </button>
            )}
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

export default WebGameWinner;
