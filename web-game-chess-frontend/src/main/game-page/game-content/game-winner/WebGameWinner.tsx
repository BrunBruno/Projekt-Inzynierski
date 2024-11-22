import { useNavigate } from "react-router-dom";
import {
  EndWebGameDto,
  GetWebGameDto,
  GetOpponentDto,
  SearchWebGameDto,
  CreateWebGameRematchDto,
} from "../../../../shared/utils/types/webGameDtos";
import classes from "./GameWinner.module.scss";
import {
  CancelWebGameRematchModel,
  CreateWebGameRematchModel,
  SearchWebGameModel,
} from "../../../../shared/utils/types/webGameModels";
import { webGameController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import axios from "axios";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import { Dispatch, SetStateAction, useRef, MouseEvent } from "react";
import { GameWindowInterface, StateOptions } from "../../../../shared/utils/objects/interfacesEnums";
import { PlayerDto } from "../../../../shared/utils/types/abstractDtosAndModels";
import { Guid } from "guid-typescript";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";
import { greyColor } from "../../../../shared/utils/objects/colorMaps";

type WebGameWinnerProps = {
  // game and player data
  gameId: Guid;
  gameData: GetWebGameDto;
  playerData: PlayerDto;
  // game result data
  winner: EndWebGameDto | null;

  // timing for new game or rematch
  selectedTiming: SearchWebGameModel | null;
  // to start new game search
  setNewGameData: Dispatch<SetStateAction<SearchWebGameDto | null>>;
  // rematch game id
  rematchData: CreateWebGameRematchDto | null;

  // for changing dismayed window
  setDisplayedWindow: Dispatch<SetStateAction<GameWindowInterface>>;
};

function WebGameWinner({
  gameId,
  gameData,
  playerData,
  winner,
  setNewGameData,
  selectedTiming,
  rematchData,
  setDisplayedWindow,
}: WebGameWinnerProps) {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // state for hiding and showing winner window on click
  const containerRef = useRef<HTMLDivElement>(null);

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

      await GameHubService.PlayerJoined(response.data.timingId);

      setNewGameData(response.data);

      setDisplayedWindow(GameWindowInterface.search);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  //
  const onCreateRematchRequest = async (): Promise<void> => {
    if (!selectedTiming) {
      returnOnFail();
      return;
    }

    try {
      const response = await axios.get<GetOpponentDto>(webGameController.getOpponent(gameId), getAuthorization());

      const model: CreateWebGameRematchModel = {
        type: selectedTiming.type,
        minutes: selectedTiming.minutes,
        increment: selectedTiming.increment,
        opponentId: response.data.opponentId,
        previousGameId: gameId,
      };

      await GameHubService.CreateRematch(model);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to accept rematch
  const onAcceptRematchRequest = async () => {
    if (!rematchData) {
      returnOnFail();
      return;
    }

    try {
      await GameHubService.AcceptRematch(rematchData.gameId);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to remove created rematch game
  const onCancelRematchRequest = async (): Promise<void> => {
    if (!rematchData) return;

    const model: CancelWebGameRematchModel = {
      currentGameId: gameId,
      newGameId: rematchData.gameId,
    };

    try {
      await GameHubService.CancelRematch(model);

      await axios.delete(webGameController.cancelPrivateGame(rematchData.gameId), getAuthorization());
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // return to main if something went wrong
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
            <span className={classes["name"]}>{player.name}</span>
            <span className={classes["elo"]}>
              (<span>{player.elo}</span>)
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

  // to display winner window again
  const showWinner = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;

    const container = containerRef.current;
    if (!container) return;

    if (container.classList.contains(classes["close"]) && target.classList.contains(classes.winner)) {
      container.classList.remove(classes["close"]);
    }
  };

  // to look at board after game has ended
  const hideWinner = (): void => {
    const container = containerRef.current;
    if (!container) return;

    if (!container.classList.contains(classes["close"])) {
      container.classList.add(classes["close"]);
    }
  };

  if (!winner) return <></>;

  return (
    <div
      ref={containerRef}
      className={classes.winner}
      onClick={(event) => {
        showWinner(event);
      }}
    >
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

          <div
            className={classes["x"]}
            onClick={() => {
              hideWinner();
            }}
          >
            <IconCreator icons={symbolIcons} iconName={"x"} iconClass={classes["x-icon"]} color={greyColor.c9} />
          </div>
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

            {!rematchData ? (
              <button
                className={classes["re-game"]}
                onClick={() => {
                  onCreateRematchRequest();
                }}
              >
                <span>Rematch</span>
              </button>
            ) : rematchData.opponentName === playerData.name ? (
              <button
                className={classes["re-game"]}
                onClick={() => {
                  onAcceptRematchRequest();
                }}
              >
                <span>Accept</span>
              </button>
            ) : rematchData.opponentName !== playerData.name ? (
              <button
                className={classes["re-game"]}
                onClick={() => {
                  onCancelRematchRequest();
                }}
              >
                <span>Cancel</span>
              </button>
            ) : (
              <button
                className={classes["re-game"]}
                onClick={() => {
                  navigate("/main");
                }}
              >
                <span>Leave</span>
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
