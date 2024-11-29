import { useEffect, useRef, useState } from "react";
import {
  FetchTimeDto,
  GetWebGameDto,
  GetWebGamePlayerDto,
  GetWebGameWinnerDto,
} from "../../../shared/utils/types/webGameDtos";
import classes from "./GameRightSidebar.module.scss";
import { AppearanceOfGamePage, PieceColor } from "../../../shared/utils/objects/entitiesEnums";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";
import { Guid } from "guid-typescript";
import { MoveDto, PlayerDto } from "../../../shared/utils/types/abstractDtosAndModels";
import WebGameMoveRecord from "./game-move-record/WebGameMoveRecord";
import WebGameMessages from "./game-messages/WebGameMessages";
import { pieceTagMap } from "../../../shared/utils/objects/piecesNameMaps";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { greyColor } from "../../../shared/utils/objects/colorMaps";
import { ElementClass, StateProp } from "../../../shared/utils/types/commonTypes";
import { GameWindowInterface } from "../../../shared/utils/objects/interfacesEnums";
import GameClock from "./game-clock/GameClock";
import { symbolIcons } from "../../../shared/svgs/iconsMap/SymbolIcons";
import { taskDelay } from "../../../shared/utils/functions/events";
import { gameRightSidebarIcons } from "./GameRightSidebarIcons";
import { changePiecesByUserSettings } from "../../../shared/utils/chess-game/boardVisualization";

type WebGameRightSidebarProps = {
  // game and player data
  gameId: Guid;
  gameData: GetWebGameDto;
  playerData: GetWebGamePlayerDto;
  // winner data
  winnerData: GetWebGameWinnerDto | null;
  // times left for players
  playersTimes: FetchTimeDto | null;
  // to set previous position
  historyPositionState: StateProp<MoveDto | null>;
  // for showing history view
  displayedWindowState: StateProp<GameWindowInterface>;
};

