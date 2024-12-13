import { useNavigate } from "react-router-dom";
import classes from "./GameWinner.module.scss";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import { PlayerDto } from "../../../../shared/utils/types/abstractDtosAndModels";
import { Guid } from "guid-typescript";
import {
  GetEngineGameWinnerDto,
  GetEngineGameDto,
  StartEngineGameDto,
} from "../../../../shared/utils/types/engineGameDtos";
import { useRef, MouseEvent } from "react";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";
import { greyColor } from "../../../../shared/utils/objects/colorMaps";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { StartEngineGameModel } from "../../../../shared/utils/types/engineGameModels";
import axios from "axios";
import { engineGameController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { StateOptions } from "../../../../shared/utils/objects/interfacesEnums";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import VsIcon from "../../../../shared/components/vs-icon/VsIcon";

type EngineGameWinnerProps = {
  // game id
  gameId: Guid;
  // current game data
  gameData: GetEngineGameDto;
  // game result data data
  winnerData: GetEngineGameWinnerDto | null;
};

function EngineGameWinner({ gameData, winnerData }: EngineGameWinnerProps) {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  const containerRef = useRef<HTMLDivElement>(null);

  // for game restart
  const onStartNewGame = async (): Promise<void> => {
    const model: StartEngineGameModel = {
      engineLevel: gameData.engineLevel,
    };

    try {
      const response = await axios.post<StartEngineGameDto>(
        engineGameController.startEngineGame(),
        model,
        getAuthorization()
      );

      const state: StateOptions = {
        popup: { text: "GAME STARTED", type: "info" },
      };

      navigate(`/main/engine-game/${response.data.gameId}`, { state: state });

      window.location.reload(); //???
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // generate players schema
  const generatePlayers = (): JSX.Element => {
    if (!winnerData) return <></>;

    const renderPlayer = (playerDto: PlayerDto | null, colorClass: string, avatarClass: string): JSX.Element => {
      let isBot: boolean = false;
      let player: PlayerDto | null = playerDto;
      if (!player) {
        player = {
          name: "Computer",
          profilePicture: null,
          elo: 0,
          color: gameData.player.color === PieceColor.white ? PieceColor.black : PieceColor.white,
        };

        isBot = true;
      }

      return (
        <div className={`${classes.player} ${colorClass}`}>
          <AvatarImage
            username={player.name}
            profilePicture={player.profilePicture}
            containerClass={avatarClass}
            imageClass={classes["player-img"]}
            isBot={isBot}
          />

          <div className={classes["player-data"]}>
            <span className={classes["name"]}>{player.name}</span>
            <span className={classes["elo"]}>
              (<span>{player.name === "Computer" ? `lvl ${gameData.engineLevel}` : player.elo}</span>)
            </span>
          </div>
        </div>
      );
    };

    return (
      <div className={classes.winner__content__info__players}>
        {gameData.player.color === PieceColor.white
          ? renderPlayer(gameData.player, classes["white-player"], classes["white-player-img"])
          : renderPlayer(gameData.player, classes["black-player"], classes["black-player-img"])}

        <div className={classes.vs}>
          <VsIcon iconClass={classes["vs-icon"]} />
        </div>

        {gameData.player.color === PieceColor.black
          ? renderPlayer(null, classes["white-player"], classes["white-player-img"])
          : renderPlayer(null, classes["black-player"], classes["black-player-img"])}
      </div>
    );
  };

  // to show winner window again
  const showWinner = (event: MouseEvent<HTMLDivElement>): void => {
    const target = event.target as HTMLDivElement;

    const container = containerRef.current;
    if (!container) return;

    if (container.classList.contains(classes["close"]) && target.classList.contains(classes.winner)) {
      container.classList.remove(classes["close"]);
    }
  };

  // to look at board
  const hideWinner = (): void => {
    const container = containerRef.current;
    if (!container) return;

    if (!container.classList.contains(classes["close"])) {
      container.classList.add(classes["close"]);
    }
  };

  if (!winnerData) return <></>;

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
            ${winnerData.winnerColor === null ? classes["draw"] : ""}
            ${winnerData.winnerColor === PieceColor.white ? classes["white-winner"] : ""}
            ${winnerData.winnerColor === PieceColor.black ? classes["black-winner"] : ""}
          `}
        >
          {winnerData.winnerColor === null && <span>Draw</span>}
          {winnerData.winnerColor === PieceColor.white && <span>White Wins</span>}
          {winnerData.winnerColor === PieceColor.black && <span>Black Wins</span>}

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
                onStartNewGame();
              }}
            >
              <span>New Game</span>
            </button>

            <button
              className={classes["re-game"]}
              onClick={() => {
                navigate("/main");
              }}
            >
              <span>Leave</span>
            </button>
          </div>

          <div className={classes.leave}></div>
        </div>
      </div>
    </div>
  );
}

export default EngineGameWinner;
