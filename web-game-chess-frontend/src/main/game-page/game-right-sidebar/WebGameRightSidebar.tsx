import { useEffect, useState } from "react";
import {
  EndGameDto,
  FetchTimeDto,
  GetEndedGameDto,
  GetWebGameDto,
  GetPlayerDto,
} from "../../../shared/utils/types/gameDtos";
import classes from "./GameRightSidebar.module.scss";
import { PieceColor } from "../../../shared/utils/objects/entitiesEnums";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";
import { Guid } from "guid-typescript";
import { MoveDto, PlayerDto } from "../../../shared/utils/types/abstractDtosAndModels";
import WebGameClock from "./game-clock/WebGameClock";
import WebGameMoveRecord from "./game-move-record/WebGameMoveRecord";
import WebGameMessages from "./game-messages/WebGameMessages";
import { pieceTagMap } from "../../../shared/utils/objects/piecesNameMaps";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { greyColor } from "../../../shared/utils/objects/colorMaps";
import { specialPiecesSvgs } from "../../../shared/svgs/iconsMap/SpecialPiecesSvgs";
import { ElementClass } from "../../../shared/utils/types/commonTypes";

type WebGameRightSidebarProps = {
  // game id
  gameId: Guid;
  // game data
  gameData: GetWebGameDto;
  // player data
  playerData: GetPlayerDto;
  // times left for players
  playersTimes: FetchTimeDto | null;
  // winner dto of the game
  winner: EndGameDto | GetEndedGameDto | null;
};

function WebGameRightSidebar({ gameId, gameData, playerData, playersTimes, winner }: WebGameRightSidebarProps) {
  ///

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
  //*/

  return (
    <section className={classes.bar}>
      <div className={classes.bar__content}>
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
        {/* --- */}

        {/* game clock */}
        {!playersTimes ? (
          <div className={classes["fetching"]}>Fetching time...</div>
        ) : (
          <WebGameClock
            gameId={gameId}
            gameData={gameData}
            playerData={playerData}
            playersTimes={playersTimes}
            winner={winner}
          />
        )}
        {/* --- */}

        {/* game history records */}
        <div className={classes.bar__content__block}>
          <div className={classes.bar__content__block__list}>
            {gameData.moves.length > 0
              ? gameData.moves.map((move: MoveDto, i: number) => (
                  <WebGameMoveRecord key={i} recordNum={i} move={move} />
                ))
              : Array.from({ length: 10 }).map((_, i: number) => (
                  <WebGameMoveRecord key={i} recordNum={i} move={null} />
                ))}
          </div>
        </div>
        {/* --- */}

        {/* game messenger */}
        <div className={classes.bar__content__block}>
          <WebGameMessages gameId={gameId} playerData={playerData} />
        </div>
        {/* --- */}
      </div>
    </section>
  );
}

export default WebGameRightSidebar;
