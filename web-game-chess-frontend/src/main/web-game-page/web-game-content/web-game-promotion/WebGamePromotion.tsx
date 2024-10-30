import { Dispatch } from "react";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { defaultPiecesImages } from "../../../../shared/svgs/iconsMap/DefaultPieceImageSvgs";
import { PieceTag } from "../../../../shared/utils/objects/constantLists";
import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import { getPieceName, piecePromotionMap } from "../../../../shared/utils/objects/piecesNameMaps";
import { GetPlayerDto } from "../../../../shared/utils/types/gameDtos";
import classes from "./WebGamePromotion.module.scss";
import { SelectionAction } from "../WebGameContentStates";
import { PieceOption, SelectionStates, WebGameStates } from "../../../../shared/utils/chess-game/types";
import { makeWebGameMove } from "../../../../shared/utils/chess-game/makeMove";

type WebGamePromotionProps = {
  // player data
  playerData: GetPlayerDto;
  // current game states
  gameStates: WebGameStates;
  // user selection states
  selectionStates: SelectionStates;
  // selection setters
  setSelectionStates: Dispatch<SelectionAction>;
};

function WebGamePromotion({ playerData, gameStates, selectionStates, setSelectionStates }: WebGamePromotionProps) {
  ///

  // promote pawn to chosen piece
  const onPerformPromotion = (promotedPiece: PieceOption): void => {
    if (selectionStates.promotionCoor) {
      makeWebGameMove(gameStates, selectionStates, selectionStates.promotionCoor, promotedPiece);
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

export default WebGamePromotion;
