import { Fragment, useEffect, useState } from "react";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { BlackPieceTag, pieceTags, WhitePieceTag } from "../../../../shared/utils/objects/constantLists";
import { GetWebGameDto } from "../../../../shared/utils/types/webGameDtos";
import classes from "./GameCapturedPieces.module.scss";
import { GetEngineGameDto } from "../../../../shared/utils/types/engineGameDtos";
import { BlackCapturedPiecesRecord, WhiteCapturedPiecesRecord } from "./GameCapturedPieceData";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";
import { greyColor } from "../../../../shared/utils/objects/colorMaps";
import { specialPiecesSvgs } from "../../../../shared/svgs/iconsMap/SpecialPiecesSvgs";

type GameCapturedPiecesProps = {
  gameData: GetWebGameDto | GetEngineGameDto;
};

function GameCapturedPieces({ gameData }: GameCapturedPiecesProps) {
  ///

  // for captured piece display
  const [whiteCapturedPieces, setWhiteCapturedPieces] = useState<WhiteCapturedPiecesRecord | null>(null);
  const [blackCapturedPieces, setBlackCapturedPieces] = useState<BlackCapturedPiecesRecord | null>(null);

  // set captures
  useEffect(() => {
    const whiteCounts: WhiteCapturedPiecesRecord = { P: 0, N: 0, B: 0, R: 0, Q: 0, K: 0 };
    const blackCounts: BlackCapturedPiecesRecord = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };

    gameData.moves.forEach((move) => {
      if (move.capturedPiece) {
        const pieceType = move.capturedPiece;

        if (whiteCounts[pieceType as keyof typeof whiteCounts] !== undefined) {
          whiteCounts[pieceType as keyof typeof whiteCounts] += 1;
        }

        if (blackCounts[pieceType as keyof typeof blackCounts] !== undefined) {
          blackCounts[pieceType as keyof typeof blackCounts] += 1;
        }
      }
    });

    setWhiteCapturedPieces(whiteCounts);
    setBlackCapturedPieces(blackCounts);
  }, [gameData]);
  ///*

  if (!whiteCapturedPieces || !blackCapturedPieces) return <></>;

  return (
    <div className={classes.captures}>
      <div className={classes.captures__col}>
        {pieceTags.map((piece: (typeof pieceTags)[number], i: number) => {
          if (piece === "k") return <Fragment key={`white-captures-${i}`} />;

          return (
            <div key={`white-captures-${i}`} className={classes.piece}>
              <IconCreator
                icons={specialPiecesSvgs}
                iconName={piece}
                color={"white"}
                iconClass={classes["side-piece-icon"]}
              />
              <IconCreator icons={symbolIcons} iconName={"x"} iconClass={classes["x-icon"]} color={greyColor.c7} />
              <span>{whiteCapturedPieces[piece.toUpperCase() as WhitePieceTag] || 0}</span>
            </div>
          );
        })}
      </div>
      <div className={classes.captures__col}>
        {pieceTags.map((piece: (typeof pieceTags)[number], i: number) => {
          if (piece === "k") return <Fragment key={`black-captures-${i}`} />;

          return (
            <div key={`black-captures-${i}`} className={classes.piece}>
              <IconCreator
                icons={specialPiecesSvgs}
                iconName={piece}
                color={"black"}
                iconClass={classes["side-piece-icon"]}
              />
              <IconCreator icons={symbolIcons} iconName={"x"} iconClass={classes["x-icon"]} color={greyColor.c7} />
              <span>{blackCapturedPieces[piece.toLocaleLowerCase() as BlackPieceTag] || 0}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GameCapturedPieces;
