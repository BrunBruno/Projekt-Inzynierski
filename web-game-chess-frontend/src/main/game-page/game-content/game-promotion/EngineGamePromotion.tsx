import { Dispatch, SetStateAction } from "react";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { defaultPiecesImages } from "../../../../shared/svgs/iconsMap/DefaultPieceImageSvgs";
import { PieceTag } from "../../../../shared/utils/objects/constantLists";
import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import { getPieceName, piecePromotionMap } from "../../../../shared/utils/objects/piecesNameMaps";
import classes from "./GamePromotion.module.scss";
import { SelectionAction } from "../EngineGameContentStates";
import { GetEngineGameDto } from "../../../../shared/utils/types/engineGameDtos";
import {
  EngineGameStates,
  PieceOption,
  SelectionStates,
  TypeOfGame,
} from "../../../../shared/utils/chess-game/gameSates";
import { makeMove } from "../../../../shared/utils/chess-game/makeMove";
import { GameWindowInterface } from "../../../../shared/utils/objects/interfacesEnums";

type EngineGamePromotionProps = {
  // game data
  gameData: GetEngineGameDto;
  // current game sates
  gameStates: EngineGameStates;
  // user selection states
  selectionStates: SelectionStates;
  // selection setters
  setSelectionStates: Dispatch<SelectionAction>;
  //
  getGame: () => Promise<void>;
  //
  setDisplayedWindow: Dispatch<SetStateAction<GameWindowInterface>>;
};

function EngineGamePromotion({
  gameData,
  gameStates,
  selectionStates,
  setSelectionStates,
  getGame,
  setDisplayedWindow,
}: EngineGamePromotionProps) {
  ///

  // promote pawn to chosen piece
  const onPerformPromotion = async (promotedPiece: PieceOption): Promise<void> => {
    if (selectionStates.promotionCoor) {
      await makeMove(TypeOfGame.engine, gameStates, selectionStates, selectionStates.promotionCoor, promotedPiece);

      await getGame();
    }

    setSelectionStates({ type: "SET_PROMOTION_COOR", payload: null });
    setDisplayedWindow(GameWindowInterface.none);
  };

  return (
    <div className={classes.promotion}>
      <div className={classes.promotion__pieces}>
        {/* map pieces */}
        {gameData.player.color === PieceColor.white ? (
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
        ) : gameData.player.color === PieceColor.black ? (
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

export default EngineGamePromotion;
