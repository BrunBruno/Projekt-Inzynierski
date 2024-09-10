import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { defaultPiecesImages } from "../../../../shared/svgs/iconsMap/DefaultPieceImageSvgs";
import { PieceColor } from "../../../../shared/utils/enums/entitiesEnums";
import { getPieceName, piecePromotionMap } from "../../../../shared/utils/enums/piecesMaps";
import { GetPlayerDto } from "../../../../shared/utils/types/gameDtos";
import classes from "./GameBoardPromotion.module.scss";

type GameBoardPromotionProps = {
  // player data
  playerData: GetPlayerDto;
  // to perform pawn promotion by promoted piece code
  onPerformPromotion: (promotedPiece: string) => void;
};

function GameBoardPromotion({ playerData, onPerformPromotion }: GameBoardPromotionProps) {
  ///

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
                iconName={piece.toLowerCase()}
                iconClass={classes["promoted-pawn-svg"]}
                color="white"
              />

              <span className={classes["indicator"]}>{getPieceName(piece)}</span>
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
                iconName={piece.toLowerCase()}
                iconClass={classes["promoted-pawn-svg"]}
                color="black"
              />

              <span className={classes["indicator"]}>{getPieceName(piece)}</span>
            </div>
          ))
        ) : (
          <>x</>
        )}
        {/* --- */}
      </div>
    </div>
  );
}

export default GameBoardPromotion;
