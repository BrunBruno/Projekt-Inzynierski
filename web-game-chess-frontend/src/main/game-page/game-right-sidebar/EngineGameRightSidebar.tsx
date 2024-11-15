import classes from "./GameRightSidebar.module.scss";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";
import { MoveDto, PlayerDto } from "../../../shared/utils/types/abstractDtosAndModels";
import { GetEngineGameDto } from "../../../shared/utils/types/engineDtos";
import { AppearanceOfGamePage, PieceColor } from "../../../shared/utils/objects/entitiesEnums";
import EngineGameMoveRecord from "./game-move-record/EngineGameMoveRecord";
import EngineGameMessages from "./game-messages/EngineGameMessages";
import { Guid } from "guid-typescript";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { pieceTagMap } from "../../../shared/utils/objects/piecesNameMaps";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { specialPiecesSvgs } from "../../../shared/svgs/iconsMap/SpecialPiecesSvgs";
import { greyColor } from "../../../shared/utils/objects/colorMaps";
import { ElementClass, StateProp } from "../../../shared/utils/types/commonTypes";
import { GameWindowInterface } from "../../../shared/utils/objects/interfacesEnums";

type EngineGameRightSidebarProps = {
  // game data
  gameId: Guid;
  gameData: GetEngineGameDto;
  // to set previous position
  historyPositionState: StateProp<MoveDto | null>;
  // for showing history view
  displayedWindowState: StateProp<GameWindowInterface>;
};

function EngineGameRightSidebar({
  gameId,
  gameData,
  historyPositionState,
  displayedWindowState,
}: EngineGameRightSidebarProps) {
  ///

  // for handling scroll of records
  const recordsRef = useRef<HTMLDivElement>(null);

  // for pieces advantage display
  const [playersAdvantage, setPlayersAdvantage] = useState<number>(0);
  const [playersAdvantageInPieces, setPlayersAdvantageInPieces] = useState<JSX.Element[]>([]);

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
            icons={specialPiecesSvgs}
            iconName={"q"}
            iconClass={classes["advantage-icon"]}
            color={greyColor.c7}
          />
        );
      for (let i = 0; i < count5; i++)
        piecesAdvantage.push(
          <IconCreator
            key={`r${i}`}
            icons={specialPiecesSvgs}
            iconName={"r"}
            iconClass={classes["advantage-icon"]}
            color={greyColor.c7}
          />
        );
      for (let i = 0; i < count3; i++)
        piecesAdvantage.push(
          <IconCreator
            key={`n${i}`}
            icons={specialPiecesSvgs}
            iconName={"n"}
            iconClass={classes["advantage-icon"]}
            color={greyColor.c7}
          />
        );
      for (let i = 0; i < count1; i++)
        piecesAdvantage.push(
          <IconCreator
            key={`p${i}`}
            icons={specialPiecesSvgs}
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
  //*/

  // for players display
  const renderPlayer = (
    playerDto: PlayerDto | null,
    colorClass: ElementClass,
    avatarClass: ElementClass
  ): JSX.Element => {
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
      <div className={`${classes.bar__content__header__player} ${colorClass}`}>
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
  //*/

  // to return to default view
  const closeHistory = (): void => {
    if (displayedWindowState.get !== GameWindowInterface.history) return;

    historyPositionState.set(null);
    displayedWindowState.set(GameWindowInterface.none);
  };
  //*/

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
  //*/

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
          {gameData.player.color === PieceColor.white
            ? renderPlayer(gameData.player, classes["white-player"], classes["white-player-img"])
            : renderPlayer(gameData.player, classes["black-player"], classes["black-player-img"])}

          <p className={classes.vs}>
            <span>vs</span>
          </p>

          {gameData.player.color === PieceColor.black
            ? renderPlayer(null, classes["white-player"], classes["white-player-img"])
            : renderPlayer(null, classes["black-player"], classes["black-player-img"])}
        </div>
        {/* --- */}

        {/* game clock */}
        {!gameData.timingType ? (
          <></>
        ) : null === null ? (
          <div className={classes["fetching"]}>Fetching time...</div>
        ) : (
          // <EngineGameClock
          //   gameData={gameData}
          //   whitePlayerSeconds={playersTimes.whiteTimeLeft}
          //   blackPlayerSeconds={playersTimes.blackTimeLeft}
          // />
          <></>
        )}
        {/* --- */}

        {/* game history records */}
        <div
          ref={recordsRef}
          className={`${classes["bar-block"]} ${classes["records-block"]}`}
          onMouseLeave={() => {
            closeHistory();
          }}
        >
          <div className={classes["bar-list"]}>
            {gameData.moves.length > 0
              ? gameData.moves.map((move: MoveDto, i: number) => (
                  <EngineGameMoveRecord
                    key={`move-record-${i}`}
                    recordNum={i}
                    move={move}
                    historyPositionState={historyPositionState}
                    displayedWindowState={displayedWindowState}
                  />
                ))
              : Array.from({ length: 10 }).map((_, i: number) => (
                  <EngineGameMoveRecord key={i} recordNum={i} move={null} displayedWindowState={displayedWindowState} />
                ))}
          </div>
        </div>
        {/* --- */}

        {/* game messages */}
        <div className={`${classes["bar-block"]} ${classes["messages-block"]}`}>
          <EngineGameMessages gameId={gameId} />
        </div>
        {/* --- */}
      </div>
    </section>
  );
}

export default EngineGameRightSidebar;
