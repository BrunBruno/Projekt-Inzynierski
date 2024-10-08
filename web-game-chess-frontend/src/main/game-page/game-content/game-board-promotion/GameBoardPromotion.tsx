import { Dispatch } from "react";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { defaultPiecesImages } from "../../../../shared/svgs/iconsMap/DefaultPieceImageSvgs";
import { PieceTag } from "../../../../shared/utils/objects/constantLists";
import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import { getPieceName, piecePromotionMap } from "../../../../shared/utils/objects/piecesNameMaps";
import { GetPlayerDto } from "../../../../shared/utils/types/gameDtos";
import { GameStates, PieceOption, SelectionStates } from "../../game-page-functions/types";
import classes from "./GameBoardPromotion.module.scss";
import { SelectionAction } from "../GameContentStates";
import { makeMove } from "../../game-page-functions/makeMove";

type GameBoardPromotionProps = {
  // player data
  playerData: GetPlayerDto;
  //
  gameStates: GameStates;
  //
  selectionStates: SelectionStates;
  //
  setSelectionStates: Dispatch<SelectionAction>;
};

function GameBoardPromotion({ playerData, gameStates, selectionStates, setSelectionStates }: GameBoardPromotionProps) {
  ///

  // promote pawn to chosen piece
  const onPerformPromotion = (promotedPiece: PieceOption): void => {
    if (selectionStates.promotionCoor) {
      makeMove(gameStates, selectionStates, selectionStates.promotionCoor, promotedPiece);
    }

    setSelectionStates({ type: "SET_PROMOTION_COOR", payload: null });
  };
  //*/

  return (
    <div className={classes.promotion}>
      <div className={classes.promotion__pieces}>
        {/* map pieces */}
        {playerData.color === PieceColor.white ? (
          piecePromotionMap.white.map((piece, i) => (
            <div
              key={`promotion-${i}`}
              className={classes.piece}
              onClick={() => {
                onPerformPromotion(piece);
              }}
            >
              <IconCreator
                icons={defaultPiecesImages}
                iconName={piece.toLowerCase() as PieceTag}
                iconClass={classes["promoted-pawn-svg"]}
                color="white"
              />

              <span className={classes["indicator"]}>{getPieceName(piece as PieceTag)}</span>
            </div>
          ))
        ) : playerData.color === PieceColor.black ? (
          piecePromotionMap.black.map((piece, i) => (
            <div
              key={`promotion-${i}`}
              className={classes.piece}
              onClick={() => {
                onPerformPromotion(piece);
              }}
            >
              <IconCreator
                icons={defaultPiecesImages}
                iconName={piece.toLowerCase() as PieceTag}
                iconClass={classes["promoted-pawn-svg"]}
                color="black"
              />

              <span className={classes["indicator"]}>{getPieceName(piece)}</span>
            </div>
          ))
        ) : (
          <></>
        )}
        {/* --- */}
      </div>
    </div>
  );
}

export default GameBoardPromotion;
