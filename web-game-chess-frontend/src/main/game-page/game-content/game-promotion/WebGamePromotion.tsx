import { Dispatch, SetStateAction } from "react";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { defaultPiecesImages } from "../../../../shared/svgs/iconsMap/DefaultPieceImageSvgs";
import { PieceTag } from "../../../../shared/utils/objects/constantLists";
import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import { getPieceName, piecePromotionMap } from "../../../../shared/utils/objects/piecesNameMaps";
import { GetWebGamePlayerDto } from "../../../../shared/utils/types/webGameDtos";
import classes from "./GamePromotion.module.scss";
import { SelectionAction } from "../../../game-page/game-content/WebGameContentStates";
import { PieceOption, SelectionStates, TypeOfGame, WebGameStates } from "../../../../shared/utils/chess-game/gameSates";
import { makeMove } from "../../../../shared/utils/chess-game/makeMove";
import { GameWindowInterface } from "../../../../shared/utils/objects/interfacesEnums";

type WebGamePromotionProps = {
  // player data
  playerData: GetWebGamePlayerDto;
  // current game states
  gameStates: WebGameStates;
  // user selection states
  selectionStates: SelectionStates;
  // selection setters
  setSelectionStates: Dispatch<SelectionAction>;
  //
  setDisplayedWindow: Dispatch<SetStateAction<GameWindowInterface>>;
};

function WebGamePromotion({
  playerData,
  gameStates,
  selectionStates,
  setSelectionStates,
  setDisplayedWindow,
}: WebGamePromotionProps) {
  ///

  // promote pawn to chosen piece
  const onPerformPromotion = async (promotedPiece: PieceOption): Promise<void> => {
    if (selectionStates.promotionCoor) {
      await makeMove(TypeOfGame.web, gameStates, selectionStates, selectionStates.promotionCoor, promotedPiece);
    }

    setSelectionStates({ type: "SET_PROMOTION_COOR", payload: null });
    setDisplayedWindow(GameWindowInterface.none);
  };

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