function WebGameRightSidebar({
  gameId,
  gameData,
  playerData,
  winnerData,
  playersTimes,
  historyPositionState,
  displayedWindowState,
}: WebGameRightSidebarProps) {
  ///

  // for handling scroll of records
  const recordsRef = useRef<HTMLDivElement>(null);

  // for pieces advantage display
  const [playersAdvantage, setPlayersAdvantage] = useState<number>(0);
  const [playersAdvantageInPieces, setPlayersAdvantageInPieces] = useState<JSX.Element[]>([]);
  const [whiteMaterial, setWhiteMaterial] = useState<number | null>(null);
  const [blackMaterial, setBlackMaterial] = useState<number | null>(null);

  // move index to records buttons
  const [currentHistoryMoveIndex, setCurrentHistoryMoveIndex] = useState<number | null>(null);
  // is the whole history playing
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // to show advantage in pieces
  const calculateAdvantage = () => {
    let whitePoints: number = 0;
    let blackPoints: number = 0;

    for (let i = 0; i < gameData.position.length; i++) {
      const piece = gameData.position.charAt(i);

      if (piece === pieceTagMap.white.pawn) whitePoints += 1;
      if (piece === pieceTagMap.white.knight || piece === pieceTagMap.white.bishop) whitePoints += 3;
      if (piece === pieceTagMap.white.rook) whitePoints += 5;
      if (piece === pieceTagMap.white.queen) whitePoints += 9;

      if (piece === pieceTagMap.black.pawn) blackPoints += 1;
      if (piece === pieceTagMap.black.knight || piece === pieceTagMap.black.bishop) blackPoints += 3;
      if (piece === pieceTagMap.black.rook) blackPoints += 5;
      if (piece === pieceTagMap.black.queen) blackPoints += 9;
    }

    const advantage = whitePoints - blackPoints;

    setWhiteMaterial(whitePoints);
    setBlackMaterial(blackPoints);
    setPlayersAdvantage(advantage);
  };

  useEffect(() => {
    const countInPieceValue = (num: number): JSX.Element[] => {
      const piecesAdvantage: JSX.Element[] = [];

      let remainingValue: number;

      let count9 = Math.floor(num / 9);
      remainingValue = num - count9 * 9;

      let count5 = Math.floor(remainingValue / 5);
      remainingValue = remainingValue - count5 * 5;

      let count3 = Math.floor(remainingValue / 3);
      remainingValue = remainingValue - count3 * 3;

      let count1 = remainingValue;

      for (let i = 0; i < count9; i++)
        piecesAdvantage.push(
          <IconCreator
            key={`q${i}`}
            icons={changePiecesByUserSettings(gameData.gameSettings.appearanceOfPieces)}
            iconName={"q"}
            iconClass={classes["advantage-icon"]}
            color={greyColor.c7}
          />
        );
      for (let i = 0; i < count5; i++)
        piecesAdvantage.push(
          <IconCreator
            key={`r${i}`}
            icons={changePiecesByUserSettings(gameData.gameSettings.appearanceOfPieces)}
            iconName={"r"}
            iconClass={classes["advantage-icon"]}
            color={greyColor.c7}
          />
        );
      for (let i = 0; i < count3; i++)
        piecesAdvantage.push(
          <IconCreator
            key={`n${i}`}
            icons={changePiecesByUserSettings(gameData.gameSettings.appearanceOfPieces)}
            iconName={"n"}
            iconClass={classes["advantage-icon"]}
            color={greyColor.c7}
          />
        );
      for (let i = 0; i < count1; i++)
        piecesAdvantage.push(
          <IconCreator
            key={`p${i}`}
            icons={changePiecesByUserSettings(gameData.gameSettings.appearanceOfPieces)}
            iconName={"p"}
            iconClass={classes["advantage-icon"]}
            color={greyColor.c7}
          />
        );

      return piecesAdvantage;
    };

    const absValue: number = Math.abs(playersAdvantage);
    setPlayersAdvantageInPieces(countInPieceValue(absValue));
  }, [playersAdvantage]);

  useEffect(() => {
    calculateAdvantage();
  }, [gameData]);

  // for players display
  const renderPlayer = (player: PlayerDto, colorClass: ElementClass, avatarClass: ElementClass): JSX.Element => {
    return (
      <div className={`${classes.bar__content__header__player} ${colorClass}`}>
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
          <span className={classes["advantage"]}>
            {player.color === PieceColor.white && playersAdvantage > 0 ? (
              playersAdvantageInPieces
            ) : player.color === PieceColor.black && playersAdvantage < 0 ? (
              playersAdvantageInPieces
            ) : (
              <span />
            )}
          </span>
        </div>
      </div>
    );
  };

  // to show previous poison on button click
  const displayPreviousPositions = (move: MoveDto): void => {
    if (
      displayedWindowState.get !== GameWindowInterface.none &&
      displayedWindowState.get !== GameWindowInterface.winner &&
      displayedWindowState.get !== GameWindowInterface.history
    ) {
      return;
    }

    if (historyPositionState) {
      historyPositionState.set(move);
      displayedWindowState.set(GameWindowInterface.history);
    }
  };

  useEffect(() => {
    if (currentHistoryMoveIndex === null) return;

    displayPreviousPositions(gameData.moves[currentHistoryMoveIndex]);
  }, [currentHistoryMoveIndex]);

  const changeHistoryMove = (increase: boolean) => {
    setCurrentHistoryMoveIndex((prev) => {
      if (prev === null) return increase ? gameData.moves.length - 1 : gameData.moves.length - 2;
      if (increase && prev + 1 > gameData.moves.length - 1) return gameData.moves.length - 1;
      if (!increase && prev - 1 < 0) return 0;

      return increase ? prev + 1 : prev - 1;
    });
  };

  // to return to default view
  const closeHistory = (): void => {
    if (displayedWindowState.get !== GameWindowInterface.history) return;
    if (isPlaying) return;

    setCurrentHistoryMoveIndex(null);

    historyPositionState.set(null);

    if (winnerData) displayedWindowState.set(GameWindowInterface.winner);
    else displayedWindowState.set(GameWindowInterface.none);
  };

  // to show how game went
  const playWholeGame = async (): Promise<void> => {
    if (!gameData.hasEnded) return;

    setIsPlaying(true);

    for (const move of gameData.moves) {
      displayPreviousPositions(move);
      await taskDelay(500);
    }

    setIsPlaying(false);
    displayedWindowState.set(GameWindowInterface.winner);
  };

  // to handle record scroll
  useEffect(() => {
    const handleRecordsScroll = (): void => {
      const records = recordsRef.current;

      if (records) {
        records.scrollTop = records.scrollHeight;
      }
    };

    handleRecordsScroll();
  }, [gameData]);

  return (
    <section
      className={`
        ${classes.bar}
        ${gameData.gameSettings.appearanceOfGamePage === AppearanceOfGamePage.Simple ? classes["simple-view"] : ""}
     `}
    >
      <div
        className={`
          ${classes.bar__content} 
          ${!gameData.timingType ? classes["null-timing"] : ""}
        `}
      >
        {/* players data */}
        <div className={classes.bar__content__header}>
          {gameData.whitePlayer.name == playerData.name
            ? renderPlayer(gameData.whitePlayer, classes["white-player"], classes["white-player-img"])
            : renderPlayer(gameData.blackPlayer, classes["black-player"], classes["black-player-img"])}

          <p className={classes.vs}>vs</p>

          {gameData.whitePlayer.name == playerData.name
            ? renderPlayer(gameData.blackPlayer, classes["black-player"], classes["black-player-img"])
            : renderPlayer(gameData.whitePlayer, classes["white-player"], classes["white-player-img"])}
        </div>

        {/* game clock */}
        {!playersTimes ? (
          <div className={classes["fetching"]}>Fetching time...</div>
        ) : (
          <GameClock
            gameId={gameId}
            gameData={gameData}
            playerData={playerData}
            playersTimes={playersTimes}
            whiteMaterial={whiteMaterial}
            blackMaterial={blackMaterial}
          />
        )}

        {/* game history records */}
        <div
          ref={recordsRef}
          className={`
            ${classes["bar-block"]} 
            ${classes["records-block"]} 
            ${gameData.moves.length === 0 ? classes["empty"] : ""}
          `}
          onMouseLeave={() => {
            closeHistory();
          }}
        >
          <div className={classes["bar-list"]}>
            <div className={classes["records"]}>
              {gameData.moves.length > 0
                ? gameData.moves.map((move: MoveDto, i: number) => (
                    <WebGameMoveRecord
                      key={`move-record-${i}-${move.fenMove}${move.position}`}
                      recordNum={i}
                      move={move}
                      historyPositionState={historyPositionState}
                      displayedWindowState={displayedWindowState}
                      gameData={gameData}
                    />
                  ))
                : Array.from({ length: 10 }).map((_, i: number) => (
                    <WebGameMoveRecord key={i} recordNum={i} move={null} displayedWindowState={displayedWindowState} />
                  ))}
            </div>

            <div className={classes["records-buttons"]}>
              <div
                className={classes["record-button"]}
                onClick={() => {
                  displayPreviousPositions(gameData.moves[0]);
                }}
              >
                <IconCreator icons={symbolIcons} iconName="arrow" iconClass={classes["arrow"]} color={greyColor.c2} />
                <IconCreator icons={symbolIcons} iconName="arrow" iconClass={classes["arrow"]} color={greyColor.c2} />
              </div>
              <div
                className={classes["record-button"]}
                onClick={() => {
                  changeHistoryMove(false);
                }}
              >
                <IconCreator icons={symbolIcons} iconName="arrow" iconClass={classes["arrow"]} color={greyColor.c2} />
              </div>

              {winnerData && (
                <div
                  className={classes["record-button"]}
                  onClick={() => {
                    playWholeGame();
                  }}
                >
                  <IconCreator
                    icons={gameRightSidebarIcons}
                    iconName={"play"}
                    iconClass={classes["play"]}
                    color={greyColor.c2}
                  />
                </div>
              )}

              <div
                className={classes["record-button"]}
                onClick={() => {
                  changeHistoryMove(true);
                }}
              >
                <IconCreator icons={symbolIcons} iconName="arrow" iconClass={classes["arrow"]} color={greyColor.c2} />
              </div>
              <div
                className={classes["record-button"]}
                onClick={() => {
                  displayPreviousPositions(gameData.moves[gameData.moves.length - 1]);
                }}
              >
                <IconCreator icons={symbolIcons} iconName="arrow" iconClass={classes["arrow"]} color={greyColor.c2} />
                <IconCreator icons={symbolIcons} iconName="arrow" iconClass={classes["arrow"]} color={greyColor.c2} />
              </div>
            </div>
          </div>
        </div>

        {/* game messenger */}
        <div className={`${classes["bar-block"]} ${classes["messages-block"]}`}>
          <WebGameMessages gameId={gameId} playerData={playerData} winnerData={winnerData} />
        </div>
      </div>
    </section>
  );
}

export default WebGameRightSidebar;
